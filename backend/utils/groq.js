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
    totalIncome,
    totalExpense,
    savingsRate,
    expenseBreakdown,
    previousMonths,
    currency = 'USD'
}) => {

    const breakdownText = expenseBreakdown.length > 0
        ? expenseBreakdown
            .map(c => `- ${c.category}: ${currency} ${c.amount.toFixed(2)}`)
            .join('\n')
        : '- No expense recorded yet'

    const trendText = previousMonths.length > 0
        ? previousMonths
            .map(m =>
                `- ${m.month}: Income ${currency} ${m.income.toFixed(2)}, Expense ${currency} ${m.expense.toFixed(2)}`
            )
            .join('\n')
        : '- No previous month data available'

    const prompt = `You are a personal finance analyst.

Analyze the user's monthly financial data and provide concise, actionable insights.

Financial data:
Currency: ${currency}
Total income this month: ${currency} ${totalIncome.toFixed(2)}
Total expenses this month: ${currency} ${totalExpense.toFixed(2)}
Savings rate: ${savingsRate.toFixed(2)}%

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
    currency = 'USD',
}) => {
    const percentUsed = ((spentAmount / budgetAmount) * 100).toFixed(1)
    const daysLeft = totalPeriodDays - daysIntoPeriod

    const prompt = `You are a personal finance assistant.

Analyze the user's budget status and generate a concise, helpful budget alert.

Budget data:
Category: ${categoryName}
Budget: ${currency} ${budgetAmount.toFixed(2)}
Spent: ${currency} ${spentAmount.toFixed(2)}
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

Return exactly this JSON structure:
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
    currency = 'USD'
}) => {
    const breakdownText = expenseBreakdown.length > 0
        ? expenseBreakdown
            .map(c => `- ${c.category}: ${currency} ${c.amount.toFixed(2)}`)
            .join('\n')
        : '- No expense recorded yet'

    const prompt = `You are a personal finance assistant.

Analyze the user's income, expenses, savings rate, and spending categories to generate practical saving tips.

Financial data:
Currency: ${currency}
Total income: ${currency} ${totalIncome.toFixed(2)}
Total expenses: ${currency} ${totalExpense.toFixed(2)}
Savings rate: ${savingsRate.toFixed(2)}%

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

Return exactly this JSON structure:
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