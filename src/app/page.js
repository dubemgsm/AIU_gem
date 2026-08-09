'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BRANCHES } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function Home() {
  const { user } = useAuth();
  
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loadingNews, setLoadingNews] = useState(true);
  
  // News Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newBranch, setNewBranch] = useState('global');
  const [newTags, setNewTags] = useState('');
  const [newImage, setNewImage] = useState('');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactBranch, setContactBranch] = useState('global');
  const [contactMessage, setContactMessage] = useState('');
  
  // UI Notifications
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch News from Backend API
  const fetchNews = async () => {
    setLoadingNews(true);
    try {
      const response = await fetch('/api/news?branch=all');
      const data = await response.json();
      if (data.success) {
        setNews(data.data);
      }
    } catch (error) {
      console.error('Error loading news from backend:', error);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Filter and Search News
  useEffect(() => {
    let result = news;

    // Filter by branch
    if (activeFilter !== 'all') {
      result = result.filter(item => item.target_branch === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredNews(result);
  }, [news, activeFilter, searchQuery]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Submit News Article (Sends to backend with session credentials for RBAC checks)
  const handlePublishNews = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      showToast('Please fill in the title and content.');
      return;
    }

    const tagsArray = newTags
      ? newTags.split(',').map(tag => tag.trim()).filter(Boolean)
      : ['Update'];

    const defaultImg = newBranch === 'lagos' 
      ? 'https://images.unsplash.com/photo-1597058776822-4416035eb445?q=80&w=800&auto=format&fit=crop'
      : newBranch === 'abuja'
      ? 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=800&auto=format&fit=crop'
      : newBranch === 'portharcourt'
      ? 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=800&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop';

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          target_branch: newBranch,
          image: newImage.trim() || defaultImg,
          tags: tagsArray,
          user // Supply simulated session credentials
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('News article successfully published to database!');
        // Reset Form
        setNewTitle('');
        setNewContent('');
        setNewTags('');
        setNewImage('');
        // Reload news feed from database
        fetchNews();
      } else {
        // Render RBAC rejection message
        showToast(data.message || 'Failed to publish news.');
      }
    } catch (error) {
      console.error('Publish news error:', error);
      showToast('Server error publishing news.');
    }
  };

  // Submit Contact Form
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      showToast('Please complete all form fields.');
      return;
    }

    console.log('Contact form submitted:', { contactName, contactEmail, contactBranch, contactMessage });

    // Reset Form
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    showToast(`Message sent to ${BRANCHES[contactBranch].name}! We will get back to you shortly.`);
  };

  return (
    <div className={styles.homeWrapper}>
      {/* Toast Notification */}
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={`${styles.heroContent} animate-fade-in`}>
          <span className={styles.heroBadge}>Ancestry • Unity • Progress</span>
          <h1 className={`${styles.heroTitle} text-gradient`}>Amesi Improvement Union</h1>
          <p className={styles.heroSubtitle}>
            Preserving the rich cultural heritage of Amesi town, supporting education, launching healthcare initiatives, and uniting all indigenes worldwide across our branch portals.
          </p>
          <div className={styles.heroActions}>
            <Link href="#about" className="glow-btn">Discover Amesi Town</Link>
            <Link href="#branches" className="outline-btn">Explore Local Branches</Link>
          </div>
        </div>
      </section>

      {/* Town Showcase Section */}
      <section id="about" className={`${styles.section} container`}>
        <div className={styles.sectionTitleContainer}>
          <span className={styles.sectionSubtitle}>Socio-Cultural Heritage</span>
          <h2 className={`${styles.sectionTitle} text-gradient-green`}>Showcasing Amesi Town</h2>
        </div>
        
        <div className={styles.showcaseGrid}>
          {/* History */}
          <div className={`${styles.showcaseCard} glass-panel`}>
            <span className={styles.showcaseIcon}>🏛️</span>
            <h3 className={styles.showcaseCardTitle}>History & Ancestry</h3>
            <p className={styles.showcaseCardText}>
              Amesi is an ancient town in the Aguata LGA of Anambra State. According to ancestral heritage, Achina, Akpo, and Amesi (founded by Eshi) are sibling towns representing the three sons of Akalabo. Sharing a common lineage, social customs, and Igbo dialect, the brother towns celebrate the triennial Akalabo Festival to commemorate their migration and ancestral unity.
            </p>
          </div>

          {/* Administrative Villages */}
          <div className={`${styles.showcaseCard} glass-panel`}>
            <span className={styles.showcaseIcon}>🏡</span>
            <h3 className={styles.showcaseCardTitle}>The Five Villages</h3>
            <p className={styles.showcaseCardText}>
              Administratively, Amesi town is comprised of five main villages that run domestic affairs and collaborate through the AIU:
            </p>
            <ul className={styles.villagesList}>
              <li className={styles.villageItem}>Obinato</li>
              <li className={styles.villageItem}>Amuwo</li>
              <li className={styles.villageItem}>Umuocha</li>
              <li className={styles.villageItem}>Ubaha</li>
              <li className={styles.villageItem}>Obinabo (Created in 2018)</li>
            </ul>
          </div>

          {/* AIU Mission */}
          <div className={`${styles.showcaseCard} glass-panel`}>
            <span className={styles.showcaseIcon}>🤝</span>
            <h3 className={styles.showcaseCardTitle}>Amesi Improvement Union</h3>
            <p className={styles.showcaseCardText}>
              The AIU is the apex developmental body. It coordinates scholarships, civic facilities, and town security. Currently, AIU sponsors community health development schemes, including state health insurance (ASHIA) memberships for women and children.
            </p>
          </div>

          {/* Diaspora & Local Branches */}
          <div className={`${styles.showcaseCard} glass-panel`}>
            <span className={styles.showcaseIcon}>🌍</span>
            <h3 className={styles.showcaseCardTitle}>Diaspora Network</h3>
            <p className={styles.showcaseCardText}>
              Our indigenes are represented dynamically across major cities in Nigeria and the diaspora. The Lagos, Abuja, and Port Harcourt branches are active community nodes driving resources back to the ancestral home of Amesi.
            </p>
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className={`${styles.section} ${styles.bgSecondary}`}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <span className={styles.sectionSubtitle}>Regional Delegations</span>
            <h2 className={`${styles.sectionTitle} text-gradient`}>Our Branch Portals</h2>
          </div>

          <div className={styles.branchesGrid}>
            {Object.values(BRANCHES)
              .filter(b => b.id !== 'global')
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(branch => (
                <div key={branch.id} className={`${styles.branchCard} glass-panel`}>
                  <div className={styles.branchImageContainer}>
                    <img 
                      src={branch.heroImage} 
                      alt={branch.name} 
                      className={styles.branchImage}
                    />
                  </div>
                  <div className={styles.branchContent}>
                    <h3 className={styles.branchName}>{branch.name}</h3>
                    <div className={styles.branchLocation}>{branch.locationName}</div>
                    <p className={styles.branchDesc}>{branch.description}</p>
                    <ul className={styles.branchDetailsList}>
                      <li><strong>President:</strong> {branch.president}</li>
                      <li><strong>Schedule:</strong> {branch.meetingSchedule}</li>
                      <li><strong>Address:</strong> {branch.address}</li>
                    </ul>
                    <Link href={`/${branch.id}`} className={`${styles.branchBtn} glow-btn`}>
                      Enter Branch portal
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* News Feed Section */}
      <section id="news" className={`${styles.section} container`}>
        <div className={styles.sectionTitleContainer}>
          <span className={styles.sectionSubtitle}>Community Highlights</span>
          <h2 className={`${styles.sectionTitle} text-gradient-green`}>Unified News Feed</h2>
        </div>

        <div className={styles.newsHeader}>
          {/* Filters */}
          <div className={styles.newsControls}>
            {['all', 'global', 'lagos', 'abuja', 'portharcourt'].map(filter => (
              <button
                key={filter}
                className={`${styles.filterBtn} ${activeFilter === filter ? styles.filterBtnActive : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'all' ? 'All News' : filter === 'global' ? 'National' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search news & announcements..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* News Grid */}
        {loadingNews ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading announcements...
          </div>
        ) : filteredNews.length > 0 ? (
          <div className={styles.newsGrid}>
            {filteredNews.map(article => (
              <div 
                key={article.id} 
                className={`${styles.newsCard} glass-panel`}
                onClick={() => setSelectedArticle(article)}
              >
                <div className={styles.newsImageContainer}>
                  <img src={article.image} alt={article.title} className={styles.newsImage} />
                  <span className={styles.newsTag}>
                    {article.target_branch === 'global' ? 'National' : article.target_branch.toUpperCase()}
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
            No news articles found matching the filters or search query.
          </div>
        )}

        {/* Publish Local/National News Panel */}
        <div className={`${styles.postNewsContainer} glass-panel`}>
          <h3 style={{ fontSize: '1.5rem' }} className="text-gradient">
            Publish Community Announcement
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Submit news or notices. Only super admins or corresponding branch administrators can write announcements.
          </p>

          <form onSubmit={handlePublishNews} className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Article Title</label>
              <input
                type="text"
                placeholder="e.g., Annual Youth Scholarship applications open"
                className={styles.formInput}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Target Branch / Feed Scope</label>
              <select
                className={styles.formSelect}
                value={newBranch}
                onChange={(e) => setNewBranch(e.target.value)}
              >
                <option value="global">National (All Branches)</option>
                <option value="abuja">AIU Abuja Branch</option>
                <option value="lagos">AIU Lagos Branch</option>
                <option value="portharcourt">AIU Port Harcourt Branch</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., Development, Youth, Culture"
                className={styles.formInput}
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Featured Image URL (optional)</label>
              <input
                type="text"
                placeholder="Paste an Unsplash image link or leave empty for default"
                className={styles.formInput}
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
              />
            </div>

            <div className={`${styles.formGroup} styles.formGroupFull`}>
              <label className={styles.formLabel}>Article Content</label>
              <textarea
                placeholder="Write the full news text here..."
                className={styles.formTextarea}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </div>

            <div className={styles.formGroupFull}>
              <button type="submit" className="glow-btn formSubmit">Publish Announcement</button>
            </div>
          </form>
        </div>
      </section>

      {/* Global Contact Us Section */}
      <section id="contact" className={`${styles.section} ${styles.bgSecondary}`}>
        <div className="container">
          <div className={styles.sectionTitleContainer}>
            <span className={styles.sectionSubtitle}>Get In Touch</span>
            <h2 className={`${styles.sectionTitle} text-gradient-green`}>Contact Our Secretariats</h2>
          </div>

          <div className={styles.contactGrid}>
            {/* Info Card */}
            <div className={`${styles.contactInfoCard} glass-panel`}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>AIU Administration</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Reach out to the AIU National Executives or direct your inquiries to a specific regional branch.
              </p>
              
              <div className={styles.contactInfoItem}>
                <span className={styles.contactIcon}>📍</span>
                <div>
                  <div className={styles.contactInfoTitle}>National Headquarters</div>
                  <div className={styles.contactInfoText}>ASCON Hall, Amesi, Aguata LGA, Anambra State</div>
                </div>
              </div>

              <div className={styles.contactInfoItem}>
                <span className={styles.contactIcon}>📞</span>
                <div>
                  <div className={styles.contactInfoTitle}>Phone Numbers</div>
                  <div className={styles.contactInfoText}>+234 803 123 4567 (National)</div>
                  <div className={styles.contactInfoText}>+234 802 987 6543 (Lagos)</div>
                </div>
              </div>

              <div className={styles.contactInfoItem}>
                <span className={styles.contactIcon}>✉️</span>
                <div>
                  <div className={styles.contactInfoTitle}>Email Correspondence</div>
                  <div className={styles.contactInfoText}>support@aiu-portal.org</div>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className={`${styles.contactFormCard} glass-panel`}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Send Us a Message</h3>
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

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Select Secretariat Branch</label>
                  <select
                    className={styles.formSelect}
                    value={contactBranch}
                    onChange={(e) => setContactBranch(e.target.value)}
                  >
                    <option value="global">National Secretariat (Amesi)</option>
                    <option value="abuja">Abuja Branch Secretariat</option>
                    <option value="lagos">Lagos Branch Secretariat</option>
                    <option value="portharcourt">Port Harcourt Branch Secretariat</option>
                  </select>
                </div>

                <div className={`${styles.formGroup} styles.formGroupFull`}>
                  <label className={styles.formLabel}>Message</label>
                  <textarea
                    required
                    placeholder="Type your message details..."
                    className={styles.formTextarea}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <button type="submit" className="glow-btn formSubmit">Send Message</button>
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
                <span>Branch: <strong style={{ color: 'var(--accent)' }}>
                  {selectedArticle.target_branch === 'global' ? 'National' : selectedArticle.target_branch.toUpperCase()}
                </strong></span>
              </div>
              <h2 className={`${styles.modalTitle} text-gradient`}>{selectedArticle.title}</h2>
              <div className={styles.modalText}>
                {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} style={{ marginBottom: '1rem' }}>{paragraph}</p>
                ))}
              </div>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedArticle.tags.map((tag, index) => (
                  <span key={index} style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--accent)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
