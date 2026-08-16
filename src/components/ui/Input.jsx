import React from 'react';
import styles from './Input.module.css';

const Input = ({ label, icon: Icon, id, className = '', ...props }) => {
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}>
        {Icon && (
          <div className={styles.iconWrapper}>
            <Icon size={18} />
          </div>
        )}
        <input 
          id={id} 
          className={`${styles.input} ${Icon ? styles.withIcon : ''}`}
          {...props} 
        />
      </div>
    </div>
  );
};

export default Input;
