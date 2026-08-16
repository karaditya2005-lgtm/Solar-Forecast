import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Share2, Globe, Hash } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Contact.module.css';

const Contact = () => {
  return (
    <div className={`container ${styles.contactPage}`}>
      <motion.div className={styles.header} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-primary">Contact Us</h1>
        <p className="text-muted">Have questions? We'd love to hear from you.</p>
      </motion.div>

      <div className={styles.contactGrid}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className={styles.infoCards}>
            <Card className={styles.infoCard}>
              <Mail className={styles.icon} size={24} />
              <div>
                <h4>Email</h4>
                <p>support@solarforecast.com</p>
              </div>
            </Card>
            
            <Card className={styles.infoCard}>
              <Phone className={styles.icon} size={24} />
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </Card>

            <Card className={styles.infoCard}>
              <MapPin className={styles.icon} size={24} />
              <div>
                <h4>Address</h4>
                <p>123 Green Energy Blvd, San Francisco, CA</p>
              </div>
            </Card>

            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialLink}><MessageCircle size={20} /></a>
              <a href="#" className={styles.socialLink}><Hash size={20} /></a>
              <a href="#" className={styles.socialLink}><Globe size={20} /></a>
              <a href="#" className={styles.socialLink}><Share2 size={20} /></a>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className={styles.formCard}>
            <h3>Send us a message</h3>
            <form className={styles.form}>
              <Input label="Name" id="name" placeholder="John Doe" />
              <Input label="Email" id="email" type="email" placeholder="john@example.com" />
              
              <div className={styles.textareaGroup}>
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="5" placeholder="How can we help you?" className={styles.textarea}></textarea>
              </div>

              <Button type="button" variant="primary" className={styles.submitBtn}>
                <Send size={18} /> Send Message
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
