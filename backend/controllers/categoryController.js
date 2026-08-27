import pool from '../db.js'

export const getCategories = async (req , res) => {
    try {

        const result = await pool.query (
            'SELECT * FROM categories WHERE user_id = $1 ORDER BY type, name',
            [req.userId]
        )
        res.json(result.rows)
    } catch (error) {
        console.error ('getCategories error', error)
        res.status(500).json({ message : 'Server error'})
    }
}