import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Mail, Phone, Link as LinkIcon, Star, Code, ArrowRight, Download } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Portfolio() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getPortfolio = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('username', username)
          .single();
        
        if (error) throw error;
        
        const formattedData = {
          ...data,
          fullName: data.full_name,
          profilePicture: data.profile_picture,
          resumeLink: data.resume_link,
          aboutMe: data.about_me,
          showSkills: data.show_skills,
          showJourney: data.show_journey,
          contact: data.contact,
          socials: data.socials,
          projects: data.projects,
          certificates: data.certificates,
          journey: data.journey
        };
        
        setData(formattedData);
      } catch (error) {
        console.error('Fetch error:', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    
    getPortfolio();
  }, [username]);

  if (loading) return <div className="flex-center" style={{ minHeight: '100vh', fontSize: '1.5rem' }}>Loading Portfolio...</div>;
  if (!data) return <div className="flex-center" style={{ minHeight: '100vh', fontSize: '1.5rem', textAlign: 'center', padding: '2rem' }}>Portfolio Not Found</div>;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      
      {/* Background Blobs */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="bg-blob blob-1"></div><div className="bg-blob blob-2"></div><div className="bg-blob blob-3"></div>
      </div>

      {/* 1. Hero Section */}
      <motion.section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7rem 1rem 4rem 1rem', zIndex: 1 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
            style={{ margin: '0 auto 2.5rem auto', width: 'clamp(150px, 40vw, 220px)', height: 'clamp(150px, 40vw, 220px)', borderRadius: '50%', padding: '5px', background: 'var(--gradient-brand)', boxShadow: '0 0 60px rgba(139, 92, 246, 0.4)' }}>
            {data.profilePicture ? (
              <img src={data.profilePicture} alt="P" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--bg-base)' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(3rem, 10vw, 6rem)', color: 'white', border: '4px solid var(--bg-base)' }}>{data.fullName.charAt(0)}</div>
            )}
          </motion.div>
          
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 'clamp(2.5rem, 10vw, 5.5rem)', marginBottom: '0.5rem', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            {data.fullName}
          </motion.h1>
          
          {data.tagline && (
            <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)', fontWeight: 400, marginBottom: '2rem' }}>
              {data.tagline}
            </motion.h2>
          )}

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 3rem auto', lineHeight: '1.7' }}>
            {data.aboutMe}
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex-center mobile-flex-col" style={{ gap: '1.5rem', flexWrap: 'wrap' }}>
            {data.resumeLink && (
              <a href={data.resumeLink} download="Resume" className="btn-primary flex-center" style={{ gap: '0.75rem', padding: '1rem 2.5rem' }}>
                <Download size={20} /> Download CV
              </a>
            )}
            {data.contact?.showEmail && data.contact.email && (
              <a href={`mailto:${data.contact.email}`} className="btn-outline flex-center" style={{ gap: '0.75rem', padding: '1rem 2.5rem' }}>
                <Mail size={20} /> Let's Talk
              </a>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* 2. Skills Marquee */}
      {data.showSkills && data.skills?.length > 0 && (
        <section style={{ padding: '4rem 0', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden', zIndex: 1, position: 'relative' }}>
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 30 }} style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', width: 'fit-content' }}>
            {[...data.skills, ...data.skills, ...data.skills, ...data.skills].map((skill, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: '900', fontFamily: 'var(--font-display)', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
                <Star size={24} color="var(--accent-primary)" /> {skill}
              </div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 3. Journey (Experience) */}
      {data.showJourney && data.journey?.length > 0 && (
        <section style={{ padding: '6rem 1rem', zIndex: 1, position: 'relative' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: '3rem', textAlign: 'center' }}>Professional <span className="text-gradient">Timeline</span></motion.h2>
            <div style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: 'clamp(1.5rem, 5vw, 3rem)', marginLeft: '0.5rem' }}>
              {data.journey.map((item, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: idx * 0.1 }} style={{ position: 'relative', marginBottom: '3rem' }}>
                  <div style={{ position: 'absolute', left: 'clamp(-2.45rem, -6.5vw, -3.7rem)', top: '0.4rem', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--accent-primary)', border: '3px solid var(--bg-base)', boxShadow: '0 0 15px var(--accent-glow)' }}></div>
                  <h3 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: 'white', marginBottom: '0.25rem', fontWeight: 800 }}>{item.year}</h3>
                  <p style={{ fontSize: 'clamp(0.95rem, 3vw, 1.2rem)', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{item.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Projects */}
      {data.projects?.length > 0 && (
        <section style={{ padding: '6rem 1rem', background: 'rgba(0,0,0,0.2)', zIndex: 1, position: 'relative' }}>
          <div className="container">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: 'clamp(2.2rem, 7vw, 4rem)', marginBottom: '4rem', textAlign: 'center' }}>Featured <span className="text-gradient">Work</span></motion.h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '2rem' }}>
              {data.projects.map((proj, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} whileHover={{ y: -10 }} transition={{ type: 'spring' }} className="glass-panel" style={{ padding: 0, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {proj.image ? (
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderBottom: '1px solid var(--glass-border)' }}>
                      <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: '5px', background: 'var(--gradient-brand)' }}></div>
                  )}
                  <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'white' }}>{proj.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>{proj.description}</p>
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="btn-outline flex-center" style={{ gap: '0.5rem', alignSelf: 'start', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>View Project <ArrowRight size={16} /></a>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Certificates */}
      {data.certificates?.length > 0 && (
        <section style={{ padding: '6rem 1rem', zIndex: 1, position: 'relative' }}>
          <div className="container">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: '3rem', textAlign: 'center' }}>Licenses & <span className="text-gradient">Certifications</span></motion.h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {data.certificates.map((cert, idx) => cert.image && (
                <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ width: '100%', height: '180px', overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                    <img src={cert.image} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: 'white' }}>{cert.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Footer (Contact & Socials) */}
      <section style={{ padding: '5rem 1rem', background: 'rgba(0,0,0,0.6)', borderTop: '1px solid var(--glass-border)', textAlign: 'center', zIndex: 1, position: 'relative' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', marginBottom: '1.5rem' }}>Let's Create <span className="text-gradient">Something Amazing</span></h2>
        <div className="flex-center" style={{ gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {data.contact?.showPhone && data.contact.phone && (
            <a href={`tel:${data.contact.phone}`} className="btn-outline flex-center" style={{ gap: '0.5rem', border: 'none', background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}><Phone size={18} /> Call Me</a>
          )}
          {data.socials?.map((social, idx) => social.platform && social.url && (
            <a key={idx} href={social.url} target="_blank" rel="noreferrer" className="btn-outline flex-center" style={{ gap: '0.5rem', border: 'none', background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}>
              <LinkIcon size={18} /> {social.platform}
            </a>
          ))}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>© {new Date().getFullYear()} {data.fullName}. Crafted by PortBuilder.</p>
      </section>
    </div>
  );
}
