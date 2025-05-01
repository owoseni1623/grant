import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Context Providers
import GrantsProvider from './Context/GrantsContext';
import { UsGrantProvider } from './Context/UsGrantContext';
import { RegisterGrantProvider } from './Context/RegisterGrantContext';
import NotificationProvider from './Context/NotificationContext';
import { ApplicationFormProvider } from './Context/ApplicationFormContext';

// ScrollToTop Component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Import all components
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import HomePage from './Components/Home/HomePage';
import Register from './Components/Register/Register';
import Apply from './Components/Apply/Apply';
import FindGrants from './Components/FindGrants/FindGrants';
import PersonalGrantPage from './Components/PersonalGrant/PersonalGrantPage';
import BusinessGrantPage from './Components/BusinessGrant/BusinessGrantPage';
import CommunityGrantPage from './Components/CommunityGrant/CommunityGrantPage';
import EducationGrantApp from './Components/EducationGrant/EducationGrantApp';
import RealEstateGrantPage from './Components/RealEstatePage/RealEstateGrantPage';
import HomeImprovementGrantPage from './Components/HomeImprovement/HomeImprovementGrantPage';
import InnovationGrantsPage from './Components/InnovationGrants/InnovationGrantsPage';
import MiscellaneousGrantPage from './Components/MiscellaneousGrant/MiscellaneousGrantPage';
import PrivacyPage from './Components/PrivacyPage/PrivacyPage';
import TermsPage from './Components/TermsPage/TermsPage';
import SitemapPage from './Components/SitemapPage/SitemapPage';
import HelpCenter from './Components/HelpCenter/HelpCenter';
import ContactUs from './Components/ContactUs/ContactUs';
import FAQPage from './Components/FAQPage/FAQPage';
import GrantAboutUs from './Components/AboutUs/GrantAboutUs';
import GrantResources from './Components/Resources/GrantResources';
import LatestNewsPage from './Components/LatestNews/LatestNewsPage';
import LoginPage from './Components/LoginPage/LoginPage';
import ForgotPasswordPage from './Components/ForgotPasswordPage/ForgotPasswordPage';
import AdminDashboard from './Components/admin/AdminDashboard';
import GrantSuccessPage from './Components/SuccessPage/GrantSuccessPage';
import GrantInfoCenter from './Components/InfoPage/InfoPage';
import InfoSectionPage from './Components/InfoPage/InfoPage';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <GrantsProvider>
      <NotificationProvider>
        <UsGrantProvider>
          <RegisterGrantProvider>
            <ApplicationFormProvider>
              <BrowserRouter>
                <ScrollToTop />
                <div className="app-container">
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/apply" element={<Apply />} />
                      <Route path="/find-grants" element={<FindGrants />} />
                      <Route path="/personal-grant" element={<PersonalGrantPage />} />
                      <Route path="/business-grant" element={<BusinessGrantPage />} />
                      <Route path="/community-grant" element={<CommunityGrantPage />} />
                      <Route path="/education-grant" element={<EducationGrantApp />} />
                      <Route path="/real-estate-grant" element={<RealEstateGrantPage />} />
                      <Route path="/home-improvement" element={<HomeImprovementGrantPage />} />
                      <Route path="/grants-innovation" element={<InnovationGrantsPage />} />
                      <Route path="/grants-misc" element={<MiscellaneousGrantPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/sitemap" element={<SitemapPage />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/contact" element={<ContactUs />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/about" element={<GrantAboutUs />} />
                      <Route path="/resources" element={<GrantResources />} />
                      <Route path="/news" element={<LatestNewsPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/info-session" element={<GrantInfoCenter />} />
                      <Route path="/info-section" element={<InfoSectionPage />} />
                      <Route path="/grant-success" element={<GrantSuccessPage />} />
                    </Routes>
                  </main>
                  <Footer />
                  <ToastContainer />
                </div>
              </BrowserRouter>
            </ApplicationFormProvider>
          </RegisterGrantProvider>
        </UsGrantProvider>
      </NotificationProvider>
    </GrantsProvider>
  );
}

export default App;