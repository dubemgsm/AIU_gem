'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';

export default function Login() {
  const { user, login, loading } = useAuth();
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      if (user.branch && user.branch !== 'global') {
        router.push(`/${user.branch}`);
      } else {
        router.push('/');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    const res = await login(username, password);
    setSubmitting(false);

    if (res.success) {
      if (res.user.branch && res.user.branch !== 'global') {
        router.push(`/${res.user.branch}`);
      } else {
        router.push('/');
      }
    } else {
      setError(res.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={`${styles.loginCard} glass-panel`}>
        <div className={styles.headerText}>
          <h1 className={`${styles.title} text-gradient`}>Member Portal</h1>
          <p className={styles.subtitle}>Sign in to access your branch photo gallery and events</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              placeholder="e.g., lagos_user"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
              autoComplete="username"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="glow-btn submitBtn"
            disabled={submitting || loading}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.registerPrompt}>
          Don't have an account? 
          <Link href="/register" className={styles.registerLink}>
            Register Here
          </Link>
        </p>

        {/* Preset Accounts for Demonstration */}
        <div className={styles.presetBox}>
          <h4 className={styles.presetTitle}>Demo Accounts</h4>
          <ul className={styles.presetList}>
            <li className={styles.presetItem}>
              <span>Lagos Member:</span>
              <span><code>lagos_user</code> / <code>lagos123</code></span>
            </li>
            <li className={styles.presetItem}>
              <span>Abuja Member:</span>
              <span><code>abuja_user</code> / <code>abuja123</code></span>
            </li>
            <li className={styles.presetItem}>
              <span>PH Member:</span>
              <span><code>ph_user</code> / <code>ph123</code></span>
            </li>
            <li className={styles.presetItem}>
              <span>National Admin:</span>
              <span><code>admin</code> / <code>admin123</code></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
