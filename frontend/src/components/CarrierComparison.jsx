import React from 'react';
import { BarChart3, Signal, Download, Upload, Zap, Shield, Award } from 'lucide-react';
import { formatSignal, formatSpeed, formatPing } from '../utils/formatters';

export default function CarrierComparison({ carriers = [], measurements = [], selectedCarrier = 'All', onSelectCarrier, searchLocation }) {
  // Compute dynamic live telemetry statistics for each carrier based on active measurements
  const carrierNames = ['Jio', 'Airtel', 'Vi', 'BSNL'];

  const dynamicCarriers = carrierNames.map((name) => {
    const points = measurements.filter((m) => m.carrier === name);
    const fallbackCarrier = carriers.find((c) => c.name === name) || {};

    if (!points || points.length === 0) {
      return {
        name,
        rank: fallbackCarrier.rank || 4,
        signalStrength: fallbackCarrier.signalStrength || -88,
        downloadSpeed: fallbackCarrier.downloadSpeed || 25,
        uploadSpeed: fallbackCarrier.uploadSpeed || 6,
        ping: fallbackCarrier.ping || 40,
        reliability: fallbackCarrier.reliability || 75,
        trustScore: fallbackCarrier.trustScore || 65,
      };
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
    const trustScore = Math.min(99, Math.round(cqi * 0.95 + avgReliability * 0.05));

    return {
      name,
      score: cqi,
      signalStrength: avgSignal,
      downloadSpeed: avgSpeed,
      uploadSpeed: avgUpload,
      ping: avgPing,
      reliability: avgReliability,
      trustScore,
    };
  });

  // Sort by CQI score
  dynamicCarriers.sort((a, b) => b.score - a.score);
  const finalCarriers = dynamicCarriers.map((c, idx) => ({ ...c, rank: idx + 1 }));

  return (
    <div className="glass-panel sidebar-card" style={{ padding: '20px' }}>
      <div className="card-section-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={16} color="#38bdf8" />
          <span>Multi-Carrier Telemetry Benchmark</span>
          {searchLocation && (
            <span style={{ fontSize: '0.75rem', color: '#06b6d4', background: 'rgba(6, 182, 212, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
              📍 {searchLocation}
            </span>
          )}
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
            {finalCarriers.map((carrier) => {
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
                  <td style={{ fontWeight: '600', color: carrier.signalStrength < -95 ? '#ef4444' : '#38bdf8' }}>
                    {formatSignal(carrier.signalStrength)}
                  </td>
                  <td style={{ fontWeight: '600', color: '#a7f3d0' }}>{formatSpeed(carrier.downloadSpeed)}</td>
                  <td>{formatSpeed(carrier.uploadSpeed)}</td>
                  <td>{formatPing(carrier.ping)}</td>
                  <td>
                    <span style={{ color: carrier.reliability >= 80 ? '#10b981' : '#f59e0b', fontWeight: '600' }}>
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
