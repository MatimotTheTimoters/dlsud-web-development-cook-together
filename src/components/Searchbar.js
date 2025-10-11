import React, { useState, useEffect } from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import '../styles/colors.css';

const Searchbar = ({ onSearch, onQueryChange, value }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch?.(val);
    onQueryChange?.(val);
  };

  return (
    <div
      className="p-2 bg-white shadow rounded-3 w-100"
      style={{ display: 'flex', justifyContent: 'center' }}
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
