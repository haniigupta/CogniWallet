import { useState } from 'react';
import {
    ArrowUpRight,
    Lightbulb,
    Send,
    Sparkles,
    UserRound,
} from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../lib/axios.js';
import { API_PATHS } from '../utils/apiPaths.js';

const suggestedQuestions = [
    'Why am I spending so much?',
    'Where am I spending the most?',
    'How can I save money?',
    'What changed since last month?',
];

const FinancialAssistant = () => {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const askQuestion = async (selectedQuestion) => {
        const text = selectedQuestion.trim();

        if (!text || loading) return;

        if (text.length > 500) {
            toast.error('Keep your question under 500 characters.');
            return;
        }

        setMessages((previous) => [
            ...previous,
            {
                id: `${Date.now()}-user`,
                role: 'user',
                content: text,
            },
        ]);

        setQuestion('');
        setLoading(true);

        try {
            const response = await api.post(
                API_PATHS.INSIGHTS.ASK,
                { question: text }
            );

            const answer = response.data;

            if (typeof answer?.answer !== 'string') {
                throw new Error('Invalid assistant response');
            }

            setMessages((previous) => [
                ...previous,
                {
                    id: `${Date.now()}-assistant`,
                    role: 'assistant',
                    content: answer.answer,
                    suggestions: Array.isArray(answer.suggestions)
                        ? answer.suggestions
                        : [],
                },
            ]);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Could not get an answer. Please try again.'
            );

            setMessages((previous) => [
                ...previous,
                {
                    id: `${Date.now()}-error`,
                    role: 'error',
                    content:
                        'I could not analyse your finances right now. ' +
                        'Please try asking again.',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        askQuestion(question);
    };

    return (
        <section className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-100 bg-linear-to-r from-violet-50 to-white px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-400 to-violet-600 text-white shadow-sm">
                        <Sparkles size={22} />
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-900">
                                Ask CogniAI
                            </h2>

                            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                                AI Assistant
                            </span>
                        </div>

                        <p className="mt-0.5 text-sm text-slate-500">
                            Ask questions about your spending and get
                            suggestions based on your transactions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Conversation */}
            <div
                className="max-h-[520px] min-h-[260px] space-y-5 overflow-y-auto px-5 py-6 sm:px-6"
                aria-live="polite"
            >
                {messages.length === 0 && (
                    <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                            <Sparkles size={26} />
                        </div>

                        <h3 className="text-base font-bold text-slate-900">
                            What would you like to know?
                        </h3>

                        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                            I can help you understand your expenses,
                            identify spending patterns, and find
                            practical ways to save.
                        </p>

                        <div className="mt-5 flex max-w-xl flex-wrap justify-center gap-2">
                            {suggestedQuestions.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => askQuestion(item)}
                                    disabled={loading}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
                                >
                                    {item}
                                    <ArrowUpRight size={13} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((message) => {
                    const isUser = message.role === 'user';

                    return (
                        <div
                            key={message.id}
                            className={`flex items-start gap-3 ${
                                isUser ? 'flex-row-reverse' : ''
                            }`}
                        >
                            <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                    isUser
                                        ? 'bg-slate-100 text-slate-600'
                                        : 'bg-violet-100 text-violet-600'
                                }`}
                            >
                                {isUser ? (
                                    <UserRound size={17} />
                                ) : (
                                    <Sparkles size={17} />
                                )}
                            </div>

                            <div
                                className={`min-w-0 max-w-[90%] sm:max-w-[80%] ${
                                    isUser
                                        ? 'rounded-2xl rounded-tr-sm bg-violet-600 px-4 py-3 text-white'
                                        : 'rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-50 px-4 py-4 text-slate-800'
                                }`}
                            >
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {message.content}
                                </p>

                                {message.role === 'assistant' &&
                                    message.suggestions?.length > 0 && (
                                        <div className="mt-4 border-t border-slate-200 pt-4">
                                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                                                <Lightbulb
                                                    size={16}
                                                    className="text-amber-500"
                                                />
                                                Suggestions
                                            </div>

                                            <ul className="space-y-2.5">
                                                {message.suggestions.map(
                                                    (suggestion, index) => (
                                                        <li
                                                            key={`${message.id}-${index}`}
                                                            className="flex items-start gap-2 text-sm leading-relaxed text-slate-600"
                                                        >
                                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                                            <span>
                                                                {suggestion}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                            </div>
                        </div>
                    );
                })}

                {loading && (
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                            <Sparkles size={17} />
                        </div>

                        <div className="rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-50 px-4 py-3">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="flex gap-1">
                                    {[0, 1, 2].map((index) => (
                                        <span
                                            key={index}
                                            className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400"
                                            style={{
                                                animationDelay:
                                                    `${index * 150}ms`,
                                            }}
                                        />
                                    ))}
                                </span>

                                Analysing your finances...
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Composer */}
            <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
                <form
                    onSubmit={handleSubmit}
                    className="flex items-end gap-3"
                >
                    <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-violet-300 focus-within:bg-white">
                        <label
                            htmlFor="financial-question"
                            className="sr-only"
                        >
                            Ask a financial question
                        </label>

                        <textarea
                            id="financial-question"
                            value={question}
                            onChange={(event) =>
                                setQuestion(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key === 'Enter' &&
                                    !event.shiftKey &&
                                    !event.nativeEvent.isComposing
                                ) {
                                    event.preventDefault();

                                    if (question.trim() && !loading) {
                                        askQuestion(question);
                                    }
                                }
                            }}
                            rows={1}
                            maxLength={500}
                            disabled={loading}
                            placeholder="Ask about your spending..."
                            className="max-h-32 min-h-6 w-full resize-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!question.trim() || loading}
                        aria-label="Send question"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Send size={18} />
                    </button>
                </form>

                <p className="mt-2 text-center text-xs text-slate-400">
                    Answers use your recorded financial data. They may
                    be incomplete or inaccurate.
                </p>
            </div>
        </section>
    );
};

export default FinancialAssistant;