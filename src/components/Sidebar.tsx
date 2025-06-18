import React, { useState } from 'react';
import { cities } from '../data/city';

type Props = {
 onSelect: (city: any) => void;
};

const Sidebar: React.FC<Props> = ({ onSelect }) => {
  const [query, setQuery] = useState('');

  const filtered = cities.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', color: 'black', background: '#f4f4f4'}}>
        <div>

      <input
        placeholder="Search city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', background: 'none', border: '1px solid gray', borderRadius: '5px' }}
      />
        </div>
      <ul>
        {filtered.map((city) => (
          <li
            key={city.name}
           onClick={() => onSelect(city)}
            style={{ cursor: 'pointer', margin: '10px 0' }}
          >
            {city.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
