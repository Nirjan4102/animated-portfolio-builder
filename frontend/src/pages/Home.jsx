import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, Globe, ArrowRight, Star, CheckCircle, Smartphone, Rocket } from 'lucide-react';
import Navbar from '../components/Navbar';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-panel card-premium" 
    style={{ padding: '2.5rem', textAlign: 'left' }}
  >
    <div style={{ 
      width: '60px', height: '60px', borderRadius: '15px', 
      background: 'var(--gradient-brand)', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' 
    }}>
      <Icon size={30} color="white" />
    </div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{description}</p>
  </motion.div>
);

export default function Home() {
  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '6rem' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div className="bg-blob blob-1"></div>
          <div className="bg-blob blob-2"></div>
          <div className="bg-blob blob-3"></div>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '2rem' }}>
              <span style={{ padding: '0.5rem 1.25rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--accent-primary)', borderRadius: 'var(--radius-full)', color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: '600' }}>
                🚀 The Future of Personal Branding
              </span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
              Create a <span className="text-gradient">Premium</span> Portfolio <br /> That Actually Works.
            </h1>
            
            <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 3.5rem auto', lineHeight: '1.8' }}>
              Stop using generic templates. Build an immersive, animated, and high-conversion 
              personal website that showcases your talent to the world in minutes.
            </p>

            <div className="flex-center" style={{ gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn-primary flex-center" style={{ gap: '0.75rem', padding: '1.25rem 3rem', fontSize: '1.2rem' }}>
                Start Building Free <ArrowRight size={22} />
              </Link>
              <Link to="/login" className="btn-outline" style={{ padding: '1.25rem 3rem', fontSize: '1.2rem' }}>
                Sign In
              </Link>
            </div>

            <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center', gap: '3rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <div className="flex-center" style={{ gap: '0.5rem' }}><CheckCircle size={16} color="#10b981" /> No coding required</div>
              <div className="flex-center" style={{ gap: '0.5rem' }}><CheckCircle size={16} color="#10b981" /> Custom public URL</div>
              <div className="flex-center" style={{ gap: '0.5rem' }}><CheckCircle size={16} color="#10b981" /> SEO Optimized</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '10rem 0', background: 'rgba(0,0,0,0.3)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Powering Your <span className="text-gradient">Online Presence</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Everything you need to stand out in the digital crowd.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            <FeatureCard 
              icon={Zap} 
              title="Ultra Fast" 
              description="Optimized for performance and SEO. Your portfolio loads instantly on any device worldwide."
            />
            <FeatureCard 
              icon={Shield} 
              title="Secure by Design" 
              description="Powered by Supabase Auth and Database. Your personal data is encrypted and protected."
            />
            <FeatureCard 
              icon={Globe} 
              title="Public URL" 
              description="Get a clean, professional link to share with recruiters and clients: builder.com/you."
            />
            <FeatureCard 
              icon={Star} 
              title="Premium Aesthetics" 
              description="Modern glassmorphism, fluid animations, and high-end typography out of the box."
            />
            <FeatureCard 
              icon={Smartphone} 
              title="Mobile First" 
              description="Responsive layouts that look stunning on iPhones, Androids, and tablets alike."
            />
            <FeatureCard 
              icon={Rocket} 
              title="Instant Publish" 
              description="Make changes and see them live instantly. No build times, no deployment wait."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '10rem 0' }}>
        <div className="container">
          <div className="glass-panel" style={{ padding: '5rem', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', opacity: 0.2, pointerEvents: 'none' }}></div>
            
            <h2 style={{ fontSize: '3rem', marginBottom: '4rem' }}>Ready to Launch Your <span className="text-gradient">Career?</span></h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'rgba(255,255,255,0.1)', marginBottom: '-2rem' }}>01</div>
                <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Create Account</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Sign up in seconds and choose your unique username.</p>
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'rgba(255,255,255,0.1)', marginBottom: '-2rem' }}>02</div>
                <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Enter Details</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Fill in your projects, skills, and professional journey.</p>
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'rgba(255,255,255,0.1)', marginBottom: '-2rem' }}>03</div>
                <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Go Live</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Click publish and share your professional link with the world.</p>
              </div>
            </div>

            <Link to="/signup" className="btn-primary" style={{ padding: '1.5rem 4rem', fontSize: '1.3rem' }}>
              Build My Portfolio Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 0', textAlign: 'center', borderTop: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
        <p>© {new Date().getFullYear()} PortBuilder Premium. Crafted with passion for creators.</p>
      </footer>
    </div>
  );
}
