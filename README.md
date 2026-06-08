# CSE Department Management System

A highly detailed, comprehensive, and modern single-department management system built specifically for a Computer Science & Engineering (CSE) Department. This system efficiently manages students, teachers, employees, and administrative tasks under one unified platform.

---

## 💻 Tech Stack

### Frontend
*   **Framework:** React 19 powered by Vite
*   **Routing:** React Router v7
*   **Styling:** Tailwind CSS v4, DaisyUI, and HeroUI
*   **Data Fetching:** Axios
*   **Charts & Visualization:** Recharts
*   **Icons:** Lucide React
*   **Animations:** Framer Motion

### Backend
*   **Runtime:** Node.js (v22+)
*   **Framework:** Express.js
*   **Database:** SQLite (embedded, zero-config)
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs
*   **Session Management:** express-session & cookie-parser
*   **File Uploads:** Multer

---

## 🎯 Core System Logic & Functionality

This application provides strict role-based access control, dedicated portals for different users, and complex workflows for academic management including **smart geolocation-based attendance**.

### 👥 User Roles & Capabilities

1. **Student (👨‍🎓)**
   - **Registration:** Can sign up via an email/password form.
   - **Approval Logic:** All new student accounts default to a `PENDING` state. They cannot log in until an Administrator approves their account.
   - **Dashboard & Features:** Once approved, students can view their academic routines, access course materials, submit assignments, and track their attendance.
   - **Smart Attendance:** Students can mark their presence for active classes using their browser's geolocation.

2. **Teacher (👨‍🏫)**
   - **Account Creation:** Created strictly by the Admin.
   - **Dashboard & Features:** Teachers can manage their profiles, view their teaching schedules, upload course materials, and oversee student attendance and assignment submissions.

3. **Employee (👷)**
   - **Account Creation:** Created strictly by the Admin.
   - **Dashboard & Features:** Non-teaching staff members can view and manage their institutional profiles and administrative tasks.

4. **Admin (🔐)**
   - **Control:** Full access to all department data.
   - **Management:** Approve or reject pending student registrations, manage the teacher and employee directories, and view high-level department statistics and data visualizations (charts).

### 📍 Smart Geolocation Attendance Logic
The system implements a strictly enforced, location-based attendance system:
- **Time Window:** Students can only give attendance within a strict **15-minute window** from the class start time.
- **Location Validation:** The system utilizes the **Haversine formula** to calculate the distance between the student's current GPS coordinates and the designated classroom locations.
- **Geofencing Rule:** Students **must be within a 20-meter radius** of the designated coordinates (`24.01296, 89.280835` or `24.841355, 89.381426`). If they are outside this radius, the system explicitly rejects the submission and displays their distance from the classroom.

---

## 🔄 Core Workflows

### Student Registration & Approval Workflow
```text
1. STUDENT SIGNS UP (Status: PENDING)
     ↓
2. APPEARS IN ADMIN PANEL ("Pending Registrations" queue)
     ↓
3. ADMIN REVIEWS & DECIDES
     ├─► Click "Approve" → Status: APPROVED → Student can login
     └─► Click "Reject"  → Status: REJECTED → Login denied
```

---

## 📦 NPM Packages Used

The system is built as a monolithic repository using Vite (Frontend) and Express (Backend), running concurrently. Below is the detailed breakdown of the packages powering the logic:

### Dependencies (Production)
*   **`@heroui/react`, `@heroui/system`, `@heroui/theme`, `@heroui/toast`**: Powers the UI components, modern layout styling, theme variables, and flash notifications (toasts).
*   **`@tailwindcss/vite`**: Vite integration for Tailwind CSS v4, enabling rapid, utility-first styling.
*   **`axios`**: Promise-based HTTP client used on the frontend to make requests to the Express backend.
*   **`bcryptjs`**: Used on the backend to securely hash and salt user passwords before storing them in the database.
*   **`cookie-parser`**: Express middleware to parse HTTP request cookies, essential for session management.
*   **`cors`**: Express middleware enabling Cross-Origin Resource Sharing so the React frontend can securely communicate with the API.
*   **`dotenv`**: Loads environment variables from the `.env` file into `process.env`.
*   **`express`**: Fast, unopinionated web framework for Node.js serving the API endpoints.
*   **`express-session`**: Manages user sessions in Express for stateless HTTP protocols.
*   **`framer-motion`**: Used for smooth, physics-based UI animations and page transitions on the frontend.
*   **`jsonwebtoken` (JWT)**: Generates and verifies secure access tokens for authentication and protected routes.
*   **`lucide-react`**: Provides crisp, customizable SVG icons used throughout the UI.
*   **`multer`**: Node.js middleware for handling `multipart/form-data`, primarily used for uploading assignments, course materials, and profile pictures.
*   **`react` & `react-dom`**: The core library and DOM renderer for building the user interface.
*   **`react-geolocated`**: A React hook providing access to the HTML5 Geolocation API. Used to get the student's `latitude` and `longitude` for attendance.
*   **`react-router`**: Handles client-side routing, enabling navigation between the dashboard, login pages, and nested views without page reloads.
*   **`recharts`**: A composable charting library built on React components, used in the Admin dashboard for data visualization.
*   **`tailwindcss`**: Utility-first CSS framework for custom, responsive styling.

### DevDependencies (Development)
*   **`concurrently`**: Allows running the Vite frontend server and Express backend server simultaneously using a single command (`npm run dev`).
*   **`daisyui`**: A plugin for Tailwind CSS providing pre-built, highly customizable component classes (buttons, cards, inputs).
*   **`eslint`, `@eslint/js`, `eslint-plugin-*`**: Linting tools configured to enforce code quality, catch syntax errors, and enforce React hooks rules.
*   **`prettier`, `prettier-plugin-tailwindcss`**: Code formatter that ensures consistent code style and automatically sorts Tailwind utility classes.
*   **`vite`, `@vitejs/plugin-react`**: Next-generation frontend build tool and development server providing extremely fast Hot Module Replacement (HMR).
*   **`@types/react`, `@types/react-dom`, `globals`**: TypeScript definitions and environment globals to aid IDE intellisense.

---

## 🗄️ Database Architecture

The backend utilizes **SQLite** for a lightweight, zero-configuration database, entirely embedded within the Node.js application.

*   **`users`**: Core auth table (`email`, `password`, `role`, `status`).
*   **`students`**: Academic profile (`student_id`, `batch`, `semester`, `cgpa`).
*   **`teachers`**: Faculty profile (`teacher_id`, `designation`, `specialization`).
*   **`employees`**: Staff profile (`employee_id`, `designation`, `section`).
*   **`courses` & `routines`**: Academic schedules, classes, and assigned coordinates.
*   **`attendance_sessions` & `attendance_records`**: Tracks when a class opens for attendance and precisely logs the student's location when marked.
*   **`notices`**: General announcements and uploaded files.

---

## 🚀 Installation & Quick Start

### Prerequisites
*   Node.js (v22 or later recommended for built-in SQLite features)

### Setup Instructions

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Ensure you have a `.env` file at the root. (Copy from a template if needed):
    ```env
    PORT=3001
    JWT_SECRET=your_jwt_secret
    SESSION_SECRET=your_session_secret
    FRONTEND_URL=http://localhost:5173
    ```

3.  **Seed the Database:**
    Populate the SQLite database with initial demo data (Admin, Teachers, demo courses).
    ```bash
    npm run seed
    ```

4.  **Start the Application:**
    This command uses `concurrently` to launch both the Vite frontend and the Express backend.
    ```bash
    npm run dev
    ```

### Access Points
*   **Frontend Web App**: `http://localhost:5173`
*   **Backend API**: `http://localhost:3001`

---

## 🔑 Demo Credentials

If you ran `npm run seed`, you can instantly log in with:

| Role     | Email                       | Password     | Status      |
| -------- | --------------------------- | ------------ | ----------- |
| Admin    | admin@cse.edu               | Admin@123    | N/A         |
| Teacher  | john.smith@cse.edu          | Teacher@123  | N/A         |
| Student  | alice.chen@student.cse.edu  | Student@123  | ✅ Approved |
| Student  | carol.davis@student.cse.edu | Student@123  | ⏳ Pending  |

---

## 🛡️ Security Features

*   **Authentication Validation**: JWT strictly enforces role access (e.g., a Teacher token cannot access Admin routes).
*   **Password Hashing**: `bcryptjs` is used to prevent raw passwords from being exposed in the database.
*   **File Upload Safety**: `multer` configuration manages allowed mime-types and restricts file upload sizes.
*   **Strict Geofencing**: Server-side mathematical validation (Haversine) strictly rejects manipulated or distant geolocation data during attendance submission.

## 📄 License
This project was built for educational purposes.
