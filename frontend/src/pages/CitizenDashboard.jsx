import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  PlusCircle,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { complaintService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import ComplaintDetailModal from '../components/ComplaintDetailModal';
import Logo from '../components/Logo';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal view
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchMyComplaints = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await complaintService.getMyComplaints();
      if (res.success) {
        setComplaints(res.complaints || []);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load your complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString(language === 'kn' ? 'kn-IN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      c.complaintId.toLowerCase().includes(searchLower) ||
      c.streetLightId.toLowerCase().includes(searchLower) ||
      c.location.toLowerCase().includes(searchLower) ||
      c.faultType.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <Logo size={30} showText={false} />
              <h1>{t('dash_title')}</h1>
            </div>
            <p>{t('dash_welcome')} <strong>{user?.name || 'Citizen'}</strong>. {t('dash_welcome_sub')}</p>
          </div>
          <Link to="/report" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>{t('dash_btn_new')}</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="stats-grid">
          <StatsCard
            title={t('dash_stat_total')}
            value={stats.total}
            icon={FileText}
            variant="blue"
          />
          <StatsCard
            title={t('dash_stat_pending')}
            value={stats.pending}
            icon={Clock}
            variant="amber"
          />
          <StatsCard
            title={t('dash_stat_in_progress')}
            value={stats.inProgress}
            icon={RefreshCw}
            variant="blue"
          />
          <StatsCard
            title={t('dash_stat_resolved')}
            value={stats.resolved}
            icon={CheckCircle2}
            variant="green"
          />
        </div>

        {/* Toolbar: Search and Filter */}
        <div className="toolbar-card">
          <div className="toolbar-search">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="form-input"
              placeholder={t('dash_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="toolbar-filters">
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={14} /> {t('dash_filter_label')}
            </span>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto', minWidth: '140px' }}
            >
              <option value="All">{t('dash_all_statuses')}</option>
              <option value="Pending">{t('status_pending')}</option>
              <option value="In Progress">{t('status_in_progress')}</option>
              <option value="Resolved">{t('status_resolved')}</option>
            </select>
            <button
              onClick={fetchMyComplaints}
              className="btn btn-secondary btn-sm"
              title={t('dash_btn_refresh')}
            >
              <RefreshCw size={14} />
              <span>{t('dash_btn_refresh')}</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="alert alert-error">
            <AlertTriangle size={18} />
            <div>{errorMsg}</div>
          </div>
        )}

        {/* Content Table or Empty State */}
        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>{t('dash_loading')}</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FileText size={32} />
            </div>
            <h3>{t('dash_empty_title')}</h3>
            <p>
              {complaints.length === 0
                ? t('dash_empty_desc_none')
                : t('dash_empty_desc_filter')}
            </p>
            {complaints.length === 0 && (
              <Link to="/report" className="btn btn-primary">
                <PlusCircle size={18} />
                <span>{t('dash_btn_first_report')}</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{t('dash_th_id')}</th>
                  <th>{t('dash_th_pole')}</th>
                  <th>{t('dash_th_type')}</th>
                  <th>{t('dash_th_loc')}</th>
                  <th>{t('dash_th_date')}</th>
                  <th>{t('dash_th_status')}</th>
                  <th>{t('dash_th_action')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((c) => (
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
                    <td style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <MapPin size={13} style={{ display: 'inline', marginRight: '4px', color: 'var(--text-muted)' }} />
                      {c.location}
                    </td>
                    <td>{formatDate(c.createdAt)}</td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedComplaint(c)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye size={14} />
                        <span>{t('dash_btn_view')}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Complaint Detail Modal */}
        {selectedComplaint && (
          <ComplaintDetailModal
            complaint={selectedComplaint}
            isAdmin={false}
            onClose={() => setSelectedComplaint(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;