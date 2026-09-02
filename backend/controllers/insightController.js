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
        totalExpenses,
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

const buildSavingTips = async  (userId) => {
    const top = await pool.query (
        `SELECT c.name AS category, SUM(t.amount) AS amount, COUNT(t.id) AS count
        FROM transactions t
        JOIN categories c ON c.id = t.category_id
        WHERE t.user_id = $1
            AND t.type = 'expense'
            AND t.transaction_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '3 months'
        GROUP BY c.name
        ORDER BY amount DESC
        LIMIT 5`,
        [userId]
    )

    const incomeResult = await pool.query (
        `SELECT COALESCE(SUM(amount), 0) AS total_income
        FROM transactions
        WHERE user_id = $1
            AND type = 'income'
            AND transaction_date >=  CURRENT_DATE - INTERVAL '30 days'`,
        [userId]
    )

    const currency = await getUserCurrency(userId)

    const content = await generateSavingTips ({
        topCategories: top.rows.map(r => ({
            category: r.category,
            amount: parseFloat(r.amount),
            transactionCount: parseInt(r.count, 10)
        })),
        monthlyIncome: parseFloat(incomeResult.rows[0].total_income),
        currency,
    })

    return { content, periodStart: null, periodEnd: null }
}
