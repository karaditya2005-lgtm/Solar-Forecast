import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, Cloud, Sun, Sunrise, Sunset } from 'lucide-react';
import styles from './Dashboard.module.css';

const Weather = () => {
  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Weather Conditions</h1>
            <p className={styles.subtitle}>Current weather metrics and forecasts affecting solar generation.</p>
          </div>
        </div>

        <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
              <Thermometer size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Temperature</p>
              <h3 className={styles.statValue}>28°C</h3>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
              <Droplets size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Humidity</p>
              <h3 className={styles.statValue}>45%</h3>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              <Wind size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Wind Speed</p>
              <h3 className={styles.statValue}>12 km/h</h3>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(107, 114, 128, 0.1)', color: '#6B7280' }}>
              <Cloud size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Cloud Cover</p>
              <h3 className={styles.statValue}>15%</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
              <Sun size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Solar Irradiance</p>
              <h3 className={styles.statValue}>850 W/m²</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
              <Sunrise size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Sunrise</p>
              <h3 className={styles.statValue}>06:15 AM</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}>
              <Sunset size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Sunset</p>
              <h3 className={styles.statValue}>07:45 PM</h3>
            </div>
          </div>
        </div>

        <div className={styles.chartsGrid} style={{ marginTop: '2rem' }}>
          <div className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
            <h3 className={styles.chartTitle}>5-Day Forecast</h3>
            <div className={styles.chartContainer}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                [Forecast Component Placeholder]
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Weather;
