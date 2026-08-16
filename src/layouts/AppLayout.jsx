import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useUser, useClerk } from '@clerk/clerk-react';
import { 
  Sun, Moon, LayoutDashboard, Zap, History, BarChart2, 
  FileText, CloudRain, User, Settings, LogOut, Menu, 
  Search, Bell, ChevronDown, HelpCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import styles from './AppLayout.module.css';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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

const AppLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Development Preview Mode Check
  const isPreviewMode = import.meta.env.DEV && import.meta.env.VITE_ENABLE_PREVIEW_MODE === "true";

  if (!isLoaded && !isPreviewMode) {
    return <LoadingSpinner />;
  }

  if (!isSignedIn && !isPreviewMode) {
    return <Navigate to="/sign-in" replace />;
  }

  const handleLogout = async () => {
    if (isPreviewMode && !isSignedIn) {
      toast.success("Exited preview mode (Mock Logout)");
      navigate('/');
      return;
    }
    try {
      await signOut();
      navigate('/');
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const activeUser = isPreviewMode && !isSignedIn
    ? {
        fullName: 'Aditya',
        firstName: 'Aditya',
        primaryEmailAddress: { emailAddress: 'preview@solarforecast.local' },
        imageUrl: null
      }
    : user;

  const getUserInitial = () => {
    if (activeUser?.firstName) return activeUser.firstName.charAt(0).toUpperCase();
    if (activeUser?.primaryEmailAddress?.emailAddress) return activeUser.primaryEmailAddress.emailAddress.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className={styles.appLayout}>
      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`${styles.overlay} ${sidebarOpen ? styles.open : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <Sun size={24} color="var(--brand-color)" />
          <span>SolarForecast</span>
        </div>
        
        <nav className={styles.sidebarNav}>
          <NavLink to="/app" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/app/predict" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <Zap size={20} />
            <span>Predict</span>
          </NavLink>
          <NavLink to="/app/history" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <History size={20} />
            <span>Prediction History</span>
          </NavLink>
          <NavLink to="/app/analytics" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <BarChart2 size={20} />
            <span>Analytics</span>
          </NavLink>
          <NavLink to="/app/reports" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <FileText size={20} />
            <span>Reports</span>
          </NavLink>
          <NavLink to="/app/weather" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <CloudRain size={20} />
            <span>Weather</span>
          </NavLink>
          <NavLink to="/app/profile" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
          <NavLink to="/app/settings" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <a href="#" className={styles.navItem}>
            <HelpCircle size={20} />
            <span>Help & Support</span>
          </a>
          <button onClick={handleLogout} className={styles.navItem} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        {/* Top Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className={styles.searchBar}>
              <Search size={18} color="var(--text-secondary)" />
              <input type="text" placeholder="Search..." />
            </div>
            {isPreviewMode && (
              <div style={{ marginLeft: '1rem', padding: '0.25rem 0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#D97706', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '1rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                DEVELOPMENT PREVIEW
              </div>
            )}
          </div>
          
          <div className={styles.headerRight}>
            <button className={styles.iconBtn} aria-label="Notifications">
              <Bell size={20} />
            </button>
            <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle Theme">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className={styles.profileDropdown}>
              <button 
                className={styles.profileBtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className={styles.avatar}>
                  {activeUser?.imageUrl ? (
                    <img src={activeUser.imageUrl} alt="Profile" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                  ) : (
                    getUserInitial()
                  )}
                </div>
                <span className={styles.userName}>{activeUser?.fullName || 'User'}</span>
                <ChevronDown size={16} color="var(--text-secondary)" />
              </button>

              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link to="/app/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <User size={16} /> My Profile
                  </Link>
                  <Link to="/app/settings" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <Settings size={16} /> Settings
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <button onClick={handleLogout} className={styles.dropdownItem} style={{ color: '#E11D48' }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
