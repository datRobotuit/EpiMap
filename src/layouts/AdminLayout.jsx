import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../pages/Admin/Sidebar';
const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="flex ">
            <AdminSidebar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;