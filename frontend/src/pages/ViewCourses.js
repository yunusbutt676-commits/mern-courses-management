import { useEffect, useState } from "react";
import API from "../api"; // ✅ Use your centralized Axios instance
import ReactPaginate from "react-paginate";

export default function ViewCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useState(true);

  const coursesPerPage = 6;

  useEffect(() => {
    fetchCourses();
  }, []);

  /** ---------- Fetch Courses ---------- **/
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/courses/viewproduct");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Search + Pagination ---------- **/
  const filteredCourses = courses.filter((c) =>
    (c.username || "").toLowerCase().includes(search.toLowerCase())
  );

  const pageCount = Math.ceil(filteredCourses.length / coursesPerPage);
  const pagesVisited = pageNumber * coursesPerPage;
  const displayCourses = filteredCourses.slice(
    pagesVisited,
    pagesVisited + coursesPerPage
  );

  const changePage = ({ selected }) => setPageNumber(selected);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        All Courses
      </h2>

      {/* 🔍 Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPageNumber(0);
          }}
          className="border p-3 rounded w-64"
        />
      </div>

      {/* 📦 Loading State */}
      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">
          Loading courses...
        </p>
      ) : displayCourses.length > 0 ? (
        <>
          {/* 📦 Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCourses.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
              >
                {item.image && (
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.username}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold">{item.username}</h3>
                <p className="text-sm text-gray-600">📧 {item.email}</p>
                <p className="text-sm text-gray-600">📱 {item.phone}</p>
                <p className="mt-2 text-gray-700">{item.message}</p>
              </div>
            ))}
          </div>

          {/* 📄 Pagination */}
          {pageCount > 1 && (
            <div className="flex justify-center mt-6">
              <ReactPaginate
                previousLabel={"← Prev"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={changePage}
                containerClassName="flex space-x-2"
                pageClassName="px-3 py-1 border rounded cursor-pointer text-sm"
                activeClassName="bg-blue-500 text-white"
                previousClassName="px-3 py-1 border rounded cursor-pointer text-sm"
                nextClassName="px-3 py-1 border rounded cursor-pointer text-sm"
              />
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-600 mt-6">
          ❌ No courses found. Try adjusting your search.
        </p>
      )}
    </div>
  );
}
