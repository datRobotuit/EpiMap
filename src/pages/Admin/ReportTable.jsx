import React from "react";

export default function AdminReportTable({ data = [] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 24 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, fontSize: 15 }}>
        <thead>
          <tr style={{ background: '#f4f6f8', color: '#222', fontWeight: 600 }}>
            <th style={{ padding: 8, border: '1px solid #eee', width: 36 }}></th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>STT</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Mã bệnh nhân</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Tuổi</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Giới tính</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Ngày phát hiện</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Trạng thái</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Tỉnh</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Loại bệnh</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={9} style={{ textAlign: 'center', padding: 16 }}>Không có dữ liệu</td></tr>
          ) : (
            data.map((row, i) => (
              <tr key={row._id || i} style={{ color: '#222' }}>
                <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'center' }}><input type="checkbox" /></td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{i + 1}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.Patient}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.Age}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.Gender}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.Date ? new Date(row.Date).toLocaleDateString() : ''}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.Status}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.Province}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.Type}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
