import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen',
    adminSecret: ''
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

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMsg(t('reg_err_required'));
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg(t('reg_err_len'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg(t('reg_err_match'));
      return;
    }

    if (formData.role === 'admin' && formData.adminSecret !== 'glowfix-admin-2026') {
      setErrorMsg(t('reg_err_secret'));
      return;
    }

    setSubmitting(true);

    try {
      const newUser = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        adminSecret: formData.adminSecret
      });

      if (newUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="form-container-card" style={{ maxWidth: '480px' }}>
          {/* Header with Official Logo */}
          <div className="form-header">
            <div style={{ margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>
              <Logo size="lg" />
            </div>
            <h2>{t('reg_title')}</h2>
            <p>{t('reg_subtitle')}</p>
          </div>

          {errorMsg && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                {t('reg_name_label')} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder={t('reg_name_placeholder')}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                {t('reg_email_label')} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder={t('reg_email_placeholder')}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Account Role Selector */}
            <div className="form-group">
              <label className="form-label">{t('reg_role_label')}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  className={`fault-radio-label ${formData.role === 'citizen' ? 'selected' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'citizen' }))}
                >
                  <User size={16} color="#2563eb" />
                  <div>
                    <div style={{ fontSize: '0.85rem' }}>{t('reg_role_citizen')}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('reg_role_citizen_desc')}</div>
                  </div>
                </div>

                <div
                  className={`fault-radio-label ${formData.role === 'admin' ? 'selected' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'admin' }))}
                >
                  <Shield size={16} color="#2563eb" />
                  <div>
                    <div style={{ fontSize: '0.85rem' }}>{t('reg_role_admin')}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('reg_role_admin_desc')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* If Admin Role selected, require Admin Passcode */}
            {formData.role === 'admin' && (
              <div className="form-group" style={{ background: 'var(--surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <label className="form-label" htmlFor="adminSecret" style={{ color: 'var(--text-primary)' }}>
                  {t('reg_admin_secret_label')} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="adminSecret"
                  name="adminSecret"
                  type="password"
                  className="form-input"
                  placeholder={t('reg_admin_secret_placeholder')}
                  value={formData.adminSecret}
                  onChange={handleChange}
                  required={formData.role === 'admin'}
                />
                <div className="form-helper" style={{ color: 'var(--primary-600)' }}>
                  {t('reg_admin_secret_hint')}
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                {t('reg_pass_label')} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder={t('reg_pass_placeholder')}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                {t('reg_confirm_pass_label')} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder={t('reg_confirm_pass_placeholder')}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '10px' }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner-sm"></div>
                  {t('reg_btn_submitting')}
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  {t('reg_btn_submit')}
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {t('reg_have_account')}{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              {t('reg_signin_link')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;