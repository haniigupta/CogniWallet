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
    totalIncome = 0,
    totalExpense = 0,
    savingsRate = 0,
    expenseBreakdown = [],
    previousMonths = [],
    currency = 'INR'
}) => {
    const safeExpenseBreakdown = Array.isArray(expenseBreakdown)
        ? expenseBreakdown
        : [];

    const safePreviousMonths = Array.isArray(previousMonths)
        ? previousMonths
        : [];

    const breakdownText = safeExpenseBreakdown.length > 0
        ? safeExpenseBreakdown
            .map((c) =>
                `- ${c.category || 'Uncategorized'}: ${currency} ${Number(c.amount || 0).toFixed(2)}`
            )
            .join('\n')
        : '- No expense recorded yet';

    const trendText = safePreviousMonths.length > 0
        ? safePreviousMonths
            .map((m) =>
                `- ${m.month}: Income ${currency} ${Number(m.income || 0).toFixed(2)}, Expense ${currency} ${Number(m.expense || 0).toFixed(2)}`
            )
            .join('\n')
        : '- No previous month data available';

    const prompt = `You are a personal finance analyst.

Analyze the user's monthly financial data and provide a concise, useful financial health assessment.

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
- Base every observation ONLY on the financial data provided.
- Calculate the healthScore based on the user's actual financial situation.
- healthScore must be an integer from 0 to 100.
- Identify the most important positive financial patterns.
- Identify the most important concerns.
- Identify the largest spending category when expense data exists.
- Give practical recommendations based on the actual data.
- Do not invent transactions, amounts, categories, or trends.
- Do not provide investment, tax, or legal advice.
- Keep the response concise.
- Return ONLY valid JSON.
- Do not use Markdown or code fences.

Return exactly this JSON structure:

{
    "summary": "Short overall assessment of the user's finances",
    "healthScore": 0,
    "topSpendingCategory": "Category name or null",
    "highlights": [
        "Positive financial observation"
    ],
    "concerns": [
        "Important financial concern"
    ],
    "recommendations": [
        {
            "title": "Short recommendation title",
            "detail": "Specific actionable recommendation"
        }
    ]
}`;

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
        });

        const text = response.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error('Groq returned an empty response');
        }

        const cleaned = stripMarkdown(text);
        const parsed = JSON.parse(cleaned);

        return {
            summary: typeof parsed.summary === 'string'
                ? parsed.summary
                : 'Unable to generate a financial summary.',

            healthScore: Math.max(
                0,
                Math.min(100, Number(parsed.healthScore) || 0)
            ),

            topSpendingCategory:
                typeof parsed.topSpendingCategory === 'string'
                    ? parsed.topSpendingCategory
                    : null,

            highlights: Array.isArray(parsed.highlights)
                ? parsed.highlights.filter(
                    (item) => typeof item === 'string' && item.trim()
                )
                : [],

            concerns: Array.isArray(parsed.concerns)
                ? parsed.concerns.filter(
                    (item) => typeof item === 'string' && item.trim()
                )
                : [],

            recommendations: Array.isArray(parsed.recommendations)
                ? parsed.recommendations
                    .filter(
                        (item) =>
                            item &&
                            typeof item === 'object' &&
                            typeof item.title === 'string' &&
                            typeof item.detail === 'string'
                    )
                    .map((item) => ({
                        title: item.title.trim(),
                        detail: item.detail.trim()
                    }))
                : []
        };

    } catch (error) {
        console.error('Error generating monthly insight:', error);
        throw new Error(
            'Failed to generate monthly insight. Please try again later.'
        );
    }
};

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
    totalIncome = 0,
    totalExpense = 0,
    savingsRate = 0,
    expenseBreakdown = [],
    currency = 'INR'
}) => {
    const safeExpenseBreakdown = Array.isArray(expenseBreakdown)
        ? expenseBreakdown
        : [];

    const breakdownText =
        safeExpenseBreakdown.length > 0
            ? safeExpenseBreakdown
                  .map(
                      (c) =>
                          `- ${c.category || 'Uncategorized'}: ${currency} ${Number(
                              c.amount || 0
                          ).toFixed(2)} across ${Number(
                              c.transactionCount || 0
                          )} transactions`
                  )
                  .join('\n')
            : '- No expense recorded yet';

    const prompt = `You are a personal finance assistant.

Analyze the user's recent spending and income to generate practical, personalized saving tips.

Financial data:
Currency: ${currency}
Recent income: ${currency} ${Number(totalIncome).toFixed(2)}
Recent expenses: ${currency} ${Number(totalExpense).toFixed(2)}
Savings rate: ${Number(savingsRate).toFixed(1)}%

Top spending categories:
${breakdownText}

Instructions:
- Identify the categories with the greatest opportunity to reduce spending.
- Prioritize high-impact changes over generic advice.
- Give specific and realistic saving suggestions.
- Use the transaction count and spending amount when relevant.
- Do not invent, assume, or estimate financial data that is not provided.
- Do not recommend unrealistic spending cuts.
- Do not provide investment, tax, or legal advice.
- Keep the tips concise and easy to understand.
- estimatedSavings must be a conservative estimate based only on the provided category spending.
- If a savings estimate cannot reasonably be derived from the provided data, return 0.
- Never invent spending amounts.
- Return ONLY valid JSON.
- Do not use Markdown or code fences.

Return exactly this JSON structure:
{
    "overallTip": "Short assessment of the user's saving potential",
    "tips": [
        {
            "category": "Expense category",
            "title": "Short actionable saving tip",
            "detail": "Specific explanation of what the user should do",
            "estimatedSavings": 0,
            "priority": "high"
        }
    ]
}`;

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
        });

        const text = response.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error('Groq returned an empty response');
        }

        const parsed = JSON.parse(stripMarkdown(text));

        return {
            overallTip:
                typeof parsed.overallTip === 'string'
                    ? parsed.overallTip.trim()
                    : '',

            tips: Array.isArray(parsed.tips)
                ? parsed.tips
                      .filter(
                          (tip) =>
                              tip &&
                              typeof tip === 'object' &&
                              typeof tip.category === 'string' &&
                              typeof tip.title === 'string' &&
                              typeof tip.detail === 'string'
                      )
                      .map((tip) => ({
                          category: tip.category.trim(),
                          title: tip.title.trim(),
                          detail: tip.detail.trim(),
                          estimatedSavings: Math.max(
                              0,
                              Number(tip.estimatedSavings) || 0
                          ),
                          priority: ['high', 'medium', 'low'].includes(
                              tip.priority
                          )
                              ? tip.priority
                              : 'medium'
                      }))
                : []
        };
    } catch (error) {
        console.error('generateSavingTips error:', error);
        throw new Error(
            'Failed to generate saving tips. Please try again later.'
        );
    }
};

export const analyzeTransactionList = async ({
    transactions,
    currency = 'USD'
}) => {

    const transactionText = transactions.length > 0
        ? transactions.map((t, index) => `
${index + 1}. Date: ${t.transaction_date}
   Type: ${t.type}
   Category: ${t.category_name || t.category || 'Uncategorized'}
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

    const safeBudgets = Array.isArray(budgets) ? budgets : [];

    const budgetText = safeBudgets.length > 0
        ? safeBudgets.map((b, index) => `
${index + 1}. Budget ID: ${b.budgetId}
   Category: ${b.category || 'Uncategorized'}
   Budget: ${currency} ${Number(b.budgetAmount || 0).toFixed(2)}
   Spent: ${currency} ${Number(b.spentAmount || 0).toFixed(2)}
   Remaining: ${currency} ${Number(b.remainingAmount || 0).toFixed(2)}
   Used: ${Number(b.percentUsed || 0).toFixed(1)}%
   Period: ${b.period || 'unknown'}
`).join('\n')
        : '- No budgets available';

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
            "budgetId": 0,
            "category": "Category name",
            "status": "exceeded | at_risk | on_track | underspent",
            "description": "Important observation about this budget"
        }
    ],
    "recommendations": [
        "Specific actionable recommendation",
        "Another actionable recommendation"
    ]
}`;

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
        });

        const text = response.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error('Groq returned an empty response');
        }

        const cleaned = stripMarkdown(text);

        const parsed = JSON.parse(cleaned);

        return {
            summary:
                typeof parsed.summary === 'string'
                    ? parsed.summary.trim()
                    : '',

            insights: Array.isArray(parsed.insights)
                ? parsed.insights
                    .filter(
                        (insight) =>
                            insight &&
                            typeof insight === 'object' &&
                            typeof insight.category === 'string' &&
                            typeof insight.status === 'string' &&
                            typeof insight.description === 'string'
                    )
                    .map((insight) => ({
                        budgetId:
                            insight.budgetId != null
                                ? Number(insight.budgetId)
                                : null,

                        category: insight.category.trim(),

                        status: [
                            'exceeded',
                            'at_risk',
                            'on_track',
                            'underspent'
                        ].includes(insight.status)
                            ? insight.status
                            : 'on_track',

                        description: insight.description.trim()
                    }))
                : [],

            recommendations: Array.isArray(parsed.recommendations)
                ? parsed.recommendations.filter(
                    (item) =>
                        typeof item === 'string' && item.trim()
                )
                : []
        };

    } catch (error) {
        console.error('Error analyzing budgets:', error);
        throw new Error(
            'Failed to analyze budgets. Please try again later.'
        );
    }
};

export default {
    generateMonthlyInsight,
    generateBudgetAlert,
    generateSavingTips,
    analyzeTransactionList,
    analyzeBudgetList
}