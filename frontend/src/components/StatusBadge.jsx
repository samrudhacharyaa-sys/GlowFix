import React from 'react';
import { Clock, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const StatusBadge = ({ status }) => {
  const { t } = useLanguage();

  switch (status) {
    case 'Pending':
      return (
        <span className="badge badge-pending">
          <Clock size={12} />
          {t('status_pending')}
        </span>
      );
    case 'In Progress':
      return (
        <span className="badge badge-in-progress">
          <RefreshCw size={12} className="spin-slow" />
          {t('status_in_progress')}
        </span>
      );
    case 'Resolved':
      return (
        <span className="badge badge-resolved">
          <CheckCircle2 size={12} />
          {t('status_resolved')}
        </span>
      );
    default:
      return (
        <span className="badge badge-neutral">
          <AlertCircle size={12} />
          {status || t('status_unknown')}
        </span>
      );
  }
};

export default StatusBadge;