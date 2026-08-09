'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        <div className={styles.grid}>
          {/* Main Info */}
          <div className={styles.infoCol}>
            <div className={styles.logo}>
              <span className={styles.logoA}>A</span>
              <span className={styles.logoI}>I</span>
              <span className={styles.logoU}>U</span>
              <span className={styles.logoText}>Amesi Improvement Union</span>
            </div>
            <p className={styles.description}>
              Amesi Improvement Union (AIU) is dedicated to fostering unity, cultural preservation, and socio-economic advancement for all indigenes of Amesi town, globally and locally.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">FB</a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">TW</a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">IG</a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">LN</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linksCol}>
            <h3 className={styles.colTitle}>Quick Links</h3>
            <ul className={styles.linksList}>
              <li><Link href="/" className={styles.link}>Home</Link></li>
              <li><Link href="/#about" className={styles.link}>Showcase Amesi</Link></li>
              <li><Link href="/#news" className={styles.link}>Community News</Link></li>
              <li><Link href="/login" className={styles.link}>Member Area</Link></li>
            </ul>
          </div>

          {/* Branches */}
          <div className={styles.linksCol}>
            <h3 className={styles.colTitle}>Branches</h3>
            <ul className={styles.linksList}>
              <li><Link href="/abuja" className={styles.link}>AIU Abuja Branch</Link></li>
              <li><Link href="/lagos" className={styles.link}>AIU Lagos Branch</Link></li>
              <li><Link href="/portharcourt" className={styles.link}>AIU Port Harcourt Branch</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div className={styles.contactCol}>
            <h3 className={styles.colTitle}>National Secretariat</h3>
            <p className={styles.contactText}>
              ASCON Hall, Amesi Town,<br />
              Aguata LGA, Anambra State,<br />
              Nigeria
            </p>
            <p className={styles.contactText}>
              <strong>Email:</strong> national@aiu-portal.org<br />
              <strong>Phone:</strong> +234 803 123 4567
            </p>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} Amesi Improvement Union. All rights reserved. Designed for development and community advancement.
          </p>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>Privacy Policy</a>
            <a href="#" className={styles.bottomLink}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
