import React from 'react';

export const StatCard = ({ title, value, subtitle, icon, trend, trendLabel, color = 'primary' }) => {
  const getIconBg = () => {
    switch (color) {
      case 'success':
        return { bg: 'var(--success-light)', text: 'var(--success-text)' };
      case 'warning':
        return { bg: 'var(--warning-light)', text: 'var(--warning-text)' };
      case 'danger':
        return { bg: 'var(--danger-light)', text: 'var(--danger-text)' };
      case 'secondary':
        return { bg: 'var(--secondary-light)', text: 'var(--secondary)' };
      default:
        return { bg: 'var(--primary-light)', text: 'var(--primary)' };
    }
  };

  const colors = getIconBg();

  return (
    <div className="stat-card">
      <div style={{ flex: 1 }}>
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
          {trend && (
            <span
              className={`stat-trend ${
                trend === 'up' ? 'positive' : trend === 'down' ? 'negative' : 'warning'
              }`}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendLabel}
            </span>
          )}
          {subtitle && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div
        className="stat-icon"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {icon}
      </div>
    </div>
  );
};

export const Badge = ({ children, variant = 'neutral', size = 'md' }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'badge-primary';
      case 'success': return 'badge-success';
      case 'warning': return 'badge-warning';
      case 'danger': return 'badge-danger';
      default: return 'badge-neutral';
    }
  };

  return (
    <span
      className={`badge ${getVariantClass()}`}
      style={{
        fontSize: size === 'sm' ? '0.7rem' : size === 'lg' ? '0.85rem' : '0.75rem',
        padding: size === 'sm' ? '0.15rem 0.5rem' : size === 'lg' ? '0.35rem 0.85rem' : '0.25rem 0.65rem'
      }}
    >
      {children}
    </span>
  );
};

export const ProgressBar = ({ progress = 0, label, showPercent = true, variant = 'primary' }) => {
  const clamped = Math.min(100, Math.max(0, progress));
  
  let variantClass = '';
  if (variant === 'danger' || clamped < 50) variantClass = 'danger';
  else if (variant === 'success' || clamped >= 80) variantClass = 'success';

  return (
    <div style={{ width: '100%' }}>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
          {label && <span>{label}</span>}
          {showPercent && <span>{clamped}%</span>}
        </div>
      )}
      <div className="progress-container">
        <div
          className={`progress-fill ${variantClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, maxWidth = '600px' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h3>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
