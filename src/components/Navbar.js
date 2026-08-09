'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  const isActive = (path) => pathname === path;

  return (
    <header className={styles.header}>
      <div className={`${styles.navContainer} container`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoA}>A</span>
          <span className={styles.logoI}>I</span>
          <span className={styles.logoU}>U</span>
          <span className={styles.logoText}>Amesi Improvement Union</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <Link href="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>
            Home
          </Link>
          
          {/* Branches Dropdown */}
          <div 
            className={styles.dropdown}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className={`${styles.dropdownTrigger} ${pathname.match(/^\/(lagos|abuja|portharcourt)/) ? styles.active : ''}`}>
              Branches <span className={styles.arrow}>▼</span>
            </button>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link href="/abuja" className={styles.dropdownItem} onClick={closeMenu}>
                  Abuja Branch
                </Link>
                <Link href="/lagos" className={styles.dropdownItem} onClick={closeMenu}>
                  Lagos Branch
                </Link>
                <Link href="/portharcourt" className={styles.dropdownItem} onClick={closeMenu}>
                  Port Harcourt Branch
                </Link>
              </div>
            )}
          </div>

          <Link href="/#news" className={styles.navLink}>
            News
          </Link>
          <Link href="/#about" className={styles.navLink}>
            About Town
          </Link>

          {user && (
            <Link 
              href={`/${user.branch === 'global' ? 'lagos' : user.branch}/gallery`} 
              className={`${styles.navLink} ${pathname.includes('/gallery') ? styles.active : ''}`}
            >
              Galleries
            </Link>
          )}
        </nav>

        {/* Desktop Auth Section */}
        <div className={styles.desktopAuth}>
          {user ? (
            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userRole}>
                  {user.role === 'admin' ? 'Admin' : `${user.branch.charAt(0).toUpperCase() + user.branch.slice(1)} Member`}
                </span>
              </div>
              <button onClick={logout} className={`${styles.logoutBtn} outline-btn`}>
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginLink}>
                Login
              </Link>
              <Link href="/register" className="glow-btn">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle navigation">
          <span className={`${styles.bar} ${isOpen ? styles.bar1 : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.bar2 : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.bar3 : ''}`}></span>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className={`${styles.mobileDrawer} glass-panel`}>
          <Link href="/" className={`${styles.mobileLink} ${isActive('/') ? styles.mobileActive : ''}`} onClick={closeMenu}>
            Home
          </Link>
          
          <div className={styles.mobileSubheading}>Branches</div>
          <Link href="/abuja" className={`${styles.mobileSubLink} ${isActive('/abuja') ? styles.mobileActive : ''}`} onClick={closeMenu}>
            Abuja Branch
          </Link>
          <Link href="/lagos" className={`${styles.mobileSubLink} ${isActive('/lagos') ? styles.mobileActive : ''}`} onClick={closeMenu}>
            Lagos Branch
          </Link>
          <Link href="/portharcourt" className={`${styles.mobileSubLink} ${isActive('/portharcourt') ? styles.mobileActive : ''}`} onClick={closeMenu}>
            Port Harcourt Branch
          </Link>
          
          <Link href="/#news" className={styles.mobileLink} onClick={closeMenu}>
            News
          </Link>
          <Link href="/#about" className={styles.mobileLink} onClick={closeMenu}>
            About Town
          </Link>

          {user && (
            <Link 
              href={`/${user.branch === 'global' ? 'lagos' : user.branch}/gallery`} 
              className={`${styles.mobileLink} ${pathname.includes('/gallery') ? styles.mobileActive : ''}`}
              onClick={closeMenu}
            >
              Member Galleries
            </Link>
          )}

          <div className={styles.mobileAuthBorder}></div>

          {user ? (
            <div className={styles.mobileUserInfo}>
              <div className={styles.mobileUserName}>{user.name}</div>
              <div className={styles.mobileUserRole}>
                {user.role === 'admin' ? 'National Admin' : `${user.branch.toUpperCase()} Member`}
              </div>
              <button 
                onClick={() => {
                  logout();
                  closeMenu();
                }} 
                className={`${styles.mobileLogoutBtn} outline-btn`}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.mobileAuthButtons}>
              <Link href="/login" className={styles.mobileLoginLink} onClick={closeMenu}>
                Login
              </Link>
              <Link href="/register" className="glow-btn" onClick={closeMenu}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
