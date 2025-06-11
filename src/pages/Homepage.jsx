import { useState } from "react";
import DashboardPanel from "../components/DashboardPanel";
import DashboardToggleButton from "../components/DashboardToggleButton";
import MapComponent from "../components/MapComponent";

export default function Homepage() {
    const [dashboardOpen, setDashboardOpen] = useState(true);

    const toggleDashboard = () => {
        setDashboardOpen(!dashboardOpen);
    };

    return (
        <div className="right-0 top-0 fixed z-10 h-full bg-gray-100 transition-all duration-300">
                {/* Background content can go here */}
                {/* <DashboardPanel isOpen={dashboardOpen} onToggle={toggleDashboard} /> */}
                {/* <DashboardToggleButton isOpen={dashboardOpen} onToggle={toggleDashboard} /> */}
            {/* <MapComponent /> */}
            <div className="bg-black text-white p-4">abc</div>
        </div>
    );
}