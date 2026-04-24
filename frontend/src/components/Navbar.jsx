import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="glass-panel" style={{ 
      position: 'fixed', 
      top: '1rem', 
      left: '1rem', 
      right: '1rem', 
      zIndex: 100, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem' 
    }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
        Port<span className="text-gradient">Builder</span>
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/login" style={{ fontWeight: '500' }}>Log In</Link>
        <Link to="/signup" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Sign Up</Link>
      </div>
    </nav>
  );
}
