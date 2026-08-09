# SignalSense AI — Frontend Dashboard & AI Map UI

An interactive, AI-powered telecom signal analytics dashboard and dead zone predictor built with **React**, **Vite**, **Leaflet / Google Maps**, and custom glassmorphism styling.

## 📁 Directory Architecture

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx             # Navigation header & live telemetry status
│   │   ├── SearchBar.jsx          # Location search & quick preset chips
│   │   ├── MapView.jsx            # Interactive Leaflet / Google Maps with signal markers
│   │   ├── CarrierRanking.jsx     # "Best Network Here" leaderboard & score badges
│   │   ├── PredictionPanel.jsx    # AI Dead Zone prediction & recommendations
│   │   └── CarrierComparison.jsx  # Multi-carrier telemetry metrics table
│   ├── pages/
│   │   └── Dashboard.jsx          # Master dashboard layout grid
│   ├── services/
│   │   └── api.js                 # Unified API client & offline mock fallback
│   ├── utils/
│   │   └── formatters.js          # Signal thresholds, risk badges, color mappings
│   ├── App.jsx                    # Root application component
│   ├── index.css                  # Modern glassmorphic dark design system
│   └── main.jsx                   # React DOM entry point
├── index.html                     # HTML template with Google Fonts & Leaflet CSS
├── package.json                   # Dependencies and npm scripts
├── vite.config.js                 # Vite server configuration & API proxy setup
└── README.md
```

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Launch Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```

## 🔌 API Integration Surface

The frontend service layer (`src/services/api.js`) connects to backend endpoints:
- `GET /api/measurements` — Telemetry point measurements (lat, lng, carrier, signal, speed).
- `GET /api/carriers` — Carrier leaderboard scores and metrics breakdown.
- `GET /api/heatmap` — Density and signal intensity heatmap dataset.
- `GET /api/prediction?lat={lat}&lng={lng}` — Real-time AI Dead Zone risk and probability score.
- `GET /api/recommendation?lat={lat}&lng={lng}` — Smart carrier recommendation engine.

If the backend server is offline, the frontend seamlessly uses a built-in mock fallback for demo purposes.
