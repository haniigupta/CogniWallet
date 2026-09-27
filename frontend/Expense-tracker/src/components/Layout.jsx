import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="h-screen flex bg-slate-50 overflow-hidden">

            {/* Sidebar */}
            {sidebarOpen && (
                <Sidebar
                    onClose={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">

                <Topbar
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                />

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default Layout;