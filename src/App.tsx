import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import type { City } from './types';

const App: React.FC = () => {
const [selectedCity, setSelectedCity] = useState<City | null>({ name: "Nigeria", lat: 9.0778, lng: 8.6775 });
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <div style={{ background: '#f4f4f4', overflowY: 'auto', position: 'fixed' }}>
        <Sidebar  onSelect={(city) => setSelectedCity(city)} />
      </div>
      <div style={{ flex: 1 }}>
        <MapView city={selectedCity} />
      </div>
    </div>
  );
};

export default App;
