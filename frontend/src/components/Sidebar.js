import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-50 bg-gray-800 text-white flex flex-col p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">
        Dashboard Summary
      </Link>
      <Link to="/dashboard/chart" className="hover:bg-gray-700 p-2 rounded">
        Charts
      </Link>
      <Link to="/dashboard/add" className="hover:bg-gray-700 p-2 rounded">
        CRUD Course
      </Link>
      <Link to="/dashboard/roles" className="hover:bg-gray-700 p-2 rounded">
        User Role Pie Chart
      </Link>
    </div>
  );
}
