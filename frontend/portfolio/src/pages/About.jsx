import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, X, Save, Sparkles, Image as ImageIcon } from "lucide-react";
import { isAdminLoggedIn } from "../utils/isAdmin";
import { getCache, setCache } from "../utils/cache";

export default function About() {
  const API = process.env.REACT_APP_API_URL;
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const defaultAbout = {
    description:
      "I am a passionate Full Stack MERN Developer with practical experience in building responsive and scalable web applications using React, Node.js, Express, and MongoDB.\n\nI have developed full-stack projects that include authentication using JWT, REST API integration, database management with MongoDB, and deployment on cloud platforms like Render.",
    subDescription:
      "I enjoy solving problems, building efficient backend systems, and designing clean user interfaces that enhance user experience.\n\nAs a fresher, I am actively looking for internship or entry-level developer opportunities where I can contribute my skills and grow in a collaborative and professional environment.",
    badges: ["🚀 Fast Learner", "🤖 AI Enthusiast", "💡 Problem Solver"],
    image: "/lapi.png",
  };

  const [aboutData, setAboutData] = useState(defaultAbout);

  const [editForm, setEditForm] = useState({
    description: "",
    subDescription: "",
    badges: "",
    image: "",
  });

  useEffect(() => {
    setAdmin(isAdminLoggedIn());

    const fetchAbout = async () => {
      try {
        const cached = getCache("aboutCache");
        if (cached && typeof cached === "object") {
          setAboutData((prev) => ({ ...prev, ...cached }));
        }

        if (!API) return;

        const res = await axios.get(`${API}/api/profile/get-about`);
        if (res.data) {
          setAboutData({
            description: res.data.description || defaultAbout.description,
            subDescription: res.data.subDescription || defaultAbout.subDescription,
            badges:
              res.data.badges && res.data.badges.length > 0
                ? res.data.badges
                : defaultAbout.badges,
            image: res.data.image || defaultAbout.image,
          });
          setCache("aboutCache", res.data);
        }
      } catch (err) {
        console.error("Error fetching about data:", err);
      }
    };

    fetchAbout();
  }, [API]);

  const openEditModal = () => {
    setEditForm({
      description: aboutData.description || "",
      subDescription: aboutData.subDescription || "",
      badges: Array.isArray(aboutData.badges) ? aboutData.badges.join(", ") : "",
      image: aboutData.image || "/lapi.png",
    });
    setShowEditModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: Please login as admin first.");
      return;
    }

    setLoading(true);
    try {
      const parsedBadges = editForm.badges
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean);

      const payload = {
        description: editForm.description,
        subDescription: editForm.subDescription,
        badges: parsedBadges,
        image: editForm.image.trim() || "/lapi.png",
      };

      const res = await axios.put(`${API}/api/profile/update-about`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = {
        description: res.data.description || payload.description,
        subDescription: res.data.subDescription || payload.subDescription,
        badges:
          res.data.badges && res.data.badges.length > 0
            ? res.data.badges
            : payload.badges,
        image: res.data.image || payload.image,
      };

      setAboutData(updated);
      setCache("aboutCache", updated);
      setShowEditModal(false);
      alert("About Me updated successfully!");
    } catch (err) {
      console.error("Failed to update about data:", err);
      alert("Update failed. Please check your admin login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="about"
      className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center px-4 sm:px-6 lg:px-12 py-20 overflow-hidden"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        {/* Animated Image Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center md:justify-end"
        >
          <div className="relative group">
            {/* Glowing Backdrop Ring */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />

            <motion.img
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              src={aboutData.image || "/lapi.png"}
              alt="About illustration"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/lapi.png";
              }}
              className="
                relative
                w-72 sm:w-96 md:w-[440px] lg:w-[500px] xl:w-[540px]
                rounded-2xl shadow-2xl border border-cyan-400/40
                object-cover
                hover:scale-[1.02] transition duration-500
              "
            />
          </div>
        </motion.div>

        {/* Animated Text Side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 text-center md:text-left"
        >
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              About <span className="text-cyan-400">Me</span>
            </h2>

            {/* Admin Edit Trigger */}
            {admin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openEditModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 transition-all duration-200"
              >
                <Edit3 size={15} /> Edit About
              </motion.button>
            )}
          </div>

          {/* Description Paragraph 1 */}
          <div className="text-gray-300 leading-relaxed text-base sm:text-lg whitespace-pre-line font-light">
            {aboutData.description}
          </div>

          {/* Description Paragraph 2 */}
          {aboutData.subDescription && (
            <div className="text-gray-400 leading-relaxed text-base sm:text-lg whitespace-pre-line font-light">
              {aboutData.subDescription}
            </div>
          )}

          {/* Skills / Highlight Badges */}
          {aboutData.badges && aboutData.badges.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
              {aboutData.badges.map((badge, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.08, y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="bg-cyan-500/10 border border-cyan-400/40 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] px-4 py-2 rounded-xl text-sm sm:text-base text-cyan-200 font-medium transition-colors cursor-default"
                >
                  {badge}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Admin Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-gray-900 border border-cyan-400/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-cyan-400" size={20} />
                  <h3 className="text-xl font-bold text-white">Edit About Section</h3>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                    Primary Description
                  </label>
                  <textarea
                    rows={4}
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    placeholder="Enter main introduction about yourself..."
                    className="w-full bg-black/50 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                    Secondary Description / Career Goals
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.subDescription}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subDescription: e.target.value })
                    }
                    placeholder="Enter secondary details, career aspirations, or background..."
                    className="w-full bg-black/50 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                    Badges / Highlights (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.badges}
                    onChange={(e) =>
                      setEditForm({ ...editForm, badges: e.target.value })
                    }
                    placeholder="e.g. 🚀 Fast Learner, 🤖 AI Enthusiast, 💡 Problem Solver"
                    className="w-full bg-black/50 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate multiple badges with commas. Emojis are supported!
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-cyan-400" />
                      Image URL (Default: /lapi.png)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={editForm.image}
                    onChange={(e) =>
                      setEditForm({ ...editForm, image: e.target.value })
                    }
                    placeholder="/lapi.png or https://example.com/photo.jpg"
                    className="w-full bg-black/50 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-2.5 rounded-xl transition shadow-md shadow-cyan-500/20 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 rounded-xl transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
