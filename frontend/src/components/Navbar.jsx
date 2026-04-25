import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Navbar() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

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
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {session ? (
          <>
            <Link to="/dashboard" style={{ fontWeight: '500' }}>Dashboard</Link>
            <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.5rem 1.25rem', color: '#ef4444', borderColor: '#ef4444' }}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontWeight: '500' }}>Log In</Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
