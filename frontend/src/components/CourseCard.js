import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      {/* Image clickable with hover effect */}
      <Link to={`/course/${course._id}`} className="block group relative">
        <img
          src={`http://localhost:5000/uploads/${course.image}`}
          alt={course.username}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition rounded-t-xl"></div>
      </Link>

      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{course.username}</h2>
        <p className="text-gray-600 mb-2">{course.email}</p>
        <p className="text-sm text-gray-500 truncate">{course.message}</p>

        <Link
          to={`/course/${course._id}`}
          className="mt-3 inline-block text-sm text-blue-600 hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
