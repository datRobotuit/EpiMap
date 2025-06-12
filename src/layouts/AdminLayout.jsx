import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../pages/Admin/Sidebar';
const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="flex min-h-screen w-full">
            <AdminSidebar />
            <main className="flex-1 min-h-screen w-full bg-white">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;