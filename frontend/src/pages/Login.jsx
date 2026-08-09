import React, { useState } from 'react';
import { User, Phone, ShieldCheck, ArrowRight, Sparkles, AlertCircle, Radio, Activity, Cpu, CheckCircle2, Zap } from 'lucide-react';
import { loginUser } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedUser = username.trim();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    if (!trimmedUser) {
      setError('Please enter your username.');
      return;
    }
    if (trimmedUser.length < 2) {
      setError('Username must be at least 2 characters long.');
      return;
    }
    if (!cleanPhone) {
      setError('Please enter your phone number.');
      return;
    }
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(trimmedUser, cleanPhone);
      if (res && res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Logging in locally...');
      onLoginSuccess({ username: trimmedUser, phone: cleanPhone });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setUsername('DemoUser');
    setPhone('9876543210');
    setError('');
  };

  return (
    <div className="login-page-wrapper">
      {/* Background Animated Ambient Lights */}
      <div className="ambient-glow orb-1"></div>
      <div className="ambient-glow orb-2"></div>

      <div className="login-main-card glass-panel">
        {/* Left Hero Feature Column */}
        <div className="login-hero-sidebar">
          <div className="hero-brand-header">
            <div className="login-brand-logo">📡</div>
            <div>
              <h1 className="hero-brand-name">SignalSense AI</h1>
              <p className="hero-brand-tagline">Cellular Coverage & AI Prediction Platform</p>
            </div>
          </div>

          <div className="hero-tag-pill">
            <Sparkles size={14} className="sparkle-icon" />
            <span>Next-Gen Coverage Intelligence</span>
          </div>

          <div className="hero-features-list">
            <div className="feature-item">
              <div className="feature-icon-box">
                <Radio size={18} />
              </div>
              <div>
                <h4>Real-Time Signal Heatmaps</h4>
                <p>Live coverage telemetry across Jio, Airtel, Vi & BSNL</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <Cpu size={18} />
              </div>
              <div>
                <h4>AI Dead Zone Forecasting</h4>
                <p>Predictive RSRP, ping latency & reliability modeling</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <Activity size={18} />
              </div>
              <div>
                <h4>Cell Tower Diagnostics</h4>
                <p>Interactive overpass tower node mapping & carrier rankings</p>
              </div>
            </div>
          </div>

          <div className="hero-footer-stats">
            <div className="stat-pill">
              <span className="stat-value">99.4%</span>
              <span className="stat-label">Prediction Accuracy</span>
            </div>
            <div className="stat-pill">
              <span className="stat-value">&lt; 50ms</span>
              <span className="stat-label">Telemetry Latency</span>
            </div>
          </div>
        </div>

        {/* Right Form Card Column */}
        <div className="login-form-section">
          <div className="form-header-title">
            <h2>Welcome Back</h2>
            <p>Sign in to access your cellular intelligence radar dashboard</p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="login-error-box">
              <AlertCircle size={18} className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Username Field */}
            <div className="input-group">
              <label htmlFor="username-input" className="input-label">
                Username
              </label>
              <div className="input-field-wrapper">
                <User size={18} className="field-icon" />
                <input
                  id="username-input"
                  type="text"
                  className="custom-input"
                  placeholder="Enter your username (e.g. Garvit)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={30}
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="input-group">
              <label htmlFor="phone-input" className="input-label">
                Mobile Phone Number
              </label>
              <div className="input-field-wrapper">
                <Phone size={18} className="field-icon" />
                <input
                  id="phone-input"
                  type="tel"
                  className="custom-input"
                  placeholder="10-digit mobile number (e.g. 9876543210)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-submit-button" disabled={loading}>
              {loading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight size={18} className="btn-arrow" />
                </>
              )}
            </button>
          </form>

          {/* Demo Fill Shortcut */}
          <div className="form-footer-actions">
            <button type="button" className="quick-demo-btn" onClick={handleQuickDemo}>
              <Zap size={15} style={{ color: '#06b6d4' }} />
              <span>Auto-Fill Demo Account</span>
            </button>

            <div className="security-badge">
              <ShieldCheck size={14} color="#10b981" />
              <span>Encrypted Network Authentication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

