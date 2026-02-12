import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import AdminLogin from "./Admin/AdminLogin";
import PublicLayout from "./Layout/PublicLayout";
import AdminLayout from "./Layout/AdminLayout";
// import AdminAddProject from "./Admin/AdminAddProject";
// import AdminAddProject from "./Admin/AdminAddProject";

function App() {
  return (
    <Router>
      <Routes>

        {/* 🌍 PUBLIC WEBSITE */}
        <Route path="/" element={<PublicLayout />} />
       

        {/* 🔐 ADMIN LOGIN PAGE */}
        <Route
          path="/admin-login"
          element={
            <AdminLayout>
              <AdminLogin />
            </AdminLayout>
          }
        />
        

      </Routes>
    </Router>
  );
}

export default App;

