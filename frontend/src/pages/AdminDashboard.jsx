import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Users, ExternalLink, Mail, Phone } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container animate-fade-in" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '1200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Users size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>View and manage all registered portfolios on your platform.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: '4rem', fontSize: '1.5rem' }}>Loading user data...</div>
        ) : users.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
            <h2>No users found</h2>
            <p style={{ color: 'var(--text-secondary)' }}>When someone publishes a portfolio, it will appear here.</p>
          </div>
        ) : (
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Profile</th>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Name & Tagline</th>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Contact</th>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Stats</th>
                    <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1.5rem' }}>
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid var(--glass-border)' }}>{user.fullName.charAt(0)}</div>
                        )}
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{user.fullName}</h3>
                        <p style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>{user.tagline || 'No tagline'}</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>/{user.username}</p>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><Mail size={14}/> {user.contact?.email || 'N/A'}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><Phone size={14}/> {user.contact?.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          <span>{user.projects?.length || 0} Projects</span>
                          <span>{user.certificates?.length || 0} Certificates</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                        <a href={`/${user.username}`} target="_blank" rel="noreferrer" className="btn-outline flex-center" style={{ display: 'inline-flex', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                          View Site <ExternalLink size={16} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
