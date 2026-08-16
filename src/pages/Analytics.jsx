import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Award, Zap } from 'lucide-react';
import styles from './Dashboard.module.css'; // Reuse Dashboard styles for consistency

const Analytics = () => {
  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Analytics</h1>
            <p className={styles.subtitle}>Detailed analysis of your solar generation and model performance.</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Average Power</p>
              <h3 className={styles.statValue}>4.2 kW</h3>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              <Zap size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Peak Power</p>
              <h3 className={styles.statValue}>6.8 kW</h3>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
              <Award size={24} />
            </div>
            <div>
              <p className={styles.statLabel}>Model Accuracy (R²)</p>
              <h3 className={styles.statValue}>95.2%</h3>
            </div>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Daily Generation</h3>
            <div className={styles.chartContainer}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                [Interactive Chart Placeholder - Daily Generation]
              </div>
            </div>
          </div>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Weekly Generation</h3>
            <div className={styles.chartContainer}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                [Interactive Chart Placeholder - Weekly Generation]
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.chartCard} style={{ marginTop: '2rem' }}>
          <h3 className={styles.chartTitle}>Model Performance (MAE, RMSE)</h3>
          <div className={styles.chartContainer}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
              [Interactive Chart Placeholder - Model Metrics]
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
