// SKILLS PAGE COMPONENT

import React, { useState, useEffect } from "react";
import axios from "axios";
import { isAdminLoggedIn } from "../utils/isAdmin";

export default function Skills() {
  const API = process.env.REACT_APP_API_URL;
  const [skillCategories, setSkillCategories] = useState([]);
  const [mode, setMode] = useState(null); // add / update / delete
  const [selectedId, setSelectedId] = useState("");
  const [title, setTitle] = useState("");
  const [skillsInput, setSkillsInput] = useState(""); // comma separated
  const [admin, setAdmin] = useState(false);
  

  // Check if admin logged in
  useEffect(() => {
    const checkAdmin = async () => {
      const result = await isAdminLoggedIn();
      setAdmin(result);
    };
    checkAdmin();
  }, []);

  // Fetch skills from backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`${API}/api/profile`);
        setSkillCategories(res.data.skills || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSkills();
  }, []);

  // Reset modal form
  const resetForm = () => {
    setMode(null);
    setSelectedId("");
    setTitle("");
    setSkillsInput("");
  };

  // Get token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Add Skill
  const addSkill = async () => {
    if (!title || !skillsInput) return alert("Please enter title and skills");
    try {
      const items = skillsInput.split(",").map(s => s.trim());
      const token = getToken();
      const res = await axios.post(
        `${API}/api/profile/add-skill`,
        { title, items },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSkillCategories(res.data);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error adding skill. Check console.");
    }
  };

  // Update Skill
  const updateSkill = async () => {
    if (!selectedId || !title || !skillsInput) return alert("Please fill all fields");
    try {
      const items = skillsInput.split(",").map(s => s.trim());
      const token = getToken();
      const res = await axios.put(
        `${API}/api/profile/update-skill/${selectedId}`,
        { title, items },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSkillCategories(res.data);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error updating skill. Check console.");
    }
  };

  // Delete Skill
  const deleteSkill = async () => {
    if (!selectedId) return alert("Please select a skill card to delete");
    try {
      const token = getToken();
      const res = await axios.delete(
        `${API}/api/profile/delete-skill/${selectedId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSkillCategories(res.data);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error deleting skill. Check console.");
    }
  };


return (
  <section
    id="skills"
    className="min-h-screen bg-gradient-to-br  from-black via-gray-900 to-black text-white px-4 sm:px-6 lg:px-12 py-16"
  >
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
        My <span className="text-cyan-400">Skills</span>
      </h2>

      {/* Admin Buttons */}
      {admin && (
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button
            onClick={() => setMode("add")}
            className="px-5 py-2 bg-green-500 rounded-lg text-sm sm:text-base hover:scale-105 transition shadow-md"
          >
            Add Skill
          </button>
          <button
            onClick={() => setMode("update")}
            className="px-5 py-2 bg-yellow-500 rounded-lg text-sm sm:text-base hover:scale-105 transition shadow-md"
          >
            Update Skill
          </button>
          <button
            onClick={() => setMode("delete")}
            className="px-5 py-2 bg-red-500 rounded-lg text-sm sm:text-base hover:scale-105 transition shadow-md"
          >
            Delete Skill
          </button>
        </div>
      )}

      {/* Modal Form */}
      {mode && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 mb-10 max-w-xl mx-auto shadow-xl">
          <h3 className="text-lg font-semibold mb-4 text-cyan-400 text-center">
            {mode === "add" && "Add Skill Card"}
            {mode === "update" && "Update Skill Card"}
            {mode === "delete" && "Delete Skill Card"}
          </h3>

          {(mode === "add" || mode === "update") && (
            <>
              {mode === "update" && (
                <select
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                  className="w-full mb-3 p-2 rounded bg-black border border-gray-700 text-white"
                >
                  <option value="">Select Skill Card</option>
                  {skillCategories.map(s => (
                    <option key={s._id} value={s._id}>{s.title}</option>
                  ))}
                </select>
              )}

              <input
                type="text"
                placeholder="Card Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full mb-3 p-2 rounded bg-black border border-gray-700 text-white"
              />
              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
                className="w-full mb-4 p-2 rounded bg-black border border-gray-700 text-white"
              />
            </>
          )}

          {mode === "delete" && (
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-black border border-gray-700 text-white"
            >
              <option value="">Select Skill Card</option>
              {skillCategories.map(s => (
                <option key={s._id} value={s._id}>{s.title}</option>
              ))}
            </select>
          )}

          <div className="flex justify-center gap-4">
            {mode === "add" && (
              <button onClick={addSkill} className="bg-green-600 px-4 py-2 rounded hover:scale-105 transition">Save</button>
            )}
            {mode === "update" && (
              <button onClick={updateSkill} className="bg-yellow-600 px-4 py-2 rounded hover:scale-105 transition">Update</button>
            )}
            {mode === "delete" && (
              <button onClick={deleteSkill} className="bg-red-600 px-4 py-2 rounded hover:scale-105 transition">Delete</button>
            )}
            <button onClick={resetForm} className="bg-gray-700 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillCategories.map((category, index) => (
          <div
            key={category._id || index}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-md hover:shadow-cyan-500/30 hover:-translate-y-1 transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-5 text-cyan-400">
              {category.title}
            </h3>

            <div className="flex flex-wrap gap-2">
              {category.items.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs sm:text-sm bg-cyan-500/10 border border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
}
