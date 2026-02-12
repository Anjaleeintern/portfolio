// EDUCATION SECTION COMPONENT

import EducationInfo from "../components/Education";
import Certifications from "../components/Certifications";

export default function EducationSection() {
  return (
    <section
      id="education"
      className=" bg-gradient-to-br  from-black via-gray-900 to-black text-white py-16 sm:py-20 px-4 sm:px-8 lg:px-16"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-14 tracking-wide">
        Education & <span className="text-cyan-400">Achievements</span>
      </h2>

      <div className="space-y-12 max-w-6xl mx-auto">
        <EducationInfo />
        <Certifications />
      </div>
    </section>
  );
}
