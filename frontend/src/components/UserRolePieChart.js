import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

export default function UserRolePieChart() {
  const [data, setData] = useState([]);

  const COLORS = ["#3B82F6", "#F87171"]; // Blue = Admin, Red = User

  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/allusers")
      .then((res) => {
        // Handle API response shape
        const rawUsers = Array.isArray(res.data) ? res.data : res.data.data || [];
        console.log("All Users (raw):", rawUsers);

        // ✅ Remove duplicates by email (or id if available)
        const uniqueUsers = Array.from(
          new Map(rawUsers.map(u => [u.email || u._id || u.name, u])).values()
        );

        // ✅ Normalize roles to lowercase and trim
        const normalizedUsers = uniqueUsers.map(u => ({
          ...u,
          role: (u.role || "user").toLowerCase().trim(),
        }));

        // ✅ Count roles
        const adminCount = normalizedUsers.filter(u => u.role === "admin").length;
        const userCount = normalizedUsers.filter(u => u.role !== "admin").length;

        setData([
          { name: "Admin", value: adminCount },
          { name: "User", value: userCount },
        ]);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        // Dummy fallback
        setData([
          { name: "Admin", value: 3 },
          { name: "User", value: 7 },
        ]);
      });
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">👥 Users by Role</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
