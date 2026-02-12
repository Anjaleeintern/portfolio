// EXPERIENCE PAGE COMPONENT

import { useEffect, useState } from "react";
import axios from "axios";
import { isAdminLoggedIn } from "../utils/isAdmin";

export default function Experience() {
  const API = process.env.REACT_APP_API_URL
  const admin = isAdminLoggedIn();
  const token = localStorage.getItem("token");

  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  

  const [form, setForm] = useState({
    title: "",
    company: "",
    duration: "",
    description: "",
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const res = await axios.get(`${API}/api/experience/get-experience`);
    setExperiences(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editing) {
      await axios.put(
        `${API}/api/experience/edit-experience/${editing._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Updated");
    } else {
      await axios.post(
        `${API}/api/experience/add-experience`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added");
    }

    setForm({ title:"", company:"", duration:"", description:"" });
    setEditing(null);
    setShowForm(false);
    fetchData();
  };

  const deleteExp = async (id) => {
    await axios.delete(`${API}/api/experience/delete-experience/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchData();
  };

  const editExp = (exp) => {
    setEditing(exp);
    setForm(exp);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="experience" className=" bg-gradient-to-br  from-black via-gray-900 to-black text-white py-16 sm:py-20 px-4 sm:px-8 lg:px-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold mb-12 tracking-wide">
        Professional <span className="text-cyan-400">Experience</span>
      </h2>

      {/* ADD BUTTON */}
      {admin && !showForm && (
        <div className="flex justify-center mb-10">
          <button
            onClick={() => { setShowForm(true); setEditing(null); }}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-full shadow-md transition"
          >
            ➕ Add Experience
          </button>
        </div>
      )}

      {/* FORM */}
      {admin && showForm && (
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-gray-900/80 backdrop-blur-md border border-cyan-400/10 shadow-lg p-6 sm:p-8 rounded-2xl mb-14 space-y-4"
        >
          <input
            placeholder="Job Title"
            value={form.title}
            onChange={e=>setForm({...form,title:e.target.value})}
            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition"
          />

          <input
            placeholder="Company Name"
            value={form.company}
            onChange={e=>setForm({...form,company:e.target.value})}
            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition"
          />

          <input
            placeholder="Duration"
            value={form.duration}
            onChange={e=>setForm({...form,duration:e.target.value})}
            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition"
          />

          <textarea
            placeholder="Work Description"
            value={form.description}
            onChange={e=>setForm({...form,description:e.target.value})}
            className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition"
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-medium py-2 rounded-lg transition">
              {editing ? "Update Experience" : "Save Experience"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* FRESHER MESSAGE */}
      {experiences.length === 0 && !admin && (
        <div className="text-center max-w-3xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed">
          🚀 I am a passionate fresher exploring opportunities as a
          <span className="text-cyan-400 font-semibold"> Software Developer </span>
          and in the
          <span className="text-cyan-400 font-semibold"> Database & Data Field</span>.
          Currently building real-world projects and continuously upgrading my skills.
        </div>
      )}

      {/* TIMELINE */}
      <div className="relative border-l-2 border-cyan-400/20 max-w-4xl mx-auto space-y-12 mt-12">
        {experiences.map(exp => (
          <div key={exp._id} className="ml-6 group">
            <div className="absolute w-4 h-4 bg-cyan-400 rounded-full -left-2.5 top-2 group-hover:scale-125 transition"></div>

            <div className="bg-gray-900 border border-gray-800 group-hover:border-cyan-400/40 rounded-xl p-5 sm:p-6 shadow-md transition">
              <h3 className="text-lg sm:text-xl font-semibold text-cyan-400">{exp.title}</h3>
              <p className="text-gray-400 text-sm sm:text-base">{exp.company}</p>
              <p className="text-xs sm:text-sm text-gray-500">{exp.duration}</p>
              <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed">{exp.description}</p>

              {admin && (
                <div className="flex flex-wrap gap-3 mt-5">
                  <button onClick={()=>editExp(exp)} className="px-4 py-2 text-sm rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black transition">
                    Edit
                  </button>
                  <button onClick={()=>deleteExp(exp._id)} className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-500 transition">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
