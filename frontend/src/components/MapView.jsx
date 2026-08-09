import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getSignalColor, formatSignal, formatSpeed } from '../utils/formatters';
import { Layers, Signal, ZoomIn } from 'lucide-react';

const MIN_MARKER_ZOOM = 13;

const createCustomMarker = (signal, carrier, isSelected) => {
  const color = getSignalColor(signal);
  const initial = carrier ? carrier.charAt(0) : 'S';
  const border = isSelected ? '3px solid #ffffff' : '2px solid rgba(255, 255, 255, 0.9)';
  const shadow = isSelected ? `0 0 20px ${color}` : `0 0 10px ${color}`;
  
  return L.divIcon({
    className: 'custom-leaflet-marker-wrapper',
    html: `<div class="custom-leaflet-marker" style="background-color: ${color}; color: #ffffff; border: ${border}; box-shadow: ${shadow};">
            ${initial}
          </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && typeof center.lat === 'number' && typeof center.lng === 'number') {
      map.flyTo([center.lat, center.lng], 14, {
        animate: true,
        duration: 1.2
      });
    }
  }, [center, map]);
  return null;
}

function MapEventsHandler({ onBoundsChange, onZoomChange }) {
  const map = useMapEvents({
    moveend() {
      if (onBoundsChange) {
        const b = map.getBounds();
        onBoundsChange({
          south: b.getSouth(),
          north: b.getNorth(),
          west: b.getWest(),
          east: b.getEast(),
        });
      }
    },
    zoomend() {
      const z = map.getZoom();
      if (onZoomChange) onZoomChange(z);
      if (onBoundsChange) {
        const b = map.getBounds();
        onBoundsChange({
          south: b.getSouth(),
          north: b.getNorth(),
          west: b.getWest(),
          east: b.getEast(),
        });
      }
    }
  });

  useEffect(() => {
    if (onZoomChange) onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapView({ measurements, selectedCarrier, setSelectedCarrier, selectedTowerNode, onSelectTowerNode, onMapClick, onBoundsChange, center }) {
  const [mapType, setMapType] = useState('dark');
  const [zoomLevel, setZoomLevel] = useState(14);

  const handleZoomChange = useCallback((z) => {
    setZoomLevel(z);
  }, []);

  const filteredMeasurements = selectedCarrier === 'All'
    ? measurements
    : measurements.filter(m => m.carrier && m.carrier.toLowerCase() === selectedCarrier.toLowerCase());

  const showMarkers = zoomLevel >= MIN_MARKER_ZOOM;

  const tileUrls = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    google: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
  };

  return (
    <div className="glass-panel map-card">
      <div className="map-header">
        <div className="map-title">
          <Signal size={18} color="#3b82f6" />
          Interactive Coverage Map
          {showMarkers ? (
            <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: 8 }}>
              ({filteredMeasurements.length} cell nodes visible)
            </span>
          ) : (
            <span style={{ fontSize: '0.78rem', color: '#f59e0b', marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ZoomIn size={13} /> Zoom in to inspect cell towers (Zoom: {zoomLevel} / Min: {MIN_MARKER_ZOOM})
            </span>
          )}
        </div>

        <div className="carrier-filter-group">
          {['All', 'Jio', 'Airtel', 'Vi', 'BSNL'].map((carrier) => (
            <button
              key={carrier}
              className={`filter-btn ${selectedCarrier === carrier ? 'active' : ''}`}
              onClick={() => setSelectedCarrier(carrier)}
            >
              {carrier}
            </button>
          ))}
          <button
            className="filter-btn"
            style={{ marginLeft: 6 }}
            onClick={() => setMapType(prev => prev === 'dark' ? 'google' : prev === 'google' ? 'satellite' : 'dark')}
            title="Toggle Map Style"
          >
            <Layers size={13} style={{ display: 'inline', marginRight: 3 }} />
            {mapType.toUpperCase()}
          </button>
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; CARTO & OpenStreetMap'
            url={tileUrls[mapType]}
          />
          
          <MapRecenter center={center} />
          <MapEventsHandler onBoundsChange={onBoundsChange} onZoomChange={handleZoomChange} />
          <MapClickHandler onMapClick={onMapClick} />

          {showMarkers && filteredMeasurements.map((m) => {
            const isSelected = selectedTowerNode && (selectedTowerNode.id === m.id || (selectedTowerNode.lat === m.lat && selectedTowerNode.lng === m.lng));

            return (
              <Marker
                key={m.id || `${m.lat}-${m.lng}-${m.carrier}`}
                position={[m.lat, m.lng]}
                icon={createCustomMarker(m.signal, m.carrier, isSelected)}
                evented={true}
                eventHandlers={{
                  click: () => onSelectTowerNode(m)
                }}
              >
                {/* Instant Hover Tooltip */}
                <Tooltip direction="top" offset={[0, -16]} opacity={0.96} sticky={true}>
                  <div style={{ padding: '2px 4px', fontSize: '0.8rem', color: '#f8fafc', lineHeight: '1.4' }}>
                    <div style={{ fontWeight: '700', color: '#38bdf8', marginBottom: '2px' }}>
                      {m.carrier} Tower Node ({m.band || '5G/LTE'})
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8' }}>Signal: </span>
                      <strong style={{ color: getSignalColor(m.signal) }}>{formatSignal(m.signal)}</strong>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                      Speed: {formatSpeed(m.speed)} &bull; Latency: {m.ping || 22}ms
                    </div>
                  </div>
                </Tooltip>

                {/* Click Popup Details */}
                <Popup>
                  <div style={{ padding: '4px', minWidth: '190px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#38bdf8' }}>
                        {m.carrier} Network Node
                      </span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(59,130,246,0.2)', color: '#38bdf8', fontWeight: '600' }}>
                        {m.band || 'LTE/5G'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>RSRP Signal:</span>
                        <strong style={{ color: getSignalColor(m.signal) }}>{formatSignal(m.signal)}</strong>
                      </div>
                      {m.rsrq !== undefined && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#94a3b8' }}>RSRQ / SINR:</span>
                          <span>{m.rsrq} dB / {m.sinr || 15} dB</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Download Speed:</span>
                        <strong>{formatSpeed(m.speed)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Latency Ping:</span>
                        <span>{m.ping || 24} ms</span>
                      </div>
                      {m.eNodeB && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                          <span>eNodeB / Cell ID:</span>
                          <span style={{ fontFamily: 'monospace' }}>{m.eNodeB} / {m.cellId}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600' }}>
                      ⚡ Node selected: AI prediction updated
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
