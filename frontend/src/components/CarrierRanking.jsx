import React from 'react';
import { Trophy } from 'lucide-react';

function CarrierRanking({ carriers = [], selectedCarrier = 'All', onSelectCarrier }) {
  const topCarrier = carriers[0] || { name: 'Jio', score: 93 };
  const otherCarriers = carriers.slice(1);

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

export default React.memo(CarrierRanking);
