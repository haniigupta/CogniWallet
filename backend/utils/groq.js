import dotenv from 'dotenv'
import Groq from 'groq-sdk'

dotenv.config()

const ai = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

if (!process.env.GROQ_API_KEY) {
    console.error('Groq API key is not set!')
}

const stripMarkdown = (text) => {
    let cleaned = text.trim()

    if (cleaned.startsWith('```json')) {
        cleaned = cleaned
            .replace(/```json\n?/g, '')
            .replace(/```\n?$/g, '')
    } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/```\n?/g, '')
    }

    return cleaned.trim()
}

export const generateMonthlyInsight = async ({
    totalIncome, totalExpense, savingsRate, expenseBreakdown, previousMonths,
    currency = 'INR'
}) => {

    const breakdownText = expenseBreakdown.length > 0
        ? expenseBreakdown
            .map(c =>
                `- ${c.category}: ${currency} ${Number(c.amount).toFixed(2)}`
            )
            .join('\n')
        : '- No expense recorded yet'

    const trendText = previousMonths.length > 0
        ? previousMonths
            .map(m =>
                `- ${m.month}: Income ${currency} ${Number(m.income).toFixed(2)}, Expense ${currency} ${Number(m.expense).toFixed(2)}`
            )
            .join('\n')
        : '- No previous month data available'

    const prompt = `You are a personal finance analyst.

Analyze the user's monthly financial data and provide concise, actionable insights.

Financial data:
Currency: ${currency}
Total income this month: ${currency} ${Number(totalIncome).toFixed(2)}
Total expenses this month: ${currency} ${Number(totalExpense).toFixed(2)}
Savings rate: ${Number(savingsRate).toFixed(2)}%

Expense breakdown:
${breakdownText}

Previous months:
${trendText}

Instructions:
- Identify the most important spending patterns.
- Compare current performance with previous months when data is available.
- Highlight unusually high spending categories.
- Comment on the user's savings rate.
- Give practical and realistic suggestions.
- Do not invent or assume financial data.
- Keep the response concise.
- Do not provide investment, tax, or legal advice.
- Return only valid JSON.
- Do not use Markdown or code fences.

Return exactly:
{
    "summary": "Short overall assessment",
    "insights": [
        "Important observation",
        "Another important observation"
    ],
    "recommendations": [
        "Specific actionable recommendation",
        "Another actionable recommendation"
    ]
}`

    try {
        const response = await ai.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            response_format: {
                type: 'json_object'
            }
        })

        const text = response.choices[0].message.content
        const cleaned = stripMarkdown(text)

        return JSON.parse(cleaned)

    } catch (error) {
        console.error('Error generating insights:', error)
        throw new Error('Failed to generate insights. Please try again later.')
    }
}

export const generateBudgetAlert = async ({
    categoryName,
    budgetAmount,
    spentAmount,
    daysIntoPeriod,
    totalPeriodDays,
    currency = 'INR',
}) => {

    const budget = Number(budgetAmount)
    const spent = Number(spentAmount)

    const percentUsed = budget > 0
        ? ((spent / budget) * 100).toFixed(1)
        : '0.0'

    const daysLeft = Math.max(totalPeriodDays - daysIntoPeriod, 0)

    const prompt = `You are a personal finance assistant.

Analyze the user's budget status and generate a concise, helpful budget alert.

Budget data:
Category: ${categoryName}
Budget: ${currency} ${budget.toFixed(2)}
Spent: ${currency} ${spent.toFixed(2)}
Budget used: ${percentUsed}%
Days elapsed: ${daysIntoPeriod}
Days remaining: ${daysLeft}

Instructions:
- Assess whether the user is on track to stay within the budget.
- Consider the percentage of budget already used and the remaining days.
- Clearly explain the current budget status.
- Give one or two practical suggestions to control spending if necessary.
- Do not invent, assume, or estimate any financial data.
- Keep the response concise and easy to understand.
- Do not provide investment, tax, or legal advice.
- Return ONLY valid JSON.
- Do not use Markdown or code fences.

Return exactly:
{
    "status": "on_track | warning | exceeded",
    "message": "Short explanation of the current budget status",
    "recommendation": "A practical action the user can take"
}`

    try {
        const response = await ai.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            response_format: {
                type: 'json_object'
            }
        })

        const text = response.choices[0].message.content
        const cleaned = stripMarkdown(text)

        return JSON.parse(cleaned)

    } catch (error) {
        console.error('Error generating budget alert:', error)
        throw new Error('Failed to generate budget alert. Please try again later.')
    }
}

export const generateSavingTips = async ({
    totalIncome,
    totalExpense,
    savingsRate,
    expenseBreakdown,
    currency = 'INR'
}) => {

    const breakdownText = expenseBreakdown.length > 0
        ? expenseBreakdown
            .map(c =>
                `- ${c.category}: ${currency} ${Number(c.amount).toFixed(2)}`
            )
            .join('\n')
        : '- No expense recorded yet'

    const prompt = `You are a personal finance assistant.

Analyze the user's income, expenses, savings rate, and spending categories to generate practical saving tips.

Financial data:
Currency: ${currency}
Total income: ${currency} ${Number(totalIncome).toFixed(2)}
Total expenses: ${currency} ${Number(totalExpense).toFixed(2)}
Savings rate: ${Number(savingsRate).toFixed(2)}%

Expense breakdown:
${breakdownText}

Instructions:
- Identify the categories where the user has the greatest opportunity to reduce spending.
- Consider the user's savings rate when giving advice.
- Provide specific and realistic ways to save money.
- Prioritize high-impact changes over generic advice.
- Do not invent, assume, or estimate any financial data.
- Do not recommend unrealistic spending cuts.
- Do not provide investment, tax, or legal advice.
- Keep the tips concise and easy to understand.
- Return ONLY valid JSON.
- Do not use Markdown or code fences.

Return exactly:
{
    "summary": "Short assessment of the user's saving potential",
    "tips": [
        {
            "category": "Expense category",
            "tip": "Specific actionable saving tip",
            "priority": "high | medium | low"
        },
        {
            "category": "Expense category",
            "tip": "Specific actionable saving tip",
            "priority": "high | medium | low"
        },
        {
            "category": "General",
            "tip": "Another practical saving tip",
            "priority": "high | medium | low"
        }
    ]
}`

    try {
        const response = await ai.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            response_format: {
                type: 'json_object'
            }
        })

        const text = response.choices[0].message.content
        const cleaned = stripMarkdown(text)

        return JSON.parse(cleaned)

    } catch (error) {
        console.error('Error generating saving tips:', error)
        throw new Error('Failed to generate saving tips. Please try again later.')
    }
}

export const analyzeTransactionList = async ({
    transactions,
    currency = 'USD'
}) => {

    const transactionText = transactions.length > 0
        ? transactions.map((t, index) => `
${index + 1}. Date: ${t.transaction_date}
   Type: ${t.type}
   Category: ${t.category || 'Uncategorized'}
   Amount: ${currency} ${Number(t.amount).toFixed(2)}
   Description: ${t.description || 'None'}
   Notes: ${t.notes || 'None'}
`).join('\n')
        : '- No transactions available'

    const prompt = `You are a personal finance analyst.

Analyze the user's transaction list and identify meaningful spending and income patterns.

Transactions:
${transactionText}

Instructions:
- Identify unusual or potentially problematic transactions.
- Identify recurring or frequent spending patterns when the data supports it.
- Highlight categories with significant spending.
- Point out notable income patterns when applicable.
- Look for unnecessary or potentially reducible expenses based only on the provided information.
- Do not claim that a transaction is fraudulent or unnecessary without sufficient evidence.
- Do not invent, assume, or estimate financial data.
- Do not provide investment, tax, or legal advice.
- Keep the analysis concise and useful.
- If there is insufficient data for a particular observation, do not make that observation.
- Return ONLY valid JSON.
- Do not use Markdown or code fences.

Return exactly this JSON structure:
{
    "summary": "Short overall analysis of the transaction activity",
    "patterns": [
        {
            "type": "spending | income | frequency",
            "description": "Meaningful pattern found in the transactions"
        }
    ],
    "notableTransactions": [
        {
            "date": "Transaction date",
            "category": "Category name",
            "amount": "Transaction amount",
            "reason": "Why this transaction is notable"
        }
    ],
    "recommendations": [
        "Specific actionable recommendation"
    ]
}`

    try {
        const response = await ai.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.2,
            response_format: {
                type: 'json_object'
            }
        })

        const text = response.choices[0].message.content
        const cleaned = stripMarkdown(text)

        return JSON.parse(cleaned)

    } catch (error) {
        console.error('Error analyzing transactions:', error)
        throw new Error(
            'Failed to analyze transactions. Please try again later.'
        )
    }
}

export const analyzeBudgetList = async ({
    budgets,
    currency = 'INR'
}) => {

    const budgetText = budgets.length > 0
        ? budgets.map((b, index) => `
${index + 1}. Category: ${b.category}
   Budget: ${currency} ${Number(b.budgetAmount).toFixed(2)}
   Spent: ${currency} ${Number(b.spentAmount).toFixed(2)}
   Remaining: ${currency} ${Number(b.remainingAmount).toFixed(2)}
   Used: ${Number(b.percentUsed).toFixed(1)}%
   Period: ${b.period}
`).join('\n')
        : '- No budgets available'

    const prompt = `You are a personal finance analyst.

Analyze the user's budget list and identify important budget patterns, overspending risks, and opportunities to improve budget management.

Budget data:
Currency: ${currency}

${budgetText}

Instructions:
- Identify budgets that have been exceeded or are close to being exceeded.
- Identify categories where spending is well below the budget.
- Compare spending across different budget categories.
- Highlight the most important budget management patterns.
- Give practical recommendations for improving budget allocation or spending control.
- Do not invent, assume, or estimate any financial data.
- Base every observation only on the provided budget data.
- Do not provide investment, tax, or legal advice.
- Keep the analysis concise and easy to understand.
- Return ONLY valid JSON.
- Do not use Markdown or code fences.

Return exactly this JSON structure:
{
    "summary": "Short overall assessment of the user's budgets",
    "insights": [
        {
            "category": "Category name",
            "status": "exceeded | at_risk | on_track | underspent",
            "description": "Important observation about this budget"
        }
    ],
    "recommendations": [
        "Specific actionable recommendation",
        "Another actionable recommendation"
    ]
}`

    try {
        const response = await ai.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.2,
            response_format: {
                type: 'json_object'
            }
        })

        const text = response.choices[0].message.content
        const cleaned = stripMarkdown(text)

        return JSON.parse(cleaned)

    } catch (error) {
        console.error('Error analyzing budgets:', error)
        throw new Error('Failed to analyze budgets. Please try again later.')
    }
}