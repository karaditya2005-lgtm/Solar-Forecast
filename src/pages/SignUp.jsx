import React, { useState, useEffect } from 'react';
import { useSignUp, useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Mail, Lock, CheckCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import OtpInput from '../components/ui/OtpInput';
import styles from './Auth.module.css';

const SignUpPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [pendingVerification, setPendingVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  // Password Validation
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber && hasSpecial;

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate('/app', { replace: true });
    }
  }, [isSignedIn, navigate]);

  useEffect(() => {
    let timer;
    if (pendingVerification && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pendingVerification, countdown]);

  const mapClerkError = (err) => {
    const code = err.errors?.[0]?.code;
    if (code === 'form_identifier_invalid') {
      return "Please enter a valid email address.";
    }
    if (code === 'form_password_length_too_short' || code === 'form_password_pwned') {
      // Let Clerk's authoritative message show, but mapped somewhat friendly
      return err.errors?.[0]?.message || "Password does not meet requirements.";
    }
    if (code === 'form_code_incorrect') {
      return "Incorrect verification code. Please try again.";
    }
    if (code === 'form_code_expired') {
      return "Verification code expired. Please request a new code.";
    }
    if (code === 'too_many_requests') {
      return "Too many attempts. Please try again later.";
    }
    if (!navigator.onLine) {
      return "Unable to verify the code. Please check your internet connection.";
    }
    return err.errors?.[0]?.message || "Authentication failed.";
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    if (!isPasswordValid) {
      toast.error("Please ensure all password requirements are met.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setCountdown(30);
      toast.success("Verification code sent successfully.");
    } catch (err) {
      console.error(err);
      toast.error(mapClerkError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!isLoaded || otp.length !== 6) return;
    
    setIsLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: otp,
      });
      if (completeSignUp.status === 'complete') {
        toast.success("Email verified successfully!");
        toast("Signing you in...");
        await setActive({ session: completeSignUp.createdSessionId });
        navigate('/app');
      } else {
        console.log(completeSignUp);
        toast.error("Further action needed");
      }
    } catch (err) {
      console.error(err);
      toast.error(mapClerkError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || countdown > 0) return;
    setIsLoading(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast.success("Verification code sent successfully.");
      setCountdown(30);
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/app"
    });
  };

  const maskEmail = (email) => {
    const [name, domain] = email.split('@');
    if (!domain) return email;
    return `${name.charAt(0)}*****@${domain}`;
  };

  return (
    <div className={styles.authContainer}>
      <motion.div 
        className={styles.authCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.tabs}>
          <button className={styles.tab} onClick={() => navigate('/sign-in')} disabled={pendingVerification}>Login</button>
          <button className={`${styles.tab} ${styles.activeTab}`}>Sign Up</button>
        </div>

        {!pendingVerification ? (
          <>
            <form className={styles.form} onSubmit={handlePasswordSubmit}>
              <Input 
                id="email" 
                label="Email Address" 
                type="email" 
                icon={Mail} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <Input 
                id="password" 
                label="Password" 
                type="password" 
                icon={Lock} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              
              {password && (
                <div className={styles.passwordRequirements}>
                  <div style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Password must contain:</div>
                  <ul className={styles.reqList}>
                    <li className={`${styles.reqItem} ${hasMinLength ? styles.reqMet : ''}`}>
                      {hasMinLength ? <CheckCircle size={14} /> : <Circle size={14} />} At least 6 characters
                    </li>
                    <li className={`${styles.reqItem} ${hasUppercase ? styles.reqMet : ''}`}>
                      {hasUppercase ? <CheckCircle size={14} /> : <Circle size={14} />} 1 uppercase letter
                    </li>
                    <li className={`${styles.reqItem} ${hasNumber ? styles.reqMet : ''}`}>
                      {hasNumber ? <CheckCircle size={14} /> : <Circle size={14} />} 1 number
                    </li>
                    <li className={`${styles.reqItem} ${hasSpecial ? styles.reqMet : ''}`}>
                      {hasSpecial ? <CheckCircle size={14} /> : <Circle size={14} />} 1 special character
                    </li>
                  </ul>
                </div>
              )}

              <Input 
                id="confirmPassword" 
                label="Confirm Password" 
                type="password" 
                icon={Lock} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />

              <Button 
                type="submit" 
                variant="primary" 
                className={styles.submitBtn} 
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <button type="button" className={styles.googleBtn} onClick={handleGoogleSignUp}>
              <svg className={styles.googleIcon} viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </>
        ) : (
          <form className={styles.form} onSubmit={handleVerifyOtp}>
            <div className={styles.otpHeader}>
              <h2>Verify your email</h2>
              <p>We sent a verification code to {maskEmail(email)}.</p>
            </div>
            
            <OtpInput value={otp} onChange={setOtp} length={6} />
            
            <Button 
              type="submit" 
              variant="primary" 
              className={styles.submitBtn} 
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
            
            <div className={styles.resendContainer}>
              {countdown > 0 ? (
                <span>Resend code in {countdown} seconds</span>
              ) : (
                <>
                  Didn't receive a code? 
                  <button type="button" className={styles.resendBtn} onClick={handleResend} disabled={isLoading}>
                    Resend Code
                  </button>
                </>
              )}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button type="button" className={styles.textBtn} onClick={() => setPendingVerification(false)}>
                Back to Sign Up
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default SignUpPage;
