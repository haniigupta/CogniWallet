import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    BarChart3,
    Bell,
    Bot,
    BrainCircuit,
    Check,
    ChevronRight,
    CreditCard,
    IndianRupee,
    LineChart,
    Menu,
    PiggyBank,
    Play,
    ScanLine,
    ShieldCheck,
    Sparkles,
    Target,
    TrendingDown,
    TrendingUp,
    Wallet,
    X,
    Zap,
} from 'lucide-react';

const features = [
    {
        icon: ScanLine,
        title: 'Smart Expense Tracking',
        copy: 'Track every income and expense in one place.',
        tone: 'violet',
    },
    {
        icon: Target,
        title: 'Budget Management',
        copy: 'Create category-wise budgets and stay in control of your spending.',
        tone: 'green',
    },
    {
        icon: BrainCircuit,
        title: 'AI Financial Insights',
        copy: 'Get personalized recommendations based on your spending habits.',
        tone: 'orange',
    },
    {
        icon: BarChart3,
        title: 'Spending Analytics',
        copy: 'Understand where your money goes with clear charts and visualizations.',
        tone: 'blue',
    },
    {
        icon: PiggyBank,
        title: 'Savings Recommendations',
        copy: 'Discover practical ways to save more money every month.',
        tone: 'green',
    },
    {
        icon: ShieldCheck,
        title: 'Financial Health Score',
        copy: 'Get an AI-powered score that helps you understand your financial health.',
        tone: 'violet',
    },
];

const transactions = [
    {
        icon: CreditCard,
        name: 'Swiggy',
        type: 'Food & Dining',
        amount: '-₹840',
        color: 'orange',
    },
    {
        icon: IndianRupee,
        name: 'Salary Credit',
        type: 'Income',
        amount: '+₹75,000',
        color: 'green',
    },
    {
        icon: Wallet,
        name: 'Uber',
        type: 'Transport',
        amount: '-₹320',
        color: 'blue',
    },
];

const LandingPage = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-900">

            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
                <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">

                    <a
                        href="#top"
                        className="flex items-center gap-2.5 font-semibold tracking-tight"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg">
                            <Wallet size={18} />
                        </span>

                        <span className="text-lg">
                            Cogni
                            <span className="text-violet-600">
                                Wallet
                            </span>
                        </span>
                    </a>

                    <div className="hidden items-center gap-8 text-sm text-slate-500 md:flex">
                        <a href="#features" className="transition hover:text-slate-900">
                            Features
                        </a>

                        <a href="#how-it-works" className="transition hover:text-slate-900">
                            How It Works
                        </a>

                        <a href="#ai-insights" className="transition hover:text-slate-900">
                            AI Insights
                        </a>

                        <a href="#about" className="transition hover:text-slate-900">
                            About
                        </a>
                    </div>

                    <div className="hidden items-center gap-3 md:flex">

                        <Link
                            to="/login"
                            className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                            Sign In
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-700"
                        >
                            Get Started
                        </Link>

                    </div>

                    <button
                        aria-label="Toggle menu"
                        className="rounded-lg p-2 md:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                </div>

                {menuOpen && (
                    <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden">

                        <div className="flex flex-col gap-4 text-sm">

                            <a
                                href="#features"
                                onClick={() => setMenuOpen(false)}
                            >
                                Features
                            </a>

                            <a
                                href="#how-it-works"
                                onClick={() => setMenuOpen(false)}
                            >
                                How It Works
                            </a>

                            <a
                                href="#ai-insights"
                                onClick={() => setMenuOpen(false)}
                            >
                                AI Insights
                            </a>

                            <Link
                                to="/register"
                                className="font-semibold text-violet-600"
                            >
                                Get Started
                            </Link>

                        </div>

                    </div>
                )}

            </nav>


            {/* HERO SECTION */}

            <section
                id="top"
                className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 pb-20 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-28 lg:pt-24"
            >

                <div className="relative z-10 animate-fade-up">

                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-2 text-xs font-semibold text-violet-600">

                        <Sparkles size={14} />

                        AI-Powered Personal Finance for India 🇮🇳

                    </div>


                    <h1 className="max-w-2xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">

                        Take control of your money.

                        <br />

                        <span className="text-violet-600">
                            Let AI
                        </span>

                        {' '}do the thinking.

                    </h1>


                    <p className="mt-7 max-w-lg text-lg leading-8 text-slate-500">

                        Track expenses, manage budgets, and get personalized
                        AI-powered insights to make smarter financial decisions.

                    </p>


                    <div className="mt-9 flex flex-wrap items-center gap-3">

                        <Link
                            to="/register"
                            className="group inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-violet-700"
                        >

                            Get Started Free

                            <ArrowRight
                                size={16}
                                className="transition-transform group-hover:translate-x-1"
                            />

                        </Link>


                        <a
                            href="#features"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold transition hover:border-violet-300 hover:bg-slate-50"
                        >

                            <Play
                                size={15}
                                className="fill-current text-violet-600"
                            />

                            Explore Features

                        </a>

                    </div>


                    <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">

                        <div className="flex -space-x-2">

                            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-violet-100 text-xs font-bold text-violet-600">
                                AK
                            </span>

                            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-xs font-bold text-emerald-700">
                                RS
                            </span>

                            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-orange-100 text-xs font-bold text-orange-700">
                                M
                            </span>

                        </div>

                        <span>

                            <strong className="text-slate-900">
                                AI-powered
                            </strong>

                            {' '}finance management

                        </span>

                    </div>

                </div>


                <DashboardPreview />

            </section>


            {/* QUICK FEATURES */}

            <section className="border-y border-slate-200 bg-white">

                <div className="mx-auto grid max-w-7xl gap-px px-5 sm:grid-cols-3 lg:px-8">

                    {[
                        {
                            icon: ScanLine,
                            title: 'Track Every Rupee',
                            copy: 'All your money, one clear view.',
                        },
                        {
                            icon: Target,
                            title: 'Smart Budgeting',
                            copy: 'Plans that flex with real life.',
                        },
                        {
                            icon: Zap,
                            title: 'AI-Powered Insights',
                            copy: 'Advice that gets more personal.',
                        },
                    ].map(({ icon: Icon, title, copy }) => (

                        <div
                            key={title}
                            className="flex items-center gap-4 py-8 sm:border-r sm:border-slate-200 sm:px-8 sm:first:pl-0 sm:last:border-0"
                        >

                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">

                                <Icon size={21} />

                            </span>

                            <div>

                                <p className="font-semibold">
                                    {title}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    {copy}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </section>


            {/* FEATURES */}

            <section
                id="features"
                className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32"
            >

                <div className="max-w-2xl">

                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
                        One Clear Picture
                    </p>

                    <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">

                        Everything you need to manage your money smarter.

                    </h2>

                    <p className="mt-5 text-lg leading-8 text-slate-500">

                        Less spreadsheet stress.
                        More confidence in every financial decision.

                    </p>

                </div>


                <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                    {features.map(
                        ({ icon: Icon, title, copy, tone }, index) => (

                            <article
                                key={title}
                                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
                            >

                                <div
                                    className={`mb-10 flex h-11 w-11 items-center justify-center rounded-xl
                                    ${
                                        tone === 'green'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : tone === 'orange'
                                            ? 'bg-orange-100 text-orange-700'
                                            : tone === 'blue'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-violet-100 text-violet-600'
                                    }`}
                                >

                                    <Icon size={21} />

                                </div>


                                <p className="mb-2 text-xs font-semibold text-slate-400">

                                    0{index + 1}

                                </p>


                                <h3 className="text-lg font-semibold">
                                    {title}
                                </h3>


                                <p className="mt-2 leading-6 text-slate-500">
                                    {copy}
                                </p>


                                <ChevronRight
                                    size={17}
                                    className="mt-5 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-violet-600"
                                />

                            </article>

                        )
                    )}

                </div>

            </section>


            {/* HOW IT WORKS */}

            <section
                id="how-it-works"
                className="bg-slate-950 px-5 py-24 text-white lg:px-8 lg:py-28"
            >

                <div className="mx-auto max-w-7xl">

                    <div className="max-w-xl">

                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-violet-300">
                            Simple By Design
                        </p>

                        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">

                            A better relationship with your money,
                            in three steps.

                        </h2>

                    </div>


                    <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">

                        <div className="absolute left-[16%] right-[16%] top-6 hidden border-t border-white/15 md:block" />

                        {[
                            {
                                icon: Wallet,
                                title: 'Track Your Money',
                                copy: 'Add income and expenses in seconds and keep everything organized.',
                            },
                            {
                                icon: LineChart,
                                title: 'Understand Your Spending',
                                copy: 'See patterns, trends, and categories shaping your financial life.',
                            },
                            {
                                icon: Sparkles,
                                title: 'Get AI Insights',
                                copy: 'Receive practical recommendations based on your actual spending.',
                            },
                        ].map(({ icon: Icon, title, copy }, index) => (

                            <div key={title} className="relative">

                                <span className="relative z-10 mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-violet-300/30 bg-slate-950 text-violet-300 ring-8 ring-slate-950">

                                    <Icon size={21} />

                                </span>


                                <p className="mb-3 text-sm font-medium text-white/40">

                                    STEP 0{index + 1}

                                </p>


                                <h3 className="text-xl font-semibold">
                                    {title}
                                </h3>


                                <p className="mt-3 max-w-xs leading-7 text-white/55">
                                    {copy}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* AI INSIGHTS */}

            <section
                id="ai-insights"
                className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 lg:grid-cols-2 lg:px-8 lg:py-32"
            >

                <div>

                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
                        The AI Advantage
                    </p>

                    <h2 className="max-w-lg text-4xl font-semibold tracking-tight sm:text-5xl">

                        Your personal financial intelligence.

                    </h2>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">

                        CogniWallet analyzes your transactions and spending
                        behavior to help you make better financial decisions.

                    </p>


                    <div className="mt-8 space-y-4">

                        {[
                            'Identify unusual spending patterns',
                            'Discover opportunities to save money',
                            'Understand your financial habits',
                        ].map((item) => (

                            <div
                                key={item}
                                className="flex items-center gap-3"
                            >

                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">

                                    <Check size={14} />

                                </span>

                                {item}

                            </div>

                        ))}

                    </div>

                </div>


                <AIInsightCard />

            </section>


            {/* ABOUT INDIA */}

            <section
                id="about"
                className="border-y border-slate-200 bg-slate-100 px-5 py-24 lg:px-8"
            >

                <div className="mx-auto max-w-7xl">

                    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

                        <div>

                            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
                                Made For Here
                            </p>

                            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">

                                Built for Indian wallets 🇮🇳

                            </h2>

                        </div>


                        <p className="max-w-md leading-7 text-slate-500">

                            From your morning chai to your monthly savings,
                            CogniWallet understands the rhythm of money in India.

                        </p>

                    </div>


                    <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">

                        {[
                            {
                                name: 'Food & Dining',
                                value: '₹6,840',
                                icon: CreditCard,
                            },
                            {
                                name: 'Transport',
                                value: '₹2,320',
                                icon: TrendingUp,
                            },
                            {
                                name: 'Bills & Utilities',
                                value: '₹4,120',
                                icon: Bell,
                            },
                            {
                                name: 'Investments',
                                value: '₹12,500',
                                icon: TrendingDown,
                            },
                            {
                                name: 'UPI Payments',
                                value: '₹18,240',
                                icon: ScanLine,
                            },
                            {
                                name: 'Salary',
                                value: '₹75,000',
                                icon: IndianRupee,
                            },
                            {
                                name: 'Freelancing',
                                value: '₹14,500',
                                icon: Zap,
                            },
                            {
                                name: 'Shopping',
                                value: '₹3,890',
                                icon: Wallet,
                            },
                        ].map(({ name, value, icon: Icon }) => (

                            <div
                                key={name}
                                className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 sm:p-5"
                            >

                                <Icon
                                    size={19}
                                    className="text-violet-600"
                                />

                                <p className="mt-6 text-sm text-slate-500">
                                    {name}
                                </p>

                                <p className="mt-1 text-lg font-semibold">
                                    {value}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* CTA */}

            <section className="px-5 py-20 lg:px-8 lg:py-28">

                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-violet-600 px-7 py-16 text-center text-white sm:px-12">

                    <div className="relative mx-auto max-w-2xl">

                        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">

                            Start Today

                        </p>


                        <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">

                            Your money deserves better decisions.

                        </h2>


                        <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-violet-100">

                            Start tracking your finances and discover smarter
                            ways to manage your money.

                        </p>


                        <Link
                            to="/register"
                            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:-translate-y-1"
                        >

                            Get Started Free

                            <ArrowRight size={17} />

                        </Link>


                        <p className="mt-4 text-xs text-violet-200">
                            No credit card required
                        </p>

                    </div>

                </div>

            </section>


            {/* FOOTER */}

            <footer className="border-t border-slate-200 px-5 py-10 lg:px-8">

                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">

                    <div>

                        <div className="flex items-center gap-2.5 font-semibold">

                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">

                                <Wallet size={16} />

                            </span>

                            Cogni
                            <span className="text-violet-600">
                                Wallet
                            </span>

                        </div>


                        <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">

                            AI-powered personal finance management built for
                            smarter financial decisions.

                        </p>

                    </div>


                    <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">

                        <a href="#features">
                            Features
                        </a>

                        <a href="#ai-insights">
                            AI Insights
                        </a>

                        <a href="#about">
                            About
                        </a>

                        <Link to="/login">
                            Sign In
                        </Link>

                    </div>

                </div>


                <div className="mx-auto mt-10 max-w-7xl border-t border-slate-200 pt-6 text-xs text-slate-500">

                    © 2026 CogniWallet. All rights reserved.

                </div>

            </footer>

        </main>
    );
};


const DashboardPreview = () => {
    return (

        <div className="relative animate-float">

            <div className="absolute -left-6 top-16 z-20 hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold shadow-xl sm:flex">

                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">

                    <TrendingUp size={14} />

                </span>

                <span>

                    +12.8%

                    <small className="ml-1 block font-normal text-slate-500">
                        savings rate
                    </small>

                </span>

            </div>


            <div className="absolute -right-3 -top-8 z-20 hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold shadow-xl sm:flex">

                <Sparkles
                    size={15}
                    className="text-violet-600"
                />

                AI is on your side

            </div>


            <div className="relative rounded-[1.7rem] border border-slate-200 bg-slate-950 p-2 shadow-2xl sm:p-3">

                <div className="rounded-2xl bg-white p-4 sm:p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-xs text-slate-500">
                                Good morning!
                            </p>

                            <p className="mt-1 text-lg font-semibold">
                                Your money at a glance
                            </p>

                        </div>


                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-600">

                            <Bell size={16} />

                        </span>

                    </div>


                    <div className="mt-5 rounded-2xl bg-violet-600 p-5 text-white">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-xs text-violet-200">
                                    Total Balance
                                </p>

                                <p className="mt-1 text-3xl font-semibold tracking-tight">
                                    ₹1,24,500
                                </p>

                            </div>

                            <Wallet
                                size={20}
                                className="text-violet-200"
                            />

                        </div>


                        <div className="mt-5 flex justify-between text-xs text-violet-200">

                            <span>•••• 4281</span>

                            <span>Updated just now</span>

                        </div>

                    </div>


                    <div className="mt-4 grid grid-cols-3 gap-2">

                        <MiniStat
                            label="Income"
                            value="₹75,000"
                            positive
                        />

                        <MiniStat
                            label="Expenses"
                            value="₹32,400"
                        />

                        <MiniStat
                            label="Saved"
                            value="56%"
                            positive
                        />

                    </div>


                    <div className="mt-4 rounded-2xl border border-slate-200 p-4">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-semibold">
                                    Cash Flow
                                </p>

                                <p className="text-xs text-slate-500">
                                    This month
                                </p>

                            </div>


                            <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">

                                +₹42,600

                            </span>

                        </div>


                        <div className="mt-5 flex h-20 items-end gap-2">

                            {[35, 48, 42, 67, 54, 74, 64, 82, 68, 90, 78, 96].map(
                                (height, i) => (

                                    <div
                                        key={i}
                                        className="group flex flex-1 items-end"
                                    >

                                        <span
                                            style={{
                                                height: `${height}%`,
                                            }}
                                            className="w-full rounded-t-sm bg-violet-600 transition-all group-hover:bg-violet-400"
                                        />

                                    </div>

                                )
                            )}

                        </div>


                        <div className="mt-2 flex justify-between text-[10px] text-slate-400">

                            <span>Jan</span>

                            <span>Jun</span>

                            <span>Dec</span>

                        </div>

                    </div>


                    <div className="mt-4">

                        <div className="mb-3 flex justify-between">

                            <p className="text-sm font-semibold">
                                Recent Transactions
                            </p>

                            <span className="text-xs font-semibold text-violet-600">
                                See all
                            </span>

                        </div>


                        <div className="space-y-2">

                            {transactions.map(
                                ({
                                    icon: Icon,
                                    name,
                                    type,
                                    amount,
                                    color,
                                }) => (

                                    <div
                                        key={name}
                                        className="flex items-center justify-between"
                                    >

                                        <div className="flex items-center gap-2.5">

                                            <span
                                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                                    color === 'green'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : color === 'orange'
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}
                                            >

                                                <Icon size={14} />

                                            </span>


                                            <div>

                                                <p className="text-xs font-semibold">
                                                    {name}
                                                </p>

                                                <p className="text-[10px] text-slate-500">
                                                    {type}
                                                </p>

                                            </div>

                                        </div>


                                        <span
                                            className={`text-xs font-semibold ${
                                                amount.startsWith('+')
                                                    ? 'text-emerald-600'
                                                    : 'text-slate-700'
                                            }`}
                                        >

                                            {amount}

                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
};


const AIInsightCard = () => {
    return (

        <div className="relative mx-auto w-full max-w-md">

            <div className="absolute -inset-8 rounded-full bg-violet-100 blur-3xl" />

            <div className="relative rounded-3xl border border-violet-200 bg-white p-5 shadow-2xl">

                <div className="flex items-center justify-between border-b border-slate-200 pb-5">

                    <div className="flex items-center gap-3">

                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">

                            <Bot size={20} />

                        </span>


                        <div>

                            <p className="font-semibold">
                                Cogni AI
                            </p>

                            <p className="text-xs text-slate-500">
                                Your weekly money check-in
                            </p>

                        </div>

                    </div>


                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        AI Ready

                    </span>

                </div>


                <div className="mt-6 rounded-2xl bg-slate-100 p-5">

                    <div className="flex items-end justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Financial Health Score
                            </p>

                            <p className="mt-1 text-4xl font-semibold">

                                82

                                <span className="text-base text-slate-500">
                                    {' '}/ 100
                                </span>

                            </p>

                        </div>


                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-emerald-400 text-sm font-bold text-emerald-700">

                            82%

                        </div>

                    </div>


                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">

                        <div className="h-full w-[82%] rounded-full bg-emerald-500" />

                    </div>

                </div>


                <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-5">

                    <div className="flex gap-3">

                        <Sparkles
                            size={18}
                            className="mt-0.5 shrink-0 text-orange-600"
                        />

                        <div>

                            <p className="text-sm font-semibold text-orange-950">
                                AI Spending Insight
                            </p>

                            <p className="mt-2 text-sm leading-6 text-orange-900/75">

                                Your food delivery spending increased by 18%
                                this month.

                            </p>

                            <p className="mt-4 text-sm font-semibold text-orange-800">

                                Potential savings

                                <span className="ml-1 text-lg">
                                    ₹2,400/month
                                </span>

                            </p>

                        </div>

                    </div>

                </div>


                <p className="mt-5 text-center text-xs text-slate-500">

                    Reduce food delivery by 2 orders per week to improve
                    monthly savings.

                </p>

            </div>

        </div>

    );
};


const MiniStat = ({
    label,
    value,
    positive = false,
}) => {

    return (

        <div className="rounded-xl border border-slate-200 bg-white p-2.5">

            <p className="text-[10px] text-slate-500">
                {label}
            </p>

            <p
                className={`mt-1 text-xs font-bold ${
                    positive
                        ? 'text-emerald-600'
                        : 'text-slate-900'
                }`}
            >

                {value}

            </p>

        </div>

    );
};


export default LandingPage;