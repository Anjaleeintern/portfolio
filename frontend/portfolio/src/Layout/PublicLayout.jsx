import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import About from "../pages/About"; 
import Contact from "../pages/Contact";
// import EducationCertifications from "../components/Education";
import Experience from "../pages/Experience";
import Projects from "../pages/Projects";
import Skills from "../pages/Skill";        
import EducationSection from "../pages/EducationSection";
// import AdminAddProject from "../Admin/AdminAddProject";
// import AdminControls from "../Admin/AdminControls";




export default function PublicLayout() {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <Home />
      <About/>
        <Skills/>
        <Projects/>
        {/* <AdminAddProject/>
        <AdminControls/> */}
       
        <Experience/>
        <EducationSection/>
        <Contact/>
    </div>
  );
}