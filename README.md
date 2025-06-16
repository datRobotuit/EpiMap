# EpiMap

EpiMap là ứng dụng web quản lý và trực quan hóa dữ liệu dịch tễ học, hỗ trợ theo dõi, phân tích và truy vết ca bệnh theo thời gian thực. Ứng dụng được xây dựng với React 19, Vite 4, sử dụng các thư viện UI hiện đại và hỗ trợ quản lý trạng thái, routing, cũng như tích hợp API linh hoạt.

## Tính năng nổi bật

- Giao diện trực quan, hiện đại, tối ưu cho desktop và thiết bị di động
- Quản lý danh sách bệnh nhân: thêm, sửa, xóa, lọc, tìm kiếm, xuất Excel
- Truy vết ca bệnh theo từng bệnh nhân
- Thống kê, biểu đồ dịch tễ học theo tỉnh/thành, loại bệnh, thời gian
- Bảng điều khiển tổng quan (dashboard) và bản đồ tương tác
- Phân quyền đăng nhập cho Admin
- Styling linh hoạt với TailwindCSS, Material UI, Ant Design
- Tương tác API dễ dàng với Axios

## Bắt đầu

### Yêu cầu

- Node.js >= 16
- npm hoặc yarn

### Cài đặt

```bash
git clone https://github.com/yourusername/EpiMap.git
cd EpiMap
npm install
```

### Chạy ứng dụng

```bash
# Chạy môi trường development
npm run dev

# Build cho production
npm run build

# Preview phiên bản production
npm run preview
```

## Cấu trúc dự án

```
EpiMap/
├── public/                # Static assets (images, icons, ...)
├── src/
│   ├── apis/              # API service modules
│   ├── assets/            # Ảnh, logo, svg
│   ├── components/        # Các component dùng chung (DashboardPanel, MapComponent, ...)
│   ├── helpers/           # Hàm tiện ích
│   ├── layouts/           # Layouts (AdminLayout, ...)
│   ├── pages/             # Các trang chính (Homepage, Admin, Epidemiology, LogIn, ...)
│   ├── routes/            # Định nghĩa route
│   ├── services/          # Service logic (login, ...)
│   ├── utils/             # Tiện ích, mock data
│   ├── App.jsx            # App root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Project dependencies & scripts
├── vite.config.js         # Vite config
├── tailwind.config.js     # Tailwind config
└── README.md
```

## Công nghệ sử dụng

- [React](https://react.dev/) - Thư viện UI
- [Vite](https://vite.dev/) - Build tool & dev server
- [React Router](https://reactrouter.com/) - Routing
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Material UI](https://mui.com/) & [Ant Design](https://ant.design/) - UI component libraries
- [Axios](https://axios-http.com/) - HTTP client
- [xlsx](https://github.com/SheetJS/sheetjs) - Xuất file Excel
- [file-saver](https://github.com/eligrey/FileSaver.js/) - Lưu file phía client
