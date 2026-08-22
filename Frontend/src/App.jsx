import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import HowItWorks from './pages/HowItWorks';
import AIMatchingFeature from './pages/AIMatchingFeature';
import SmartIdentificationFeature from './pages/SmartIdentificationFeature';
import OwnershipVerificationFeature from './pages/OwnershipVerificationFeature';
import ReportItem from './pages/ReportItem';
import ItemDetails from './pages/ItemDetails';
import MatchResults from './pages/MatchResults';
import Heatmap from './pages/Heatmap';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/search" element={<Navigate to="/explore" replace />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/features/matching" element={<AIMatchingFeature />} />
              <Route path="/features/identification" element={<SmartIdentificationFeature />} />
              <Route path="/features/verification" element={<OwnershipVerificationFeature />} />
              <Route path="/report" element={<ReportItem />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/matches/:id" element={<MatchResults />} />
              <Route path="/heatmap" element={<Heatmap />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Dedicated Authentication Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
