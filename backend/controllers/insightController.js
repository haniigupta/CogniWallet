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