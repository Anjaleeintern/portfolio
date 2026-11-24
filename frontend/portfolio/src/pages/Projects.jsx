// PROJECTS PAGE COMPONENT
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Globe, Code2, Plus, X, FolderGit2 } from "lucide-react";
import AdminControls from "../Admin/AdminControls";
import { isAdminLoggedIn } from "../utils/isAdmin";
import { getCache, setCache } from "../utils/cache";

export default function Projects() {
  const API = process.env.REACT_APP_API_URL;
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const admin = isAdminLoggedIn();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Load cache first
      const cached = getCache("projectsCache");
      if (cached && Array.isArray(cached)) setProjects(cached);

      // Fetch fresh data
      const res = await axios.get(`${API}/api/projects/get-projects`);
      if (res.data && Array.isArray(res.data)) {
        setProjects(res.data);
        setCache("projectsCache", res.data);
      }
    } catch (err) {
      console.log("Fetch Projects Error:", err);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await axios.delete(`${API}/api/projects/delete-project/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProjects();
      alert("Project deleted successfully");
    } catch (err) {
      console.log("Delete Project Error:", err);
      alert("Delete failed");
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!editingProject?.title) {
      alert("Please provide a project title");
      return;
    }

    try {
      if (editingProject?._id) {
        // Update existing project
        await axios.put(
          `${API}/api/projects/edit-project/${editingProject._id}`,
          editingProject,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Project updated successfully");
      } else {
        // Add new project
        await axios.post(
          `${API}/api/projects/add-project`,
          editingProject,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Project added successfully");
      }

      setShowForm(false);
      setEditingProject(null);
      await fetchProjects();
    } catch (err) {
      console.log("Save Project Error:", err);
      alert("Save failed");
    }
  };

  // Helper to ensure URLs always open properly with protocol
  const formatUrl = (url) => {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  // Determine which URL the "View" action should open:
  // If Live URL is provided, open Live URL; otherwise open GitHub URL
  const getViewTarget = (project) => {
    const live = formatUrl(project.live_url);
    const github = formatUrl(project.github_url);

    if (live) {
      return { url: live, isLive: true, label: "View Live" };
    }
    if (github) {
      return { url: github, isLive: false, label: "View Code" };
    }
    return null;
  };

  const handleViewClick = (project) => {
    const target = getViewTarget(project);
    if (target?.url) {
      window.open(target.url, "_blank", "noopener,noreferrer");
    } else {
      alert("No live demo or GitHub URL has been added for this project yet.");
    }
  };

  return (
    <section
      id="projects"
      className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white py-20 px-4 sm:px-8 lg:px-16 overflow-hidden"
    >
      {/* Decorative Background Lighting */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <FolderGit2 size={14} /> My Creative Works
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Featured <span className="text-cyan-400">Projects</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            A showcase of full-stack web applications, dynamic APIs, and responsive user experiences.
          </p>
        </motion.div>

        {/* Admin Add Button */}
        {admin && (
          <div className="flex justify-center mb-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingProject({
                  title: "",
                  description: "",
                  tech_stack: "",
                  github_url: "",
                  live_url: "",
                });
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200"
            >
              <Plus size={18} /> Add New Project
            </motion.button>
          </div>
        )}

        {/* Add / Edit Project Modal Form */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.25 }}
                className="bg-gray-900 border border-cyan-400/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                    <Code2 size={20} />
                    {editingProject?._id ? "Edit Project" : "Add New Project"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingProject(null);
                    }}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                      Project Title *
                    </label>
                    <input
                      placeholder="e.g. Modern E-Commerce Platform"
                      value={editingProject?.title || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, title: e.target.value })
                      }
                      className="w-full bg-black/50 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                      Description *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Explain what the project does and key features..."
                      value={editingProject?.description || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-black/50 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                      Tech Stack (Comma-separated)
                    </label>
                    <input
                      placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
                      value={editingProject?.tech_stack || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          tech_stack: e.target.value,
                        })
                      }
                      className="w-full bg-black/50 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                        Live Demo URL
                      </label>
                      <input
                        placeholder="https://myproject.vercel.app"
                        value={editingProject?.live_url || ""}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            live_url: e.target.value,
                          })
                        }
                        className="w-full bg-black/50 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">
                        GitHub Repository URL
                      </label>
                      <input
                        placeholder="https://github.com/username/project"
                        value={editingProject?.github_url || ""}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            github_url: e.target.value,
                          })
                        }
                        className="w-full bg-black/50 border border-gray-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-2.5 rounded-xl transition shadow-md shadow-cyan-500/20"
                    >
                      Save Project
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingProject(null);
                      }}
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

        {/* Project Cards Grid with Staggered Motion */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const target = getViewTarget(project);
            const liveUrl = formatUrl(project.live_url);
            const githubUrl = formatUrl(project.github_url);

            return (
              <motion.div
                key={project._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col justify-between bg-gradient-to-br from-gray-900/95 via-gray-900/80 to-black/95 border border-cyan-400/20 hover:border-cyan-400/60 rounded-2xl p-6 shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300"
              >
                {/* Top Content */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition duration-200">
                      {project.title}
                    </h3>
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                      <Code2 size={20} />
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mt-3 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack Pills */}
                  {project.tech_stack && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.tech_stack
                        .split(",")
                        .map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/20 text-cyan-300 font-medium"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Area */}
                <div className="pt-6 mt-4 border-t border-gray-800/80">
                  {/* Action Buttons: Unified "View" button that opens whichever URL was added */}
                  <div className="flex items-center gap-3">
                    {/* Primary Dynamic VIEW Button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleViewClick(project)}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition duration-200 ${
                        target
                          ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-md shadow-cyan-500/25"
                          : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                      }`}
                    >
                      {target?.isLive ? <Globe size={16} /> : <ExternalLink size={16} />}
                      <span>{target ? (target.isLive ? "View Live" : "View Code") : "View"}</span>
                    </motion.button>

                    {/* Secondary Link: If both Live and GitHub exist, show GitHub code button */}
                    {liveUrl && githubUrl && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Source Code"
                        className="inline-flex items-center justify-center p-2.5 border border-gray-700 hover:border-cyan-400 rounded-xl text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
                      >
                        <Github size={18} />
                      </motion.a>
                    )}
                  </div>

                  {/* Admin Controls */}
                  {admin && (
                    <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Admin Actions:</span>
                      <AdminControls
                        onEdit={() => {
                          setEditingProject(project);
                          setShowForm(true);
                        }}
                        onDelete={() => deleteProject(project._id)}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
