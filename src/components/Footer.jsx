import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} SolarForecast. All rights reserved. <br/>
          <span style={{ fontSize: '0.85em', opacity: 0.8 }}>Designed By Aditya Kar</span>
        </div>
        <div className={styles.links}>
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
