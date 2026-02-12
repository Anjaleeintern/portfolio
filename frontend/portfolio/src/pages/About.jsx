

export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center px-4 sm:px-6 lg:px-12 py-16"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Image Side */}
        <div className="flex justify-center md:justify-end">
          <img
            src="/lapi.png"
            alt="about"
            className="
              w-56 sm:w-72 md:w-80 lg:w-[420px]
              rounded-2xl shadow-2xl border border-cyan-400/30
              hover:scale-105 transition duration-500
            "
          />
        </div>

        {/* Text Side */}
        <div className="space-y-6 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            About <span className="text-cyan-400">Me</span>
          </h2>

          <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
            I'm a Full Stack Developer passionate about building scalable web
            applications and AI-powered systems. I enjoy turning complex
            problems into simple, beautiful, and intuitive designs.
          </p>

          <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
            My focus is on performance, modern UI/UX, and backend logic that
            makes applications powerful and reliable.
          </p>

          {/* Skills Badges */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
            <div className="bg-cyan-500/10 border border-cyan-400 px-4 py-2 rounded-lg text-sm sm:text-base">
              🚀 Fast Learner
            </div>
            <div className="bg-cyan-500/10 border border-cyan-400 px-4 py-2 rounded-lg text-sm sm:text-base">
              🤖 AI Enthusiast
            </div>
            <div className="bg-cyan-500/10 border border-cyan-400 px-4 py-2 rounded-lg text-sm sm:text-base">
              💡 Problem Solver
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

