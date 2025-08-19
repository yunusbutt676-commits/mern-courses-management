import { Link } from "react-router-dom";

export default function Navbar() {
  const role = localStorage.getItem("role"); // "admin" or "user" or null

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-700">
        🎓 Courses
      </Link>

      <div className="flex gap-4 items-center">
        {/* Public view */}
        <Link
          to="/viewcourses"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Courses
        </Link>

        {/* Admin-only dashboard */}
        {role === "admin" && (
          <Link
            to="/dashboard"
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Dashboard
          </Link>
        )}

        {/* Logout option if logged in */}
        {role && (
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
