# 🚀 Collaborative Project Management System

A full-stack MERN application built to simplify project and task management with secure Role-Based Access Control (RBAC). It allows admins to manage projects, assign tasks, and track progress, while members can update task status through a clean and intuitive interface.

---

---

## 🌐 Live Demo

👉 https://project-management-system-phi-two.vercel.app/

---

## 🌟 Features

- 🔐 Role-Based Access Control (Admin & Member)
- 📁 Project Management (Create, Update, Delete)
- ✅ Task Assignment & Status Tracking (To-do, In Progress, Completed)
- 📊 Dashboard with real-time project & task stats
- 🔒 Secure Authentication using JWT & bcrypt
- 🧠 Smart forms with auto-fill in edit mode

---

## 🛠️ Tech Stack

Frontend: React, Vite, SCSS, Axios, React Router  
Backend: Node.js, Express.js  
Database: MongoDB (Mongoose)  
Authentication: JWT, bcryptjs  

---

## 📂 Project Structure

```bash
project-root/
├── backend/
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth & role protection
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── server.js           # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios config
│   │   ├── components/     # Reusable UI
│   │   ├── pages/          # App pages
│   │   └── App.jsx         # Routing
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Setup & Installation

### Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

```bash
npm start
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Notes

- Only registered users can be assigned tasks  
- Admin has full control over projects  
- Members can update task progress  

---

