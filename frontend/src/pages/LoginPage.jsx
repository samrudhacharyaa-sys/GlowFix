import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, AlertCircle, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';

export const LoginPage = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.email || !formData.password) {
      setErrorMsg(t('login_err_empty'));
      return;
    }

    setSubmitting(true);

    try {
      const loggedInUser = await login(formData.email.trim(), formData.password);
      
      const fromPath = location.state?.from?.pathname;
      if (fromPath) {
        navigate(fromPath, { replace: true });
      } else if (loggedInUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (email, pass) => {
    setFormData({ email, password: pass });
    setErrorMsg('');
  };

  return (
    <div className="auth-page">
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="form-container-card" style={{ maxWidth: '460px' }}>
          {/* Header with Official Logo */}
          <div className="form-header">
            <div style={{ margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>
              <Logo size="lg" />
            </div>
            <h2>{t('login_title')}</h2>
            <p>{t('login_subtitle')}</p>
          </div>

          {errorMsg && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Quick Demo Credentials Banner */}
          <div style={{
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('login_demo_title')}
            </span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => fillDemo('citizen@example.com', 'citizen123')}
              >
                <User size={14} color="#2563eb" />
                {t('login_demo_citizen')}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => fillDemo('admin@glowfix.gov', 'admin123')}
              >
                <Shield size={14} color="#2563eb" />
                {t('login_demo_admin')}
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">{t('login_email_label')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder={t('login_email_placeholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">{t('login_pass_label')}</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '8px' }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner-sm"></div>
                  {t('login_btn_submitting')}
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  {t('login_btn_submit')}
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {t('login_no_account')}{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              {t('login_create_link')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;