import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api"; // ✅ Use centralized Axios instance

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  /** ---------- Fetch Single Course by ID ---------- **/
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get("/courses/viewproduct");
        const coursesArray =
          Array.isArray(res.data) ? res.data
          : Array.isArray(res.data.data) ? res.data.data
          : [];

        const found = coursesArray.find((item) => item._id === id);
        setCourse(found || null);
      } catch (err) {
        console.error("Error loading course:", err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  /** ---------- Loading State ---------- **/
  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500 text-lg animate-pulse">Loading course...</p>
        </div>
      </>
    );
  }

  /** ---------- Not Found State ---------- **/
  if (!course) {
    return (
      <>
        <div className="flex flex-col justify-center items-center h-screen">
          <p className="text-gray-600 text-xl mb-4">❌ Course not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            ← Back to Courses
          </button>
        </div>
      </>
    );
  }

  /** ---------- Course Details ---------- **/
  return (
    <>
      <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden md:flex">
          
          {/* Image Section */}
          <div className="md:w-1/2 h-96 overflow-hidden">
            {course.image ? (
              <img
                src={`http://localhost:5000/uploads/${course.image}`}
                alt={course.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xl">
                No Image
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-8 md:w-1/2 flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold text-blue-800 mb-6">
              Course Info
            </h1>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600 border">
                <tbody>
                  <tr className="border-b">
                    <th className="px-4 py-3 font-medium text-gray-900 bg-gray-50 w-1/3">
                      Username
                    </th>
                    <td className="px-4 py-3">{course.username}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="px-4 py-3 font-medium text-gray-900 bg-gray-50">
                      Email
                    </th>
                    <td className="px-4 py-3">{course.email}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="px-4 py-3 font-medium text-gray-900 bg-gray-50">
                      Phone
                    </th>
                    <td className="px-4 py-3">{course.phone}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-900 bg-gray-50">
                      Message
                    </th>
                    <td className="px-4 py-3">{course.message}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
              >
                ← Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
