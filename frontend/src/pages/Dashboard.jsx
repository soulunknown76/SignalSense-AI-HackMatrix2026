import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MapView from '../components/MapView';
import CarrierRanking from '../components/CarrierRanking';
import PredictionPanel from '../components/PredictionPanel';
import CarrierComparison from '../components/CarrierComparison';
import { fetchMeasurements, fetchCarriers, fetchPrediction, checkHealth } from '../services/api';

export default function Dashboard({ user, onLogout }) {
  const [searchLocation, setSearchLocation] = useState('Rajeev Gandhi Nagar');
  const [center, setCenter] = useState({ lat: 25.148, lng: 75.845 });
  const [measurements, setMeasurements] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [selectedCarrier, setSelectedCarrier] = useState('All');
  const [selectedTowerNode, setSelectedTowerNode] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Initial load
  useEffect(() => {
    async function loadData() {
      const health = await checkHealth();
      setBackendConnected(health.connected);

      const [mList, cList, pred] = await Promise.all([
        fetchMeasurements(25.148, 75.845, 'All'),
        fetchCarriers(25.148, 75.845),
        fetchPrediction(25.148, 75.845, 'All', null)
      ]);
      setMeasurements(mList);
      setCarriers(cList);
      setPrediction(pred);
    }
    loadData();
  }, []);

  // Reactive Carrier Selection Handler
  const handleSelectCarrier = async (carrierName) => {
    setSelectedCarrier(carrierName);
    setPredictLoading(true);
    try {
      const pred = await fetchPrediction(center.lat, center.lng, carrierName, selectedTowerNode);
      setPrediction(pred);
    } catch (err) {
      console.error('Failed to update carrier prediction:', err);
    } finally {
      setPredictLoading(false);
    }
  };

  // Reactive Cell Tower Marker Click Handler
  const handleSelectTowerNode = async (node) => {
    if (!node) return;
    setSelectedTowerNode(node);
    setSelectedCarrier(node.carrier);
    setCenter({ lat: node.lat, lng: node.lng });
    setPredictLoading(true);

    try {
      const pred = await fetchPrediction(node.lat, node.lng, node.carrier, node);
      setPrediction(pred);
    } catch (err) {
      console.error('Failed to predict for cell tower node:', err);
    } finally {
      setPredictLoading(false);
    }
  };

  // Reactive Map Bounds Change (Pan / Zoom Everywhere Handler)
  const handleBoundsChange = async (bounds) => {
    try {
      const mList = await fetchMeasurements(center.lat, center.lng, selectedCarrier, bounds);
      setMeasurements(mList);
    } catch (err) {
      console.error('Failed to update grid coverage for bounds:', err);
    }
  };

  // Reactive Map Canvas Click Handler
  const handleMapClick = async (lat, lng) => {
    setSelectedTowerNode(null);
    setCenter({ lat, lng });
    setPredictLoading(true);
    try {
      const pred = await fetchPrediction(lat, lng, selectedCarrier, null);
      setPrediction(pred);
    } catch (err) {
      console.error('Failed to get location prediction:', err);
    } finally {
      setPredictLoading(false);
    }
  };

  // Reactive Search & Location Selection Handler
  const handleSelectLocation = async (loc) => {
    setPredictLoading(true);
    setSelectedTowerNode(null);
    setCenter({ lat: loc.lat, lng: loc.lng });
    setSearchLocation(loc.name);

    try {
      const [mList, cList, pred] = await Promise.all([
        fetchMeasurements(loc.lat, loc.lng, selectedCarrier),
        fetchCarriers(loc.lat, loc.lng),
        fetchPrediction(loc.lat, loc.lng, selectedCarrier, null)
      ]);
      setMeasurements(mList);
      setCarriers(cList);
      setPrediction(pred);
    } catch (err) {
      console.error('Failed to load location data:', err);
    } finally {
      setPredictLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header activeCarrierCount={carriers.length} backendConnected={backendConnected} user={user} onLogout={onLogout} />

      {/* Location Search Bar */}
      <SearchBar
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        onSelectLocation={handleSelectLocation}
      />

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Map View */}
        <div className="left-column">
          <MapView
            measurements={measurements}
            selectedCarrier={selectedCarrier}
            setSelectedCarrier={handleSelectCarrier}
            selectedTowerNode={selectedTowerNode}
            onSelectTowerNode={handleSelectTowerNode}
            onMapClick={handleMapClick}
            onBoundsChange={handleBoundsChange}
            center={center}
          />
        </div>

        {/* Right Sidebar Column: Leaderboard & Prediction Panel */}
        <div className="right-column">
          {/* Best Network Leaderboard */}
          <CarrierRanking
            carriers={carriers}
            selectedCarrier={selectedCarrier}
            onSelectCarrier={handleSelectCarrier}
          />

          {/* AI Connectivity Prediction Panel */}
          <PredictionPanel prediction={prediction} loading={predictLoading} selectedTowerNode={selectedTowerNode} />
        </div>
      </div>

      {/* Bottom Section: Multi-Carrier Telemetry Comparison Table */}
      <CarrierComparison
        carriers={carriers}
        selectedCarrier={selectedCarrier}
        onSelectCarrier={handleSelectCarrier}
      />
    </div>
  );
}
