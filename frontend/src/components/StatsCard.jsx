import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, variant = 'blue' }) => {
  return (
    <div className="stat-metric-card">
      <div className="stat-metric-info">
        <div className="value">{value !== undefined ? value : 0}</div>
        <div className="title">{title}</div>
      </div>
      <div className={`stat-metric-icon stat-${variant}`}>
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
};

export default StatsCard;
