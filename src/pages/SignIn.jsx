import React, { useState, useEffect } from 'react';
import { useSignIn, useClerk, useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import OtpInput from '../components/ui/OtpInput';
import styles from './Auth.module.css';

const SignInPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP State
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(30);

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate('/app', { replace: true });
    }
  }, [isSignedIn, navigate]);

  useEffect(() => {
    let timer;
    if (showOtp && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtp, countdown]);

  const mapClerkError = (err) => {
    const code = err.errors?.[0]?.code;
    if (code === 'form_identifier_not_found' || code === 'form_password_incorrect') {
      return "Incorrect email or password.";
    }
    if (code === 'form_identifier_invalid') {
      return "Please enter a valid email address.";
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

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    setIsLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate('/app');
      } else if (result.status === "needs_first_factor" || result.status === "needs_second_factor") {
        // Clerk needs MFA or Client Trust email verification
        const emailFactor = result.supportedFirstFactors?.find(f => f.strategy === "email_code") 
                         || result.supportedSecondFactors?.find(f => f.strategy === "email_code");
                         
        if (emailFactor) {
          if (result.status === "needs_first_factor") {
            await signIn.prepareFirstFactor({
              strategy: "email_code",
              emailAddressId: emailFactor.emailAddressId,
            });
          } else {
            await signIn.prepareSecondFactor({
              strategy: "email_code",
            });
          }
          setShowOtp(true);
          setCountdown(30);
        } else {
          toast.error("Account requires a verification method not supported here.");
        }
      }
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
      // It could be first or second factor depending on the previous state
      let result;
      if (signIn.status === "needs_first_factor") {
        result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code: otp,
        });
      } else {
        result = await signIn.attemptSecondFactor({
          strategy: "email_code",
          code: otp,
        });
      }

      if (result.status === "complete") {
        toast.success("Email verified successfully!");
        toast("Signing you in...");
        await setActive({ session: result.createdSessionId });
        navigate('/app');
      } else {
        console.log(result);
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
      const emailFactor = signIn.supportedFirstFactors?.find(f => f.strategy === "email_code") 
                       || signIn.supportedSecondFactors?.find(f => f.strategy === "email_code");
                       
      if (signIn.status === "needs_first_factor") {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailFactor.emailAddressId,
        });
      } else {
        await signIn.prepareSecondFactor({
          strategy: "email_code",
        });
      }
      toast.success("Verification code sent successfully.");
      setCountdown(30);
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn.authenticateWithRedirect({
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
          <button className={`${styles.tab} ${styles.activeTab}`}>Login</button>
          <button className={styles.tab} onClick={() => navigate('/sign-up')} disabled={showOtp}>Sign Up</button>
        </div>

        {!showOtp ? (
          <>
            <form className={styles.form} onSubmit={handlePasswordLogin}>
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
              
              <div className={styles.forgotPassword}>
                <button type="button" className={styles.textBtn} onClick={() => toast("Password reset not fully configured yet.")}>
                  Forgot Password?
                </button>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className={styles.submitBtn} 
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Login'}
              </Button>
            </form>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <button type="button" className={styles.googleBtn} onClick={handleGoogleSignIn}>
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
              <button type="button" className={styles.textBtn} onClick={() => setShowOtp(false)}>
                Back to Login
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default SignInPage;
