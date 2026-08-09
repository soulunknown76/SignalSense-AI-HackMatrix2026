import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Loader2, X, Building, Radio, Compass } from 'lucide-react';

const PRESET_LOCATIONS = [
  { name: 'Rajeev Gandhi Nagar', lat: 25.148, lng: 75.845 },
  { name: 'Landmark City', lat: 25.202, lng: 75.828 },
  { name: 'Talwandi', lat: 25.158, lng: 75.832 },
  { name: 'Vigyan Nagar', lat: 25.162, lng: 75.848 },
  { name: 'Connaught Place', lat: 28.6315, lng: 77.2167 },
  { name: 'BKC Mumbai', lat: 19.0600, lng: 72.8680 }
];

export default function SearchBar({ searchLocation, setSearchLocation, onSelectLocation }) {
  const [query, setQuery] = useState(searchLocation || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [geoLocating, setGeoLocating] = useState(false);
  
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (searchLocation && searchLocation !== query) {
      setQuery(searchLocation);
    }
  }, [searchLocation]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = (text) => {
    if (!text || text.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            text
          )}&addressdetails=1&limit=8`,
          {
            headers: {
              'Accept-Language': 'en',
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowDropdown(data.length > 0);
          setSelectedIndex(-1);
        }
      } catch (err) {
        console.warn('Geocoding search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSearchLocation(val);
    fetchSuggestions(val);
  };

  const handleSelectSuggestion = (item) => {
    const address = item.address || {};
    const subLocality = address.neighbourhood || address.suburb || address.quarter || address.residential || address.village || address.city_district || item.display_name.split(',')[0];
    const city = address.city || address.town || address.county || address.state_district || '';
    const state = address.state || address.country || '';
    const postcode = address.postcode ? ` (${address.postcode})` : '';

    const fullLocName = `${subLocality}${postcode}, ${city ? city + ', ' : ''}${state}`;
    
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);

    setQuery(subLocality);
    setSearchLocation(subLocality);
    setShowDropdown(false);
    setSuggestions([]);
    setSelectedIndex(-1);

    onSelectLocation({
      name: fullLocName,
      lat,
      lng,
    });
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearchSubmit(e);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else {
        handleSearchSubmit(e);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowDropdown(false);

    if (suggestions.length > 0) {
      const target = selectedIndex >= 0 ? suggestions[selectedIndex] : suggestions[0];
      handleSelectSuggestion(target);
      return;
    }

    const coordsMatch = query.match(/^([-+]?\d{1,2}\.\d+),\s*([-+]?\d{1,3}\.\d+)$/);
    if (coordsMatch) {
      const lat = parseFloat(coordsMatch[1]);
      const lng = parseFloat(coordsMatch[2]);
      onSelectLocation({ name: `Target (${lat.toFixed(3)}, ${lng.toFixed(3)})`, lat, lng });
      return;
    }

    if (query.trim().length >= 2) {
      fetchSuggestions(query);
    }
  };

  const handlePresetSelect = (loc) => {
    setQuery(loc.name);
    setSearchLocation(loc.name);
    setShowDropdown(false);
    onSelectLocation(loc);
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setGeoLocating(false);
        setQuery('My GPS Location');
        setSearchLocation('My GPS Location');
        onSelectLocation({
          name: 'My GPS Location',
          lat,
          lng,
        });
      },
      (err) => {
        setGeoLocating(false);
        alert(`Unable to retrieve location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleClearInput = () => {
    setQuery('');
    setSearchLocation('');
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const getCategoryBadge = (item) => {
    const type = item.type || item.class || '';
    if (type === 'neighbourhood' || type === 'suburb' || type === 'quarter' || type === 'residential') return { label: 'Area', color: '#ffffff' };
    if (type === 'city' || type === 'administrative' || type === 'town') return { label: 'City', color: '#e4e4e7' };
    if (type === 'communication' || type === 'mast' || type === 'telecom') return { label: 'Tower', color: '#ffffff' };
    return { label: 'Place', color: '#a1a1aa' };
  };

  return (
    <div className="glass-panel search-container" ref={dropdownRef} style={{ position: 'relative', zIndex: 1000 }}>
      <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
        <Search className="search-icon" size={16} />
        <input
          type="text"
          className="search-input"
          placeholder="Search any small area, locality, landmark, or tower ID... (e.g. Rajeev Gandhi Nagar, Landmark City, BKC)"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
        />
        
        {loading && <Loader2 className="animate-spin" size={15} style={{ position: 'absolute', right: 75, color: '#ffffff' }} />}
        
        {query && (
          <button
            type="button"
            onClick={handleClearInput}
            style={{
              position: 'absolute',
              right: 62,
              background: 'none',
              border: 'none',
              color: '#71717a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={15} />
          </button>
        )}

        <button type="submit" className="search-submit-btn">
          Search
        </button>
      </form>

      {/* GPS Button */}
      <button
        type="button"
        className="location-chip"
        onClick={handleMyLocation}
        disabled={geoLocating}
        title="Use my GPS location"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: '#ffffff',
          color: '#000000',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        {geoLocating ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
        {geoLocating ? 'Locating...' : 'GPS'}
      </button>

      {/* Local Area Preset Chips */}
      <div className="location-chip-group">
        {PRESET_LOCATIONS.map((loc) => (
          <button
            key={loc.name}
            type="button"
            className={`location-chip ${query === loc.name ? 'active' : ''}`}
            onClick={() => handlePresetSelect(loc)}
          >
            <MapPin size={11} style={{ marginRight: 3 }} />
            {loc.name}
          </button>
        ))}
      </div>

      {/* Dropdown Suggestions Menu */}
      {showDropdown && suggestions.length > 0 && (
        <div className="search-dropdown-menu">
          {suggestions.map((item, idx) => {
            const category = getCategoryBadge(item);
            const isHighlighted = idx === selectedIndex;
            const address = item.address || {};
            const subLocality = address.neighbourhood || address.suburb || address.quarter || address.residential || address.village || item.display_name.split(',')[0];
            const detailText = item.display_name;

            return (
              <div
                key={item.place_id || idx}
                className={`search-suggestion-item ${isHighlighted ? 'highlighted' : ''}`}
                onClick={() => handleSelectSuggestion(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                  <Compass size={15} color="#ffffff" style={{ flexShrink: 0 }} />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {subLocality}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#a1a1aa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {detailText}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span className="search-cat-badge">
                    {category.label}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#71717a', fontFamily: 'monospace' }}>
                    {parseFloat(item.lat).toFixed(3)}, {parseFloat(item.lon).toFixed(3)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
