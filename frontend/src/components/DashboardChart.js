import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axios from "axios";

export default function DashboardChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:5000/courses/viewproduct");
        const courses = Array.isArray(res.data) ? res.data : res.data.data || [];

        // Prepare months array
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Count courses by month
        const monthlyCounts = new Array(12).fill(0);
        courses.forEach(course => {
          const date = new Date(course.createdAt || course.date || Date.now());
          const monthIndex = date.getMonth(); // 0 = Jan
          monthlyCounts[monthIndex]++;
        });

        // Prepare chart data for the last 6 months
        const currentMonth = new Date().getMonth();
        const lastSixMonths = [];
        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12;
          lastSixMonths.push({
            month: months[monthIndex],
            courses: monthlyCounts[monthIndex],
          });
        }

        setChartData(lastSixMonths);
      } catch (err) {
        console.error("Error fetching course chart data:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">📊 Courses Per Month</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="courses" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
