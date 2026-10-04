import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function PublicLayout({ children, user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div>
      <nav className="public-navbar">
        <div className="container nav-container">
          <Link to="/" className="logo-text">
            <GraduationCap size={32} />
            <span>PlacementPro</span>
          </Link>
          <ul className="nav-links">
            <li><NavLink to="/" className={({ active }) => active ? "nav-link active" : "nav-link"}>Home</NavLink></li>
            <li><NavLink to="/about" className={({ active }) => active ? "nav-link active" : "nav-link"}>About</NavLink></li>
            <li><NavLink to="/features" className={({ active }) => active ? "nav-link active" : "nav-link"}>Features</NavLink></li>
            <li><NavLink to="/how-it-works" className={({ active }) => active ? "nav-link active" : "nav-link"}>How It Works</NavLink></li>
            <li><NavLink to="/statistics" className={({ active }) => active ? "nav-link active" : "nav-link"}>Statistics</NavLink></li>
            <li><NavLink to="/contact" className={({ active }) => active ? "nav-link active" : "nav-link"}>Contact</NavLink></li>
            
            {user ? (
              <>
                <li>
                  <button 
                    onClick={() => {
                      if (user.role === 'STUDENT') navigate('/student/dashboard');
                      else navigate('/admin/dashboard');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={onLogout} className="btn btn-secondary btn-sm">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><NavLink to="/login/student" className="nav-link">Student Login</NavLink></li>
                <li><NavLink to="/login/admin" className="nav-link">Officer Login</NavLink></li>
                <li>
                  <Link to="/get-started" className="btn btn-primary btn-sm">
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <main style={{ minHeight: 'calc(100vh - 350px)' }}>
        {children}
      </main>

      <footer className="public-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h4 className="flex align-center" style={{ gap: '8px', color: 'white' }}>
                <GraduationCap size={24} />
                <span>PlacementPro</span>
              </h4>
              <p style={{ fontSize: '0.875rem', marginTop: '15px' }}>
                Empowering students and streamlining recruitment pipelines with our smart eligibility tracking platform.
              </p>
            </div>
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/features">Core Features</Link></li>
                <li><Link to="/statistics">Placement Records</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>For Students</h4>
              <ul>
                <li><Link to="/login/student">Student Portal</Link></li>
                <li><Link to="/get-started">Create Profile</Link></li>
                <li><Link to="/login/student">Eligibility Check</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>For Officers & Recruiters</h4>
              <ul>
                <li><Link to="/login/admin">Officer Dashboard</Link></li>
                <li><Link to="/login/admin">Manage Placements</Link></li>
                <li><a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer">Django Admin</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} PlacementPro - College Placement Eligibility Management. All rights reserved.</p>
            <p>Made with React & Django REST Framework</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
