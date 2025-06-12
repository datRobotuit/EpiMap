import { Route, Routes } from "react-router-dom";
import "./index.css";
import AdminLayout from "./layouts/AdminLayout";
import NotFound from "./pages/404";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminHomepage from "./pages/Admin/Homepage";
import Epidemiology from "./pages/Epidemiology";
import Homepage from "./pages/Homepage";
import Login from "./pages/LogIn/Login";
import { routes } from "./routes";

function App() {
  return (
    <Routes>
      <Route path={routes.HOME} element={<Homepage />} />
      <Route path={routes[404]} element={<NotFound />} />
      <Route path={routes.LOGIN} element={<Login />} />
      <Route path="*" element={<NotFound />} />
      <Route element={<AdminLayout />}>
        <Route path={routes.ADMINHOME} element={<AdminHomepage />} />
        <Route path={routes.ADMINREPORT} element={<AdminDashboard />} />
        <Route path={routes.EPIDEMIOLOGY} element={<Epidemiology />} />
      </Route>
    </Routes>
  );
}

export default App;
