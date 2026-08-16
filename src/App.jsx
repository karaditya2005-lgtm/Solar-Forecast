import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import './App.css';

// Lazy loaded pages for performance
const Home = lazy(() => import('./pages/Home'));
const Predict = lazy(() => import('./pages/Predict'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const History = lazy(() => import('./pages/History'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const SignInPage = lazy(() => import('./pages/SignIn'));
const SignUpPage = lazy(() => import('./pages/SignUp'));
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'));
const Profile = lazy(() => import('./pages/Profile'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Weather = lazy(() => import('./pages/Weather'));

// Loading Skeleton
const LoadingSpinner = () => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '16px', backgroundColor: 'var(--bg-primary)' }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Sun size={48} color="#16A34A" />
    </motion.div>
    <div style={{ color: '#16A34A', fontSize: '1.25rem', fontWeight: '600', fontFamily: 'var(--font-heading)' }}>
      SolarForecast Loading...
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
          </Route>

          {/* Authenticated Application Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="predict" element={<Predict />} />
            <Route path="history" element={<History />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="weather" element={<Weather />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="complete-profile" element={<CompleteProfile />} />
          </Route>
          
          {/* Catch all redirect to public home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
