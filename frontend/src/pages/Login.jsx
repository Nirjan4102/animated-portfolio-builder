import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient';
import { Mail, Key, User, ArrowRight, RefreshCw, CheckCircle } from 'lucide-react';

export default function Login({ isSignup }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const startTimer = () => {
    setCanResend(false);
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: isSignup ? { username } : {},
          shouldCreateUser: isSignup,
        }
      });
      if (error) throw error;
      setShowOtpInput(true);
      setOtp('');
      startTimer();
      alert('OTP sent! Please check your email.');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'magiclink'
      });
      if (error) throw error;
      if (data.session) {
        navigate('/dashboard');
      }
    } catch (error) {
      alert('Verification failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setShowOtpInput(false);
    setOtp('');
  };

  return (
    <div>
      <Navbar />
      <div className="container flex-center animate-fade-in" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '5rem', paddingBottom: '2rem' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}>
            {showOtpInput ? 'Verify OTP' : (isSignup ? 'Create Account' : 'Welcome Back')}
          </h2>
          
          {!showOtpInput ? (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {isSignup && (
                <div>
                  <label className="input-label" htmlFor="username">Unique Username</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                      type="text" 
                      id="username" 
                      className="input-field" 
                      style={{ paddingLeft: '2.8rem' }}
                      placeholder="e.g. johndoe" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="input-label" htmlFor="email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="email" 
                    id="email" 
                    className="input-field" 
                    style={{ paddingLeft: '2.8rem' }}
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              
              <button type="submit" className="btn-primary flex-center" style={{ marginTop: '1rem', width: '100%', gap: '0.5rem' }} disabled={loading}>
                {loading ? <RefreshCw className="animate-spin" size={20} /> : (isSignup ? 'Sign Up with OTP' : 'Send Login OTP')}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="input-label" htmlFor="otp">6-Digit Code</label>
                <div style={{ position: 'relative' }}>
                  <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="text" 
                    id="otp" 
                    className="input-field" 
                    style={{ paddingLeft: '2.8rem', letterSpacing: 'clamp(0.2rem, 3vw, 0.5rem)', textAlign: 'center', fontSize: '1.2rem' }}
                    placeholder="000000" 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required 
                  />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
                  Code sent to <strong>{email}</strong>
                </p>
              </div>
              
              <button type="submit" className="btn-primary flex-center" style={{ marginTop: '1rem', width: '100%', gap: '0.5rem' }} disabled={loading}>
                {loading ? <RefreshCw className="animate-spin" size={20} /> : 'Verify & Continue'}
                {!loading && <CheckCircle size={20} />}
              </button>
              
              <div className="mobile-flex-col" style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button" 
                  onClick={handleBackToEmail} 
                  className="btn-outline" 
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.75rem' }}
                >
                  Change Email
                </button>
                <button 
                  type="button" 
                  onClick={() => handleSendOtp()} 
                  className="btn-outline" 
                  disabled={!canResend || loading}
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.75rem', opacity: canResend ? 1 : 0.5 }}
                >
                  {canResend ? 'Resend' : `Resend in ${timer}s`}
                </button>
              </div>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link to={isSignup ? '/login' : '/signup'} onClick={handleBackToEmail} style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
              {isSignup ? 'Log In' : 'Sign Up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
