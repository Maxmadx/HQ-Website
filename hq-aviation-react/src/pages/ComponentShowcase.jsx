import React from 'react';
import '../assets/css/approved-components.css';

// Import all approved components
import {
  TestimonialSlider,
  AsSeenIn,
  StatsCounter,
  PartnerLogos,
  SocialProofWall,
  WhyChooseUs,
  FounderStory,
  BeforeAfterStory,
  TeamPreview,
  ProcessSteps,
  LifestyleImagery,
  TopGearMoment,
  ScrollingStrips,
  FleetShowcaseCarousel,
  ModelSpotlight,
  InteractiveFleetExplorer,
  R88Announcement,
  CTASplit,
  LimitedSlotsCounter,
  PriceLockBanner,
  FAQAccordion,
  LocationHighlight,
  RecentNews,
  UpcomingEvents,
  HelicopterVsFixedWing,
  GroundSchoolPreview,
  TypeRatingCards,
  PilotHourBreakdown,
  CostTransparency,
  FerryFlightServices,
  AircraftLeasebackRevenue,
  SelfFlyHireRates,
  HangarageFeatures,
  AircraftManagement,
  RegulatoryCompliance,
  WorldRecordTimeline,
  PolarAchievement,
  MountainFlyingHazards,
  OwnershipBenefits,
  WhyFlyHelicopterMini,
  WhyFlyHelicopterCard,
  WhyFlyHelicopterCompact,
  MegaFooter,
  // Adventure & Expedition Components
  TopographicBackground,
  PolaroidPhotoTrail,
  CompassNavigation,
  TripRegistrationCard,
  AviationDividers,
  PassportStamps,
  CountdownBlocks,
  FloatingStars,
  ParallaxCloudLayers,
  CompassRoseFooter,
  CoordinateGridOverlay,
  TypewriterEffect,
  StaggeredReveal,
} from '../components';

const SectionTitle = ({ children }) => (
  <h2 style={{
    fontSize: '1.5rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '2rem',
    background: '#1a1a1a',
    color: '#fff',
    marginTop: '4rem'
  }}>
    {children}
  </h2>
);

const ComponentShowcase = () => {
  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <header style={{
        background: '#1a1a1a',
        color: '#fff',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>HQ Aviation</h1>
        <p style={{ opacity: 0.7 }}>Approved Components Showcase</p>
        <p style={{ fontSize: '0.85rem', marginTop: '1rem', opacity: 0.5 }}>
          Each component includes feedback notes from approved-components.json
        </p>
      </header>

      {/* Trust & Credibility */}
      <SectionTitle>Trust & Credibility</SectionTitle>
      <TestimonialSlider />
      <AsSeenIn />
      <StatsCounter />
      <PartnerLogos />
      <SocialProofWall />

      {/* Content Sections */}
      <SectionTitle>Content Sections</SectionTitle>
      <LifestyleImagery />
      <WhyChooseUs />
      <FounderStory />
      <BeforeAfterStory />
      <TeamPreview />
      <ProcessSteps />
      <TopGearMoment />
      <ScrollingStrips sticky={false} />

      {/* Fleet & Aircraft */}
      <SectionTitle>Fleet & Aircraft</SectionTitle>
      <ModelSpotlight />
      <FleetShowcaseCarousel />
      <InteractiveFleetExplorer />
      <R88Announcement />

      {/* Conversion */}
      <SectionTitle>Conversion Components</SectionTitle>
      <LimitedSlotsCounter />
      <PriceLockBanner />
      <CTASplit />

      {/* Training */}
      <SectionTitle>Training</SectionTitle>
      <GroundSchoolPreview />
      <PilotHourBreakdown />
      <CostTransparency />
      <TypeRatingCards />

      {/* Services */}
      <SectionTitle>Services</SectionTitle>
      <HangarageFeatures />
      <AircraftManagement />
      <FerryFlightServices />
      <SelfFlyHireRates />
      <AircraftLeasebackRevenue />
      <RegulatoryCompliance />

      {/* Expeditions */}
      <SectionTitle>Expeditions & Achievements</SectionTitle>
      <WorldRecordTimeline />
      <PolarAchievement />
      <MountainFlyingHazards />

      {/* Lifestyle */}
      <SectionTitle>Lifestyle</SectionTitle>
      <OwnershipBenefits />
      <WhyFlyHelicopterMini />
      <WhyFlyHelicopterCard />
      <WhyFlyHelicopterCompact />

      {/* Information */}
      <SectionTitle>Information</SectionTitle>
      <RecentNews />
      <UpcomingEvents />
      <LocationHighlight />
      <FAQAccordion />
      <HelicopterVsFixedWing />

      {/* Adventure & Expedition Components */}
      <SectionTitle>Adventure Components</SectionTitle>
      <TopographicBackground />
      <CompassNavigation />
      <PolaroidPhotoTrail />
      <TripRegistrationCard />
      <PassportStamps />
      <CountdownBlocks />
      <AviationDividers />

      {/* Backgrounds & Decorative */}
      <SectionTitle>Backgrounds & Decorative</SectionTitle>
      <FloatingStars />
      <ParallaxCloudLayers />
      <CoordinateGridOverlay />

      {/* Animations */}
      <SectionTitle>Animations</SectionTitle>
      <TypewriterEffect />
      <StaggeredReveal />

      {/* Footer */}
      <SectionTitle>Footer</SectionTitle>
      <MegaFooter />
      <CompassRoseFooter />
    </div>
  );
};

export default ComponentShowcase;
