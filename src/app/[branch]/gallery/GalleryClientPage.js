'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { BRANCHES } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import styles from './gallery.module.css';

export default function GalleryClientPage({ params }) {
  const { branch: branchId } = use(params);
  const { user, loading } = useAuth();

  const [branchInfo, setBranchInfo] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isValidBranch, setIsValidBranch] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadCategory, setUploadCategory] = useState('portrait');
  const [uploadDesc, setUploadDesc] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const fetchPhotos = async () => {
    setLoadingPhotos(true);
    try {
      const response = await fetch(`/api/gallery?branch=${branchId}`);
      const data = await response.json();
      if (data.success) {
        setPhotos(data.data);
      }
    } catch (error) {
      console.error('Error loading gallery photos:', error);
    } finally {
      setLoadingPhotos(false);
    }
  };

  // Initialize and check branch validity
  useEffect(() => {
    const validBranches = ['abuja', 'lagos', 'portharcourt'];
    if (!validBranches.includes(branchId)) {
      setIsValidBranch(false);
      return;
    }

    setBranchInfo(BRANCHES[branchId]);
    fetchPhotos();
  }, [branchId]);

  // Filter and Search Gallery
  useEffect(() => {
    let result = photos;

    if (activeTab !== 'all') {
      result = result.filter(p => p.category === activeTab);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.uploader.toLowerCase().includes(query)
      );
    }

    setFilteredPhotos(result);
  }, [photos, activeTab, searchQuery]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadDesc.trim()) {
      showToast('Please fill in the title and description.');
      return;
    }

    const defaultImg = uploadCategory === 'portrait'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop';

    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          imageUrl: uploadUrl.trim() || defaultImg,
          description: uploadDesc,
          category: uploadCategory,
          branch_id: branchId,
          user // Supply current user session info
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('Photo uploaded successfully to branch archives!');
        // Reset form
        setUploadTitle('');
        setUploadUrl('');
        setUploadDesc('');
        // Reload photos
        fetchPhotos();
      } else {
        // Display dynamic RBAC restriction warnings
        showToast(data.message || 'Failed to upload photo.');
      }
    } catch (err) {
      console.error('Upload photo error:', err);
      showToast('Server error uploading photo.');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Checking union membership credentials...</p>
      </div>
    );
  }

  // 1. Check if valid URL branch name
  if (!isValidBranch) {
    return (
      <div className={`${styles.restrictWrapper} container`}>
        <div className={`${styles.restrictCard} glass-panel`}>
          <span className={styles.restrictIcon}>❌</span>
          <h2 className={`${styles.title} text-gradient`}>Branch Error</h2>
          <p className={styles.subtitle}>The specified regional branch gallery does not exist.</p>
          <Link href="/" className="glow-btn restrictBtn">Return Home</Link>
        </div>
      </div>
    );
  }

  // 2. Check if logged in
  if (!user) {
    return (
      <div className={`${styles.restrictWrapper} container`}>
        <div className={`${styles.restrictCard} glass-panel`}>
          <span className={styles.restrictIcon}>🔒</span>
          <h2 className={`${styles.title} text-gradient`}>Access Denied</h2>
          <p className={styles.subtitle}>
            You must sign in with a registered Amesi Improvement Union account to view this private photo directory.
          </p>
          <Link href={`/login?redirect=/${branchId}/gallery`} className="glow-btn restrictBtn">
            Login to Member Account
          </Link>
        </div>
      </div>
    );
  }

  // 3. Check role authorization (admin or branch matches)
  const isAuthorized = user.role === 'super_admin' || user.branch === branchId;

  if (!isAuthorized) {
    return (
      <div className={`${styles.restrictWrapper} container`}>
        <div className={`${styles.restrictCard} glass-panel`} style={{ borderColor: 'var(--error)' }}>
          <span className={styles.restrictIcon}>⚠️</span>
          <h2 className={`${styles.title} text-gradient`} style={{ color: 'var(--error)' }}>Clearance Warning</h2>
          <p className={styles.subtitle}>
            Regional privacy regulations restrict members to their local directories. You are registered in the{' '}
            <strong style={{ color: 'var(--accent)' }}>AIU {user.branch.toUpperCase()}</strong> branch.
          </p>
          <Link href={`/${user.branch}/gallery`} className="glow-btn restrictBtn">
            Go to my {user.branch.toUpperCase()} Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.galleryWrapper} container`}>
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      {/* Header */}
      <div className={styles.headerContainer}>
        <div className={styles.titleSection}>
          <span className={styles.branchBadge}>{branchInfo?.name}</span>
          <h1 className={`${styles.title} text-gradient`}>Private Photo Directory</h1>
          <p className={styles.subtitle}>Members registry and event galleries for the regional chapter.</p>
        </div>
        <div>
          <Link href={`/${branchId}`} className="outline-btn">
            ← Back to Branch Portal
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controlsRow}>
        <div className={styles.filterTabs}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Photos
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'portrait' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('portrait')}
          >
            Members Directory
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'event' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('event')}
          >
            Events & Meetings
          </button>
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search member name or keywords..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Gallery Grid */}
      {loadingPhotos ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading photos...
        </div>
      ) : filteredPhotos.length > 0 ? (
        <div className={styles.galleryGrid}>
          {filteredPhotos.map(photo => (
            <div
              key={photo.id}
              className={`${styles.photoCard} glass-panel`}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className={styles.imgContainer}>
                <img src={photo.imageUrl} alt={photo.title} className={styles.photoImg} />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{photo.title}</h3>
                <p className={styles.cardDesc}>{photo.description}</p>
                <div className={styles.cardMeta}>
                  <span>By {photo.uploader}</span>
                  <span>{photo.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          No gallery images match your current search queries or filters.
        </div>
      )}

      {/* Mock Photo Uploader Panel */}
      <div className={`${styles.uploadSection} glass-panel`}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Add Photo to Branch Archive</h3>
          <p className={styles.sectionText}>
            Only members belonging to this branch or super administrators are authorized to upload images to this gallery.
          </p>
        </div>

        <form onSubmit={handleUploadSubmit} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Title / Caption</label>
            <input
              type="text"
              required
              placeholder="e.g., Chief Chinedu at Akalabo Festival"
              className={styles.formInput}
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Archive Category</label>
            <select
              className={styles.formSelect}
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
            >
              <option value="portrait">Member Directory (Portrait)</option>
              <option value="event">Meeting / Event Coverage</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Photo URL (optional)</label>
            <input
              type="text"
              placeholder="Paste Unsplash image URL or leave empty for default mockup"
              className={styles.formInput}
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Uploader Identity</label>
            <input
              type="text"
              className={styles.formInput}
              value={user?.name || 'Authorized Member'}
              disabled
            />
          </div>

          <div className={`${styles.formGroup} styles.formGroupFull`}>
            <label className={styles.formLabel}>Detailed Description</label>
            <textarea
              required
              placeholder="Provide context, dates, names, or village representation details..."
              className={styles.formTextarea}
              value={uploadDesc}
              onChange={(e) => setUploadDesc(e.target.value)}
            />
          </div>

          <div className={styles.formGroupFull}>
            <button type="submit" className="glow-btn formSubmit">Publish to Gallery</button>
          </div>
        </form>
      </div>

      {/* Photo Showcase Detail Modal */}
      {selectedPhoto && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPhoto(null)}>
          <div className={`${styles.modalContent} glass-panel`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedPhoto(null)}>×</button>
            <div className={styles.modalImageContainer}>
              <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} className={styles.modalImg} />
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalMeta}>
                <span>Uploader: <strong>{selectedPhoto.uploader}</strong></span>
                <span>Date: <strong>{selectedPhoto.date}</strong></span>
                <span>Category: <strong style={{ color: 'var(--accent)', textTransform: 'uppercase' }}>{selectedPhoto.category}</strong></span>
              </div>
              <h2 className={`${styles.modalTitle} text-gradient`}>{selectedPhoto.title}</h2>
              <p className={styles.modalText}>{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
