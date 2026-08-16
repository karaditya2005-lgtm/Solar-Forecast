import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Leaf } from 'lucide-react';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={`container ${styles.aboutPage}`}>
      <motion.div className={styles.header} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-primary">About SolarForecast</h1>
        <p className="text-muted">Powering a Sustainable Future through intelligent forecasting.</p>
      </motion.div>

      <div className={styles.gridContainer}>
        <motion.div className={styles.leftCol} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className={styles.infoBlock}>
            <div className={styles.iconWrapper}><Target size={28} /></div>
            <div>
              <h3>Our Mission</h3>
              <p>To accelerate the transition to renewable energy by providing the most accurate and actionable solar power generation forecasts in the industry.</p>
            </div>
          </div>
          
          <div className={styles.infoBlock}>
            <div className={styles.iconWrapper}><Lightbulb size={28} /></div>
            <div>
              <h3>Technology</h3>
              <p>We leverage cutting-edge machine learning models integrated with real-time global weather data to predict energy output with unprecedented accuracy.</p>
            </div>
          </div>
          
          <div className={styles.infoBlock}>
            <div className={styles.iconWrapper}><Leaf size={28} /></div>
            <div>
              <h3>Vision</h3>
              <p>A world where clean energy generation is 100% predictable, enabling smarter grids and a greener, more sustainable planet for future generations.</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div className={styles.rightCol} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div className={styles.imageCard}>
            <img src="/about_image.png" alt="Solar panels in nature" className={styles.aboutImage} />
            <div className={styles.quoteCard}>
              <p className={styles.quote}>"Built for a Greener Tomorrow"</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
