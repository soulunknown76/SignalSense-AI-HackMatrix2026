import React from 'react';
import { Trophy } from 'lucide-react';

export default function CarrierRanking({ carriers = [], measurements = [], selectedCarrier = 'All', onSelectCarrier }) {
  // Compute dynamic live rankings from measurements if present
  const carrierNames = ['Jio', 'Airtel', 'Vi', 'BSNL'];
  
  let activeCarriers = carriers;

  if (Array.isArray(measurements) && measurements.length > 0) {
    const computed = carrierNames.map((name) => {
      const points = measurements.filter((m) => m.carrier === name);
      const fallbackCarrier = carriers.find((c) => c.name === name) || {};

      if (!points || points.length === 0) {
        return { name, score: fallbackCarrier.score || 50 };
      }

      const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
      const avgSignal = Math.round(avg(points.map((p) => p.signal || p.rsrp || -80)));
      const avgSpeed = Math.round(avg(points.map((p) => p.speed || 30)) * 10) / 10;
      const avgUpload = Math.round(avg(points.map((p) => p.upload || 8)) * 10) / 10;
      const avgPing = Math.round(avg(points.map((p) => p.ping || 30)));
      const avgReliability = Math.round(avg(points.map((p) => p.reliability || 85)));

      const sSignal = Math.max(0, Math.min(100, Math.round(((avgSignal + 120) / 70) * 100)));
      const sSpeed = Math.max(0, Math.min(100, Math.round(Math.log10(avgSpeed + 1) * 46)));
      const sUpload = Math.max(0, Math.min(100, Math.round(Math.log10(avgUpload + 1) * 58)));
      const sPing = Math.max(0, Math.min(100, Math.round(100 - ((avgPing - 10) / 140) * 100)));

      const cqi = Math.round(0.3 * sSignal + 0.25 * sSpeed + 0.15 * sUpload + 0.15 * sPing + 0.15 * avgReliability);
      return { name, score: cqi };
    });

    computed.sort((a, b) => b.score - a.score);
    activeCarriers = computed;
  }

  const topCarrier = activeCarriers[0] || { name: 'Jio', score: 93 };
  const otherCarriers = activeCarriers.slice(1);

  return (
    <div className="glass-panel sidebar-card">
      <div className="card-section-title">
        <span>Optimal Network Leaderboard</span>
        <Trophy size={16} color="#38bdf8" />
      </div>

      {/* Rank #1 Highlight */}
      <div
        onClick={() => onSelectCarrier && onSelectCarrier(topCarrier.name)}
        style={{
          background: selectedCarrier.toLowerCase() === topCarrier.name.toLowerCase() ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
          border: selectedCarrier.toLowerCase() === topCarrier.name.toLowerCase() ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>🥇</span>
          <div>
            <div style={{
              fontSize: '0.7rem',
              color: '#38bdf8',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontWeight: '700'
            }}>
              Rank #1 Best Network
            </div>
            <div style={{
              fontSize: '1.05rem',
              fontWeight: '800',
              color: '#f8fafc'
            }}>
              {topCarrier.name}
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: '800',
          color: '#38bdf8'
        }}>
          {topCarrier.score}<span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#94a3b8' }}>/100</span>
        </div>
      </div>

      {/* Remaining Carrier Rows */}
      <div className="ranking-list">
        {otherCarriers.map((c, index) => {
          const isSelected = selectedCarrier.toLowerCase() === c.name.toLowerCase();
          return (
            <div
              key={c.name}
              className={`ranking-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectCarrier && onSelectCarrier(c.name)}
            >
              <div className="carrier-info">
                <span className="rank-badge">{index + 2}</span>
                <span className="carrier-name">{c.name}</span>
              </div>
              <div className="score-badge">
                {c.score}<span style={{ fontSize: '0.72rem', color: '#64748b' }}>/100</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
