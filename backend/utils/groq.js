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