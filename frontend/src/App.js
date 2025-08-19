import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import Login from "./Login";
import Home from "./pages/Home";
import CourseDetail from "./pages/CourseDetail";
import ViewCourses from "./pages/ViewCourses";
import AddCourse from "./pages/AddCourse";
import DashboardLayout from "./components/DashboardLayout";
import Navbar from "./components/Navbar";

// ✅ Admin dashboard components
import DashboardSummaryCards from "./components/DashboardSummaryCards";
import DashboardChart from "./components/DashboardChart";
import UserRolePieChart from "./components/UserRolePieChart";

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.clear();
    setRole("");
    navigate("/");
  };

  // ✅ If not logged in → show login page
  if (!role) {
    return (
      <Login
        setRole={(r) => {
          localStorage.setItem("role", r);
          setRole(r);
          navigate(r === "admin" ? "/dashboard" : "/viewcourses");
        }}
      />
    );
  }

  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboardRoute && <Navbar onLogout={handleLogout} />}

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/viewcourses" element={<ViewCourses />} />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard"
          element={role === "admin" ? <DashboardLayout /> : <Navigate to="/" />}
        >
          {/* ✅ Dashboard summary (analytics only, no CRUD) */}
          <Route
            index
            element={
              <>
                <DashboardSummaryCards />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <DashboardChart />
                  <UserRolePieChart />
                </div>
              </>
            }
          />

          {/* ✅ Admin CRUD routes */}
          <Route path="add" element={<AddCourse />} />
          <Route path="view" element={<ViewCourses />} />

          {/* ✅ Optional extra analytics routes (if needed separately) */}
          <Route path="summary" element={<DashboardSummaryCards />} />
          <Route path="chart" element={<DashboardChart />} />
          <Route path="roles" element={<UserRolePieChart />} />
        </Route>

        {/* Catch-all → Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
