import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ 
        width: '50px', height: '50px', border: '3px solid var(--glass-border)', 
        borderTopColor: 'var(--accent-primary)', borderRadius: '50%', 
        animation: 'spin 1s linear infinite' 
      }}></div>
      <h2 style={{ color: 'var(--text-secondary)' }}>Verifying your account...</h2>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
