import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Navbar } from "./sections/Navbar/Navbar";
import { Footer } from "./sections/Footer/Footer";
import { HomePage } from "./pages/HomePage";
import { BlogPage } from "./pages/BlogPage";
import { TeamPage } from "./pages/TeamPage";
import { SponsorsPage } from "./pages/SponsorsPage";
import { ContactPage } from "./pages/ContactPage";
import { SchedulePage } from "./pages/SchedulePage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./sections/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/sponsors" element={<SponsorsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}