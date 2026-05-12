# 🔄 CSE Department Management System - Workflow Diagrams

## 1. Student Registration & Approval Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NEW STUDENT                                  │
│                              │                                       │
│                              ▼                                       │
│                    ┌──────────────────┐                             │
│                    │  SIGNUP FORM     │                             │
│                    │  or              │                             │
│                    │  GOOGLE OAUTH    │                             │
│                    └──────────────────┘                             │
│                              │                                       │
│                              ▼                                       │
│                    ┌──────────────────┐                             │
│                    │  Account Created │                             │
│                    │  Status: PENDING │                             │
│                    └──────────────────┘                             │
│                              │                                       │
│                              ▼                                       │
│                    ┌──────────────────┐                             │
│                    │  Appears in      │                             │
│                    │  Admin Panel     │                             │
│                    └──────────────────┘                             │
│                              │                                       │
│                              ▼                                       │
│                    ┌──────────────────┐                             │
│                    │  ADMIN REVIEWS   │                             │
│                    └──────────────────┘                             │
│                              │                                       │
│                 ┌────────────┴────────────┐                         │
│                 ▼                         ▼                         │
│        ┌─────────────────┐      ┌─────────────────┐                │
│        │  ADMIN APPROVES │      │  ADMIN REJECTS  │                │
│        └─────────────────┘      └─────────────────┘                │
│                 │                         │                         │
│                 ▼                         ▼                         │
│        ┌─────────────────┐      ┌─────────────────┐                │
│        │ Status: APPROVED│      │ Status: REJECTED│                │
│        └─────────────────┘      └─────────────────┘                │
│                 │                         │                         │
│                 ▼                         ▼                         │
│        ┌─────────────────┐      ┌─────────────────┐                │
│        │ ✅ CAN LOGIN    │      │ ❌ CANNOT LOGIN │                │
│        │ Access Dashboard│      │ Show Rejection  │                │
│        │ Edit Profile    │      │ Message         │                │
│        └─────────────────┘      └─────────────────┘                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                        FRONTEND (React)                              │
│                     http://localhost:5173                            │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Student    │  │   Teacher    │  │   Employee   │             │
│  │   Portal     │  │   Portal     │  │   Portal     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────────────────────────────────────────┐              │
│  │              Admin Panel                          │              │
│  │  - Dashboard with Charts                          │              │
│  │  - Pending Student Approvals                      │              │
│  │  - Manage Teachers & Employees                    │              │
│  └──────────────────────────────────────────────────┘              │
│                                                                      │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           │ HTTP Requests (Axios)
                           │ JWT Token in Headers
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                    BACKEND (Node.js + Express)                       │
│                     http://localhost:3001                            │
│                                                                      │
│  ┌──────────────────────────────────────────────────┐              │
│  │              API Routes                           │              │
│  │  /api/auth     - Login, Signup, OAuth            │              │
│  │  /api/admin    - Admin operations                │              │
│  │  /api/student  - Student operations              │              │
│  │  /api/teacher  - Teacher operations              │              │
│  │  /api/employee - Employee operations             │              │
│  └──────────────────────────────────────────────────┘              │
│                           │                                          │
│                           ▼                                          │
│  ┌──────────────────────────────────────────────────┐              │
│  │         Authentication Middleware                 │              │
│  │  - JWT Verification                               │              │
│  │  - Role-Based Access Control                      │              │
│  │  - Status Check (for students)                    │              │
│  └──────────────────────────────────────────────────┘              │
│                           │                                          │
│                           ▼                                          │
│  ┌──────────────────────────────────────────────────┐              │
│  │              SQLite Database                      │              │
│  │  - users (authentication)                         │              │
│  │  - students (student data)                        │              │
│  │  - teachers (faculty data)                        │              │
│  │  - employees (staff data)                         │              │
│  │  - admins (admin data)                            │              │
│  └──────────────────────────────────────────────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. User Role Hierarchy

```
                    ┌─────────────────┐
                    │      ADMIN      │
                    │   (Full Access) │
                    └─────────────────┘
                            │
                            │ Can manage all
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   TEACHER    │    │   EMPLOYEE   │    │   STUDENT    │
│  (Faculty)   │    │   (Staff)    │    │  (Learner)   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ View Profile │    │ View Profile │    │ Must be      │
│ Edit Profile │    │ Edit Profile │    │ APPROVED     │
│ Dashboard    │    │ Dashboard    │    │ to login     │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 4. Database Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                         users (Core Table)                           │
│  ┌────────────────────────────────────────────────────────┐        │
│  │ id | email | password | google_id | role | status      │        │
│  └────────────────────────────────────────────────────────┘        │
│                              │                                       │
│                              │ user_id (Foreign Key)                │
│                              │                                       │
│         ┌────────────────────┼────────────────────┐                │
│         │                    │                    │                 │
│         ▼                    ▼                    ▼                 │
│  ┌─────────────┐      ┌─────────────┐     ┌─────────────┐         │
│  │  students   │      │  teachers   │     │  employees  │         │
│  │             │      │             │     │             │         │
│  │ - name      │      │ - name      │     │ - name      │         │
│  │ - student_id│      │ - teacher_id│     │ - employee_id│        │
│  │ - batch     │      │ - designation│    │ - designation│        │
│  │ - semester  │      │ - specialization│ │ - section   │         │
│  │ - cgpa      │      │ - office_room│   │ - joining_date│        │
│  │ - phone     │      │ - phone     │     │ - phone     │         │
│  │ - blood_group│     │ - joining_date│  └─────────────┘         │
│  │ - address   │      └─────────────┘                              │
│  └─────────────┘                                                    │
│                                                                      │
│         ▼                                                            │
│  ┌─────────────┐                                                    │
│  │   admins    │                                                    │
│  │             │                                                    │
│  │ - name      │                                                    │
│  └─────────────┘                                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  USER ENTERS CREDENTIALS                                             │
│  (Email + Password or Google OAuth)                                  │
│                │                                                     │
│                ▼                                                     │
│  ┌──────────────────────────┐                                       │
│  │  Backend Validates       │                                       │
│  │  - Check email exists    │                                       │
│  │  - Verify password       │                                       │
│  │  - Check role & status   │                                       │
│  └──────────────────────────┘                                       │
│                │                                                     │
│                ▼                                                     │
│  ┌──────────────────────────┐                                       │
│  │  Generate JWT Token      │                                       │
│  │  Contains:               │                                       │
│  │  - userId                │                                       │
│  │  - email                 │                                       │
│  │  - role                  │                                       │
│  │  - status                │                                       │
│  │  - name                  │                                       │
│  └──────────────────────────┘                                       │
│                │                                                     │
│                ▼                                                     │
│  ┌──────────────────────────┐                                       │
│  │  Send Token to Frontend  │                                       │
│  └──────────────────────────┘                                       │
│                │                                                     │
│                ▼                                                     │
│  ┌──────────────────────────┐                                       │
│  │  Store in localStorage   │                                       │
│  │  Attach to all requests  │                                       │
│  └──────────────────────────┘                                       │
│                │                                                     │
│                ▼                                                     │
│  ┌──────────────────────────┐                                       │
│  │  Redirect to Dashboard   │                                       │
│  │  Based on Role:          │                                       │
│  │  - Admin → /admin        │                                       │
│  │  - Teacher → /teacher    │                                       │
│  │  - Employee → /employee  │                                       │
│  │  - Student → /student    │                                       │
│  └──────────────────────────┘                                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Admin Operations Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                      ADMIN DASHBOARD                                 │
│                                                                      │
│  ┌──────────────────────────────────────────────────┐              │
│  │  View Statistics                                  │              │
│  │  - Total Students                                 │              │
│  │  - Pending Approvals (highlighted)                │              │
│  │  - Active Teachers                                │              │
│  │  - Employees                                      │              │
│  └──────────────────────────────────────────────────┘              │
│                           │                                          │
│                           ▼                                          │
│  ┌──────────────────────────────────────────────────┐              │
│  │  Pending Student Registrations                    │              │
│  │  ┌────────────────────────────────────────┐      │              │
│  │  │ Student 1 [Approve] [Reject]           │      │              │
│  │  │ Student 2 [Approve] [Reject]           │      │              │
│  │  │ Student 3 [Approve] [Reject]           │      │              │
│  │  └────────────────────────────────────────┘      │              │
│  └──────────────────────────────────────────────────┘              │
│                           │                                          │
│         ┌─────────────────┼─────────────────┐                       │
│         │                 │                 │                       │
│         ▼                 ▼                 ▼                       │
│  ┌────────────┐    ┌────────────┐   ┌────────────┐                │
│  │  Students  │    │  Teachers  │   │  Employees │                │
│  │   Page     │    │   Page     │   │   Page     │                │
│  │            │    │            │   │            │                │
│  │ - View All │    │ - Add New  │   │ - Add New  │                │
│  │ - Filter   │    │ - Edit     │   │ - Edit     │                │
│  │ - Search   │    │ - Delete   │   │ - Delete   │                │
│  │ - Approve  │    │ - View     │   │ - View     │                │
│  │ - Reject   │    └────────────┘   └────────────┘                │
│  │ - Delete   │                                                     │
│  └────────────┘                                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Student Status States

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                    STUDENT STATUS LIFECYCLE                          │
│                                                                      │
│                    ┌──────────────────┐                             │
│                    │     PENDING      │                             │
│                    │   (Initial)      │                             │
│                    └──────────────────┘                             │
│                            │                                         │
│                            │ Admin Action                            │
│                            │                                         │
│              ┌─────────────┴─────────────┐                          │
│              │                           │                          │
│              ▼                           ▼                          │
│     ┌──────────────────┐       ┌──────────────────┐                │
│     │    APPROVED      │       │    REJECTED      │                │
│     │   (Can Login)    │       │  (Cannot Login)  │                │
│     └──────────────────┘       └──────────────────┘                │
│              │                           │                          │
│              │                           │                          │
│              ▼                           ▼                          │
│     ┌──────────────────┐       ┌──────────────────┐                │
│     │ Access Dashboard │       │ Show Rejection   │                │
│     │ Edit Profile     │       │ Message          │                │
│     │ View Data        │       │ Contact Admin    │                │
│     └──────────────────┘       └──────────────────┘                │
│              │                           │                          │
│              │                           │                          │
│              ▼                           ▼                          │
│     ┌──────────────────┐       ┌──────────────────┐                │
│     │ Admin can:       │       │ Admin can:       │                │
│     │ - Revoke         │       │ - Restore        │                │
│     │   (→ Rejected)   │       │   (→ Approved)   │                │
│     │ - Delete         │       │ - Delete         │                │
│     └──────────────────┘       └──────────────────┘                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Legend

- `┌─┐` = Container/Box
- `│` = Vertical connection
- `─` = Horizontal connection
- `▼` = Flow direction (downward)
- `→` = Flow direction (rightward)
- `✅` = Success/Approved
- `❌` = Failure/Rejected
- `⏳` = Pending/Waiting

---

These diagrams provide a visual representation of how the CSE Department Management System works!
