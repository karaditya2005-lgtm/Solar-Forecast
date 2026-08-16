import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, CloudRain, LayoutDashboard, History, ShieldCheck, 
  LineChart, Sun, ArrowRight, Zap, Target, Leaf, CheckCircle2,
  ChevronDown, MessageSquare
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import styles from './Home.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const toggleFaq = (index) => {
    if (activeFaq === index) setActiveFaq(null);
    else setActiveFaq(index);
  };

  const handleCtaClick = () => {
    if (user) {
      navigate('/predict');
    } else {
      navigate('/sign-in');
    }
  };

  const features = [
    { icon: Brain, title: "AI Prediction", desc: "Advanced machine learning for accurate forecasts." },
    { icon: CloudRain, title: "Real-time Weather", desc: "Integrates live meteorological data." },
    { icon: LayoutDashboard, title: "Interactive Dashboard", desc: "Visualize data with beautiful charts." },
    { icon: History, title: "Prediction History", desc: "Track past predictions and export data." },
    { icon: LineChart, title: "Analytics", desc: "Deep insights into solar power trends." },
    { icon: ShieldCheck, title: "Secure Login", desc: "OTP-based authentication for maximum security." }
  ];

  const benefits = [
    { icon: Target, title: "Higher Accuracy", desc: "Reduce forecast errors by up to 30% with AI." },
    { icon: Leaf, title: "Renewable Energy", desc: "Optimize your clean energy utilization." },
    { icon: Zap, title: "Smart Analytics", desc: "Actionable insights for grid management." },
    { icon: Sun, title: "Real-Time Prediction", desc: "Instant forecasting based on live weather updates." }
  ];

  const testimonials = [
    { name: "Sarah Jenkins", role: "Energy Analyst", text: "SolarForecast has completely transformed how we predict grid loads. The AI accuracy is unmatched." },
    { name: "David Chen", role: "Solar Farm Manager", text: "The dashboard is beautiful and the real-time weather integration saves us hours of manual work." },
    { name: "Emma Watson", role: "Sustainability Director", text: "Finally, a tool that makes solar prediction accessible and visually intuitive. Highly recommended!" }
  ];

  const faqs = [
    { q: "How accurate are the predictions?", a: "Our AI models are trained on years of historical data and integrate real-time weather APIs to achieve 95%+ accuracy." },
    { q: "Can I export my prediction history?", a: "Yes, you can export all your past predictions as CSV files from the History page." },
    { q: "Is my data secure?", a: "We use enterprise-grade encryption and secure OTP-based login to ensure your data is always protected." },
    { q: "Do I need technical knowledge to use this?", a: "Not at all. We've designed the platform to be intuitive for everyone, from home owners to grid operators." }
  ];

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section id="hero" className={styles.heroSection}>
        <div className={`container ${styles.heroContainer}`}>
          <motion.div 
            className={styles.heroLeft}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.badge}>
              <Sun size={16} />
              <span>Next-Gen Solar Forecasting</span>
            </div>
            <h1 className={styles.title}>
              Predict Solar Power with <span className={styles.highlight}>AI Precision</span>
            </h1>
            <p className={styles.subtitle}>
              Harness the power of advanced machine learning and real-time weather data to accurately predict solar energy generation.
            </p>
            <div className={styles.buttonGroup}>
              <Button variant="primary" onClick={handleCtaClick} className={styles.ctaBtn}>
                Start Prediction <ArrowRight size={18} />
              </Button>
              <Link to={user ? "/dashboard" : "/sign-in"}>
                <Button variant="secondary" className={styles.ctaBtnOutline}>
                  Explore Dashboard
                </Button>
              </Link>
            </div>
            <div className={styles.statsRow}>
              <div><strong>95%+</strong> Accuracy</div>
              <div><strong>24/7</strong> Real-time</div>
              <div><strong>10k+</strong> Users</div>
            </div>
          </motion.div>
          
          <motion.div 
            className={styles.heroRight}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.imageWrapper}>
              <div className={styles.glowEffect}></div>
              <img src="/eco_hero_illustration.png" alt="Solar Energy" className={styles.heroImg} onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.classList.add(styles.imagePlaceholder);
              }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.featuresSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Powerful Features</h2>
            <p className={styles.sectionSubtitle}>Everything you need to forecast and monitor solar energy generation.</p>
          </div>
          
          <motion.div 
            className={styles.featuresGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature, idx) => (
              <Card key={idx} hoverEffect className={styles.featureCard}>
                <motion.div variants={itemVariants}>
                  <div className={styles.iconBox}><feature.icon size={28} /></div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </motion.div>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={styles.howItWorksSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionSubtitle}>Four simple steps to get accurate solar predictions.</p>
          </div>

          <div className={styles.stepsContainer}>
            {[
              { step: 1, title: "Enter Weather Data", desc: "Input temperature, humidity, and cloud cover." },
              { step: 2, title: "AI Predicts Power", desc: "Our models process the data instantly." },
              { step: 3, title: "View Analytics", desc: "Visualize results on your interactive dashboard." },
              { step: 4, title: "Download Reports", desc: "Export data for further analysis." }
            ].map((item, idx) => (
              <React.Fragment key={idx}>
                <motion.div 
                  className={styles.stepCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className={styles.stepNumber}>{item.step}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.div>
                {idx < 3 && <div className={styles.stepArrow}><ArrowRight size={24} className={styles.hiddenMobile} /><ChevronDown size={24} className={styles.hiddenDesktop} /></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard-preview" className={styles.previewSection}>
        <div className="container">
          <div className={styles.previewContainer}>
            <div className={styles.previewText}>
              <h2>Beautiful, Interactive Dashboard</h2>
              <p>Monitor your solar generation with real-time charts, historical comparisons, and actionable insights all in one place.</p>
              <ul className={styles.previewList}>
                <li><CheckCircle2 size={20} className={styles.checkIcon}/> Comprehensive Charts</li>
                <li><CheckCircle2 size={20} className={styles.checkIcon}/> Key Statistics Overview</li>
                <li><CheckCircle2 size={20} className={styles.checkIcon}/> Latest Prediction Results</li>
              </ul>
              <Button variant="primary" onClick={handleCtaClick}>View Live Demo</Button>
            </div>
            <motion.div 
              className={styles.previewCards}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className={styles.glassCard}>
                <div className={styles.chartMockup}>
                  <div className={styles.mockupHeader}>
                    <div className={styles.dot}></div><div className={styles.dot}></div><div className={styles.dot}></div>
                  </div>
                  <div className={styles.mockupBody}>
                    <div className={styles.mockupBar} style={{height: '40%'}}></div>
                    <div className={styles.mockupBar} style={{height: '70%'}}></div>
                    <div className={styles.mockupBar} style={{height: '50%'}}></div>
                    <div className={styles.mockupBar} style={{height: '90%'}}></div>
                    <div className={styles.mockupBar} style={{height: '60%'}}></div>
                    <div className={styles.mockupBar} style={{height: '80%'}}></div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className={styles.benefitsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
          </div>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, idx) => (
              <motion.div 
                key={idx} 
                className={styles.benefitItem}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={styles.benefitIcon}><benefit.icon size={24} /></div>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className={styles.testimonialsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Trusted by Experts</h2>
          </div>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((testi, idx) => (
              <Card key={idx} className={styles.testimonialCard}>
                <div className={styles.quoteMark}>"</div>
                <p className={styles.testiText}>{testi.text}</p>
                <div className={styles.testiAuthor}>
                  <div className={styles.testiAvatar}>{testi.name.charAt(0)}</div>
                  <div>
                    <h4>{testi.name}</h4>
                    <span>{testi.role}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={styles.faqSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>
          <div className={styles.faqContainer}>
            {faqs.map((faq, idx) => (
              <div key={idx} className={`${styles.faqItem} ${activeFaq === idx ? styles.faqActive : ''}`} onClick={() => toggleFaq(idx)}>
                <div className={styles.faqQuestion}>
                  <h3>{faq.q}</h3>
                  <ChevronDown size={20} className={styles.faqIcon} />
                </div>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={styles.faqAnswer}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={styles.contactSection}>
        <div className="container">
          <div className={styles.contactContainer}>
            <div className={styles.contactInfo}>
              <h2>Get in Touch</h2>
              <p>Have questions about SolarForecast? Our team is here to help you optimize your renewable energy strategy.</p>
              <div className={styles.contactItem}>
                <MessageSquare size={20} />
                <span>support@solarforecast.com</span>
              </div>
            </div>
            <Card className={styles.contactFormCard}>
              <form className={styles.contactForm} onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input type="text" placeholder="Your name" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input type="email" placeholder="Your email" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Message</label>
                  <textarea placeholder="How can we help?" rows="4" required></textarea>
                </div>
                <Button type="submit" variant="primary">Send Message</Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
