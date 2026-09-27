import pool from '../db.js'
import {
    generateMonthlyInsight,
    generateBudgetAlert,
    generateSavingTips
} from '../utils/groq.js'

const getUserCurrency = async  (userId) => {
    const result = await pool.query (
        'SELECT currency FROM  users WHERE id = $1', [userId])
        return result.rows[0]?.currency || 'INR'
}

export const getInsights = async  (req , res ) => {
    try {
        const result = await pool.query (
            'SELECT * FROM ai_insights WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
            [req.userId]
        )
        res.json(result.rows)
    } catch (error){
        console.error('getInsights error', error)
        res.status(500).json({ message : 'Server error'})
    }
}

const buildMonthlyInsight = async  (userId) => {
    const data = await pool.query (
        `WITH current_month AS (
            SELECT
                SUM(CASE WHEN type= 'income' THEN amount ELSE 0 END) AS income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
            FROM transactions
            WHERE user_id = $1
                AND transaction_date >= date_trunc('month', CURRENT_DATE)
        ),
        breakdown AS (
            SELECT c.name AS category, SUM(t.amount) AS amount
            FROM transactions t
            JOIN categories c ON c.id = t.category_id
            WHERE t.user_id = $1
                AND t.type = 'expense'
                AND t.transaction_date >= date_trunc('month', CURRENT_DATE)
            GROUP BY c.name
            ORDER BY amount DESC
        ),
        trend AS (
            SELECT
                to_char(date_trunc('month', transaction_date), 'YYYY-MM') AS month,
                SUM(CASE WHEN type= 'income' THEN amount ELSE 0 END) AS income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
            FROM transactions
            WHERE user_id = $1
                AND transaction_date >= date_trunc('month' , CURRENT_DATE) - INTERVAL '3 months'
                AND transaction_date < date_trunc('month', CURRENT_DATE)
            GROUP BY 1
            ORDER BY 1
        )
        SELECT
            (SELECT income FROM current_month ) AS income,
            (SELECT expense FROM current_month ) AS expense,
            (SELECT json_agg(breakdown) FROM breakdown) AS breakdown,
            (SELECT json_agg(trend) FROM trend) AS trend`,
        [userId]
    )

    const row = data.rows[0];
    const totalIncome = parseFloat(row.income || 0)
    const totalExpenses = parseFloat(row.expense || 0)
    const savingsRate = totalIncome > 0 ? (( totalIncome - totalExpenses) / totalIncome) *100 : 0
    const currency = await getUserCurrency(userId)

    const content = await generateMonthlyInsight ({
        totalIncome,
        totalExpense : totalExpenses,
        savingsRate,
        expenseBreakdown: (row.breakdown || []).map(b => ({
            category: b.category,
            amount: parseFloat(b.amount),
        })),
        previousMonths: (row.trend || []).map(t => ({
            month: t.month,
            income: parseFloat(t.income),
            expenses : parseFloat(t.expense),
        })),
        currency
    })
    const now = new Date()
    const periodStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    const periodEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`

    return { content, periodStart, periodEnd }
}
const buildSavingTips = async (userId) => {
    const data = await pool.query(
        `WITH financial_data AS (
            SELECT
                COALESCE(
                    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),
                    0
                ) AS income,
                COALESCE(
                    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),
                    0
                ) AS expense
            FROM transactions
            WHERE user_id = $1
                AND transaction_date >= CURRENT_DATE - INTERVAL '3 months'
        ),
        breakdown AS (
            SELECT
                COALESCE(c.name, 'Uncategorized') AS category,
                SUM(t.amount) AS amount,
                COUNT(t.id) AS transaction_count
            FROM transactions t
            LEFT JOIN categories c
                ON c.id = t.category_id
            WHERE t.user_id = $1
                AND t.type = 'expense'
                AND t.transaction_date >= CURRENT_DATE - INTERVAL '3 months'
            GROUP BY COALESCE(c.name, 'Uncategorized')
            ORDER BY amount DESC
            LIMIT 5
        )
        SELECT
            (SELECT income FROM financial_data) AS income,
            (SELECT expense FROM financial_data) AS expense,
            (
                SELECT COALESCE(json_agg(breakdown), '[]'::json)
                FROM breakdown
            ) AS breakdown`,
        [userId]
    );

    const row = data.rows[0];

    const totalIncome = parseFloat(row.income || 0);
    const totalExpense = parseFloat(row.expense || 0);

    const savingsRate =
        totalIncome > 0
            ? ((totalIncome - totalExpense) / totalIncome) * 100
            : 0;

    const expenseBreakdown = Array.isArray(row.breakdown)
        ? row.breakdown.map((item) => ({
              category: item.category,
              amount: parseFloat(item.amount || 0),
              transactionCount: parseInt(item.transaction_count || 0, 10),
          }))
        : [];

    const currency = await getUserCurrency(userId);

    const content = await generateSavingTips({
        totalIncome,
        totalExpense,
        savingsRate,
        expenseBreakdown,
        currency,
    });

    return {
        content,
        periodStart: null,
        periodEnd: null,
    };
};

const buildBudgetALert = async  (userId, categoryId) => {
    if(!categoryId) {
        const err = new Error('category id is required for budget_alert')
        err.status = 400;
        throw err
    }

    const budgetRow = await pool.query(
        `SELECT b.*, c.name AS category_name,
        COALESCE((
            SELECT SUM(amount) FROM transactions
            WHERE user_id = b.user_id
                AND category_id = b.category_id
                AND type = 'expense'
                AND transaction_date >= date_trunc('month', CURRENT_DATE)
        ), 0 ) AS spent
        FROM budgets b
        JOIN categories c ON c.id = b.category_id
        WHERE b.user_id = $1 AND b.category_id = $2`,
        [userId, categoryId]
    )

    if(budgetRow.rows.length === 0){
        const err = new Error('Budget not found for category')
        err.status = 400;
        throw err
    }

    const b = budgetRow.rows[0]
    const now = new Date();
    const daysIntoPeriod = now.getDate()
    const totalPeriodDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const currency = await getUserCurrency(userId)

    const content = await generateBudgetAlert({
        categoryName: b.category_name,
        budgetAmount: parseFloat(b.amount),
        spentAmount: parseFloat(b.spent),
        daysIntoPeriod,
        totalPeriodDays,
        currency
    })

    return { content, periodStart: null, periodEnd: null}
}

export const generateInsight = async  ( req, res) => {
    const { type, categoryId} = req.body;

    if(!type){
        return res.status(400).json({ message: 'Insight type is required!'})
    }

    try {

        let result;
        if(type === 'monthly_summary'){
            result = await buildMonthlyInsight(req.userId)
        } else if(type === 'savings_tips'){
            result = await buildSavingTips(req.userId)
        } else if (type === 'budget_alert'){
            result = await buildBudgetALert(req.userId, categoryId)
        } else {
            return res.status(400).json({ message : 'Unknown insight type'})
        }

        const inserted = await pool.query (
            `INSERT INTO ai_insights (user_id, insight_type, period_start, period_end, content_json)
            VALUES($1, $2, $3, $4, $5)
            RETURNING *`,
            [req.userId, type, result.periodStart, result.periodEnd, result.content]
        )
        res.status(201).json(inserted.rows[0])

    } catch (error){
        console.error('generateInsight error', error)
        res.status(error.status || 500).json({ message : error.message || 'Server error'})

    }
}

export const askInsight = async (req, res) => {
    const question = req.body?.question;

    if (
        typeof question !== 'string' ||
        !question.trim() ||
        question.trim().length > 500
    ) {
        return res.status(400).json({
            message: 'Question must contain between 1 and 500 characters.',
        });
    }

    try {
        const userId = req.userId;

        const result = await pool.query(
            `
            WITH monthly_totals AS (
                SELECT
                    COALESCE(
                        SUM(amount) FILTER (
                            WHERE type = 'income'
                              AND transaction_date >= date_trunc('month', CURRENT_DATE)
                              AND transaction_date < date_trunc('month', CURRENT_DATE)
                                  + INTERVAL '1 month'
                        ),
                        0
                    ) AS current_income,

                    COALESCE(
                        SUM(amount) FILTER (
                            WHERE type = 'expense'
                              AND transaction_date >= date_trunc('month', CURRENT_DATE)
                              AND transaction_date < date_trunc('month', CURRENT_DATE)
                                  + INTERVAL '1 month'
                        ),
                        0
                    ) AS current_expenses,

                    COALESCE(
                        SUM(amount) FILTER (
                            WHERE type = 'expense'
                              AND transaction_date >= date_trunc('month', CURRENT_DATE)
                                  - INTERVAL '1 month'
                              AND transaction_date < date_trunc('month', CURRENT_DATE)
                        ),
                        0
                    ) AS previous_expenses,

                    COUNT(*) FILTER (
                        WHERE type = 'expense'
                          AND transaction_date >= date_trunc('month', CURRENT_DATE)
                          AND transaction_date < date_trunc('month', CURRENT_DATE)
                              + INTERVAL '1 month'
                    ) AS current_expense_count,

                    COUNT(*) FILTER (
                        WHERE type = 'expense'
                          AND transaction_date >= date_trunc('month', CURRENT_DATE)
                              - INTERVAL '1 month'
                          AND transaction_date < date_trunc('month', CURRENT_DATE)
                    ) AS previous_expense_count

                FROM transactions
                WHERE user_id = $1
                  AND transaction_date >= date_trunc('month', CURRENT_DATE)
                      - INTERVAL '1 month'
                  AND transaction_date < date_trunc('month', CURRENT_DATE)
                      + INTERVAL '1 month'
            ),

            category_breakdown AS (
                SELECT
                    COALESCE(c.name, 'Uncategorized') AS category,
                    SUM(t.amount) AS amount,
                    COUNT(*) AS transaction_count
                FROM transactions t
                LEFT JOIN categories c
                    ON c.id = t.category_id
                WHERE t.user_id = $1
                  AND t.type = 'expense'
                  AND t.transaction_date >= date_trunc('month', CURRENT_DATE)
                  AND t.transaction_date < date_trunc('month', CURRENT_DATE)
                      + INTERVAL '1 month'
                GROUP BY COALESCE(c.name, 'Uncategorized')
                ORDER BY amount DESC
            ),

            previous_category_breakdown AS (
                SELECT
                    COALESCE(c.name, 'Uncategorized') AS category,
                    SUM(t.amount) AS amount
                FROM transactions t
                LEFT JOIN categories c
                    ON c.id = t.category_id
                WHERE t.user_id = $1
                  AND t.type = 'expense'
                  AND t.transaction_date >= date_trunc('month', CURRENT_DATE)
                      - INTERVAL '1 month'
                  AND t.transaction_date < date_trunc('month', CURRENT_DATE)
                GROUP BY COALESCE(c.name, 'Uncategorized')
                ORDER BY amount DESC
            )

            SELECT
                m.*,
                (
                    SELECT COALESCE(json_agg(cb), '[]'::json)
                    FROM category_breakdown cb
                ) AS categories,
                (
                    SELECT COALESCE(json_agg(pcb), '[]'::json)
                    FROM previous_category_breakdown pcb
                ) AS previous_categories
            FROM monthly_totals m
            `,
            [userId]
        );

        const row = result.rows[0];

        const currentIncome = Number(row.current_income || 0);
        const currentExpenses = Number(row.current_expenses || 0);
        const previousExpenses = Number(row.previous_expenses || 0);

        const currentExpenseCount = Number(
            row.current_expense_count || 0
        );

        const previousExpenseCount = Number(
            row.previous_expense_count || 0
        );

        const categories = (row.categories || []).map((item) => ({
            category: item.category,
            amount: Number(item.amount || 0),
            transactionCount: Number(item.transaction_count || 0),
        }));

        const previousCategories = (
            row.previous_categories || []
        ).map((item) => ({
            category: item.category,
            amount: Number(item.amount || 0),
        }));

        const financialData = {
            period: new Date().toISOString().slice(0, 7),
            currentMonth: {
                income: currentIncome,
                expenses: currentExpenses,
                expenseTransactionCount: currentExpenseCount,
                categories,
            },
            previousMonth: {
                expenses: previousExpenses,
                expenseTransactionCount: previousExpenseCount,
                categories: previousCategories,
            },
            expenseChangePercent:
                previousExpenseCount > 0 && previousExpenses > 0
                    ? Number(
                        (
                            ((currentExpenses - previousExpenses) /
                                previousExpenses) *
                            100
                        ).toFixed(1)
                    )
                    : null,
            comparisonNote:
                'The current month may be incomplete. Do not compare ' +
                'a partial month with a complete previous month as if ' +
                'they cover equal periods.',
        };

        const currency = await getUserCurrency(userId);

        if (
            currentExpenseCount === 0 &&
            previousExpenseCount === 0 &&
            currentIncome === 0
        ) {
            return res.json({
                answer:
                    'I do not have enough recorded financial data yet ' +
                    'to analyse your spending. Add some transactions ' +
                    'and I can help identify patterns.',
                suggestions: [
                    'Add your income and expenses to CogniWallet.',
                    'Assign categories to expenses for more useful analysis.',
                ],
            });
        }

        const answer = await askFinancialAssistant({
            question: question.trim(),
            financialData,
            currency,
        });

        return res.json(answer);
    } catch (error) {
        console.error('askInsight error:', error);

        return res.status(500).json({
            message:
                'Unable to answer your question right now. Please try again.',
        });
    }
};
