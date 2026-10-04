import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  CheckSquare, 
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
    <div className="container py-4">
      {/* Hero Section */}
      <section className="bg-light rounded-4 p-4 p-md-5 mb-5 border shadow-sm">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-7">
            <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 rounded-pill fw-semibold">Next Gen Placement Portal</span>
            <h1 className="display-4 fw-bold mb-3 text-dark">Manage & Track Your College Placement Eligibility</h1>
            <p className="lead text-muted mb-4">
              An automated, smart-scoring gateway that maps academic marks, skills, and certifications against corporate criteria. Seamlessly monitor applications from registration to selection.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/get-started" className="btn btn-primary btn-lg d-flex align-items-center gap-2 fw-semibold px-4 rounded-pill shadow-sm">
                Get Started <ChevronRight size={20} />
              </Link>
              <Link to="/statistics" className="btn btn-outline-secondary btn-lg fw-semibold px-4 rounded-pill shadow-sm">
                Placement Statistics
              </Link>
            </div>
          </div>
          <div className="col-12 col-lg-5 text-center d-none d-lg-block">
            <GraduationCap size={220} className="text-primary opacity-25" />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="mb-5">
        <div className="row g-4 text-center">
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 py-4 px-3 rounded-4 bg-white h-100">
              <div className="fs-2 fw-bold text-primary mb-1">{stats ? `${stats.placement_rate}%` : '85.4%'}</div>
              <div className="small text-uppercase tracking-wider text-muted fw-semibold">Placement Rate</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 py-4 px-3 rounded-4 bg-white h-100">
              <div className="fs-2 fw-bold text-success mb-1">{stats ? `${stats.avg_package} LPA` : '6.8 LPA'}</div>
              <div className="small text-uppercase tracking-wider text-muted fw-semibold">Average Package</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 py-4 px-3 rounded-4 bg-white h-100">
              <div className="fs-2 fw-bold text-info mb-1">{stats ? `${stats.max_package} LPA` : '35.5 LPA'}</div>
              <div className="small text-uppercase tracking-wider text-muted fw-semibold">Highest Package</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 py-4 px-3 rounded-4 bg-white h-100">
              <div className="fs-2 fw-bold text-warning mb-1">{stats ? stats.total_companies : '12+'}</div>
              <div className="small text-uppercase tracking-wider text-muted fw-semibold">Active Companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Overview */}
      <section className="py-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark mb-2">Core System Features</h2>
          <p className="text-muted">Everything you need to secure your dream career, automated and tracked end-to-end.</p>
        </div>
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-4 rounded-4 bg-white h-100">
              <div className="d-inline-flex p-3 bg-primary-subtle text-primary rounded-3 mb-3" style={{ width: 'fit-content' }}>
                <CheckSquare size={24} />
              </div>
              <h4 className="fw-bold mb-2">Smart Eligibility Score</h4>
              <p className="text-muted small mb-0">Compute an overall score out of 100 based on CGPA, skills, certifications, and active backlogs. View gaps immediately.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-4 rounded-4 bg-white h-100">
              <div className="d-inline-flex p-3 bg-success-subtle text-success rounded-3 mb-3" style={{ width: 'fit-content' }}>
                <Building2 size={24} />
              </div>
              <h4 className="fw-bold mb-2">Company Criteria Match</h4>
              <p className="text-muted small mb-0">Instantly compare your academic profiles against dynamic corporate criteria. No more guess-work before applying.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-4 rounded-4 bg-white h-100">
              <div className="d-inline-flex p-3 bg-info-subtle text-info rounded-3 mb-3" style={{ width: 'fit-content' }}>
                <FileCheck size={24} />
              </div>
              <h4 className="fw-bold mb-2">Application Tracking</h4>
              <p className="text-muted small mb-0">Monitor status updates from applied, under review, shortlisted, interview scheduled, to final selection.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// About Component
export function About() {
  return (
    <div className="container py-5 my-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark mb-2">About PlacementPro</h2>
        <p className="text-muted">Connecting academic excellence with industry-leading placement records.</p>
      </div>
      <div className="mx-auto" style={{ maxWidth: '800px', fontSize: '1.05rem', color: '#475569' }}>
        <p className="mb-4">
          PlacementPro is the official campus eligibility and placement portal designed to unify communication between students, placement officers, and recruiters. We eliminate administrative lag by automating eligibility checks and tracking student applications in real time.
        </p>
        <h3 className="fw-bold text-dark mt-5 mb-3">Our Vision</h3>
        <p className="mb-4">
          To provide a transparent, friction-free environment where every student has immediate clarity on their placement eligibility status, actionable tips for self-improvement, and direct access to companies aligned with their skillset.
        </p>
        <h3 className="fw-bold text-dark mt-5 mb-3">Role-Based Access</h3>
        <ul className="list-group list-group-flush mb-4">
          <li className="list-group-item bg-transparent px-0 border-light"><strong className="text-dark">Students:</strong> Build profiles, check smart scores, discover match reasons, and submit applications.</li>
          <li className="list-group-item bg-transparent px-0 border-light"><strong className="text-dark">Placement Officers:</strong> Configure company requirements, track applications, broadcast announcements, and update selection statuses.</li>
          <li className="list-group-item bg-transparent px-0 border-light"><strong className="text-dark">Administrators:</strong> Full CRUD permissions across students, companies, users, settings, and database backups.</li>
        </ul>
      </div>
    </div>
  );
}

// Features Component
export function Features() {
  return (
    <div className="container py-5 my-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark mb-2">System Capabilities</h2>
        <p className="text-muted">A comprehensive features suite designed for college placement cells.</p>
      </div>
      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 p-4 rounded-4 bg-white h-100">
            <div className="d-inline-flex p-3 bg-primary-subtle text-primary rounded-3 mb-3" style={{ width: 'fit-content' }}>
              <Award size={24} />
            </div>
            <h4 className="fw-bold mb-2">Dynamic Eligibility Checker</h4>
            <p className="text-muted small mb-0">Our checker evaluates criteria on CGPA, allowed departments, 10th and 12th percentages, and backlogs to determine your eligibility to apply.</p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 p-4 rounded-4 bg-white h-100">
            <div className="d-inline-flex p-3 bg-success-subtle text-success rounded-3 mb-3" style={{ width: 'fit-content' }}>
              <Briefcase size={24} />
            </div>
            <h4 className="fw-bold mb-2">Corporate Directory</h4>
            <p className="text-muted small mb-0">Browse active listings, CTC packages, jobs roles, job description files, locations, and direct deadlines with easy filter controls.</p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 p-4 rounded-4 bg-white h-100">
            <div className="d-inline-flex p-3 bg-info-subtle text-info rounded-3 mb-3" style={{ width: 'fit-content' }}>
              <Users size={24} />
            </div>
            <h4 className="fw-bold mb-2">Student Profiles</h4>
            <p className="text-muted small mb-0">Maintain up-to-date repositories of resumes, skills tags, LinkedIn/GitHub links, and phone profiles synced to the admin dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// How It Works Component
export function HowItWorks() {
  return (
    <div className="container py-5 my-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark mb-2">How It Works</h2>
        <p className="text-muted">A step-by-step workflow for students entering the placement cycle.</p>
      </div>
      <div className="mx-auto d-flex flex-column gap-4" style={{ maxWidth: '720px' }}>
        <div className="card border-0 shadow-sm p-4 rounded-4 d-flex flex-row align-items-start gap-4">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0" style={{ width: '45px', height: '45px' }}>1</div>
          <div>
            <h4 className="fw-bold text-dark mb-2">Create Your Student Profile</h4>
            <p className="text-muted mb-0 small">Register with your enrollment number and provide your current academic credentials (CGPA, department, semester, 10th/12th percentages) along with your professional skills and resume.</p>
          </div>
        </div>
        
        <div className="card border-0 shadow-sm p-4 rounded-4 d-flex flex-row align-items-start gap-4">
          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0" style={{ width: '45px', height: '45px' }}>2</div>
          <div>
            <h4 className="fw-bold text-dark mb-2">Check Your Smart Score</h4>
            <p className="text-muted mb-0 small">The system evaluates your profile and gives you a score out of 100, outlining improvement tips like uploading certificates, adding skills, or boosting grades to unlock eligibility.</p>
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4 rounded-4 d-flex flex-row align-items-start gap-4">
          <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0" style={{ width: '45px', height: '45px' }}>3</div>
          <div>
            <h4 className="fw-bold text-dark mb-2">Apply to Matches</h4>
            <p className="text-muted mb-0 small">Search and filter the active company directory. If you meet their criteria, submit your application with a single click. The system will prevent ineligible applications automatically.</p>
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4 rounded-4 d-flex flex-row align-items-start gap-4">
          <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0" style={{ width: '45px', height: '45px' }}>4</div>
          <div>
            <h4 className="fw-bold text-dark mb-2">Track Progress</h4>
            <p className="text-muted mb-0 small">View updates on the live pipeline. Receive real-time updates when an officer moves you from 'Applied' to 'Shortlisted' or schedules an interview.</p>
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
    <div className="container py-5 my-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark mb-2">Live Placement Statistics</h2>
        <p className="text-muted">Updated placement metrics, salaries, and department distributions.</p>
      </div>

      {stats && (
        <>
          <div className="row g-4 mb-5">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white d-flex flex-row justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1 small text-uppercase fw-semibold">Total Students</h6>
                  <div className="fs-3 fw-bold text-dark">{stats.total_students}</div>
                </div>
                <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                  <Users size={24} />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white d-flex flex-row justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1 small text-uppercase fw-semibold">Total Placed</h6>
                  <div className="fs-3 fw-bold text-dark">{stats.placed_students}</div>
                </div>
                <div className="p-3 bg-success-subtle text-success rounded-circle">
                  <Award size={24} />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white d-flex flex-row justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1 small text-uppercase fw-semibold">Avg Package</h6>
                  <div className="fs-3 fw-bold text-dark">{stats.avg_package} LPA</div>
                </div>
                <div className="p-3 bg-info-subtle text-info rounded-circle">
                  <Briefcase size={24} />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white d-flex flex-row justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1 small text-uppercase fw-semibold">Highest Package</h6>
                  <div className="fs-3 fw-bold text-dark">{stats.max_package} LPA</div>
                </div>
                <div className="p-3 bg-warning-subtle text-warning rounded-circle">
                  <Award size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
            <h3 className="fw-bold text-dark h5 mb-4">Department-wise Placement Performance</h3>
            <div className="d-flex flex-column gap-4">
              {stats.department_stats.map((dept, idx) => (
                <div key={idx}>
                  <div className="d-flex justify-content-between mb-2 small fw-semibold">
                    <span className="text-dark">{dept.department}</span>
                    <span className="text-primary">{dept.placement_rate}% Placed</span>
                  </div>
                  <div className="progress rounded-pill" style={{ height: '12px' }}>
                    <div 
                      className="progress-bar bg-primary rounded-pill progress-bar-striped progress-bar-animated" 
                      role="progressbar" 
                      style={{ width: `${dept.placement_rate}%` }} 
                      aria-valuenow={dept.placement_rate} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              ))}
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
    <div className="container py-5 my-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark mb-2">Contact Us</h2>
        <p className="text-muted">Have questions about recruitment, criteria, or profiles? Get in touch.</p>
      </div>

      <div className="row g-5">
        <div className="col-12 col-lg-5">
          <div className="p-4 rounded-4 bg-light border shadow-sm h-100">
            <h3 className="fw-bold text-dark mb-2 h4">Placement Cell</h3>
            <p className="text-muted mb-4 small">Reach out to the college placement department directly.</p>
            
            <div className="d-flex flex-column gap-4">
              <div className="d-flex gap-3 align-items-start">
                <div className="p-2 bg-primary-subtle text-primary rounded-3 flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <strong className="text-dark d-block">Location</strong>
                  <span className="text-muted small">LJ Campus, LJ University Road Off, S.G. Road, Ahmedabad-382210</span>
                </div>
              </div>
              
              <div className="d-flex gap-3 align-items-start">
                <div className="p-2 bg-success-subtle text-success rounded-3 flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <strong className="text-dark d-block">Email</strong>
                  <span className="text-muted small">info@ljku.edu.in</span>
                </div>
              </div>

              <div className="d-flex gap-3 align-items-start">
                <div className="p-2 bg-info-subtle text-info rounded-3 flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <strong className="text-dark d-block">Phone</strong>
                  <span className="text-muted small">+91 6357000987</span>
                </div>
              </div>
            </div>
            
            <hr className="my-4 text-muted" />
            <p className="text-muted mb-0 small" style={{ fontSize: '0.8rem' }}><strong>Hours:</strong> Mon - Fri (9:00 AM - 5:00 PM)</p>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 h-100">
            {submitted ? (
              <div className="alert alert-success text-center py-4 rounded-3 h-100 d-flex flex-column justify-content-center" role="alert">
                <Award size={48} className="mx-auto mb-3 text-success" />
                <h4 className="fw-bold">Message Sent!</h4>
                <p className="mb-0 text-muted small">Thank you. Your message has been sent successfully. We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    required 
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})} 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Subject</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={form.subject} 
                    onChange={e => setForm({...form, subject: e.target.value})} 
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Message</label>
                  <textarea 
                    rows="4" 
                    className="form-control" 
                    required 
                    value={form.message} 
                    onChange={e => setForm({...form, message: e.target.value})}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold rounded-3 shadow-sm">
                  Send Message
                </button>
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
    <div className="container py-5 my-5 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg border-0 p-4 p-md-5" style={{ maxWidth: '580px', width: '100%', borderRadius: '16px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark">Create Student Profile</h2>
          <p className="text-muted">Sign up to check eligibility and apply for company job positions.</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center py-2 mb-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold small">Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={form.full_name} 
                onChange={e => setForm({...form, full_name: e.target.value})} 
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold small">Enrollment Number</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={form.enrollment_number} 
                onChange={e => setForm({...form, enrollment_number: e.target.value})} 
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold small">Username</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={form.username} 
                onChange={e => setForm({...form, username: e.target.value})} 
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold small">Email</label>
              <input 
                type="email" 
                className="form-control" 
                required 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Password</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small">Department</label>
            <select 
              className="form-select" 
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

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold rounded-3 shadow-sm">
            Register Profile
          </button>
        </form>

        <div className="text-center mt-4 small text-muted">
          Already have an account? <Link to="/login/student" className="text-primary text-decoration-none fw-semibold">Student Login</Link>
        </div>
      </div>
    </div>
  );
}

// Officer Registration Component
export function RegisterOfficer({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', password: '', email: ''
  });
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register-officer/', form);
      onLoginSuccess(res.token, res.user, null);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Officer registration failed. Please try again.');
    }
  };

  return (
    <div className="container py-5 my-5 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg border-0 p-4 p-md-5" style={{ maxWidth: '500px', width: '100%', borderRadius: '16px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark">Register Officer Profile</h2>
          <p className="text-muted">Sign up to manage placement processes, company eligibility, and student applications.</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center py-2 mb-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Staff Username</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              placeholder="e.g. officer_name"
              value={form.username} 
              onChange={e => setForm({...form, username: e.target.value})} 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Work Email</label>
            <input 
              type="email" 
              className="form-control" 
              required 
              placeholder="officer@college.edu"
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small">Password</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              placeholder="••••••••"
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold rounded-3 shadow-sm">
            Register as Placement Officer
          </button>
        </form>

        <div className="text-center mt-4 small text-muted">
          Already have an account? <Link to="/login/admin" className="text-primary text-decoration-none fw-semibold">Officer Login</Link>
        </div>
      </div>
    </div>
  );
}

