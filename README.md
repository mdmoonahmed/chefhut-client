# <img src='/src/assets/logo.png' height='30' width='auto'> ChefHut — Food Ordering Platform
[![Live Demo](public/Screenshot%202026-01-01%20022922.png)](https://chefhut.vercel.app/)
## 📌 Project Purpose
ChefHut is a full-stack food ordering platform where users can order meals from chefs, chefs can manage meals and orders, and admins can control users, requests, and platform statistics.  
The platform supports role-based dashboards, secure payments, and real-time order status updates.

---

## 🌐 Live Website
🔗 **Live URL:** https://chefhut.vercel.app/ 
🔗 **Server URL:** https://chef-hut-indol.vercel.app/

---

## 👥 User Roles
- **User (Customer)**
- **Chef**
- **Admin**

Each role has a dedicated dashboard and permissions.

---

## ⭐ Key Features

### 🔐 Authentication & Authorization
- Firebase Authentication
- JWT-based secure API access
- Role-based private routes (User / Chef / Admin)

---

### 👤 User Features
- Browse meals
- Add meals to favorites
- Place orders
- View order history
- Make payments via Stripe
- Write, update, and delete reviews
- View profile and request role upgrade (Chef/Admin)

---

### 👨‍🍳 Chef Features
- Create meals with image upload
- Update and delete own meals
- View order requests
- Accept, cancel, or deliver orders
- View chef-specific orders only
- Fraud-status restriction (cannot create meals if marked fraud)

---

### 🛠️ Admin Features
- Manage users (make fraud)
- Approve or reject Chef/Admin requests
- View platform statistics
- Monitor total users, orders, and payments
- Role management and system control

---

### 📊 Dashboard & Analytics
- Platform statistics page
- Total payments
- Total users
- Pending and delivered orders
- Visualized using Recharts

---

### 💳 Payment System
- Stripe Checkout integration
- Secure payment handling
- Payment success and cancel routes

---

### 🎨 UI & Design
- Dark-themed modern UI
- Custom color system
- Responsive layout
- DaisyUI components
- Tailwind CSS utilities

---

## 🧩 Tech Stack

### Frontend
- React
- React Router
- TanStack Query (React Query)
- Axios
- Tailwind CSS
- DaisyUI
- SweetAlert2
- Recharts

---

### Backend
- Node.js
- Express.js
- MongoDB
- Stripe API
- JWT
- dotenv

---

## 📦 NPM Packages Used

### Client
- react
- react-router-dom
- @tanstack/react-query
- axios
- sweetalert2
- recharts
- firebase
- tailwindcss
- daisyui

### Server
- express
- mongodb
- cors
- dotenv
- jsonwebtoken
- stripe

---

## 🚀 How to Run Locally

### Client
```bash
npm install
npm run dev
