import React from "react";

export default function AdminSidebar() {
  return (
    <aside style={{ width: 260, background: '#fff', boxShadow: '2px 0 8px #0001', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', padding: 24, borderBottom: '1px solid #eee' }}>
          <img src="/vite.svg" alt="EpiMap" style={{ width: 36, height: 36, marginRight: 12 }} />
          <span style={{ fontWeight: 700, fontSize: 20, color: '#1976d2', letterSpacing: 1 }}>EPIMAP</span>
        </div>
        <nav style={{ marginTop: 32 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '12px 32px', fontWeight: 600, color: '#1976d2', background: '#f4f6f8', borderRadius: 8, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="20" height="20" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"/></svg>
              Trang chủ
            </li>
            <li style={{ padding: '12px 32px', color: '#333', borderRadius: 8, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="20" height="20" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Thống kê dịch tễ học
            </li>
            <li style={{ padding: '12px 32px', color: '#333', borderRadius: 8, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="20" height="20" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Nhập dữ liệu
            </li>
            <li style={{ padding: '12px 32px', color: '#333', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="20" height="20" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Báo cáo
            </li>
          </ul>
        </nav>
      </div>
      <div style={{ padding: 24, borderTop: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', marginRight: 12 }} />
        <div>
          <div style={{ fontWeight: 600, color: '#222' }}>Josh Harris</div>
          <div style={{ fontSize: 12, color: '#888' }}>josh@protonmail.com</div>
        </div>
      </div>
    </aside>
  );
}
