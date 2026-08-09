'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './register.module.css';

export default function Register() {
  const { user, register, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [branch, setBranch] = useState('lagos');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (!name.trim() || !username.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 5) {
      setError('Password must be at least 5 characters long.');
      return;
    }

    setSubmitting(true);
    const res = await register(username, password, name, branch);
    setSubmitting(false);

    if (res.success) {
      router.push(`/${branch}`);
    } else {
      setError(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className={styles.registerWrapper}>
      <div className={`${styles.registerCard} glass-panel`}>
        <div className={styles.headerText}>
          <h1 className={`${styles.title} text-gradient`}>Join the Union</h1>
          <p className={styles.subtitle}>Register as an AIU member to access galleries and regional events</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="e.g., Adaeze Nwosu"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              placeholder="e.g., adaeze_nwosu"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Amesi Union Branch</label>
            <select
              className={styles.select}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={submitting}
            >
              <option value="lagos">AIU Lagos State Branch</option>
              <option value="abuja">AIU Abuja FCT Branch</option>
              <option value="portharcourt">AIU Port Harcourt Rivers Branch</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Min 5 characters"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
              autoComplete="new-password"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat your password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting}
              required
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            className="glow-btn submitBtn"
            disabled={submitting || loading}
          >
            {submitting ? 'Registering...' : 'Register & Enter'}
          </button>
        </form>

        <p className={styles.loginPrompt}>
          Already a member? 
          <Link href="/login" className={styles.loginLink}>
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}
