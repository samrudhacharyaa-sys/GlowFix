import React from 'react';
import { Link } from 'react-router-dom';
import { LightbulbOff, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NotFoundPage = () => {
  const { t } = useLanguage();

  return (
    <div className="auth-page">
      <div className="container" style={{ textAlign: 'center', maxWidth: '520px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--surface-subtle)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <LightbulbOff size={36} />
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>404</h1>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-secondary)' }}>
          {t('lang_kn') === 'ಕನ್ನಡ' ? 'ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ' : 'Page Not Found'}
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
          {t('lang_kn') === 'ಕನ್ನಡ'
            ? 'ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟ ಲಭ್ಯವಿಲ್ಲ ಅಥವಾ ಸ್ಥಳಾಂತರಿಸಲಾಗಿದೆ.'
            : 'The page you are looking for does not exist or has been relocated in the GlowFix system.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={18} /> {t('nav_home')}
          </Link>
          <Link to="/report" className="btn btn-secondary">
            {t('nav_report')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;