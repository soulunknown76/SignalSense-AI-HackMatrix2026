import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { getSignalColor, formatSignal, formatSpeed } from '../utils/formatters';
import { Layers, Signal } from 'lucide-react';

// Custom marker generator using L.divIcon
const createCustomMarker = (signal, carrier) => {
  const color = getSignalColor(signal);
  const initial = carrier ? carrier.charAt(0) : 'S';
  
  return L.divIcon({
    className: 'custom-leaflet-marker-wrapper',
    html: `<div class="custom-leaflet-marker" style="background-color: ${color}; box-shadow: 0 0 10px ${color};">
            ${initial}
          </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  });
};

// Component to handle map clicks and trigger AI Prediction
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapView({ measurements, selectedCarrier, setSelectedCarrier, onMapClick, center }) {
  const [mapType, setMapType] = useState('dark');

  const filteredMeasurements = selectedCarrier === 'All'
    ? measurements
    : measurements.filter(m => m.carrier === selectedCarrier);

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
          <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: 8 }}>
            ({filteredMeasurements.length} measurement points)
          </span>
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
            style={{ marginLeft: 8 }}
            onClick={() => setMapType(prev => prev === 'dark' ? 'google' : prev === 'google' ? 'satellite' : 'dark')}
            title="Toggle Map Style (Dark / Google / Satellite)"
          >
            <Layers size={14} style={{ display: 'inline', marginRight: 4 }} />
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
            attribution='&copy; <a href="https://carto.com/">CARTO</a> & Google Maps'
            url={tileUrls[mapType]}
          />
          
          <MapClickHandler onMapClick={onMapClick} />

          {filteredMeasurements.map((m) => (
            <Marker
              key={m.id || `${m.lat}-${m.lng}-${m.carrier}`}
              position={[m.lat, m.lng]}
              icon={createCustomMarker(m.signal, m.carrier)}
              evented={true}
              eventHandlers={{
                click: () => onMapClick(m.lat, m.lng)
              }}
            >
              <Popup>
                <div style={{ padding: '4px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#38bdf8', marginBottom: '4px' }}>
                    {m.carrier} Network Point
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                    <strong>Signal:</strong> {formatSignal(m.signal)} <br />
                    <strong>Speed:</strong> {formatSpeed(m.speed)} <br />
                    <strong>Coordinates:</strong> {m.lat.toFixed(4)}, {m.lng.toFixed(4)}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
                    Click map location for AI prediction
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
