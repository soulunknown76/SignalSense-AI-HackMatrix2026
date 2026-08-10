import React from 'react';
import { ShieldCheck, User, LogOut, Radio } from 'lucide-react';

export default function Header({ activeCarrierCount, backendConnected, user, onLogout }) {
  return (
    <header className="glass-panel app-header">
      <div className="brand-section">
        <div className="brand-icon">
          <Radio size={20} />
        </div>
        <div>
          <h1 className="brand-title">SignalSense AI</h1>
          <p className="brand-subtitle">Cellular Coverage Intelligence & Real-Time Signal Mapping</p>
        </div>
      </div>

      <div className="header-status">
        <div className="live-badge">
          <span className="live-dot"></span>
          LIVE TELEMETRY RADAR
        </div>
        
        {user && (
          <div className="location-chip" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.25)', color: '#f8fafc' }}>
            <User size={13} style={{ color: '#38bdf8', marginRight: 4 }} />
            <span style={{ fontWeight: 600 }}>{user.username}</span>
            {onLogout && (
              <button
                onClick={onLogout}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: 8, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center' }}
                title="Logout"
              >
                <LogOut size={12} style={{ marginRight: 2 }} /> Logout
              </button>
            )}
          </div>
        )}

        <div className="location-chip" style={{ fontSize: '0.75rem' }}>
          <ShieldCheck size={13} style={{ display: 'inline', marginRight: 4, color: backendConnected ? '#10b981' : '#f59e0b' }} />
          {backendConnected ? 'Backend Operational' : 'Offline Telemetry Sync'}
        </div>
      </div>
    </header>
  );
}
