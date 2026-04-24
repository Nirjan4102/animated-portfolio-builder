import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="container animate-fade-in" style={{ paddingTop: '8rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
          Build Your <span className="text-gradient">Premium</span> Portfolio
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          Create, customize, and share a stunning personal website in minutes. 
          Stand out from the crowd with a beautiful, fully responsive design.
        </p>
        <div className="flex-center" style={{ gap: '1rem' }}>
          <Link to="/signup" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Get Started Free
          </Link>
          <Link to="/login" className="btn-outline" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Login
          </Link>
        </div>

        <div className="glass-panel" style={{ marginTop: '5rem', padding: '3rem', borderTop: '1px solid var(--glass-border)' }}>
          <h2 style={{ marginBottom: '2rem' }}>Why Choose Us?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>✨ Dynamic Designs</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Premium, rich aesthetics with glassmorphism and modern typography.</p>
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>🔗 Custom Links</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Get a unique URL instantly: mywebsite.com/username.</p>
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>📱 Fully Responsive</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Looks stunning on desktop, tablet, and mobile automatically.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
