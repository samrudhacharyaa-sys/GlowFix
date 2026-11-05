import React, { useState, useEffect } from 'react';
import {
  Shield,
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  MapPin,
  UserCheck
} from 'lucide-react';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import ComplaintDetailModal from '../components/ComplaintDetailModal';
import Logo from '../components/Logo';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints' | 'users'

  // Complaints state
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    totalUsers: 0
  });

  // Users state
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [faultFilter, setFaultFilter] = useState('All');

  // Modal for viewing and updating status
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const statsRes = await adminService.getStats();
      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }

      const complaintsRes = await adminService.getComplaints({
        search: searchTerm,
        status: statusFilter,
        faultType: faultFilter
      });
      if (complaintsRes.success) {
        setComplaints(complaintsRes.complaints || []);
      }

      const usersRes = await adminService.getUsers();
      if (usersRes.success) {
        setUsersList(usersRes.users || []);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load administrator data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [statusFilter, faultFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdminData();
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString(language === 'kn' ? 'kn-IN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleComplaintUpdated = (updated) => {
    setComplaints((prev) =>
      prev.map((c) => (c._id === updated._id ? { ...c, ...updated } : c))
    );
    setSelectedComplaint(updated);
    adminService.getStats().then((res) => {
      if (res.success) setStats(res.stats);
    });
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <Logo size={30} showText={false} />
              <h1>{t('admin_title')}</h1>
            </div>
            <p>
              {t('admin_subtitle')}
            </p>
          </div>

          {/* Tab Selector */}
          <div style={{
            display: 'flex',
            gap: '8px',
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border-color)',
            padding: '4px',
            borderRadius: 'var(--radius-md)'
          }}>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`btn btn-sm ${activeTab === 'complaints' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              <FileText size={16} />
              <span>{t('admin_tab_complaints')} ({complaints.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              <Users size={16} />
              <span>{t('admin_tab_users')} ({usersList.length})</span>
            </button>
          </div>
        </div>

        {/* Stats Metric Cards */}
        <div className="stats-grid">
          <StatsCard
            title={t('admin_stat_total')}
            value={stats.totalComplaints}
            icon={FileText}
            variant="blue"
          />
          <StatsCard
            title={t('admin_stat_pending')}
            value={stats.pendingComplaints}
            icon={Clock}
            variant="amber"
          />
          <StatsCard
            title={t('admin_stat_in_progress')}
            value={stats.inProgressComplaints}
            icon={RefreshCw}
            variant="blue"
          />
          <StatsCard
            title={t('admin_stat_resolved')}
            value={stats.resolvedComplaints}
            icon={CheckCircle2}
            variant="green"
          />
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="alert alert-error">
            <AlertTriangle size={18} />
            <div>{errorMsg}</div>
          </div>
        )}

        {/* TAB 1: Complaints Management */}
        {activeTab === 'complaints' && (
          <div>
            {/* Toolbar */}
            <div className="toolbar-card">
              <form onSubmit={handleSearchSubmit} className="toolbar-search">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  className="form-input"
                  placeholder={t('admin_search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>

              <div className="toolbar-filters">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {t('admin_filter_status')}
                  </span>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="All">{t('dash_all_statuses')}</option>
                    <option value="Pending">{t('status_pending')}</option>
                    <option value="In Progress">{t('status_in_progress')}</option>
                    <option value="Resolved">{t('status_resolved')}</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {t('admin_filter_fault')}
                  </span>
                  <select
                    className="form-select"
                    value={faultFilter}
                    onChange={(e) => setFaultFilter(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="All">{t('admin_all_types')}</option>
                    <option value="Not Working">{t('fault_not_working')}</option>
                    <option value="Flickering">{t('fault_flickering')}</option>
                    <option value="Dim Light">{t('fault_dim')}</option>
                    <option value="Damaged Pole">{t('fault_damaged')}</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={fetchAdminData}
                  className="btn btn-secondary btn-sm"
                  title={t('dash_btn_refresh')}
                >
                  <RefreshCw size={14} />
                  <span>{t('dash_btn_refresh')}</span>
                </button>
              </div>
            </div>

            {/* Complaints Table */}
            {loading ? (
              <div className="loading-screen">
                <div className="spinner"></div>
                <p>{t('dash_loading')}</p>
              </div>
            ) : complaints.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FileText size={32} />
                </div>
                <h3>{t('dash_empty_title')}</h3>
                <p>{t('dash_empty_desc_filter')}</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>{t('admin_th_id')}</th>
                      <th>{t('admin_th_pole')}</th>
                      <th>{t('admin_th_category')}</th>
                      <th>{t('admin_th_location')}</th>
                      <th>{t('admin_th_reporter')}</th>
                      <th>{t('admin_th_date')}</th>
                      <th>{t('admin_th_status')}</th>
                      <th>{t('admin_th_action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((c) => (
                      <tr key={c._id}>
                        <td>
                          <span className="complaint-id-cell">{c.complaintId}</span>
                        </td>
                        <td>
                          <span className="pole-id-cell">
                            {c.streetLightId === 'SL-UNMARKED' ? t('dash_unmarked') : c.streetLightId}
                          </span>
                        </td>
                        <td>{c.faultType}</td>
                        <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <MapPin size={13} style={{ display: 'inline', marginRight: '4px', color: 'var(--text-muted)' }} />
                          {c.location}
                        </td>
                        <td>{c.citizenName || 'Citizen'}</td>
                        <td>{formatDate(c.createdAt)}</td>
                        <td>
                          <StatusBadge status={c.status} />
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedComplaint(c)}
                            className="btn btn-primary btn-sm"
                          >
                            <Eye size={14} />
                            <span>{t('admin_btn_manage')}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Registered Users Management */}
        {activeTab === 'users' && (
          <div>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{t('admin_users_title')}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t('admin_users_total')} <strong>{usersList.length}</strong>
              </span>
            </div>

            {loading ? (
              <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading user directory...</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>{t('admin_users_th_name')}</th>
                      <th>{t('admin_users_th_email')}</th>
                      <th>{t('admin_users_th_role')}</th>
                      <th>{t('admin_users_th_count')}</th>
                      <th>{t('admin_users_th_date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UserCheck size={16} color="#2563eb" />
                            {u.name}
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge ${u.role === 'admin' ? 'badge-in-progress' : 'badge-neutral'}`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <strong>{u.complaintsCount || 0}</strong> {t('admin_reports_count')}
                        </td>
                        <td>{formatDate(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal for Managing Complaint / Updating Status */}
        {selectedComplaint && (
          <ComplaintDetailModal
            complaint={selectedComplaint}
            isAdmin={true}
            onClose={() => setSelectedComplaint(null)}
            onStatusUpdated={handleComplaintUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;