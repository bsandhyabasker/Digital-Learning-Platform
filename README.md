# EduPulse — Enterprise Academic Management Platform

A complete, fully functional full-stack **MERN** educational platform with role-based access control, interconnected modules, and a distinctive **professional red-themed** UI.

---

## 🏗️ Technology Stack

| Layer       | Technology                             |
|-------------|----------------------------------------|
| Frontend    | React 19, Vite, React Router, Axios    |
| Backend     | Node.js, Express.js                    |
| Database    | MongoDB, Mongoose                      |
| Auth        | JWT (jsonwebtoken), bcryptjs           |
| Styling     | Vanilla CSS (custom design system)     |
| Icons       | Lucide React                           |
| Charts      | Custom SVG chart components            |

---

## 👥 User Roles & Demo Accounts

| Role    | Email                     | Password      |
|---------|---------------------------|---------------|
| Student | student@edupulse.edu      | Student@123   |
| Faculty | faculty@edupulse.edu      | Faculty@123   |
| Admin   | admin@edupulse.edu        | Admin@123     |
| At-Risk | david.kim@edupulse.edu    | Student@123   |

---

## 📁 Project Structure

```
Learning Platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Route handlers (10 controllers)
│   │   ├── middleware/       # Auth, RBAC, error handling
│   │   ├── models/          # Mongoose schemas (11 models)
│   │   ├── routes/          # Express routes (10 route files)
│   │   ├── seeds/           # Seed data & seeder script
│   │   ├── services/        # Business logic layer
│   │   └── server.js        # Express app entry point
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/      # SVG chart widgets
│   │   │   └── common/      # Navbar, Sidebar, DataTable, etc.
│   │   ├── context/         # Auth, Notification, Theme providers
│   │   ├── pages/
│   │   │   ├── admin/       # Admin dashboard, user mgmt, audit, analytics
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── faculty/     # Dashboard, courses, grading, attendance, analytics
│   │   │   ├── shared/      # Forum, Profile, 404
│   │   │   └── student/     # Dashboard, courses, assignments, quizzes, attendance, analytics
│   │   ├── services/        # API service layer (Axios)
│   │   └── styles/          # Design system CSS
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 🗄️ MongoDB Collections & Relationships

```
Users ──────┬───> Courses (faculty creates)
            │       ├──> Enrollments (students enroll)
            │       ├──> Assignments ──> Submissions
            │       ├──> Quizzes ──> QuizAttempts
            │       ├──> Attendance (sessions with per-student records)
            │       └──> DiscussionTopics (with replies)
            │
            └───> Notifications (cross-module)
                  Performance (computed analytics)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/edupulse_db
JWT_SECRET=edupulse_super_secret_jwt_key_2026_enterprise_production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates realistic interconnected data: users, courses, enrollments, assignments, submissions, quizzes, quiz attempts, attendance records, discussion topics, and notifications.

### 4. Start the Application

```bash
# Terminal 1 — Backend
cd backend
npm run dev    # Runs on http://localhost:5000

# Terminal 2 — Frontend  
cd frontend
npm run dev    # Runs on http://localhost:5173
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| POST   | /api/auth/register    | Register new user     |
| POST   | /api/auth/login       | Login & get JWT       |
| GET    | /api/auth/me          | Get current user      |

### Courses
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | /api/courses                      | List all courses         |
| POST   | /api/courses                      | Create course (Faculty)  |
| GET    | /api/courses/:id                  | Get course details       |
| PUT    | /api/courses/:id                  | Update course            |
| POST   | /api/courses/:id/enroll           | Enroll student           |
| GET    | /api/courses/my/enrolled          | My enrolled courses      |
| GET    | /api/courses/my/teaching          | My teaching courses      |

### Assignments
| Method | Endpoint                   | Description                |
|--------|----------------------------|----------------------------|
| GET    | /api/assignments           | List assignments           |
| POST   | /api/assignments           | Create assignment (Faculty)|
| GET    | /api/assignments/student   | Student's assignments      |

### Submissions
| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| POST   | /api/submissions           | Submit assignment        |
| GET    | /api/submissions/assignment/:id | Get submissions     |
| PUT    | /api/submissions/:id/grade | Grade submission (Faculty)|

### Quizzes
| Method | Endpoint                    | Description             |
|--------|-----------------------------|-------------------------|
| GET    | /api/quizzes                | List quizzes            |
| POST   | /api/quizzes                | Create quiz (Faculty)   |
| POST   | /api/quizzes/:id/attempt    | Submit quiz attempt     |
| GET    | /api/quizzes/student/attempts | Student's attempts    |

### Attendance
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | /api/attendance             | Record attendance        |
| GET    | /api/attendance/course/:id  | Get course attendance    |
| GET    | /api/attendance/student     | Student's attendance     |

### Discussions
| Method | Endpoint                        | Description             |
|--------|---------------------------------|-------------------------|
| GET    | /api/discussions                | List topics             |
| POST   | /api/discussions                | Create topic            |
| POST   | /api/discussions/:id/replies    | Add reply               |

### Notifications
| Method | Endpoint                        | Description             |
|--------|---------------------------------|-------------------------|
| GET    | /api/notifications              | Get notifications       |
| PUT    | /api/notifications/read-all     | Mark all as read        |

### Analytics
| Method | Endpoint                        | Description             |
|--------|---------------------------------|-------------------------|
| GET    | /api/analytics/student          | Student analytics       |
| GET    | /api/analytics/faculty          | Faculty analytics       |
| GET    | /api/analytics/admin            | Admin platform analytics|

### Users (Admin)
| Method | Endpoint               | Description            |
|--------|------------------------|------------------------|
| GET    | /api/users             | List all users         |
| PUT    | /api/users/:id/status  | Toggle active status   |

---

## 🎨 Design System

The application uses a **professional red-based visual identity**:

- **Primary**: Deep Crimson (`#c02828`) — buttons, active navigation, key indicators
- **Background**: Warm neutral tones (`#faf8f7`, `#f5f0ee`)
- **Text**: Dark charcoal (`#1c1210`) with warm secondary tones
- **Accents**: Rose (`#e85d5d`) for highlights, success green, warning amber
- **Typography**: Plus Jakarta Sans (headings) + Inter (body)
- **Dark mode**: Full dark mode support with red accent retention

---

## 🔧 Core Features

### Student Portal
- Dashboard with today's tasks, upcoming deadlines, and recent grades
- Course catalog with enrollment + detailed course hub
- Assignment viewing and submission
- Quiz taking with auto-grading and results review
- Attendance tracking with at-risk warnings
- Performance analytics with competency radar charts

### Faculty Suite
- Teaching overview dashboard
- Course creation with syllabus builder & module management
- Assignment creation and submission grading panel
- Quiz builder with MCQ, T/F, and short answer support
- Attendance logger with session management
- Cohort analytics and student performance tracking

### Admin Console
- Executive overview with platform-wide metrics
- User management (create, search, toggle status)
- Course catalog audit
- System analytics with enrollment and activity trends

### Shared Features
- Discussion forums with threaded replies and endorsements
- Notification center with real-time updates
- Role-based navigation and permissions
- Light/Dark mode toggle
- Responsive design for all screen sizes

---

## License

MIT
