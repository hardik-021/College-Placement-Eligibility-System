import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function LoginPage({ isAdminFlow, onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {};
    if (isAdminFlow) {
      payload.username = username;
    } else {
      payload.enrollment_number = enrollmentNumber;
    }
    payload.password = password;

    try {
      const res = await api.post('/auth/login', payload);
      
      // Store token and credentials in local storage
      if (rememberMe) {
        localStorage.setItem('remembered_user', isAdminFlow ? username : enrollmentNumber);
      } else {
        localStorage.removeItem('remembered_user');
      }

      onLoginSuccess(res.token, res.user, res.student_profile);

      // Redirect automatically based on detected role
      if (res.user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid login details. Please verify your credentials.');
    }
  };

  const triggerForgotPassword = (e) => {
    e.preventDefault();
    alert("Please contact the college Placement Administration Cell or Email info@ljku.edu.in to reset your password.");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>{isAdminFlow ? 'Officer & Admin Portal' : 'Student Portal'}</h2>
          <p>
            {isAdminFlow 
              ? 'Login with your staff credentials' 
              : 'Enter your academic enrollment details'}
          </p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ padding: '10px', width: '100%', justifyContent: 'center', marginBottom: '20px', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {isAdminFlow ? (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                placeholder="Staff Username"
                value={username} 
                onChange={e => setUsername(e.target.value)} 
              />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Enrollment Number</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                placeholder="2026CE001"
                value={enrollmentNumber} 
                onChange={e => setEnrollmentNumber(e.target.value)} 
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              placeholder="••••••••"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={e => setRememberMe(e.target.checked)} 
              />
              <span>Remember Me</span>
            </label>
            <a href="#" className="forgot-password" onClick={triggerForgotPassword}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.875rem' }}>
          {isAdminFlow ? (
            <span>Are you a student? <Link to="/login/student" style={{ color: 'var(--primary)', fontWeight: '600' }}>Student Login</Link></span>
          ) : (
            <span>New Student? <Link to="/get-started" style={{ color: 'var(--primary)', fontWeight: '600' }}>Get Started</Link></span>
          )}
        </div>
      </div>
    </div>
  );
}
