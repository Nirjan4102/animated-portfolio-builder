import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Menu, X, LogOut, Layout, UserPlus, LogIn } from 'lucide-react';

export default function Navbar() {
  const [session, setSession] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="glass-panel" style={{ 
        position: 'fixed', 
        top: '1rem', 
        left: '1rem', 
        right: '1rem', 
        zIndex: 100, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.75rem 1.5rem',
        backdropFilter: 'blur(25px)'
      }}>
        <Link to="/" onClick={() => setIsOpen(false)} style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
          Port<span className="text-gradient">Builder</span>
        </Link>

        {/* Desktop Menu */}
        <div className="mobile-hide" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
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

        {/* Mobile Toggle */}
        <button 
          className="flex-center" 
          onClick={() => setIsOpen(!isOpen)} 
          style={{ display: 'none', padding: '0.5rem', color: 'var(--text-primary)' }}
          id="mobile-menu-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <style>{`
          @media (max-width: 768px) {
            #mobile-menu-toggle { display: flex !important; }
          }
        `}</style>
      </nav>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="animate-fade-in" style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 99, 
          background: 'rgba(3, 7, 18, 0.95)', 
          padding: '8rem 2rem 2rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {session ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex-center" style={{ gap: '1rem', fontSize: '1.5rem' }}>
                <Layout size={24} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-outline flex-center" style={{ gap: '1rem', color: '#ef4444', borderColor: '#ef4444', fontSize: '1.2rem', padding: '1rem' }}>
                <LogOut size={24} /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="flex-center" style={{ gap: '1rem', fontSize: '1.5rem' }}>
                <LogIn size={24} /> Log In
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="btn-primary flex-center" style={{ gap: '1rem', fontSize: '1.5rem', padding: '1rem' }}>
                <UserPlus size={24} /> Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
