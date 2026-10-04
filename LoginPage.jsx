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
    <div className="container py-5 my-5 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg border-0 p-4 p-md-5" style={{ maxWidth: '480px', width: '100%', borderRadius: '16px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark">{isAdminFlow ? 'Officer & Admin Portal' : 'Student Portal'}</h2>
          <p className="text-muted">
            {isAdminFlow 
              ? 'Login with your staff credentials' 
              : 'Enter your academic enrollment details'}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger text-center py-2 mb-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {isAdminFlow ? (
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
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
            <div className="mb-3">
              <label className="form-label fw-semibold">Enrollment Number</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={enrollmentNumber} 
                onChange={e => setEnrollmentNumber(e.target.value)} 
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              placeholder="••••••••"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 small">
            <div className="form-check">
              <input 
                type="checkbox" 
                className="form-check-input"
                id="rememberMeCheck"
                checked={rememberMe} 
                onChange={e => setRememberMe(e.target.checked)} 
              />
              <label className="form-check-label text-muted" htmlFor="rememberMeCheck">Remember Me</label>
            </div>
            <a href="#" className="text-primary text-decoration-none fw-semibold" onClick={triggerForgotPassword}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold rounded-3 shadow-sm">
            Sign In
          </button>
        </form>

        <div className="text-center mt-4 small text-muted d-flex flex-column gap-2">
          {isAdminFlow ? (
            <>
              <span>New Officer? <Link to="/register/officer" className="text-primary text-decoration-none fw-semibold">Register here</Link></span>
              <span>Are you a student? <Link to="/login/student" className="text-primary text-decoration-none fw-semibold">Student Login</Link></span>
            </>
          ) : (
            <span>New Student? <Link to="/get-started" className="text-primary text-decoration-none fw-semibold">Get Started</Link></span>
          )}
        </div>
      </div>
    </div>
  );
}
