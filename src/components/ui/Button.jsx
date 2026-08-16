import React from 'react';
import styles from './Button.module.css';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const isPrimary = variant === 'primary';
  const buttonClass = `${styles.btn} ${isPrimary ? styles.primary : styles.secondary} ${className}`;

  return (
    <motion.button 
      className={buttonClass}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
