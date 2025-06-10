import React from "react";

export default function AdminCharts() {
  return (
    <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
      {/* Line Chart */}
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 16, minHeight: 260, boxShadow: '0 1px 4px #0001', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontSize: 13, color: '#444', fontWeight: 500 }}>
          Download Chart
          <span style={{ marginLeft: 4, cursor: 'pointer', color: '#aaa' }}>⭳</span>
        </div>
        <svg width="100%" height="160" viewBox="0 0 400 160" style={{ display: 'block', margin: '0 auto 0' }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[...Array(6)].map((_, i) => (
            <line key={i} x1="40" x2="390" y1={30 + i * 22} y2={30 + i * 22} stroke="#e5e7eb" strokeWidth="1" />
          ))}
          {/* Y axis labels */}
          {[90, 70, 50, 30, 10].map((v, i) => (
            <text key={v} x="10" y={35 + i * 44} fontSize="12" fill="#888">₹ {v} L</text>
          ))}
          {/* Line chart */}
          <polyline fill="url(#chartGradient)" stroke="#22c55e" strokeWidth="2" points="40,150 80,120 120,100 160,80 200,60 240,50 280,40 320,30 360,40 390,60 390,160 40,160" />
          {/* X axis labels */}
          {['22 Jul', '23 Jul', '24 Jul', '26 Jul', '28 Jul', '29 Jul', '30 Jul', '31 Jul'].map((d, i) => (
            <text key={d} x={40 + i * 50} y={175} fontSize="12" fill="#888">{d}</text>
          ))}
        </svg>
        <div style={{ textAlign: 'center', color: '#222', fontSize: 15, fontWeight: 500, marginTop: 8 }}>Ca mắc theo thời gian</div>
      </div>
      {/* Pie Chart */}
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 16, minHeight: 260, boxShadow: '0 1px 4px #0001', border: '1px solid #eee' }}>
        <svg width="220" height="160" viewBox="0 0 220 160" style={{ display: 'block', margin: '0 auto' }}>
          {/* Pie chart slices */}
          <circle r="70" cx="110" cy="90" fill="#6c63ff" />
          <path d="M110,90 L110,20 A70,70 0 0,1 200,120 Z" fill="#ffb6b6" />
          <path d="M110,90 L200,120 A70,70 0 1,1 110,20 Z" fill="#48cae4" />
          {/* Pie chart labels */}
          <text x="170" y="60" fontSize="13" fill="#6c63ff">F0</text>
          <text x="60" y="40" fontSize="13" fill="#ffb6b6">F1</text>
          <text x="150" y="150" fontSize="13" fill="#48cae4">F2</text>
          {/* Pie chart values */}
          <text x="170" y="75" fontSize="12" fill="#6c63ff">162.49 29.47%</text>
          <text x="60" y="55" fontSize="12" fill="#ffb6b6">206.38 37.43%</text>
          <text x="150" y="165" fontSize="12" fill="#48cae4">182.52 33.10%</text>
        </svg>
        <div style={{ textAlign: 'center', color: '#222', fontSize: 15, fontWeight: 500, marginTop: 4 }}>Tỉ lệ các loại ca bệnh</div>
      </div>
    </div>
  );
}
