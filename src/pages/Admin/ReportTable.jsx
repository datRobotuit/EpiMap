import React from "react";

export default function AdminReportTable() {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 24 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, fontSize: 15 }}>
        <thead>
          <tr style={{ background: '#f4f6f8', color: '#222', fontWeight: 600 }}>
            <th style={{ padding: 8, border: '1px solid #eee', width: 36 }}></th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>ID</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Họ tên</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Ngày phát hiện</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Ngày khỏi</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Trạng thái</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Nguyên nhân</th>
          </tr>
        </thead>
        <tbody>
          {/* Dữ liệu mẫu giống ảnh */}
          {[...Array(8)].map((_, i) => (
            <tr key={i} style={{ color: '#222' }}>
              <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'center' }}><input type="checkbox" /></td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{i + 1}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>Nguyễn Văn {String.fromCharCode(65 + i)}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>22-07-2023</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>30-07-2023</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{i % 2 === 0 ? 'Khỏi' : 'Đang điều trị'}</td>
              <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'center' }}>
                <svg width="18" height="18" fill="#eee" style={{ verticalAlign: 'middle', borderRadius: 4 }}><rect width="18" height="18" rx="4"/></svg>
                <svg width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2" style={{ marginLeft: 8, verticalAlign: 'middle', cursor: 'pointer' }} viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
