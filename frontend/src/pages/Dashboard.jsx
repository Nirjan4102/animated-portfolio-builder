import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Copy, ExternalLink, CheckCircle, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    username: 'johndoe',
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
  const publicLink = `${window.location.origin}/${formData.username}`;

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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/portfolio`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      if (response.ok) setShowModal(true);
      else alert('Failed to save portfolio');
    } catch (error) {
      console.error(error);
      alert('Error connecting to server');
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container animate-fade-in" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem' }}>Portfolio Builder</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Craft your professional digital presence</p>
          </div>
          <a href={`/${formData.username}`} target="_blank" rel="noreferrer" className="btn-outline flex-center" style={{ gap: '0.5rem' }}>
            <ExternalLink size={18} /> Preview Live
          </a>
        </div>

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '2rem' }}>
          
          {/* Section 1: Hero Identity */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '30px', height: '30px', background: 'var(--gradient-brand)', borderRadius: '50%', textAlign: 'center', color: 'white', lineHeight: '30px', fontSize: '1rem' }}>1</span>
              Identity & Hero Section
            </h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label className="input-label">Public Username (URL)</label>
                  <input type="text" name="username" className="input-field" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                  <label className="input-label">Full Name</label>
                  <input type="text" name="fullName" className="input-field" value={formData.fullName} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <label className="input-label">Professional Tagline (e.g. "Senior Frontend Developer")</label>
                <input type="text" name="tagline" className="input-field" value={formData.tagline} onChange={handleChange} placeholder="What do you do?" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
                <div>
                  <label className="input-label">Profile Picture (Passport Style)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label className="btn-outline flex-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                      <ImageIcon size={18} /> Upload Photo
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (res) => setFormData({ ...formData, profilePicture: res }))} style={{ display: 'none' }} />
                    </label>
                    {formData.profilePicture && <img src={formData.profilePicture} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />}
                  </div>
                </div>
                <div>
                  <label className="input-label">Upload CV / Resume (PDF)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label className="btn-outline flex-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                      <ImageIcon size={18} /> Upload File
                      <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleImageUpload(e, (res) => setFormData({ ...formData, resumeLink: res }))} style={{ display: 'none' }} />
                    </label>
                    {formData.resumeLink && <span style={{ color: '#10b981', fontSize: '0.9rem' }}><CheckCircle size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }}/> Uploaded</span>}
                  </div>
                </div>
              </div>

              <div>
                <label className="input-label">About Me (Introduction)</label>
                <textarea name="aboutMe" className="input-field" rows="5" value={formData.aboutMe} onChange={handleChange} placeholder="Write a compelling introduction about your passion and goals..." required></textarea>
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Socials */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '30px', height: '30px', background: 'var(--gradient-brand)', borderRadius: '50%', textAlign: 'center', color: 'white', lineHeight: '30px', fontSize: '1rem' }}>2</span>
              Contact & Social Network
            </h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label className="input-label" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="checkbox" name="showEmail" checked={formData.contact.showEmail} onChange={(e) => handleNestedChange(e, 'contact')} />
                    Show Email Button
                  </label>
                  <input type="email" name="email" className="input-field" value={formData.contact.email} onChange={(e) => handleNestedChange(e, 'contact')} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="input-label" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="checkbox" name="showPhone" checked={formData.contact.showPhone} onChange={(e) => handleNestedChange(e, 'contact')} />
                    Show Phone Number
                  </label>
                  <input type="tel" name="phone" className="input-field" value={formData.contact.phone} onChange={(e) => handleNestedChange(e, 'contact')} placeholder="+1 234 567 890" />
                </div>
              </div>

              <div>
                <label className="input-label" style={{ marginBottom: '1rem' }}>Social Media Links (Footer)</label>
                {formData.socials.map((social, index) => (
                  <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input type="text" name="platform" placeholder="Platform (e.g. GitHub)" className="input-field" style={{ width: '30%' }} value={social.platform} onChange={(e) => handleArrayChange(index, e, 'socials')} />
                    <input type="url" name="url" placeholder="Profile URL" className="input-field" style={{ flexGrow: 1 }} value={social.url} onChange={(e) => handleArrayChange(index, e, 'socials')} />
                    <button type="button" onClick={() => removeArrayItem(index, 'socials')} style={{ color: '#ef4444' }}><Trash2 size={20}/></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('socials', { platform: '', url: '' })} className="btn-outline flex-center" style={{ gap: '0.5rem', padding: '0.5rem 1rem' }}><Plus size={16}/> Add Link</button>
              </div>
            </div>
          </div>

          {/* Section 3: Skills & Journey */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '30px', height: '30px', background: 'var(--gradient-brand)', borderRadius: '50%', textAlign: 'center', color: 'white', lineHeight: '30px', fontSize: '1rem' }}>3</span>
              Experience & Skills
            </h2>
            
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <input type="checkbox" name="showSkills" checked={formData.showSkills} onChange={(e) => setFormData({...formData, showSkills: e.target.checked})} />
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Show Skills Marquee</h3>
              </div>
              {formData.showSkills && (
                <input type="text" name="skills" className="input-field" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, UI Design, AWS (comma separated)" />
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <input type="checkbox" name="showJourney" checked={formData.showJourney} onChange={(e) => setFormData({...formData, showJourney: e.target.checked})} />
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Show Career Journey / Timeline</h3>
              </div>
              {formData.showJourney && (
                <>
                  {formData.journey.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                      <input type="text" name="year" placeholder="Year / Period" className="input-field" style={{ width: '25%' }} value={item.year} onChange={(e) => handleArrayChange(index, e, 'journey')} />
                      <input type="text" name="event" placeholder="Event (e.g., Software Engineer at Google)" className="input-field" style={{ flexGrow: 1 }} value={item.event} onChange={(e) => handleArrayChange(index, e, 'journey')} />
                      <button type="button" onClick={() => removeArrayItem(index, 'journey')} style={{ color: '#ef4444' }}><Trash2 size={20}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('journey', { year: '', event: '' })} className="btn-outline flex-center" style={{ gap: '0.5rem', padding: '0.5rem 1rem' }}><Plus size={16}/> Add Timeline Event</button>
                </>
              )}
            </div>
          </div>

          {/* Section 4: Projects & Certificates */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '30px', height: '30px', background: 'var(--gradient-brand)', borderRadius: '50%', textAlign: 'center', color: 'white', lineHeight: '30px', fontSize: '1rem' }}>4</span>
              Portfolio Content
            </h2>
            
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Featured Projects</h3>
              {formData.projects.map((proj, index) => (
                <div key={index} style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ color: 'var(--accent-primary)' }}>Project {index + 1}</h4>
                    <button type="button" onClick={() => removeArrayItem(index, 'projects')} style={{ color: '#ef4444' }}><Trash2 size={18}/></button>
                  </div>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <input type="text" name="title" placeholder="Project Title" className="input-field" value={proj.title} onChange={(e) => handleArrayChange(index, e, 'projects')} />
                    <input type="url" name="link" placeholder="Live Demo or GitHub Link" className="input-field" value={proj.link} onChange={(e) => handleArrayChange(index, e, 'projects')} />
                    <textarea name="description" placeholder="Project Description" className="input-field" rows="3" value={proj.description} onChange={(e) => handleArrayChange(index, e, 'projects')}></textarea>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <label className="btn-outline flex-center" style={{ gap: '0.5rem', cursor: 'pointer', display: 'inline-flex', padding: '0.5rem 1rem' }}>
                        <ImageIcon size={16} /> Upload Project Screenshot
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (res) => {
                          const newProjects = [...formData.projects];
                          newProjects[index].image = res;
                          setFormData({ ...formData, projects: newProjects });
                        })} style={{ display: 'none' }} />
                      </label>
                      {proj.image && <img src={proj.image} alt="Preview" style={{ height: '40px', borderRadius: '4px' }} />}
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('projects', { title: '', description: '', link: '', image: null })} className="btn-outline flex-center" style={{ gap: '0.5rem', padding: '0.5rem 1rem' }}><Plus size={16}/> Add Project</button>
            </div>

            <div>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Certificates</h3>
              {formData.certificates.map((cert, index) => (
                <div key={index} style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flexGrow: 1, display: 'grid', gap: '1rem' }}>
                    <input type="text" name="title" placeholder="Certificate Title" className="input-field" value={cert.title} onChange={(e) => handleArrayChange(index, e, 'certificates')} />
                    <label className="btn-outline flex-center" style={{ gap: '0.5rem', cursor: 'pointer', justifySelf: 'start', padding: '0.5rem 1rem' }}>
                      <ImageIcon size={16} /> Upload Certificate Image
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (res) => {
                        const newCerts = [...formData.certificates];
                        newCerts[index].image = res;
                        setFormData({ ...formData, certificates: newCerts });
                      })} style={{ display: 'none' }} />
                    </label>
                  </div>
                  {cert.image && <img src={cert.image} alt="Preview" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />}
                  <button type="button" onClick={() => removeArrayItem(index, 'certificates')} style={{ color: '#ef4444', padding: '1rem' }}><Trash2 size={24}/></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('certificates', { title: '', image: null })} className="btn-outline flex-center" style={{ gap: '0.5rem', padding: '0.5rem 1rem' }}><Plus size={16}/> Add Certificate</button>
            </div>
          </div>
          
          <button type="submit" className="btn-primary" style={{ padding: '1.5rem', fontSize: '1.3rem', marginTop: '1rem', boxShadow: '0 10px 30px var(--accent-glow)' }}>
            Publish Professional Portfolio
          </button>
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
