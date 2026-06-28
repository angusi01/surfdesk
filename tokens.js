const typography = {
  fontSans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  display: {
    weight: '800',
    tracking: '-0.03em',
    size: 'clamp(56px, 10vw, 80px)',
    lineHeight: '0.95',
  },
  heading: {
    weight: '600',
    tracking: '-0.02em',
    lineHeight: '1.05',
  },
  body: {
    weight: '400',
    strongWeight: '500',
    lineHeight: '1.6',
  },
  label: {
    size: '12px',
    tracking: '0.08em',
    transform: 'uppercase',
  },
};

const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
  '5xl': '128px',
};

const colors = {
  bg: '#ffffff',
  surface: '#ffffff',
  border: '#e2e8f0',
  accent: '#0ea5e9',
  accent2: '#0ea5e9',
  textPrimary: '#1e293b',
  textMuted: '#64748b',
  waveDark: '#0f172a',
  danger: '#ef4444',
  success: '#22c55e',
  bodyOnDark: '#94a3b8',
  bodyOnLight: '#475569',
};

module.exports = {
  typography,
  spacing,
  colors,
};
