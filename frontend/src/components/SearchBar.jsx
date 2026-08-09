import React from 'react';
import { Search, MapPin } from 'lucide-react';

const PRESET_LOCATIONS = [
  { name: 'Kota Junction', lat: 25.181, lng: 75.839 },
  { name: 'Aerodrome Circle', lat: 25.161, lng: 75.815 },
  { name: 'Civil Lines', lat: 25.192, lng: 75.852 },
  { name: 'Talwandi', lat: 25.168, lng: 75.820 },
  { name: 'Indraprastha Ind. Area', lat: 25.176, lng: 75.848 }
];

export default function SearchBar({ searchLocation, setSearchLocation, onSelectLocation }) {
  const handleSelect = (loc) => {
    setSearchLocation(loc.name);
    onSelectLocation(loc);
  };

  return (
    <div className="glass-panel search-container">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search location or cell tower ID... (e.g. Kota Junction)"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
      </div>

      <div className="location-chip-group">
        {PRESET_LOCATIONS.map((loc) => (
          <button
            key={loc.name}
            className={`location-chip ${searchLocation === loc.name ? 'active' : ''}`}
            onClick={() => handleSelect(loc)}
          >
            <MapPin size={12} style={{ marginRight: 4 }} />
            {loc.name}
          </button>
        ))}
      </div>
    </div>
  );
}
