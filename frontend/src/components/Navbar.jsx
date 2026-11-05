import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LogOut,
  User as UserIcon,
  Shield,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Home,
  AlertTriangle,
  Search,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate('/login');
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container nav-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="hamburger-btn"
              title={t('nav_menu')}
              aria-label={t('nav_menu')}
            >
              <Menu size={22} />
            </button>

            {/* Reference Brand Logo with Streetlight Arc */}
            <Link to="/" className="brand-logo" onClick={closeDrawer} style={{ textDecoration: 'none' }}>
              <Logo size="md" showTagline={true} />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="nav-links">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end
            >
              {t('nav_home')}
            </NavLink>
            <NavLink
              to="/report"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {t('nav_report')}
            </NavLink>
            <NavLink
              to="/track"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {t('nav_track')}
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {t('nav_dashboard')}
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {t('nav_admin')}
              </NavLink>
            )}

            {/* Settings link in top bar */}
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              title={t('nav_settings')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Settings size={15} />
                {t('nav_settings')}
              </span>
            </NavLink>
          </div>

          {/* Auth / Profile Actions */}
          <div className="nav-auth-actions">
            {/* Quick Theme Toggle Button */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '7px 10px', borderRadius: '50%' }}
              title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun size={16} color="#facc15" /> : <Moon size={16} />}
            </button>

            {/* Quick Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', fontWeight: 700 }}
              title="Toggle Language (English / ಕನ್ನಡ)"
            >
              {language === 'en' ? 'ಕನ್ನಡ' : 'ENG'}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/settings" className="user-pill" title={t('sec_profile')}>
                  {isAdmin ? <Shield size={14} color="#2563eb" /> : <UserIcon size={14} />}
                  <span>{user?.name?.split(' ')[0] || 'User'}</span>
                  <span className="user-role-badge">{user?.role}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title={t('nav_logout')}
                >
                  <LogOut size={16} />
                  <span>{t('nav_logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  {t('nav_login')}
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  {t('nav_register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Backdrop for Sidebar Drawer */}
      <div
        className={`drawer-backdrop ${drawerOpen ? 'active' : ''}`}
        onClick={closeDrawer}
      ></div>

      {/* Sidebar Navigation Drawer */}
      <aside className={`sidebar-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <Link to="/" onClick={closeDrawer} style={{ textDecoration: 'none' }}>
            <Logo size="md" />
          </Link>
          <button
            onClick={closeDrawer}
            className="modal-close-btn"
            aria-label="Close sidebar menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card if authenticated */}
        {isAuthenticated && (
          <div style={{
            padding: '16px 20px',
            background: 'var(--surface-subtle)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.email}
              </div>
            </div>
          </div>
        )}

        {/* Drawer Navigation Links */}
        <div className="drawer-body">
          <NavLink
            to="/"
            onClick={closeDrawer}
            className={({ isActive }) => (isActive ? 'drawer-nav-item active' : 'drawer-nav-item')}
            end
          >
            <Home className="nav-icon" />
            <span>{t('nav_home')}</span>
          </NavLink>

          <NavLink
            to="/report"
            onClick={closeDrawer}
            className={({ isActive }) => (isActive ? 'drawer-nav-item active' : 'drawer-nav-item')}
          >
            <AlertTriangle className="nav-icon" />
            <span>{t('nav_report')}</span>
          </NavLink>

          <NavLink
            to="/track"
            onClick={closeDrawer}
            className={({ isActive }) => (isActive ? 'drawer-nav-item active' : 'drawer-nav-item')}
          >
            <Search className="nav-icon" />
            <span>{t('nav_track')}</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              onClick={closeDrawer}
              className={({ isActive }) => (isActive ? 'drawer-nav-item active' : 'drawer-nav-item')}
            >
              <LayoutDashboard className="nav-icon" />
              <span>{t('nav_dashboard')}</span>
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={closeDrawer}
              className={({ isActive }) => (isActive ? 'drawer-nav-item active' : 'drawer-nav-item')}
            >
              <Shield className="nav-icon" />
              <span>{t('nav_admin')}</span>
            </NavLink>
          )}

          <div className="drawer-divider"></div>

          {/* Settings in Sidebar Navigation */}
          <NavLink
            to="/settings"
            onClick={closeDrawer}
            className={({ isActive }) => (isActive ? 'drawer-nav-item active' : 'drawer-nav-item')}
          >
            <Settings className="nav-icon" />
            <span>{t('nav_settings')}</span>
          </NavLink>
        </div>

        {/* Drawer Footer with Quick Preferences & Logout */}
        <div className="drawer-footer">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t('active_theme_label')}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setTheme('light')}
                className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px' }}
              >
                ☀️ {t('theme_light')}
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px' }}
              >
                🌙 {t('theme_dark')}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t('sec_language')}:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setLanguage('en')}
                className={`btn btn-sm ${language === 'en' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px' }}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('kn')}
                className={`btn btn-sm ${language === 'kn' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px' }}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <LogOut size={16} />
              <span>{t('nav_logout')}</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link
                to="/login"
                onClick={closeDrawer}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, textAlign: 'center' }}
              >
                {t('nav_login')}
              </Link>
              <Link
                to="/register"
                onClick={closeDrawer}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, textAlign: 'center' }}
              >
                {t('nav_register')}
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;