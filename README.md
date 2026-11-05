# GlowFix – Street Light Fault Reporting System
> **"Report the Fault. Restore the Light."**

A modern, full-stack civic technology web application developed as a student college project. GlowFix enables citizens to easily report faulty, dim, or damaged street lights and allows municipal administrators to manage, dispatch crews, and resolve complaints efficiently.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React.js (v18), Vite | Modern single-page application with lightning-fast HMR |
| **Styling** | Custom Responsive CSS | Professional blue-and-white civic tech theme (Inter & Plus Jakarta Sans typography) |
| **Icons** | Lucide React | Clean, accessible SVG iconography |
| **Routing** | React Router DOM (v6) | Declarative routing with protected role-based routes |
| **Backend** | Node.js, Express.js | RESTful API architecture with separate MVC structure |
| **Database** | MongoDB & Mongoose | Schemas for `Users` and `Complaints` with indexing |
| **Authentication** | JWT & Bcrypt.js | Stateless token auth with salted password hashing |
| **Image Upload** | Multer | Multipart/form-data upload handling with file filters |

---

## ✨ Key Features

### 1. Public Landing Page
- Modern civic hero section: *"Bright Streets. Safer Communities."*
- Quick search & track bar to lookup any complaint or light ID in one click.
- 4-step "How It Works" workflow guide (Spot & Identify → Submit Complaint → Crew Dispatched → Light Restored).
- Civic initiative overview explaining the importance of street illumination for nighttime safety.

### 2. Citizen Registration & Authentication
- Secure registration and login with email and hashed passwords.
- Role-based JWT session management stored in `localStorage`.
- One-click **Demo Login** buttons (`Citizen Demo` & `Admin Demo`) for rapid college evaluation.

### 3. Report Fault Form
- Input fields:
  - **Street Light ID** (e.g., `SL-0421`)
  - **Location / Landmark**
  - **Fault Category**: *Not Working*, *Flickering*, *Dim Light*, *Damaged Pole*
  - **Issue Description**
  - **Photo Evidence Upload**: Integrated file picker & drag-and-drop preview
- Automatic unique Complaint ID generation (e.g., `GF-102941`).
- Instant success screen with copy-to-clipboard button and direct tracking link.

### 4. Dedicated Complaint Tracking
- Anyone (citizens or guests) can enter a Complaint ID to inspect live progress.
- Visual **3-Stage Status Stepper** (*Reported → Crew Dispatched → Light Restored*).
- Displays photo evidence, timestamp, fault category, and official municipal technician remarks.

### 5. Citizen Dashboard
- Real-time statistics: *Total Reported*, *Pending Review*, *In Progress*, *Resolved*.
- Search and filter complaints by status (*All*, *Pending*, *In Progress*, *Resolved*).
- Detailed modal popup with complete history and resolution updates.

### 6. Municipal Administrator Dashboard
- High-level municipal metrics overview.
- Full complaint triage table with live search and multi-criteria filters.
- Modal to update status between **Pending**, **In Progress**, and **Resolved**, with technician action logs.
- Registered Citizens and Staff directory showing complaint counts per user.

---

## 🔑 Demo Credentials

The database auto-seeds these accounts on first startup:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Municipal Admin** | `admin@glowfix.gov` | `admin123` | Full admin management & status updates |
| **Citizen** | `citizen@example.com` | `citizen123` | Report faults & personal dashboard |

### Pre-Seeded Sample Complaints for Quick Testing:
- `GF-102941` – *Pending* (MG Road, Opposite Central Park Gate 2)
- `GF-304812` – *In Progress* (14th Cross, Indiranagar 2nd Stage)
- `GF-708231` – *Resolved* (Church Street, near Metro Station Exit A)

---

## 📁 Project Structure

```
GlowFix/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & in-memory fallback
│   ├── controllers/
│   │   ├── authController.js     # Register, login, current profile
│   │   ├── complaintController.js# Submit, get my complaints, track by ID
│   │   └── adminController.js    # Triage complaints, update status, user list
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role authorization
│   │   └── upload.js             # Multer image upload configuration
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt password hashing
│   │   └── Complaint.js          # Complaint schema with status and pole ID
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/                  # Uploaded photo evidence storage
│   ├── .env                      # Environment variables
│   ├── .env.example
│   ├── package.json
│   ├── seed.js                   # Initial sample data seeder
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Glowing lightbulb brand icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar with responsive links
│   │   │   ├── Footer.jsx        # Civic footer & emergency contacts
│   │   │   ├── StatusBadge.jsx   # Status indicator pill
│   │   │   ├── StatsCard.jsx     # Dashboard metric card
│   │   │   ├── ProtectedRoute.jsx# Auth & Admin route guard
│   │   │   └── ComplaintDetailModal.jsx # Detail view & admin status changer
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global user auth state provider
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Homepage with hero & quick track
│   │   │   ├── ReportFaultPage.jsx # Complaint submission form
│   │   │   ├── TrackComplaintPage.jsx # Public tracking dossier
│   │   │   ├── CitizenDashboard.jsx # Citizen complaint manager
│   │   │   ├── AdminDashboard.jsx   # Municipal admin console
│   │   │   ├── LoginPage.jsx     # Login with quick demo buttons
│   │   │   ├── RegisterPage.jsx  # Citizen/Admin registration
│   │   │   └── NotFoundPage.jsx  # 404 page
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── styles/
│   │   │   ├── index.css         # Civic design system tokens
│   │   │   └── App.css           # Component layouts and styles
│   │   ├── App.jsx               # Routes definition
│   │   └── main.jsx              # React app mount
│   ├── index.html
│   ├── package.json
│   └── vite.config.js            # Vite config with backend proxy
└── README.md
```

---

## 🚀 How to Run the Application Locally

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- *(Optional)* **MongoDB** – If a local MongoDB instance is not detected, GlowFix automatically initializes a built-in MongoDB server so the project runs immediately with zero extra installation!

---

### Step 1: Start the Backend Server

1. Open a terminal in the project root:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   *The backend will start at `http://localhost:5000` and automatically seed initial demo accounts and complaints.*

---

### Step 2: Start the Frontend Application

1. Open a second terminal window:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` – Register a new user (`name`, `email`, `password`, optional `role`)
- `POST /api/auth/login` – Authenticate with email & password, returns JWT token
- `GET /api/auth/me` – Retrieve profile of current logged-in user (Protected)
- `PUT /api/auth/profile` – Update user name, email, and preferences (Protected)
- `PUT /api/auth/password` – Validate current password and set new password (Protected)

### Complaints (`/api/complaints`)
- `POST /api/complaints` – Submit fault report (`streetLightId`, `location`, `faultType`, `description`, optional `image`)
- `GET /api/complaints/my` – Retrieve complaints submitted by current citizen (Protected)
- `GET /api/complaints/track/:complaintId` – Public complaint tracking by Tracking ID or Street Light ID
- `GET /api/complaints/:id` – Retrieve single complaint details

### Municipal Admin (`/api/admin`)
- `GET /api/admin/complaints` – Get all complaints with search and filters (Admin only)
- `PUT /api/admin/complaints/:id/status` – Update complaint status (*Pending*, *In Progress*, *Resolved*) and admin remarks (Admin only)
- `GET /api/admin/users` – List all registered citizens with complaint count (Admin only)
- `GET /api/admin/stats` – High-level dashboard counters and fault distributions (Admin only)

---

## 🎓 College Project Verification Checklist
- [x] Full-stack architecture (React frontend + Node.js Express backend)
- [x] Blue and white civic-technology design theme
- [x] Responsive layout with clean navigation and footer
- [x] Functional citizen registration and login with bcrypt hashing & JWT
- [x] Report fault form with Street Light ID, Location, Fault Types, Description, Photo upload
- [x] Unique Complaint ID generation (e.g., `GF-XXXXXX`)
- [x] Public Complaint Tracking page with 3-stage visual timeline
- [x] Citizen Dashboard displaying personal reports and live stats
- [x] Municipal Admin Dashboard with search, filters, and status changer
- [x] MongoDB database models for `User` and `Complaint`
- [x] Automatic database fallback and pre-seeded demo data for seamless evaluation
