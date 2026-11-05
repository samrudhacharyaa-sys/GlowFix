import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Logo = ({
  size = 'md',
  showTagline = false,
  showText = true,
  variant = 'auto', // 'auto' | 'light' | 'dark'
  className = ''
}) => {
  const { t } = useLanguage();

  // Size mapping
  const sizeMap = {
    sm: { height: 28, fontSize: 20 },
    md: { height: 36, fontSize: 26 },
    lg: { height: 44, fontSize: 32 },
    xl: { height: 54, fontSize: 40 }
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const height = typeof size === 'number' ? size : currentSize.height;

  // Determine glow text color
  let glowColor = 'currentColor';
  if (variant === 'dark') {
    glowColor = '#FFFFFF';
  } else if (variant === 'light') {
    glowColor = '#0F172A';
  }

  // If icon only (e.g. for badges or square tiles)
  if (!showText) {
    return (
      <svg
        viewBox="0 0 54 54"
        fill="none"
        style={{ height: `${height}px`, width: `${height}px`, display: 'inline-block', verticalAlign: 'middle' }}
        className={`glowfix-logo-icon ${className}`}
        aria-label="GlowFix Logo"
      >
        <defs>
          <linearGradient id="gf-icon-arc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDE047" />
            <stop offset="100%" stop-color="#EAB308" />
          </linearGradient>
          <linearGradient id="gf-icon-beam" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stop-color="#FACC15" stop-opacity="0.5" />
            <stop offset="100%" stop-color="#FACC15" stop-opacity="0.0" />
          </linearGradient>
          <filter id="gf-icon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect width="54" height="54" rx="14" fill="#0F172A" />
        <path d="M 33 13 L 23 29 L 43 29 Z" fill="url(#gf-icon-beam)" opacity="0.45" />
        <path d="M 8 36 C 7 19, 11 10, 22 6 C 27 4, 32 5, 35 9" stroke="url(#gf-icon-arc)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <path d="M 32 8 L 39 11 C 40 11.5, 40 12.5, 39 13 L 33 13 C 32 13, 31 12.5, 31 11.5 Z" fill="#FACC15" filter="url(#gf-icon-glow)" />
        <circle cx="35" cy="13" r="1.8" fill="#FFFBEB" />
        <text x="14" y="41" fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif" fontWeight="800" fontSize="34" letterSpacing="-1" fill="#FFFFFF">G</text>
      </svg>
    );
  }

  // Full Wordmark with Streetlight Arc above the G
  return (
    <div
      className={`glowfix-logo-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        verticalAlign: 'middle',
        lineHeight: 1
      }}
    >
      <svg
        viewBox="0 0 162 42"
        fill="none"
        style={{
          height: `${height}px`,
          width: 'auto',
          maxWidth: '100%',
          overflow: 'visible'
        }}
        aria-label="GlowFix Logo"
      >
        <defs>
          <linearGradient id="gf-logo-arc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="gf-logo-beam" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FACC15" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FACC15" stopOpacity="0.0" />
          </linearGradient>
          <filter id="gf-logo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Yellow Streetlight-shaped Arc above the letter G */}
        <g className="gf-arc-group">
          {/* Subtle downward light beam */}
          <path d="M 28 8 L 18 22 L 38 22 Z" fill="url(#gf-logo-beam)" opacity="0.4" />

          {/* Curved Streetlight Gooseneck / Pole Arm curving above the G */}
          <path
            d="M 6 28 C 5 15, 9 7, 19 4 C 23 2.5, 27 3.5, 30 7"
            stroke="url(#gf-logo-arc)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Streetlight Luminaire / Lamp Head pointing down onto G */}
          <path
            d="M 27 6 L 33 8.5 C 34 9, 34 10, 33 10.5 L 28 10.5 C 27 10.5, 26 10, 26 9 Z"
            fill="#FACC15"
            filter="url(#gf-logo-glow)"
          />

          {/* Glowing bulb tip */}
          <circle cx="30" cy="10.5" r="1.5" fill="#FFFBEB" />
        </g>

        {/* 2. Text: "Glow" (White in dark mode / adaptive) + "Fix" (Bright Yellow) */}
        <g
          fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          fontWeight="800"
          fontSize="28"
          letterSpacing="-0.6"
        >
          {/* "Glow" */}
          <text
            x="10"
            y="32"
            fill={glowColor}
            className="gf-brand-glow"
          >
            Glow
          </text>

          {/* "Fix" in bright yellow */}
          <text
            x="81"
            y="32"
            fill="#FACC15"
            className="gf-brand-fix"
          >
            Fix
          </text>
        </g>
      </svg>

      {/* Subtitle / Tagline if requested */}
      {showTagline && (
        <span
          style={{
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginTop: '2px',
            paddingLeft: '2px'
          }}
        >
          {t('brand_tagline')}
        </span>
      )}
    </div>
  );
};

export default Logo;