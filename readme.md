# DormEngine
forked
DormEngine is a full-stack hostel management platform with separate student and admin (warden) experiences.

It includes:
- Student onboarding, profile, complaints, notices, roommate view, mess, and fee pages
- Admin dashboard, students, staff, room allocation, complaints, notices, maintenance, reports, and settings
- Dark mode support across shared layouts
- Seeded demo data for fast local testing

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express + MongoDB (Mongoose)
- Auth: JWT
- File upload: Multer (complaint image uploads)
- Workspace: npm workspaces (apps/client, apps/server)

## Project Structure

- apps/client: React frontend
- apps/server: Express backend
- apps/server/uploads: uploaded complaint images served as static files

### File Structure (Key Paths)

```text
Dorm-Engine/
├─ package.json
├─ readme.md
└─ apps/
   ├─ client/
   │  ├─ package.json
   │  ├─ index.html
   │  └─ src/
   │     ├─ App.jsx
   │     ├─ main.jsx
   │     ├─ styles.css
   │     ├─ components/
   │     │  ├─ StudentSidebar.jsx
   │     │  ├─ StudentTopbar.jsx
   │     │  ├─ WardenSidebar.jsx
   │     │  ├─ WardenTopbar.jsx
   │     │  └─ ProfileMenu.jsx
   │     ├─ layouts/
   │     │  ├─ StudentLayout.jsx
   │     │  └─ WardenLayout.jsx
   │     ├─ pages/
   │     │  ├─ auth/
   │     │  ├─ student/
   │     │  └─ warden/
   │     ├─ services/
   │     │  └─ api.js
   │     └─ context/
   │        └─ AuthContext.jsx
   └─ server/
      ├─ package.json
      ├─ .env
      ├─ uploads/
      │  └─ complaints/
      └─ src/
         ├─ index.js
         ├─ seed.js
         ├─ data/
         ├─ middleware/
         ├─ models/
         ├─ routes/
         ├─ utils/
         └─ firebase.js
```

## Prerequisites

- Node.js 22.16.0 (recommended via Volta)
- npm 10.9.2+
- MongoDB connection string

Optional setup with Volta on Windows:

- winget install Volta.Volta

## Setup

1. Clone and open the repository.
2. Switch to the development branch.
3. Create a file at apps/server/.env
4. Add required environment values:

    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_value
    PORT=5000

5. Install dependencies from the repository root:

    npm install

## Run the App

From repository root:

- Run client + server together:

   npm run dev

- Run only backend:

   npm run server

- Run only frontend:

   npm run client

Default local URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Build

- Frontend production build:

   npm run build --workspace apps/client

## Seeded Demo Accounts

On backend startup, seed data is inserted/upserted automatically.

- Admin login:
   - Email: admin@dormengine.com
   - Password: Admin@12345

- Seeded student accounts:
   - Example email pattern: student1@dormengine.com ... student25@dormengine.com
   - Password: Student@12345

## Seeded Data

- 25 students
- 5 staff members
- rooms, notices, complaints, maintenance tickets
- fee status data for dashboard and fee pages

Seeding is idempotent (safe to re-run on restart).

## Key Features

### Student Side
- Dashboard with live notices and complaint status counts
- Roommate page with all room occupants (3-sharing) and roommate feedback for other roommates only
- Complaint submission with local image upload
- Notices, mess, and fees pages
- Maintenance section removed from student navigation/routes

### Admin Side
- Live overview dashboard with occupancy and complaint insights
- Student management and stats
- Staff management
- Room allocation and fee monitoring
- Complaint and notice management

### Shared UX
- Unified topbar/sidebar patterns
- Profile menu
- Dark mode support

## Complaint Image Uploads

- Student can upload image files from local storage in complaints form
- Backend stores uploaded files under apps/server/uploads/complaints
- Complaint media URL is persisted and displayed in student/admin complaint lists
- Static file path is served under /uploads

## API Notes

Selected routes:

- /api/auth
- /api/students
- /api/rooms
- /api/complaints
- /api/notices
- /api/staff
- /api/admin
- /api/fees
- /api/mess

## Git Workflow

- Work on feature branches
- Base branch: dev
- Do not push directly to main

