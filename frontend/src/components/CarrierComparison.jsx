import React from 'react';
import { BarChart3, Signal, Download, Upload, Zap, Shield, Award } from 'lucide-react';
import { formatSignal, formatSpeed, formatPing } from '../utils/formatters';

export default function CarrierComparison({ carriers = [] }) {
  return (
    <div className="glass-panel comparison-card">
      <div className="section-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={20} color="#3b82f6" />
          <span>Carrier Performance Comparison</span>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Multi-Metric Telemetry Matrix</span>
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Carrier</th>
              <th>
                <Signal size={14} style={{ display: 'inline', marginRight: 4 }} />
                Signal Strength
              </th>
              <th>
                <Download size={14} style={{ display: 'inline', marginRight: 4 }} />
                Download Speed
              </th>
              <th>
                <Upload size={14} style={{ display: 'inline', marginRight: 4 }} />
                Upload Speed
              </th>
              <th>
                <Zap size={14} style={{ display: 'inline', marginRight: 4 }} />
                Ping / Latency
              </th>
              <th>
                <Shield size={14} style={{ display: 'inline', marginRight: 4 }} />
                Reliability
              </th>
              <th>
                <Award size={14} style={{ display: 'inline', marginRight: 4 }} />
                AI Trust Score
              </th>
            </tr>
          </thead>
          <tbody>
            {carriers.map((carrier) => (
              <tr key={carrier.name}>
                <td style={{ fontWeight: '700', color: '#fff' }}>
                  {carrier.name}
                  {carrier.rank === 1 && <span style={{ marginLeft: '6px' }}>🥇</span>}
                </td>
                <td className={carrier.signalStrength >= -80 ? 'metric-highlight' : ''}>
                  {formatSignal(carrier.signalStrength)}
                </td>
                <td>{formatSpeed(carrier.downloadSpeed)}</td>
                <td>{formatSpeed(carrier.uploadSpeed)}</td>
                <td>{formatPing(carrier.ping)}</td>
                <td>
                  <span style={{ color: carrier.reliability >= 90 ? '#10b981' : '#f59e0b' }}>
                    {carrier.reliability}%
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${carrier.trustScore}%`, background: '#38bdf8', height: '100%' }}></div>
                    </div>
                    <span style={{ fontWeight: '700', color: '#38bdf8' }}>{carrier.trustScore}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
