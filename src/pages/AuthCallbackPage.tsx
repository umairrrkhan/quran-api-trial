import React, { useEffect, useState } from 'react';
import { exchangeAndStore } from '../context/AuthContext';
import './AuthCallbackPage.css';

const AuthCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      const desc = params.get('error_description') || '';
      setStatus('error');
      setErrorMsg(desc ? `${error}: ${desc}` : `Error: ${error}`);
      return;
    }

    if (!code || !state) {
      setStatus('error');
      setErrorMsg('Invalid callback: missing code or state.');
      return;
    }

    let session;
    try {
      const raw = localStorage.getItem('qf_auth_session');
      session = raw ? JSON.parse(raw) : null;
    } catch { session = null; }

    if (!session) {
      setStatus('error');
      setErrorMsg('Session expired. Please try logging in again.');
      return;
    }

    if (state !== session.state) {
      setStatus('error');
      setErrorMsg('State mismatch.');
      return;
    }

    exchangeAndStore(code, session.codeVerifier, session.redirectUri)
      .then((user) => {
        if (!user) {
          setStatus('error');
          setErrorMsg('Token exchange failed. Please try again.');
          return;
        }
        setStatus('success');
        setTimeout(() => { window.location.href = '/'; }, 1000);
      })
      .catch(() => {
        setStatus('error');
        setErrorMsg('An unexpected error occurred.');
      });
  }, []);

  return (
    <div className="auth-callback-page">
      <div className="auth-callback-card">
        {status === 'processing' && (
          <>
            <div className="auth-spinner" />
            <h2>Completing sign in...</h2>
            <p>Please wait while we finalize your authentication.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="auth-success-icon">✓</div>
            <h2>Signed in successfully!</h2>
            <p>Redirecting you back...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="auth-error-icon">!</div>
            <h2>Sign in failed</h2>
            <p>{errorMsg}</p>
            <button className="btn btn-primary" onClick={() => { window.location.href = '/'; }}>
              Go Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
