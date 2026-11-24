// Footer.jsx
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-5 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">About This Project</h2>
          <p className="text-gray-400">
            This portfolio website was created by <span className="text-white font-semibold">Anjalee Bisen</span>. 
            It showcases my projects, skills, and experiences. 
            Built using <span className="text-white font-semibold">React.js, Tailwind CSS, Node.js, and MongoDB</span>.
            Completed in <span className="text-white font-semibold">February 2026</span>.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Contact Me</h2>
          <ul className="space-y-2">
            <li>Email: <a href="mailto:anjalee@example.com" className="text-blue-400 hover:underline">anjalee@example.com</a></li>
            <li>Phone: <a href="tel:+911234567890" className="text-blue-400 hover:underline">+91 12345 67890</a></li>
            <li>LinkedIn: <a href="https://www.linkedin.com/in/anjalee-bisen" target="_blank" className="text-blue-400 hover:underline">linkedin.com/in/anjalee-bisen</a></li>
            <li>GitHub: <a href="https://github.com/anjalee-bisen" target="_blank" className="text-blue-400 hover:underline">github.com/anjalee-bisen</a></li>
          </ul>
        </div>

        {/* Additional Info / Credits */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Credits</h2>
          <p className="text-gray-400">
            UI designed with <span className="text-white font-semibold">Tailwind CSS</span>. 
            Functionality powered by <span className="text-white font-semibold">React.js & Node.js</span>.
            Hosted on <span className="text-white font-semibold">Vercel</span> with backend API on <span className="text-white font-semibold">Express.js</span>.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        &copy; {currentYear} Anjalee Bisen. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
