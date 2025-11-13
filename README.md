# 🧠 Job Listing Platform (MERN Stack)

A **full-stack job posting and discovery application** built using the **MERN stack (MongoDB, Express.js, React, Node.js)**.  
It allows **employers** to post job openings and **job seekers** to search, apply, and manage job listings.  
The app follows a clean **MVC + component-based architecture** and is easily scalable.

---

## 👥 Team

This project is a collaborative group effort by:

Warima Edgar - https://github.com/eddywarima

Leah Joseph - https://github.com/lea-j-op

Eunitah Mumbua - https://github.com/emmumbua

Sheila Mumbi - https://github.com/Shee440

---

## 🚀 Features

- User authentication (JWT-based)
- Role-based access (Admin / Employer / Job Seeker)
- Create, Read, Update, Delete (CRUD) jobs
- Job filtering and search (by title, category, location)
- Apply to jobs (upload resume)
- Company profile management
- Protected routes (both backend + frontend)
- RESTful API with Express.js
- Responsive React frontend
- MongoDB data persistence
- Centralized error handling

---

## 🧰 Tech Stack

| Layer            | Technology                                                   |
| ---------------- | ------------------------------------------------------------ |
| Frontend         | React.js (Vite or CRA) + Axios + React Router + Tailwind CSS |
| Backend          | Node.js + Express.js                                         |
| Database         | MongoDB (Mongoose ODM)                                       |
| Authentication   | JSON Web Tokens (JWT) + bcrypt.js                            |
| File Upload      | Multer                                                       |
| State Management | Context API or Redux Toolkit                                 |
| Deployment       | Vercel (frontend) + Render / Railway / AWS (backend)         |

---

## 📁 Folder Structure

### Root Directory

```
job-listing-app/
│
├── backend/                     # Express server & API
├── frontend/                    # React client
├── .env                         # Environment variables
├── package.json                 # Project metadata & scripts
├── README.md                    # Documentation
└── .gitignore                   # Ignored files
```

---

### 🧱 Backend Structure (`/backend`)

```
backend/
│
├── src/
│   ├── config/
│   │   └── db.js                # MongoDB connection setup
│   │
│   ├── controllers/
│   │   ├── authController.js    # Login, register, logout
│   │   ├── jobController.js     # CRUD operations for jobs
│   │   ├── userController.js    # User profile management
│   │   └── applicationController.js # Job application logic
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT token verification
│   │   ├── errorMiddleware.js   # Global error handler
│   │   └── uploadMiddleware.js  # Resume upload handler (multer)
│   │
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Job.js               # Job schema
│   │   └── Application.js       # Application schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth
│   │   ├── jobRoutes.js         # /api/jobs
│   │   ├── userRoutes.js        # /api/users
│   │   └── applicationRoutes.js # /api/applications
│   │
│   ├── utils/
│   │   ├── generateToken.js     # Helper to sign JWT
│   │   └── handleResponse.js    # Standardized API responses
│   │
│   ├── server.js                # Express app entry point
│   └── app.js                   # Express app configuration
│
├── package.json
└── .env
```

---

### 💻 Frontend Structure (`/frontend`)

```
frontend/
│
├── src/
│   ├── api/
│   │   └── axiosClient.js         # Axios instance setup with baseURL & interceptors
│   │
│   ├── assets/                    # Images, logos, icons
│   │
│   ├── components/
│   │   ├── Navbar.jsx             # Top navigation bar
│   │   ├── Footer.jsx             # App footer
│   │   ├── JobCard.jsx            # Displays a job listing
│   │   ├── JobForm.jsx            # Form for creating/editing jobs
│   │   ├── ProtectedRoute.jsx     # Wrapper for private routes
│   │   └── Loader.jsx             # Spinner/loading state
│   │
│   ├── context/
│   │   └── AuthContext.jsx        # Context for global user state
│   │
│   ├── hooks/
│   │   └── useAuth.js             # Custom hook for auth
│   │
│   ├── pages/
│   │   ├── Home.jsx               # Homepage
│   │   ├── Login.jsx              # Login form
│   │   ├── Register.jsx           # Registration form
│   │   ├── Jobs.jsx               # Job listings
│   │   ├── JobDetails.jsx         # Single job details
│   │   ├── Dashboard.jsx          # Employer dashboard
│   │   └── Profile.jsx            # User profile
│   │
│   ├── services/
│   │   ├── authService.js         # Login/register API calls
│   │   ├── jobService.js          # CRUD operations for jobs
│   │   └── userService.js         # User profile requests
│   │
│   ├── App.jsx                    # React root component
│   ├── main.jsx                   # Entry file
│   ├── index.css                  # Global styles
│   └── router.jsx                 # React Router setup
│
├── package.json
└── vite.config.js
```

---

## ⚙️ Environment Variables

### Backend `.env`

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobs
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

### Frontend `.env`

```
VITE_API_URL=http://localhost:5000/api
```

---

## 🧬 API Endpoints

(Full list of routes, controllers, and responses as detailed above)

---

## ⚡ Setup Instructions

1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/job-listing-app.git
cd job-listing-app
```

2️⃣ Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

3️⃣ Setup Environment Variables
Create `.env` files in both `backend` and `frontend` as shown above.

4️⃣ Run Development Servers

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

5️⃣ Build for Production

```bash
cd frontend
npm run build
```

---

## 🧪 Testing (Optional)

- Backend: `jest` or `mocha + supertest`
- Frontend: `vitest` or `react-testing-library`

---

## 🔮 Future Improvements

- Integrate email notifications
- Add job bookmarking
- Resume parsing using AI
- Pagination & infinite scroll
- Admin analytics dashboard
- Docker deployment

---
