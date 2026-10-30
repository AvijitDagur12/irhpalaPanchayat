import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Public Components
import Topbar from "./components/Topbar";
import HeaderNav from "./components/HeaderNav";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PopupModal from "./components/PopupModal";

// Citizen Flow Pages
import Auth from "./components/Auth";
import Dashboard from "./pages/Dashboard";
import ApplicationForm from "./pages/ApplicationForm";
import ManageProfile from "./pages/ManageProfile";
import CertificateApplication from "./components/CertificateApplication";
import CertificateLogin from "./components/CertificateLogin";

// Administrative Portals
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminApplications from "./admin/AdminApplications";
import Support from "./admin/Support";
import AdminCertificatePanel from "./components/AdminCertificatePanel";
import AdminList from "./admin/AdminList";
import AdminEdit from "./admin/AdminEdit";
import PSC from "./components/PSC";
import UnderDev from "./components/UnderDev";

// Department-Specific Logins
import MemberLogin from "./admin/MemberLogin";
import SecretaryLogin from "./admin/SecretaryLogin";
import SupportLogin from "./admin/SupportLogin";

// Control Officer Pages
import ControlLogin from "./admin/ControlLogin";
import ControlDashboard from "./admin/ControlDashboard";
import ControlEdit from "./admin/ControlEdit";

// Common Public Layout with Official Topbar, Nav, and Footer
const PublicLayout = ({ children }) => (
  <>
    <Topbar />
    <HeaderNav />
    <div style={{ minHeight: "calc(100vh - 350px)" }}>{children}</div>
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Home Portal */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Hero />
                <About />
                <Services />
                <Contact />
                <PopupModal />
              </PublicLayout>
            }
          />

          {/* Citizen Authentication */}
          <Route path="/auth" element={<Auth />} />

          {/* Citizen Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apply-certificate"
            element={
              <ProtectedRoute>
                <ApplicationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-profile"
            element={
              <ProtectedRoute>
                <ManageProfile />
              </ProtectedRoute>
            }
          />

          {/* Public Certificate Services */}
          <Route
            path="/certificate-application"
            element={
              <PublicLayout>
                <CertificateApplication />
              </PublicLayout>
            }
          />
          <Route
            path="/download-certificate"
            element={
              <PublicLayout>
                <CertificateLogin />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />

          {/* Administrative Portals */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<Navigate to="/admin" replace />} />

          {/* Department-Specific Login Pages */}
          <Route path="/admin/member-login" element={<MemberLogin />} />
          <Route path="/admin/secretary-login" element={<SecretaryLogin />} />
          <Route path="/admin/support-login" element={<SupportLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute allowedRoles={["bdo", "admin"]}>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/adminapplications"
            element={
              <AdminRoute allowedRoles={["secretary", "bdo", "admin"]}>
                <AdminApplications />
              </AdminRoute>
            }
          />
          <Route
            path="/psc/applications"
            element={
              <AdminRoute allowedRoles={["secretary", "bdo", "admin"]}>
                <AdminApplications />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/Support"
            element={
              <AdminRoute allowedRoles={["bdo", "admin", "support"]}>
                <Support />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/certificates"
            element={
              <AdminRoute allowedRoles={["member", "elected_member", "admin"]}>
                <AdminCertificatePanel />
              </AdminRoute>
            }
          />

          {/* ----- CONTROL OFFICER ROUTES ----- */}
          <Route path="/control-officer" element={<ControlLogin />} />
          <Route path="/control-officer/dashboard" element={<ControlDashboard />} />
          <Route path="/control-officer/edit/:id" element={<ControlEdit />} />

          {/* Admin Account Management — Control Officer only */}
          <Route
            path="/admin/manage-admins"
            element={
              <AdminRoute allowedRoles={["control_officer"]}>
                <AdminList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/manage-admins/:id"
            element={
              <AdminRoute allowedRoles={["control_officer"]}>
                <AdminEdit />
              </AdminRoute>
            }
          />

          {/* Secretariat & Advisory Pages */}
          <Route path="/psc" element={<PSC />} />
          <Route
            path="/under-dev"
            element={
              <PublicLayout>
                <UnderDev />
              </PublicLayout>
            }
          />

          {/* Aliases */}
          <Route path="/track-application" element={<Navigate to="/download-certificate" replace />} />
          <Route path="/submit-issue" element={<Navigate to="/contact" replace />} />
          <Route path="/help" element={<Navigate to="/contact" replace />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                  <h1 style={{ fontSize: "3rem", color: "#0f3b6c" }}>404</h1>
                  <h2>পৃষ্ঠাটি খুঁজে পাওয়া যায়নি (Page Not Found)</h2>
                  <p style={{ color: "#64748b", margin: "12px 0 24px" }}>
                    The page you are looking for does not exist or has been relocated within the portal.
                  </p>
                  <a href="/" className="gov-btn gov-btn-primary">
                    ← Return to Panchayat Home
                  </a>
                </div>
              </PublicLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;