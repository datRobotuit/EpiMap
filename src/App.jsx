import { Route, Routes } from 'react-router-dom'
import './index.css'
import Homepage from './pages/Homepage'
import { routes } from './routes'
import NotFound from './pages/404'

function App() {
  return (
    <Routes>
      <Route path={routes.HOME} element={<Homepage />} />
      <Route path={routes[404]} element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
