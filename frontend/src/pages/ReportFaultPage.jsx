import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Upload,
  CheckCircle2,
  MapPin,
  X,
  Copy,
  Navigation,
  Check
} from 'lucide-react';
import { complaintService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const ReportFaultPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const FAULT_OPTIONS = [
    { id: 'Not Working', labelKey: 'fault_not_working', descKey: 'fault_not_working_desc' },
    { id: 'Flickering', labelKey: 'fault_flickering', descKey: 'fault_flickering_desc' },
    { id: 'Dim Light', labelKey: 'fault_dim', descKey: 'fault_dim_desc' },
    { id: 'Damaged Pole', labelKey: 'fault_damaged', descKey: 'fault_damaged_desc' }
  ];

  const [formData, setFormData] = useState({
    area: '',
    landmark: '',
    streetLightId: '',
    faultType: 'Not Working',
    description: '',
    citizenName: user?.name || '',
    citizenEmail: user?.email || ''
  });

  // GPS State
  const [gpsData, setGpsData] = useState(null); // { lat, lng, accuracy }
  const [fetchingGps, setFetchingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // GPS Geolocation Handler
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg(t('report_err_gps_unsupported'));
      return;
    }

    setFetchingGps(true);
    setGpsMessage(t('report_gps_fetching'));
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const lat = latitude.toFixed(6);
        const lng = longitude.toFixed(6);
        const acc = Math.round(accuracy);

        setGpsData({ lat, lng, accuracy: acc });
        setGpsMessage(`${lat}°N, ${lng}°E (±${acc}m)`);
        setFetchingGps(false);

        // Reverse geocoding via public OpenStreetMap Nominatim for Indian cities
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`, {
          headers: { 'Accept': 'application/json' }
        })
          .then((res) => res.json())
          .then((data) => {
            if (data && data.address) {
              const road = data.address.road || data.address.pedestrian || data.address.suburb || '';
              const neighbourhood = data.address.neighbourhood || data.address.residential || data.address.city_district || data.address.city || '';
              const suggestedArea = [road, neighbourhood].filter(Boolean).join(', ');

              if (suggestedArea && !formData.area) {
                setFormData((prev) => ({ ...prev, area: suggestedArea }));
              }
            }
          })
          .catch(() => {});
      },
      (error) => {
        setFetchingGps(false);
        setGpsMessage('');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMsg(t('report_err_gps_denied'));
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMsg(t('report_err_gps_unavail'));
            break;
          case error.TIMEOUT:
            setErrorMsg(t('report_err_gps_timeout'));
            break;
          default:
            setErrorMsg(t('report_err_gps_failed'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 10000
      }
    );
  };

  const handleClearGps = () => {
    setGpsData(null);
    setGpsMessage('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(t('report_err_file_size'));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.area.trim()) {
      setErrorMsg(t('report_err_area'));
      return;
    }
    if (!formData.landmark.trim()) {
      setErrorMsg(t('report_err_landmark'));
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg(t('report_err_desc'));
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();

      let combinedLocation = `${formData.area.trim()}, Landmark: ${formData.landmark.trim()}`;
      if (gpsData) {
        combinedLocation += ` [GPS: ${gpsData.lat}, ${gpsData.lng} ±${gpsData.accuracy}m]`;
      }
      data.append('location', combinedLocation);

      const poleId = formData.streetLightId.trim()
        ? formData.streetLightId.trim().toUpperCase()
        : 'SL-UNMARKED';
      data.append('streetLightId', poleId);

      data.append('faultType', formData.faultType);
      data.append('description', formData.description.trim());
      data.append('citizenName', user?.name || formData.citizenName || 'Concerned Citizen');
      data.append('citizenEmail', user?.email || formData.citizenEmail || '');

      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await complaintService.submitComplaint(data);

      if (res.success) {
        setSubmittedData({
          complaintId: res.complaintId || res.complaint?.complaintId,
          complaint: res.complaint
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit complaint. Please check your internet connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyComplaintId = () => {
    if (submittedData?.complaintId) {
      navigator.clipboard.writeText(submittedData.complaintId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="form-page">
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="form-container-card" style={{ maxWidth: '680px' }}>
          {/* Header */}
          <div className="form-header">
            <div style={{
              display: 'inline-flex',
              padding: '10px',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              borderRadius: '12px',
              marginBottom: '12px'
            }}>
              <AlertTriangle size={28} />
            </div>
            <h2>{t('report_title')}</h2>
            <p>
              {t('report_subtitle')}
            </p>
          </div>

          {/* Success Screen */}
          {submittedData ? (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'var(--accent-green-light)',
                color: 'var(--accent-green)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {t('report_success_title')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '24px', lineHeight: '1.5' }}>
                {t('report_success_desc')}
              </p>

              {/* Unique ID Box */}
              <div style={{
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
                  {t('report_ref_title')}
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginTop: '8px'
                }}>
                  <span style={{
                    fontSize: '1.85rem',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    fontFamily: 'monospace',
                    color: 'var(--primary-600)'
                  }}>
                    {submittedData.complaintId}
                  </span>
                  <button
                    onClick={copyComplaintId}
                    className="btn btn-secondary btn-sm"
                    title="Copy Tracking ID"
                  >
                    <Copy size={14} />
                    <span>{copied ? t('report_copied') : t('report_btn_copy')}</span>
                  </button>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  {t('report_ref_note')}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  to={`/track?id=${submittedData.complaintId}`}
                  className="btn btn-primary"
                >
                  {t('report_btn_track_live')}
                </Link>
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-secondary">
                    {t('report_btn_view_dashboard')}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setSubmittedData(null);
                      setFormData({
                        area: '',
                        landmark: '',
                        streetLightId: '',
                        faultType: 'Not Working',
                        description: '',
                        citizenName: '',
                        citizenEmail: ''
                      });
                      setGpsData(null);
                      setGpsMessage('');
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="btn btn-secondary"
                  >
                    {t('report_btn_another')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Complaint Form */
            <form onSubmit={handleSubmit}>
              {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

              {/* SECTION 1: LOCATION DETAILS */}
              <div style={{
                background: 'var(--surface-subtle)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} color="#2563eb" />
                    <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)' }}>
                      {t('report_loc_section')}
                    </h4>
                  </div>

                  {/* GPS Button */}
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={fetchingGps}
                    className="btn btn-secondary btn-sm"
                    style={{ borderColor: 'var(--primary-600)', color: 'var(--primary-600)' }}
                  >
                    {fetchingGps ? (
                      <>
                        <div className="spinner-sm" style={{ borderTopColor: 'var(--primary-600)', borderColor: 'rgba(37, 99, 235, 0.2)' }}></div>
                        {t('report_gps_fetching')}
                      </>
                    ) : (
                      <>
                        <Navigation size={14} />
                        {t('report_btn_gps')}
                      </>
                    )}
                  </button>
                </div>

                {/* GPS Captured Badge */}
                {gpsData && (
                  <div style={{
                    background: 'var(--accent-green-light)',
                    border: '1px solid #a7f3d0',
                    color: '#065f46',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Check size={16} />
                      <span>
                        <strong>{t('report_gps_attached')}</strong> {gpsData.lat}° N, {gpsData.lng}° E (±{gpsData.accuracy}m)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearGps}
                      style={{ background: 'none', border: 'none', color: '#065f46', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}
                    >
                      {t('report_gps_remove')}
                    </button>
                  </div>
                )}

                {/* Area / Street Name */}
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" htmlFor="area">
                    {t('report_area_label')} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="area"
                    name="area"
                    type="text"
                    className="form-input"
                    placeholder={t('report_area_placeholder')}
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="form-helper">
                    {t('report_area_helper')}
                  </div>
                </div>

                {/* Nearby Landmark */}
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" htmlFor="landmark">
                    {t('report_landmark_label')} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="landmark"
                    name="landmark"
                    type="text"
                    className="form-input"
                    placeholder={t('report_landmark_placeholder')}
                    value={formData.landmark}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="form-helper">
                    {t('report_landmark_helper')}
                  </div>
                </div>

                {/* Street Light ID (OPTIONAL) */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="form-label" htmlFor="streetLightId" style={{ margin: 0 }}>
                      {t('report_pole_label')}
                    </label>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      {t('report_pole_optional')}
                    </span>
                  </div>
                  <input
                    id="streetLightId"
                    name="streetLightId"
                    type="text"
                    className="form-input"
                    placeholder={t('report_pole_placeholder')}
                    value={formData.streetLightId}
                    onChange={handleInputChange}
                  />
                  <div className="form-helper">
                    {t('report_pole_helper')}
                  </div>
                </div>
              </div>

              {/* SECTION 2: FAULT TYPE */}
              <div className="form-group">
                <label className="form-label">
                  {t('report_issue_label')} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="fault-type-grid">
                  {FAULT_OPTIONS.map((f) => (
                    <div
                      key={f.id}
                      className={`fault-radio-label ${formData.faultType === f.id ? 'selected' : ''}`}
                      onClick={() => setFormData((prev) => ({ ...prev, faultType: f.id }))}
                    >
                      <input
                        type="radio"
                        name="faultType"
                        value={f.id}
                        checked={formData.faultType === f.id}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{t(f.labelKey)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '2px' }}>
                          {t(f.descKey)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="description">
                  {t('report_desc_label')} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  placeholder={t('report_desc_placeholder')}
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                ></textarea>
              </div>

              {/* Photo Upload with Preview */}
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    {t('report_photo_label')}
                  </label>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                    {t('report_photo_recommended')}
                  </span>
                </div>

                {imagePreview ? (
                  <div className="image-preview-wrapper">
                    <img src={imagePreview} alt="Fault Preview" />
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={handleRemoveImage}
                    >
                      <X size={14} /> {t('report_photo_remove')}
                    </button>
                  </div>
                ) : (
                  <label className="upload-dropzone" htmlFor="photo-file-input">
                    <input
                      id="photo-file-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    <div className="dropzone-content">
                      <Upload className="dropzone-icon" />
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
                          {t('report_photo_tap')}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {t('report_photo_hint')}
                      </span>
                    </div>
                  </label>
                )}
                <div className="form-helper">
                  {t('report_photo_helper')}
                </div>
              </div>

              {/* Citizen Details if not logged in */}
              {!isAuthenticated && (
                <div style={{
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {t('report_guest_title')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <input
                        type="text"
                        name="citizenName"
                        className="form-input"
                        placeholder={t('report_guest_name')}
                        value={formData.citizenName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="citizenEmail"
                        className="form-input"
                        placeholder={t('report_guest_email')}
                        value={formData.citizenEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-helper" style={{ marginTop: '6px' }}>
                    {t('report_guest_helper')}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', fontSize: '1.05rem', padding: '14px' }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="spinner-sm"></div>
                    {t('report_btn_submitting')}
                  </>
                ) : (
                  t('report_btn_submit')
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportFaultPage;