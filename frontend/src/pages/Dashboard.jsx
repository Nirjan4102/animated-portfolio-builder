import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Copy, ExternalLink, CheckCircle, Plus, Trash2, Image as ImageIcon, Layout, Send } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    tagline: '',
    profilePicture: null,
    resumeLink: '',
    aboutMe: '',
    showSkills: true,
    skills: '',
    contact: { showEmail: true, email: '', showPhone: false, phone: '' },
    socials: [{ platform: 'GitHub', url: '' }],
    projects: [{ title: '', description: '', link: '', image: null }],
    certificates: [],
    showJourney: true,
    journey: []
  });
  
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  React.useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);
      
      const userUsername = session.user.user_metadata.username;
      if (userUsername) {
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('username', userUsername)
          .single();
          
        if (data) {
          setFormData({
            username: data.username,
            fullName: data.full_name,
            tagline: data.tagline,
            profilePicture: data.profile_picture,
            resumeLink: data.resume_link,
            aboutMe: data.about_me,
            showSkills: data.show_skills,
            skills: data.skills.join(', '),
            contact: data.contact,
            socials: data.socials,
            projects: data.projects,
            certificates: data.certificates,
            showJourney: data.show_journey,
            journey: data.journey
          });
        } else {
          setFormData(prev => ({ ...prev, username: userUsername }));
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const publicLink = `${window.location.origin}/${formData.username}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleNestedChange = (e, section) => {
    setFormData({ ...formData, [section]: { ...formData[section], [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value } });
  };

  const handleArrayChange = (index, e, section) => {
    const newArray = [...formData[section]];
    newArray[index][e.target.name] = e.target.value;
    setFormData({ ...formData, [section]: newArray });
  };

  const addArrayItem = (section, defaultItem) => setFormData({ ...formData, [section]: [...formData[section], defaultItem] });

  const removeArrayItem = (index, section) => {
    const newArray = [...formData[section]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [section]: newArray });
  };

  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let parsedSkills = formData.skills;
      if (typeof parsedSkills === 'string') {
        parsedSkills = parsedSkills.split(',').map(s => s.trim()).filter(s => s);
      }

      const { data, error } = await supabase
        .from('portfolios')
        .upsert({
          username: formData.username,
          full_name: formData.fullName,
          tagline: formData.tagline,
          profile_picture: formData.profilePicture,
          resume_link: formData.resumeLink,
          about_me: formData.aboutMe,
          show_skills: formData.showSkills,
          skills: parsedSkills,
          contact: formData.contact,
          socials: formData.socials,
          projects: formData.projects,
          certificates: formData.certificates,
          show_journey: formData.show_journey,
          journey: formData.journey,
          updated_at: new Date()
        }, { onConflict: 'username' });

      if (error) throw error;
      setShowModal(true);
    } catch (error) {
      console.error('Supabase Error:', error);
      alert('Error saving: ' + (error.message || error));
    }
  };

  if (loading) return <div className="flex-center" style={{ minHeight: '100vh', fontSize: '1.5rem' }}>Loading Editor...</div>;

  return (
    <div>
      <Navbar />
      <main className="container animate-fade-in" style={{ paddingTop: '7rem', paddingBottom: '6rem', maxWidth: '900px' }}>
        
        {/* Header Section */}
        <div className="mobile-flex-col" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '0.5rem' }}>Portfolio Builder</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Editing: <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>@{formData.username}</span></p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', width: 'auto' }}>
            <a href={`/${formData.username}`} target="_blank" rel="noreferrer" className="btn-outline flex-center" style={{ gap: '0.5rem', padding: '0.75rem 1.25rem' }}>
              <ExternalLink size={18} /> <span className="mobile-hide">Preview</span>
            </a>
            <button onClick={handleLogout} className="btn-outline flex-center" style={{ color: '#ef4444', borderColor: '#ef4444', padding: '0.75rem 1.25rem' }}>
              <Copy size={18} /> <span className="mobile-hide">Logout</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '4rem' }}>
          
          {/* Section 1: Identity */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.9rem' }}>1</div>
              <h2 style={{ fontSize: '1.5rem' }}>Basic Identity</h2>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label className="input-label">Username (URL)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>/</span>
                    <input type="text" name="username" className="input-field" style={{ paddingLeft: '2rem' }} value={formData.username} onChange={handleChange} required />
                  </div>
                </div>
                <div>
                  <label className="input-label">Full Name</label>
                  <input type="text" name="fullName" className="input-field" value={formData.fullName} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <label className="input-label">Professional Tagline</label>
                <input type="text" name="tagline" className="input-field" value={formData.tagline} onChange={handleChange} placeholder="e.g. Senior Full Stack Developer" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <label className="input-label">Profile Photo</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', cursor: 'pointer', flex: 1 }}>
                      Upload
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (res) => setFormData({ ...formData, profilePicture: res }))} style={{ display: 'none' }} />
                    </label>
                    {formData.profilePicture && <img src={formData.profilePicture} alt="P" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <label className="input-label">Resume (PDF)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', cursor: 'pointer', flex: 1 }}>
                      Upload CV
                      <input type="file" accept=".pdf" onChange={(e) => handleImageUpload(e, (res) => setFormData({ ...formData, resumeLink: res }))} style={{ display: 'none' }} />
                    </label>
                    {formData.resumeLink && <CheckCircle size={18} color="#10b981" />}
                  </div>
                </div>
              </div>

              <div>
                <label className="input-label">About Me</label>
                <textarea name="aboutMe" className="input-field" rows="4" value={formData.aboutMe} onChange={handleChange} placeholder="Tell your professional story..." required></textarea>
              </div>
            </div>
          </section>

          {/* Section 2: Connect */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.9rem' }}>2</div>
              <h2 style={{ fontSize: '1.5rem' }}>Connect & Socials</h2>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gap: '2rem' }}>
              <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label className="input-label">Email</label>
                    <input type="checkbox" name="showEmail" checked={formData.contact.showEmail} onChange={(e) => handleNestedChange(e, 'contact')} />
                  </div>
                  <input type="email" name="email" className="input-field" value={formData.contact.email} onChange={(e) => handleNestedChange(e, 'contact')} placeholder="hello@world.com" />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label className="input-label">Phone</label>
                    <input type="checkbox" name="showPhone" checked={formData.contact.showPhone} onChange={(e) => handleNestedChange(e, 'contact')} />
                  </div>
                  <input type="tel" name="phone" className="input-field" value={formData.contact.phone} onChange={(e) => handleNestedChange(e, 'contact')} placeholder="+1 234..." />
                </div>
              </div>

              <div>
                <label className="input-label">Social Networks</label>
                {formData.socials.map((social, index) => (
                  <div key={index} className="mobile-flex-col animate-fade-in" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input type="text" name="platform" placeholder="Platform" className="input-field" style={{ flex: '0 0 120px' }} value={social.platform} onChange={(e) => handleArrayChange(index, e, 'socials')} />
                    <input type="url" name="url" placeholder="URL" className="input-field" style={{ flexGrow: 1 }} value={social.url} onChange={(e) => handleArrayChange(index, e, 'socials')} />
                    <button type="button" onClick={() => removeArrayItem(index, 'socials')} style={{ color: '#ef4444', padding: '0.5rem' }}><Trash2 size={20}/></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('socials', { platform: '', url: '' })} className="btn-outline flex-center" style={{ gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}><Plus size={16}/> Add Link</button>
              </div>
            </div>
          </section>

          {/* Section 3: Projects */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.9rem' }}>3</div>
              <h2 style={{ fontSize: '1.5rem' }}>Projects</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '1.5rem' }}>
              {formData.projects.map((proj, index) => (
                <div key={index} className="glass-panel" style={{ padding: '1.5rem', display: 'grid', gap: '1rem', position: 'relative' }}>
                  <button type="button" onClick={() => removeArrayItem(index, 'projects')} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#ef4444' }}><Trash2 size={18}/></button>
                  <h3 style={{ fontSize: '1.1rem' }}>Project {index + 1}</h3>
                  <input type="text" name="title" placeholder="Title" className="input-field" value={proj.title} onChange={(e) => handleArrayChange(index, e, 'projects')} />
                  <input type="url" name="link" placeholder="Link" className="input-field" value={proj.link} onChange={(e) => handleArrayChange(index, e, 'projects')} />
                  <textarea name="description" placeholder="Description..." className="input-field" rows="2" value={proj.description} onChange={(e) => handleArrayChange(index, e, 'projects')}></textarea>
                  <label className="btn-outline flex-center" style={{ gap: '0.5rem', cursor: 'pointer', padding: '0.5rem' }}>
                    <ImageIcon size={16} /> Cover
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (res) => {
                      const newProjects = [...formData.projects];
                      newProjects[index].image = res;
                      setFormData({ ...formData, projects: newProjects });
                    })} style={{ display: 'none' }} />
                  </label>
                  {proj.image && <img src={proj.image} alt="P" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('projects', { title: '', description: '', link: '', image: null })} className="glass-panel flex-center" style={{ minHeight: '200px', border: '2px dashed var(--glass-border)', background: 'transparent', flexDirection: 'column', gap: '1rem' }}>
                <Plus size={30} /> Add Project
              </button>
            </div>
          </section>

          {/* Sticky Save Button */}
          <div style={{ position: 'sticky', bottom: '1.5rem', zIndex: 10 }}>
            <button type="submit" className="btn-primary flex-center" style={{ width: '100%', padding: '1.25rem', fontSize: '1.2rem', gap: '1rem', boxShadow: '0 10px 40px var(--accent-glow)' }}>
              <Send size={20} /> Update Portfolio
            </button>
          </div>
        </form>

        {/* Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(3,7,18,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem 1.5rem', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
              <CheckCircle size={50} color="#10b981" style={{ marginBottom: '1.5rem' }} />
              <h2 style={{ marginBottom: '0.5rem' }}>Published!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your professional site is now live.</p>
              
              <div className="mobile-flex-col" style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', gap: '0.5rem' }}>
                <input type="text" readOnly value={publicLink} style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--accent-primary)', padding: '0.5rem', fontSize: '0.9rem', width: '100%' }} />
                <button onClick={handleCopy} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', width: 'auto' }}>{copied ? 'Copied' : 'Copy'}</button>
              </div>

              <div className="mobile-flex-col" style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setShowModal(false)} className="btn-outline" style={{ flex: 1 }}>Close</button>
                <a href={`/${formData.username}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1 }}>View Site</a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
