const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// In-memory database for testing
const portfolios = {
  'nirjan': {
    username: 'nirjan',
    fullName: 'Nirjan Mondal',
    tagline: 'Computer Science Undergraduate & Web Developer',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    aboutMe: 'I am a passionate CS student building innovative web solutions. I specialize in React, Node.js, and modern UI design.',
    showSkills: true,
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Vite', 'Framer Motion'],
    contact: { showEmail: true, email: 'nirjan@example.com', showPhone: true, phone: '+91 98765 43210' },
    socials: [
      { platform: 'GitHub', url: 'https://github.com/Nirjan4102' },
      { platform: 'LinkedIn', url: 'https://linkedin.com' }
    ],
    projects: [
      { title: 'Portfolio Builder', description: 'A premium platform to build and share professional portfolios.', link: 'https://github.com/Nirjan4102/animated-portfolio-builder' }
    ],
    certificates: [],
    showJourney: true,
    journey: [
      { year: '2022', event: 'Started CS Degree' },
      { year: '2024', event: 'Built Portfolio Platform' }
    ]
  }
};

app.get('/', (req, res) => {
  res.send('Portfolio Builder API is running');
});

// Create or update a portfolio
app.post('/api/portfolio', (req, res) => {
  const data = req.body;
  
  if (!data.username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Parse skills from comma-separated string if needed
  let parsedSkills = data.skills || [];
  if (typeof parsedSkills === 'string') {
    parsedSkills = parsedSkills.split(',').map(s => s.trim());
  }

  portfolios[data.username] = {
    username: data.username,
    fullName: data.fullName,
    tagline: data.tagline || '',
    profilePicture: data.profilePicture || null,
    resumeLink: data.resumeLink || '',
    aboutMe: data.aboutMe || '',
    showSkills: data.showSkills !== false,
    skills: parsedSkills,
    contact: data.contact || { showEmail: false, email: '', showPhone: false, phone: '' },
    socials: data.socials || [],
    projects: data.projects || [],
    certificates: data.certificates || [],
    showJourney: data.showJourney !== false,
    journey: data.journey || []
  };

  res.status(200).json({ message: 'Portfolio saved successfully', data: portfolios[data.username] });
});

// Get a portfolio by username
app.get('/api/portfolio/:username', (req, res) => {
  const { username } = req.params;
  const portfolio = portfolios[username];
  
  if (!portfolio) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }

  res.status(200).json(portfolio);
});

// Get all portfolios for admin
app.get('/api/admin/users', (req, res) => {
  const allUsers = Object.values(portfolios);
  res.status(200).json(allUsers);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
