import { useEffect, useState } from "react";
import API from "../api"; // ✅ Uses axios instance with token
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import ReactPaginate from "react-paginate";

export default function AddCourse() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    message: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  const coursesPerPage = 6;
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchCourses();
  }, []);

  /** ---------- Fetch Courses ---------- **/
  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses/viewproduct");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err.message);
      setCourses([]);
    }
  };

  /** ---------- Handle Form Change ---------- **/
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      const imageFile = files[0];
      setFormData({ ...formData, image: imageFile });
      setPreview(URL.createObjectURL(imageFile));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /** ---------- Add Course ---------- **/
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return showError("⚠️ Please select an image.");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));

      const res = await API.post("/courses/addproduct", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status === 0) showError(res.data.message || "❌ Failed to add course.");
      else {
        showSuccess("✅ Course added successfully!");
        setFormData({ username: "", email: "", phone: "", message: "", image: null });
        setPreview(null);
        fetchCourses();
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      showError("❌ Failed to add course.");
    }
  };

  /** ---------- Delete Course ---------- **/
  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await API.delete(`/courses/deleteproduct/${_id}`);
      if (res.data.status === 0) showError(res.data.msg || "❌ Failed to delete course.");
      else {
        setCourses((prev) => prev.filter((c) => c._id !== _id));
        showSuccess("🗑️ Course deleted successfully!");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      showError("❌ Failed to delete course.");
    }
  };

  /** ---------- Edit Course ---------- **/
  const handleEditClick = (course) => {
    setEditId(course._id);
    setEditData({ ...course, image: null });
    setImagePreview(null);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setEditData({ ...editData, image: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      Object.keys(editData).forEach((key) => {
        if (editData[key]) data.append(key, editData[key]);
      });

      const res = await API.put(`/courses/updateproduct/${editId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status === 0) showError(res.data.msg || "❌ Update failed.");
      else {
        showSuccess("✅ Course updated successfully!");
        setEditId(null);
        setEditData({});
        setImagePreview(null);
        fetchCourses();
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      showError("❌ Update failed.");
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setEditData({});
    setImagePreview(null);
  };

  /** ---------- Toast Helpers ---------- **/
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  /** ---------- Pagination + Search ---------- **/
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
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h2>

      {/* ---------- Add Course Form ---------- */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-md mb-10"
      >
        <input name="username" placeholder="Name" value={formData.username} onChange={handleChange} required className="w-full p-4 border border-gray-300 rounded-lg" />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-4 border border-gray-300 rounded-lg" />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required className="w-full p-4 border border-gray-300 rounded-lg" />
        <input name="image" type="file" accept="image/*" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3" />

        <div className="md:col-span-2">
          <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required rows="4" className="w-full p-4 border border-gray-300 rounded-lg resize-none"></textarea>
          {preview && <img src={preview} alt="Preview" className="w-40 h-40 object-cover mt-4 rounded-md border" />}
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            Submit
          </button>
        </div>
      </form>

      {/* ---------- Search ---------- */}
      <input
        type="text"
        placeholder="Search by username..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPageNumber(0);
        }}
        className="border p-2 rounded w-64 mb-6"
      />

      {/* ---------- Course Cards (Edit/Delete for Admin Only) ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCourses.map((item) => (
          <div key={item._id} className="bg-white shadow-md rounded-xl p-4 relative">
            {editId === item._id ? (
              <>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-3" />
                ) : (
                  item.image && <img src={`http://localhost:5000/uploads/${item.image}`} alt="Old" className="w-full h-48 object-cover rounded-lg mb-3" />
                )}

                <input type="file" name="image" accept="image/*" onChange={handleEditChange} className="mb-2 w-full border p-2 rounded" />
                <input name="username" value={editData.username || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-2" />
                <input type="email" name="email" value={editData.email || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-2" />
                <input name="phone" value={editData.phone || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-2" />
                <textarea name="message" value={editData.message || ""} onChange={handleEditChange} className="w-full p-2 border rounded mb-2"></textarea>

                <div className="flex justify-end gap-3 mt-2">
                  <button onClick={handleSave} className="text-green-600 hover:text-green-800" title="Save"><FaSave /></button>
                  <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800" title="Cancel"><FaTimes /></button>
                </div>
              </>
            ) : (
              <>
                {item.image && <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.username} className="w-full h-48 object-cover rounded-lg mb-3" />}
                <h3 className="text-lg font-semibold">{item.username}</h3>
                <p className="text-sm text-gray-600">📧 {item.email}</p>
                <p className="text-sm text-gray-600">📱 {item.phone}</p>
                <p className="mt-2 text-gray-700">{item.message}</p>

                {role === "admin" && (
                  <div className="flex justify-end gap-3 mt-4">
                    <button onClick={() => handleEditClick(item)} className="text-blue-600 hover:text-blue-800" title="Edit"><FaEdit /></button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800" title="Delete"><FaTrash /></button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* ---------- Pagination ---------- */}
      {pageCount > 1 && (
        <div className="flex justify-center mt-6">
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={changePage}
            containerClassName="flex space-x-2"
            pageClassName="px-3 py-1 border rounded cursor-pointer"
            activeClassName="bg-blue-500 text-white"
            previousClassName="px-3 py-1 border rounded cursor-pointer"
            nextClassName="px-3 py-1 border rounded cursor-pointer"
          />
        </div>
      )}

      {/* ---------- Toast Messages ---------- */}
      {successMessage && <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">{successMessage}</div>}
      {errorMessage && <div className="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">{errorMessage}</div>}
    </div>
  );
}
