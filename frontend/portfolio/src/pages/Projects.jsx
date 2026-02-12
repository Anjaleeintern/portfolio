// PROJECTS PAGE COMPONENT

import { useEffect, useState } from "react";
import axios from "axios";
import AdminControls from "../Admin/AdminControls";
import { isAdminLoggedIn } from "../utils/isAdmin";
import { motion } from "framer-motion";

export default function Projects() {
   const API = process.env.REACT_APP_API_URL;
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
 

  const admin = isAdminLoggedIn();
  const token = localStorage.getItem("token");

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const res = await axios.get(`${API}/api/projects/get-projects`);
    setProjects(res.data);
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete project?")) return;
    await axios.delete(`${API}/api/projects/delete-project/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProjects();
  };

  const handleSave = async () => {
    if (editingProject._id) {
      await axios.put(
        `${API}/api/projects/edit-project/${editingProject._id}`,
        editingProject,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post(
        `${API}/api/projects/add-project`,
        editingProject,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setShowForm(false);
    setEditingProject(null);
    fetchProjects();
  };

  return (
    <section
      id="projects"
      className=" bg-gradient-to-br  from-black via-gray-900 to-black text-white py-16 sm:py-20 px-4 sm:px-8 lg:px-16"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold mb-12 tracking-wide">
        My <span className="text-cyan-400">Projects</span>
      </h2>

      {admin && (
        <div className="flex justify-center mb-10">
          <AdminControls onAdd={() => { setEditingProject({}); setShowForm(true); }} />
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div className="bg-gray-900/80 backdrop-blur-md border border-cyan-400/10 shadow-lg p-5 sm:p-8 rounded-2xl mb-14 max-w-2xl mx-auto space-y-4">
          <h2 className="text-lg sm:text-xl text-cyan-400 font-semibold">
            {editingProject._id ? "Edit Project" : "Add Project"}
          </h2>

          <input
            placeholder="Title"
            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition"
            value={editingProject.title || ""}
            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
          />

          <textarea
            placeholder="Description"
            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition"
            value={editingProject.description || ""}
            onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
          />

          <input
            placeholder="Tech Stack"
            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition"
            value={editingProject.tech_stack || ""}
            onChange={(e) => setEditingProject({ ...editingProject, tech_stack: e.target.value })}
          />

          <input
            placeholder="GitHub URL"
            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition"
            value={editingProject.github_url || ""}
            onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
          />

          <input
            placeholder="Live URL"
            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition"
            value={editingProject.live_url || ""}
            onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-medium py-2 rounded-lg transition"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PROJECT CARDS */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects.map((project) => (
          <motion.div
            key={project._id}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-cyan-400/10 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-cyan-400/10 transition"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-cyan-400">
              {project.title}
            </h3>

            <p className="text-gray-400 text-sm sm:text-base mt-3 leading-relaxed">
              {project.description}
            </p>

            <p className="text-xs sm:text-sm text-gray-500 mt-3">
              {project.tech_stack}
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-sm rounded-lg border border-gray-600 hover:border-cyan-400 hover:text-cyan-400 transition"
              >
                GitHub
              </a>
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-sm rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-medium transition"
              >
                Live
              </a>
            </div>

            {admin && (
              <div className="mt-4">
                <AdminControls
                  onEdit={() => { setEditingProject(project); setShowForm(true); }}
                  onDelete={() => deleteProject(project._id)}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
