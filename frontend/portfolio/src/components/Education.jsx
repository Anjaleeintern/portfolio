// EDUCATION COMPONENT
export default function EducationInfo() {
  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-cyan-400/10 shadow-md hover:shadow-cyan-400/10 rounded-2xl p-5 sm:p-6 md:p-8 max-w-5xl mx-auto transition duration-300 hover:-translate-y-1">
      
      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-cyan-400 leading-snug">
        Bachelor’s of Technology – Computer Science & Engineering
      </h3>

      <p className="text-gray-300 text-sm sm:text-base mt-3">
        NRI Institute of Information Science & Technology, Bhopal, Madhya Pradesh, India
      </p>

      <div className="flex flex-col sm:flex-row sm:justify-between mt-5 text-gray-400 text-sm sm:text-base font-medium gap-1 sm:gap-0">
        <span>2021 – 2025</span>
        <span className="text-cyan-400">CGPA: 8.5</span>
      </div>

    </div>
  );
}
