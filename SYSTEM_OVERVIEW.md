# CSE Department Management System

## 🎯 System Purpose

This is a **single department management system** specifically designed for the **Computer Science & Engineering (CSE) Department**. It manages students, teachers, employees, and administrative tasks for one department only.

## 👥 Four User Roles

### 1. **Student** 👨‍🎓

- Can self-register via signup form or Google OAuth
- Must wait for admin approval before accessing the system
- Can manage their profile after approval
- View their academic information on dashboard

### 2. **Teacher** 👨‍🏫

- Faculty members of the CSE department
- Accounts created by admin only
- Can manage their profile (designation, specialization, office room, etc.)
- View their information on dashboard

### 3. **Employee** 👷

- Non-teaching staff members
- Accounts created by admin only
- Can manage their profile (designation, section, etc.)
- View their information on dashboard

### 4. **Admin** 🔐

- Department administrator with full control
- Can approve/reject student registrations
- Can manage (add, edit, delete) teachers and employees
- View department statistics and charts

## 🔄 Student Registration & Approval Workflow

This is the **core workflow** of the system:

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  1. STUDENT SIGNS UP                                          │
│     → Via signup form (email/password)                        │
│     → Or via Google OAuth                                     │
│     → Status: PENDING                                         │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  2. STUDENT DATA APPEARS IN ADMIN PANEL                       │
│     → Admin sees student in "Pending Registrations" section   │
│     → Student details visible (name, email, batch, etc.)      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  3. ADMIN REVIEWS & DECIDES                                   │
│     → Admin clicks "Approve" button                           │
│        ✓ Status changes to APPROVED                           │
│        ✓ Student can now login                                │
│                                                               │
│     → OR Admin clicks "Reject" button                         │
│        ✗ Status changes to REJECTED                           │
│        ✗ Student cannot login                                 │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  4. STUDENT LOGS IN (if approved)                             │
│     → Access student dashboard                                │
│     → View and edit profile                                   │
│     → See academic information                                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🗄️ Database Structure (SQLite)

### Tables:

1. **users** - Core authentication table
   - Stores: email, password, google_id, role, status
   - Roles: 'student', 'teacher', 'employee', 'admin'
   - Status: 'pending', 'approved', 'rejected' (for students only)

2. **students** - Student-specific data
   - name, student_id, batch, semester, cgpa, phone, blood_group, address

3. **teachers** - Faculty-specific data
   - name, teacher_id, designation, specialization, office_room, joining_date

4. **employees** - Staff-specific data
   - name, employee_id, designation, section, joining_date

5. **admins** - Administrator data
   - name

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Seed database with demo data
npm run seed

# 3. Start development server (frontend + backend)
npm run dev
```

Access the application:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🔑 Demo Login Credentials

After running `npm run seed`:

| Role     | Email                       | Password     | Status      |
| -------- | --------------------------- | ------------ | ----------- |
| Admin    | admin@cse.edu               | Admin@123    | -           |
| Teacher  | john.smith@cse.edu          | Teacher@123  | -           |
| Employee | mike.wilson@cse.edu         | Employee@123 | -           |
| Student  | alice.chen@student.cse.edu  | Student@123  | ✅ Approved |
| Student  | carol.davis@student.cse.edu | Student@123  | ⏳ Pending  |
| Student  | emma.white@student.cse.edu  | Student@123  | ❌ Rejected |

## 📊 Admin Dashboard Features

1. **Statistics Cards**
   - Total Students
   - Pending Approvals (highlighted)
   - Active Teachers
   - Employees

2. **Charts**
   - Student Status Overview (Bar Chart)
   - Department Members (Pie Chart)

3. **Pending Registrations Table** (Main Feature)
   - Shows all students waiting for approval
   - Quick approve/reject buttons
   - Student details at a glance

4. **Management Pages**
   - Students: View all, approve/reject, delete
   - Teachers: Add, edit, delete
   - Employees: Add, edit, delete

## 🛠️ Technology Stack

**Frontend:**

- React 19 with Vite
- React Router v7 (routing)
- Tailwind CSS 4 + DaisyUI (styling)
- Recharts (charts)
- Axios (API calls)

**Backend:**

- Node.js + Express
- SQLite (Node.js built-in, no external dependencies)
- JWT (authentication)
- Passport.js (Google OAuth)
- bcryptjs (password hashing)

## 📁 Project Structure

```
cse-department-management/
├── server/
│   ├── database/
│   │   ├── cse_department.db      # SQLite database
│   │   ├── db.js                  # Database connection
│   │   └── seed.js                # Demo data seeder
│   ├── middleware/
│   │   └── auth.js                # JWT verification
│   ├── routes/
│   │   ├── auth.js                # Login, signup, OAuth
│   │   ├── admin.js               # Admin endpoints
│   │   ├── student.js             # Student endpoints
│   │   ├── teacher.js             # Teacher endpoints
│   │   └── employee.js            # Employee endpoints
│   └── index.js                   # Express server
├── src/
│   ├── api/
│   │   └── axios.js               # API configuration
│   ├── components/
│   │   ├── Layout.jsx             # Main layout with sidebar
│   │   └── ProtectedRoute.jsx    # Route protection
│   ├── context/
│   │   └── AuthContext.jsx        # Authentication state
│   ├── pages/
│   │   ├── admin/                 # Admin pages
│   │   ├── auth/                  # Login, signup, etc.
│   │   ├── student/               # Student pages
│   │   ├── teacher/               # Teacher pages
│   │   └── employee/              # Employee pages
│   ├── main.jsx                   # App entry + routing
│   └── index.css                  # Global styles
├── .env                           # Environment variables
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Protected API routes
- Status-based access for students
- Google OAuth integration

## 📱 Responsive Design

- Mobile-first approach
- Works on all screen sizes
- Collapsible sidebar on mobile
- Touch-friendly buttons
- Optimized tables for small screens

## 🎨 UI/UX Features

- Role-based color coding
  - Admin: Primary (purple)
  - Teacher: Info (blue)
  - Student: Secondary (pink)
  - Employee: Success (green)
- Loading states
- Error handling
- Toast notifications
- Modal dialogs
- Charts and visualizations
- Clean, modern interface

## 📝 Key Differences from Multi-Department Systems

This system is specifically designed for **single department management**:

✅ **What it does:**

- Manages ONE department (CSE)
- Simple, focused workflow
- Clear student approval process
- Direct admin control

❌ **What it doesn't do:**

- No multi-department support
- No department switching
- No cross-department data
- No department-level admins

## 🔧 Configuration

Edit `.env` file:

```env
# Server
PORT=3001

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:5173

# Session
SESSION_SECRET=your_session_secret
```

## 📄 License

This project is for educational purposes.
