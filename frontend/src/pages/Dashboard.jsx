import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MapView from '../components/MapView';
import CarrierRanking from '../components/CarrierRanking';
import PredictionPanel from '../components/PredictionPanel';
import CarrierComparison from '../components/CarrierComparison';
import { fetchMeasurements, fetchCarriers, fetchPrediction, checkHealth } from '../services/api';

export default function Dashboard({ user, onLogout }) {
  const [searchLocation, setSearchLocation] = useState('Kota Junction');
  const [center, setCenter] = useState({ lat: 25.181, lng: 75.839 });
  const [measurements, setMeasurements] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [selectedCarrier, setSelectedCarrier] = useState('All');
  const [prediction, setPrediction] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Initial load
  useEffect(() => {
    async function loadData() {
      const health = await checkHealth();
      setBackendConnected(health.connected);

      const [mList, cList] = await Promise.all([
        fetchMeasurements(),
        fetchCarriers()
      ]);
      setMeasurements(mList);
      setCarriers(cList);

      // Initial prediction for default location
      handleMapClick(25.181, 75.839);
    }
    loadData();
  }, []);


  const handleMapClick = async (lat, lng) => {
    setPredictLoading(true);
    setCenter({ lat, lng });
    try {
      const pred = await fetchPrediction(lat, lng);
      setPrediction(pred);
    } catch (err) {
      console.error('Failed to get prediction:', err);
    } finally {
      setPredictLoading(false);
    }
  };

  const handleSelectLocation = (loc) => {
    setCenter({ lat: loc.lat, lng: loc.lng });
    handleMapClick(loc.lat, loc.lng);
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <Header activeCarrierCount={carriers.length} backendConnected={backendConnected} user={user} onLogout={onLogout} />


      {/* Location Search Bar */}
      <SearchBar
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        onSelectLocation={handleSelectLocation}
      />

      {/* Main Dashboard Split Grid */}
      <div className="dashboard-grid">
        {/* Left Main Column: Interactive Map */}
        <div className="left-column">
          <MapView
            measurements={measurements}
            selectedCarrier={selectedCarrier}
            setSelectedCarrier={setSelectedCarrier}
            onMapClick={handleMapClick}
            center={center}
          />
        </div>

        {/* Right Sidebar Column: Carrier Leaderboard & AI Prediction UI */}
        <div className="right-column">
          {/* Best Network Leaderboard */}
          <CarrierRanking carriers={carriers} />

          {/* AI Connectivity Prediction Card */}
          <PredictionPanel prediction={prediction} loading={predictLoading} />
        </div>
      </div>

      {/* Bottom Section: Full Multi-Carrier Metrics Comparison */}
      <CarrierComparison carriers={carriers} />
    </div>
  );
}
