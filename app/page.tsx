'use client';

import VotePage from "../vote-page";
import { ErrorBoundary } from "@/components/error-boundary";
import { useState, useEffect } from "react";

export const dynamic = "force-dynamic";

export default function Page() {
  const [hasError, setHasError] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 10000); // 10 seconds timeout

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (hasError) {
    return (
      <ErrorBoundary fallback={
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h2>Application Error</h2>
          <p>Something went wrong. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      }>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Loading Humor Study...</h2>
          <p>Please wait while we set up the application.</p>
          {timeoutReached && (
            <p style={{ color: '#f87171', marginTop: '10px' }}>
              Taking longer than expected... Please check your connection and try refreshing.
            </p>
          )}
        </div>
      </ErrorBoundary>
    );
  }

  if (timeoutReached) {
    return (
      <ErrorBoundary fallback={
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h2>Loading Issue</h2>
          <p>The application is taking too long to load. This could be due to:</p>
          <ul style={{ textAlign: 'left', color: '#666' }}>
            <li>• Network connectivity issues</li>
            <li>• Database connection problems</li>
            <li>• Missing environment variables</li>
            <li>• Server configuration issues</li>
          </ul>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      }>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Loading Humor Study...</h2>
          <p>Please wait while we set up the application.</p>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallback={
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h2>Loading Humor Study...</h2>
        <p>Please wait while we set up the application.</p>
      </div>
    }>
      <VotePage />
    </ErrorBoundary>
  );
}
