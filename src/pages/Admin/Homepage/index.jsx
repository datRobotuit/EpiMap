import MapComponent from "../../../components/MapComponent";
import DashboardPanel from "../../../components/DashboardPanel";
import DashboardToggleButton from "../../../components/DashboardToggleButton";
import { useState } from "react";
import React from "react";
export default function AdminHomepage() {
  const [dashboardOpen, setDashboardOpen] = useState(true);
  
      const toggleDashboard = () => {
          setDashboardOpen(!dashboardOpen);
      };
  return (
    <div className="relative min-h-screen bg-gray-100">
      <MapComponent/>
      <DashboardPanel isOpen={dashboardOpen} onToggle={toggleDashboard} />
      <DashboardToggleButton isOpen={dashboardOpen} onToggle={toggleDashboard} />
    </div>
  );
}
