import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Copy, ExternalLink, CheckCircle, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    tagline: '', // e.g., Senior Full Stack Developer
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
      
      // Fetch portfolio data for this user
      // We assume username is unique and stored in user_metadata or we just find by user_id
      // For now, let's look for a portfolio where user_id matches (we should add user_id to table)
      // OR if we use username from metadata:
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
          // Initialize with username from metadata if no portfolio found
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
      // Parse skills from comma-separated string to array
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
          show_journey: formData.showJourney,
          journey: formData.journey,
          updated_at: new Date()
        }, { onConflict: 'username' });

      if (error) throw error;
      setShowModal(true);
    } catch (error) {
      console.error('Supabase Error:', error);
      alert('Error saving to database: ' + (error.message || error));
    }
  };

  if (loading) return <div className="flex-center" style={{ minHeight: '100vh', fontSize: '2rem' }}>Loading Dashboard...</div>;

  return (
    <div>
      <Navbar />
      <main className="container animate-fade-in" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem' }}>Portfolio Builder</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.user_metadata?.username || 'User'}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleLogout} className="btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}>Logout</button>
            <a href={`/${formData.username}`} target="_blank" rel="noreferrer" className="btn-outline flex-center" style={{ gap: '0.5rem' }}>
              <ExternalLink size={18} /> Preview Live
            </a>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '3rem', marginTop: '2rem' }}>
          
          {/* Section 1: Hero Identity */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800' }}>1</div>
              <h2 style={{ fontSize: '1.8rem' }}>Identity & Hero</h2>
            </div>
            
            <div className="glass-panel card-premium" style={{ padding: '3rem', display: 'grid', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div>
                  <label className="input-label">Public Username (URL)</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                  <label className="input-label">Profile Picture</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <label className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                      Choose Photo
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (res) => setFormData({ ...formData, profilePicture: res }))} style={{ display: 'none' }} />
                    </label>
                    {formData.profilePicture && <img src={formData.profilePicture} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />}
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                  <label className="input-label">Resume / CV (PDF)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <label className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                      Upload CV
                      <input type="file" accept=".pdf" onChange={(e) => handleImageUpload(e, (res) => setFormData({ ...formData, resumeLink: res }))} style={{ display: 'none' }} />
                    </label>
                    {formData.resumeLink && <CheckCircle size={20} color="#10b981" />}
                  </div>
                </div>
              </div>

              <div>
                <label className="input-label">About Me</label>
                <textarea name="aboutMe" className="input-field" rows="4" value={formData.aboutMe} onChange={handleChange} placeholder="Tell your story..." required></textarea>
              </div>
            </div>
          </section>

          {/* Section 2: Contact & Socials */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800' }}>2</div>
              <h2 style={{ fontSize: '1.8rem' }}>Connect & Socials</h2>
            </div>
            
            <div className="glass-panel card-premium" style={{ padding: '3rem', display: 'grid', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <label className="input-label">Email Address</label>
                    <input type="checkbox" name="showEmail" checked={formData.contact.showEmail} onChange={(e) => handleNestedChange(e, 'contact')} />
                  </div>
                  <input type="email" name="email" className="input-field" value={formData.contact.email} onChange={(e) => handleNestedChange(e, 'contact')} placeholder="hello@world.com" />
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <label className="input-label">Phone Number</label>
                    <input type="checkbox" name="showPhone" checked={formData.contact.showPhone} onChange={(e) => handleNestedChange(e, 'contact')} />
                  </div>
                  <input type="tel" name="phone" className="input-field" value={formData.contact.phone} onChange={(e) => handleNestedChange(e, 'contact')} placeholder="+1 234..." />
                </div>
              </div>

              <div>
                <label className="input-label">Social Networks</label>
                {formData.socials.map((social, index) => (
                  <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }} className="animate-fade-in">
                    <input type="text" name="platform" placeholder="e.g. GitHub" className="input-field" style={{ width: '30%' }} value={social.platform} onChange={(e) => handleArrayChange(index, e, 'socials')} />
                    <input type="url" name="url" placeholder="Profile URL" className="input-field" style={{ flexGrow: 1 }} value={social.url} onChange={(e) => handleArrayChange(index, e, 'socials')} />
                    <button type="button" onClick={() => removeArrayItem(index, 'socials')} style={{ color: '#ef4444' }}><Trash2 size={20}/></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('socials', { platform: '', url: '' })} className="btn-outline flex-center" style={{ gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem', marginTop: '1rem' }}><Plus size={16}/> Add Network</button>
              </div>
            </div>
          </section>

          {/* Section 3: Projects */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800' }}>3</div>
              <h2 style={{ fontSize: '1.8rem' }}>Featured Work</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
              {formData.projects.map((proj, index) => (
                <div key={index} className="glass-panel card-premium" style={{ padding: '2rem', display: 'grid', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>Project {index + 1}</h3>
                    <button type="button" onClick={() => removeArrayItem(index, 'projects')} style={{ color: '#ef4444' }}><Trash2 size={18}/></button>
                  </div>
                  <input type="text" name="title" placeholder="Project Title" className="input-field" value={proj.title} onChange={(e) => handleArrayChange(index, e, 'projects')} />
                  <input type="url" name="link" placeholder="Live Demo Link" className="input-field" value={proj.link} onChange={(e) => handleArrayChange(index, e, 'projects')} />
                  <textarea name="description" placeholder="Short description..." className="input-field" rows="3" value={proj.description} onChange={(e) => handleArrayChange(index, e, 'projects')}></textarea>
                  <label className="btn-outline flex-center" style={{ gap: '0.5rem', cursor: 'pointer', padding: '0.75rem' }}>
                    <ImageIcon size={16} /> {proj.image ? 'Change Cover' : 'Upload Cover'}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (res) => {
                      const newProjects = [...formData.projects];
                      newProjects[index].image = res;
                      setFormData({ ...formData, projects: newProjects });
                    })} style={{ display: 'none' }} />
                  </label>
                  {proj.image && <img src={proj.image} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('projects', { title: '', description: '', link: '', image: null })} className="glass-panel flex-center" style={{ minHeight: '300px', border: '2px dashed var(--glass-border)', background: 'transparent', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
                <Plus size={40} />
                <span style={{ fontSize: '1.2rem' }}>Add New Project</span>
              </button>
            </div>
          </section>

          <div style={{ position: 'sticky', bottom: '2rem', zIndex: 10 }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.5rem', fontSize: '1.5rem', boxShadow: '0 20px 50px var(--accent-glow)' }}>
              🚀 Update My Public Portfolio
            </button>
          </div>
        </form>

        {/* Success Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '4rem 3rem', maxWidth: '550px', width: '90%', textAlign: 'center', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: '#10b981', marginBottom: '2rem', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
                <CheckCircle size={40} />
              </div>
              <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Portfolio Live!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your professional digital presence is now accessible worldwide.</p>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '0.5rem', marginBottom: '2.5rem' }}>
                <input type="text" readOnly value={publicLink} style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--accent-primary)', padding: '0.5rem 1rem', outline: 'none', fontSize: '1.1rem' }} />
                <button onClick={handleCopy} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>{copied ? 'Copied!' : 'Copy Link'}</button>
              </div>
              <div className="flex-center" style={{ gap: '1rem' }}>
                <button onClick={() => setShowModal(false)} className="btn-outline" style={{ padding: '1rem 2rem' }}>Close Editor</button>
                <a href={`/${formData.username}`} target="_blank" rel="noreferrer" className="btn-primary flex-center" style={{ gap: '0.5rem', padding: '1rem 2rem' }}>View Live Site <ExternalLink size={18} /></a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
