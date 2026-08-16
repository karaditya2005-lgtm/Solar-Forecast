import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, User, LogOut, Settings, History, ChevronDown, Phone, FileText, LayoutDashboard, Bell } from 'lucide-react';
import Button from './ui/Button';
import { useTheme } from '../context/ThemeContext';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const handleScrollClick = (e, hash) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Update URL hash without jumping
        window.history.pushState(null, '', hash);
      }
    }
  };

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        <Link to="/" className={styles.logo}>
          <div className={styles.iconWrapper}>
            <Sun size={24} className={styles.sunIcon} />
          </div>
          <span className={styles.brand}>SolarForecast</span>
        </Link>
        
        <nav className={styles.navLinks}>
          <Link to="/#hero" onClick={(e) => handleScrollClick(e, '#hero')}>Home</Link>
          <Link to="/#features" onClick={(e) => handleScrollClick(e, '#features')}>Features</Link>
          <Link to="/#about" onClick={(e) => handleScrollClick(e, '#about')}>About</Link>
          <Link to="/#contact" onClick={(e) => handleScrollClick(e, '#contact')}>Contact</Link>
        </nav>

        <div className={styles.navRight} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={toggleTheme} className={styles.themeToggleBtn} aria-label="Toggle Theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <SignedOut>
            <Link to="/sign-in">
              <Button variant="primary">Login</Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <Link to="/app">
              <Button variant="secondary">Dashboard</Button>
            </Link>
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                baseTheme: isDark ? dark : undefined,
                elements: {
                  userButtonAvatarBox: {
                    width: '36px',
                    height: '36px'
                  }
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
