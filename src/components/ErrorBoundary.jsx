import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
          <Card style={{ maxWidth: '500px', textAlign: 'center' }}>
            <h1 style={{ color: '#E11D48', marginBottom: '1rem' }}>Something went wrong</h1>
            <p style={{ color: '#64748B', marginBottom: '2rem' }}>SolarForecast could not load this page.</p>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '2rem', wordBreak: 'break-all' }}>
              {this.state.error?.toString()}
            </p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Reload Application
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
