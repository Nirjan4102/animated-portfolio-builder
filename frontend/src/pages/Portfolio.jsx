import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Mail, Phone, Link as LinkIcon, Star, Code, ArrowRight, Download } from 'lucide-react';

export default function Portfolio() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/portfolio/${username}`)
      .then(res => res.ok ? res.json() : null).then(setData).catch(console.error).finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="flex-center" style={{ minHeight: '100vh', fontSize: '2rem' }}>Loading...</div>;
  if (!data) return <div className="flex-center" style={{ minHeight: '100vh', fontSize: '2rem' }}>Portfolio Not Found</div>;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      
      {/* Background Blobs */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="bg-blob blob-1"></div><div className="bg-blob blob-2"></div><div className="bg-blob blob-3"></div>
      </div>

      {/* 1. Hero Section */}
      <motion.section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 2rem 1.5rem', zIndex: 1 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
            style={{ margin: '0 auto 2.5rem auto', width: '220px', height: '220px', borderRadius: '50%', padding: '5px', background: 'var(--gradient-brand)', boxShadow: '0 0 60px rgba(139, 92, 246, 0.4)' }}>
            {data.profilePicture ? (
              <img src={data.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center', border: '5px solid var(--bg-base)' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', color: 'white', border: '5px solid var(--bg-base)' }}>{data.fullName.charAt(0)}</div>
            )}
          </motion.div>
          
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: '5.5rem', marginBottom: '0.5rem', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            {data.fullName}
          </motion.h1>
          
          {data.tagline && (
            <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} style={{ fontSize: '2rem', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)', fontWeight: 400, marginBottom: '2rem' }}>
              {data.tagline}
            </motion.h2>
          )}

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 3.5rem auto', lineHeight: '1.8' }}>
            {data.aboutMe}
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex-center" style={{ gap: '1.5rem', flexWrap: 'wrap' }}>
            {data.resumeLink && (
              <a href={data.resumeLink} download="Resume" className="btn-primary flex-center" style={{ gap: '0.75rem', padding: '1.25rem 2.5rem', fontSize: '1.1rem' }}>
                <Download size={22} /> Download Resume
              </a>
            )}
            {data.contact?.showEmail && data.contact.email && (
              <a href={`mailto:${data.contact.email}`} className="btn-outline flex-center" style={{ gap: '0.75rem', padding: '1.25rem 2.5rem', fontSize: '1.1rem' }}>
                <Mail size={22} /> Contact Me
              </a>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* 2. Skills Marquee */}
      {data.showSkills && data.skills?.length > 0 && (
        <section style={{ padding: '6rem 0', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden', zIndex: 1, position: 'relative' }}>
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 25 }} style={{ display: 'flex', gap: '5rem', whiteSpace: 'nowrap', width: 'fit-content' }}>
            {[...data.skills, ...data.skills, ...data.skills].map((skill, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '2.5rem', fontWeight: '900', fontFamily: 'var(--font-display)', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
                <Star size={28} color="var(--accent-primary)" /> {skill}
              </div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 3. Journey (Experience) */}
      {data.showJourney && data.journey?.length > 0 && (
        <section style={{ padding: '8rem 1.5rem', zIndex: 1, position: 'relative' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: '3.5rem', marginBottom: '4rem', textAlign: 'center' }}>Professional <span className="text-gradient">Journey</span></motion.h2>
            <div style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '3rem', marginLeft: '1rem' }}>
              {data.journey.map((item, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: idx * 0.1 }} style={{ position: 'relative', marginBottom: '4rem' }}>
                  <div style={{ position: 'absolute', left: '-3.7rem', top: '0.5rem', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-primary)', border: '4px solid var(--bg-base)', boxShadow: '0 0 20px var(--accent-glow)' }}></div>
                  <h3 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '0.5rem', fontWeight: 800 }}>{item.year}</h3>
                  <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{item.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Projects */}
      {data.projects?.length > 0 && (
        <section style={{ padding: '8rem 1.5rem', background: 'rgba(0,0,0,0.2)', zIndex: 1, position: 'relative' }}>
          <div className="container">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: '4rem', marginBottom: '5rem', textAlign: 'center' }}>Featured <span className="text-gradient">Work</span></motion.h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
              {data.projects.map((proj, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} whileHover={{ y: -15, scale: 1.02 }} transition={{ type: 'spring' }} className="glass-panel" style={{ padding: 0, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {proj.image ? (
                    <div style={{ width: '100%', height: '250px', overflow: 'hidden', borderBottom: '1px solid var(--glass-border)' }}>
                      <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: '8px', background: 'var(--gradient-brand)' }}></div>
                  )}
                  <div style={{ padding: '3rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: 'white' }}>{proj.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.15rem', lineHeight: '1.7', flexGrow: 1 }}>{proj.description}</p>
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="btn-outline flex-center" style={{ gap: '0.75rem', alignSelf: 'start', padding: '1rem 2rem' }}>View Live <ArrowRight size={18} /></a>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Certificates */}
      {data.certificates?.length > 0 && (
        <section style={{ padding: '8rem 1.5rem', zIndex: 1, position: 'relative' }}>
          <div className="container">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: '3.5rem', marginBottom: '4rem', textAlign: 'center' }}>Licenses & <span className="text-gradient">Certifications</span></motion.h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              {data.certificates.map((cert, idx) => cert.image && (
                <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} whileHover={{ scale: 1.05 }} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ width: '100%', height: '220px', overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    <img src={cert.image} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: 'white' }}>{cert.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Footer (Contact & Socials) */}
      <section style={{ padding: '6rem 1.5rem', background: 'rgba(0,0,0,0.6)', borderTop: '1px solid var(--glass-border)', textAlign: 'center', zIndex: 1, position: 'relative' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Let's Create <span className="text-gradient">Something Amazing</span></h2>
        <div className="flex-center" style={{ gap: '2rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
          {data.contact?.showPhone && data.contact.phone && (
            <a href={`tel:${data.contact.phone}`} className="btn-outline flex-center" style={{ gap: '0.75rem', border: 'none', background: 'rgba(255,255,255,0.05)' }}><Phone size={20} /> {data.contact.phone}</a>
          )}
          {data.socials?.map((social, idx) => social.platform && social.url && (
            <a key={idx} href={social.url} target="_blank" rel="noreferrer" className="btn-outline flex-center" style={{ gap: '0.75rem', border: 'none', background: 'rgba(255,255,255,0.05)' }}>
              <LinkIcon size={20} /> {social.platform}
            </a>
          ))}
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>© {new Date().getFullYear()} {data.fullName}. Created by Nirjan Mondal. All rights reserved.</p>
      </section>
    </div>
  );
}
