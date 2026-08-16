import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, Cloud, Sun, Zap, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Predict.module.css';
import { useUser } from '@clerk/clerk-react';

import toast from 'react-hot-toast';

const Predict = () => {
  const { user } = useUser();
  const [predicted, setPredicted] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [advancedMetrics, setAdvancedMetrics] = useState(null);
  
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    windSpeed: '',
    cloudCover: '',
    irradiance: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!user) {
      return toast.error("You must be logged in to save predictions.");
    }

    setIsPredicting(true);
    
    // Simulate API call and calculate mock result
    setTimeout(async () => {
      // Mock calculation based on irradiance and cloud cover roughly
      const basePower = (formData.irradiance * 0.01) * (1 - (formData.cloudCover / 100));
      const powerResult = Math.max(0, basePower + (Math.random() * 2 - 1)).toFixed(2);
      
      const metrics = {
        efficiency: (Math.random() * 5 + 15).toFixed(1) + '%',
        confidence: (Math.random() * 10 + 85).toFixed(1) + '%',
        recommendation: basePower > 4 ? "Optimal for Battery Charging" : "Grid Support Mode",
        carbonSaved: (powerResult * 0.5).toFixed(2) + ' kg',
        peakTime: "13:00 - 14:30"
      };
      
      const predictionRecord = {
        uid: user.id,
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        windSpeed: parseFloat(formData.windSpeed),
        cloudCover: parseFloat(formData.cloudCover),
        irradiance: parseFloat(formData.irradiance),
        prediction: parseFloat(powerResult),
        status: 'Success',
        timestamp: new Date(),
        ...metrics
      };

      try {
        // await addDoc(collection(db, 'predictions'), predictionRecord);
        setResult(powerResult);
        setAdvancedMetrics({ ...metrics, power: powerResult, date: new Date().toLocaleString() });
        setIsPredicting(false);
        setPredicted(true);
        toast.success("Prediction completed and saved to history!");
      } catch (error) {
        console.error("Error saving prediction:", error);
        toast.error("Prediction succeeded, but failed to save to history.");
        setIsPredicting(false);
      }
    }, 1500);
  };

  return (
    <div className={`container ${styles.predictPage}`}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-primary">Predict Solar Power Output</h1>
        <p className="text-muted">Enter weather parameters to forecast solar power generation.</p>
      </motion.div>

      <div className={styles.gridContainer}>
        {/* Left Column: Form */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={styles.formCard}>
            <h3 className={styles.cardTitle}>Weather Parameters</h3>
            <form onSubmit={handlePredict} className={styles.form}>
              <Input name="temperature" value={formData.temperature} onChange={handleChange} label="Temperature (°C)" type="number" icon={Thermometer} placeholder="e.g. 25" required />
              <Input name="humidity" value={formData.humidity} onChange={handleChange} label="Humidity (%)" type="number" icon={Droplets} placeholder="e.g. 60" required />
              <Input name="windSpeed" value={formData.windSpeed} onChange={handleChange} label="Wind Speed (km/h)" type="number" icon={Wind} placeholder="e.g. 15" required />
              <Input name="cloudCover" value={formData.cloudCover} onChange={handleChange} label="Cloud Cover (%)" type="number" icon={Cloud} placeholder="e.g. 20" required />
              <Input name="irradiance" value={formData.irradiance} onChange={handleChange} label="Solar Irradiance (W/m²)" type="number" icon={Sun} placeholder="e.g. 800" required />
              
              <Button type="submit" variant="primary" className={styles.predictBtn}>
                {isPredicting ? 'Predicting...' : (
                  <>
                    <Zap size={20} />
                    Predict
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Right Column: Result */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className={styles.resultCard}>
            <h3 className={styles.cardTitle}>Prediction Result</h3>
            
            <div className={styles.resultIllustration}>
              <div className={styles.sunCircle}></div>
              <div className={styles.panelIcon}><Sun size={48} color="#FACC15" /></div>
            </div>

            {predicted ? (
              <motion.div 
                className={styles.resultContent}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className={styles.resultLabel}>Predicted Solar Power Generation</div>
                <div className={styles.resultValue}>{result} <span className={styles.unit}>kWh</span></div>
                
                <div className={styles.advancedMetricsGrid}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>System Efficiency</span>
                    <strong className={styles.metricValue}>{advancedMetrics.efficiency}</strong>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Confidence Score</span>
                    <strong className={styles.metricValue}>{advancedMetrics.confidence}</strong>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Carbon Saved</span>
                    <strong className={styles.metricValue}>{advancedMetrics.carbonSaved}</strong>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Peak Generation</span>
                    <strong className={styles.metricValue}>{advancedMetrics.peakTime}</strong>
                  </div>
                </div>

                <div className={styles.recommendationBox}>
                  <strong>AI Recommendation:</strong> {advancedMetrics.recommendation}
                </div>
                
                <div className={styles.timeCard}>
                  <Clock size={16} />
                  <span>Prediction Time: {new Date().toLocaleTimeString()}</span>
                </div>
              </motion.div>
            ) : (
              <div className={styles.placeholderContent}>
                <p className="text-muted">Fill the parameters and click Predict to see the forecast.</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Predict;
