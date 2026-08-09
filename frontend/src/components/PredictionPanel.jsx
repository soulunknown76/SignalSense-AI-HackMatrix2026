import React from 'react';
import { Cpu, Compass, ShieldCheck, Zap, Radio } from 'lucide-react';
import { getRiskBadge, formatSignal } from '../utils/formatters';

export default function PredictionPanel({ prediction, loading, selectedTowerNode }) {
  if (loading) {
    return (
      <div className="glass-panel sidebar-card" style={{ textAlign: 'center', padding: '32px' }}>
        <Cpu className="animate-spin" size={24} color="#ffffff" style={{ margin: '0 auto 10px' }} />
        <p style={{ color: '#a1a1aa', fontSize: '0.82rem' }}>Evaluating IDW Spatial Interpolation & Cell Node RF Model...</p>
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
    selectedCarrier,
    selectedNodeId
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
          <Cpu size={16} color="#ffffff" />
          <span>AI RF Prediction</span>
        </div>
        <span style={{
          fontSize: '0.72rem',
          padding: '3px 8px',
          borderRadius: '12px',
          background: '#ffffff',
          color: '#000000',
          fontWeight: '800'
        }}>
          {riskBadge.label} {riskBadge.emoji}
        </span>
      </div>

      {selectedTowerNode ? (
        <div style={{ fontSize: '0.78rem', padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid #ffffff', marginBottom: '12px', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', marginBottom: '2px' }}>
            <Radio size={13} /> Selected Node: {selectedTowerNode.carrier} Tower
          </div>
          <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontFamily: 'monospace' }}>
            eNodeB: {selectedTowerNode.eNodeB || 40159} | Cell ID: {selectedTowerNode.cellId || 102} | Band: {selectedTowerNode.band || '5G n78'}
          </div>
        </div>
      ) : (
        lat && lng && (
          <div style={{ fontSize: '0.75rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: 4, marginBottom: '12px' }}>
            <Compass size={11} /> Target Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
          </div>
        )
      )}

      {/* CQI Composite Score */}
      <div style={{
        background: '#09090b',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '10px 14px',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>
            Quality Index (CQI)
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff' }}>
            {compositeQualityIndex || 92} <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 'normal' }}>/ 100</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: '#71717a', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
            <ShieldCheck size={11} color="#ffffff" /> Spatial Conf.
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff' }}>
            {spatialConfidence || 96}%
          </div>
        </div>
      </div>

      {/* Dead Zone Progress Bar */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '6px' }}>
          <span>Dead-Zone Risk</span>
          <span style={{ fontWeight: '800', color: '#ffffff' }}>
            {probabilityOfDeadZone}%
          </span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${probabilityOfDeadZone}%`,
              background: '#ffffff',
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
        background: '#09090b',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start'
      }}>
        <Zap size={16} color="#ffffff" style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: '800', fontSize: '0.72rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
            AI Carrier Recommendation
          </div>
          <div style={{ fontSize: '0.8rem', color: '#a1a1aa', lineHeight: '1.4' }}>
            {recommendation}
          </div>
        </div>
      </div>
    </div>
  );
}
