import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'
import ReportItem from './pages/ReportItem'
import ItemDetails from './pages/ItemDetails'
import Dashboard from './pages/Dashboard'

/**
 * App.jsx – root component.
 * Only handles routing. All shared UI (Navbar, Footer) lives in MainLayout.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Auth pages can have their own minimal layout later */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
