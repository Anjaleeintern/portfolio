
import { useEffect, useState } from "react";
import axios from "axios";
import { isAdminLoggedIn } from "../utils/isAdmin";

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showImage, setShowImage] = useState(false);
  // const [selectedImage, setSelectedImage] = useState("");

  const token = localStorage.getItem("token");
  const admin = isAdminLoggedIn();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // ================= FETCH =================
  const fetchCerts = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/certifications/get-certifications"
    );
    setCerts(res.data);
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

    if (editData) {
      await axios.put(
        `http://localhost:5000/api/certifications/edit-certification/${editData._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post(
        "http://localhost:5000/api/certifications/add-certification",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setShowForm(false);
    fetchCerts();
  };

  // ================= DELETE =================
  const deleteCert = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/certifications/delete-certification/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchCerts();
  };

  // ================= IMAGE VIEW =================
  // const openImage = (img) => {
  //   console.log("Image name:", img);
  //   setSelectedImage(img);
  //   setShowImage(true);
  // };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white shadow-md hover:shadow-cyan-400/10 rounded-2xl transition duration-300 hover:-translate-y-1">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Certifications
        </h2>

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
            className="w-full p-2 rounded bg-gray-800 mb-3"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="w-full p-2 rounded bg-gray-800 mb-3"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            className="mb-3"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 px-3 py-1 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-500 px-3 py-1 rounded"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* CERTIFICATION LIST */}
      <div className="space-y-6">
        {certs.length === 0 ? (
          <p className="text-gray-400">
            No certifications added yet.
          </p>
        ) : (
          certs.map((cert) => (
            <div
              key={cert._id}
              className="border-l-4 border-cyan-400 pl-4 py-4 bg-gray-900/60 rounded-lg hover:bg-gray-800 transition"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                {/* LEFT */}
                <div>
                  <h3 className="text-lg font-semibold">
                    {cert.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {cert.description}
                  </p>
                </div>

                {/* RIGHT BUTTONS */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    // onClick={() => openImage(cert.image)}
                    onClick={() =>
    window.open(
      `http://localhost:5000/uploads/${cert.image}`,
      "_blank"
    )
  }
                    className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 rounded text-sm  text-white 
          shadow-sm  
          transition-all duration-200 hover:-translate-y-0.5"
                  >
                    View
                  </button>

                  {admin && (
                    <>
                      <button
                        onClick={() => openEdit(cert)}
                        className="px-3 py-1 bg-yellow-500
          shadow-sm hover:shadow-red-500/20 
          transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-900 text-black rounded text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteCert(cert._id)}
                        className="px-3 py-1   bg-red-600 hover:bg-red-500 text-white 
          shadow-sm hover:shadow-red-500/20 
          transition-all duration-200 hover:-translate-y-0.5 rounded text-sm"
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

      {/* IMAGE MODAL */}
      {showImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="relative max-w-3xl w-full">
            <img
              src={`http://localhost:5000/uploads/${certs.image}`}
              alt="certificate"
              className="w-full rounded-lg"
            />
            <button
              onClick={() => setShowImage(false)}
              className="absolute top-3 right-3 bg-red-600 px-3 py-1 rounded"
            >
              X
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
