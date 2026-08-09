import React from 'react';
import { Trophy, Award } from 'lucide-react';
import { getRankBadge } from '../utils/formatters';

export default function CarrierRanking({ carriers = [] }) {
  const topCarrier = carriers[0] || { name: 'Jio', score: 91 };
  const otherCarriers = carriers.slice(1);

  return (
    <div className="glass-panel ranking-card">
      <div className="section-title">
        <span>Best Network Here</span>
        <Trophy size={18} color="#eab308" />
      </div>

      {/* Highlight Top Carrier */}
      <div className="best-network-banner">
        <div className="best-network-left">
          <span className="trophy-badge">🥇</span>
          <div>
            <div className="best-network-title">Rank #1 Best Network</div>
            <div className="best-network-name">{topCarrier.name}</div>
          </div>
        </div>
        <div className="best-network-score">
          {topCarrier.score}/100
        </div>
      </div>

      {/* List of remaining carriers */}
      <div className="carrier-list">
        {otherCarriers.map((c, index) => (
          <div key={c.name} className="carrier-row">
            <div className="carrier-info">
              <span className="carrier-rank">{getRankBadge(index + 2)}</span>
              <span className="carrier-name">{c.name}</span>
            </div>
            <div className="carrier-score-pill">
              {c.score}/100
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
