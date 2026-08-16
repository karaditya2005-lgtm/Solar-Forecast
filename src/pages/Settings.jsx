import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Globe, Bell } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';
import { UserProfile } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import styles from './Settings.module.css';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <div className={`container ${styles.settingsPage}`}>
      <motion.div className={styles.header} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-primary">Settings</h1>
        <p className="text-muted">Manage your preferences and account settings.</p>
      </motion.div>

      <div className={styles.grid} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* App Preferences */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className={styles.settingsCard}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.settingIcon}><Sun size={24} /></div>
                <div>
                  <h3>Theme</h3>
                  <p>Toggle between Light and Dark mode</p>
                </div>
              </div>
              <Button variant="secondary" onClick={toggleTheme}>
                {isDark ? 'Switch to Light' : 'Switch to Dark'}
              </Button>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.settingItem} id="notifications">
              <div className={styles.settingInfo}>
                <div className={styles.settingIcon}><Bell size={24} /></div>
                <div>
                  <h3>Notifications</h3>
                  <p>Receive alerts for predictions and reports</p>
                </div>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </Card>
        </motion.div>

        {/* Account Management via Clerk */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <UserProfile 
              routing="hash"
              appearance={{
                baseTheme: isDark ? dark : undefined,
                variables: {
                  colorPrimary: '#16A34A',
                },
                elements: {
                  card: {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    boxShadow: 'none',
                    border: isDark ? '1px solid #334155' : '1px solid #E5E7EB',
                    width: '100%',
                    maxWidth: '100%'
                  },
                  navbar: {
                    display: 'none' // We can hide it or keep it depending on preference, but keeping default is fine. Let's keep it.
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
