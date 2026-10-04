import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  CheckSquare, 
  Timeline, 
  Award, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  FileCheck, 
  Users, 
  GraduationCap
} from 'lucide-react';
import { api } from '../utils/api';

// Home Component
export function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats/').then(setStats).catch(console.error);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="badge badge-primary" style={{ marginBottom: '15px' }}>Next Gen Placement Portal</span>
            <h1>Manage & Track Your College Placement Eligibility</h1>
            <p>
              An automated, smart-scoring gateway that maps academic marks, skills, and certifications against corporate criteria. Seamlessly monitor applications from registration to selection.
            </p>
            <div className="hero-buttons">
              <Link to="/get-started" className="btn btn-primary">Get Started <ChevronRight size={18} /></Link>
              <Link to="/statistics" className="btn btn-secondary">Placement Statistics</Link>
            </div>
          </div>
          <div className="hero-image-placeholder" style={{ display: 'flex', justifyContent: 'center' }}>
            <GraduationCap size={240} style={{ color: 'var(--primary)', opacity: 0.15 }} />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="container">
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-number">{stats ? `${stats.placement_rate}%` : '85.4%'}</div>
            <div className="stat-label">Placement Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats ? `${stats.avg_package} LPA` : '6.8 LPA'}</div>
            <div className="stat-label">Average Package</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats ? `${stats.max_package} LPA` : '35.5 LPA'}</div>
            <div className="stat-label">Highest Package</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats ? stats.total_companies : '12+'}</div>
            <div className="stat-label">Active Companies</div>
          </div>
        </div>
      </section>

      {/* Core Features Overview */}
      <section className="container" style={{ padding: '80px 0' }}>
        <div className="section-title-wrap">
          <h2>Core System Features</h2>
          <p>Everything you need to secure your dream career, automated and tracked end-to-end.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap"><CheckSquare size={24} /></div>
            <h3>Smart Eligibility Score</h3>
            <p>Compute an overall score out of 100 based on CGPA, skills, certifications, and active backlogs. View gaps immediately.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap"><Building2 size={24} /></div>
            <h3>Company Criteria Match</h3>
            <p>Instantly compare your academic profiles against dynamic corporate criteria. No more guess-work before applying.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap"><FileCheck size={24} /></div>
            <h3>Application Tracking</h3>
            <p>Monitor status updates from applied, under review, shortlisted, interview scheduled, to final selection.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// About Component
export function About() {
  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div className="section-title-wrap" style={{ marginTop: '20px' }}>
        <h2>About PlacementPro</h2>
        <p>Connecting academic excellence with industry-leading placement records.</p>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--neutral-600)' }}>
        <p style={{ marginBottom: '20px' }}>
          PlacementPro is the official campus eligibility and placement portal designed to unify communication between students, placement officers, and recruiters. We eliminate administrative lag by automating eligibility checks and tracking student applications in real time.
        </p>
        <h3 style={{ margin: '30px 0 15px 0', color: 'var(--neutral-900)' }}>Our Vision</h3>
        <p style={{ marginBottom: '20px' }}>
          To provide a transparent, friction-free environment where every student has immediate clarity on their placement eligibility status, actionable tips for self-improvement, and direct access to companies aligned with their skillset.
        </p>
        <h3 style={{ margin: '30px 0 15px 0', color: 'var(--neutral-900)' }}>Role-Based Access</h3>
        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
          <li style={{ marginBottom: '8px' }}><strong>Students:</strong> Build profiles, check smart scores, discover match reasons, and submit applications.</li>
          <li style={{ marginBottom: '8px' }}><strong>Placement Officers:</strong> Configure company requirements, track applications, broadcast announcements, and update selection statuses.</li>
          <li style={{ marginBottom: '8px' }}><strong>Administrators:</strong> Full CRUD permissions across students, companies, users, settings, and database backups.</li>
        </ul>
      </div>
    </div>
  );
}

// Features Component
export function Features() {
  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div className="section-title-wrap" style={{ marginTop: '20px' }}>
        <h2>System Capabilities</h2>
        <p>A comprehensive features suite designed for college placement cells.</p>
      </div>
      <div className="features-grid" style={{ marginTop: '40px' }}>
        <div className="feature-card">
          <div className="feature-icon-wrap"><Award size={24} /></div>
          <h3>Dynamic Eligibility Checker</h3>
          <p>Our checker evaluates criteria on CGPA, allowed departments, 10th and 12th percentages, and backlogs to determine your eligibility to apply.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrap"><Briefcase size={24} /></div>
          <h3>Corporate Directory</h3>
          <p>Browse active listings, CTC packages, jobs roles, job description files, locations, and direct deadlines with easy filter controls.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrap"><Users size={24} /></div>
          <h3>Student Profiles</h3>
          <p>Maintain up-to-date repositories of resumes, skills tags, LinkedIn/GitHub links, and phone profiles synced to the admin dashboard.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrap"><Mail size={24} /></div>
          <h3>Instant Notifications</h3>
          <p>Receive live notifications whenever placement officers schedule an interview, shortlist you, or post a new announcement.</p>
        </div>
      </div>
    </div>
  );
}

// How It Works Component
export function HowItWorks() {
  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div className="section-title-wrap" style={{ marginTop: '20px' }}>
        <h2>How It Works</h2>
        <p>A step-by-step workflow for students entering the placement cycle.</p>
      </div>
      <div style={{ maxWidth: '700px', margin: '40px auto 0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div className="flex" style={{ gap: '20px', alignItems: 'flex-start' }}>
          <div className="feature-icon-wrap" style={{ borderRadius: '50%', width: '40px', height: '40px', flexShrink: 0 }}>1</div>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Create Your Student Profile</h3>
            <p style={{ color: 'var(--neutral-500)' }}>Register with your enrollment number and provide your current academic credentials (CGPA, department, semester, 10th/12th percentages) along with your professional skills and resume.</p>
          </div>
        </div>
        <div className="flex" style={{ gap: '20px', alignItems: 'flex-start' }}>
          <div className="feature-icon-wrap" style={{ borderRadius: '50%', width: '40px', height: '40px', flexShrink: 0 }}>2</div>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Check Your Smart Score</h3>
            <p style={{ color: 'var(--neutral-500)' }}>The system evaluates your profile and gives you a score out of 100, outlining improvement tips like uploading certificates, adding skills, or boosting grades to unlock eligibility.</p>
          </div>
        </div>
        <div className="flex" style={{ gap: '20px', alignItems: 'flex-start' }}>
          <div className="feature-icon-wrap" style={{ borderRadius: '50%', width: '40px', height: '40px', flexShrink: 0 }}>3</div>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Apply to Matches</h3>
            <p style={{ color: 'var(--neutral-500)' }}>Search and filter the active company directory. If you meet their criteria, submit your application with a single click. The system will prevent ineligible applications automatically.</p>
          </div>
        </div>
        <div className="flex" style={{ gap: '20px', alignItems: 'flex-start' }}>
          <div className="feature-icon-wrap" style={{ borderRadius: '50%', width: '40px', height: '40px', flexShrink: 0 }}>4</div>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Track Progress</h3>
            <p style={{ color: 'var(--neutral-500)' }}>View updates on the live pipeline. Receive real-time updates when an officer moves you from 'Applied' to 'Shortlisted' or schedules an interview.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Statistics Component
export function Statistics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats/').then(setStats).catch(console.error);
  }, []);

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div className="section-title-wrap" style={{ marginTop: '20px' }}>
        <h2>Live Placement Statistics</h2>
        <p>Updated placement metrics, salaries, and department distributions.</p>
      </div>

      {stats && (
        <>
          <div className="metric-grid" style={{ marginTop: '40px' }}>
            <div className="metric-card">
              <div className="metric-info">
                <h3>Total Students</h3>
                <div className="metric-value">{stats.total_students}</div>
              </div>
              <div className="metric-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Users size={24} />
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-info">
                <h3>Total Placed</h3>
                <div className="metric-value">{stats.placed_students}</div>
              </div>
              <div className="metric-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
                <Award size={24} />
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-info">
                <h3>Average Salary Package</h3>
                <div className="metric-value">{stats.avg_package} LPA</div>
              </div>
              <div className="metric-icon" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                <Briefcase size={24} />
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-info">
                <h3>Highest Package</h3>
                <div className="metric-value">{stats.max_package} LPA</div>
              </div>
              <div className="metric-icon" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
                <Award size={24} />
              </div>
            </div>
          </div>

          <div className="panel" style={{ marginTop: '30px' }}>
            <div className="panel-header">
              <h3>Department-wise Placement Performance</h3>
            </div>
            <div className="panel-body">
              <div className="chart-bar-container">
                {stats.department_stats.map((dept, idx) => (
                  <div key={idx} className="chart-bar-item">
                    <div className="chart-bar-name">{dept.department}</div>
                    <div className="chart-bar-bg">
                      <div className="chart-bar-fill" style={{ width: `${dept.placement_rate}%` }} />
                    </div>
                    <div className="chart-bar-val">{dept.placement_rate}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Contact Component
export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div className="section-title-wrap" style={{ marginTop: '20px' }}>
        <h2>Contact Us</h2>
        <p>Have questions about recruitment, criteria, or profiles? Get in touch.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info">
          <div>
            <h3>Placement Cell</h3>
            <p>Reach out to the college placement department directly.</p>
          </div>
          <div style={{ margin: '30px 0' }}>
            <div className="contact-item">
              <MapPin size={20} />
              <div>
                <strong>Location</strong>
                <p>LJ Campus, LJ University Road Off, S.G. Road, Ahmedabad-382210</p>
              </div>
            </div>
            <div className="contact-item">
              <Mail size={20} />
              <div>
                <strong>Email</strong>
                <p>info@ljku.edu.in</p>
              </div>
            </div>
            <div className="contact-item">
              <Phone size={20} />
              <div>
                <strong>Phone</strong>
                <p>+91 6357000987</p>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Hours: Mon - Fri (9:00 AM - 5:00 PM)</p>
        </div>

        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-body">
            {submitted ? (
              <div className="badge badge-success" style={{ padding: '20px', width: '100%', justifyContent: 'center', fontSize: '1rem', borderRadius: 'var(--radius-sm)' }}>
                Thank you! Your message has been sent successfully. We will get back to you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    required 
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={form.subject} 
                    onChange={e => setForm({...form, subject: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea 
                    rows="4" 
                    className="form-control" 
                    required 
                    value={form.message} 
                    onChange={e => setForm({...form, message: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Get Started (Student Signup) Component
export function Register({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', password: '', email: '', 
    enrollment_number: '', full_name: '', department: 'CE'
  });
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      onLoginSuccess(res.token, res.user, res.student_profile);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '520px' }}>
        <div className="login-header">
          <h2>Create Student Profile</h2>
          <p>Sign up to check eligibility and apply for company job positions.</p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ padding: '10px', width: '100%', justifyContent: 'center', marginBottom: '20px', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={form.full_name} 
                onChange={e => setForm({...form, full_name: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Enrollment Number</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. 2026CE001"
                required 
                value={form.enrollment_number} 
                onChange={e => setForm({...form, enrollment_number: e.target.value})} 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={form.username} 
                onChange={e => setForm({...form, username: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                required 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select 
              className="form-control" 
              value={form.department} 
              onChange={e => setForm({...form, department: e.target.value})}
            >
              <option value="CE">Computer Engineering (CE)</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="CSE">Computer Science & Engineering (CSE)</option>
              <option value="AI_DS">Artificial Intelligence & Data Science (AI & DS)</option>
              <option value="EC">Electronics & Communication Engineering (EC)</option>
              <option value="EE">Electrical Engineering (EE)</option>
              <option value="ME">Mechanical Engineering (ME)</option>
              <option value="CIVIL">Civil Engineering</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Register Profile
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login/student" style={{ color: 'var(--primary)', fontWeight: '600' }}>Student Login</Link>
        </div>
      </div>
    </div>
  );
}
