import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Palette,
  User,
  Bell,
  Globe,
  Shield,
  Check,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Save,
  RotateCcw,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { authService } from '../services/api';
import Logo from '../components/Logo';

export const SettingsPage = () => {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('appearance');

  // --- Section 2: Profile State ---
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  const handleProfileCancel = () => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
    }
    setProfileSuccess('');
    setProfileError('');
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileName.trim() || !profileEmail.trim()) {
      setProfileError('Please provide both your name and a valid email.');
      return;
    }

    setProfileSaving(true);
    try {
      const res = await authService.updateProfile({
        name: profileName.trim(),
        email: profileEmail.trim()
      });

      if (res.success && res.user) {
        updateUser(res.user);
        setProfileSuccess(res.message || 'Profile information updated successfully!');
        setTimeout(() => setProfileSuccess(''), 4000);
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  // --- Section 3: Notifications State ---
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('glowfix_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      statusUpdates: true,
      emailDigest: true
    };
  });
  const [notifSuccess, setNotifSuccess] = useState('');

  const handleToggleNotification = async (key) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key]
    };
    setNotifications(updated);
    localStorage.setItem('glowfix_notifications', JSON.stringify(updated));

    if (isAuthenticated) {
      try {
        await authService.updateProfile({
          preferences: { notifications: updated }
        });
      } catch (e) {}
    }

    setNotifSuccess(t('notif_saved'));
    setTimeout(() => setNotifSuccess(''), 3000);
  };

  // --- Section 5: Password Change State ---
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError('Please fill in both current and new passwords.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match. Please verify your typing.');
      return;
    }

    setPasswordUpdating(true);
    try {
      const res = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (res.success) {
        setPasswordSuccess(res.message || 'Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setPasswordSuccess(''), 5000);
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="settings-container">
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Logo size={34} showText={false} />
            <h1 style={{ fontSize: '2.2rem', margin: 0, color: 'var(--text-primary)' }}>
              {t('settings_title')}
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            {t('settings_subtitle')}
          </p>
        </div>

        <div className="settings-layout">
          {/* Settings Sidebar Nav */}
          <aside className="settings-nav-sidebar">
            <button
              onClick={() => scrollToSection('appearance')}
              className={`settings-nav-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            >
              <Palette size={18} />
              <span>{t('sec_appearance')}</span>
            </button>

            <button
              onClick={() => scrollToSection('profile')}
              className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <User size={18} />
              <span>{t('sec_profile')}</span>
            </button>

            <button
              onClick={() => scrollToSection('notifications')}
              className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            >
              <Bell size={18} />
              <span>{t('sec_notifications')}</span>
            </button>

            <button
              onClick={() => scrollToSection('language')}
              className={`settings-nav-btn ${activeTab === 'language' ? 'active' : ''}`}
            >
              <Globe size={18} />
              <span>{t('sec_language')}</span>
            </button>

            <button
              onClick={() => scrollToSection('security')}
              className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
            >
              <Shield size={18} />
              <span>{t('sec_security')}</span>
            </button>
          </aside>

          {/* Main Content Area: 5 Cards */}
          <main style={{ minWidth: 0 }}>
            {/* 1. APPEARANCE SETTINGS */}
            <section id="appearance" className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-icon">
                  <Palette size={22} />
                </div>
                <div className="settings-card-title">
                  <h3>{t('sec_appearance')}</h3>
                  <p>{t('sec_appearance_desc')}</p>
                </div>
              </div>

              <div className="theme-picker-grid">
                {/* Light Mode */}
                <div
                  className={`theme-tile ${theme === 'light' ? 'selected' : ''}`}
                  onClick={() => setTheme('light')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="theme-tile-icon">☀️</div>
                  <div className="theme-tile-name">{t('theme_light')}</div>
                  <div className="theme-tile-desc">{t('theme_light_desc')}</div>
                  {theme === 'light' && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'var(--primary-600)',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Dark Mode */}
                <div
                  className={`theme-tile ${theme === 'dark' ? 'selected' : ''}`}
                  onClick={() => setTheme('dark')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="theme-tile-icon">🌙</div>
                  <div className="theme-tile-name">{t('theme_dark')}</div>
                  <div className="theme-tile-desc">{t('theme_dark_desc')}</div>
                  {theme === 'dark' && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'var(--primary-600)',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* System Default */}
                <div
                  className={`theme-tile ${theme === 'system' ? 'selected' : ''}`}
                  onClick={() => setTheme('system')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="theme-tile-icon">💻</div>
                  <div className="theme-tile-name">{t('theme_system')}</div>
                  <div className="theme-tile-desc">{t('theme_system_desc')}</div>
                  {theme === 'system' && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'var(--primary-600)',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '18px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#10b981" />
                {t('active_theme_label')} <strong>{resolvedTheme === 'dark' ? t('theme_dark') : t('theme_light')}</strong>
                {theme === 'system' && ` ${t('synced_os')}`}
              </div>
            </section>

            {/* 2. MY PROFILE SETTINGS */}
            <section id="profile" className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
                  <User size={22} />
                </div>
                <div className="settings-card-title">
                  <h3>{t('sec_profile')}</h3>
                  <p>{t('sec_profile_desc')}</p>
                </div>
              </div>

              {profileSuccess && (
                <div className="alert alert-success">
                  <CheckCircle2 size={18} />
                  <div>{profileSuccess}</div>
                </div>
              )}

              {profileError && (
                <div className="alert alert-error">
                  <AlertCircle size={18} />
                  <div>{profileError}</div>
                </div>
              )}

              {isAuthenticated ? (
                <form onSubmit={handleProfileSave}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">{t('profile_fullname')}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">{t('profile_email')}</label>
                      <input
                        type="email"
                        className="form-input"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('profile_role')}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${user?.role === 'admin' ? 'badge-in-progress' : 'badge-neutral'}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                        {user?.role === 'admin' ? t('role_admin_label') : t('role_citizen_label')}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {t('member_since')} {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleProfileCancel}
                      disabled={profileSaving}
                    >
                      <RotateCcw size={16} />
                      <span>{t('btn_cancel')}</span>
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={profileSaving}
                    >
                      {profileSaving ? (
                        <>
                          <div className="spinner-sm"></div>
                          <span>{t('btn_saving')}</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>{t('btn_save_changes')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{
                  padding: '24px',
                  background: 'var(--surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  border: '1px dashed var(--border-color)'
                }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    {t('guest_profile_msg')}
                  </p>
                  <Link to="/login" className="btn btn-primary">
                    {t('btn_guest_signin')}
                  </Link>
                </div>
              )}
            </section>

            {/* 3. NOTIFICATIONS SETTINGS */}
            <section id="notifications" className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-icon" style={{ background: 'var(--accent-amber-light)', color: 'var(--accent-amber)' }}>
                  <Bell size={22} />
                </div>
                <div className="settings-card-title">
                  <h3>{t('sec_notifications')}</h3>
                  <p>{t('sec_notifications_desc')}</p>
                </div>
              </div>

              {notifSuccess && (
                <div className="alert alert-success">
                  <CheckCircle2 size={18} />
                  <div>{notifSuccess}</div>
                </div>
              )}

              {/* Status Update Progression Toggle */}
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>{t('notif_status')}</h4>
                  <p>{t('notif_status_desc')}</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifications.statusUpdates}
                    onChange={() => handleToggleNotification('statusUpdates')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Email Alerts Toggle */}
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>{t('notif_email')}</h4>
                  <p>{t('notif_email_desc')}</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifications.emailDigest}
                    onChange={() => handleToggleNotification('emailDigest')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </section>

            {/* 4. LANGUAGE SETTINGS */}
            <section id="language" className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-icon" style={{ background: 'var(--accent-green-light)', color: 'var(--accent-green)' }}>
                  <Globe size={22} />
                </div>
                <div className="settings-card-title">
                  <h3>{t('sec_language')}</h3>
                  <p>{t('sec_language_desc')}</p>
                </div>
              </div>

              <div className="language-picker-grid">
                {/* English */}
                <div
                  className={`language-tile ${language === 'en' ? 'selected' : ''}`}
                  onClick={() => setLanguage('en')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="language-badge-code">EN</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {t('lang_en')}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {t('lang_en_desc')}
                    </div>
                  </div>
                  {language === 'en' && (
                    <div style={{ marginLeft: 'auto', color: 'var(--primary-600)' }}>
                      <Check size={20} strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Kannada */}
                <div
                  className={`language-tile ${language === 'kn' ? 'selected' : ''}`}
                  onClick={() => setLanguage('kn')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="language-badge-code" style={{ background: 'var(--accent-amber-light)', color: '#92400e' }}>
                    ಕ
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {t('lang_kn')}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {t('lang_kn_desc')}
                    </div>
                  </div>
                  {language === 'kn' && (
                    <div style={{ marginLeft: 'auto', color: 'var(--primary-600)' }}>
                      <Check size={20} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 5. ACCOUNT & SECURITY SETTINGS */}
            <section id="security" className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-icon" style={{ background: 'var(--primary-100)', color: 'var(--primary-700)' }}>
                  <ShieldCheck size={22} />
                </div>
                <div className="settings-card-title">
                  <h3>{t('sec_security')}</h3>
                  <p>{t('sec_security_desc')}</p>
                </div>
              </div>

              {passwordSuccess && (
                <div className="alert alert-success">
                  <CheckCircle2 size={18} />
                  <div>{passwordSuccess}</div>
                </div>
              )}

              {passwordError && (
                <div className="alert alert-error">
                  <AlertCircle size={18} />
                  <div>{passwordError}</div>
                </div>
              )}

              {isAuthenticated ? (
                <>
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                      <label className="form-label">{t('sec_curr_pass')}</label>
                      <input
                        type="password"
                        name="currentPassword"
                        className="form-input"
                        placeholder="••••••••"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChangeInput}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">{t('sec_new_pass')}</label>
                        <input
                          type="password"
                          name="newPassword"
                          className="form-input"
                          placeholder="At least 6 characters"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChangeInput}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t('sec_confirm_pass')}</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-input"
                          placeholder="Re-enter new password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChangeInput}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '28px' }}>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={passwordUpdating}
                      >
                        {passwordUpdating ? (
                          <>
                            <div className="spinner-sm"></div>
                            <span>{t('btn_updating_pass')}</span>
                          </>
                        ) : (
                          <>
                            <KeyRound size={16} />
                            <span>{t('btn_change_password')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  <div style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {t('session_signout_title')}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {t('session_signout_desc')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="btn btn-secondary"
                      style={{ color: '#ef4444', borderColor: 'var(--border-color)' }}
                    >
                      <LogOut size={16} />
                      <span>{t('btn_logout_all')}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div style={{
                  padding: '24px',
                  background: 'var(--surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  border: '1px dashed var(--border-color)'
                }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    {t('guest_security_msg')}
                  </p>
                  <Link to="/login" className="btn btn-primary">
                    {t('login_btn_submit')}
                  </Link>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;