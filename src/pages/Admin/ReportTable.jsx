import React from "react";

// columns cho ReportTable đúng thứ tự yêu cầu
const columns = [
  { title: 'STT', dataIndex: 'index', key: 'index', render: (_, __, idx) => idx + 1 },
  { title: 'Tỉnh/Thành phố', dataIndex: 'Province', key: 'Province' },
  { title: 'Ngày', dataIndex: 'Date', key: 'Date', render: (d) => d ? d.split('T')[0] : '' },
  { title: 'Loại bệnh', dataIndex: 'Type', key: 'Type' },
  { title: 'Ca mắc mới', dataIndex: 'DailyInfection', key: 'DailyInfection' },
  { title: 'Tử vong mới', dataIndex: 'DailyDeath', key: 'DailyDeath' },
  { title: 'Tổng ca mắc', dataIndex: 'TotalInfections', key: 'TotalInfections' },
  { title: 'Đang điều trị', dataIndex: 'TotalTreatment', key: 'TotalTreatment' },
  { title: 'Khỏi', dataIndex: 'TotalRecover', key: 'TotalRecover' },
  { title: 'Tổng tử vong', dataIndex: 'TotalDeath', key: 'TotalDeath' },
];

export default function AdminReportTable({ data = [] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 24 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, fontSize: 15 }}>
        <thead>
          <tr style={{ background: '#f4f6f8', color: '#222', fontWeight: 600 }}>
            <th style={{ padding: 8, border: '1px solid #eee', width: 36 }}></th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>STT</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Tỉnh/Thành phố</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Ngày</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Loại bệnh</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Ca mắc mới</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Tử vong mới</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Tổng ca mắc</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Đang điều trị</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Khỏi</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Tổng tử vong</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={11} style={{ textAlign: 'center', padding: 16 }}>Không có dữ liệu</td></tr>
          ) : (
            data.map((row, i) => (
              <tr key={row._id || i} style={{ color: '#222' }}>
                <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'center' }}><input type="checkbox" /></td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{i + 1}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.Province}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.Date instanceof Date ? row.Date.toISOString().split('T')[0] : (row.Date ? row.Date.split('T')[0] : '')}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.Type}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.DailyInfection}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.DailyDeath}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.TotalInfections}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.TotalTreatment}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.TotalRecover}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{row.TotalDeath}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
