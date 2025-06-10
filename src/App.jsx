import { Route, Routes } from 'react-router-dom'
import './index.css'
import NotFound from './pages/404'
import Homepage from './pages/Homepage'
import Login from './pages/LogIn'
import AdminDashboard from './pages/Admin/Dashboard'
import { routes } from './routes'
function App() {
  return (
    <Routes>
      <Route path={routes.HOME} element={<Homepage />} />
      <Route path={routes[404]} element={<NotFound />} />
      <Route path={routes.LOGIN} element={<Login />} />
      <Route path="*" element={<NotFound />} />
          <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App
