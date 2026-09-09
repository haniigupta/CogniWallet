import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Categories from './pages/Categories.jsx';
import Budgets from './pages/Budgets.jsx';
import Insights from './pages/Insights.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

const App = () => {
    return (
        <Routes>

            {/* Public Landing Page */}
            <Route
                path="/"
                element={<LandingPage />}
            />

            {/* Public Auth Pages */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* Protected App Routes */}
            <Route
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/transactions"
                    element={<Transactions />}
                />

                <Route
                    path="/categories"
                    element={<Categories />}
                />

                <Route
                    path="/budgets"
                    element={<Budgets />}
                />

                <Route
                    path="/insights"
                    element={<Insights />}
                />
            </Route>

            {/* Unknown Routes */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
};

export default App;