import React from 'react';
import { BarChart3, Signal, Download, Upload, Zap, Shield, Award } from 'lucide-react';
import { formatSignal, formatSpeed, formatPing } from '../utils/formatters';

function CarrierComparison({ carriers = [], selectedCarrier = 'All', onSelectCarrier }) {
  return (
    <div className="glass-panel sidebar-card" style={{ padding: '20px' }}>
      <div className="card-section-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={16} color="#38bdf8" />
          <span>Multi-Carrier Telemetry Benchmark</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'none', fontWeight: 'normal' }}>
          Click carrier row to filter map & AI prediction
        </span>
      </div>

      <div className="comparison-table-container">
        <table className="minimal-table">
          <thead>
            <tr>
              <th>Carrier</th>
              <th>
                <Signal size={12} style={{ display: 'inline', marginRight: 4 }} />
                RSRP Signal
              </th>
              <th>
                <Download size={12} style={{ display: 'inline', marginRight: 4 }} />
                Download
              </th>
              <th>
                <Upload size={12} style={{ display: 'inline', marginRight: 4 }} />
                Upload
              </th>
              <th>
                <Zap size={12} style={{ display: 'inline', marginRight: 4 }} />
                Ping
              </th>
              <th>
                <Shield size={12} style={{ display: 'inline', marginRight: 4 }} />
                Reliability
              </th>
              <th>
                <Award size={12} style={{ display: 'inline', marginRight: 4 }} />
                Trust Score
              </th>
            </tr>
          </thead>
          <tbody>
            {carriers.map((carrier) => {
              const isSelected = selectedCarrier.toLowerCase() === carrier.name.toLowerCase();

              return (
                <tr
                  key={carrier.name}
                  className={isSelected ? 'selected' : ''}
                  onClick={() => onSelectCarrier && onSelectCarrier(carrier.name)}
                >
                  <td style={{ fontWeight: '700', color: '#f8fafc' }}>
                    {carrier.name}
                    {carrier.rank === 1 && <span style={{ marginLeft: '6px', fontSize: '0.85rem' }}>🥇</span>}
                  </td>
                  <td style={{ fontWeight: '600', color: '#f8fafc' }}>
                    {formatSignal(carrier.signalStrength)}
                  </td>
                  <td>{formatSpeed(carrier.downloadSpeed)}</td>
                  <td>{formatSpeed(carrier.uploadSpeed)}</td>
                  <td>{formatPing(carrier.ping)}</td>
                  <td>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>
                      {carrier.reliability}%
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '48px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${carrier.trustScore}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', height: '100%' }}></div>
                      </div>
                      <span style={{ fontWeight: '700', color: '#38bdf8' }}>{carrier.trustScore}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default React.memo(CarrierComparison);
