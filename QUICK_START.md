# 🚀 Quick Start Guide

## CSE Department Management System

This is a **single department management system** for the Computer Science & Engineering (CSE) Department.

---

## 📦 Installation

```bash
# Install all dependencies
npm install
```

---

## 🗄️ Database Setup

```bash
# Populate database with demo data
npm run seed
```

This will create:

- 1 Admin account
- 3 Teacher accounts
- 2 Employee accounts
- 5 Student accounts (with different statuses)

---

## 🏃 Run the Application

```bash
# Start both frontend and backend
npm run dev
```

Or run them separately:

```bash
# Frontend only (Vite)
npm run dev:frontend

# Backend only (Node.js)
npm run dev:backend
```

**Access the application:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## 🔑 Login Credentials

### Admin (Full Control)

- **Email**: admin@cse.edu
- **Password**: Admin@123

### Teacher (Faculty)

- **Email**: john.smith@cse.edu
- **Password**: Teacher@123

### Employee (Staff)

- **Email**: mike.wilson@cse.edu
- **Password**: Employee@123

### Student (Approved - Can Login)

- **Email**: alice.chen@student.cse.edu
- **Password**: Student@123

### Student (Pending - Cannot Login Yet)

- **Email**: carol.davis@student.cse.edu
- **Password**: Student@123
- **Note**: Login as admin to approve this student first

### Student (Rejected - Cannot Login)

- **Email**: emma.white@student.cse.edu
- **Password**: Student@123
- **Note**: This student was rejected by admin

---

## 🔄 Test the Student Approval Workflow

### Step 1: Register a New Student

1. Go to http://localhost:5173
2. Click "Register here" link
3. Fill in the signup form
4. Submit (student status = PENDING)

### Step 2: Login as Admin

1. Go to http://localhost:5173/login
2. Login with: admin@cse.edu / Admin@123
3. You'll see the admin dashboard

### Step 3: Review Pending Students

1. Look at the "Pending Student Registrations" section
2. You'll see your newly registered student
3. Click "✓ Approve" to approve
4. OR click "✕ Reject" to reject

### Step 4: Student Can Now Login

1. Logout from admin
2. Login with the student credentials
3. Student can now access their dashboard!

---

## 📊 Admin Features

### Dashboard

- View statistics (total students, pending approvals, teachers, employees)
- See charts (student status, department members)
- Quick approve/reject pending students

### Students Page

- View all students (filter by status)
- Search by name or email
- Approve/reject/delete students

### Teachers Page

- Add new teachers
- Edit teacher information
- Delete teachers

### Employees Page

- Add new employees
- Edit employee information
- Delete employees

---

## 👨‍🎓 Student Features

- Register via signup form or Google OAuth
- View dashboard after approval
- Edit profile (name, phone, batch, semester, CGPA, blood group, address)
- See academic information

---

## 👨‍🏫 Teacher Features

- View dashboard
- Edit profile (name, phone, designation, specialization, office room)
- See faculty information

---

## 👷 Employee Features

- View dashboard
- Edit profile (name, phone, designation, section)
- See staff information

---

## 🛠️ Other Commands

```bash
# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

---

## 🔧 Configuration

Edit `.env` file to configure:

```env
# Server port
PORT=3001

# JWT secret (change in production!)
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Session secret (change in production!)
SESSION_SECRET=your_session_secret
```

---

## 📱 Responsive Design

The application works on:

- 💻 Desktop computers
- 📱 Tablets
- 📱 Mobile phones

---

## 🆘 Troubleshooting

### Database not found?

```bash
npm run seed
```

### Port already in use?

Change `PORT` in `.env` file

### Google OAuth not working?

1. Get credentials from https://console.cloud.google.com/
2. Add them to `.env` file
3. Add authorized redirect URI: http://localhost:3001/api/auth/google/callback

### Can't login as student?

Check student status:

- Login as admin
- Go to Students page
- Find the student
- Make sure status is "Approved"

---

## 📚 Documentation

- **README.md** - Full project documentation
- **SYSTEM_OVERVIEW.md** - Detailed system architecture
- **CHANGES_MADE.md** - List of all changes made
- **QUICK_START.md** - This file!

---

## 🎯 Key Points to Remember

1. This manages a **single CSE department** (not multiple departments)
2. **Students must be approved** by admin before they can login
3. **Teachers and employees** are created by admin only
4. The system has **4 roles**: Student, Teacher, Employee, Admin
5. Uses **SQLite** database (no external database needed)
6. Built with **React + Node.js + Express**

---

## ✨ Enjoy using the CSE Department Management System!

For questions or issues, refer to the documentation files or check the code comments.
