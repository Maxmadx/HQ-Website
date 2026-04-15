/**
 * BlogPost - Dynamic router for individual blog posts.
 *
 * Priority order:
 *  1. External URL redirect (press posts)
 *  2. Firestore dynamic post (block-based, editable in admin)
 *  3. Static JSX component fallback
 *
 * Firestore lookup uses the URL slug as the document ID — this is set up
 * by the seed script and the admin editor's setDoc(slug) pattern.
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import DynamicBlogPost from './DynamicBlogPost';
import posts from '../blog/posts.json';

// Lazy-load all static blog post components
const blogComponents = {
  PPLGuide:             lazy(() => import('./blog/PPLGuide')),
  MasteringTheHover:    lazy(() => import('./blog/MasteringTheHover')),
  WinterFlying:         lazy(() => import('./blog/WinterFlying')),
  MaintenanceCheck:     lazy(() => import('./blog/MaintenanceCheck')),
  LondonHeliLanes:      lazy(() => import('./blog/LondonHeliLanes')),
  Autorotations:        lazy(() => import('./blog/Autorotations')),
  NightRating:          lazy(() => import('./blog/NightRating')),
  OwnershipVsHire:      lazy(() => import('./blog/OwnershipVsHire')),
  PreFlightWalkaround:  lazy(() => import('./blog/PreFlightWalkaround')),
  MedicalCertificates:  lazy(() => import('./blog/MedicalCertificates')),
  WeatherDecisions:     lazy(() => import('./blog/WeatherDecisions')),
  TurbineFlight:        lazy(() => import('./blog/TurbineFlight')),
  RadioTelephony:       lazy(() => import('./blog/RadioTelephony')),
  FlightInstructor:     lazy(() => import('./blog/FlightInstructor')),
  ConfinedAreas:        lazy(() => import('./blog/ConfinedAreas')),
  RR300Engine:          lazy(() => import('./blog/RR300Engine')),
  WhyWeFly:             lazy(() => import('./blog/WhyWeFly')),
  LeasebackProgram:     lazy(() => import('./blog/LeasebackProgram')),
  HangarageGuide:       lazy(() => import('./blog/HangarageGuide')),
  R44BuyersGuide:       lazy(() => import('./blog/R44BuyersGuide')),
  R22FirstSolo:         lazy(() => import('./blog/R22FirstSolo')),
  FlyToLunch:           lazy(() => import('./blog/FlyToLunch')),
  SuperyachtOperations: lazy(() => import('./blog/SuperyachtOperations')),
  CrossChannel:         lazy(() => import('./blog/CrossChannel')),
  FuelManagement:       lazy(() => import('./blog/FuelManagement')),
  LTEAwareness:         lazy(() => import('./blog/LTEAwareness')),
  AnnualInspection:     lazy(() => import('./blog/AnnualInspection')),
};

// Map post slugs to static component names
const postIdToComponent = {
  'ppl-guide':            'PPLGuide',
  'mastering-the-hover':  'MasteringTheHover',
  'winter-flying':        'WinterFlying',
  'maintenance-check':    'MaintenanceCheck',
  'london-heli-lanes':    'LondonHeliLanes',
  'autorotations':        'Autorotations',
  'night-rating':         'NightRating',
  'ownership-vs-hire':    'OwnershipVsHire',
  'pre-flight-walkaround':'PreFlightWalkaround',
  'medical-certificates': 'MedicalCertificates',
  'weather-decisions':    'WeatherDecisions',
  'turbine-flight':       'TurbineFlight',
  'radio-telephony':      'RadioTelephony',
  'flight-instructor':    'FlightInstructor',
  'confined-areas':       'ConfinedAreas',
  'rr300-engine':         'RR300Engine',
  'why-we-fly':           'WhyWeFly',
  'leaseback-program':    'LeasebackProgram',
  'hangarage-guide':      'HangarageGuide',
  'r44-buyers-guide':     'R44BuyersGuide',
  'r22-first-solo':       'R22FirstSolo',
  'fly-to-lunch':         'FlyToLunch',
  'superyacht-operations':'SuperyachtOperations',
  'cross-channel':        'CrossChannel',
  'fuel-management':      'FuelManagement',
  'lte-awareness':        'LTEAwareness',
  'annual-inspection':    'AnnualInspection',
};

const Loader = () => (
  <div style={{
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '60vh', fontFamily: "'Space Grotesk', sans-serif", color: '#666',
  }}>
    Loading…
  </div>
);

function BlogPost() {
  const { postId } = useParams();

  // undefined = still loading; null = not found in Firestore
  const [dynamicPost, setDynamicPost] = useState(undefined);

  const staticMeta = posts.find((p) => p.id === postId);

  // Handle external URL redirects first
  useEffect(() => {
    if (staticMeta?.externalUrl) {
      window.location.href = staticMeta.externalUrl;
    }
  }, [staticMeta]);

  // Check Firestore by direct document ID (slug = doc ID for seeded/new posts)
  useEffect(() => {
    if (staticMeta?.externalUrl) return; // don't fetch for external posts

    getDoc(doc(db, 'blog_posts', postId))
      .then((snap) => {
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          // Only use dynamic renderer if the post has block content
          if (data.blocks && data.blocks.length > 0) {
            setDynamicPost(data);
            return;
          }
        }
        setDynamicPost(null);
      })
      .catch(() => {
        // Firestore unavailable or not configured — fall back to static
        setDynamicPost(null);
      });
  }, [postId, staticMeta]);

  // Redirect for external press posts
  if (staticMeta?.externalUrl) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', minHeight: '50vh',
        fontFamily: "'Space Grotesk', sans-serif", color: '#666', gap: '1rem',
      }}>
        Redirecting to external article…
        <a href={staticMeta.externalUrl} style={{ color: '#b5986c' }}>
          Click here if not redirected
        </a>
      </div>
    );
  }

  // Still loading Firestore check
  if (dynamicPost === undefined) return <Loader />;

  // Render dynamic Firestore post
  if (dynamicPost) return <DynamicBlogPost post={dynamicPost} />;

  // Fall back to static JSX component
  const componentName = postIdToComponent[postId];
  if (!componentName) return <Navigate to="/blog" replace />;

  const BlogComponent = blogComponents[componentName];
  return (
    <Suspense fallback={<Loader />}>
      <BlogComponent />
    </Suspense>
  );
}

export default BlogPost;
