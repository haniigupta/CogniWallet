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
