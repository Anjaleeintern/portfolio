// This component manages certifications, allowing admins to add, edit, and delete certifications. It fetches certifications from the backend and displays them in a list. Each certification can be viewed (opens the document in a new tab), and if the user is an admin, they can also edit or delete certifications. The form for adding/editing certifications includes fields for title, description, and an image/PDF upload.
import { useEffect, useState } from "react";
import axios from "axios";
import { isAdminLoggedIn } from "../utils/isAdmin";

export default function Certifications() {
  const API = process.env.REACT_APP_API_URL;
  const [certs, setCerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const token = localStorage.getItem("token");
  const admin = isAdminLoggedIn();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // ================= FETCH =================
  // const fetchCerts = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${API}/api/certifications/get-certifications`,
  //     );
  //     setCerts(res.data);
  //   } catch (err) {
  //     console.log("Fetch Error:", err);
  //   }
  // };


  const fetchCerts = async () => {
  try {
    // 1️⃣ Show cached data instantly
    const cached = localStorage.getItem("certifications");
    if (cached) {
      setCerts(JSON.parse(cached));
    }

    // 2️⃣ Fetch fresh data from server
    const res = await axios.get(
      `${API}/api/certifications/get-certifications`
    );

    setCerts(res.data);

    // 3️⃣ Save new data to cache
    localStorage.setItem("certifications", JSON.stringify(res.data));

  } catch (err) {
    console.log("Fetch Error:", err);
  }
};


  useEffect(() => {
    fetchCerts();
  }, []);

  // ================= OPEN ADD =================
  const openAdd = () => {
    setEditData(null);
    setTitle("");
    setDescription("");
    setImage(null);
    setShowForm(true);
  };

  // ================= OPEN EDIT =================
  const openEdit = (cert) => {
    setEditData(cert);
    setTitle(cert.title);
    setDescription(cert.description);
    setShowForm(true);
  };

  // ================= SUBMIT =================
  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      if (editData) {
        await axios.put(
          `${API}/api/certifications/edit-certification/${editData._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        await axios.post(
          `${API}/api/certifications/add-certification`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      setShowForm(false);
      fetchCerts();
    } catch (err) {
      console.log("Submit Error:", err);
    }
  };

  // ================= DELETE =================
  const deleteCert = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await axios.delete(
          `${API}/api/certifications/delete-certification/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        fetchCerts();
      } catch (err) {
        console.log("Delete Error:", err);
      }
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white shadow-md hover:shadow-cyan-400/10 rounded-2xl transition duration-300 hover:-translate-y-1">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Certifications</h2>

        {admin && (
          <button
            onClick={openAdd}
            className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg transition"
          >
            + Add Certification
          </button>
        )}
      </div>

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={submit}
          className="bg-gray-900 p-6 rounded-xl mb-8 w-full sm:w-[500px]"
        >
          <h3 className="text-lg mb-4">
            {editData ? "Edit Certification" : "Add Certification"}
          </h3>

          <input
            className="w-full p-2 rounded bg-gray-800 mb-3 text-white"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="w-full p-2 rounded bg-gray-800 mb-3 text-white"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            className="mb-3 text-sm text-gray-400"
            // UPDATED: Now accepts both images and PDFs
            accept="image/*,application/pdf"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 px-4 py-1 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-500 px-4 py-1 rounded text-black font-medium"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* CERTIFICATION LIST */}
      <div className="space-y-6">
        {certs.length === 0 ? (
          <p className="text-gray-400">No certifications added yet.</p>
        ) : (
          certs.map((cert) => (
            <div
              key={cert._id}
              className="border-l-4 border-cyan-400 pl-4 py-4 bg-gray-900/60 rounded-lg hover:bg-gray-800 transition"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                {/* LEFT */}
                <div>
                  <h3 className="text-lg font-semibold">{cert.title}</h3>
                  <p className="text-gray-400 text-sm">{cert.description}</p>
                </div>

                {/* RIGHT BUTTONS */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      if (cert.image) {
                        const fileUrl = cert.image.replace(
                          "/image/upload/",
                          "/raw/upload/",
                        );

                        // Pehle normal link try karein, agar fail ho toh replaced link
                        window.open(
                          cert.image,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }
                    }}
                    className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 rounded text-sm text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                  >
                    View Document
                  </button>

                  {admin && (
                    <>
                      <button
                        onClick={() => openEdit(cert)}
                        className="px-3 py-1 bg-yellow-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-600 text-black rounded text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteCert(cert._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 rounded text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
