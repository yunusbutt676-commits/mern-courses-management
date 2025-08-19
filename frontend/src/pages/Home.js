import { useEffect, useState } from "react";
import API from "../api"; // ✅ Centralized Axios instance
import CourseCard from "../components/CourseCard";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ Get JWT
        const res = await API.get("/courses/viewproduct", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Send token
        });

        console.log("API response:", res.data);

        const data =
          Array.isArray(res.data) ? res.data
          : Array.isArray(res.data.data) ? res.data.data
          : Array.isArray(res.data.courses) ? res.data.courses
          : [];

        setCourses(data);
      } catch (err) {
        console.error("❌ Error fetching courses:", err.response?.data || err.message);
        setCourses([]); // ✅ Clear courses if error
      } finally {
        setLoading(false); // ✅ Always stop loading
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Courses</h1>

      {loading ? (
        <p className="text-gray-500">Loading courses...</p>
      ) : courses.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No courses found.</p> // ✅ Stops infinite "Loading"
      )}
    </div>
  );
}
