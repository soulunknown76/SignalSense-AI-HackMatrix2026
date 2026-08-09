/**
 * SignalSense AI - Composite Quality Index (CQI) Scoring Engine
 * Computes multi-variate network quality scores (0-100) based on signal strength, download/upload speed, ping latency, and reliability.
 */

// Normalize signal strength (-120 dBm to -50 dBm -> 0 to 100)
export const scoreSignal = (dBm) => {
  if (dBm >= -50) return 100;
  if (dBm <= -120) return 0;
  return Math.round(((dBm + 120) / 70) * 100);
};

// Normalize download speed (0 Mbps to 150 Mbps -> 0 to 100)
export const scoreDownloadSpeed = (speedMbps) => {
  if (speedMbps <= 0) return 0;
  if (speedMbps >= 150) return 100;
  return Math.round(Math.min(100, Math.log10(speedMbps + 1) * 46));
};

// Normalize upload speed (0 Mbps to 50 Mbps -> 0 to 100)
export const scoreUploadSpeed = (uploadMbps) => {
  if (uploadMbps <= 0) return 0;
  if (uploadMbps >= 50) return 100;
  return Math.round(Math.min(100, Math.log10(uploadMbps + 1) * 58));
};

// Normalize latency ping (10 ms to 150 ms -> 100 to 0)
export const scoreLatency = (pingMs) => {
  if (pingMs <= 10) return 100;
  if (pingMs >= 150) return 0;
  return Math.round(Math.max(0, 100 - ((pingMs - 10) / 140) * 100));
};

/**
 * Calculates Composite Quality Index (CQI) Score (0 - 100)
 * Weighted Formula:
 *  - 30% Signal Strength
 *  - 25% Download Speed
 *  - 15% Upload Speed
 *  - 15% Latency Ping
 *  - 15% Historical Reliability
 */
export const calculateCQI = (measurement) => {
  const sSignal = scoreSignal(measurement.signal || -90);
  const sSpeed = scoreDownloadSpeed(measurement.speed || 10);
  const sUpload = scoreUploadSpeed(measurement.upload || 3);
  const sLatency = scoreLatency(measurement.ping || 40);
  const sReliability = Math.min(100, Math.max(0, measurement.reliability || 80));

  const cqi = 
    0.30 * sSignal +
    0.25 * sSpeed +
    0.15 * sUpload +
    0.15 * sLatency +
    0.15 * sReliability;

  return Math.round(cqi);
};

/**
 * Dynamically aggregates telemetry measurements per carrier and recalculates carrier rankings
 */
export const calculateCarrierRankings = (measurements) => {
  const carrierMap = {};

  measurements.forEach((m) => {
    const name = m.carrier;
    if (!carrierMap[name]) {
      carrierMap[name] = {
        name,
        signals: [],
        speeds: [],
        uploads: [],
        pings: [],
        reliabilities: [],
        cqis: [],
      };
    }

    const cqi = calculateCQI(m);
    carrierMap[name].signals.push(m.signal);
    carrierMap[name].speeds.push(m.speed);
    carrierMap[name].uploads.push(m.upload);
    carrierMap[name].pings.push(m.ping);
    carrierMap[name].reliabilities.push(m.reliability);
    carrierMap[name].cqis.push(cqi);
  });

  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const rankedList = Object.keys(carrierMap).map((name) => {
    const data = carrierMap[name];
    const avgScore = Math.round(avg(data.cqis));
    const avgSignal = Math.round(avg(data.signals));
    const avgSpeed = Math.round(avg(data.speeds) * 10) / 10;
    const avgUpload = Math.round(avg(data.uploads) * 10) / 10;
    const avgPing = Math.round(avg(data.pings));
    const avgReliability = Math.round(avg(data.reliabilities));
    const trustScore = Math.min(99, Math.round(avgScore * 0.95 + avgReliability * 0.05));
    const coveragePct = `${Math.min(99, Math.max(60, Math.round(avgScore * 0.9 + 10)))}%`;

    return {
      name,
      score: avgScore,
      signalStrength: avgSignal,
      downloadSpeed: avgSpeed,
      uploadSpeed: avgUpload,
      ping: avgPing,
      reliability: avgReliability,
      trustScore,
      coverage: coveragePct,
    };
  });

  // Sort descending by score
  rankedList.sort((a, b) => b.score - a.score);

  // Assign ranks and badges
  return rankedList.map((c, index) => {
    let badge = 'Active Network';
    if (index === 0) badge = '🥇 Best Overall';
    else if (index === 1) badge = '🥈 Fastest Latency';
    else if (index === 2) badge = '🥉 Moderate';
    else badge = 'Rural Coverage';

    return {
      rank: index + 1,
      ...c,
      badge,
    };
  });
};
