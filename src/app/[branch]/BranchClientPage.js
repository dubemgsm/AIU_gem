'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { BRANCHES } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import styles from './branch.module.css';

export default function BranchClientPage({ params }) {
  const { branch: branchId } = use(params);
  const { user } = useAuth();
  
  const [branchInfo, setBranchInfo] = useState(null);
  const [localNews, setLocalNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isValidBranch, setIsValidBranch] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  // Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Check validity and load branch specific details
  useEffect(() => {
    const validBranches = ['abuja', 'lagos', 'portharcourt'];
    if (!validBranches.includes(branchId)) {
      setIsValidBranch(false);
      return;
    }

    setBranchInfo(BRANCHES[branchId]);

    // Load news from Backend API for this branch (local branch news + global national news)
    const fetchLocalNews = async () => {
      setLoadingNews(true);
      try {
        const response = await fetch(`/api/news?branch=${branchId}`);
        const data = await response.json();
        if (data.success) {
          setLocalNews(data.data);
        }
      } catch (error) {
        console.error('Error fetching branch news:', error);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchLocalNews();
  }, [branchId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      showToast('Please fill out all fields.');
      return;
    }

    console.log(`Local Contact to ${branchId} branch:`, { contactName, contactEmail, contactMessage });

    setContactName('');
    setContactEmail('');
    setContactMessage('');
    showToast(`Your message has been sent to the ${branchInfo?.name} secretariat!`);
  };

  if (!isValidBranch) {
    return (
      <div className={`${styles.errorContainer} container`}>
        <h2 className={styles.errorTitle}>404 - Branch Not Found</h2>
        <p className={styles.errorText}>
          The Amesi Improvement Union branch you are looking for does not exist. Please check the URL or select a valid branch from the menu.
        </p>
        <Link href="/" className="glow-btn">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!branchInfo) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading branch portal details...</p>
      </div>
    );
  }

  // Auth checker logic
  const isAuthorized = user && (user.role === 'super_admin' || user.branch === branchId);

  return (
    <div className={styles.wrapper}>
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      {/* Branch Hero Section */}
      <section 
        className={styles.hero} 
        style={{ backgroundImage: `url(${branchInfo.heroImage})` }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={`${styles.heroContent} animate-fade-in`}>
          <span className={styles.heroBadge}>Amesi Improvement Union</span>
          <h1 className={`${styles.heroTitle} text-gradient`}>{branchInfo.name}</h1>
          <p className={styles.heroSubtitle}>{branchInfo.description}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="#gallery" className="glow-btn">Member Photo Gallery</Link>
            <Link href="#contact" className="outline-btn">Contact Secretariat</Link>
          </div>
        </div>
      </section>

      {/* Private Photo Gallery Access Teaser */}
      <section id="gallery" className={`${styles.section} ${styles.bgSecondary}`}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <span className={styles.sectionSubtitle}>Protected Directory</span>
            <h2 className={`${styles.sectionTitle} text-gradient-green`}>Member Photo Gallery</h2>
          </div>

          <div className={`${styles.teaserCard} glass-panel`}>
            {/* Blurry Teaser Grid */}
            <div className={styles.teaserGrid}>
              <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=300" className={styles.teaserThumb} alt="Member Teaser" />
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300" className={styles.teaserThumb} alt="Member Teaser" />
              <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=300" className={styles.teaserThumb} alt="Member Teaser" />
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=300" className={styles.teaserThumb} alt="Member Teaser" />
            </div>

            {/* Access Status details */}
            <div className={styles.teaserContent}>
              {!user ? (
                // Scenario 1: Not logged in
                <>
                  <div className={styles.teaserStatusBadge}>
                    <span className={styles.lockIcon}>🔒</span> Private Gallery
                  </div>
                  <h3 className={styles.teaserTitle}>Access Restricted</h3>
                  <p className={styles.teaserText}>
                    The photo gallery contains portraits, names, and event coverage of Amesi Improvement Union members. Access requires an authenticated member account.
                  </p>
                  <Link href={`/login?redirect=/${branchId}/gallery`} className={`${styles.teaserBtn} glow-btn`}>
                    Login to View Gallery
                  </Link>
                </>
              ) : !isAuthorized ? (
                // Scenario 2: Logged in, but unauthorized for this branch
                <>
                  <div className={styles.teaserStatusBadge} style={{ borderColor: 'var(--error)' }}>
                    <span className={styles.lockIcon} style={{ color: 'var(--error)' }}>🔒</span> Access Restricted
                  </div>
                  <h3 className={styles.teaserTitle}>Branch Clearance Required</h3>
                  <p className={styles.teaserText}>
                    You are registered under the <strong style={{ color: 'var(--accent)' }}>AIU {user.branch.toUpperCase()}</strong> branch database. You only have viewing permissions for your own branch's private gallery.
                  </p>
                  <div className={styles.restrictBox}>
                    <div className={styles.restrictTitle}>
                      <span>⚠️</span> Regional Clearance Warning
                    </div>
                    <span>Members are restricted to their local portal databases to preserve regional gallery privacy.</span>
                    <Link href={`/${user.branch}/gallery`} className="glow-btn" style={{ background: 'var(--primary)', boxShadow: 'none' }}>
                      Go to {user.branch.toUpperCase()} Gallery
                    </Link>
                  </div>
                </>
              ) : (
                // Scenario 3: Authorized
                <>
                  <div className={styles.teaserStatusBadge} style={{ borderColor: 'var(--success)' }}>
                    <span className={styles.lockIcon} style={{ color: 'var(--success)' }}>🔓</span> Access Granted
                  </div>
                  <h3 className={styles.teaserTitle}>Welcome, {user.name}</h3>
                  <p className={styles.teaserText}>
                    Your account has been authenticated with regional viewing clearance. You can explore the {branchInfo.name} members directory, meetings, and cultural archives.
                  </p>
                  <Link href={`/${branchId}/gallery`} className={`${styles.teaserBtn} glow-btn`}>
                    Enter Member Gallery
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Local News Feed */}
      <section id="news" className={`${styles.section} container`}>
        <div className={styles.sectionTitleContainer}>
          <span className={styles.sectionSubtitle}>Regional Updates</span>
          <h2 className={`${styles.sectionTitle} text-gradient`}>Local Branch News</h2>
        </div>

        {loadingNews ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading branch news...
          </div>
        ) : localNews.length > 0 ? (
          <div className={styles.newsGrid}>
            {localNews.map(article => (
              <div 
                key={article.id} 
                className={`${styles.newsCard} glass-panel`}
                onClick={() => setSelectedArticle(article)}
              >
                <div className={styles.newsImageContainer}>
                  <img src={article.image} alt={article.title} className={styles.newsImage} />
                  <span className={styles.newsTag} style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: article.target_branch === 'global' ? 'rgba(212, 175, 55, 0.9)' : 'rgba(4, 106, 56, 0.9)',
                    color: '#fff',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}>
                    {article.target_branch === 'global' ? 'National' : 'Local'}
                  </span>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div className={styles.newsMeta}>
                    <span>By {article.author}</span>
                    <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className={styles.newsCardTitle}>{article.title}</h3>
                  <p className={styles.newsExcerpt}>{article.content}</p>
                  <div className={styles.newsReadMore}>Read Article</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No news updates published for this branch yet.
          </div>
        )}
      </section>

      {/* Local Contact Section */}
      <section id="contact" className={`${styles.section} ${styles.bgSecondary}`}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <span className={styles.sectionSubtitle}>Get In Touch</span>
            <h2 className={`${styles.sectionTitle} text-gradient-green`}>Contact {branchInfo.name}</h2>
          </div>

          <div className={styles.contactGrid}>
            {/* Info */}
            <div className={`${styles.contactInfoCard} glass-panel`}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Branch Secretariat</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                <div>
                  <div className={styles.contactInfoTitle}>President</div>
                  <div className={styles.contactInfoText}>{branchInfo.president}</div>
                </div>

                <div>
                  <div className={styles.contactInfoTitle}>Meeting Venue & Address</div>
                  <div className={styles.contactInfoText}>{branchInfo.address}</div>
                </div>

                <div>
                  <div className={styles.contactInfoTitle}>Meeting Schedule</div>
                  <div className={styles.contactInfoText}>{branchInfo.meetingSchedule}</div>
                </div>

                <div>
                  <div className={styles.contactInfoTitle}>Direct Communications</div>
                  <div className={styles.contactInfoText}><strong>Email:</strong> {branchInfo.email}</div>
                  <div className={styles.contactInfoText}><strong>Phone:</strong> {branchInfo.phone}</div>
                </div>
              </div>
            </div>

            {/* Local Form */}
            <div className={`${styles.contactFormCard} glass-panel`}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Send Message to Branch Executive</h3>
              <form onSubmit={handleContactSubmit} className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className={styles.formInput}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className={styles.formInput}
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>

                <div className={`${styles.formGroup} styles.formGroupFull`}>
                  <label className={styles.formLabel}>Message details</label>
                  <textarea
                    required
                    placeholder="Write your branch inquiry here..."
                    className={styles.formTextarea}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <button type="submit" className="glow-btn formSubmit">Send to Secretariat</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* News Article Detail Modal */}
      {selectedArticle && (
        <div className={styles.modalOverlay} onClick={() => setSelectedArticle(null)}>
          <div className={`${styles.modalContent} glass-panel`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedArticle(null)}>×</button>
            <div className={styles.modalHero}>
              <img src={selectedArticle.image} alt={selectedArticle.title} className={styles.modalHeroImg} />
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalMeta}>
                <span>Published by: <strong>{selectedArticle.author}</strong></span>
                <span>Date: <strong>{new Date(selectedArticle.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></span>
                <span>Branch: <strong style={{ color: 'var(--accent)' }}>{selectedArticle.target_branch.toUpperCase()}</strong></span>
              </div>
              <h2 className={`${styles.modalTitle} text-gradient`}>{selectedArticle.title}</h2>
              <div className={styles.modalText}>
                {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} style={{ marginBottom: '1rem' }}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
