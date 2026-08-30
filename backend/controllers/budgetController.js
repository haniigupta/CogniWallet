import pool from '../db.js'

export const getBudgets = async (req , res )=>{
    
    try {

        const result = await pool.query(
            `SELECT 
                b.id,
                b.category_id,
                b.amount,
                b.period,
                b.start_date,
                c.name AS category_name,
                c.icon AS category_icon,
                c.color AS categoyr_color,
                COALESCE(SUM(t.amount), 0) AS spent
            FROM budgets b
            JOIN categories c ON c.id = b.category_id
            LEFT JOIN transactions t
            ON t.category_id = b.category_id
            AND t.user_id = b.user_id
            AND t.type = 'expense'
            AND (
                (b.period = 'monthly' AND t.transaction_date >= date_trunc('month', CURRENT_DATE))
                OR (b.period = 'weekly' AND t.transaction_date >= date_trunc('week' , CURRENT_DATE))
            )
            WHERE b.user_id = $1
            GROUP BY b.id, c.name, c.icon, c.color
            ORDER BY c.name`,
            [req.userId]
        )
        res.json(result.rows)

    } catch (error){
        console.error('getBudgets error', error)
        res.status(500).json({message: 'Server error'})
    }
}