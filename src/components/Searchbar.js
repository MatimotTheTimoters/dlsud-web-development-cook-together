import React, { useEffect, useState } from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import { useLocation } from 'react-router-dom'; // ✅ add this
import '../styles/colors.css';

const Searchbar = ({ onSearch }) => {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation(); 

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200 || query.trim() !== '') {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      setVisible(false);
    };
  }, [query, location.pathname]); 

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div
      className={`search-bar position-fixed top-0 start-50 translate-middle-x p-2 bg-white shadow rounded-3 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        width: '100%',
        zIndex: 1050,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '50%' }}>
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
