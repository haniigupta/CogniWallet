import pool from '../db.js';

const pctChange = (current, previous) => {
    if (previous === 0 ) return current === 0 ? 0 :100;
    return ((current - previous )/ previous ) * 100;
}

export const getSummary = async (req , res) => {

    try {

        const result = await pool.query (
            `WITH monthly AS(
                SELECT
                    date_trunc('month', transaction_date)AS month,
                    type,
                    SUM(amount) AS total
                FROM transactions
                WHERE user_id = $1
                    AND transaction_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
                GROUP BY 1,2
            )
            SELECT
                COALESCE(SUM(CASE WHEN month = date_trunc('month', CURRENT_DATE) AND type = 'income' THEN total END), 0) AS income_this_month,
                COALESCE(SUM(CASE WHEN month = date_trunc('month', CURRENT_DATE) AND type = 'expense' THEN total END), 0) AS expense_this_month,
                COALESCE(SUM(CASE WHEN month = date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'  AND type = 'income' THEN total END), 0) AS income_last_month,
                COALESCE(SUM(CASE WHEN month = date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'  AND type = 'expense' THEN total END), 0) AS expense_last_month
            FROM monthly`,
            [req.userId]

        );

        const row = result.rows[0]
        const incomeThisMonth = parseFloat(row.income_this_month)
        const expenseThisMonth = parseFloat(row.expense_this_month)
        const incomeLastMonth = parseFloat(row.income_last_month);
        const expenseLastMonth = parseFloat(row.expense_last_month);

        const balance = incomeThisMonth -  expenseThisMonth
        const savingsRate = incomeThisMonth > 0 ? (balance / incomeThisMonth) *100 : 0;

        res.json({
            incomeThisMonth,
            expenseThisMonth,
            balance,
            savingsRate,
            incomeDelta : pctChange(incomeThisMonth, incomeLastMonth),
            expenseDelta : pctChange(expenseThisMonth, expenseLastMonth)
        })
    } catch (error) {
        console.error('getSummary error', error)
        res.status(500).json({ message : 'Server error'})
    }
}