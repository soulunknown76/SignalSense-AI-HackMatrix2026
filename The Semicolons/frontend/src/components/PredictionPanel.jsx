import React from 'react';
import { Cpu, Compass, ShieldCheck, Zap, Radio } from 'lucide-react';
import { getRiskBadge, formatSignal } from '../utils/formatters';

function PredictionPanel({ prediction, loading, selectedTowerNode }) {
  if (loading) {
    return (
      <div className="glass-panel sidebar-card" style={{ textAlign: 'center', padding: '32px' }}>
        <Cpu className="animate-spin" size={24} color="#38bdf8" style={{ margin: '0 auto 10px' }} />
        <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Evaluating IDW Spatial Interpolation & RF Model...</p>
      </div>
    );
  }

  const {
    riskLevel,
    probabilityOfDeadZone,
    expectedSignal,
    expectedSpeed,
    compositeQualityIndex,
    nearestCellNodeMeters,
    spatialConfidence,
    recommendation,
    lat,
    lng
  } = prediction || {
    riskLevel: 'LOW',
    probabilityOfDeadZone: 18,
    expectedSignal: -72,
    expectedSpeed: 58,
    expectedPing: 18,
    compositeQualityIndex: 92,
    nearestCellNodeMeters: 220,
    spatialConfidence: 96,
    recommendation: 'Optimal cellular reception. Sub-20ms low latency cell node operating here.',
    lat: 25.148,
    lng: 75.845,
  };

  const riskBadge = getRiskBadge(riskLevel);

  return (
    <div className="glass-panel sidebar-card">
      {/* Title Bar */}
      <div className="card-section-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={16} color="#38bdf8" />
          <span>AI RF Prediction</span>
        </div>
        <span style={{
          fontSize: '0.72rem',
          padding: '3px 8px',
          borderRadius: '12px',
          background: 'rgba(59, 130, 246, 0.2)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          color: '#38bdf8',
          fontWeight: '700'
        }}>
          {riskBadge.label} {riskBadge.emoji}
        </span>
      </div>

      {selectedTowerNode ? (
        <div style={{ fontSize: '0.78rem', padding: '8px 10px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', marginBottom: '12px', color: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', marginBottom: '2px', color: '#38bdf8' }}>
            <Radio size={13} /> Selected Node: {selectedTowerNode.carrier} Tower
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
            eNodeB: {selectedTowerNode.eNodeB || 40159} | Cell ID: {selectedTowerNode.cellId || 102} | Band: {selectedTowerNode.band || '5G n78'}
          </div>
        </div>
      ) : (
        lat && lng && (
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginBottom: '12px' }}>
            <Compass size={11} /> Target Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
          </div>
        )
      )}

      {/* CQI Composite Score */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '10px 14px',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>
            Quality Index (CQI)
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#38bdf8' }}>
            {compositeQualityIndex || 92} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>/ 100</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
            <ShieldCheck size={11} color="#10b981" /> Spatial Conf.
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc' }}>
            {spatialConfidence || 96}%
          </div>
        </div>
      </div>

      {/* Dead Zone Progress Bar */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
          <span>Dead-Zone Risk</span>
          <span style={{ fontWeight: '700', color: '#f8fafc' }}>
            {probabilityOfDeadZone}%
          </span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${probabilityOfDeadZone}%`,
              background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
              borderRadius: '4px',
              transition: 'width 0.4s ease'
            }}
          ></div>
        </div>
      </div>

      {/* Telemetry Cells */}
      <div className="metrics-grid-3">
        <div className="metric-cell">
          <span className="metric-label">Signal RSRP</span>
          <span className="metric-value" style={{ fontSize: '0.9rem' }}>
            {formatSignal(expectedSignal)}
          </span>
        </div>
        <div className="metric-cell">
          <span className="metric-label">Speed</span>
          <span className="metric-value" style={{ fontSize: '0.9rem' }}>
            {expectedSpeed || 58} <span style={{ fontSize: '0.65rem', fontWeight: 'normal' }}>Mbps</span>
          </span>
        </div>
        <div className="metric-cell">
          <span className="metric-label">Node Dist.</span>
          <span className="metric-value" style={{ fontSize: '0.9rem' }}>
            {nearestCellNodeMeters || 220} <span style={{ fontSize: '0.65rem', fontWeight: 'normal' }}>m</span>
          </span>
        </div>
      </div>

      {/* AI Recommendation */}
      <div style={{
        marginTop: '14px',
        padding: '10px 12px',
        borderRadius: '8px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start'
      }}>
        <Zap size={16} color="#eab308" style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.72rem', color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
            AI Carrier Recommendation
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4' }}>
            {recommendation}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PredictionPanel);
