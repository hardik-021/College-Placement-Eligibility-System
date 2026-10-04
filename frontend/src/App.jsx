import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';

// Public Pages
import { Home, About, Features, HowItWorks, Statistics, Contact, Register } from './pages/PublicPages';
import LoginPage from './pages/LoginPage';

// Student Dashboard Pages
import {
  StudentDashboardOverview,
  StudentProfilePage,
  StudentEligibilityChecker,
  StudentCompanies,
  StudentApplications,
  StudentNotifications,
  StudentSettings
} from './pages/StudentDashboard';

// Admin Dashboard Pages
import {
  AdminDashboardOverview,
  AdminStudentManagement,
  AdminCompanyManagement,
  AdminCriteriaManagement,
  AdminApplications,
  AdminReportsAnalytics,
  AdminNotificationsBroadcast,
  AdminSettings
} from './pages/AdminDashboard';

import { api } from './utils/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [profile, setProfile] = useState(JSON.parse(localStorage.getItem('student_profile')));
  const [loading, setLoading] = useState(true);

  // Validate session on start
  useEffect(() => {
    const validateSession = async () => {
      if (token && user) {
        try {
          if (user.role === 'STUDENT') {
            const freshProfile = await api.get('/students/me');
            setProfile(freshProfile);
            localStorage.setItem('student_profile', JSON.stringify(freshProfile));
          }
        } catch (err) {
          console.error("Session restoration failed, clearing token", err);
          handleLogout();
        }
      }
      setLoading(false);
    };
    validateSession();
  }, [token]);

  const handleLoginSuccess = (newToken, newUser, newProfile) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    
    if (newProfile) {
      localStorage.setItem('student_profile', JSON.stringify(newProfile));
      setProfile(newProfile);
    } else {
      localStorage.removeItem('student_profile');
      setProfile(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('student_profile');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('student_profile', JSON.stringify(updatedProfile));
  };

  if (loading) {
    return (
      <div className="flex align-center justify-center" style={{ height: '100vh', flexDirection: 'column', gap: '15px' }}>
        <div className="score-gauge" style={{ width: '60px', height: '60px', '--score-pct': 40 }} />
        <h3 style={{ color: 'var(--neutral-600)' }}>Initializing Placement Portal...</h3>
      </div>
    );
  }

  // Helper route guards
  const RequireAuth = ({ children, allowedRoles }) => {
    if (!token) return <Navigate to="/login/student" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'} replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<PublicLayout user={user} onLogout={handleLogout}><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout user={user} onLogout={handleLogout}><About /></PublicLayout>} />
        <Route path="/features" element={<PublicLayout user={user} onLogout={handleLogout}><Features /></PublicLayout>} />
        <Route path="/how-it-works" element={<PublicLayout user={user} onLogout={handleLogout}><HowItWorks /></PublicLayout>} />
        <Route path="/statistics" element={<PublicLayout user={user} onLogout={handleLogout}><Statistics /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout user={user} onLogout={handleLogout}><Contact /></PublicLayout>} />
        
        <Route 
          path="/get-started" 
          element={
            token 
              ? <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'} replace />
              : <PublicLayout><Register onLoginSuccess={handleLoginSuccess} /></PublicLayout>
          } 
        />
        <Route 
          path="/login/student" 
          element={
            token 
              ? <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'} replace />
              : <PublicLayout><LoginPage isAdminFlow={false} onLoginSuccess={handleLoginSuccess} /></PublicLayout>
          } 
        />
        <Route 
          path="/login/admin" 
          element={
            token 
              ? <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'} replace />
              : <PublicLayout><LoginPage isAdminFlow={true} onLoginSuccess={handleLoginSuccess} /></PublicLayout>
          } 
        />

        {/* STUDENT DASHBOARD ROUTES */}
        <Route 
          path="/student/dashboard" 
          element={
            <RequireAuth allowedRoles={['STUDENT']}>
              <DashboardLayout user={user} profile={profile} onLogout={handleLogout}>
                <StudentDashboardOverview profile={profile} onProfileUpdate={handleProfileUpdate} />
              </DashboardLayout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/student/profile" 
          element={
            <RequireAuth allowedRoles={['STUDENT']}>
              <DashboardLayout user={user} profile={profile} onLogout={handleLogout}>
                <StudentProfilePage profile={profile} onProfileUpdate={handleProfileUpdate} />
              </DashboardLayout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/student/eligibility-checker" 
          element={
            <RequireAuth allowedRoles={['STUDENT']}>
              <DashboardLayout user={user} profile={profile} onLogout={handleLogout}>
                <StudentEligibilityChecker profile={profile} />
              </DashboardLayout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/student/companies" 
          element={
            <RequireAuth allowedRoles={['STUDENT']}>
              <DashboardLayout user={user} profile={profile} onLogout={handleLogout}>
                <StudentCompanies profile={profile} />
              </DashboardLayout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/student/applications" 
          element={
            <RequireAuth allowedRoles={['STUDENT']}>
              <DashboardLayout user={user} profile={profile} onLogout={handleLogout}>
                <StudentApplications />
              </DashboardLayout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/student/notifications" 
          element={
            <RequireAuth allowedRoles={['STUDENT']}>
              <DashboardLayout user={user} profile={profile} onLogout={handleLogout}>
                <StudentNotifications />
              </DashboardLayout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/student/settings" 
          element={
            <RequireAuth allowedRoles={['STUDENT']}>
              <DashboardLayout user={user} profile={profile} onLogout={handleLogout}>
                <StudentSettings />
              </DashboardLayout>
            </RequireAuth>
          } 
        />

        {/* ADMIN DASHBOARD ROUTES */}
        <Route 
          path="/admin/dashboard" 
          element={
            <RequireAuth allowedRoles={['ADMIN', 'OFFICER']}>
              <DashboardLayout user={user} onLogout={handleLogout}>
                <AdminDashboardOverview user={user} />
              </DashboardLayout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/students" 
          element={
            <RequireAuth allowedRoles={['ADMIN', 'OFFICER']}>
              <DashboardLayout user={user} onLogout={handleLogout}>
                <AdminStudentManagement user={user} />
              </DashboardLayout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/companies" 
          element={
            <RequireAuth allowedRoles={['ADMIN', 'OFFICER']}>
              <DashboardLayout user={user} onLogout={handleLogout}>
                <AdminCompanyManagement user={user} />
              </DashboardLayout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/criteria" 
          element={
            <RequireAuth allowedRoles={['ADMIN', 'OFFICER']}>
              <DashboardLayout user={user} onLogout={handleLogout}>
                <AdminCriteriaManagement />
              </DashboardLayout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/applications" 
          element={
            <RequireAuth allowedRoles={['ADMIN', 'OFFICER']}>
              <DashboardLayout user={user} onLogout={handleLogout}>
                <AdminApplications />
              </DashboardLayout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/analytics" 
          element={
            <RequireAuth allowedRoles={['ADMIN', 'OFFICER']}>
              <DashboardLayout user={user} onLogout={handleLogout}>
                <AdminReportsAnalytics />
              </DashboardLayout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/notifications" 
          element={
            <RequireAuth allowedRoles={['ADMIN', 'OFFICER']}>
              <DashboardLayout user={user} onLogout={handleLogout}>
                <AdminNotificationsBroadcast />
              </DashboardLayout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <RequireAuth allowedRoles={['ADMIN', 'OFFICER']}>
              <DashboardLayout user={user} onLogout={handleLogout}>
                <AdminSettings />
              </DashboardLayout>
            </RequireAuth>
          } 
        />

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
