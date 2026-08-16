import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, TrendingUp, Target, Activity, CloudRain, Wind, Droplets, 
  Sun, MapPin, Cpu, ArrowRight, CheckCircle2, FileText, BarChart2,
  Calendar, Thermometer
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Button from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';
import styles from './Dashboard.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('today');

  // Chart Configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: isDark ? '#94A3B8' : '#6B7280', usePointStyle: true, boxWidth: 8 }
      },
      tooltip: {
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        titleColor: isDark ? '#F8FAFC' : '#111827',
        bodyColor: isDark ? '#CBD5E1' : '#4B5563',
        borderColor: isDark ? '#334155' : '#E5E7EB',
        borderWidth: 1,
        padding: 12,
      }
    },
    scales: {
      x: { 
        grid: { color: isDark ? '#1E293B' : '#F3F4F6', drawBorder: false },
        ticks: { color: isDark ? '#94A3B8' : '#6B7280' }
      },
      y: { 
        grid: { color: isDark ? '#1E293B' : '#F3F4F6', drawBorder: false },
        ticks: { color: isDark ? '#94A3B8' : '#6B7280' }
      }
    },
    interaction: { mode: 'index', intersect: false }
  };

  const lineData = {
    labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    datasets: [
      {
        label: 'Actual (kWh)',
        data: [0.5, 2.1, 4.5, 5.8, 4.2, 2.0, 0.2],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Predicted (kWh)',
        data: [0.6, 2.3, 4.2, 6.0, 4.5, 2.2, 0.1],
        borderColor: '#6366F1',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  };

  // Mock Recent Predictions
  const recentPredictions = [
    { id: 1, date: 'Today, 12:30 PM', temp: '32°C', irr: '820 W/m²', power: '5.8 kWh', acc: '95%', status: 'Excellent' },
    { id: 2, date: 'Today, 10:00 AM', temp: '29°C', irr: '650 W/m²', power: '4.5 kWh', acc: '92%', status: 'Good' },
    { id: 3, date: 'Yesterday, 2:00 PM', temp: '34°C', irr: '780 W/m²', power: '5.1 kWh', acc: '88%', status: 'Average' },
    { id: 4, date: 'Yesterday, 11:30 AM', temp: '31°C', irr: '850 W/m²', power: '6.2 kWh', acc: '96%', status: 'Excellent' }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Excellent': return styles.statusExcellent;
      case 'Good': return styles.statusGood;
      case 'Average': return styles.statusAverage;
      default: return '';
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Dashboard Hero */}
      <motion.div 
        className={styles.heroSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroGreeting}>Welcome Back, Aditya</div>
          <h1 className={styles.heroTitle}>Your solar energy intelligence at a glance.</h1>
          
          <div className={styles.heroStats}>
            <div>
              <span style={{color: 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: 600}}>TODAY'S ESTIMATED GENERATION</span>
              <div className={styles.heroValue}>5.8 kWh</div>
            </div>
            <div className={styles.heroTrend}>+12.4% vs yesterday</div>
          </div>
          
          <div className={styles.heroActions}>
            <Button variant="primary" onClick={() => navigate('/app/predict')}>Predict Now</Button>
            <Button variant="secondary" onClick={() => navigate('/app/analytics')}>View Analytics</Button>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <img src="/assets/solar_hero.png" alt="Solar Panels" className={styles.heroImage} />
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {[
          { title: "Today's Generation", value: '5.8 kWh', trend: '+12.4%', positive: true, icon: Zap },
          { title: 'Average Generation', value: '5.2 kWh', trend: '+8.2%', positive: true, icon: Activity },
          { title: 'Total Predictions', value: '128', trend: '+14 this week', positive: true, icon: Target },
          { title: 'Model Accuracy', value: '94.7%', trend: '+1.8%', positive: true, icon: CheckCircle2 }
        ].map((kpi, idx) => (
          <motion.div 
            key={idx} className={styles.kpiCard}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (idx * 0.1) }}
          >
            <div className={styles.kpiHeader}>
              <div className={styles.kpiIconWrapper} style={{ background: kpi.positive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: kpi.positive ? '#10B981' : '#EF4444' }}>
                <kpi.icon size={24} />
              </div>
              <div className={`${styles.kpiTrend} ${kpi.positive ? styles.positive : styles.negative}`}>
                {kpi.trend}
              </div>
            </div>
            <div className={styles.kpiTitle}>{kpi.title}</div>
            <div className={styles.kpiValue}>{kpi.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Charts & AI & Weather */}
      <div className={styles.mainGrid}>
        
        {/* Left Column: Chart & Weather */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Chart */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                <TrendingUp size={20} /> Solar Energy Generation
              </div>
              <div className={styles.chartTabs}>
                {['today', 'week', 'month'].map(tab => (
                  <button 
                    key={tab} 
                    className={`${styles.chartTab} ${activeTab === tab ? styles.active : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.chartContainer}>
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>

          {/* Weather Card */}
          <div className={`${styles.card} ${styles.weatherCard}`}>
            <div className={styles.weatherHeader}>
              <div>
                <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>Live Weather Conditions</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
                  Excellent solar conditions today.
                </p>
              </div>
            </div>
            
            <div className={styles.weatherMain}>
              <img src="/assets/weather_sun.png" alt="Sunny" className={styles.weatherIllustration} />
              <div className={styles.weatherTemp}>32°C</div>
            </div>

            <div className={styles.weatherMetrics}>
              <div className={styles.wMetric}>
                <Droplets className={styles.wMetricIcon} size={20} />
                <div className={styles.wMetricInfo}><span>Humidity</span><strong>68%</strong></div>
              </div>
              <div className={styles.wMetric}>
                <Wind className={styles.wMetricIcon} size={20} />
                <div className={styles.wMetricInfo}><span>Wind Speed</span><strong>10 km/h</strong></div>
              </div>
              <div className={styles.wMetric}>
                <CloudRain className={styles.wMetricIcon} size={20} />
                <div className={styles.wMetricInfo}><span>Cloud Cover</span><strong>15%</strong></div>
              </div>
              <div className={styles.wMetric}>
                <Sun className={styles.wMetricIcon} size={20} />
                <div className={styles.wMetricInfo}><span>Irradiance</span><strong>820 W/m²</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Prediction & Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* AI Prediction */}
          <div className={`${styles.card} ${styles.aiPredictionCard}`}>
            <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>
              <Cpu size={20} color="#6366F1" /> AI Solar Forecast
            </div>
            
            <div className={styles.aiMainContent}>
              <div className={styles.aiValueContainer}>
                <div className={styles.aiLabel}>Predicted Output</div>
                <div className={styles.aiValue}>5.8 <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>kWh</span></div>
              </div>
            </div>

            <div className={styles.aiMeta}>
              <div className={styles.aiMetaItem}>
                <span>Confidence</span>
                <strong style={{ color: '#10B981' }}>94%</strong>
              </div>
              <div className={styles.aiMetaItem}>
                <span>Expected Peak</span>
                <strong>12:30 PM</strong>
              </div>
            </div>

            <div className={styles.aiRecommendation}>
              <Sun size={24} color="#10B981" style={{ flexShrink: 0 }} />
              <p>Today's conditions are highly favorable for optimal solar generation.</p>
            </div>
            
            <Button variant="outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/app/predict')}>
              View Full Prediction <ArrowRight size={16} />
            </Button>
          </div>

          {/* Quick Actions */}
          <div>
            <div className={styles.sectionTitle}>Quick Actions</div>
            <div className={styles.quickActionsGrid}>
              <div className={styles.actionCard} onClick={() => navigate('/app/predict')}>
                <div className={styles.actionIcon}><Zap size={24} /></div>
                New Prediction
              </div>
              <div className={styles.actionCard} onClick={() => navigate('/app/analytics')}>
                <div className={styles.actionIcon}><BarChart2 size={24} /></div>
                View Analytics
              </div>
              <div className={styles.actionCard} onClick={() => navigate('/app/reports')}>
                <div className={styles.actionIcon}><FileText size={24} /></div>
                Generate Report
              </div>
              <div className={styles.actionCard} onClick={() => navigate('/app/weather')}>
                <div className={styles.actionIcon}><CloudRain size={24} /></div>
                Weather Forecast
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className={styles.secondaryGrid}>
        
        {/* Energy Performance */}
        <div className={styles.card}>
          <div className={styles.sectionTitle}>Energy Performance</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
            {[
              { label: 'Peak Generation', value: '7.4 kWh', icon: TrendingUp },
              { label: 'Daily Average', value: '5.2 kWh', icon: Activity },
              { label: 'Monthly Generation', value: '156 kWh', icon: Calendar },
              { label: 'CO₂ Saved', value: '72 kg', icon: Thermometer, color: '#10B981' },
            ].map((perf, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: idx !== 3 ? '1px solid var(--border-color)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <perf.icon size={18} color={perf.color || 'var(--text-secondary)'} />
                  </div>
                  <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{perf.label}</span>
                </div>
                <strong style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>{perf.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Solar Farm Location */}
        <div className={`${styles.card} ${styles.locationCard}`}>
          <img src="/assets/solar_farm.png" alt="Solar Farm Map" className={styles.locationImage} />
          <div className={styles.locationContent}>
            <div className={styles.sectionTitle} style={{ marginBottom: '8px' }}><MapPin size={20} /> Chandigarh Solar Monitoring</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>Active Site • Zone 4</p>
            
            <div className={styles.locationStats}>
              <div className={styles.lStat}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Capacity</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>12.5 kWp</strong>
              </div>
              <div className={styles.lStat}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Current Output</span>
                <strong style={{ fontSize: '1.25rem', color: '#10B981' }}>5.8 kWh</strong>
              </div>
              <div className={styles.lStat}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Efficiency</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>96.4%</strong>
              </div>
              <div className={styles.lStat}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Panels Online</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>32 / 32</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>Recent Predictions</div>
          <Button variant="outline" size="small" onClick={() => navigate('/app/history')}>View All</Button>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Temperature</th>
                <th>Irradiance</th>
                <th>Predicted Power</th>
                <th>Accuracy</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPredictions.map(pred => (
                <tr key={pred.id}>
                  <td>{pred.date}</td>
                  <td>{pred.temp}</td>
                  <td>{pred.irr}</td>
                  <td style={{ fontWeight: 700, color: 'var(--brand-color)' }}>{pred.power}</td>
                  <td>{pred.acc}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(pred.status)}`}>
                      {pred.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
