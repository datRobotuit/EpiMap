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
        const isLoggedIn = localStorage.getItem('user');

        if (!isLoggedIn) {
            // If not logged in, redirect to login page
            window.location.href = '/login';
        } else {
            // If logged in, redirect to admin page
            window.location.href = '/admin/home';
        }
    };
    return (
        <div className="relative min-h-screen bg-gray-100">
            <MapComponent />
            <DashboardPanel isOpen={dashboardOpen} onToggle={toggleDashboard} />
            <DashboardToggleButton isOpen={dashboardOpen} onToggle={toggleDashboard} />
            <button
                onClick={handleClick}
                className="absolute top-1 right-2 bg-white hover:bg-white-700 text-blue-700 font-bold py-1 px-3 rounded shadow flex items-center gap-2 transition-colors duration-300"
            >
                Chuyển sang Admin
                <img src="/Epimap.png" alt="EpiMap" className="w-10 h-10" />

            </button>
        </div>
    );
}