# 📡 SignalSense AI

> **AI-Powered Real-Time Cellular Coverage Mapping, RF Telemetry Analytics & Dead-Zone Prediction Engine**  
> *Developed for HackMatrix 2026*

![SignalSense AI Theme](https://img.shields.io/badge/UI%20Theme-Vibrant%20Glassmorphism-3b82f6?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Express%20%7C%20Leaflet-06b6d4?style=for-the-badge)
![Data Source](https://img.shields.io/badge/Data-OpenStreetMap%20Overpass%20API-10b981?style=for-the-badge)

---

## 🌟 Overview

**SignalSense AI** is an advanced web application designed to solve cellular coverage opacity, dead-zone estimation, and carrier benchmarking. By combining **real-time OpenStreetMap Overpass mobile antenna telemetry**, **Inverse Distance Weighting (IDW) spatial RF interpolation**, and **sub-locality geocoding**, SignalSense AI allows users to map cell towers, benchmark carriers, and predict signal dead-zones for any location worldwide.

---

## 🔥 Key Features

- 📡 **Live Real-World Cell Tower Integration**: Queries the OpenStreetMap Overpass API (`node["telecom"="antenna"]`, `node["tower:type"="communication"]`) live to plot real mobile phone towers and antennas.
- 🧠 **IDW Spatial AI RF Engine**: Evaluates Inverse Distance Weighting spatial interpolation to compute Dead-Zone Probability (%), Composite Quality Index (CQI), Spatial Confidence (%), and AI Carrier Recommendations.
- 🔍 **Sub-Locality Geocoding Search**: High-precision location engine that accurately identifies small areas, residential quarters, coaching hubs, and villages (*e.g., Rajeev Gandhi Nagar, Landmark City, Talwandi, Vigyan Nagar, BKC Mumbai, Connaught Place Delhi*).
- ⚡ **Inter-Connected Component Reactivity**: Clicking a carrier anywhere filters the map and updates AI predictions. Clicking a tower pin recenters the map and updates the AI panel with exact `eNodeB ID`, `Cell ID`, `Frequency Band`, `RSRP Signal`, and `Download Speed`.
- 📌 **Fixed Spatial Lattice & Zoom Capping**: 100% deterministic spatial grid ensures tower markers stay locked to fixed geographic coordinates without jumping during zoom. Features automatic threshold capping (`MIN_ZOOM = 13`) to hide markers when zoomed out and prevent clutter.
- 💬 **Instant Hover Info Tooltips**: Hovering over any signal marker on the map displays a floating glass tooltip showing carrier, band, RSRP dBm, speed, and latency ping.
- 🎨 **Vibrant Dark Glassmorphism Design**: High-contrast dark theme (`#0b0f19` canvas, glowing blue/cyan/purple borders, backdrop blur glass panels, and vibrant signal indicators).

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Mapping**: Leaflet + React-Leaflet
- **Styling**: Vanilla CSS3 Glassmorphism System with Design Tokens & CSS Variables
- **Icons**: Lucide React

### Backend
- **Server**: Node.js + Express
- **Spatial AI Engine**: IDW RF Telemetry Interpolation Model
- **External APIs**: 
  - OpenStreetMap Overpass API (`https://overpass-api.de/api/interpreter`)
  - OpenStreetMap Nominatim Geocoding API (`https://nominatim.openstreetmap.org/search`)

### Telecom Metrics Engine
Generates authentic Indian MCC/MNC parameters:
- **Jio**: MCC `405`, MNC `86` (B3 1800MHz, B40 2300MHz, n78 3500MHz 5G)
- **Airtel**: MCC `404`, MNC `45` (B1 2100MHz, B3 1800MHz, n78 3500MHz 5G)
- **Vi**: MCC `404`, MNC `10` (B1 2100MHz, B8 900MHz)
- **BSNL**: MCC `404`, MNC `20` (B8 900MHz 3G/4G Hybrid)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/soulunknown76/SignalSense-AI-HackMatrix2026.git
   cd SignalSense-AI-HackMatrix2026
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   This will launch both the backend API server (`http://localhost:5000`) and the Vite frontend application (`http://localhost:3000`).

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/measurements?lat={lat}&lng={lng}&carrier={carrier}` | Retrieves carrier cell tower node measurements around coordinates |
| `GET` | `/api/prediction?lat={lat}&lng={lng}&carrier={carrier}&nodeId={id}` | Calculates IDW spatial prediction & dead-zone risk |
| `GET` | `/api/carriers?lat={lat}&lng={lng}` | Computes carrier leaderboard benchmarks |
| `GET` | `/api/health` | Backend service health check |

---

## 📸 Platform Preview

- **Interactive Cellular Map**: Real-time Leaflet map displaying carrier tower pins with hover tooltips and selection popups.
- **AI RF Prediction Panel**: Instant dead-zone risk level, CQI score, expected RSRP signal, download speed, and latency ping.
- **Optimal Network Leaderboard**: Dynamic carrier ranking system based on signal strength, speed, and reliability.
- **Telemetry Benchmark Table**: Multi-carrier side-by-side comparative analytics.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
