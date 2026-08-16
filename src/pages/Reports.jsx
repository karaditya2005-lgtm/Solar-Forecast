import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Search } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import styles from './Reports.module.css';
import toast from 'react-hot-toast';

const Reports = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleDownload = (type) => {
    toast.success(`${type} Report generating...`);
    // Simulated delay for download
    setTimeout(() => {
      toast.success(`${type} Report downloaded successfully!`);
    }, 1500);
  };

  return (
    <div className={`container ${styles.reportsPage}`}>
      <motion.div className={styles.header} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-primary">Generation Reports</h1>
        <p className="text-muted">Export and analyze your prediction data.</p>
      </motion.div>

      <div className={styles.grid}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className={styles.actionCard}>
            <div className={styles.iconWrapper}><FileText size={32} /></div>
            <h3>Summary Report</h3>
            <p>Download a comprehensive PDF summary of all predictions and accuracy metrics.</p>
            <Button variant="primary" onClick={() => handleDownload('PDF')} className={styles.downloadBtn}>
              <Download size={18} /> Download PDF
            </Button>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className={styles.actionCard}>
            <div className={styles.iconWrapper}><Calendar size={32} /></div>
            <h3>Custom Date Range</h3>
            <p>Select specific dates to generate a tailored CSV export.</p>
            <div className={styles.dateInputs}>
              <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className={styles.dateInput} />
              <span>to</span>
              <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className={styles.dateInput} />
            </div>
            <Button variant="secondary" onClick={() => handleDownload('CSV')} className={styles.downloadBtn}>
              <Download size={18} /> Export CSV
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
