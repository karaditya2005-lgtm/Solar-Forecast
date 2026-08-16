import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser, useClerk } from '@clerk/clerk-react';
import { User, Phone, MapPin, Mail, Calendar, Edit3, History, LogOut, Save, Building, Globe, Map } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import styles from './Profile.module.css';

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/sign-in');
  };

  if (!isLoaded) return <div className={styles.loading}>Loading Profile...</div>;
  if (!user) {
    navigate('/sign-in');
    return null;
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const displayName = user?.fullName || 'User';
  const email = user?.primaryEmailAddress?.emailAddress;
  const photoURL = user?.imageUrl;

  return (
    <div className={`container ${styles.profilePage}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.profileHeader}
      >
        <h1 className={styles.pageTitle}>My Profile</h1>
        <p className={styles.pageSubtitle}>View your personal information and account details.</p>
      </motion.div>

      <div className={styles.profileLayout}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={styles.userCard}>
            {photoURL ? (
              <img src={photoURL} alt="Profile" className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarLarge}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            
            <h2>{displayName}</h2>
            <p className={styles.userRole}>{email}</p>
            
            <div className={styles.userActions}>
              <Button variant="primary" className={styles.actionBtn} onClick={() => navigate('/app/settings')}>
                <Edit3 size={18} /> Edit Profile / Settings
              </Button>
              
              <Button variant="secondary" onClick={() => navigate('/app/history')} className={styles.actionBtn}>
                <History size={18} /> Prediction History
              </Button>
              <Button variant="secondary" onClick={handleLogout} className={`${styles.actionBtn} ${styles.logoutBtn}`}>
                <LogOut size={18} /> Logout
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={styles.detailsCard}>
            <h3 className={styles.cardTitle}>Personal Information</h3>
            
            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}><User size={20} /></div>
                <div className={styles.detailContent}>
                  <label>Full Name</label>
                  <span>{displayName}</span>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}><Mail size={20} /></div>
                <div className={styles.detailContent}>
                  <label>Email Address</label>
                  <span>{email || 'Not provided'}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.detailIcon}><Phone size={20} /></div>
                <div className={styles.detailContent}>
                  <label>Phone Number</label>
                  <span>{user?.primaryPhoneNumber?.phoneNumber || 'Not provided'}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.detailIcon}><Calendar size={20} /></div>
                <div className={styles.detailContent}>
                  <label>Account Created</label>
                  <span>{formatDate(user?.createdAt)}</span>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}><MapPin size={20} /></div>
                <div className={styles.detailContent}>
                  <label>Last Sign In</label>
                  <span>{formatDate(user?.lastSignInAt)}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
