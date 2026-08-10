export const getSignalColor = (signal) => {
  if (signal >= -80) return '#10b981'; // Green (Excellent)
  if (signal >= -95) return '#f59e0b'; // Yellow (Moderate)
  return '#ef4444'; // Red (Poor / Dead Zone)
};

export const getSignalStatus = (signal) => {
  if (signal >= -80) return { label: 'Excellent', emoji: '🟢', color: '#10b981' };
  if (signal >= -95) return { label: 'Moderate', emoji: '🟡', color: '#f59e0b' };
  return { label: 'Poor / Dead Zone', emoji: '🔴', color: '#ef4444' };
};

export const getRiskBadge = (riskLevel) => {
  const level = (riskLevel || '').toUpperCase();
  if (level === 'HIGH') return { label: 'HIGH', emoji: '🔴', bgClass: 'risk-high' };
  if (level === 'MEDIUM') return { label: 'MEDIUM', emoji: '🟡', bgClass: 'risk-medium' };
  return { label: 'LOW', emoji: '🟢', bgClass: 'risk-low' };
};

export const getRankBadge = (rank) => {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return `${rank}th`;
  }
};

export const CARRIER_COLORS = {
  Jio: '#2563eb',
  Airtel: '#dc2626',
  Vi: '#d97706',
  BSNL: '#059669',
};

export const formatSpeed = (val) => `${val} Mbps`;
export const formatPing = (val) => `${val} ms`;
export const formatSignal = (val) => `${val} dBm`;
