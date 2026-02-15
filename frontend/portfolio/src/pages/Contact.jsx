// CONTACT PAGE COMPONENT
import { Mail, Phone, MapPin, Linkedin, Github, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { isAdminLoggedIn } from "../utils/isAdmin";
import { getCache, setCache } from "../utils/cache";

export default function Contact() {
  const [showContactModal, setShowContactModal] = useState(false);
   const API = process.env.REACT_APP_API_URL
  const [contactForm, setContactForm] = useState({
    phone: "",
    email: "",
    location: "",
    linkedin: "",
    github: "",
  });
  const [contactData, setContactData] = useState(null);
  const [admin, setAdmin] = useState(false);
 

  useEffect(() => {
    setAdmin(isAdminLoggedIn());
    const cached = getCache("contactCache");
  if (cached) setContactData(cached);
    axios.get(`${API}/api/profile/get-contact`)
      .then((res) => {
        setContactData(res.data);
        setContactForm(res.data);
        setCache("contactCache", res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section
      id="contact"
      className=" bg-gradient-to-br  from-black via-gray-900 to-black text-white py-16 sm:py-20 px-4 sm:px-8 lg:px-16"
    >
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Get In <span className="text-cyan-400">Touch</span>
        </h2>
        <p className="text-gray-400 mt-4 text-sm sm:text-base">
          Open to opportunities, collaborations, and tech discussions.
        </p>
      </div>

      {/* CONTACT CARDS — COMPACT */}
      <div className="max-w-lg mx-auto space-y-4  transition duration-300 hover:-translate-y-1">
        <Card icon={<Phone size={18} />} title="Contact Number" value={contactData?.phone || "Not Added"} />
        <Card icon={<Mail size={18} />} title="Email" value={contactData?.email || "Not Added"} link={`mailto:${contactData?.email}`} />
        <Card icon={<Linkedin size={18} />} title="LinkedIn" value={contactData?.linkedin} link={contactData?.linkedin} />
        <Card icon={<Github size={18} />} title="GitHub" value={contactData?.github} link={contactData?.github} />
        <Card icon={<MapPin size={18} />} title="Location" value={contactData?.location || "Not Added"} />
      </div>

      {/* FLOATING EDIT BUTTON */}
      {admin && (
        <button
          onClick={() => setShowContactModal(true)}
          className="fixed bottom-6 right-6 bg-cyan-500 hover:bg-cyan-400 text-black p-3 rounded-full shadow-md transition"
        >
          <Edit size={20} />
        </button>
      )}

      {/* MODAL */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-gray-900 border border-cyan-400/10 p-6 sm:p-8 rounded-2xl w-full max-w-md space-y-4 shadow-xl">
            <h3 className="text-xl font-semibold text-cyan-400">Update Contact Info</h3>

            <Input label="Phone" onChange={(e)=>setContactForm({...contactForm, phone:e.target.value})} />
            <Input label="Email" onChange={(e)=>setContactForm({...contactForm, email:e.target.value})} />
            <Input label="Location" onChange={(e)=>setContactForm({...contactForm, location:e.target.value})} />
            <Input label="LinkedIn URL" onChange={(e)=>setContactForm({...contactForm, linkedin:e.target.value})} />
            <Input label="GitHub URL" onChange={(e)=>setContactForm({...contactForm, github:e.target.value})} />

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  await axios.put(`${API}/api/profile/update-contact`, contactForm, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  alert("Contact Updated");
                  const res = await axios.get(`${API}/api/profile/get-contact`);
                  setContactData(res.data);
                  setShowContactModal(false);
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-black py-2 rounded-lg font-medium transition"
              >
                Save Changes
              </button>

              <button
                onClick={() => setShowContactModal(false)}
                className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* CARD COMPONENT — SMALLER */
function Card({ icon, title, value, link }) {
  return (
    <div className="bg-gray-900/70 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-800 hover:border-cyan-400/40 shadow-sm transition flex items-center gap-3">
      <div className="text-cyan-400">{icon}</div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="text-gray-400 text-xs hover:text-cyan-400 break-all">
            {value}
          </a>
        ) : (
          <p className="text-gray-400 text-xs">{value}</p>
        )}
      </div>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({ label, onChange }) {
  return (
    <input
      placeholder={label}
      onChange={onChange}
      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gray-700 focus:border-cyan-400 outline-none text-sm"
    />
  );
}
