import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Building, Globe, Map, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';

import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import styles from './Auth.module.css'; // Reuse auth styles

const CompleteProfile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || ''
      }));
    } else if (isLoaded && !isSignedIn) {
      navigate('/sign-in');
    }
  }, [user, isLoaded, isSignedIn, navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // const userRef = doc(db, 'users', user.id);
      // await setDoc(userRef, {
      //   uid: user.id,
      //   email: formData.email,
      //   name: formData.fullName,
      //   phone: formData.phone,
      //   address: formData.address,
      //   city: formData.city,
      //   state: formData.state,
      //   country: formData.country,
      //   pincode: formData.pincode,
      //   photoURL: user.imageUrl || "",
      //   createdAt: new Date(),
      //   lastLogin: new Date(),
      // }, { merge: true });
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Profile completed successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete profile.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <Card className={styles.authCard}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 className="text-primary">Complete Your Profile</h2>
            <p className="text-muted">Please provide the missing details to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input id="fullName" label="Full Name" icon={User} value={formData.fullName} onChange={handleInputChange} required />
            <Input id="email" label="Email Address" icon={Mail} value={formData.email} disabled />
            <Input id="phone" label="Phone Number" icon={Phone} placeholder="+1234567890" value={formData.phone} onChange={handleInputChange} required />
            <Input id="address" label="Address" icon={MapPin} placeholder="123 Green St" value={formData.address} onChange={handleInputChange} required />
            
            <div className={styles.rowGrid}>
              <Input id="city" label="City" icon={Building} placeholder="New York" value={formData.city} onChange={handleInputChange} required />
              <Input id="state" label="State" icon={Map} placeholder="NY" value={formData.state} onChange={handleInputChange} required />
            </div>
            
            <div className={styles.rowGrid}>
              <Input id="country" label="Country" icon={Globe} placeholder="USA" value={formData.country} onChange={handleInputChange} required />
              <Input id="pincode" label="Pincode" icon={MapPin} placeholder="10001" value={formData.pincode} onChange={handleInputChange} required />
            </div>

            <Button type="submit" variant="primary" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : 'Complete Registration'}
            </Button>
          </form>
        </motion.div>
      </Card>
    </div>
  );
};

export default CompleteProfile;
