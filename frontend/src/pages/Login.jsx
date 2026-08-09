import React, { useState } from 'react';
import { User, Phone, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
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
      // Fallback local login
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
    <div className="login-container">
      <div className="glass-panel login-card">
        {/* Header Icon & Brand */}
        <div className="login-header">
          <div className="brand-icon login-logo">📡</div>
          <h1 className="login-title">SignalSense AI</h1>
          <p className="login-subtitle">Cellular Coverage Intelligence & AI Prediction Radar</p>
        </div>

        {/* Welcome Tag */}
        <div className="login-welcome-badge">
          <Sparkles size={14} style={{ color: '#00f2fe' }} />
          <span>Enter Credentials to Access Radar</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Username Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="username-input">
              <User size={15} /> Username
            </label>
            <div className="input-wrapper">
              <input
                id="username-input"
                type="text"
                className="form-input"
                placeholder="e.g. Garvit"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={30}
                required
              />
            </div>
          </div>

          {/* Phone Number Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="phone-input">
              <Phone size={15} /> Phone Number
            </label>
            <div className="input-wrapper">
              <input
                id="phone-input"
                type="tel"
                className="form-input"
                placeholder="e.g. 9876543210 (10 digits)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Intelligence Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Shortcut */}
        <div className="login-footer">
          <button type="button" className="demo-fill-btn" onClick={handleQuickDemo}>
            ⚡ Auto-Fill Demo Credentials
          </button>
          <p className="login-security-note">
            <ShieldCheck size={13} style={{ display: 'inline', marginRight: 4 }} />
            Secure cellular intelligence network access
          </p>
        </div>
      </div>
    </div>
  );
}
