import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardSummaryCards() {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalCourses: 0,
    admins: 0,
    newCourses: 0,
  });

  useEffect(() => {
  async function fetchSummary() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/dashboard/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSummary(res.data);
    } catch (err) {
      console.error("Dashboard summary fetch failed", err);
      setSummary({
        totalUsers: 10,
        totalCourses: 12,
        admins: 2,
        newCourses: 3,
      });
    }
  }

  fetchSummary();
}, []);


  const cardStyle = "bg-white shadow rounded-lg p-5 flex flex-col items-center justify-center";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
      <div className={cardStyle}>
        <h3 className="text-xl font-bold">{summary.totalUsers}</h3>
        <p className="text-gray-500">Total Users</p>
      </div>

      <div className={cardStyle}>
        <h3 className="text-xl font-bold">{summary.totalCourses}</h3>
        <p className="text-gray-500">Total Courses</p>
      </div>

      <div className={cardStyle}>
        <h3 className="text-xl font-bold">{summary.admins}</h3>
        <p className="text-gray-500">Admins</p>
      </div>

      <div className={cardStyle}>
        <h3 className="text-xl font-bold">{summary.newCourses}</h3>
        <p className="text-gray-500">New This Month</p>
      </div>
    </div>
  );
}
