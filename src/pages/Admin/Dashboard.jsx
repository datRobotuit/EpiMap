import React from "react";
import AdminSidebar from "./Sidebar";
import AdminCharts from "./Charts";
import AdminReportTable from "./ReportTable";

export default function AdminDashboard() {
  return (
    <div style={{ background: '#F4F6F8', minHeight: '100vh', padding: 0 }}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <AdminSidebar />
        {/* Main content */}
        <main style={{ flex: 1, padding: 32 }}>
          <h2 style={{ fontWeight: 600, fontSize: 20, marginBottom: 24, color: '#222' }}>Báo cáo</h2>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0001' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <span style={{ color: '#222', fontWeight: 500 }}>From</span>
              <input type="date" defaultValue="2023-01-12" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 140, color: '#222' }} />
              <span style={{ color: '#222', fontWeight: 500 }}>to</span>
              <input type="date" defaultValue="2023-01-12" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 140, color: '#222' }} />
              <select style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 140, color: '#222' }}>
                <option>Địa phương</option>
                <option>Hà Nội</option>
                <option>Hồ Chí Minh</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <select style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 140, color: '#222' }}>
                <option>Loại bệnh</option>
                <option>Sốt xuất huyết</option>
                <option>Cúm</option>
              </select>
            </div>
            <AdminCharts />
            <AdminReportTable />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px #7c3aed22' }}>
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 3.333V10M12.5 10V16.667M12.5 10H6.667M12.5 10H18.333" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Export Data
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
