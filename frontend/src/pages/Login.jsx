import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Login({ isSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Only for signup
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement Supabase Auth
    console.log('Form submitted:', { email, password, username });
    navigate('/dashboard'); // Mock redirect
  };

  return (
    <div>
      <Navbar />
      <div className="container flex-center animate-fade-in" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '4rem' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {isSignup && (
              <div>
                <label className="input-label" htmlFor="username">Unique Username</label>
                <input 
                  type="text" 
                  id="username" 
                  className="input-field" 
                  placeholder="e.g. johndoe" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
            )}
            <div>
              <label className="input-label" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="input-field" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div>
              <label className="input-label" htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
              {isSignup ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link to={isSignup ? '/login' : '/signup'} style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
              {isSignup ? 'Log In' : 'Sign Up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
