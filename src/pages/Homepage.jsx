import { useState } from "react";
import DashboardPanel from "../components/DashboardPanel";
import DashboardToggleButton from "../components/DashboardToggleButton";
import MapComponent from "../components/MapComponent";

export default function Homepage() {
    const [dashboardOpen, setDashboardOpen] = useState(true);

    const toggleDashboard = () => {
        setDashboardOpen(!dashboardOpen);
    };
    const handleClick = () => {
        // Check if user is logged in (You might need to adjust this based on your auth system)
        const isLoggedIn = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!isLoggedIn) {
            // If not logged in, redirect to login page
            window.location.href = '/login';
        } else {
            // If logged in, redirect to admin page
            window.location.href = '/admin';
        }
    };
    return (
        <div className="relative min-h-screen bg-gray-100">
            <MapComponent />
            <DashboardPanel isOpen={dashboardOpen} onToggle={toggleDashboard} />
            <DashboardToggleButton isOpen={dashboardOpen} onToggle={toggleDashboard} />
            <button
                onClick={handleClick}
                className="absolute top-4 right-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
            >
                Chuyển sang Admin
            </button>
        </div>
    );
}