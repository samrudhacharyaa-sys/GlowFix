import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { complaintService, getImageUrl } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { useLanguage } from '../context/LanguageContext';

export const TrackComplaintPage = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [queryId, setQueryId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchComplaint = async (idToSearch) => {
    if (!idToSearch || !idToSearch.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setComplaint(null);

    try {
      const res = await complaintService.trackComplaint(idToSearch.trim());
      if (res.success && res.complaint) {
        setComplaint(res.complaint);
      } else {
        setErrorMsg(t('track_not_found'));
      }
    } catch (err) {
      setErrorMsg(err.message || t('track_not_found'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchComplaint(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaint(queryId);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString(language === 'kn' ? 'kn-IN' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  // Determine stage for stepper
  const getStageIndex = (st) => {
    if (st === 'Resolved') return 3;
    if (st === 'In Progress') return 2;
    return 1;
  };

  const currentStage = complaint ? getStageIndex(complaint.status) : 1;

  return (
    <div className="form-page" style={{ alignItems: 'flex-start', paddingTop: '48px' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', padding: '10px', background: 'var(--primary-50)', color: 'var(--primary-600)', borderRadius: '12px', marginBottom: '12px' }}>
            <Search size={28} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{t('track_title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            {t('track_subtitle')}
          </p>
        </div>

        {/* Search Input Box */}
        <div className="card" style={{ marginBottom: '32px', padding: '20px' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder={t('track_input_placeholder')}
                value={queryId}
                onChange={(e) => setQueryId(e.target.value)}
                style={{ paddingLeft: '14px', textTransform: 'uppercase' }}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !queryId.trim()}
              style={{ minWidth: '130px' }}
            >
              {loading ? (
                <>
                  <div className="spinner-sm"></div>
                  {t('track_searching')}
                </>
              ) : (
                <>
                  <Search size={18} />
                  {t('track_btn_submit')}
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Links */}
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span>{t('track_samples')}</span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setQueryId('GF-102941');
                fetchComplaint('GF-102941');
              }}
            >
              GF-102941 ({t('status_pending')})
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setQueryId('GF-304812');
                fetchComplaint('GF-304812');
              }}
            >
              GF-304812 ({t('status_in_progress')})
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setQueryId('GF-708231');
                fetchComplaint('GF-708231');
              }}
            >
              GF-708231 ({t('status_resolved')})
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

        {/* Complaint Result Card */}
        {complaint && (
          <div className="card" style={{ padding: '32px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {t('track_dossier')}
                </span>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  #{complaint.complaintId}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {t('track_reported_on')} {formatDate(complaint.createdAt)}
                </span>
              </div>
              <div>
                <StatusBadge status={complaint.status} />
              </div>
            </div>

            {/* Status Timeline */}
            <div className="timeline-stepper">
              <div className="timeline-line"></div>

              <div className={`timeline-step ${currentStage >= 1 ? 'completed' : ''} ${currentStage === 1 ? 'active' : ''}`}>
                <div className="timeline-circle">
                  {currentStage > 1 ? <CheckCircle2 size={18} /> : '1'}
                </div>
                <span className="timeline-label">{t('track_step1')}</span>
              </div>

              <div className={`timeline-step ${currentStage >= 2 ? 'completed' : ''} ${currentStage === 2 ? 'active' : ''}`}>
                <div className="timeline-circle">
                  {currentStage > 2 ? <CheckCircle2 size={18} /> : '2'}
                </div>
                <span className="timeline-label">{t('track_step2')}</span>
              </div>

              <div className={`timeline-step ${currentStage >= 3 ? 'completed active' : ''}`}>
                <div className="timeline-circle">
                  <CheckCircle2 size={18} />
                </div>
                <span className="timeline-label">{t('track_step3')}</span>
              </div>
            </div>

            {/* Photo if present */}
            {complaint.image && (
              <div style={{ marginBottom: '24px' }}>
                <div className="form-label">{t('track_photo_evidence')}</div>
                <div className="image-preview-wrapper" style={{ maxHeight: '280px' }}>
                  <img
                    src={getImageUrl(complaint.image)}
                    alt={`Photo for light ${complaint.streetLightId}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Details Table */}
            <div style={{ marginBottom: '24px' }}>
              <div className="detail-row">
                <span className="detail-label">{t('track_label_pole')}</span>
                <span className="detail-value pole-id-cell">
                  {complaint.streetLightId === 'SL-UNMARKED' ? t('track_unmarked') : complaint.streetLightId}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('track_label_category')}</span>
                <span className="detail-value">{complaint.faultType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('track_label_location')}</span>
                <span className="detail-value">{complaint.location}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('track_label_reporter')}</span>
                <span className="detail-value">{complaint.citizenName || t('track_anonymous')}</span>
              </div>
              {complaint.resolvedAt && (
                <div className="detail-row">
                  <span className="detail-label">{t('track_label_resolved_at')}</span>
                  <span className="detail-value">{formatDate(complaint.resolvedAt)}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <div className="form-label">{t('track_label_issue')}</div>
              <div style={{
                background: 'var(--surface-subtle)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.925rem',
                color: 'var(--text-primary)'
              }}>
                {complaint.description}
              </div>
            </div>

            {/* Municipal Action Remarks */}
            {complaint.adminNotes ? (
              <div style={{
                background: 'var(--primary-50)',
                border: '1px solid var(--primary-200)',
                padding: '18px',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--primary-900)', fontSize: '0.925rem', marginBottom: '6px' }}>
                  {t('track_admin_notes_title')}
                </div>
                <div style={{ color: 'var(--primary-800)', fontSize: '0.9rem' }}>
                  {complaint.adminNotes}
                </div>
              </div>
            ) : (
              <div style={{
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border-color)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '0.875rem'
              }}>
                {t('track_queued_msg')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaintPage;