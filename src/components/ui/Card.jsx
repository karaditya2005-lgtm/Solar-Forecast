import React from 'react';
import { motion } from 'framer-motion';
import styles from './Card.module.css';

const Card = ({ children, className = '', hoverEffect = false, ...props }) => {
  const CardComponent = hoverEffect ? motion.div : 'div';
  const motionProps = hoverEffect ? {
    whileHover: { y: -8, boxShadow: 'var(--shadow-hover)' },
    transition: { type: 'spring', stiffness: 300 }
  } : {};

  return (
    <CardComponent 
      className={`${styles.card} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;
