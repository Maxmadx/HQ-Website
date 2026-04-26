import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import CaptainQ from './pages/CaptainQ';
import Team from './pages/Team';
import AircraftSales from './pages/AircraftSales';
import Training from './pages/Training';
import TrainingFAQ from './pages/TrainingFAQ';
import PPL from './pages/PPL';
import Expeditions from './pages/Expeditions';
import Services from './pages/Services';
import Maintenance from './pages/Maintenance';
import Contact from './pages/Contact';
import HeroTest from './pages/HeroTest';
import FinalDraft from './pages/FinalDraft';
import ScrollPathTest from './pages/ScrollPathTest';
import CarouselPicker from './pages/CarouselPicker';
import CarouselPickerV2 from './pages/CarouselPickerV2';
import ArrowPicker from './pages/ArrowPicker';
import ComponentShowcase from './pages/ComponentShowcase';
import HeroPathPicker from './pages/HeroPathPicker';
import ParallaxPicker from './pages/ParallaxPicker';
import OwnershipPicker from './pages/OwnershipPicker';
import PPLPicker from './pages/PPLPicker';
import FinalPPL from './pages/FinalPPL';
import FinalWhyFlyAHelicopter from './pages/FinalWhyFlyAHelicopter';
import FinalExpeditions from './pages/FinalExpeditions';
import JourneyLinesPicker from './pages/JourneyLinesPicker';
import TypeRating from './pages/TypeRating';
import Sales from './pages/Sales';
import SelfFlyHire from './pages/SelfFlyHire';
import FinalMaintenance from './pages/FinalMaintenance';
import Sitemap from './pages/Sitemap';
import JourneyPicker from './pages/JourneyPicker';
import VideoSliderPicker from './pages/VideoSliderPicker';
import TestimonialsPicker from './pages/TestimonialsPicker';
import Testimonials from './pages/Testimonials';
import Fleet from './pages/Fleet';
import UsedSales from './pages/UsedSales';
import UsedSales2 from './pages/UsedSales2';
import UsedSalesVariations from './pages/UsedSalesVariations';
import UsedAircraftDetail from './pages/UsedAircraftDetail';
import AircraftR66 from './pages/AircraftR66';
import AircraftR44 from './pages/AircraftR44';
import AircraftR22 from './pages/AircraftR22';
import AircraftH500 from './pages/AircraftH500';
import AircraftR88 from './pages/AircraftR88';
import HelicopterTourOfLondon from './pages/HelicopterTourOfLondon';
import HQAccount from './pages/HQAccount';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import DiscoveryFlight from './pages/DiscoveryFlight';
import Experimentation from './pages/Experimentation';
import Experimentation2 from './pages/Experimentation2';
import EndOfMarchVersion from './pages/EndOfMarchVersion';
import SFHTests from './pages/sfhtests/SFHTests';
import AuthorisedServiceCenterCard from './pages/AuthorisedServiceCenterCard';
import SlidingGalleryVariations from './pages/SlidingGalleryVariations';
import WallOfCoolVariations from './pages/WallOfCoolVariations';
import WallOfCoolTitleVariations from './pages/WallOfCoolTitleVariations';
import WallOfCoolCenterCardVariations from './pages/WallOfCoolCenterCardVariations';
import WallOfCoolCenterCardVariations2 from './pages/WallOfCoolCenterCardVariations2';
import WallOfCoolCenterCardVariations3 from './pages/WallOfCoolCenterCardVariations3';
import WallOfCoolCenterCardVariations4 from './pages/WallOfCoolCenterCardVariations4';
import WallOfCoolCompassCard from './pages/WallOfCoolCompassCard';
import WallOfCoolFinalCard from './pages/WallOfCoolFinalCard';
import WallOfCoolFinalCardR66 from './pages/WallOfCoolFinalCardR66';
import WallOfCoolFinalCardSky from './pages/WallOfCoolFinalCardSky';
import WallOfCoolGradientVariations from './pages/WallOfCoolGradientVariations';
import WallOfCoolGalleryGradientVariations from './pages/WallOfCoolGalleryGradientVariations';
import Rebuilds from './pages/Rebuilds';
import HeroSectionTest from './pages/HeroSectionTest';
import FlyingVariations from './pages/FlyingVariations';
import NightRating from './pages/NightRating';
import CPL from './pages/CPL';
import AdvancedTraining from './pages/AdvancedTraining';
import SuperYachtOps from './pages/SuperYachtOps';
import PilotProvisioning from './pages/PilotProvisioning';
import AircraftConsulting from './pages/AircraftConsulting';
import Leaseback from './pages/Leaseback';
import HeroSectionFinal from './pages/HeroSectionFinal';
import HeroSectionFinalTesting from './pages/HeroSectionFinalTesting';
import TestingHeroSection from './pages/TestingHeroSection';
import AboutUsVariations from './pages/AboutUsVariations';
import Misc from './pages/Misc';
import MiscItemDetail from './pages/MiscItemDetail';
import PartSales from './pages/PartSales';
import AwardVariations from './pages/AwardVariations';
import MobileSecondSection from './pages/MobileSecondSection';
import SFHVariations from './pages/SFHVariations';
import Wireframes from './pages/Wireframes';
import AccordionVariations from './pages/AccordionVariations';
import R66BenefitsVariations from './pages/R66BenefitsVariations';
import Checkout from './pages/Checkout';
import BookingConfirmed from './pages/BookingConfirmed';
import LondonTourCheckout from './pages/LondonTourCheckout';
import LondonTourConfirmed from './pages/LondonTourConfirmed';
import AircraftComparison from './pages/AircraftComparison';
import AdminRoute from './components/admin/AdminRoute';
import AdminLogin from './pages/admin/AdminLogin';
import { EditModeProvider } from './context/EditModeContext';
import AdminBar from './components/admin/AdminBar';
import ImageEditDrawer from './components/admin/ImageEditDrawer';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminListings from './pages/admin/AdminListings';
import AdminListingEdit from './pages/admin/AdminListingEdit';
import AdminMiscItems from './pages/admin/AdminMiscItems';
import AdminMiscItemEdit from './pages/admin/AdminMiscItemEdit';
import AdminMiscMarketplace from './pages/admin/AdminMiscMarketplace';
import AdminBlog from './pages/admin/AdminBlog';
import AdminBlogEdit from './pages/admin/AdminBlogEdit';
import AdminPricing from './pages/admin/AdminPricing';
import AdminBookings from './pages/admin/AdminBookings';
import AdminLeads from './pages/admin/AdminLeads';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminWallOfCool from './pages/admin/AdminWallOfCool';
import AdminReviews from './pages/admin/AdminReviews';
import AdminFaqs from './pages/admin/AdminFaqs';
import AdminEditImagesMode from './pages/admin/AdminEditImagesMode';
import AdminEditTextMode from './pages/admin/AdminEditTextMode';
import PageTracker from './components/PageTracker';

// Import styles
import './assets/css/main.css';
import './assets/css/components.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
}

function App() {
  return (
    <Router>
      <EditModeProvider>
      <ScrollToTop />
      <PageTracker />
      <Routes>
        {/* Test Pages - Outside layout for full-screen testing */}
        <Route path="/hero-test" element={<HeroTest />} />
        <Route path="/hero-section-test" element={<HeroSectionTest />} />
        <Route path="/hero-section-final" element={<HeroSectionFinal />} />
        <Route path="/hero-section-final-testing" element={<HeroSectionFinalTesting />} />
        <Route path="/testing-hero-section" element={<TestingHeroSection />} />
        <Route path="/award-variations" element={<AwardVariations />} />
        <Route path="/mobile-second-section" element={<MobileSecondSection />} />
        <Route path="/sfh-variations" element={<SFHVariations />} />
        <Route path="/wireframes" element={<Wireframes />} />
        <Route path="/accordion-variations" element={<AccordionVariations />} />
        <Route path="/r66-benefits-variations" element={<R66BenefitsVariations />} />
        <Route path="/about-us-variations" element={<AboutUsVariations />} />
        <Route path="/flying-variations" element={<FlyingVariations />} />
        <Route path="/final-draft" element={<FinalDraft />} />
        <Route path="/experimentation" element={<Experimentation />} />
        <Route path="/wall-of-cool-variations" element={<WallOfCoolVariations />} />
        <Route path="/wall-of-cool-title-variations" element={<WallOfCoolTitleVariations />} />
        <Route path="/wall-of-cool-center-card-variations" element={<WallOfCoolCenterCardVariations />} />
        <Route path="/wall-of-cool-center-card-variations-2" element={<WallOfCoolCenterCardVariations2 />} />
        <Route path="/wall-of-cool-center-card-variations-3" element={<WallOfCoolCenterCardVariations3 />} />
        <Route path="/wall-of-cool-center-card-variations-4" element={<WallOfCoolCenterCardVariations4 />} />
        <Route path="/wall-of-cool-compass-card" element={<WallOfCoolCompassCard />} />
        <Route path="/wall-of-cool-final-card" element={<WallOfCoolFinalCard />} />
        <Route path="/wall-of-cool-final-card-r66" element={<WallOfCoolFinalCardR66 />} />
        <Route path="/wall-of-cool-final-card-sky" element={<WallOfCoolFinalCardSky />} />
        <Route path="/wall-of-cool-gradient-variations" element={<WallOfCoolGradientVariations />} />
        <Route path="/wall-of-cool-gallery-gradient-variations" element={<WallOfCoolGalleryGradientVariations />} />
        <Route path="/experimentation-2" element={<Experimentation2 />} />
        <Route path="/endofmarchversion" element={<EndOfMarchVersion />} />
        <Route path="/sfhtests" element={<SFHTests />} />
        <Route path="/authorisedservicecentercard" element={<AuthorisedServiceCenterCard />} />
        <Route path="/scroll-path-test" element={<ScrollPathTest />} />
        <Route path="/carousel-picker" element={<CarouselPicker />} />
        <Route path="/carousel-picker-v2" element={<CarouselPickerV2 />} />
        <Route path="/arrow-picker" element={<ArrowPicker />} />
        <Route path="/components" element={<ComponentShowcase />} />
        <Route path="/hero-path-picker" element={<HeroPathPicker />} />
        <Route path="/parallax-picker" element={<ParallaxPicker />} />
        <Route path="/ownership-picker" element={<OwnershipPicker />} />
        <Route path="/ppl-picker" element={<PPLPicker />} />
        <Route path="/final-ppl" element={<FinalPPL />} />
        <Route path="/training/ppl" element={<FinalPPL />} />
        <Route path="/final-why-fly-a-helicopter" element={<FinalWhyFlyAHelicopter />} />
        <Route path="/type-rating" element={<TypeRating />} />
        <Route path="/training/type-rating" element={<TypeRating />} />
        <Route path="/training/night-rating" element={<NightRating />} />
        <Route path="/training/trial-lessons" element={<DiscoveryFlight />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        <Route path="/london-tour-checkout" element={<LondonTourCheckout />} />
        <Route path="/london-tour-confirmed" element={<LondonTourConfirmed />} />
        <Route path="/sales/new" element={<Sales />} />
        <Route path="/aircraft-comparison" element={<AircraftComparison />} />
        <Route path="/sales/sliding-gallery-variations" element={<SlidingGalleryVariations />} />
        <Route path="/sales/pre-owned" element={<UsedSales />} />
        <Route path="/sales/rebuilds" element={<Rebuilds />} />
        <Route path="/sales/pre-owned-2" element={<UsedSales2 />} />
        <Route path="/sales/pre-owned-variations" element={<UsedSalesVariations />} />
        <Route path="/sales/pre-owned/:id" element={<UsedAircraftDetail />} />
        <Route path="/self-fly-hire" element={<SelfFlyHire />} />
        <Route path="/misc" element={<Misc />} />
        <Route path="/misc/:id" element={<MiscItemDetail />} />
        <Route path="/parts" element={<PartSales />} />
        <Route path="/maintenance" element={<FinalMaintenance />} />
        <Route path="/expeditions" element={<FinalExpeditions />} />
        <Route path="/journey-lines-picker" element={<JourneyLinesPicker />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/journey-picker" element={<JourneyPicker />} />
        <Route path="/video-slider-picker" element={<VideoSliderPicker />} />
        <Route path="/testimonials-picker" element={<TestimonialsPicker />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/aircraft/r66" element={<AircraftR66 />} />
        <Route path="/aircraft-sales/new/r66" element={<AircraftR66 />} />
        <Route path="/aircraft/r44" element={<AircraftR44 />} />
        <Route path="/aircraft-sales/new/r44" element={<AircraftR44 />} />
        <Route path="/aircraft/r22" element={<AircraftR22 />} />
        <Route path="/aircraft-sales/new/r22" element={<AircraftR22 />} />
        <Route path="/aircraft/h500" element={<AircraftH500 />} />
        <Route path="/aircraft/r88" element={<AircraftR88 />} />
        <Route path="/aircraft-sales/new/r88" element={<AircraftR88 />} />
        <Route path="/helicopter-tour-of-london" element={<HelicopterTourOfLondon />} />
        <Route path="/hq-account" element={<HQAccount />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<BlogPost />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/images" element={<AdminRoute><AdminEditImagesMode /></AdminRoute>} />
        <Route path="/admin/text" element={<AdminRoute><AdminEditTextMode /></AdminRoute>} />
        <Route path="/admin/listings" element={<AdminRoute><AdminListings /></AdminRoute>} />
        <Route path="/admin/listings/:id" element={<AdminRoute><AdminListingEdit /></AdminRoute>} />
        <Route path="/admin/misc" element={<AdminRoute><AdminMiscItems /></AdminRoute>} />
        <Route path="/admin/misc/:id" element={<AdminRoute><AdminMiscItemEdit /></AdminRoute>} />
        <Route path="/admin/misc-marketplace" element={<AdminRoute><AdminMiscMarketplace /></AdminRoute>} />
        <Route path="/admin/blog" element={<AdminRoute><AdminBlog /></AdminRoute>} />
        <Route path="/admin/blog/:id" element={<AdminRoute><AdminBlogEdit /></AdminRoute>} />
        <Route path="/admin/pricing" element={<AdminRoute><AdminPricing /></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
        <Route path="/admin/leads" element={<AdminRoute><AdminLeads /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
        <Route path="/admin/wall-of-cool" element={<AdminRoute><AdminWallOfCool /></AdminRoute>} />
        <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
        <Route path="/admin/faqs" element={<AdminRoute><AdminFaqs /></AdminRoute>} />

        <Route path="/training/commercial" element={<CPL />} />
        <Route path="/training/advanced" element={<AdvancedTraining />} />
        <Route path="/superyacht-ops" element={<SuperYachtOps />} />
        <Route path="/pilot-provisioning" element={<PilotProvisioning />} />
        <Route path="/aircraft-consulting" element={<AircraftConsulting />} />
        <Route path="/leaseback" element={<Leaseback />} />

        <Route path="/" element={<Experimentation />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />

          {/* About Us Routes */}
          <Route path="about-us" element={<AboutUs />} />
          <Route path="about-us/captain-q" element={<CaptainQ />} />
          <Route path="about-us/team" element={<Team />} />

          {/* Aircraft Sales */}
          <Route path="aircraft-sales" element={<AircraftSales />} />

          {/* Training Routes */}
          <Route path="training" element={<Training />} />
          <Route path="training/faq" element={<TrainingFAQ />} />

          {/* Expeditions - now using standalone FinalExpeditions */}

          {/* Services Routes */}
          <Route path="services" element={<Services />} />
          <Route path="services/maintenance" element={<Maintenance />} />

          {/* Contact */}
          <Route path="contact" element={<Contact />} />

        </Route>
      </Routes>
      </EditModeProvider>
    </Router>
  );
}

export default App;
