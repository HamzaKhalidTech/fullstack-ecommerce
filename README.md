# 🛒 Full Stack E-Commerce Project

A full-stack e-commerce application built step-by-step to practice **backend, frontend, database design, APIs, authentication, and real-world project architecture**.

> 🚧 This project is currently in active development and will be updated daily with new features.

---

## 🚀 Project Status

🟡 In Development

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JavaScript
- React.js
- REST APIs
- JWT Authentication
- Cloudinary
- Nodemailer

---

## 📅 Daily Progress

### Day 1 – Project Setup
- Created backend project structure
- Configured environment variables
- Established PostgreSQL database connection
- Built global error handling middleware
- Created async error handler utility
- Designed database table models
- Implemented table creation utility

---

### Day 2 – Authentication System
- Built `authController.js`
- Implemented user registration and login
- Added password hashing using bcrypt
- Created JWT token utility (`jwtToken.js`)
- Implemented authentication flow
- Tested APIs in Postman
- ✔ Register/Login working successfully

---

### Day 3 – Protected Routes & Password Recovery
- Added authentication middleware
- Implemented JWT protected routes
- Added logout functionality
- Built forgot password system
- Created reset token utility
- Integrated email sending service (Nodemailer)
- Designed HTML email template for password reset
- Added role-based authorization middleware
- ✔ Password reset flow implemented successfully

---

### Day 4 – Secure Password Reset System
- Implemented reset password API
- Added secure token verification
- Implemented token expiry validation
- Added password confirmation validation
- Improved security for password update flow
- Invalidated reset token after use
- ✔ Full password reset system tested and working

---

### Day 5 – Profile Management System
- Implemented update password functionality
- Built user profile update API (name, email, avatar)
- Integrated Cloudinary for image uploads
- Added old avatar deletion before uploading new one
- Tested profile update system
- ✔ User profile system completed successfully

---

### Day 6 – Product Management
- Created Product creation API
- Added admin role-based access control
- Integrated Cloudinary for product image uploads

---

### Day 7 – Product Listing & Filtering System
- Built `fetchAllProducts` API
- Added availability, price, category, rating, and search filters
- Implemented pagination (limit & offset)
- Built dynamic SQL query builder
- Started parameterized query system
- Product listing backend in progress

---

### Day 8 – Advanced Query Optimization
- Completed dynamic product filtering system
- Added category, rating, and keyword search filters
- Built safe SQL dynamic query builder
- Optimized product fetch with JOIN (reviews count aggregation)
- Added "New Products" section (last 7 days)
- Improved query structure for scalability and maintainability
- ✔ Backend product system upgraded to production-level quality

---

## 📌 Current Backend Progress (Updated)

- Express.js server setup completed
- Middleware architecture implemented (CORS, JSON, cookies, file upload)
- PostgreSQL database connected successfully
- Global error handling system implemented
- Modular database schema created (Users, Products, Orders, Payments, Reviews, Shipping, Order Items)
- Automated table creation system implemented
- Full authentication system (Register, Login, Logout, Get User)
- JWT-based authentication and authorization
- Role-based access control (User / Admin)
- Password reset system with secure token flow
- Email service integration (Nodemailer + HTML templates)
- Secure password update functionality
- User profile management (name, email, avatar via Cloudinary)
- Product management system (create, filter, list)
- Advanced SQL dynamic filtering system
- Pagination system implemented
- Product reviews relational system
- Orders + order items relational structure
- Shipping information module completed
- Payment system schema implemented (COD + Online)
- New products query (last 7 days)
- Optimized JOIN-based queries for performance
- Clean MVC-style backend architecture

---

## 🚀 Overall Backend Status

**Current Progress: ~80% Completed**

✔ Authentication system complete  
✔ Authorization system complete  
✔ Product system advanced  
✔ Order & payment system structured  
✔ Database fully relational  
✔ Backend architecture scalable  

---

## 📦 Features Planned (Next Phase)

- Shopping cart system (Add / Remove / Update quantity)
- Checkout flow (Cart → Order → Payment → Shipping)
- Stock management system
- Order status tracking (Processing → Shipped → Delivered)
- Admin dashboard APIs
- Frontend React UI integration
- Payment gateway integration (Stripe / COD finalization)

---

## 💡 Project Goal

To build a **real-world scalable e-commerce system** with production-level backend architecture and frontend integration.

---

## 👨‍💻 Author

Built step-by-step as a learning + portfolio project 🚀