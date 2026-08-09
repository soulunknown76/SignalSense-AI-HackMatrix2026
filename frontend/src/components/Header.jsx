import React from 'react';
import { ShieldCheck, User, LogOut } from 'lucide-react';

export default function Header({ activeCarrierCount, backendConnected, user, onLogout }) {
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
        
        {user && (
          <div className="user-profile-badge">
            <User size={14} style={{ color: '#38bdf8' }} />
            <span className="user-name-text">{user.username}</span>
            <span className="user-phone-text">({user.phone})</span>
            {onLogout && (
              <button onClick={onLogout} className="logout-btn" title="Logout">
                <LogOut size={12} style={{ display: 'inline', marginRight: 2 }} /> Logout
              </button>
            )}
          </div>
        )}

        <div className="location-chip">
          <ShieldCheck size={14} style={{ display: 'inline', marginRight: 4 }} />
          {backendConnected ? 'API Connected' : 'Demo Mode (Mock Sync)'}
        </div>
      </div>
    </header>
  );
}

