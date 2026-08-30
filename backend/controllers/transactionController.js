import pool from '../db.js'

export const getTransactions = async (req , res)=>{
    const { startDate, endDate, categoryId, type, search, limit = 50, offset = 0} = req.query;

    const conditions = ['t.user_id = $1'];
    const values = [req.userId]
    let idx = 2

    if(startDate){
        conditions.push(`t.transaction_date >= $${idx++}`)
        values.push(startDate)
    }

    if(endDate){
        conditions.push(`t.transaction_date <= $${idx++}`)
        values.push(endDate)
    }

    if(categoryId){
        conditions.push(`t.category_id = $${idx++}`)
        values.push(categoryId)
    }

    if(type){
        conditions.push(`t.type = $${idx++}`)
        values.push(type)
    }

    if(search){
        conditions.push(`t.description ILIKE $${idx++} OR t.notes ILIKE $${idx}`)
        values.push(`%${search}%`)
        idx++
    }

    values.push(limit, offset)

    try{

        const result = await pool.query(
            `SELECT t.*,
                c.name AS category_name,
                c.icon AS category_icon,
                c.color AS category_color
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE ${conditions.join(' AND ')}
            ORDER BY t.transaction_date DESC, t.id DESC
            LIMIT $${idx++} OFFSET $${idx}`,
            values
        )
        res.json(result.rows)

    } catch (error){
        console.error('getTransaction error', error)
        res.status(500).json({ message : 'Server error '})
    }
}

export const createTransaction = async (req, res) => {

    const {categoryId, amount, type, description, notes, transactionDate} = req.body;

    if(!amount || !type || !transactionDate){
        return res.status(400).json({
            message : "Amount, type and transactions are required!"
        })
    }

    if(!['income', 'expense'].includes(type)){
        return res.status(400).json({
            message : "Type must be income or expense"
        })
    }

    try {

        const result = await pool.query(
            `INSERT INTO transactions (user_id, category_id, amount, type, description, notes, transaction_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [req.userId, categoryId || null, amount, type, description || null, notes || null, transactionDate]
        )

    } catch (error){
        console.error('createTransaction error', error)
        res.status(500).json({ message: 'Server error'})
    }
}