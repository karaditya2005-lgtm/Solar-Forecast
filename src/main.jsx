import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const MissingConfig = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: '#F8FAFC', color: '#111827', padding: '20px', textAlign: 'center' }}>
    <h1 style={{ color: '#E11D48', marginBottom: '1rem' }}>Missing Clerk configuration</h1>
    <p style={{ color: '#64748B', fontSize: '1.125rem' }}>
      Please add <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> to your <code>.env</code> file.
    </p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        {PUBLISHABLE_KEY ? (
          <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <Toaster position="top-right" />
            <App />
          </ClerkProvider>
        ) : (
          <MissingConfig />
        )}
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
