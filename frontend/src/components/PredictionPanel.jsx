import React from 'react';
import { Cpu, AlertTriangle, Radio, Compass } from 'lucide-react';
import { getRiskBadge, formatSignal } from '../utils/formatters';

export default function PredictionPanel({ prediction, loading }) {
  if (loading) {
    return (
      <div className="glass-panel prediction-card" style={{ textAlign: 'center', padding: '32px' }}>
        <Cpu className="animate-spin" size={28} color="#3b82f6" style={{ margin: '0 auto 12px' }} />
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Analyzing RF Signal propagation & AI Dead Zone model...</p>
      </div>
    );
  }

  const { riskLevel, probabilityOfDeadZone, expectedSignal, recommendation, lat, lng } = prediction || {
    riskLevel: 'HIGH',
    probabilityOfDeadZone: 87,
    expectedSignal: -101,
    recommendation: 'Try Airtel in this location.',
    lat: 25.181,
    lng: 75.839
  };

  const riskBadge = getRiskBadge(riskLevel);

  return (
    <div className="glass-panel prediction-card">
      <div className="risk-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="#3b82f6" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Connectivity Prediction</h3>
        </div>
        <div className={`risk-badge-${riskLevel.toLowerCase()}`}>
          Risk: {riskBadge.label} {riskBadge.emoji}
        </div>
      </div>

      {lat && lng && (
        <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Compass size={12} /> Target: {lat.toFixed(4)}, {lng.toFixed(4)}
        </div>
      )}

      {/* Dead Zone Probability Bar */}
      <div className="progress-section">
        <div className="progress-label-row">
          <span>Probability of Dead Zone</span>
          <span style={{ fontWeight: '800', color: riskLevel === 'HIGH' ? '#ef4444' : '#f59e0b' }}>
            {probabilityOfDeadZone}%
          </span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${probabilityOfDeadZone}%`,
              background: riskLevel === 'HIGH'
                ? 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)'
                : 'linear-gradient(90deg, #10b981 0%, #f59e0b 100%)'
            }}
          ></div>
        </div>
      </div>

      {/* Stats Readout */}
      <div className="prediction-stat-grid">
        <div className="stat-box">
          <div className="stat-label">Expected Signal</div>
          <div className="stat-value" style={{ color: expectedSignal < -95 ? '#ef4444' : '#38bdf8' }}>
            {formatSignal(expectedSignal)}
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Prediction Model</div>
          <div className="stat-value" style={{ fontSize: '0.9rem', color: '#a7f3d0' }}>
            SignalSense-v2 (RF)
          </div>
        </div>
      </div>

      {/* Recommendation Box */}
      <div className="recommendation-box">
        <div className="recommendation-icon">💡</div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#93c5fd', textTransform: 'uppercase', marginBottom: '2px' }}>
            Recommendation
          </div>
          <div className="recommendation-text">
            {recommendation}
          </div>
        </div>
      </div>
    </div>
  );
}
