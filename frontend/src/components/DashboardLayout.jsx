import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  LayoutDashboard, 
  UserCircle, 
  CheckSquare, 
  Building2, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  Users, 
  Sliders, 
  BarChart3
} from 'lucide-react';
import { api } from '../utils/api';

export default function DashboardLayout({ children, user, profile, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch notifications count if logged in
    const fetchNotifications = async () => {
      try {
        const notifs = await api.get('/notifications');
        setUnreadCount(notifs.filter(n => !n.is_read).length);
      } catch (err) {
        console.error("Failed to fetch notification count", err);
      }
    };
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  if (!user) return null;

  const isStudent = user.role === 'STUDENT';

  // Menu items config based on role
  const menuItems = isStudent ? [
    { label: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'My Profile', path: '/student/profile', icon: <UserCircle size={20} /> },
    { label: 'Eligibility Checker', path: '/student/eligibility-checker', icon: <CheckSquare size={20} /> },
    { label: 'Eligible Companies', path: '/student/companies', icon: <Building2 size={20} /> },
    { label: 'My Applications', path: '/student/applications', icon: <FileText size={20} /> },
    { label: 'Notifications', path: '/student/notifications', icon: <Bell size={20} /> },
    { label: 'Settings', path: '/student/settings', icon: <Settings size={20} /> },
  ] : [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Student Management', path: '/admin/students', icon: <Users size={20} /> },
    { label: 'Company Management', path: '/admin/companies', icon: <Building2 size={20} /> },
    { label: 'Eligibility Criteria', path: '/admin/criteria', icon: <Sliders size={20} /> },
    { label: 'Applications', path: '/admin/applications', icon: <FileText size={20} /> },
    { label: 'Reports & Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    { label: 'Notifications', path: '/admin/notifications', icon: <Bell size={20} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const getPageTitle = () => {
    const matched = menuItems.find(item => item.path === location.pathname);
    return matched ? matched.label : 'Placement Dashboard';
  };

  const getInitials = () => {
    if (isStudent && profile) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo flex align-center" style={{ gap: '10px' }}>
          <GraduationCap size={28} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: '700' }}>PlacementPro</span>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item, idx) => (
            <li 
              key={idx} 
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <NavLink to={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <div className="sidebar-logout" onClick={onLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="main-content">
        <header className="topbar">
          <h2 className="topbar-title">{getPageTitle()}</h2>
          <div className="topbar-right">
            {/* Notification Indicator */}
            <div 
              className="notification-bell-wrap" 
              onClick={() => navigate(isStudent ? '/student/notifications' : '/admin/notifications')}
            >
              <Bell size={22} />
              {unreadCount > 0 && <span className="notification-badge" />}
            </div>

            {/* Profile Snip */}
            <div className="user-profile-snippet">
              {isStudent && profile?.photo ? (
                <img 
                  src={profile.photo.startsWith('http') ? profile.photo : `${api.baseUrl}${profile.photo}`} 
                  alt="Student Photo" 
                  className="user-avatar" 
                />
              ) : (
                <div className="user-avatar">{getInitials()}</div>
              )}
              <div className="user-info">
                <span className="user-name">
                  {isStudent ? (profile?.full_name || 'Student') : user.username}
                </span>
                <span className="user-role">
                  {user.role === 'ADMIN' ? 'Administrator' : user.role === 'OFFICER' ? 'Placement Officer' : 'Student'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
}
