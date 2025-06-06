# EpiMap

EpiMap là một ứng dụng web hiện đại được phát triển bằng React và Vite, được thiết kế để tạo ra trải nghiệm người dùng mượt mà và hiệu quả.

## Tính năng

- Giao diện người dùng hiện đại và thân thiện
- Được xây dựng với React 19 và Vite 4
- Hỗ trợ đầy đủ các tính năng routing với React Router
- Quản lý state với Zustand
- Styling linh hoạt với TailwindCSS và các thư viện UI như Material UI và Ant Design
- Tương tác API dễ dàng với Axios

## Bắt đầu

### Yêu cầu

- Node.js (phiên bản 16 trở lên)
- npm hoặc yarn

### Cài đặt

```bash
# Clone repository
git clone https://github.com/yourusername/EpiMap.git
cd EpiMap

# Cài đặt dependencies
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
├── public/          # Static assets
├── src/             # Source code
│   ├── assets/      # Images, fonts, etc.
│   ├── App.jsx      # Main application component
│   ├── App.css      # Main application styles
│   ├── main.jsx     # Application entry point
│   └── index.css    # Global styles
├── index.html       # HTML template
├── package.json     # Project dependencies and scripts
└── vite.config.js   # Vite configuration
```

## Công nghệ sử dụng

- [React](https://react.dev/) - Thư viện UI
- [Vite](https://vite.dev/) - Build tool và dev server
- [React Router](https://reactrouter.com/) - Routing
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Material UI](https://mui.com/) - Component library
- [Ant Design](https://ant.design/) - Component library
- [Axios](https://axios-http.com/) - HTTP client

## License

MIT
