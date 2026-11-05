import React, { useState } from 'react';
import { X, MapPin, Tag, User, AlertTriangle, CheckCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { adminService, getImageUrl } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const ComplaintDetailModal = ({ complaint, onClose, isAdmin = false, onStatusUpdated }) => {
  if (!complaint) return null;

  const { t, language } = useLanguage();
  const [status, setStatus] = useState(complaint.status || 'Pending');
  const [adminNotes, setAdminNotes] = useState(complaint.adminNotes || '');
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString(language === 'kn' ? 'kn-IN' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await adminService.updateComplaintStatus(complaint._id, {
        status,
        adminNotes
      });
      setSuccessMsg(res.message || 'Status updated successfully.');
      if (onStatusUpdated) {
        onStatusUpdated(res.complaint);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  // Determine timeline stage
  const getStageIndex = (st) => {
    if (st === 'Resolved') return 3;
    if (st === 'In Progress') return 2;
    return 1; // Pending
  };
  const currentStage = getStageIndex(status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                {t('modal_title')} #{complaint.complaintId}
              </h3>
              <StatusBadge status={status} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {t('modal_logged_on')} {formatDate(complaint.createdAt)}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label={t('modal_btn_close')}>
            <X size={20} />
          </button>
        </div>

        {/* Status Stepper */}
        <div className="timeline-stepper">
          <div className="timeline-line"></div>

          <div className={`timeline-step ${currentStage >= 1 ? 'completed' : ''} ${currentStage === 1 ? 'active' : ''}`}>
            <div className="timeline-circle">
              {currentStage > 1 ? <CheckCircle size={18} /> : '1'}
            </div>
            <span className="timeline-label">{t('modal_step_pending')}</span>
          </div>

          <div className={`timeline-step ${currentStage >= 2 ? 'completed' : ''} ${currentStage === 2 ? 'active' : ''}`}>
            <div className="timeline-circle">
              {currentStage > 2 ? <CheckCircle size={18} /> : '2'}
            </div>
            <span className="timeline-label">{t('modal_step_in_progress')}</span>
          </div>

          <div className={`timeline-step ${currentStage >= 3 ? 'completed active' : ''}`}>
            <div className="timeline-circle">
              <CheckCircle size={18} />
            </div>
            <span className="timeline-label">{t('modal_step_resolved')}</span>
          </div>
        </div>

        {/* Photo Preview if uploaded */}
        {complaint.image ? (
          <div style={{ marginBottom: '20px' }}>
            <div className="form-label">{t('modal_photo_label')}</div>
            <div className="image-preview-wrapper" style={{ maxHeight: '260px' }}>
              <img
                src={getImageUrl(complaint.image)}
                alt={`Evidence for light ${complaint.streetLightId}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
          </div>
        ) : null}

        {/* Complaint Details Grid */}
        <div style={{ marginBottom: '24px' }}>
          <div className="detail-row">
            <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={16} color="#2563eb" /> {t('modal_pole_label')}
            </span>
            <span className="detail-value pole-id-cell">
              {complaint.streetLightId === 'SL-UNMARKED'
                ? t('track_unmarked')
                : complaint.streetLightId}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} color="#f59e0b" /> {t('modal_fault_label')}
            </span>
            <span className="detail-value">{complaint.faultType}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} color="#ef4444" /> {t('modal_loc_label')}
            </span>
            <span className="detail-value">{complaint.location}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} color="#64748b" /> {t('modal_reporter_label')}
            </span>
            <span className="detail-value">
              {complaint.citizenName || t('track_anonymous')}
              {complaint.citizenEmail ? ` (${complaint.citizenEmail})` : ''}
            </span>
          </div>

          {complaint.resolvedAt && (
            <div className="detail-row">
              <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} color="#10b981" /> {t('modal_resolved_on')}
              </span>
              <span className="detail-value">{formatDate(complaint.resolvedAt)}</span>
            </div>
          )}
        </div>

        {/* Description Box */}
        <div style={{ marginBottom: '24px' }}>
          <div className="form-label">{t('modal_desc_label')}</div>
          <div style={{
            background: 'var(--surface-subtle)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.9rem',
            color: 'var(--text-primary)',
            lineHeight: '1.6'
          }}>
            {complaint.description}
          </div>
        </div>

        {/* Existing Admin Notes */}
        {!isAdmin && complaint.adminNotes && (
          <div style={{ marginBottom: '24px' }}>
            <div className="form-label" style={{ color: 'var(--primary-600)' }}>
              {t('modal_admin_remarks_label')}
            </div>
            <div style={{
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-200)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              color: 'var(--primary-900)'
            }}>
              {complaint.adminNotes}
            </div>
          </div>
        )}

        {/* Admin Action Section */}
        {isAdmin && (
          <div style={{
            borderTop: '2px dashed var(--border-color)',
            paddingTop: '20px',
            marginTop: '10px'
          }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '14px', color: 'var(--primary-600)' }}>
              {t('modal_admin_action_title')}
            </h4>

            {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            <form onSubmit={handleStatusUpdate}>
              <div className="form-group">
                <label className="form-label">{t('modal_update_status_label')}</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">{t('modal_opt_pending')}</option>
                  <option value="In Progress">{t('modal_opt_in_progress')}</option>
                  <option value="Resolved">{t('modal_opt_resolved')}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('modal_notes_label')}</label>
                <textarea
                  className="form-textarea"
                  placeholder={t('modal_notes_placeholder')}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                ></textarea>
                <div className="form-helper">
                  {t('modal_notes_helper')}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  {t('modal_btn_close')}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <div className="spinner-sm"></div>
                      {t('modal_btn_saving')}
                    </>
                  ) : (
                    t('modal_btn_save')
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {!isAdmin && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              {t('modal_btn_close')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetailModal;