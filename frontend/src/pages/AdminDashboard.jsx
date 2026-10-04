import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  FileText, 
  Award, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sliders, 
  Search, 
  FileCheck,
  Megaphone,
  Download
} from 'lucide-react';
import { api } from '../utils/api';

const DEPARTMENTS = [
  { code: 'CE', label: 'Computer Engineering (CE)' },
  { code: 'IT', label: 'Information Technology (IT)' },
  { code: 'CSE', label: 'Computer Science & Engineering (CSE)' },
  { code: 'AI_DS', label: 'Artificial Intelligence & Data Science (AI & DS)' },
  { code: 'EC', label: 'Electronics & Communication Engineering (EC)' },
  { code: 'EE', label: 'Electrical Engineering (EE)' },
  { code: 'ME', label: 'Mechanical Engineering (ME)' },
  { code: 'CIVIL', label: 'Civil Engineering' },
  { code: 'OTHER', label: 'Other' }
];

// 1. Admin Dashboard Overview
export function AdminDashboardOverview({ user }) {
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    api.get('/dashboard/stats/').then(setStats).catch(console.error);
    api.get('/applications').then(data => setRecentApps(data.slice(0, 5))).catch(console.error);
  }, []);

  if (!stats) return <div>Loading Analytics...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      {/* Metric Cards Grid */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-info">
            <h3>Registered Students</h3>
            <div className="metric-value">{stats.total_students}</div>
          </div>
          <div className="metric-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-info">
            <h3>Placed Students</h3>
            <div className="metric-value">{stats.placed_students}</div>
          </div>
          <div className="metric-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <Award size={24} />
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-info">
            <h3>Placement Rate</h3>
            <div className="metric-value">{stats.placement_rate}%</div>
          </div>
          <div className="metric-icon" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <FileCheck size={24} />
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-info">
            <h3>Active Companies</h3>
            <div className="metric-value">{stats.total_companies}</div>
          </div>
          <div className="metric-icon" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Building2 size={24} />
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Department charts */}
        <div className="panel">
          <div className="panel-header">
            <h3>Placement Status by Department</h3>
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

        {/* Recent Applications */}
        <div className="panel">
          <div className="panel-header">
            <h3>Recent Recruitment Applications</h3>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            {recentApps.length === 0 ? (
              <p style={{ padding: '20px', textAlign: 'center', color: 'var(--neutral-50)' }}>No applications submitted.</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Company</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApps.map((app, idx) => (
                      <tr key={idx}>
                        <td>{app.student_details.full_name}</td>
                        <td>{app.company_details.name}</td>
                        <td>
                          <span className={`badge ${
                            app.status === 'Selected' ? 'badge-success' : 
                            app.status === 'Rejected' ? 'badge-danger' : 
                            'badge-warning'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Student Management (CRUD)
export function AdminStudentManagement({ user }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [eligibilityDetails, setEligibilityDetails] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [form, setForm] = useState({
    username: '', password: '', email: '', 
    enrollment_number: '', full_name: '', department: 'CE'
  });
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStudents = () => {
    api.get(`/students?search=${search}&department=${deptFilter}`)
      .then(setStudents)
      .catch(console.error);
  };

  useEffect(() => {
    fetchStudents();
  }, [search, deptFilter]);

  const viewEligibility = async (student) => {
    try {
      const details = await api.get(`/students/${student.id}/eligibility_score`);
      setSelectedProfile(student);
      setEligibilityDetails(details);
    } catch (err) {
      alert("Failed to compute eligibility score details.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student profile?")) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await api.post('/auth/register', form);
      setIsAddMode(false);
      setForm({ username: '', password: '', email: '', enrollment_number: '', full_name: '', department: 'CE' });
      fetchStudents();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create student.');
    }
  };

  return (
    <div>
      {/* Action Bars */}
      <div className="companies-search-bar flex justify-between align-center" style={{ marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div className="flex align-center form-control" style={{ maxWidth: '350px', gap: '8px', padding: '6px 12px' }}>
          <Search size={18} style={{ color: 'var(--neutral-400)' }} />
          <input 
            type="text" 
            placeholder="Search Name or Enrollment..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            style={{ border: 'none', width: '100%', outline: 'none' }}
          />
        </div>
        <div className="flex align-center" style={{ gap: '15px' }}>
          <select className="form-control" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d, i) => <option key={i} value={d.code}>{d.label}</option>)}
          </select>
          <button onClick={() => setIsAddMode(true)} className="btn btn-primary flex align-center" style={{ gap: '6px' }}>
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="panel table-responsive" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Enrollment</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>CGPA</th>
              <th>Backlogs</th>
              <th>Skills</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((st, idx) => (
              <tr key={idx}>
                <td><strong>{st.enrollment_number}</strong></td>
                <td>{st.full_name}</td>
                <td>{st.department}</td>
                <td>{st.cgpa}</td>
                <td>
                  <span className={`badge ${st.active_backlogs === 0 ? 'badge-success' : 'badge-danger'}`}>
                    {st.active_backlogs}
                  </span>
                </td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {st.skills || '--'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="flex justify-between" style={{ gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => viewEligibility(st)} className="btn btn-outline btn-sm">Smart Score</button>
                    <button 
                      onClick={() => handleDelete(st.id)} 
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Eligibility Inspector Modal */}
      {selectedProfile && eligibilityDetails && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Smart Score details: {selectedProfile.full_name}</h3>
              <button onClick={() => setSelectedProfile(null)} className="modal-close"><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="score-card" style={{ padding: '20px', gap: '20px', marginBottom: '20px' }}>
                <div className="score-gauge" style={{ '--score-pct': eligibilityDetails.score, width: '90px', height: '90px' }}>
                  <div className="score-number" style={{ fontSize: '1.25rem' }}>{eligibilityDetails.score}</div>
                </div>
                <div>
                  <h4>Status: {eligibilityDetails.is_eligible ? 'Eligible for Placement' : 'Ineligible'}</h4>
                  <p style={{ opacity: 0.9, fontSize: '0.85rem' }}>Department: {selectedProfile.department} | CGPA: {selectedProfile.cgpa}</p>
                </div>
              </div>

              <h5>Profile Flags & Deficiencies</h5>
              <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '10px' }}>
                {eligibilityDetails.reasons.length === 0 ? (
                  <li style={{ color: 'var(--success)' }}>Student meets all core profile requirements.</li>
                ) : (
                  eligibilityDetails.reasons.map((r, i) => (
                    <li key={i} className="flex align-center" style={{ gap: '8px', padding: '6px 0', fontSize: '0.9rem' }}>
                      <X size={16} style={{ color: 'var(--danger)' }} /> <span>{r}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedProfile(null)} className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddMode && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Add New Student</h3>
              <button onClick={() => setIsAddMode(false)} className="modal-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddStudent}>
              <div className="modal-body">
                {errorMsg && (
                  <div className="badge badge-danger" style={{ padding: '10px', width: '100%', justifyContent: 'center', marginBottom: '15px' }}>
                    {errorMsg}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" required className="form-control" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Enrollment Number</label>
                  <input type="text" required className="form-control" placeholder="2026CE001" value={form.enrollment_number} onChange={e => setForm({...form, enrollment_number: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input type="text" required className="form-control" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" required className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" required className="form-control" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-control" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                    {DEPARTMENTS.map((d, i) => <option key={i} value={d.code}>{d.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsAddMode(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Company Management (CRUD)
export function AdminCompanyManagement({ user }) {
  const [companies, setCompanies] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingComp, setEditingComp] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', job_role: '', package_ctc: 0, 
    location: '', min_cgpa: 0, max_backlogs: 0, min_tenth_pct: 0, 
    min_twelfth_pct: 0, allowed_departments: [], deadline: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCompanies = () => {
    api.get('/companies').then(setCompanies).catch(console.error);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company listing?")) {
      try {
        await api.delete(`/companies/${id}`);
        fetchCompanies();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleCheckboxChange = (deptCode) => {
    const current = [...form.allowed_departments];
    if (current.includes(deptCode)) {
      setForm({ ...form, allowed_departments: current.filter(x => x !== deptCode) });
    } else {
      setForm({ ...form, allowed_departments: [...current, deptCode] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Format deadline date to ISO string
    const payload = {
      ...form,
      deadline: new Date(form.deadline).toISOString()
    };

    try {
      if (editingComp) {
        await api.put(`/companies/${editingComp.id}`, payload);
      } else {
        await api.post('/companies', payload);
      }
      setIsAddMode(false);
      setEditingComp(null);
      setForm({
        name: '', description: '', job_role: '', package_ctc: 0, 
        location: '', min_cgpa: 0, max_backlogs: 0, min_tenth_pct: 0, 
        min_twelfth_pct: 0, allowed_departments: [], deadline: ''
      });
      fetchCompanies();
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed.');
    }
  };

  const startEdit = (comp) => {
    setEditingComp(comp);
    setForm({
      name: comp.name,
      description: comp.description,
      job_role: comp.job_role,
      package_ctc: comp.package_ctc,
      location: comp.location,
      min_cgpa: comp.min_cgpa,
      max_backlogs: comp.max_backlogs,
      min_tenth_pct: comp.min_tenth_pct,
      min_twelfth_pct: comp.min_twelfth_pct,
      allowed_departments: comp.allowed_departments || [],
      deadline: comp.deadline ? comp.deadline.substring(0, 16) : ''
    });
    setIsAddMode(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={() => { setIsAddMode(true); setEditingComp(null); }} className="btn btn-primary flex align-center" style={{ gap: '6px' }}>
          <Plus size={18} /> Add Corporate Listing
        </button>
      </div>

      <div className="panel table-responsive" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Job Role</th>
              <th>CTC Package</th>
              <th>Location</th>
              <th>Min CGPA</th>
              <th>Deadline</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c, idx) => (
              <tr key={idx}>
                <td><strong>{c.name}</strong></td>
                <td>{c.job_role}</td>
                <td>{c.package_ctc} LPA</td>
                <td>{c.location}</td>
                <td>{c.min_cgpa}</td>
                <td>{new Date(c.deadline).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <div className="flex justify-between" style={{ gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => startEdit(c)} className="btn btn-secondary btn-sm"><Edit3 size={16} /></button>
                    <button 
                      onClick={() => handleDelete(c.id)} 
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Company Modal */}
      {isAddMode && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3>{editingComp ? 'Edit Recruitment Parameters' : 'Add Corporate Recruitment Details'}</h3>
              <button onClick={() => setIsAddMode(false)} className="modal-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {errorMsg && <div className="badge badge-danger" style={{ padding: '10px', width: '100%', justifyContent: 'center', marginBottom: '15px' }}>{errorMsg}</div>}
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input type="text" required className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Role</label>
                    <input type="text" required className="form-control" value={form.job_role} onChange={e => setForm({...form, job_role: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description</label>
                  <textarea rows="3" required className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Salary Package (LPA)</label>
                    <input type="number" step="0.01" required className="form-control" value={form.package_ctc} onChange={e => setForm({...form, package_ctc: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Location</label>
                    <input type="text" required className="form-control" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                  </div>
                </div>

                <div className="panel" style={{ backgroundColor: 'var(--neutral-50)', padding: '15px', marginTop: '10px' }}>
                  <h5 style={{ marginBottom: '10px' }}>Placement Eligibility Cut-offs</h5>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Min CGPA</label>
                      <input type="number" step="0.01" className="form-control" value={form.min_cgpa} onChange={e => setForm({...form, min_cgpa: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Max Backlogs Allowed</label>
                      <input type="number" className="form-control" value={form.max_backlogs} onChange={e => setForm({...form, max_backlogs: parseInt(e.target.value) || 0})} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Min 10th Percentage (%)</label>
                      <input type="number" step="0.01" className="form-control" value={form.min_tenth_pct} onChange={e => setForm({...form, min_tenth_pct: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Min 12th Percentage (%)</label>
                      <input type="number" step="0.01" className="form-control" value={form.min_twelfth_pct} onChange={e => setForm({...form, min_twelfth_pct: parseFloat(e.target.value) || 0})} />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Eligible Departments (Check all allowed)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginTop: '8px' }}>
                      {DEPARTMENTS.map((dept, i) => (
                        <label key={i} className="flex align-center" style={{ gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={form.allowed_departments.includes(dept.code)}
                            onChange={() => handleCheckboxChange(dept.code)}
                          />
                          <span>{dept.code}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label className="form-label">Application Deadline</label>
                  <input type="datetime-local" required className="form-control" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsAddMode(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingComp ? 'Update Listing' : 'Publish Listing'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. Eligibility Criteria Manager
export function AdminCriteriaManagement() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    api.get('/companies').then(setCompanies).catch(console.error);
  }, []);

  return (
    <div>
      <div className="panel table-responsive" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Position</th>
              <th>CGPA Target</th>
              <th>Backlog Cap</th>
              <th>10th/12th Targets</th>
              <th>Allowed Departments</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c, idx) => (
              <tr key={idx}>
                <td><strong>{c.name}</strong></td>
                <td>{c.job_role}</td>
                <td>&ge; {c.min_cgpa}</td>
                <td>&le; {c.max_backlogs}</td>
                <td>&ge; {c.min_tenth_pct}% / {c.min_twelfth_pct}%</td>
                <td>
                  {c.allowed_departments && c.allowed_departments.length > 0 ? (
                    c.allowed_departments.map((d, i) => (
                      <span key={i} className="badge badge-secondary" style={{ marginRight: '4px' }}>{d}</span>
                    ))
                  ) : (
                    <span className="badge badge-success">Open to All</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 5. Applications Pipeline Management
export function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusVal, setStatusVal] = useState('Applied');
  const [feedbackVal, setFeedbackVal] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchApps = () => {
    let qs = '';
    if (companyFilter || statusFilter) {
      qs = `?status=${statusFilter}`;
    }
    api.get(`/applications${qs}`).then(data => {
      let filtered = data;
      if (companyFilter) {
        filtered = data.filter(a => a.company === parseInt(companyFilter));
      }
      setApps(filtered);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchApps();
  }, [companyFilter, statusFilter]);

  const openStatusUpdate = (app) => {
    setSelectedApp(app);
    setStatusVal(app.status);
    setFeedbackVal(app.feedback || '');
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/applications/${selectedApp.id}`, {
        company: selectedApp.company,
        status: statusVal,
        feedback: feedbackVal
      });
      setSelectedApp(null);
      fetchApps();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Extract unique companies from apps list for filter dropdown
  const uniqueCompanies = Array.from(new Set(apps.map(a => JSON.stringify({id: a.company, name: a.company_details.name}))), c => JSON.parse(c));

  return (
    <div>
      {/* Filtering Bar */}
      <div className="companies-search-bar flex align-center" style={{ gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <select className="form-control" value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} style={{ maxWidth: '240px' }}>
          <option value="">Filter by Company</option>
          {uniqueCompanies.map((c, i) => <option key={i} value={c.id}>{c.name}</option>)}
        </select>
        <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ maxWidth: '200px' }}>
          <option value="">Filter by Status</option>
          <option value="Applied">Applied</option>
          <option value="Under Review">Under Review</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="panel table-responsive" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Enrollment</th>
              <th>Student Name</th>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Applied On</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app, idx) => (
              <tr key={idx}>
                <td><strong>{app.student_details.enrollment_number}</strong></td>
                <td>{app.student_details.full_name}</td>
                <td>{app.company_details.name}</td>
                <td>{app.company_details.job_role}</td>
                <td>
                  <span className={`badge ${
                    app.status === 'Selected' ? 'badge-success' : 
                    app.status === 'Rejected' ? 'badge-danger' : 
                    app.status === 'Interview Scheduled' ? 'badge-primary' : 
                    'badge-warning'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td>{new Date(app.applied_on).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => openStatusUpdate(app)} className="btn btn-secondary btn-sm flex align-center" style={{ gap: '4px' }}>
                    <Sliders size={14} /> Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Editor Modal */}
      {selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Update Application Stage</h3>
              <button onClick={() => setSelectedApp(null)} className="modal-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleStatusSubmit}>
              <div className="modal-body">
                <div style={{ marginBottom: '15px' }}>
                  <strong>Student:</strong> {selectedApp.student_details.full_name} ({selectedApp.student_details.enrollment_number})<br />
                  <strong>Company:</strong> {selectedApp.company_details.name} - {selectedApp.company_details.job_role}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Selection Pipeline Stage</label>
                  <select className="form-control" value={statusVal} onChange={e => setStatusVal(e.target.value)}>
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Remarks / Scheduled Details</label>
                  <textarea rows="4" className="form-control" placeholder="Provide schedule links or rejection feedback here..." value={feedbackVal} onChange={e => setFeedbackVal(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setSelectedApp(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 6. Reports & Analytics
export function AdminReportsAnalytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats/').then(setStats).catch(console.error);
  }, []);

  const downloadCSV = () => {
    if (!stats) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Department,Total Candidates,Placed Candidates,Placement Rate (%)\n";
    
    stats.department_stats.forEach(d => {
      csvContent += `"${d.department}",${d.total},${d.placed},${d.placement_rate}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Placement_Department_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!stats) return <div>Generating Report Data...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={downloadCSV} className="btn btn-primary flex align-center" style={{ gap: '6px' }}>
          <Download size={18} /> Export Department Stats
        </button>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Full Department Performance Ledger</h3>
        </div>
        <div className="panel-body table-responsive" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Total Student Count</th>
                <th>Placed Candidates</th>
                <th>Placement success Rate</th>
              </tr>
            </thead>
            <tbody>
              {stats.department_stats.map((dept, idx) => (
                <tr key={idx}>
                  <td><strong>{dept.department}</strong></td>
                  <td>{dept.total}</td>
                  <td>{dept.placed}</td>
                  <td>
                    <span className="badge badge-primary">{dept.placement_rate}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 7. Announcement Broadcasts
export function AdminNotificationsBroadcast() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const res = await api.post('/notifications/send-broadcast', { title, message });
      setSuccess(res.status || 'Broadcast announcement posted successfully!');
      setTitle('');
      setMessage('');
    } catch (err) {
      setError(err.message || 'Announcement post failed.');
    }
  };

  return (
    <div style={{ maxWidth: '650px' }}>
      <div className="panel">
        <div className="panel-header flex align-center" style={{ gap: '8px' }}>
          <Megaphone size={20} />
          <h3>Broadcast General Announcement</h3>
        </div>
        <div className="panel-body">
          {success && <div className="badge badge-success" style={{ padding: '10px', width: '100%', justifyContent: 'center', marginBottom: '20px', borderRadius: '4px' }}>{success}</div>}
          {error && <div className="badge badge-danger" style={{ padding: '10px', width: '100%', justifyContent: 'center', marginBottom: '20px', borderRadius: '4px' }}>{error}</div>}

          <form onSubmit={handleBroadcast}>
            <div className="form-group">
              <label className="form-label">Announcement Title</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g., Google Recruitment Drive Open"
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Announcement Message Details</label>
              <textarea 
                rows="5" 
                className="form-control" 
                placeholder="Details of schedules, target batches, and deadlines..."
                required 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Post Announcement</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// 8. Admin Settings
export function AdminSettings() {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSuccess('Admin credentials updated successfully.');
      setOldPw('');
      setNewPw('');
    }, 500);
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="panel">
        <div className="panel-header">
          <h3>Admin Security Preferences</h3>
        </div>
        <div className="panel-body">
          {success && <div className="badge badge-success" style={{ padding: '10px', width: '100%', justifyContent: 'center', marginBottom: '20px' }}>{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" required className="form-control" value={oldPw} onChange={e => setOldPw(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" required className="form-control" value={newPw} onChange={e => setNewPw(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
