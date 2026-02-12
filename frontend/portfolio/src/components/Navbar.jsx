

// frontend/portfolio/src/components/Navbar.jsx
import { Link } from "react-scroll";
import { isAdminLoggedIn } from "../utils/isAdmin";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const admin = isAdminLoggedIn();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const navItems = [
    "home",
    "about",
    "skills",
    "projects",
    "experience",
    "education",
    "contact",
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-sky-900 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 text-white">

        {/* LOGO */}
        <h1 className="text-lg font-bold tracking-wide">ANJALEE</h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-8 font-medium text-sm tracking-wide">
          {navItems.map((item) => (
            <Link
              key={item}
              to={item}
              smooth={true}
              duration={500}
              offset={-70}
              className="cursor-pointer relative group transition duration-300 hover:text-cyan-400"
            >
              {item.toUpperCase()}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* ADMIN LOGOUT */}
          {admin && (
            <button
              onClick={handleLogout}
              className="bg-red-500/90 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-red-500/30 transition duration-300"
            >
              Logout
            </button>
          )}

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden cursor-pointer">
            {open ? (
              <X size={28} onClick={() => setOpen(false)} />
            ) : (
              <Menu size={28} onClick={() => setOpen(true)} />
            )}
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div
        className={`md:hidden bg-sky-950/95 backdrop-blur-lg overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 py-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center gap-6 text-white font-medium">
          {navItems.map((item) => (
            <Link
              key={item}
              to={item}
              smooth={true}
              duration={500}
              offset={-70}
              onClick={() => setOpen(false)}
              className="cursor-pointer hover:text-cyan-400 transition"
            >
              {item.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
