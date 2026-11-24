import AdminUpdateButton from "../Admin/AdminUpdateButton";
import { isAdminLoggedIn } from "../utils/isAdmin";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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


  const displayName = profile?.name ? profile.name.trim().split(" ")[0] : "Anjalee";
  const nameLetters = Array.from(displayName);

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 flex items-center justify-center px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden"
    >
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full top-10 left-10 pointer-events-none"></div>

      {/* Feedback message */}
      {updateMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-black px-4 py-2 rounded-lg z-50 shadow-lg">
          {updateMessage}
        </div>
      )}

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center relative z-10">
        {/* LEFT SIDE: Animated Text */}
        <div className="text-white space-y-6 text-center md:text-left">
          {/* Animated Heading with Letter-by-Letter Name */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight flex flex-wrap items-center justify-center md:justify-start gap-x-2.5 gap-y-1"
          >
            <span className="whitespace-nowrap">Hi, I'm</span>
            <span className="text-cyan-400 inline-flex overflow-hidden">
              {nameLetters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 25, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.2 + index * 0.09,
                    type: "spring",
                    damping: 12,
                    stiffness: 180,
                  }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            <motion.span
              animate={{ rotate: [0, 16, -10, 16, -4, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: "easeInOut",
              }}
              className="inline-block origin-[70%_70%] select-none cursor-default ml-1"
            >
              👋
            </motion.span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-base sm:text-xl lg:text-2xl text-gray-300 font-medium leading-snug"
          >
            Full Stack MERN Developer | React • Node • MongoDB
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto md:mx-0"
          >
            I build responsive and scalable web applications using the MERN stack.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap justify-center md:justify-start items-center gap-3 sm:gap-4 pt-3"
          >
            <a
              href={profile?.resume ? `${profile.resume}?v=${resumeVersion}` : "/AnjaleeBisen.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium shadow-lg shadow-cyan-500/25 hover:scale-105 transition duration-300"
            >
              View Resume
            </a>

            {admin && (
              <AdminUpdateButton label="Resume" onClick={() => setShowResumeModal(true)} />
            )}

            <a
              href="#contact"
              className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base border border-cyan-400 text-cyan-300 rounded-xl hover:bg-cyan-500/10 hover:scale-105 transition duration-300"
            >
              Contact Me
            </a>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Profile Photo (Enlarged & Responsive) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-center justify-center relative mt-4 md:mt-0"
        >
          {/* Ambient Glow Backdrop */}
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] bg-cyan-500/25 rounded-full blur-3xl pointer-events-none"></div>

          {/* Floating Enlarged Circular Profile Photo */}
          <motion.img
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            src={profile?.photo ? `${profile.photo}?v=${photoVersion}` : "/anjaleephoto.jpeg"}
            alt={profile?.name || "Anjalee Bisen"}
            className="w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[350px] lg:h-[350px] xl:w-[380px] xl:h-[380px] object-cover rounded-full border-4 border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.45)] hover:shadow-[0_0_65px_rgba(34,211,238,0.7)] hover:scale-[1.03] transition duration-500 relative z-10"
          />

          {admin && (
            <div className="mt-5 relative z-10">
              <AdminUpdateButton label="Photo" onClick={() => setShowPhotoModal(true)} />
            </div>
          )}
        </motion.div>
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
