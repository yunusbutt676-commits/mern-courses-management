import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardSummaryCards from "./DashboardSummaryCards";
import DashboardChart from "./DashboardChart";
import UserRolePieChart from "./UserRolePieChart";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = (localStorage.getItem("role") || "user").toLowerCase();
  const currentPath = location.pathname;

  // ✅ Highlight active sidebar link
  const isActive = (path) =>
    currentPath === `/dashboard${path ? "/" + path : ""}`
      ? "bg-blue-700 text-white"
      : "text-gray-700 hover:bg-gray-100";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <aside
        className={`fixed md:static top-0 left-0 w-64 h-full bg-white shadow-lg z-50
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">🎓 Dashboard</h1>
          <button
            className="md:hidden text-gray-600 text-xl"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          <Link to="/dashboard" className={`px-4 py-2 rounded ${isActive("")}`}>
            📊 Dashboard Summary
          </Link>
          <Link to="/dashboard/chart" className={`px-4 py-2 rounded ${isActive("chart")}`}>
            📈 Charts
          </Link>
          {role === "admin" && (
            <>
              <Link to="/dashboard/add" className={`px-4 py-2 rounded ${isActive("add")}`}>
                ➕ Add Course
              </Link>
              <Link to="/dashboard/view" className={`px-4 py-2 rounded ${isActive("view")}`}>
                📋 View Courses
              </Link>
              <Link to="/dashboard/roles" className={`px-4 py-2 rounded ${isActive("roles")}`}>
                🧩 User Role Pie Chart
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Navbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-700 text-2xl"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-gray-600 font-medium capitalize">
              Role: {role}
            </span>
            <Link to="/" className="text-gray-500 hover:underline">🏠 Home</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet /> {/* 👈 Summary or CRUD rendered here */}
        </main>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
