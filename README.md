# 🎓 College Placement Eligibility Management System

A full-stack web application to manage college placement drives — connecting students, placement officers, and companies in one platform.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router v7, Vite, Lucide Icons |
| **Backend** | Django 6, Django REST Framework |
| **Database** | SQLite (development) |
| **Auth** | Token-based Authentication (DRF AuthToken) |
| **API** | RESTful API with CORS support |

---

## ✨ Features

### 👨‍🎓 Student Portal
- Register & login securely
- Complete academic & professional profile (CGPA, backlogs, 10th/12th %)
- Upload resume, photo, LinkedIn & GitHub links
- **Eligibility Checker** — instantly see which companies you qualify for
- Browse available companies & job roles
- Apply to companies and track application status
- Receive real-time notifications

### 🛠️ Admin / Placement Officer Portal
- Manage all student profiles
- Add & manage companies with eligibility criteria
- Set criteria: min CGPA, max backlogs, allowed departments, 10th/12th cutoffs
- Review and update application statuses
- Broadcast notifications to students
- View analytics & placement reports

---

## 📁 Project Structure

```
College-Placement-Eligibility-Management-System/
│
├── backend/                    # Django Backend
│   ├── api/                    # Main app (models, views, serializers)
│   │   ├── models.py           # CustomUser, StudentProfile, Company, Application, Notification
│   │   ├── views.py            # API views
│   │   ├── serializers.py      # DRF serializers
│   │   └── urls.py             # API routes
│   ├── backend/                # Django project settings
│   │   └── settings.py
│   ├── manage.py
│   ├── seed.py                 # Sample data seeder
│   └── requirements.txt
│
└── frontend/                   # React + Vite Frontend
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── pages/              # Page-level components
    │   ├── utils/              # Helper utilities
    │   ├── App.jsx             # Main router & layout
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

---

### 🔧 Backend Setup

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# (Optional) Seed sample data
python seed.py

# Start Django development server
python manage.py runserver
```

Backend will run at: **http://localhost:8000/**

---

### 💻 Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

Frontend will run at: **http://localhost:5173/**

---

## 🔑 User Roles

| Role | Access |
|------|--------|
| `STUDENT` | Register, view companies, check eligibility, apply |
| `OFFICER` | Manage students, companies, applications, notifications |
| `ADMIN` | Full access including system settings |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login/` | User login |
| POST | `/api/register/` | Student registration |
| GET | `/api/profile/` | Get student profile |
| PUT | `/api/profile/update/` | Update student profile |
| GET | `/api/companies/` | List all companies |
| POST | `/api/apply/` | Apply to a company |
| GET | `/api/applications/` | View my applications |
| GET | `/api/notifications/` | View notifications |
| GET | `/api/admin/students/` | Admin: list all students |
| POST | `/api/admin/companies/` | Admin: add a company |

---

## 🗂️ Departments Supported

- Computer Engineering (CE)
- Information Technology (IT)
- Computer Science & Engineering (CSE)
- Artificial Intelligence & Data Science (AI & DS)
- Electronics & Communication Engineering (EC)
- Electrical Engineering (EE)
- Mechanical Engineering (ME)
- Civil Engineering

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

Made with ❤️ for college placement management.
