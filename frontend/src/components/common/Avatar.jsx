import React from 'react';

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorFromName = (name = '') => {
  const colors = [
    { bg: 'linear-gradient(135deg, #c02828 0%, #8b1a1a 100%)', text: '#ffffff', border: '#c02828' },
    { bg: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)', text: '#ffffff', border: '#b91c1c' },
    { bg: 'linear-gradient(135deg, #991b1b 0%, #450a0a 100%)', text: '#ffffff', border: '#991b1b' },
    { bg: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', text: '#ffffff', border: '#dc2626' },
    { bg: 'linear-gradient(135deg, #c2410c 0%, #9a3412 100%)', text: '#ffffff', border: '#c2410c' },
    { bg: 'linear-gradient(135deg, #be123c 0%, #881337 100%)', text: '#ffffff', border: '#be123c' }
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export const Avatar = ({ name, size = 36, fontSize, style = {}, className = '' }) => {
  const initials = getInitials(name);
  const color = getColorFromName(name || '');
  const calculatedFontSize = fontSize || `${Math.max(Math.round(size * 0.38), 11)}px`;

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        background: color.bg,
        color: color.text,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: calculatedFontSize,
        letterSpacing: '0.04em',
        userSelect: 'none',
        flexShrink: 0,
        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
        ...style
      }}
      title={name}
      aria-label={name}
    >
      {initials}
    </div>
  );
};
