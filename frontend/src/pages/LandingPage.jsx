import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  Clock,
  Shield,
  MapPin,
  ArrowRight,
  Camera,
  Activity
} from 'lucide-react';
import Logo from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';

export const LandingPage = () => {
  const { t } = useLanguage();
  const [quickTrackId, setQuickTrackId] = useState('');
  const navigate = useNavigate();

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      navigate(`/track?id=${encodeURIComponent(quickTrackId.trim().toUpperCase())}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div className="hero-pill-badge">
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span>
              {t('hero_badge')}
            </div>

            <h1 className="hero-title">
              {t('hero_title_part1')} <span>{t('hero_title_part2')}</span>
            </h1>

            <p className="hero-desc">
              {t('hero_desc')}
            </p>

            <div className="hero-buttons">
              <Link to="/report" className="btn btn-primary btn-lg">
                <AlertTriangle size={20} />
                <span>{t('hero_btn_report')}</span>
              </Link>
              <Link to="/track" className="btn btn-secondary btn-lg">
                <Search size={20} />
                <span>{t('hero_btn_track')}</span>
              </Link>
            </div>

            {/* Quick Track Bar */}
            <div className="hero-search-box">
              <form onSubmit={handleQuickTrack} className="hero-search-inner">
                <input
                  type="text"
                  className="form-input"
                  placeholder={t('hero_search_placeholder')}
                  value={quickTrackId}
                  onChange={(e) => setQuickTrackId(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  {t('hero_search_btn')}
                </button>
              </form>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
                {t('hero_tip')} <strong>GF-102941</strong> {t('hero_tip_or')} <strong>SL-0421</strong>
              </span>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="hero-visual-card">
            <div className="hero-visual-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Logo size={32} showText={false} />
                <div>
                  <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)' }}>{t('monitor_title')}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('monitor_subtitle')}</span>
                </div>
              </div>
              <span className="badge badge-resolved">{t('monitor_status')}</span>
            </div>

            <div style={{
              background: 'var(--surface-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              border: '1px solid var(--border-color)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {t('monitor_incident')} #GF-102941
                </span>
                <span className="badge badge-pending">{t('status_pending')}</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '4px 0' }}>
                <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {t('monitor_sample_loc')}
              </p>
              <span style={{ fontSize: '0.775rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                Street Light: SL-0421 • {t('fault_not_working')}
              </span>
            </div>

            <div className="hero-stat-row">
              <div className="hero-stat-card">
                <div className="num">{t('monitor_target_val')}</div>
                <div className="label">{t('monitor_target')}</div>
              </div>
              <div className="hero-stat-card">
                <div className="num">{t('monitor_updates_val')}</div>
                <div className="label">{t('monitor_updates')}</div>
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link to="/register" style={{ fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {t('monitor_join')} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Project Description Section */}
      <section className="section" style={{ backgroundColor: 'var(--surface-card)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{t('about_tag')}</span>
            <h2 className="section-title">{t('about_title')}</h2>
            <p className="section-desc">
              {t('about_desc')}
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-box">
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={22} />
              </div>
              <h4>{t('feat_safety_title')}</h4>
              <p>{t('feat_safety_desc')}</p>
            </div>

            <div className="feature-box">
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'var(--accent-amber-light)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={22} />
              </div>
              <h4>{t('feat_photo_title')}</h4>
              <p>{t('feat_photo_desc')}</p>
            </div>

            <div className="feature-box">
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'var(--accent-green-light)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={22} />
              </div>
              <h4>{t('feat_tracking_title')}</h4>
              <p>{t('feat_tracking_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{t('work_tag')}</span>
            <h2 className="section-title">{t('work_title')}</h2>
            <p className="section-desc">
              {t('work_desc')}
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num-badge">1</div>
              <div className="step-icon-wrapper">
                <MapPin size={28} />
              </div>
              <h4 className="step-title">{t('step1_title')}</h4>
              <p className="step-desc">
                {t('step1_desc')}
              </p>
            </div>

            <div className="step-card">
              <div className="step-num-badge">2</div>
              <div className="step-icon-wrapper">
                <Camera size={28} />
              </div>
              <h4 className="step-title">{t('step2_title')}</h4>
              <p className="step-desc">
                {t('step2_desc')}
              </p>
            </div>

            <div className="step-card">
              <div className="step-num-badge">3</div>
              <div className="step-icon-wrapper">
                <Clock size={28} />
              </div>
              <h4 className="step-title">{t('step3_title')}</h4>
              <p className="step-desc">
                {t('step3_desc')}
              </p>
            </div>

            <div className="step-card">
              <div className="step-num-badge">4</div>
              <div className="step-icon-wrapper">
                <CheckCircle2 size={28} />
              </div>
              <h4 className="step-title">{t('step4_title')}</h4>
              <p className="step-desc">
                {t('step4_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section style={{ backgroundColor: 'var(--primary-800)', color: '#ffffff', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: '#ffffff', fontSize: '2.2rem', marginBottom: '14px' }}>
            {t('cta_title')}
          </h2>
          <p style={{ color: 'var(--primary-200)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px' }}>
            {t('cta_desc')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/report" className="btn btn-primary btn-lg" style={{ backgroundColor: '#ffffff', color: '#1e3a8a' }}>
              {t('cta_btn_report')}
            </Link>
            <Link to="/register" className="btn btn-outline-primary btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff' }}>
              {t('cta_btn_register')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;