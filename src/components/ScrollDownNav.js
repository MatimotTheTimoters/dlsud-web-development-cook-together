import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar'; 

const ScrollDownNav = ({ onSearch }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="scroll-down-nav position-fixed top-0 start-0 w-100"
      style={{
        zIndex: 1050,
        background: 'rgba(255,255,255,0.95)',
        boxShadow: visible ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'transform 0.4s ease, opacity 0.4s ease',
      }}
    >
      <div className="container-fluid d-flex justify-content-center p-2">
        <Searchbar onSearch={onSearch} />
      </div>
    </div>
  );
};

export default ScrollDownNav;
