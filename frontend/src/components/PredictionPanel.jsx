import React from 'react';
import { Cpu, AlertTriangle, Radio, Compass, ShieldCheck, Zap, Activity } from 'lucide-react';
import { getRiskBadge, formatSignal } from '../utils/formatters';

export default function PredictionPanel({ prediction, loading }) {
  if (loading) {
    return (
      <div className="glass-panel prediction-card" style={{ textAlign: 'center', padding: '32px' }}>
        <Cpu className="animate-spin" size={28} color="#3b82f6" style={{ margin: '0 auto 12px' }} />
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Running IDW Spatial Interpolation & AI Dead Zone model...</p>
      </div>
    );
  }

  const {
    riskLevel,
    probabilityOfDeadZone,
    expectedSignal,
    expectedSpeed,
    expectedPing,
    compositeQualityIndex,
    nearestCellNodeMeters,
    spatialConfidence,
    recommendation,
    lat,
    lng,
  } = prediction || {
    riskLevel: 'MEDIUM',
    probabilityOfDeadZone: 28,
    expectedSignal: -74,
    expectedSpeed: 45,
    expectedPing: 22,
    compositeQualityIndex: 86,
    nearestCellNodeMeters: 320,
    spatialConfidence: 94,
    recommendation: 'Jio provides optimal 5G coverage here.',
    lat: 25.181,
    lng: 75.839,
  };

  const riskBadge = getRiskBadge(riskLevel);

  return (
    <div className="glass-panel prediction-card">
      {/* Header with Risk & Quality Score */}
      <div className="risk-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="#3b82f6" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>AI RF Prediction</h3>
        </div>
        <div className={`risk-badge-${riskLevel.toLowerCase()}`}>
          Risk: {riskBadge.label} {riskBadge.emoji}
        </div>
      </div>

      {lat && lng && (
        <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginBottom: '12px' }}>
          <Compass size={12} /> Target: {lat.toFixed(4)}, {lng.toFixed(4)}
        </div>
      )}

      {/* CQI Composite Quality Score Badge */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justify-content: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
            Quality Score (CQI)
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: compositeQualityIndex >= 75 ? '#10b981' : compositeQualityIndex >= 50 ? '#f59e0b' : '#ef4444' }}>
            {compositeQualityIndex || 85} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ 100</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
            <ShieldCheck size={12} color="#06b6d4" /> Spatial Conf.
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#38bdf8' }}>
            {spatialConfidence || 92}%
          </div>
        </div>
      </div>

      {/* Dead Zone Probability Bar */}
      <div className="progress-section">
        <div className="progress-label-row">
          <span>Probability of Dead Zone</span>
          <span style={{ fontWeight: '800', color: probabilityOfDeadZone > 60 ? '#ef4444' : probabilityOfDeadZone > 30 ? '#f59e0b' : '#10b981' }}>
            {probabilityOfDeadZone}%
          </span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${probabilityOfDeadZone}%`,
              background: probabilityOfDeadZone > 60
                ? 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)'
                : 'linear-gradient(90deg, #10b981 0%, #f59e0b 100%)'
            }}
          ></div>
        </div>
      </div>

      {/* Detailed Telemetry Stat Grid */}
      <div className="prediction-stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '14px' }}>
        <div className="stat-box" style={{ padding: '10px 8px' }}>
          <div className="stat-label" style={{ fontSize: '0.7rem' }}>Exp. Signal</div>
          <div className="stat-value" style={{ fontSize: '0.95rem', color: expectedSignal < -95 ? '#ef4444' : '#38bdf8' }}>
            {formatSignal(expectedSignal)}
          </div>
        </div>

        <div className="stat-box" style={{ padding: '10px 8px' }}>
          <div className="stat-label" style={{ fontSize: '0.7rem' }}>Exp. Speed</div>
          <div className="stat-value" style={{ fontSize: '0.95rem', color: '#a7f3d0' }}>
            {expectedSpeed || 45} <span style={{ fontSize: '0.65rem' }}>Mbps</span>
          </div>
        </div>

        <div className="stat-box" style={{ padding: '10px 8px' }}>
          <div className="stat-label" style={{ fontSize: '0.7rem' }}>Nearest Node</div>
          <div className="stat-value" style={{ fontSize: '0.95rem', color: '#fde047' }}>
            {nearestCellNodeMeters || 350} <span style={{ fontSize: '0.65rem' }}>m</span>
          </div>
        </div>
      </div>

      {/* AI Recommendation Box */}
      <div className="recommendation-box" style={{ marginTop: '14px' }}>
        <div className="recommendation-icon">⚡</div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.78rem', color: '#93c5fd', textTransform: 'uppercase', marginBottom: '2px' }}>
            AI Carrier Recommendation
          </div>
          <div className="recommendation-text">
            {recommendation}
          </div>
        </div>
      </div>
    </div>
  );
}
