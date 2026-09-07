import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import NetworkErrorState from '../components/NetworkErrorState';
import OpeningSplash from '../components/OpeningSplash';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

/**
 * MainLayout.jsx – Wraps all standard pages with Navbar + Footer,
 * page transitions, OpeningSplash intro, and native connection error handling.
 */
export default function MainLayout() {
  const isOnline = useNetworkStatus();
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem('findit_intro_shown');
    } catch (e) {
      return false;
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      {showSplash && <OpeningSplash onComplete={() => setShowSplash(false)} />}
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
