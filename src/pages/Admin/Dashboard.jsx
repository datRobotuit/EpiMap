import React, { useEffect, useState } from "react";
import AdminSidebar from "./Sidebar";
import AdminCharts from "./Charts";
import AdminReportTable from "./ReportTable";

const provinceNameList = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

export default function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: "2023-01-12",
    toDate: "2023-01-12",
    province: "all",
    typeDisease: "covid19"
  });

  // Hàm callback nhận dữ liệu từ Charts
  const handleChartData = (chartData) => {
    // chartData là object trả về từ API, ví dụ: { patients: [...] }
    setPatients(chartData.patients || []);
  };

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ background: '#F4F6F8', minHeight: '100vh', padding: 0 }}>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* <AdminSidebar /> */}
        {/* Main content */}
        <main style={{ flex: 1, padding: 32 }}>
          <h2 style={{ fontWeight: 600, fontSize: 20, marginBottom: 24, color: '#222' }}>Báo cáo</h2>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0001' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <select name="typeDisease" value={filters.typeDisease} onChange={handleFilterChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 140, color: '#222' }}>
                <option value="covid19">Covid 19</option>
                <option value="cum">Cúm</option>
              </select>
              <span style={{ color: '#222', fontWeight: 500 }}>From</span>
              <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 140, color: '#222' }} />
              <span style={{ color: '#222', fontWeight: 500 }}>to</span>
              <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 140, color: '#222' }} />
              <select name="province" value={filters.province} onChange={handleFilterChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 140, color: '#222' }}>
                <option value="all">Toàn quốc</option>
                {provinceNameList.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            {/* Đã xoá nút Lấy dữ liệu */}
            {/* Nếu còn button Lấy dữ liệu trong AdminCharts thì cần xoá trong file đó */}
            <AdminCharts onData={handleChartData} filters={filters} />
            <AdminReportTable data={patients} />
          </div>
        </main>
      </div>
    </div>
  );
}
