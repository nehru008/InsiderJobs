# 🧑‍💼 Job Portal

A full-stack Job Portal web application where **job seekers** can browse and apply for jobs, and **recruiters** can post, manage jobs and review applications. Built with the **MERN** stack, **Clerk** authentication, and deployed on **Vercel**.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [License](#license)

---

## ✨ Features

### Job Seekers
- 🔍 Search & filter jobs by **title** and **location**
- 📄 View detailed job descriptions
- 📝 Apply for jobs with resume upload
- 📂 Track application status (Pending / Accepted / Rejected)
- 🔐 Authentication via **Clerk** (Google, Email, etc.)

### Recruiters / Companies
- 🏢 Company registration & login with JWT authentication
- ➕ Post new job listings with rich-text descriptions
- 📋 Manage posted jobs (toggle visibility)
- 👀 View & manage incoming applications (Accept / Reject)
- 🖼️ Company logo upload via **Cloudinary**

### General
- 📱 Fully responsive UI with **Tailwind CSS v4**
- 🔔 Toast notifications for user feedback
- 🛡️ Error monitoring with **Sentry**
- 🚀 Deployed on **Vercel** (client & server)

---

## 🛠️ Tech Stack

| Layer        | Technology                                                    |
| ------------ | ------------------------------------------------------------- |
| **Frontend** | React 19, React Router 7, Vite 7, Tailwind CSS 4             |
| **Backend**  | Node.js, Express 5, Mongoose 9                               |
| **Database** | MongoDB Atlas                                                 |
| **Auth**     | Clerk (job seekers), JWT + bcrypt (recruiters)                |
| **Storage**  | Cloudinary (images & resumes), Multer (file uploads)          |
| **Monitoring** | Sentry (error tracking & profiling)                         |
| **Deployment** | Vercel                                                      |

---

## 📁 Project Structure

```
Job_Portal/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Static assets & asset mappings
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AppDownload.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Jobcard.jsx
│   │   │   ├── JobListing.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RecruiterLogin.jsx
│   │   │   └── RichTextEditor.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx   # Global state management
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── ApplyJob.jsx     # Job detail & apply
│   │   │   ├── Application.jsx  # User's applications
│   │   │   ├── Dashboard.jsx    # Recruiter dashboard
│   │   │   ├── AddJob.jsx       # Post a new job
│   │   │   ├── ManageJobs.jsx   # Manage posted jobs
│   │   │   └── ViewApplications.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json
│
├── server/                     # Express backend
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── cloudinary.js       # Cloudinary setup
│   │   ├── instrument.js       # Sentry instrumentation
│   │   └── multer.js           # File upload config
│   ├── controllers/
│   │   ├── companyController.js
│   │   ├── jobController.js
│   │   ├── userController.js
│   │   └── webhooks.js         # Clerk webhook handler
│   ├── middleware/
│   │   └── authMiddleWare.js   # JWT auth middleware
│   ├── models/
│   │   ├── Company.js
│   │   ├── Job.js
│   │   ├── JobApplication.js
│   │   └── User.js
│   ├── routes/
│   │   ├── companyRoutes.js
│   │   ├── jobRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── generateTokens.js   # JWT token generation
│   ├── server.js
│   ├── package.json
│   └── vercel.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB instance)
- **Clerk** account — [clerk.com](https://clerk.com)
- **Cloudinary** account — [cloudinary.com](https://cloudinary.com)

### Environment Variables

#### Server (`server/.env`)

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET_KEY=your_api_secret

# Clerk
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

#### Client (`client/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:5000
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Arshkhan18/Job_Portal.git
cd Job_Portal

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running Locally

```bash
# Terminal 1 — Start the backend server
cd server
npm run server        # runs with nodemon on port 5000

# Terminal 2 — Start the frontend dev server
cd client
npm run dev           # runs Vite dev server (default port 5173)
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Endpoints

### Jobs

| Method | Endpoint          | Description           | Auth     |
| ------ | ----------------- | --------------------- | -------- |
| GET    | `/api/jobs`       | Get all visible jobs  | Public   |
| GET    | `/api/jobs/:id`   | Get job by ID         | Public   |
| POST   | `/api/jobs`       | Create a new job      | Company  |
| PUT    | `/api/jobs/:id`   | Update job visibility | Company  |

### Company

| Method | Endpoint               | Description              | Auth     |
| ------ | ---------------------- | ------------------------ | -------- |
| POST   | `/api/company/register`| Register a new company   | Public   |
| POST   | `/api/company/login`   | Company login            | Public   |
| GET    | `/api/company/company` | Get company data         | Company  |

### Users

| Method | Endpoint                 | Description                 | Auth       |
| ------ | ------------------------ | --------------------------- | ---------- |
| GET    | `/api/users/user`        | Get user profile            | Clerk JWT  |
| GET    | `/api/users/applications`| Get user's applications     | Clerk JWT  |
| POST   | `/api/users/apply`       | Apply for a job             | Clerk JWT  |

### Webhooks

| Method | Endpoint     | Description              |
| ------ | ------------ | ------------------------ |
| POST   | `/webhooks`  | Clerk webhook handler    |

---

## 🌐 Deployment

Both the **client** and **server** are configured for deployment on **Vercel**.

- **Client**: SPA with catch-all rewrite rule for client-side routing.
- **Server**: Serverless function via `@vercel/node`.

Each folder contains its own `vercel.json` for deployment configuration.

```bash
# Deploy client
cd client
vercel --prod

# Deploy server
cd server
vercel --prod
```

> **Note:** Update `VITE_BACKEND_URL` in the client `.env` to your deployed server URL before building for production.

---

## 📄 License

This project is open-source and available under the [ISC License](https://opensource.org/licenses/ISC). 
