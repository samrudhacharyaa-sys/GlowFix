import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Logo size="lg" />
            </Link>
            <p style={{ marginTop: '14px' }}>
              "{t('motto')}"
              <br />
              {t('footer_desc')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h5>{t('footer_quick_nav')}</h5>
            <ul>
              <li><Link to="/">{t('nav_home')}</Link></li>
              <li><Link to="/report">{t('nav_report')}</Link></li>
              <li><Link to="/track">{t('nav_track')}</Link></li>
              <li><Link to="/dashboard">{t('nav_dashboard')}</Link></li>
              <li><Link to="/admin">{t('nav_admin')}</Link></li>
              <li><Link to="/settings">{t('nav_settings')}</Link></li>
            </ul>
          </div>

          {/* Emergency / Support Info */}
          <div className="footer-links-col">
            <h5>{t('footer_helpline_title')}</h5>
            <ul>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <Phone size={14} color="#2563eb" />
                <span>{t('footer_toll_free')}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <Mail size={14} color="#2563eb" />
                <span>{t('footer_email')}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>{t('footer_support_24x7')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} {t('footer_copyright')}
          </div>
          <div>
            {t('footer_tech_stack')}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;