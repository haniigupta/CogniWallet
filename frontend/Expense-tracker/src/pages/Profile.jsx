import { useEffect, useState } from 'react';
import {
    User,
    Mail,
    Calendar,
    Shield,
    Lock,
    Eye,
    EyeOff,
    Save,
    LogOut,
    IndianRupee,
    CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../lib/axios.js';
import { API_PATHS } from '../utils/apiPaths.js';
import { useAuth } from '../context/AuthContext.jsx';


const Profile = () => {

    const { user, logout } = useAuth();

    // Profile form
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        currency: 'INR',
    });

    // Password form
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);


    // Load latest profile from backend
    useEffect(() => {

        const loadProfile = async () => {

            try {

                const response = await api.get(API_PATHS.AUTH.ME);

                setProfile({
                    name: response.data.name || '',
                    email: response.data.email || '',
                    currency: response.data.currency || 'INR',
                });

            } catch (error) {

                console.error('Failed to load profile:', error);

                toast.error(
                    error.response?.data?.message ||
                    'Failed to load profile'
                );

            } finally {

                setLoading(false);

            }
        };

        loadProfile();

    }, []);


    // Profile input handler
    const handleProfileChange = (e) => {

        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // Password input handler
    const handlePasswordChange = (e) => {

        const { name, value } = e.target;

        setPasswords((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // Update profile
    const handleProfileSubmit = async (e) => {

        e.preventDefault();

        if (!profile.name.trim()) {
            toast.error('Name is required');
            return;
        }

        if (!profile.email.trim()) {
            toast.error('Email is required');
            return;
        }

        try {

            setSavingProfile(true);

            const response = await api.put(
                API_PATHS.AUTH.UPDATE_PROFILE,
                {
                    name: profile.name.trim(),
                    email: profile.email.trim(),
                    currency: profile.currency,
                }
            );

            setProfile({
                name: response.data.user.name,
                email: response.data.user.email,
                currency: response.data.user.currency,
            });

            toast.success('Profile updated successfully');

        } catch (error) {

            console.error('Profile update error:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to update profile'
            );

        } finally {

            setSavingProfile(false);

        }
    };


    // Change password
    const handlePasswordSubmit = async (e) => {

        e.preventDefault();

        if (!passwords.currentPassword) {
            toast.error('Enter your current password');
            return;
        }

        if (!passwords.newPassword) {
            toast.error('Enter a new password');
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error(
                'New password must be at least 6 characters long'
            );
            return;
        }

        if (
            passwords.newPassword !==
            passwords.confirmPassword
        ) {
            toast.error('New passwords do not match');
            return;
        }

        if (
            passwords.currentPassword ===
            passwords.newPassword
        ) {
            toast.error(
                'New password must be different from current password'
            );
            return;
        }

        try {

            setChangingPassword(true);

            await api.put(
                API_PATHS.AUTH.CHANGE_PASSWORD,
                {
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                }
            );

            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            toast.success('Password changed successfully');

        } catch (error) {

            console.error('Change password error:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to change password'
            );

        } finally {

            setChangingPassword(false);

        }
    };


    const handleLogout = () => {
        logout();
    };


    const getInitials = () => {

        const name =
            profile.name ||
            user?.name ||
            'User';

        return name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0].toUpperCase())
            .join('');
    };


    const formatMemberSince = (date) => {

        if (!date) return '—';

        return new Date(date).toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }
        );
    };


    if (loading) {

        return (
            <div className="flex items-center justify-center py-20">

                <div className="h-8 w-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />

            </div>
        );
    }


    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div>

                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Profile & Settings
                </h1>

                <p className="text-sm text-slate-500 mt-1.5">
                    Manage your personal information, security and preferences.
                </p>

            </div>


            {/* Profile overview */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">

                <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold shrink-0">

                        {getInitials()}

                    </div>


                    <div className="flex-1">

                        <h2 className="text-xl font-semibold text-slate-900">
                            {profile.name || 'User'}
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            {profile.email}
                        </p>

                    </div>


                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">

                        <CheckCircle2 size={16} />

                        Account Active

                    </div>

                </div>

            </div>


            {/* Profile Information */}
            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                <div className="px-6 py-5 border-b border-slate-200">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">

                            <User size={20} />

                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Profile Information
                            </h2>

                            <p className="text-sm text-slate-500">
                                Update your personal information.
                            </p>

                        </div>

                    </div>

                </div>


                <form
                    onSubmit={handleProfileSubmit}
                    className="p-6 space-y-5"
                >

                    {/* Name */}
                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Full Name
                        </label>

                        <div className="relative">

                            <User
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleProfileChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                                placeholder="Enter your full name"
                            />

                        </div>

                    </div>


                    {/* Email */}
                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email Address
                        </label>

                        <div className="relative">

                            <Mail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                                placeholder="Enter your email"
                            />

                        </div>

                    </div>


                    {/* Currency */}
                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Currency
                        </label>

                        <div className="relative">

                            <IndianRupee
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <select
                                name="currency"
                                value={profile.currency}
                                onChange={handleProfileChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                            >

                                <option value="INR">
                                    Indian Rupee (₹)
                                </option>

                                <option value="USD">
                                    US Dollar ($)
                                </option>

                                <option value="EUR">
                                    Euro (€)
                                </option>

                                <option value="GBP">
                                    British Pound (£)
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* Save */}
                    <div className="flex justify-end pt-2">

                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-medium transition"
                        >

                            <Save size={17} />

                            {savingProfile
                                ? 'Saving...'
                                : 'Save Changes'}

                        </button>

                    </div>

                </form>

            </section>


            {/* Security */}
            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                <div className="px-6 py-5 border-b border-slate-200">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

                            <Shield size={20} />

                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Security
                            </h2>

                            <p className="text-sm text-slate-500">
                                Keep your account secure by using a strong password.
                            </p>

                        </div>

                    </div>

                </div>


                <form
                    onSubmit={handlePasswordSubmit}
                    className="p-6 space-y-5"
                >

                    {/* Current password */}
                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Current Password
                        </label>

                        <div className="relative">

                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type={
                                    showCurrentPassword
                                        ? 'text'
                                        : 'password'
                                }
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full pl-10 pr-11 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                placeholder="Enter current password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        !showCurrentPassword
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >

                                {showCurrentPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />}

                            </button>

                        </div>

                    </div>


                    {/* New password */}
                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            New Password
                        </label>

                        <div className="relative">

                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type={
                                    showNewPassword
                                        ? 'text'
                                        : 'password'
                                }
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full pl-10 pr-11 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                placeholder="Enter new password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(
                                        !showNewPassword
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >

                                {showNewPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />}

                            </button>

                        </div>

                    </div>


                    {/* Confirm password */}
                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Confirm New Password
                        </label>

                        <div className="relative">

                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type={
                                    showConfirmPassword
                                        ? 'text'
                                        : 'password'
                                }
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full pl-10 pr-11 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                placeholder="Confirm new password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >

                                {showConfirmPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />}

                            </button>

                        </div>

                    </div>


                    <div className="flex justify-end pt-2">

                        <button
                            type="submit"
                            disabled={changingPassword}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-medium transition"
                        >

                            <Lock size={17} />

                            {changingPassword
                                ? 'Updating...'
                                : 'Change Password'}

                        </button>

                    </div>

                </form>

            </section>


            {/* Account */}
            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                <div className="px-6 py-5 border-b border-slate-200">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">

                            <Calendar size={20} />

                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Account
                            </h2>

                            <p className="text-sm text-slate-500">
                                Account information and actions.
                            </p>

                        </div>

                    </div>

                </div>


                <div className="p-6">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                        <div>

                            <p className="text-sm font-medium text-slate-700">
                                Member since
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                                {formatMemberSince(user?.created_at)}
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium transition"
                        >

                            <LogOut size={17} />

                            Logout

                        </button>

                    </div>

                </div>

            </section>

        </div>
    );
};


export default Profile;