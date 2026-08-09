import React from 'react';
import { Radio, Signal, ShieldCheck } from 'lucide-react';

export default function Header({ activeCarrierCount, backendConnected }) {
  return (
    <header className="glass-panel app-header">
      <div className="brand-section">
        <div className="brand-icon">
          📡
        </div>
        <div>
          <h1 className="brand-title">SignalSense AI</h1>
          <p className="brand-subtitle">Cellular Coverage Intelligence & AI Dead Zone Prediction</p>
        </div>
      </div>

      <div className="header-status">
        <div className="live-badge">
          <span className="live-dot"></span>
          LIVE RADAR
        </div>
        <div className="location-chip">
          <ShieldCheck size={14} style={{ display: 'inline', marginRight: 4 }} />
          {backendConnected ? 'API Connected' : 'Demo Mode (Mock Sync)'}
        </div>
      </div>
    </header>
  );
}
