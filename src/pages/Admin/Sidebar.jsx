import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Trang chủ",
    route: "/admin/home", // ADMINHOME
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
      </svg>
    ),
    isActive: true,
  },
  {
    label: "Thống kê dịch tễ học",
    route: "/admin/epidemiology", // EPIDEMIOLOGY
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    label: "Báo cáo",
    route: "/admin/report", // ADMINREPORT
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className="flex flex-col justify-between h-screen bg-white shadow-lg"
      style={{ width: 260 }}
    >
      <div>
        <div className="flex items-center gap-3 px-8 py-6 border-b border-gray-100">
          <img src="/Epimap.png" alt="EpiMap" className="w-24 h-24" />
          <span
            className="font-extrabold text-xl text-primary tracking-wide"
            style={{ color: "#1976d2" }}
          >
            EPIMAP
          </span>
        </div>
        <nav className="mt-8">
          <ul className="space-y-2 px-2">
            {navItems.map((item, idx) => {
              const isActive = location.pathname === item.route;
              return (
                <li
                  key={item.label}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg cursor-pointer transition-all group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-100 to-blue-50 text-primary font-bold shadow"
                        : "text-gray-700 hover:bg-blue-50 hover:text-primary"
                    }`}
                  style={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 15,
                    marginBottom: idx === navItems.length - 1 ? 0 : 4,
                  }}
                  onClick={() => navigate(item.route)}
                >
                  <span
                    className={`transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-gray-400 group-hover:text-primary"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      {/* <div className="flex items-center gap-3 px-6 py-6 border-t border-gray-100 bg-white/80">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="avatar"
          className="w-9 h-9 rounded-full border-2 border-blue-200 shadow"
        />
        <div>
          <div className="font-semibold text-gray-800">Josh Harris</div>
          <div className="text-xs text-gray-500">josh@protonmail.com</div>
        </div>
      </div> */}
    </aside>
  );
}
