# Advanced MERN Courses Management Application

A full-featured **MERN** (MongoDB, Express, React, Node.js) stack application with **role-based authentication** and **authorization**, providing a smooth user experience with modern UI and robust backend features.

---

## Features

- **Role-Based Access Control (RBAC):**  
  Two user roles — **Admin** and **User**  
  - Admin users created via Postman with full CRUD rights  
  - Users register via frontend, with read-only access  

- **Authentication & Authorization:**  
  Secure login/register with **JWT** tokens  
  Access control enforced on backend and frontend routes  

- **Courses CRUD:**  
  Admin can create, update, delete courses  
  Users can only view courses  

- **Advanced Query Features:**  
  - Search courses by name or category  
  - Filter courses by category, difficulty, or price  
  - Pagination for large datasets  

- **Real-time Data Summary Cards:**  
  Dynamic dashboard cards showing:  
  - Total courses  
  - Active users  
  - Recent enrollments  
  - Courses by category  

- **Data Visualization:**  
  Interactive charts for rich insights:  
  - **Pie Charts** (e.g., admin/user show)  
  - **Bar Graphs** (e.g., monthly course enrollments)  
  Implemented with **Chart.js**, fed by secure backend APIs  

- **File Uploads:**  
  Course thumbnails/images uploaded securely using **Multer**  

- **Frontend:**  
  React + Tailwind CSS for a clean, responsive, modern design  
  Separate dashboards for Admin and User  

- **Backend:**  
  Express RESTful API with structured routes and controllers  
  MongoDB with Mongoose for data modeling  
  Centralized error handling and environment config  

- **Session Management:**  
  JWT stored in secure HTTP-only cookies or localStorage  
  Logout functionality on both roles  

---

## Tech Stack

| Frontend       | Backend          | Database    | Other Tools                                |
|----------------|------------------|-------------|--------------------------------------------|
| React          | Node.js + Express| MongoDB     | JWT, Multer, Tailwind CSS, Axios, Chart.js |

---

## Getting Started

### Prerequisites

- Node.js v18+  
- MongoDB (local or cloud)  
- Postman (for admin user creation and testing)

### Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/yunusbutt676-commits/mern-courses-management.git
cd mern-courses-management
npm install
