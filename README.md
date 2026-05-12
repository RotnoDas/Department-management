# CSE Department Management System

A comprehensive management system for Computer Science & Engineering (CSE) Department to manage students, teachers, employees, and administrative tasks.

## 🎯 Overview

This system manages a **single CSE department** with four user roles:

- **Students** - Can register and manage their profiles after admin approval
- **Teachers** - Faculty members with profile management
- **Employees** - Non-teaching staff members
- **Admin** - Department administrators with full control

## 🔄 Student Registration Workflow

1. **Student Signs Up** - New students register via signup form or Google OAuth
2. **Pending Approval** - Student data appears in admin panel with "pending" status
3. **Admin Reviews** - Admin can approve or reject the student registration
4. **Student Login** - After approval, student can login and access their dashboard

## 🛠️ Tech Stack

**Frontend:**

- React 19 + Vite
- React Router v7
- Tailwind CSS 4 + DaisyUI
- Recharts (for charts)
- Axios

**Backend:**

- Node.js + Express
- SQLite Database (Node.js built-in)
- JWT Authentication
- Passport.js (Google OAuth)
- bcryptjs (Password hashing)

## 🚀 Getting Started

### Prerequisites

- Node.js v22+ (for built-in SQLite support)

### Installation

```bash
# Install dependencies
npm install

# Seed database with demo data
npm run seed

# Run development server (frontend + backend)
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📝 Demo Credentials

After running `npm run seed`, you can login with:

| Role     | Email                       | Password     | Status   |
| -------- | --------------------------- | ------------ | -------- |
| Admin    | admin@cse.edu               | Admin@123    | -        |
| Teacher  | john.smith@cse.edu          | Teacher@123  | -        |
| Employee | mike.wilson@cse.edu         | Employee@123 | -        |
| Student  | alice.chen@student.cse.edu  | Student@123  | Approved |
| Student  | carol.davis@student.cse.edu | Student@123  | Pending  |

## 📦 Available Scripts

```bash
npm run dev              # Run both frontend & backend
npm run dev:frontend     # Run frontend only
npm run dev:backend      # Run backend only
npm run seed             # Populate database with demo data
npm run build            # Build for production
npm run lint             # Run ESLint
```

## 🔐 Authentication

- **Email/Password** - Traditional login
- **Google OAuth** - Social login (requires Google API credentials in `.env`)

## 📊 Features

### Admin Panel

- Dashboard with statistics and charts
- View all pending student registrations
- Approve or reject student applications
- Manage teachers (add, edit, delete)
- Manage employees (add, edit, delete)
- Manage students (view, delete)

### Student Portal

- Self-registration
- Profile management (personal info, academic details)
- Dashboard with academic information
- Status-based access control

### Teacher Portal

- Profile management
- Dashboard with faculty information

### Employee Portal

- Profile management
- Dashboard with staff information

## 🗄️ Database Schema

The SQLite database includes:

- `users` - Authentication and role management
- `students` - Student-specific data
- `teachers` - Faculty data
- `employees` - Staff data
- `admins` - Administrator data

## 🔧 Configuration

Copy `.env` file and update with your credentials:

- `JWT_SECRET` - Secret key for JWT tokens
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `FRONTEND_URL` - Frontend URL (default: http://localhost:5173)

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile devices

## 🎨 UI Components

- Role-based navigation sidebar
- Color-coded role badges
- Modal dialogs for CRUD operations
- Loading states and error handling
- Charts and data visualization
- Toast notifications

## 📄 License

This project is for educational purposes.
