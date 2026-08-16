import React, { useRef, useState, useEffect } from 'react';
import styles from '../../pages/Auth.module.css';

const OtpInput = ({ length = 6, value, onChange }) => {
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const text = e.target.value;
    // Allow only numbers
    if (!/^\d*$/.test(text)) return;

    // Get the last character typed (in case they type fast)
    const val = text.slice(-1);
    const newValue = value.substring(0, index) + val + value.substring(index + 1);
    
    onChange(newValue);

    if (val && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Current input is empty and user hits backspace, move to previous
        inputRefs.current[index - 1].focus();
      } else {
        // Delete current char
        const newValue = value.substring(0, index) + ' ' + value.substring(index + 1);
        onChange(newValue.trim());
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length).replace(/\D/g, '');
    if (pastedData) {
      onChange(pastedData);
      if (pastedData.length === length) {
        inputRefs.current[length - 1].focus();
        inputRefs.current[length - 1].blur();
      } else {
        inputRefs.current[pastedData.length].focus();
      }
    }
  };

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  return (
    <div className={styles.otpContainer} onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={2}
          className={styles.otpInput}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
};

export default OtpInput;
