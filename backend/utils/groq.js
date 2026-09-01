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