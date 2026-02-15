import AdminUpdateButton from "../Admin/AdminUpdateButton";
import { isAdminLoggedIn } from "../utils/isAdmin";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [admin, setAdmin] = useState(false);
  const API = process.env.REACT_APP_API_URL;

  const [profile, setProfile] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [newResume, setNewResume] = useState(null);

  const [photoVersion, setPhotoVersion] = useState(Date.now()); // for cache-busting
  const [resumeVersion, setResumeVersion] = useState(Date.now()); // for cache-busting

  const [updateMessage, setUpdateMessage] = useState(""); // success feedback

  // Check admin and fetch profile
  useEffect(() => {
    const init = async () => {
      const result = await isAdminLoggedIn();
      setAdmin(result);
      fetchProfile();
    };
    init();
  }, []);

  const getToken = () => localStorage.getItem("token");

  // Fetch profile from API
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/api/profile`);
      setProfile(res.data);

      // update versions to force reload
      setPhotoVersion(Date.now());
      setResumeVersion(Date.now());
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Handle profile photo update
  // const handlePhotoUpdate = async () => {
  //   const token = getToken();
  //   if (!token) return alert("You must be logged in as admin!");
  //   if (!newImage) return alert("Please select a photo to upload!");

  //   try {
  //     const formData = new FormData();
  //     formData.append("photo", newImage);

  //     await axios.put(`${API}/api/profile/update-photo`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     setShowPhotoModal(false);
  //     setNewImage(null);
  //     setPhotoVersion(Date.now()); // force image refresh
  //     fetchProfile(); // fetch updated data
  //     setUpdateMessage("Profile photo updated successfully!");
  //     setTimeout(() => setUpdateMessage(""), 3000);
  //   } catch (err) {
  //     if (err.response?.status === 401) alert("Unauthorized! Please login again.");
  //     else alert("Failed to update photo. Check console.");
  //     console.error(err);
  //   }
  // };

  const handlePhotoUpdate = async () => {
  const token = getToken();
  if (!token) return alert("You must be logged in as admin!");
  if (!newImage) return alert("Please select a photo to upload!");

  // Create a temporary URL for immediate display
  const tempUrl = URL.createObjectURL(newImage);
  setProfile(prev => ({ ...prev, photo: tempUrl }));

  setShowPhotoModal(false);
  setNewImage(null);

  try {
    const formData = new FormData();
    formData.append("photo", newImage);

    await axios.put(`${API}/api/profile/update-photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    // Optionally re-fetch backend version after upload
    fetchProfile();
  } catch (err) {
    alert("Failed to update photo. Reverting...");
    console.error(err);
    fetchProfile(); // Revert to server version
  }
};


  // Handle resume update
  // const handleResumeUpdate = async () => {
  //   const token = getToken();
  //   if (!token) return alert("You must be logged in as admin!");
  //   if (!newResume) return alert("Please select a resume to upload!");

  //   try {
  //     const formData = new FormData();
  //     formData.append("resume", newResume);

  //     await axios.put(`${API}/api/profile/update-resume`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     setShowResumeModal(false);
  //     setNewResume(null);
  //     setResumeVersion(Date.now()); // force resume refresh
  //     fetchProfile();
  //     setUpdateMessage("Resume updated successfully!");
  //     setTimeout(() => setUpdateMessage(""), 3000);
  //   } catch (err) {
  //     if (err.response?.status === 401) alert("Unauthorized! Please login again.");
  //     else alert("Failed to update resume. Check console.");
  //     console.error(err);
  //   }
  // };


  const handleResumeUpdate = async () => {
  const token = getToken();
  if (!token) return alert("You must be logged in as admin!");
  if (!newResume) return alert("Please select a resume to upload!");

  // Show temporary link immediately
  const tempUrl = URL.createObjectURL(newResume);
  setProfile(prev => ({ ...prev, resume: tempUrl }));

  setShowResumeModal(false);
  setNewResume(null);

  try {
    const formData = new FormData();
    formData.append("resume", newResume);

    await axios.put(`${API}/api/profile/update-resume`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProfile(); // Sync backend version
  } catch (err) {
    alert("Failed to update resume. Reverting...");
    console.error(err);
    fetchProfile(); // Revert to server version
  }
};


  return (
    <section
      id="home"
      className="relative min-h-screen pt-24 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden"
    >
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full top-10 left-10"></div>

      {/* Feedback message */}
      {updateMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-black px-4 py-2 rounded-lg z-50 shadow-lg">
          {updateMessage}
        </div>
      )}

      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* LEFT SIDE */}
        <div className="text-white space-y-6 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Hi, I'm <span className="text-cyan-400">Anjalee</span> 👋
          </h1>
          <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-300 font-medium">
            Full Stack MERN Developer | React • Node • MongoDB
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
            I build responsive and scalable web applications using the MERN stack.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <a
              href={profile?.resume ? `${profile.resume}?v=${resumeVersion}` : "/AnjaleeBisen.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium shadow-lg hover:scale-105 transition duration-300"
            >
              View Resume
            </a>

            {admin && (
              <AdminUpdateButton label="Resume" onClick={() => setShowResumeModal(true)} />
            )}

            <a
              href="#contact"
              className="px-6 py-3 border border-cyan-400 text-cyan-300 rounded-xl hover:bg-cyan-500/10 hover:scale-105 transition duration-300"
            >
              Contact Me
            </a>
          </div>
        </div>

        {/* RIGHT SIDE PHOTO */}
        <div className="flex flex-col items-center relative">
          <div className="absolute w-72 h-72 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>
          <img
            src={profile?.photo ? `${profile.photo}?v=${photoVersion}` : "/anjaleephoto.jpeg"}
            alt="Anjalee Bisen"
            className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 object-cover rounded-full border-4 border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-105 transition duration-500 relative z-10"
          />
          {admin && (
            <div className="mt-4">
              <AdminUpdateButton label="Photo" onClick={() => setShowPhotoModal(true)} />
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl w-[90%] sm:w-96 space-y-4 shadow-2xl">
            <h3 className="text-xl text-white font-semibold">Update Resume</h3>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setNewResume(e.target.files[0])}
              className="w-full text-white"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResumeModal(false)}
                className="bg-gray-700 px-4 py-1 rounded-lg"
              >
                Cancel
              </button>
              <button onClick={handleResumeUpdate} className="bg-cyan-500 px-4 py-1 rounded-lg text-black font-medium">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl w-[90%] sm:w-96 space-y-4 shadow-2xl">
            <h3 className="text-xl text-white font-semibold">Update Profile Photo</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files[0])}
              className="w-full text-white"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPhotoModal(false)}
                className="bg-gray-700 px-4 py-1 rounded-lg"
              >
                Cancel
              </button>
              <button onClick={handlePhotoUpdate} className="bg-cyan-500 px-4 py-1 rounded-lg text-black font-medium">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
