import React, { useEffect, useState } from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import '../styles/colors.css';

const Searchbar = ({ onSearch, onQueryChange }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
    onQueryChange?.(value); 
  };

  return (
    <div
      className="p-2 bg-white shadow rounded-3 w-100"
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '60%' }}>
        <FloatingLabel label="Search">
          <Form.Control
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleChange}
          />
        </FloatingLabel>
      </div>
    </div>
  );
};

export default Searchbar;
