import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Import styles
import './assets/css/main.css';
import './assets/css/components.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Test Pages - Outside layout for full-screen testing */}
        <Route path="/hero-test" element={<HeroTest />} />
        <Route path="/final-draft" element={<FinalDraft />} />
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
        <Route path="/final-why-fly-a-helicopter" element={<FinalWhyFlyAHelicopter />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* About Us Routes */}
          <Route path="about-us" element={<AboutUs />} />
          <Route path="about-us/captain-q" element={<CaptainQ />} />
          <Route path="about-us/team" element={<Team />} />

          {/* Aircraft Sales */}
          <Route path="aircraft-sales" element={<AircraftSales />} />

          {/* Training Routes */}
          <Route path="training" element={<Training />} />
          <Route path="training/ppl" element={<PPL />} />
          <Route path="training/faq" element={<TrainingFAQ />} />

          {/* Expeditions */}
          <Route path="expeditions" element={<Expeditions />} />

          {/* Services Routes */}
          <Route path="services" element={<Services />} />
          <Route path="services/maintenance" element={<Maintenance />} />

          {/* Contact */}
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
