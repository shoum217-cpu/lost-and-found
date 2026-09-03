import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import NetworkErrorState from '../components/NetworkErrorState';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

/**
 * MainLayout.jsx – Wraps all standard pages with Navbar + Footer,
 * page transitions, and native connection error handling.
 */
export default function MainLayout() {
  const isOnline = useNetworkStatus();

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {!isOnline ? (
          <NetworkErrorState />
        ) : (
          <PageTransition>
            <Outlet />
          </PageTransition>
        )}
      </main>
      <Footer />
    </div>
  );
}
