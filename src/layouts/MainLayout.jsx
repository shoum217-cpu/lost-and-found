import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/**
 * MainLayout.jsx – Wraps all standard pages with Navbar + Footer.
 *
 * React Router's <Outlet /> renders the matched child page here.
 * Auth pages (Login, Register) are NOT wrapped in this layout –
 * they use their own full-screen layouts.
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
