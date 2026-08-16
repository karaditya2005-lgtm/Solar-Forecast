import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ChevronLeft, ChevronRight, Search, Trash2, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useUser } from '@clerk/clerk-react';

import styles from './History.module.css';
import toast from 'react-hot-toast';

const History = () => {
  const { user } = useUser();
  const [historyData, setHistoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        try {
          // const q = query(
          //   collection(db, 'predictions'),
          //   where('uid', '==', user.id),
          //   orderBy('timestamp', 'desc')
          // );
          // const querySnapshot = await getDocs(q);
          // const data = querySnapshot.docs.map(doc => ({
          //   id: doc.id,
          //   ...doc.data(),
          //   date: doc.data().timestamp ? doc.data().timestamp.toDate().toLocaleString() : new Date().toLocaleString()
          // }));
          setHistoryData([]);
        } catch (error) {
          console.error("Error fetching history:", error);
          toast.error("Failed to load prediction history.");
        }
      }
    };
    fetchHistory();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      // await deleteDoc(doc(db, 'predictions', id));
      const updatedData = historyData.filter(item => item.id !== id);
      setHistoryData(updatedData);
      toast.success("Record deleted");
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record.");
    }
  };

  const handleDownloadCSV = () => {
    if (historyData.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = ["Date", "Temperature(°C)", "Humidity(%)", "CloudCover(%)", "Irradiance(W/m²)", "Power(kW)", "Status"];
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of historyData) {
      const values = [
        `"${row.date}"`,
        row.temperature,
        row.humidity,
        row.cloudCover,
        row.irradiance,
        row.prediction,
        row.status
      ];
      csvRows.push(values.join(','));
    }

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `SolarForecast_History_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredData = historyData.filter(item => 
    item.date.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.prediction && item.prediction.toString().includes(searchQuery))
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={`container ${styles.historyPage}`}>
      <motion.div className={styles.header} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div>
          <h1 className="text-primary">Prediction History</h1>
          <p className="text-muted">Review past solar power predictions and weather conditions.</p>
        </div>
        <Button variant="secondary" onClick={handleDownloadCSV}>
          <Download size={18} />
          Export CSV
        </Button>
      </motion.div>

      <Card className={styles.tableCard}>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by date or power..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <Button variant="secondary" className={styles.filterBtn}>
            <Filter size={18} /> Filter
          </Button>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Temp (°C)</th>
                <th>Humidity (%)</th>
                <th>Cloud Cover (%)</th>
                <th>Irradiance (W/m²)</th>
                <th>Predicted Power (kW)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentData.length > 0 ? currentData.map((row, idx) => (
                  <motion.tr 
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <td>{row.date}</td>
                    <td>{row.temperature}</td>
                    <td>{row.humidity}</td>
                    <td>{row.cloudCover}</td>
                    <td>{row.irradiance}</td>
                    <td className={styles.powerCell}>{row.prediction}</td>
                    <td><span className={styles.statusSuccess}>{row.status}</span></td>
                    <td>
                      <button onClick={() => handleDelete(row.id)} className={styles.deleteBtn}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan="8" className={styles.emptyState}>No predictions found.</td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={styles.pageBtn} 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft size={20} />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button 
                key={idx} 
                className={`${styles.pageBtn} ${currentPage === idx + 1 ? styles.active : ''}`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button 
              className={styles.pageBtn} 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default History;
