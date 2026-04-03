/**
 * PPL PAGE PICKER
 *
 * Browse 10 different PPL page variations with the ability to:
 * - View full page compositions
 * - Favorite individual components within each page
 * - Add comments to components
 * - Export favorites with comments
 *
 * Component types per page:
 * - Hero
 * - Introduction
 * - Requirements
 * - Journey/Timeline
 * - Costs/Pricing
 * - FAQ
 * - CTA
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ============================================
// COMPONENT DEFINITIONS - 10 VARIATIONS
// ============================================

const componentVariations = {
  // HERO VARIATIONS (1-20)
  heroes: [
    { id: 'hero-1', name: 'Dramatic Overlay', style: 'Full-screen with gradient overlay, large centered typography', variation: 1 },
    { id: 'hero-2', name: 'Split Screen', style: 'Left text, right image with diagonal divider', variation: 2 },
    { id: 'hero-3', name: 'Minimal Clean', style: 'White background, subtle accent, small hero image below', variation: 3 },
    { id: 'hero-4', name: 'Video Background', style: 'Looping video with dark overlay and bold text', variation: 4 },
    { id: 'hero-5', name: 'Editorial Magazine', style: 'Large serif title, editorial layout with image inset', variation: 5 },
    { id: 'hero-6', name: 'Stats Forward', style: 'Key stats prominent, image secondary', variation: 6 },
    { id: 'hero-7', name: 'Asymmetric Grid', style: 'Off-center grid with overlapping elements', variation: 7 },
    { id: 'hero-8', name: 'Scroll Reveal', style: 'Minimal initial, reveals on scroll with parallax', variation: 8 },
    { id: 'hero-9', name: 'Luxury Dark', style: 'Dark theme with gold accents and premium feel', variation: 9 },
    { id: 'hero-10', name: 'Technical Blueprint', style: 'Blueprint/technical drawing aesthetic', variation: 10 },
    // NEW VARIATIONS 11-20
    { id: 'hero-11', name: 'Cinematic Widescreen', style: 'Letterbox format with cinematic crop, R66 in flight', variation: 11 },
    { id: 'hero-12', name: 'Instructor Focus', style: 'Quentin Smith portrait with credentials overlay', variation: 12 },
    { id: 'hero-13', name: 'Cockpit POV', style: 'Inside the cockpit view with instrument panel visible', variation: 13 },
    { id: 'hero-14', name: 'Hangar Showcase', style: 'Fleet lined up in hangar, professional facility', variation: 14 },
    { id: 'hero-15', name: 'Expedition Teaser', style: 'Antarctica/polar imagery hinting at advanced training paths', variation: 15 },
    { id: 'hero-16', name: 'Sunset Silhouette', style: 'Golden hour helicopter silhouette, aspirational', variation: 16 },
    { id: 'hero-17', name: 'Student Success', style: 'Graduate with certificate, celebration moment', variation: 17 },
    { id: 'hero-18', name: 'Team Portrait', style: 'British Helicopter Team with HQ branding', variation: 18 },
    { id: 'hero-19', name: 'Dual Control', style: 'Instructor and student in training, side by side', variation: 19 },
    { id: 'hero-20', name: 'Scenic Flight', style: 'R66 over countryside, freedom and adventure', variation: 20 },
    // NEW VARIATIONS 21-40 - ADVENTUROUS DESIGNS
    { id: 'hero-21', name: 'Film Strip Journey', style: 'Cinematic film strip with training moments', variation: 21 },
    { id: 'hero-22', name: 'Glass Cockpit', style: 'Modern avionics display aesthetic with animated data', variation: 22 },
    { id: 'hero-23', name: 'Topographic Map', style: 'Contour map background with flight path overlay', variation: 23 },
    { id: 'hero-24', name: 'Magazine Cover', style: 'Aviation magazine cover layout', variation: 24 },
    { id: 'hero-25', name: 'Split Diagonal', style: 'Bold diagonal split with dual imagery', variation: 25 },
    { id: 'hero-26', name: 'Countdown Launch', style: 'Rocket launch countdown aesthetic for new journey', variation: 26 },
    { id: 'hero-27', name: 'Weather METAR', style: 'Aviation weather report style, technical feel', variation: 27 },
    { id: 'hero-28', name: 'Golden Ratio Grid', style: 'Fibonacci spiral layout with image placement', variation: 28 },
    { id: 'hero-29', name: 'Brutalist Bold', style: 'Raw brutalist typography, stark contrast', variation: 29 },
    { id: 'hero-30', name: 'Floating Cards', style: '3D perspective cards hovering in space', variation: 30 },
    { id: 'hero-31', name: 'Parallax Layers', style: 'Multi-layer parallax depth effect', variation: 31 },
    { id: 'hero-32', name: 'Vintage Aviation', style: 'Retro aviation poster aesthetic', variation: 32 },
    { id: 'hero-33', name: 'Neon Night Flight', style: 'Dark mode with neon accents', variation: 33 },
    { id: 'hero-34', name: 'Newspaper Headline', style: 'Breaking news/newspaper front page', variation: 34 },
    { id: 'hero-35', name: 'Minimalist Zen', style: 'Maximum whitespace, single focal element', variation: 35 },
    { id: 'hero-36', name: 'Isometric 3D', style: 'Isometric illustration style', variation: 36 },
    { id: 'hero-37', name: 'Ticket Stub', style: 'Boarding pass/ticket design', variation: 37 },
    { id: 'hero-38', name: 'Polaroid Memory', style: 'Scattered polaroid photographs', variation: 38 },
    { id: 'hero-39', name: 'Motion Blur', style: 'Speed and motion blur effect', variation: 39 },
    { id: 'hero-40', name: 'Testimonial Hero', style: 'Student quote prominently featured', variation: 40 },
    // NEW VARIATIONS 41-55 - Same background image, different designs
    { id: 'hero-41', name: 'Split Text Reveal', style: 'Text splits and reveals on scroll with scenic bg', variation: 41 },
    { id: 'hero-42', name: 'Coordinates Badge', style: 'Aviation coordinates with badge overlay', variation: 42 },
    { id: 'hero-43', name: 'Vertical Stack', style: 'Stacked words with gradient treatment', variation: 43 },
    { id: 'hero-44', name: 'Monospace Terminal', style: 'Retro terminal typing effect aesthetic', variation: 44 },
    { id: 'hero-45', name: 'Floating Stats', style: 'Stats cards floating over scenic image', variation: 45 },
    { id: 'hero-46', name: 'Corner Anchored', style: 'Text anchored to corners with diagonal flow', variation: 46 },
    { id: 'hero-47', name: 'Ticket Style', style: 'Boarding pass ticket design overlay', variation: 47 },
    { id: 'hero-48', name: 'Gradient Mask', style: 'Bold gradient text masking scenic image', variation: 48 },
    { id: 'hero-49', name: 'Minimalist Line', style: 'Single accent line with minimal text', variation: 49 },
    { id: 'hero-50', name: 'Grid Overlay', style: 'Technical grid lines with data points', variation: 50 },
    { id: 'hero-51', name: 'Circular Focus', style: 'Circular mask revealing hero image', variation: 51 },
    { id: 'hero-52', name: 'Parallax Depth', style: 'Multi-layer parallax with depth cards', variation: 52 },
    { id: 'hero-53', name: 'Stamp Collection', style: 'Aviation stamps and passport style', variation: 53 },
    { id: 'hero-54', name: 'Progress Bar Hero', style: 'Training progress visualization overlay', variation: 54 },
    { id: 'hero-55', name: 'Editorial Serif', style: 'Luxury editorial with elegant serif typography', variation: 55 },
  ],

  // INTRODUCTION VARIATIONS (1-20)
  intros: [
    { id: 'intro-1', name: 'Two Column Classic', style: 'Text left, image right with caption overlay', variation: 1 },
    { id: 'intro-2', name: 'Full Width Story', style: 'Narrative flow with inline images', variation: 2 },
    { id: 'intro-3', name: 'Card Stack', style: 'Overlapping cards with key points', variation: 3 },
    { id: 'intro-4', name: 'Timeline Intro', style: 'Brief history with milestone markers', variation: 4 },
    { id: 'intro-5', name: 'Quote Focused', style: 'Large pull quote with supporting text', variation: 5 },
    { id: 'intro-6', name: 'Statistics Lead', style: 'Numbers-driven introduction', variation: 6 },
    { id: 'intro-7', name: 'Image Gallery Intro', style: 'Multiple images with flowing text', variation: 7 },
    { id: 'intro-8', name: 'Minimal Paragraph', style: 'Clean single column with accent line', variation: 8 },
    { id: 'intro-9', name: 'Video Testimonial', style: 'Video embed with text summary', variation: 9 },
    { id: 'intro-10', name: 'Interactive Reveal', style: 'Click to reveal more sections', variation: 10 },
    // NEW VARIATIONS 11-20
    { id: 'intro-11', name: 'Photo Essay', style: 'Large images with minimal captions, documentary feel', variation: 11 },
    { id: 'intro-12', name: 'Instructor Bio', style: 'Meet your instructor section with credentials', variation: 12 },
    { id: 'intro-13', name: 'Three Pillars', style: 'Safety, Skill, Freedom - three-column values', variation: 13 },
    { id: 'intro-14', name: 'Before You Start', style: 'Prerequisites checklist with friendly tone', variation: 14 },
    { id: 'intro-15', name: 'World Record Context', style: 'HQ credentials with expedition imagery', variation: 15 },
    { id: 'intro-16', name: 'Day in the Life', style: 'What to expect on a typical training day', variation: 16 },
    { id: 'intro-17', name: 'Why Helicopters', style: 'Comparison to fixed-wing, unique benefits', variation: 17 },
    { id: 'intro-18', name: 'Location Showcase', style: 'Denham Aerodrome and surrounding area', variation: 18 },
    { id: 'intro-19', name: 'Alumni Stories', style: 'Short quotes from past students with photos', variation: 19 },
    { id: 'intro-20', name: 'Immersive Scroll', style: 'Parallax images with text overlays', variation: 20 },
    // NEW VARIATIONS 21-40 - Based on feedback
    { id: 'intro-21', name: 'Instructor Network', style: 'Quentin with animated lines to all instructors he trained', variation: 21 },
    { id: 'intro-22', name: 'Why HQ', style: 'Three compelling reasons with bold typography', variation: 22 },
    { id: 'intro-23', name: 'Heritage Timeline', style: 'Since 2010 - key milestones visual', variation: 23 },
    { id: 'intro-24', name: 'Compare Schools', style: 'Why HQ vs other schools - feature comparison', variation: 24 },
    { id: 'intro-25', name: 'Student Journey', style: 'First-person narrative with progress photos', variation: 25 },
    { id: 'intro-26', name: 'Fleet Tour', style: 'Walk through aircraft options for training', variation: 26 },
    { id: 'intro-27', name: 'Award Wall', style: 'Certifications and achievements showcase', variation: 27 },
    { id: 'intro-28', name: 'Testimonial Mosaic', style: 'Grid of student photos and quotes', variation: 28 },
    { id: 'intro-29', name: 'What Sets Us Apart', style: 'Unique differentiators with icons', variation: 29 },
    { id: 'intro-30', name: 'Mission Statement', style: 'Our purpose with supporting imagery', variation: 30 },
    { id: 'intro-31', name: 'Fast Facts', style: 'Scannable key stats in modern layout', variation: 31 },
    { id: 'intro-32', name: 'Video Welcome', style: 'Embedded welcome video from Quentin', variation: 32 },
    { id: 'intro-33', name: 'Interactive Tour', style: 'Click through facility highlights', variation: 33 },
    { id: 'intro-34', name: 'Success Metrics', style: 'Pass rates, graduate numbers, satisfaction', variation: 34 },
    { id: 'intro-35', name: 'Day One Preview', style: 'What happens on your first lesson', variation: 35 },
    { id: 'intro-36', name: 'Partnership Logos', style: 'Affiliations and certifications grid', variation: 36 },
    { id: 'intro-37', name: 'Letter from Q', style: 'Personal letter style from founder', variation: 37 },
    { id: 'intro-38', name: 'Feature Carousel', style: 'Swipeable feature highlights', variation: 38 },
    { id: 'intro-39', name: 'Split Philosophy', style: 'Training approach vs traditional schools', variation: 39 },
    { id: 'intro-40', name: 'Countdown Facts', style: 'Animated number reveals', variation: 40 },
  ],

  // REQUIREMENTS VARIATIONS (1-20)
  requirements: [
    { id: 'req-1', name: 'Grid Cards', style: '6-column grid with animated counters', variation: 1 },
    { id: 'req-2', name: 'Checklist Style', style: 'Interactive checklist format', variation: 2 },
    { id: 'req-3', name: 'Icon Blocks', style: 'Large icons with descriptions', variation: 3 },
    { id: 'req-4', name: 'Table Format', style: 'Clean table with alternating rows', variation: 4 },
    { id: 'req-5', name: 'Comparison View', style: 'Before/after or vs layout', variation: 5 },
    { id: 'req-6', name: 'Minimal List', style: 'Simple bulleted list with emphasis', variation: 6 },
    { id: 'req-7', name: 'Infographic', style: 'Visual infographic style', variation: 7 },
    { id: 'req-8', name: 'Accordion Expand', style: 'Expandable sections for each requirement', variation: 8 },
    { id: 'req-9', name: 'Progress Path', style: 'Visual path showing requirements flow', variation: 9 },
    { id: 'req-10', name: 'Split Dark/Light', style: 'Two-tone design with contrast', variation: 10 },
    // NEW VARIATIONS 11-20
    { id: 'req-11', name: 'Medical Focus', style: 'Detailed Class 2 medical explanation with process', variation: 11 },
    { id: 'req-12', name: 'Age Breakdown', style: 'Different paths for 17+, career changers, retirees', variation: 12 },
    { id: 'req-13', name: 'CAA Official', style: 'Official requirements with CAA branding/links', variation: 13 },
    { id: 'req-14', name: 'Myth Busters', style: 'Common misconceptions addressed', variation: 14 },
    { id: 'req-15', name: 'Visual Timeline', style: 'When each requirement must be met', variation: 15 },
    { id: 'req-16', name: 'Document Checklist', style: 'What paperwork you need, with download links', variation: 16 },
    { id: 'req-17', name: 'Fitness Level', style: 'Physical requirements explained simply', variation: 17 },
    { id: 'req-18', name: 'Language & Theory', style: 'English proficiency and ground school preview', variation: 18 },
    { id: 'req-19', name: 'Quick Eligibility', style: 'Interactive "Am I eligible?" quiz format', variation: 19 },
    { id: 'req-20', name: 'Side by Side', style: 'PPL vs LAPL requirements comparison', variation: 20 },
    // NEW VARIATIONS 21-40 - Based on feedback
    { id: 'req-21', name: 'Falling Cards', style: 'Animated cards fall from top with staggered reveal', variation: 21 },
    { id: 'req-22', name: 'Radar Display', style: 'Aviation radar aesthetic with requirements as blips', variation: 22 },
    { id: 'req-23', name: 'Flight Computer', style: 'E6B style circular slide rule aesthetic', variation: 23 },
    { id: 'req-24', name: 'Checklist Paper', style: 'Realistic paper checklist with handwritten marks', variation: 24 },
    { id: 'req-25', name: 'Binary Decision', style: 'Yes/No flow chart for eligibility', variation: 25 },
    { id: 'req-26', name: 'Badge Collection', style: 'Requirements as badges to earn', variation: 26 },
    { id: 'req-27', name: 'Timeline Progress', style: 'When each requirement needs completion', variation: 27 },
    { id: 'req-28', name: 'Stacked Layers', style: 'Overlapping cards creating depth', variation: 28 },
    { id: 'req-29', name: 'Neon Boxes', style: 'Glowing neon bordered requirement boxes', variation: 29 },
    { id: 'req-30', name: 'Typewriter', style: 'Vintage typewriter document style', variation: 30 },
    { id: 'req-31', name: 'Mobile Cards', style: 'Swipeable card stack mobile-first', variation: 31 },
    { id: 'req-32', name: 'Hexagon Grid', style: 'Honeycomb pattern requirements layout', variation: 32 },
    { id: 'req-33', name: 'Glass Morphism', style: 'Frosted glass cards with blur effects', variation: 33 },
    { id: 'req-34', name: 'Terminal Output', style: 'Command line terminal aesthetic', variation: 34 },
    { id: 'req-35', name: 'Percentage Bars', style: 'Visual progress bars for each requirement', variation: 35 },
    { id: 'req-36', name: 'Newspaper Column', style: 'Multi-column newspaper layout', variation: 36 },
    { id: 'req-37', name: 'Sticky Notes', style: 'Post-it note style arrangement', variation: 37 },
    { id: 'req-38', name: 'Blueprint Lines', style: 'Technical drawing with dimension lines', variation: 38 },
    { id: 'req-39', name: 'Circular Dial', style: 'Speedometer/gauge style display', variation: 39 },
    { id: 'req-40', name: 'Simple Bullets', style: 'Clean minimal bullet list with hover reveals', variation: 40 },
  ],

  // JOURNEY/TIMELINE VARIATIONS (1-20)
  journeys: [
    { id: 'journey-1', name: 'Vertical Timeline', style: 'Classic vertical timeline with markers', variation: 1 },
    { id: 'journey-2', name: 'Horizontal Steps', style: 'Horizontal step progression', variation: 2 },
    { id: 'journey-3', name: 'Card Carousel', style: 'Swipeable cards for each phase', variation: 3 },
    { id: 'journey-4', name: 'SVG Path', style: 'Animated SVG flight path', variation: 4 },
    { id: 'journey-5', name: 'Accordion Steps', style: 'Expandable accordion for each step', variation: 5 },
    { id: 'journey-6', name: 'Grid Layout', style: '2x2 grid with phase details', variation: 6 },
    { id: 'journey-7', name: 'Scroll Storytelling', style: 'Scroll-triggered reveals', variation: 7 },
    { id: 'journey-8', name: 'Interactive Map', style: 'Visual map metaphor', variation: 8 },
    { id: 'journey-9', name: 'Tab Navigation', style: 'Tabbed interface for phases', variation: 9 },
    { id: 'journey-10', name: 'Minimal Numbers', style: 'Large numbers with minimal text', variation: 10 },
    // NEW VARIATIONS 11-20
    { id: 'journey-11', name: 'Logbook Style', style: 'Actual logbook pages showing progression', variation: 11 },
    { id: 'journey-12', name: 'Photo Timeline', style: 'Real training photos at each stage', variation: 12 },
    { id: 'journey-13', name: 'Skills Unlock', style: 'Game-like skill tree visualization', variation: 13 },
    { id: 'journey-14', name: 'Week by Week', style: 'Typical 12-week intensive breakdown', variation: 14 },
    { id: 'journey-15', name: 'Milestone Celebrations', style: 'First solo, first nav, skills test moments', variation: 15 },
    { id: 'journey-16', name: 'Dual to Solo', style: 'Focus on the dual-to-solo transition', variation: 16 },
    { id: 'journey-17', name: 'Ground + Air', style: 'Parallel tracks showing theory and flying', variation: 17 },
    { id: 'journey-18', name: 'Weather Windows', style: 'Realistic scheduling with weather factors', variation: 18 },
    { id: 'journey-19', name: 'Hour Counter', style: 'Animated hour accumulation visualization', variation: 19 },
    { id: 'journey-20', name: 'Certificate Path', style: 'Visual path to license with checkpoints', variation: 20 },
    // NEW VARIATIONS 21-40
    { id: 'journey-21', name: 'Flight Path SVG', style: 'Animated SVG helicopter flying through milestones', variation: 21 },
    { id: 'journey-22', name: 'Altitude Gain', style: 'Progress shown as climbing altitude graph', variation: 22 },
    { id: 'journey-23', name: 'Board Game', style: 'Game board style path with dice and spaces', variation: 23 },
    { id: 'journey-24', name: 'Metro Map', style: 'London Underground style route map', variation: 24 },
    { id: 'journey-25', name: 'Video Chapters', style: 'Video chapters for each training phase', variation: 25 },
    { id: 'journey-26', name: 'Before/After', style: 'Day 1 vs License Day comparison', variation: 26 },
    { id: 'journey-27', name: 'Spiral Progress', style: 'Spiral staircase upward visual', variation: 27 },
    { id: 'journey-28', name: 'Weather Calendar', style: 'Calendar showing typical training timeline', variation: 28 },
    { id: 'journey-29', name: 'Mountain Climb', style: 'Base camp to summit mountain metaphor', variation: 29 },
    { id: 'journey-30', name: 'River Flow', style: 'Flowing river with waypoints', variation: 30 },
    { id: 'journey-31', name: 'Newspaper Story', style: 'Article format telling the journey', variation: 31 },
    { id: 'journey-32', name: 'Step Counter', style: 'Fitness tracker step count style', variation: 32 },
    { id: 'journey-33', name: 'Space Mission', style: 'NASA mission phases aesthetic', variation: 33 },
    { id: 'journey-34', name: 'Recipe Steps', style: 'Cooking recipe format for training', variation: 34 },
    { id: 'journey-35', name: 'Horizontal Scroll', style: 'Infinite horizontal scroll timeline', variation: 35 },
    { id: 'journey-36', name: 'Accordion Expand', style: 'Click to expand each phase details', variation: 36 },
    { id: 'journey-37', name: 'Card Stack', style: 'Stacked cards that flip to reveal', variation: 37 },
    { id: 'journey-38', name: 'Circular Progress', style: 'Donut chart showing completion', variation: 38 },
    { id: 'journey-39', name: 'Book Chapters', style: 'Book with chapter titles for each phase', variation: 39 },
    { id: 'journey-40', name: 'Video Game Level', style: 'Retro game level selection screen', variation: 40 },
  ],

  // COSTS/PRICING VARIATIONS (1-20)
  costs: [
    { id: 'cost-1', name: 'Three Column Cards', style: 'Classic pricing cards with featured highlight', variation: 1 },
    { id: 'cost-2', name: 'Single Focus', style: 'One main package with add-ons below', variation: 2 },
    { id: 'cost-3', name: 'Comparison Table', style: 'Feature comparison table', variation: 3 },
    { id: 'cost-4', name: 'Calculator Style', style: 'Interactive cost calculator', variation: 4 },
    { id: 'cost-5', name: 'Timeline Costs', style: 'Costs broken down by training phase', variation: 5 },
    { id: 'cost-6', name: 'Minimal Clean', style: 'Simple price with bullet points', variation: 6 },
    { id: 'cost-7', name: 'Testimonial Integrated', style: 'Pricing with student testimonials', variation: 7 },
    { id: 'cost-8', name: 'Financing Focus', style: 'Payment plan emphasis', variation: 8 },
    { id: 'cost-9', name: 'Value Stack', style: 'Show value before revealing price', variation: 9 },
    { id: 'cost-10', name: 'Dark Premium', style: 'Luxury dark theme pricing', variation: 10 },
    // NEW VARIATIONS 11-20
    { id: 'cost-11', name: 'Hourly Breakdown', style: 'Detailed per-hour costs with aircraft options', variation: 11 },
    { id: 'cost-12', name: 'R22 vs R44 vs R66', style: 'Training aircraft comparison with costs', variation: 12 },
    { id: 'cost-13', name: 'Hidden Costs Revealed', style: 'Transparent all-in pricing, no surprises', variation: 13 },
    { id: 'cost-14', name: 'Monthly Budget', style: 'Spread over 6/12/18 months visualization', variation: 14 },
    { id: 'cost-15', name: 'What You Get', style: 'Value breakdown with included items', variation: 15 },
    { id: 'cost-16', name: 'Investment ROI', style: 'Future career earnings potential', variation: 16 },
    { id: 'cost-17', name: 'Block Booking', style: 'Discounts for advance booking packages', variation: 17 },
    { id: 'cost-18', name: 'Gift Voucher', style: 'Gift options and voucher values', variation: 18 },
    { id: 'cost-19', name: 'Corporate Training', style: 'Business/corporate package pricing', variation: 19 },
    { id: 'cost-20', name: 'Seasonal Offers', style: 'Current promotions and limited offers', variation: 20 },
    // NEW VARIATIONS 21-40 - Based on feedback
    { id: 'cost-21', name: 'Detailed Hourly', style: 'Per-hour rates with Ground School INCLUDED in green', variation: 21 },
    { id: 'cost-22', name: 'Calculator Interactive', style: 'Sliders for hours to calculate total cost', variation: 22 },
    { id: 'cost-23', name: 'Receipt Style', style: 'Itemized receipt breakdown', variation: 23 },
    { id: 'cost-24', name: 'Value Equation', style: 'Investment = Skills + Freedom visual', variation: 24 },
    { id: 'cost-25', name: 'Monthly Payment', style: 'Finance options prominently displayed', variation: 25 },
    { id: 'cost-26', name: 'Comparison Stack', style: 'R22 vs R44 vs R66 stacked comparison', variation: 26 },
    { id: 'cost-27', name: 'Graph Projection', style: 'Cost over time visualization graph', variation: 27 },
    { id: 'cost-28', name: 'No Hidden Fees', style: 'Transparent pricing with trust badges', variation: 28 },
    { id: 'cost-29', name: 'Package Builder', style: 'Build your own training package', variation: 29 },
    { id: 'cost-30', name: 'Coffee Analogy', style: 'Daily coffee cost comparison', variation: 30 },
    { id: 'cost-31', name: 'Ticket Pricing', style: 'Concert/event ticket style pricing', variation: 31 },
    { id: 'cost-32', name: 'Speedometer Value', style: 'Gauge showing value for money', variation: 32 },
    { id: 'cost-33', name: 'Savings Badge', style: 'Block booking discounts highlighted', variation: 33 },
    { id: 'cost-34', name: 'Timeline Budget', style: 'Spending spread over typical timeline', variation: 34 },
    { id: 'cost-35', name: 'Premium vs Standard', style: 'Two-tier training options', variation: 35 },
    { id: 'cost-36', name: 'Flying Club Rate', style: 'Membership benefits for repeat training', variation: 36 },
    { id: 'cost-37', name: 'Price Lock', style: 'Lock in todays prices messaging', variation: 37 },
    { id: 'cost-38', name: 'Gift Card', style: 'Gift voucher option highlighted', variation: 38 },
    { id: 'cost-39', name: 'ROI Calculator', style: 'Career earnings potential vs training cost', variation: 39 },
    { id: 'cost-40', name: 'Simple Single', style: 'One big price, everything included', variation: 40 },
  ],

  // FAQ VARIATIONS (1-20)
  faqs: [
    { id: 'faq-1', name: 'Accordion Classic', style: 'Expandable accordion with animations', variation: 1 },
    { id: 'faq-2', name: 'Two Column', style: 'Questions on left, answers on right', variation: 2 },
    { id: 'faq-3', name: 'Category Tabs', style: 'Tabbed categories of questions', variation: 3 },
    { id: 'faq-4', name: 'Search Enabled', style: 'Searchable FAQ with filtering', variation: 4 },
    { id: 'faq-5', name: 'Card Grid', style: 'FAQ cards in a grid layout', variation: 5 },
    { id: 'faq-6', name: 'Minimal List', style: 'Simple Q&A list', variation: 6 },
    { id: 'faq-7', name: 'Chat Style', style: 'Conversation bubble format', variation: 7 },
    { id: 'faq-8', name: 'Progressive Reveal', style: 'Show more questions on scroll', variation: 8 },
    { id: 'faq-9', name: 'Icon Labeled', style: 'Icons categorizing question types', variation: 9 },
    { id: 'faq-10', name: 'Timeline FAQ', style: 'Questions organized by training stage', variation: 10 },
    // NEW VARIATIONS 11-20
    { id: 'faq-11', name: 'Video Answers', style: 'Short video clips answering each question', variation: 11 },
    { id: 'faq-12', name: 'Instructor Q&A', style: 'Quentin directly answering common questions', variation: 12 },
    { id: 'faq-13', name: 'Student Submitted', style: 'Real questions from past students', variation: 13 },
    { id: 'faq-14', name: 'Fear Busters', style: 'Addressing common fears and concerns', variation: 14 },
    { id: 'faq-15', name: 'Quick Facts', style: 'One-line answers, scannable format', variation: 15 },
    { id: 'faq-16', name: 'Comparison FAQ', style: 'vs other schools, vs fixed-wing answers', variation: 16 },
    { id: 'faq-17', name: 'Medical FAQ', style: 'Focused on medical certificate questions', variation: 17 },
    { id: 'faq-18', name: 'Scheduling FAQ', style: 'Availability, booking, weather questions', variation: 18 },
    { id: 'faq-19', name: 'Career FAQ', style: 'What comes after PPL questions', variation: 19 },
    { id: 'faq-20', name: 'Collapsible Sections', style: 'Grouped by topic with smooth animations', variation: 20 },
    // NEW VARIATIONS 21-40 - Based on feedback
    { id: 'faq-21', name: 'Video FAQ', style: 'Short video clips with winter flying and weather benefits', variation: 21 },
    { id: 'faq-22', name: 'Icon Accordion', style: 'Beautiful icons for each FAQ category', variation: 22 },
    { id: 'faq-23', name: 'Two Panel', style: 'Questions left, selected answer right', variation: 23 },
    { id: 'faq-24', name: 'Flip Cards', style: 'Click to flip and reveal answer', variation: 24 },
    { id: 'faq-25', name: 'Chat Bot', style: 'AI chatbot style conversation', variation: 25 },
    { id: 'faq-26', name: 'Magazine Q&A', style: 'Editorial interview format', variation: 26 },
    { id: 'faq-27', name: 'Tooltip Hover', style: 'Hover keywords to see answers', variation: 27 },
    { id: 'faq-28', name: 'Story Format', style: 'FAQs woven into narrative', variation: 28 },
    { id: 'faq-29', name: 'Numbered List', style: 'Top 10 questions format', variation: 29 },
    { id: 'faq-30', name: 'Filter Tags', style: 'Filter by topic tags', variation: 30 },
    { id: 'faq-31', name: 'Floating Bubbles', style: 'Speech bubbles that expand on click', variation: 31 },
    { id: 'faq-32', name: 'Index Cards', style: 'Rolodex style flip through', variation: 32 },
    { id: 'faq-33', name: 'Knowledge Base', style: 'Help center article layout', variation: 33 },
    { id: 'faq-34', name: 'Ask Quentin', style: 'Direct questions to instructor persona', variation: 34 },
    { id: 'faq-35', name: 'Student Voices', style: 'Answered by past students', variation: 35 },
    { id: 'faq-36', name: 'Timeline FAQ', style: 'When questions typically arise in training', variation: 36 },
    { id: 'faq-37', name: 'Voice Clips', style: 'Audio answers with play button', variation: 37 },
    { id: 'faq-38', name: 'Myth vs Fact', style: 'Common myths debunked', variation: 38 },
    { id: 'faq-39', name: 'Diagram Answers', style: 'Visual diagrams explaining answers', variation: 39 },
    { id: 'faq-40', name: 'Grid Tiles', style: 'Clickable tile grid of topics', variation: 40 },
  ],

  // CTA VARIATIONS (1-20)
  ctas: [
    { id: 'cta-1', name: 'Split Image', style: 'Text left, large image right', variation: 1 },
    { id: 'cta-2', name: 'Full Background', style: 'Full-bleed background image with overlay', variation: 2 },
    { id: 'cta-3', name: 'Minimal Centered', style: 'Clean centered text with buttons', variation: 3 },
    { id: 'cta-4', name: 'Contact Form', style: 'Integrated contact form', variation: 4 },
    { id: 'cta-5', name: 'Stats CTA', style: 'Social proof stats with CTA', variation: 5 },
    { id: 'cta-6', name: 'Testimonial CTA', style: 'Testimonial with call to action', variation: 6 },
    { id: 'cta-7', name: 'Urgency Banner', style: 'Limited time/availability emphasis', variation: 7 },
    { id: 'cta-8', name: 'Multi-Option', style: 'Multiple CTA paths', variation: 8 },
    { id: 'cta-9', name: 'Dark Contrast', style: 'Dark section for contrast', variation: 9 },
    { id: 'cta-10', name: 'Animated Reveal', style: 'Scroll-triggered animation', variation: 10 },
    // NEW VARIATIONS 11-20
    { id: 'cta-11', name: 'Trial Flight Focus', style: 'Book a discovery flight as primary action', variation: 11 },
    { id: 'cta-12', name: 'Call Direct', style: 'Phone number prominent with click-to-call', variation: 12 },
    { id: 'cta-13', name: 'Visit Us', style: 'Map and directions to Denham', variation: 13 },
    { id: 'cta-14', name: 'WhatsApp/Chat', style: 'Instant messaging options', variation: 14 },
    { id: 'cta-15', name: 'Download Brochure', style: 'PDF download with email capture', variation: 15 },
    { id: 'cta-16', name: 'Meet the Team', style: 'Schedule a facility tour', variation: 16 },
    { id: 'cta-17', name: 'Gift Experience', style: 'Buy as a gift for someone', variation: 17 },
    { id: 'cta-18', name: 'Newsletter Signup', style: 'Stay informed with email updates', variation: 18 },
    { id: 'cta-19', name: 'Social Follow', style: 'Connect on social media platforms', variation: 19 },
    { id: 'cta-20', name: 'Next Steps Card', style: 'Clear 1-2-3 next steps with buttons', variation: 20 },
    // NEW VARIATIONS 21-40 - Based on feedback
    { id: 'cta-21', name: 'Discovery Flight Hero', style: 'Enquire about discovery flight with compelling imagery', variation: 21 },
    { id: 'cta-22', name: 'Helicopter Tour', style: 'Visit our collection - tours for helicopter lovers', variation: 22 },
    { id: 'cta-23', name: 'Floating Contact', style: 'Floating glass card with all contact options', variation: 23 },
    { id: 'cta-24', name: 'Countdown Offer', style: 'Limited time offer with countdown timer', variation: 24 },
    { id: 'cta-25', name: 'Video CTA', style: 'Background video with bold CTA overlay', variation: 25 },
    { id: 'cta-26', name: 'Testimonial Push', style: 'Student quote driving action', variation: 26 },
    { id: 'cta-27', name: 'Split Options', style: 'Two paths - Book Trial or Full Course', variation: 27 },
    { id: 'cta-28', name: 'Calculator Lead', style: 'Get personalized quote CTA', variation: 28 },
    { id: 'cta-29', name: 'WhatsApp Connect', style: 'Instant messaging prominent', variation: 29 },
    { id: 'cta-30', name: 'Story Continue', style: 'Your story continues here - narrative', variation: 30 },
    { id: 'cta-31', name: 'Trust Badges', style: 'CTA surrounded by trust indicators', variation: 31 },
    { id: 'cta-32', name: 'Dark Dramatic', style: 'High contrast dark CTA section', variation: 32 },
    { id: 'cta-33', name: 'Polaroid Stack', style: 'Stack of photos leading to CTA', variation: 33 },
    { id: 'cta-34', name: 'Newsletter First', style: 'Subscribe for training tips lead-in', variation: 34 },
    { id: 'cta-35', name: 'Social Proof', style: 'Recent bookings/graduates ticker', variation: 35 },
    { id: 'cta-36', name: 'Calendar Embed', style: 'Book directly on calendar', variation: 36 },
    { id: 'cta-37', name: 'Question Lead', style: 'Ready to fly? Yes/Not yet options', variation: 37 },
    { id: 'cta-38', name: 'Gift Voucher', style: 'Give the gift of flight prominent', variation: 38 },
    { id: 'cta-39', name: 'Meet Team', style: 'Book a facility tour CTA', variation: 39 },
    { id: 'cta-40', name: 'Minimal Action', style: 'Single button, maximum impact', variation: 40 },
  ],
};

// Generate 55 full page variations (heroes go to 55, others wrap at 40)
const pageVariations = Array.from({ length: 55 }, (_, i) => ({
  id: `ppl-page-${i + 1}`,
  name: `PPL Variation ${i + 1}`,
  number: i + 1,
  components: {
    hero: componentVariations.heroes[i],
    intro: componentVariations.intros[i % 40],
    requirements: componentVariations.requirements[i % 40],
    journey: componentVariations.journeys[i % 40],
    costs: componentVariations.costs[i % 40],
    faq: componentVariations.faqs[i % 40],
    cta: componentVariations.ctas[i % 40],
  }
}));

// ============================================
// COMPONENT RENDERERS
// ============================================

// Reveal wrapper
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Component wrapper with subtle favorite button (appears on hover)
function ComponentWrapper({ component, type, isFavorite, onToggleFavorite, favoriteNote, variation }) {
  return (
    <div className={`ppl-component ppl-component--${type} ppl-component--v${variation}`}>
      <button
        className={`ppl-component__fav ${isFavorite ? 'active' : ''}`}
        onClick={() => onToggleFavorite(component)}
        title={favoriteNote || `${component.name} - ${component.style}`}
      >
        {isFavorite ? '★' : '☆'}
      </button>
      {/* Render component based on type and variation */}
      {type === 'hero' && <HeroComponent variation={variation} />}
      {type === 'intro' && <IntroComponent variation={variation} />}
      {type === 'requirements' && <RequirementsComponent variation={variation} />}
      {type === 'journey' && <JourneyComponent variation={variation} />}
      {type === 'costs' && <CostsComponent variation={variation} />}
      {type === 'faq' && <FAQComponent variation={variation} />}
      {type === 'cta' && <CTAComponent variation={variation} />}
    </div>
  );
}

// ============================================
// HERO COMPONENTS (10 variations)
// ============================================

function HeroComponent({ variation }) {
  const heroStyles = {
    1: { // Dramatic Overlay
      bg: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5))',
      layout: 'centered',
      titleSize: 'clamp(3rem, 10vw, 6rem)',
    },
    2: { // Split Screen
      bg: '#faf9f6',
      layout: 'split',
      accent: '#E04A2F',
    },
    3: { // Minimal Clean
      bg: '#ffffff',
      layout: 'minimal',
      accent: '#1a1a1a',
    },
    4: { // Video Background
      bg: '#0a0a0a',
      layout: 'centered',
      hasVideo: true,
    },
    5: { // Editorial Magazine
      bg: '#faf9f6',
      layout: 'editorial',
      fontFamily: "'Playfair Display', serif",
    },
    6: { // Stats Forward
      bg: '#f5f5f2',
      layout: 'stats',
    },
    7: { // Asymmetric Grid
      bg: '#ffffff',
      layout: 'asymmetric',
    },
    8: { // Scroll Reveal
      bg: '#faf9f6',
      layout: 'reveal',
    },
    9: { // Luxury Dark
      bg: '#0a0a0a',
      layout: 'luxury',
      accent: '#c9a962',
    },
    10: { // Technical Blueprint
      bg: '#1a2744',
      layout: 'blueprint',
      accent: '#4a9eff',
    },
  };

  const style = heroStyles[variation] || heroStyles[1];

  return (
    <div className={`hero-preview hero-preview--v${variation}`} style={{ background: style.bg }}>
      {variation === 1 && (
        <div className="hero-preview__content hero-preview__content--centered">
          <span className="hero-preview__label">Private Pilot License</span>
          <h1 className="hero-preview__title" style={{ fontSize: style.titleSize }}>
            <span>Your Wings</span>
            <span style={{ color: '#E04A2F' }}>Await</span>
          </h1>
          <p className="hero-preview__subtitle">The PPL(H) is your gateway to the freedom of helicopter flight.</p>
          <div className="hero-preview__stats">
            <div><strong>45</strong><span>Min Hours</span></div>
            <div><strong>9</strong><span>Exams</span></div>
            <div><strong>6-12</strong><span>Months</span></div>
          </div>
        </div>
      )}

      {variation === 2 && (
        <div className="hero-preview__content hero-preview__content--split">
          <div className="hero-preview__text">
            <span className="hero-preview__label">PPL(H) Training</span>
            <h1>Learn to Fly<br /><span style={{ color: style.accent }}>Helicopters</span></h1>
            <p>Your journey to becoming a pilot starts here.</p>
            <button className="hero-preview__btn">Start Your Journey</button>
          </div>
          <div className="hero-preview__image">
            <div className="hero-preview__image-placeholder" style={{ background: '#e5e5e5' }}>
              <span>Hero Image</span>
            </div>
          </div>
        </div>
      )}

      {variation === 3 && (
        <div className="hero-preview__content hero-preview__content--minimal">
          <h1 style={{ color: '#1a1a1a', fontSize: '2.5rem', marginBottom: '1rem' }}>
            Private Pilot License
          </h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            The foundation of your aviation career
          </p>
          <button className="hero-preview__btn hero-preview__btn--outline">Learn More</button>
        </div>
      )}

      {variation === 4 && (
        <div className="hero-preview__content hero-preview__content--video" style={{ color: '#fff' }}>
          <div className="hero-preview__video-indicator">▶ Video Background</div>
          <h1 style={{ fontSize: '3rem' }}>Experience Flight</h1>
          <p>Immerse yourself in the world of aviation</p>
        </div>
      )}

      {variation === 5 && (
        <div className="hero-preview__content hero-preview__content--editorial">
          <div className="hero-preview__editorial-grid">
            <div className="hero-preview__editorial-text">
              <span className="hero-preview__label">Est. 2010</span>
              <h1 style={{ fontFamily: style.fontFamily, fontSize: '3rem', fontWeight: 400 }}>
                The Art of<br /><em>Helicopter Flight</em>
              </h1>
              <p>A comprehensive guide to earning your PPL(H)</p>
            </div>
            <div className="hero-preview__editorial-image">
              <div className="hero-preview__image-placeholder" style={{ height: '200px' }}>Image</div>
            </div>
          </div>
        </div>
      )}

      {variation === 6 && (
        <div className="hero-preview__content hero-preview__content--stats-first">
          <div className="hero-preview__big-stats">
            <div className="hero-preview__big-stat">
              <span className="hero-preview__big-number">45</span>
              <span>minimum flight hours required</span>
            </div>
          </div>
          <h2>Private Pilot License Training</h2>
          <p>Join thousands of successful graduates</p>
        </div>
      )}

      {variation === 7 && (
        <div className="hero-preview__content hero-preview__content--asymmetric">
          <div className="hero-preview__grid-item hero-preview__grid-item--title">
            <h1>PPL(H)</h1>
          </div>
          <div className="hero-preview__grid-item hero-preview__grid-item--image">
            <div className="hero-preview__image-placeholder">Image</div>
          </div>
          <div className="hero-preview__grid-item hero-preview__grid-item--text">
            <p>Your journey to the skies begins with professional training.</p>
          </div>
        </div>
      )}

      {variation === 8 && (
        <div className="hero-preview__content hero-preview__content--reveal">
          <h1 style={{ fontSize: '4rem', opacity: 0.1 }}>PPL</h1>
          <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Scroll to reveal
          </p>
        </div>
      )}

      {variation === 9 && (
        <div className="hero-preview__content hero-preview__content--luxury" style={{ color: '#fff' }}>
          <span style={{ color: style.accent, letterSpacing: '0.3em', fontSize: '0.7rem' }}>EXCLUSIVE TRAINING</span>
          <h1 style={{ color: style.accent, fontSize: '3rem', fontWeight: 300 }}>
            Private Pilot License
          </h1>
          <p style={{ opacity: 0.7 }}>Experience aviation excellence</p>
          <div style={{ width: '60px', height: '1px', background: style.accent, margin: '1.5rem auto' }}></div>
        </div>
      )}

      {variation === 10 && (
        <div className="hero-preview__content hero-preview__content--blueprint" style={{ color: '#fff' }}>
          <div className="hero-preview__blueprint-grid">
            <div className="hero-preview__blueprint-lines"></div>
            <h1 style={{ fontFamily: 'monospace', color: style.accent }}>PPL(H) TRAINING</h1>
            <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', opacity: 0.7 }}>
              TECHNICAL SPECIFICATIONS // REV 2024
            </p>
          </div>
        </div>
      )}

      {/* VARIATIONS 11-20 with real images */}
      {variation === 11 && (
        <div className="hero-preview__cinematic">
          <img src="/assets/images/used-aircraft/r66/chris-r66-alps.jpg" alt="R66 in flight" className="hero-preview__bg-image" />
          <div className="hero-preview__cinematic-overlay">
            <span className="hero-preview__label">PPL(H) Training</span>
            <h1>Take the<br />Controls</h1>
            <p>Your journey to helicopter mastery begins here</p>
            <button className="hero-preview__btn">Book Discovery Flight</button>
          </div>
          <div className="hero-preview__letterbox hero-preview__letterbox--top"></div>
          <div className="hero-preview__letterbox hero-preview__letterbox--bottom"></div>
        </div>
      )}

      {variation === 12 && (
        <div className="hero-preview__instructor">
          <div className="hero-preview__instructor-content">
            <div className="hero-preview__instructor-text">
              <span className="hero-preview__label">Learn from the Best</span>
              <h1>World Champion<br />Instructor</h1>
              <p>Train with Quentin Smith - World Helicopter Aerobatic Champion and polar expedition pilot</p>
              <div className="hero-preview__credentials">
                <span>15,000+ Flight Hours</span>
                <span>World Record Holder</span>
                <span>30+ Years Experience</span>
              </div>
            </div>
            <div className="hero-preview__instructor-image">
              <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="Quentin Smith" />
            </div>
          </div>
        </div>
      )}

      {variation === 13 && (
        <div className="hero-preview__cockpit">
          <img src="/assets/images/gallery/flying/flying-tv.jpg" alt="Cockpit view" className="hero-preview__bg-image" />
          <div className="hero-preview__cockpit-overlay">
            <div className="hero-preview__cockpit-hud">
              <span className="hero-preview__hud-item">ALT: 1,500ft</span>
              <span className="hero-preview__hud-item">HDG: 270°</span>
              <span className="hero-preview__hud-item">IAS: 90kts</span>
            </div>
            <h1>See the World<br />From Here</h1>
            <p>Learn to command the cockpit with confidence</p>
          </div>
        </div>
      )}

      {variation === 14 && (
        <div className="hero-preview__hangar">
          <img src="/assets/images/facility/hq-aviation-helicopter-hangar.webp" alt="HQ Aviation Hangar" className="hero-preview__bg-image" />
          <div className="hero-preview__hangar-overlay">
            <span className="hero-preview__label">Denham Aerodrome</span>
            <h1>Professional<br />Facilities</h1>
            <p>Train at one of the UK's premier helicopter training centers</p>
            <div className="hero-preview__facility-features">
              <span>Modern Fleet</span>
              <span>Dedicated Hangar</span>
              <span>Ground School</span>
            </div>
          </div>
        </div>
      )}

      {variation === 15 && (
        <div className="hero-preview__expedition">
          <img src="/assets/images/expeditions/antartica.jpg" alt="Antarctica Expedition" className="hero-preview__bg-image" />
          <div className="hero-preview__expedition-overlay">
            <span className="hero-preview__label">Where Will Your License Take You?</span>
            <h1>From PPL to<br />Polar Explorer</h1>
            <p>HQ Aviation pilots have flown to Antarctica, the North Pole, and beyond</p>
            <button className="hero-preview__btn">Start Your Journey</button>
          </div>
        </div>
      )}

      {variation === 16 && (
        <div className="hero-preview__sunset">
          <img src="/assets/images/gallery/flying/foggy-evening-flying.jpg" alt="Sunset flight" className="hero-preview__bg-image" />
          <div className="hero-preview__sunset-overlay">
            <h1>Chase<br />Sunsets</h1>
            <p>Experience the freedom that only flight can bring</p>
            <button className="hero-preview__btn hero-preview__btn--light">Learn to Fly</button>
          </div>
        </div>
      )}

      {variation === 17 && (
        <div className="hero-preview__success">
          <div className="hero-preview__success-content">
            <div className="hero-preview__success-image">
              <img src="/assets/images/gallery/events/img_2199.jpg" alt="Graduate celebration" />
            </div>
            <div className="hero-preview__success-text">
              <span className="hero-preview__label">Join Our Graduates</span>
              <h1>Your Success<br />Story Starts Here</h1>
              <p>Hundreds of pilots have earned their wings with HQ Aviation</p>
              <div className="hero-preview__success-stats">
                <div><strong>500+</strong><span>Graduates</span></div>
                <div><strong>98%</strong><span>Pass Rate</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {variation === 18 && (
        <div className="hero-preview__team">
          <img src="/assets/images/team/british-helicopter-team.webp" alt="British Helicopter Team" className="hero-preview__bg-image" />
          <div className="hero-preview__team-overlay">
            <span className="hero-preview__label">Home of Champions</span>
            <h1>Train with<br />the Best</h1>
            <p>HQ Aviation - Home of the British Helicopter Team</p>
            <div className="hero-preview__team-logos">
              <img src="/assets/images/logos/certifications/rhc.png" alt="Robinson" style={{ height: '40px', opacity: 0.9 }} />
            </div>
          </div>
        </div>
      )}

      {variation === 19 && (
        <div className="hero-preview__dual">
          <div className="hero-preview__dual-grid">
            <div className="hero-preview__dual-image">
              <img src="/assets/images/facility/hq-0153.jpg" alt="Training session" />
            </div>
            <div className="hero-preview__dual-content">
              <span className="hero-preview__label">Hands-On Training</span>
              <h1>Side by Side<br />Instruction</h1>
              <p>Experience personalized 1-on-1 training with experienced instructors</p>
              <ul className="hero-preview__dual-features">
                <li>Dual controls from day one</li>
                <li>Instant feedback and guidance</li>
                <li>Build confidence with every flight</li>
              </ul>
              <button className="hero-preview__btn">Book Trial Lesson</button>
            </div>
          </div>
        </div>
      )}

      {variation === 20 && (
        <div className="hero-preview__scenic">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic helicopter flight" className="hero-preview__bg-image" />
          <div className="hero-preview__scenic-overlay">
            <div className="hero-preview__scenic-content">
              <span className="hero-preview__label">Private Pilot License</span>
              <h1>Freedom<br />Awaits</h1>
              <p>Explore the UK from a perspective few ever experience</p>
              <div className="hero-preview__scenic-cta">
                <button className="hero-preview__btn">Get Started</button>
                <button className="hero-preview__btn hero-preview__btn--outline-light">Watch Video</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HERO 21: Film Strip Journey - Cinematic film aesthetic */}
      {variation === 21 && (
        <div className="hero-preview__filmstrip">
          <div className="hero-preview__filmstrip-track">
            <div className="hero-preview__filmstrip-frame">
              <img src="/assets/images/gallery/carousel/rotating1.jpg" alt="Frame 1" />
              <span className="hero-preview__frame-label">First Lesson</span>
            </div>
            <div className="hero-preview__filmstrip-frame">
              <img src="/assets/images/gallery/carousel/rotating2.jpg" alt="Frame 2" />
              <span className="hero-preview__frame-label">Solo Flight</span>
            </div>
            <div className="hero-preview__filmstrip-frame hero-preview__filmstrip-frame--active">
              <img src="/assets/images/gallery/carousel/rotating-3.jpg" alt="Frame 3" />
              <span className="hero-preview__frame-label">Navigation</span>
            </div>
            <div className="hero-preview__filmstrip-frame">
              <img src="/assets/images/gallery/carousel/rotating-4.jpg" alt="Frame 4" />
              <span className="hero-preview__frame-label">Skills Test</span>
            </div>
            <div className="hero-preview__filmstrip-frame">
              <img src="/assets/images/gallery/events/img_2199.jpg" alt="Frame 5" />
              <span className="hero-preview__frame-label">License Day</span>
            </div>
          </div>
          <div className="hero-preview__filmstrip-content">
            <span className="hero-preview__label">Your Story Unfolds</span>
            <h1>Every Frame<br /><span className="hero-preview__accent">A Milestone</span></h1>
            <p>From first flight to licensed pilot - we capture every moment of your journey</p>
            <button className="hero-preview__btn">Start Your Story</button>
          </div>
          <div className="hero-preview__sprocket hero-preview__sprocket--left"></div>
          <div className="hero-preview__sprocket hero-preview__sprocket--right"></div>
        </div>
      )}

      {/* HERO 22: Glass Cockpit - Modern avionics display */}
      {variation === 22 && (
        <div className="hero-preview__glass-cockpit">
          <div className="hero-preview__avionics-grid">
            <div className="hero-preview__pfd">
              <div className="hero-preview__attitude-indicator">
                <div className="hero-preview__horizon-line"></div>
                <div className="hero-preview__aircraft-symbol">—●—</div>
              </div>
              <div className="hero-preview__pfd-data">
                <span className="hero-preview__data-item"><small>ALT</small>2,500<small>ft</small></span>
                <span className="hero-preview__data-item"><small>IAS</small>95<small>kts</small></span>
              </div>
            </div>
            <div className="hero-preview__mfd">
              <div className="hero-preview__nav-display">
                <div className="hero-preview__compass-rose"></div>
                <span className="hero-preview__heading">HDG 270°</span>
              </div>
            </div>
          </div>
          <div className="hero-preview__glass-content">
            <span className="hero-preview__label hero-preview__label--mono">SYSTEM ONLINE</span>
            <h1>Master the<br /><span className="hero-preview__accent-cyan">Glass Cockpit</span></h1>
            <p>Modern helicopter training with the latest avionics technology</p>
            <div className="hero-preview__glass-stats">
              <div><span className="hero-preview__stat-value">R66</span><span className="hero-preview__stat-label">Turbine</span></div>
              <div><span className="hero-preview__stat-value">G500H</span><span className="hero-preview__stat-label">Avionics</span></div>
              <div><span className="hero-preview__stat-value">IFR</span><span className="hero-preview__stat-label">Capable</span></div>
            </div>
            <button className="hero-preview__btn hero-preview__btn--cyan">Initialize Training</button>
          </div>
        </div>
      )}

      {/* HERO 23: Topographic Map - Contour lines and flight path */}
      {variation === 23 && (
        <div className="hero-preview__topo">
          <svg className="hero-preview__topo-bg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="topo-pattern" patternUnits="userSpaceOnUse" width="100" height="100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(224,74,47,0.1)" strokeWidth="1"/>
                <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(224,74,47,0.15)" strokeWidth="1"/>
                <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(224,74,47,0.2)" strokeWidth="1"/>
                <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(224,74,47,0.25)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topo-pattern)"/>
            <path className="hero-preview__flight-path" d="M50,350 Q200,300 300,200 T500,150 T750,100" fill="none" stroke="#E04A2F" strokeWidth="3" strokeDasharray="10,5"/>
            <circle cx="50" cy="350" r="8" fill="#E04A2F"/>
            <circle cx="750" cy="100" r="8" fill="#E04A2F" className="hero-preview__destination-pulse"/>
            <text x="60" y="370" fill="#E04A2F" fontSize="12" fontFamily="Share Tech Mono">EGLD</text>
            <text x="700" y="90" fill="#E04A2F" fontSize="12" fontFamily="Share Tech Mono">DESTINATION</text>
          </svg>
          <div className="hero-preview__topo-content">
            <span className="hero-preview__label">Chart Your Course</span>
            <h1>Navigate<br /><span className="hero-preview__accent">New Horizons</span></h1>
            <p>Learn cross-country navigation over the beautiful British countryside</p>
            <div className="hero-preview__topo-coords">
              <span>51.5751°N</span>
              <span>0.5059°W</span>
              <span>DENHAM</span>
            </div>
            <button className="hero-preview__btn">Plan Your Route</button>
          </div>
        </div>
      )}

      {/* HERO 24: Magazine Cover - Editorial aviation style */}
      {variation === 24 && (
        <div className="hero-preview__magazine">
          <div className="hero-preview__magazine-header">
            <span className="hero-preview__mag-issue">ISSUE 47 • WINTER 2024</span>
            <h2 className="hero-preview__mag-title">HQ AVIATION</h2>
            <span className="hero-preview__mag-tagline">THE ROBINSON SPECIALISTS</span>
          </div>
          <div className="hero-preview__magazine-cover">
            <img src="/assets/images/used-aircraft/r66/gold-on-pad.jpg" alt="Magazine cover" />
          </div>
          <div className="hero-preview__magazine-headlines">
            <div className="hero-preview__mag-main">
              <h1>YOUR PPL<br />JOURNEY</h1>
              <p>Everything you need to know about becoming a helicopter pilot</p>
            </div>
            <div className="hero-preview__mag-features">
              <span>✈ Training Guide Inside</span>
              <span>✈ Cost Breakdown</span>
              <span>✈ Student Stories</span>
            </div>
          </div>
          <div className="hero-preview__mag-cta">
            <button className="hero-preview__btn">Read More</button>
          </div>
        </div>
      )}

      {/* HERO 25: Split Diagonal - Bold geometric design */}
      {variation === 25 && (
        <div className="hero-preview__diagonal">
          <div className="hero-preview__diagonal-left">
            <img src="/assets/images/facility/hq-0153.jpg" alt="Training" />
            <div className="hero-preview__diagonal-overlay-dark"></div>
            <div className="hero-preview__diagonal-text-left">
              <span className="hero-preview__label">Ground School</span>
              <h2>Learn</h2>
              <p>Theory & Knowledge</p>
            </div>
          </div>
          <div className="hero-preview__diagonal-right">
            <img src="/assets/images/gallery/flying/flying-tv.jpg" alt="Flying" />
            <div className="hero-preview__diagonal-overlay-light"></div>
            <div className="hero-preview__diagonal-text-right">
              <span className="hero-preview__label">Flight Training</span>
              <h2>Fly</h2>
              <p>Hands-On Experience</p>
            </div>
          </div>
          <div className="hero-preview__diagonal-center">
            <div className="hero-preview__diagonal-badge">
              <span>PPL(H)</span>
              <small>Complete Training</small>
            </div>
          </div>
        </div>
      )}

      {/* HERO 26: Countdown Launch - Mission control aesthetic */}
      {variation === 26 && (
        <div className="hero-preview__countdown">
          <div className="hero-preview__mission-control">
            <div className="hero-preview__countdown-display">
              <div className="hero-preview__countdown-item">
                <span className="hero-preview__countdown-num">45</span>
                <span className="hero-preview__countdown-label">MIN HOURS</span>
              </div>
              <div className="hero-preview__countdown-sep">:</div>
              <div className="hero-preview__countdown-item">
                <span className="hero-preview__countdown-num">09</span>
                <span className="hero-preview__countdown-label">EXAMS</span>
              </div>
              <div className="hero-preview__countdown-sep">:</div>
              <div className="hero-preview__countdown-item">
                <span className="hero-preview__countdown-num">01</span>
                <span className="hero-preview__countdown-label">LICENSE</span>
              </div>
            </div>
            <div className="hero-preview__mission-status">
              <span className="hero-preview__status-indicator"></span>
              <span>MISSION: BECOME A PILOT</span>
            </div>
          </div>
          <div className="hero-preview__countdown-content">
            <h1>Your Mission<br /><span className="hero-preview__accent">Awaits</span></h1>
            <p>Every great pilot started exactly where you are now</p>
            <button className="hero-preview__btn hero-preview__btn--launch">Launch Training</button>
          </div>
        </div>
      )}

      {/* HERO 27: Weather METAR - Aviation weather aesthetic */}
      {variation === 27 && (
        <div className="hero-preview__metar">
          <div className="hero-preview__weather-display">
            <div className="hero-preview__metar-code">
              <span className="hero-preview__metar-label">METAR</span>
              <code>EGLD 121350Z 27015KT 9999 FEW040 15/08 Q1023</code>
            </div>
            <div className="hero-preview__weather-decoded">
              <div className="hero-preview__weather-item">
                <span className="hero-preview__weather-icon">💨</span>
                <span className="hero-preview__weather-val">270° / 15kt</span>
                <span className="hero-preview__weather-desc">Wind</span>
              </div>
              <div className="hero-preview__weather-item">
                <span className="hero-preview__weather-icon">👁</span>
                <span className="hero-preview__weather-val">10km+</span>
                <span className="hero-preview__weather-desc">Visibility</span>
              </div>
              <div className="hero-preview__weather-item">
                <span className="hero-preview__weather-icon">☀️</span>
                <span className="hero-preview__weather-val">15°C</span>
                <span className="hero-preview__weather-desc">Temperature</span>
              </div>
              <div className="hero-preview__weather-item hero-preview__weather-item--go">
                <span className="hero-preview__weather-icon">✓</span>
                <span className="hero-preview__weather-val">VFR</span>
                <span className="hero-preview__weather-desc">Conditions</span>
              </div>
            </div>
          </div>
          <div className="hero-preview__metar-content">
            <span className="hero-preview__label">Conditions: Favorable</span>
            <h1>Perfect Day<br /><span className="hero-preview__accent">To Fly</span></h1>
            <p>Learn to read the weather like a professional pilot</p>
            <button className="hero-preview__btn">Check Availability</button>
          </div>
        </div>
      )}

      {/* HERO 28: Brutalist Bold - Raw typography power */}
      {variation === 28 && (
        <div className="hero-preview__brutalist">
          <div className="hero-preview__brutalist-bg">
            <span className="hero-preview__brutalist-watermark">PPL</span>
          </div>
          <div className="hero-preview__brutalist-content">
            <div className="hero-preview__brutalist-stack">
              <span className="hero-preview__brutalist-line hero-preview__brutalist-line--1">LEARN</span>
              <span className="hero-preview__brutalist-line hero-preview__brutalist-line--2">TO</span>
              <span className="hero-preview__brutalist-line hero-preview__brutalist-line--3">FLY</span>
            </div>
            <div className="hero-preview__brutalist-meta">
              <span>HELICOPTERS</span>
              <span>SINCE 2010</span>
              <span>DENHAM UK</span>
            </div>
            <button className="hero-preview__btn hero-preview__btn--brutalist">START NOW →</button>
          </div>
        </div>
      )}

      {/* HERO 29: Polaroid Memory - Scattered photo aesthetic */}
      {variation === 29 && (
        <div className="hero-preview__polaroid">
          <div className="hero-preview__polaroid-scatter">
            <div className="hero-preview__polaroid-photo hero-preview__polaroid-photo--1" style={{ transform: 'rotate(-8deg)' }}>
              <img src="/assets/images/gallery/carousel/rotating1.jpg" alt="Memory 1" />
              <span>First Hover</span>
            </div>
            <div className="hero-preview__polaroid-photo hero-preview__polaroid-photo--2" style={{ transform: 'rotate(5deg)' }}>
              <img src="/assets/images/gallery/carousel/rotating2.jpg" alt="Memory 2" />
              <span>Solo Day!</span>
            </div>
            <div className="hero-preview__polaroid-photo hero-preview__polaroid-photo--3" style={{ transform: 'rotate(-3deg)' }}>
              <img src="/assets/images/gallery/events/img_2199.jpg" alt="Memory 3" />
              <span>License Day</span>
            </div>
          </div>
          <div className="hero-preview__polaroid-content">
            <span className="hero-preview__label">Capture Every Moment</span>
            <h1>Memories<br /><span className="hero-preview__accent">In The Making</span></h1>
            <p>Your PPL journey will be filled with unforgettable moments</p>
            <button className="hero-preview__btn">Create Yours</button>
          </div>
        </div>
      )}

      {/* HERO 30: Testimonial Hero - Student quote focus */}
      {variation === 30 && (
        <div className="hero-preview__testimonial-hero">
          <div className="hero-preview__testimonial-bg">
            <img src="/assets/images/gallery/carousel/rotating8.jpg" alt="Background" />
          </div>
          <div className="hero-preview__testimonial-content">
            <div className="hero-preview__quote-mark">"</div>
            <blockquote className="hero-preview__testimonial-quote">
              The training at HQ was exceptional. Quentin and the team made me feel confident from day one.
              I got my license in just 8 months while working full-time.
            </blockquote>
            <div className="hero-preview__testimonial-author">
              <div className="hero-preview__author-avatar">JM</div>
              <div className="hero-preview__author-info">
                <strong>James Mitchell</strong>
                <span>PPL(H) Graduate, 2023</span>
              </div>
            </div>
            <div className="hero-preview__testimonial-cta">
              <span>Ready to write your success story?</span>
              <button className="hero-preview__btn">Start Training</button>
            </div>
          </div>
        </div>
      )}

      {/* Variations 31-40: Additional unique designs */}
      {variation >= 31 && variation <= 40 && (
        <div className="hero-preview__dynamic" style={{
          background: variation % 2 === 0 ? '#1a1a1a' : 'linear-gradient(135deg, #faf9f6 0%, #e8e6e2 100%)',
          color: variation % 2 === 0 ? '#fff' : '#1a1a1a'
        }}>
          <img src={`/assets/images/gallery/carousel/rotating${(variation % 8) + 1}.jpg`} alt="Hero" className="hero-preview__dynamic-bg" />
          <div className="hero-preview__dynamic-overlay"></div>
          <div className="hero-preview__dynamic-content">
            <span className="hero-preview__label">Variation {variation}</span>
            <h1>{componentVariations.heroes[variation - 1]?.name}</h1>
            <p>{componentVariations.heroes[variation - 1]?.style}</p>
            <button className="hero-preview__btn">Explore</button>
          </div>
        </div>
      )}

      {/* HERO 41: Split Text Reveal - Gradient headline pattern */}
      {variation === 41 && (
        <div className="hero-preview__v41">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v41-overlay"></div>
          <div className="hero-preview__v41-content">
            <span className="hero-preview__v41-label">PRIVATE PILOT LICENSE</span>
            <div className="hero-preview__v41-split">
              <span className="hero-preview__v41-word hero-preview__v41-word--1">YOUR</span>
              <span className="hero-preview__v41-word hero-preview__v41-word--2">WINGS</span>
              <span className="hero-preview__v41-word hero-preview__v41-word--3">AWAIT</span>
            </div>
            <p className="hero-preview__v41-sub">Begin your journey into the extraordinary world of rotary flight</p>
            <button className="hero-preview__v41-btn">START TRAINING</button>
          </div>
          <style>{`
            .hero-preview__v41 { position: relative; min-height: 500px; overflow: hidden; }
            .hero-preview__v41-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(250,249,246,0.92) 0%, rgba(250,249,246,0.85) 100%); }
            .hero-preview__v41-content { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 500px; text-align: center; padding: 2rem; }
            .hero-preview__v41-label { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-bottom: 1.5rem; }
            .hero-preview__v41-split { display: flex; flex-direction: column; gap: 0.25rem; line-height: 1; }
            .hero-preview__v41-word { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(2.5rem, 6vw, 4.5rem); letter-spacing: -0.02em; text-transform: uppercase; }
            .hero-preview__v41-word--1 { color: #1a1a1a; }
            .hero-preview__v41-word--2 { color: #4a4a4a; }
            .hero-preview__v41-word--3 { color: #7a7a7a; }
            .hero-preview__v41-sub { font-size: 1.1rem; color: #666; line-height: 1.8; margin: 1.5rem 0; max-width: 400px; }
            .hero-preview__v41-btn { background: #1a1a1a; color: #fff; padding: 1rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
            .hero-preview__v41-btn:hover { background: #333; }
          `}</style>
        </div>
      )}

      {/* HERO 42: Coordinates Badge - Technical aviation aesthetic */}
      {variation === 42 && (
        <div className="hero-preview__v42">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v42-overlay"></div>
          <div className="hero-preview__v42-content">
            <div className="hero-preview__v42-coords">
              <span className="hero-preview__v42-coord">51.5751°N</span>
              <span className="hero-preview__v42-divider"></span>
              <span className="hero-preview__v42-coord">0.5059°W</span>
            </div>
            <span className="hero-preview__v42-icao">EGLD • DENHAM AERODROME</span>
            <h1 className="hero-preview__v42-title">
              <span>PPL(H)</span>
              <span>TRAINING</span>
            </h1>
            <p className="hero-preview__v42-sub">Your coordinates for becoming a helicopter pilot</p>
            <button className="hero-preview__v42-btn">SET DESTINATION</button>
          </div>
          <style>{`
            .hero-preview__v42 { position: relative; min-height: 500px; overflow: hidden; background: #1a1a1a; }
            .hero-preview__v42-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(26,26,26,0.75) 100%); }
            .hero-preview__v42-content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 500px; color: #fff; padding: 3rem; text-align: center; }
            .hero-preview__v42-coords { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 0.5rem; }
            .hero-preview__v42-coord { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; color: #999; }
            .hero-preview__v42-divider { width: 1px; height: 40px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent); }
            .hero-preview__v42-icao { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-bottom: 2rem; }
            .hero-preview__v42-title { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
            .hero-preview__v42-title span { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; letter-spacing: -0.02em; text-transform: uppercase; line-height: 1; }
            .hero-preview__v42-title span:first-child { color: #fff; }
            .hero-preview__v42-title span:last-child { color: rgba(255,255,255,0.5); }
            .hero-preview__v42-sub { font-size: 1.1rem; color: rgba(255,255,255,0.5); line-height: 1.8; margin-bottom: 2rem; }
            .hero-preview__v42-btn { background: #fff; color: #1a1a1a; padding: 1rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
            .hero-preview__v42-btn:hover { background: #e8e6e2; }
          `}</style>
        </div>
      )}

      {/* HERO 43: Split Layout with Boarding Pass */}
      {variation === 43 && (
        <div className="hero-preview__v43">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v43-overlay"></div>
          <div className="hero-preview__v43-content">
            <div className="hero-preview__v43-left">
              <span className="hero-preview__v43-label">PPL(H) TRAINING</span>
              <div className="hero-preview__v43-stack">
                <span className="hero-preview__v43-line hero-preview__v43-line--1">LEARN</span>
                <span className="hero-preview__v43-line hero-preview__v43-line--2">TO</span>
                <span className="hero-preview__v43-line hero-preview__v43-line--3">FLY</span>
              </div>
              <p className="hero-preview__v43-sub">The journey of a lifetime starts with a single lesson. Master the art of helicopter flight with expert instructors.</p>
            </div>
          </div>
          <div className="hero-preview__v43-ticket">
            <div className="hero-preview__v43-stub">
              <span className="hero-preview__v43-type">BOARDING PASS</span>
              <span className="hero-preview__v43-class">PPL(H)</span>
            </div>
            <div className="hero-preview__v43-main">
              <div className="hero-preview__v43-route">
                <div className="hero-preview__v43-from">
                  <span className="hero-preview__v43-code">STUDENT</span>
                  <span className="hero-preview__v43-city">Beginner</span>
                </div>
                <div className="hero-preview__v43-arrow">→</div>
                <div className="hero-preview__v43-to">
                  <span className="hero-preview__v43-code">PILOT</span>
                  <span className="hero-preview__v43-city">Licensed</span>
                </div>
              </div>
              <div className="hero-preview__v43-details">
                <div><span className="hero-preview__v43-lbl">FLIGHT TIME</span><span>45+ Hours</span></div>
                <div><span className="hero-preview__v43-lbl">GATE</span><span>EGLD</span></div>
                <div><span className="hero-preview__v43-lbl">SEAT</span><span>1A</span></div>
              </div>
            </div>
            <button className="hero-preview__v43-btn">CLAIM YOUR SEAT</button>
          </div>
          <style>{`
            .hero-preview__v43 { position: relative; min-height: 600px; overflow: hidden; display: flex; flex-direction: column; }
            .hero-preview__v43-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.9) 50%, rgba(250,249,246,0.3) 100%); }
            .hero-preview__v43-content { position: relative; z-index: 2; flex: 1; padding: 3rem 3rem 1rem; display: flex; align-items: center; }
            .hero-preview__v43-left { max-width: 50%; }
            .hero-preview__v43-label { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1.5rem; }
            .hero-preview__v43-stack { display: flex; flex-direction: column; line-height: 1; margin-bottom: 1.5rem; }
            .hero-preview__v43-line { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(2.5rem, 6vw, 4.5rem); letter-spacing: -0.02em; text-transform: uppercase; }
            .hero-preview__v43-line--1 { color: #1a1a1a; }
            .hero-preview__v43-line--2 { color: #4a4a4a; }
            .hero-preview__v43-line--3 { color: #7a7a7a; }
            .hero-preview__v43-sub { font-size: 1.1rem; color: #666; line-height: 1.8; max-width: 400px; }
            .hero-preview__v43-ticket { position: relative; z-index: 2; display: flex; align-items: stretch; background: #fff; max-width: 550px; margin: 0 3rem 2rem; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border: 1px solid #e8e6e2; }
            .hero-preview__v43-stub { background: #1a1a1a; color: #fff; padding: 1.25rem 0.75rem; writing-mode: vertical-rl; text-orientation: mixed; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; }
            .hero-preview__v43-type { font-family: 'Space Grotesk', sans-serif; font-size: 0.55rem; letter-spacing: 0.15em; opacity: 0.5; }
            .hero-preview__v43-class { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 700; letter-spacing: 0.1em; }
            .hero-preview__v43-main { flex: 1; padding: 1.25rem; color: #1a1a1a; display: flex; flex-direction: column; justify-content: center; }
            .hero-preview__v43-route { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
            .hero-preview__v43-from, .hero-preview__v43-to { text-align: center; }
            .hero-preview__v43-code { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; }
            .hero-preview__v43-city { font-size: 0.65rem; color: #666; }
            .hero-preview__v43-arrow { font-size: 1.25rem; color: #999; }
            .hero-preview__v43-details { display: flex; gap: 1.5rem; border-top: 1px dashed #e8e6e2; padding-top: 0.75rem; }
            .hero-preview__v43-lbl { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.55rem; color: #999; letter-spacing: 0.1em; margin-bottom: 0.2rem; }
            .hero-preview__v43-details > div > span:not(.hero-preview__v43-lbl) { font-family: 'Share Tech Mono', monospace; font-weight: 600; font-size: 0.8rem; }
            .hero-preview__v43-btn { background: #1a1a1a; color: #fff; padding: 1.25rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; white-space: nowrap; }
            .hero-preview__v43-btn:hover { background: #333; }
          `}</style>
        </div>
      )}

      {/* HERO 44: Technical Monospace - Share Tech Mono focused */}
      {variation === 44 && (
        <div className="hero-preview__v44">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v44-overlay"></div>
          <div className="hero-preview__v44-content">
            <div className="hero-preview__v44-data">
              <span>ALT: 2,500FT</span>
              <span>HDG: 270°</span>
              <span>IAS: 95KTS</span>
            </div>
            <div className="hero-preview__v44-main">
              <span className="hero-preview__v44-label">TRAINING PROGRAM INITIALIZED</span>
              <h1 className="hero-preview__v44-title">
                <span>PPL(H)</span>
                <span>COURSE</span>
              </h1>
              <div className="hero-preview__v44-specs">
                <div><span className="hero-preview__v44-num">45</span><span className="hero-preview__v44-unit">MIN HOURS</span></div>
                <div><span className="hero-preview__v44-num">09</span><span className="hero-preview__v44-unit">EXAMS</span></div>
                <div><span className="hero-preview__v44-num">01</span><span className="hero-preview__v44-unit">LICENSE</span></div>
              </div>
            </div>
            <button className="hero-preview__v44-btn">EXECUTE TRAINING</button>
          </div>
          <style>{`
            .hero-preview__v44 { position: relative; min-height: 500px; overflow: hidden; background: #1a1a1a; }
            .hero-preview__v44-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(26,26,26,0.9) 0%, rgba(26,26,26,0.8) 100%); }
            .hero-preview__v44-content { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 500px; color: #fff; padding: 3rem; text-align: center; }
            .hero-preview__v44-data { display: flex; gap: 2rem; margin-bottom: 2rem; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; color: #999; }
            .hero-preview__v44-main { margin-bottom: 2rem; }
            .hero-preview__v44-label { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1rem; }
            .hero-preview__v44-title { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1.5rem; }
            .hero-preview__v44-title span { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; letter-spacing: -0.02em; text-transform: uppercase; line-height: 1; }
            .hero-preview__v44-title span:first-child { color: #fff; }
            .hero-preview__v44-title span:last-child { color: rgba(255,255,255,0.5); }
            .hero-preview__v44-specs { display: flex; gap: 3rem; justify-content: center; padding: 1.5rem 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
            .hero-preview__v44-num { display: block; font-family: 'Share Tech Mono', monospace; font-size: 2rem; color: #fff; }
            .hero-preview__v44-unit { font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; letter-spacing: 0.1em; color: #999; }
            .hero-preview__v44-btn { background: #fff; color: #1a1a1a; padding: 1rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
            .hero-preview__v44-btn:hover { background: #e8e6e2; }
          `}</style>
        </div>
      )}

      {/* HERO 45: Floating Stats - Staggered stat cards */}
      {variation === 45 && (
        <div className="hero-preview__v45">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v45-overlay"></div>
          <div className="hero-preview__v45-content">
            <div className="hero-preview__v45-text">
              <span className="hero-preview__v45-label">PRIVATE PILOT LICENSE</span>
              <h1 className="hero-preview__v45-title">
                <span>YOUR</span>
                <span>FLIGHT</span>
                <span>BEGINS</span>
              </h1>
              <button className="hero-preview__v45-btn">GET STARTED</button>
            </div>
            <div className="hero-preview__v45-stats">
              <div className="hero-preview__v45-stat hero-preview__v45-stat--1">
                <span className="hero-preview__v45-num">45</span>
                <span className="hero-preview__v45-unit">MIN HOURS</span>
              </div>
              <div className="hero-preview__v45-stat hero-preview__v45-stat--2">
                <span className="hero-preview__v45-num">09</span>
                <span className="hero-preview__v45-unit">EXAMS</span>
              </div>
              <div className="hero-preview__v45-stat hero-preview__v45-stat--3">
                <span className="hero-preview__v45-num">6-12</span>
                <span className="hero-preview__v45-unit">MONTHS</span>
              </div>
            </div>
          </div>
          <style>{`
            .hero-preview__v45 { position: relative; min-height: 500px; overflow: hidden; }
            .hero-preview__v45-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(250,249,246,0.95) 0%, rgba(250,249,246,0.85) 60%, rgba(250,249,246,0.6) 100%); }
            .hero-preview__v45-content { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center; min-height: 500px; padding: 3rem; }
            .hero-preview__v45-label { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; display: block; margin-bottom: 1rem; }
            .hero-preview__v45-title { display: flex; flex-direction: column; line-height: 1; margin-bottom: 2rem; }
            .hero-preview__v45-title span { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: -0.02em; text-transform: uppercase; }
            .hero-preview__v45-title span:nth-child(1) { color: #1a1a1a; }
            .hero-preview__v45-title span:nth-child(2) { color: #4a4a4a; }
            .hero-preview__v45-title span:nth-child(3) { color: #7a7a7a; }
            .hero-preview__v45-btn { background: #1a1a1a; color: #fff; padding: 1rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
            .hero-preview__v45-btn:hover { background: #333; }
            .hero-preview__v45-stats { display: flex; flex-direction: column; gap: 0.75rem; }
            .hero-preview__v45-stat { background: #fff; border: 1px solid #e8e6e2; padding: 1.25rem 2rem; text-align: center; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
            .hero-preview__v45-stat:hover { transform: translateX(-10px); }
            .hero-preview__v45-stat--1 { transform: translateX(0); }
            .hero-preview__v45-stat--2 { transform: translateX(20px); }
            .hero-preview__v45-stat--3 { transform: translateX(40px); }
            .hero-preview__v45-num { display: block; font-family: 'Share Tech Mono', monospace; font-size: 2rem; color: #1a1a1a; }
            .hero-preview__v45-unit { font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; letter-spacing: 0.1em; color: #999; }
          `}</style>
        </div>
      )}

      {/* HERO 46: Corner Anchored - Grid layout */}
      {variation === 46 && (
        <div className="hero-preview__v46">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v46-overlay"></div>
          <div className="hero-preview__v46-content">
            <div className="hero-preview__v46-tl">
              <span className="hero-preview__v46-tag">PPL(H)</span>
            </div>
            <div className="hero-preview__v46-tr">
              <span className="hero-preview__v46-coords">51.5751°N / 0.5059°W</span>
            </div>
            <div className="hero-preview__v46-center">
              <h1>
                <span>LEARN</span>
                <span>TO</span>
                <span>FLY</span>
              </h1>
            </div>
            <div className="hero-preview__v46-bl">
              <span>HQ AVIATION</span>
              <span>DENHAM AERODROME</span>
              <span>EST. 2010</span>
            </div>
            <div className="hero-preview__v46-br">
              <button className="hero-preview__v46-btn">BOOK NOW</button>
            </div>
          </div>
          <style>{`
            .hero-preview__v46 { position: relative; min-height: 500px; overflow: hidden; }
            .hero-preview__v46-overlay { position: absolute; inset: 0; background: rgba(250,249,246,0.88); }
            .hero-preview__v46-content { position: relative; z-index: 2; display: grid; grid-template-rows: auto 1fr auto; grid-template-columns: 1fr 1fr; min-height: 500px; padding: 2rem; }
            .hero-preview__v46-tl { justify-self: start; }
            .hero-preview__v46-tag { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #1a1a1a; background: #e8e6e2; padding: 0.5rem 1rem; }
            .hero-preview__v46-tr { justify-self: end; }
            .hero-preview__v46-coords { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; color: #999; }
            .hero-preview__v46-center { grid-column: 1 / -1; display: flex; align-items: center; justify-content: center; }
            .hero-preview__v46-center h1 { display: flex; flex-direction: column; text-align: center; line-height: 1; }
            .hero-preview__v46-center h1 span { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; letter-spacing: -0.02em; text-transform: uppercase; }
            .hero-preview__v46-center h1 span:nth-child(1) { color: #1a1a1a; }
            .hero-preview__v46-center h1 span:nth-child(2) { color: #4a4a4a; }
            .hero-preview__v46-center h1 span:nth-child(3) { color: #7a7a7a; }
            .hero-preview__v46-bl { display: flex; flex-direction: column; gap: 0.25rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; }
            .hero-preview__v46-br { justify-self: end; align-self: end; }
            .hero-preview__v46-btn { background: #1a1a1a; color: #fff; padding: 1rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
            .hero-preview__v46-btn:hover { background: #333; }
          `}</style>
        </div>
      )}

      {/* HERO 47: Ticket Style - Boarding pass aesthetic */}
      {variation === 47 && (
        <div className="hero-preview__v47">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v47-overlay"></div>
          <div className="hero-preview__v47-ticket">
            <div className="hero-preview__v47-stub">
              <span className="hero-preview__v47-type">BOARDING PASS</span>
              <span className="hero-preview__v47-class">PPL(H)</span>
            </div>
            <div className="hero-preview__v47-main">
              <div className="hero-preview__v47-route">
                <div className="hero-preview__v47-from">
                  <span className="hero-preview__v47-code">STUDENT</span>
                  <span className="hero-preview__v47-city">Beginner</span>
                </div>
                <div className="hero-preview__v47-arrow">→</div>
                <div className="hero-preview__v47-to">
                  <span className="hero-preview__v47-code">PILOT</span>
                  <span className="hero-preview__v47-city">Licensed</span>
                </div>
              </div>
              <div className="hero-preview__v47-details">
                <div><span className="hero-preview__v47-lbl">FLIGHT TIME</span><span>45+ Hours</span></div>
                <div><span className="hero-preview__v47-lbl">GATE</span><span>EGLD</span></div>
                <div><span className="hero-preview__v47-lbl">SEAT</span><span>1A</span></div>
              </div>
            </div>
          </div>
          <div className="hero-preview__v47-cta">
            <p>Ready for takeoff?</p>
            <button className="hero-preview__v47-btn">CLAIM YOUR SEAT</button>
          </div>
          <style>{`
            .hero-preview__v47 { position: relative; min-height: 500px; overflow: hidden; background: #1a1a1a; }
            .hero-preview__v47-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.85) 100%); }
            .hero-preview__v47-ticket { position: relative; z-index: 2; display: flex; background: #faf9f6; max-width: 500px; margin: 3rem auto 1.5rem; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
            .hero-preview__v47-stub { background: #1a1a1a; color: #fff; padding: 1.5rem 1rem; writing-mode: vertical-rl; text-orientation: mixed; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
            .hero-preview__v47-type { font-family: 'Space Grotesk', sans-serif; font-size: 0.6rem; letter-spacing: 0.15em; opacity: 0.5; }
            .hero-preview__v47-class { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; letter-spacing: 0.1em; }
            .hero-preview__v47-main { flex: 1; padding: 1.5rem; color: #1a1a1a; }
            .hero-preview__v47-route { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
            .hero-preview__v47-from, .hero-preview__v47-to { text-align: center; }
            .hero-preview__v47-code { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 700; text-transform: uppercase; }
            .hero-preview__v47-city { font-size: 0.7rem; color: #666; }
            .hero-preview__v47-arrow { font-size: 1.5rem; color: #999; }
            .hero-preview__v47-details { display: flex; gap: 2rem; border-top: 1px dashed #e8e6e2; padding-top: 1rem; }
            .hero-preview__v47-lbl { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.6rem; color: #999; letter-spacing: 0.1em; margin-bottom: 0.25rem; }
            .hero-preview__v47-details > div > span:not(.hero-preview__v47-lbl) { font-family: 'Share Tech Mono', monospace; font-weight: 600; font-size: 0.85rem; }
            .hero-preview__v47-cta { position: relative; z-index: 2; text-align: center; color: #fff; }
            .hero-preview__v47-cta p { font-size: 1rem; margin-bottom: 1rem; color: rgba(255,255,255,0.5); }
            .hero-preview__v47-btn { background: #fff; color: #1a1a1a; padding: 1rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
            .hero-preview__v47-btn:hover { background: #e8e6e2; }
          `}</style>
        </div>
      )}

      {/* HERO 48: Centered Minimal - Clean gradient headline */}
      {variation === 48 && (
        <div className="hero-preview__v48">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v48-overlay"></div>
          <div className="hero-preview__v48-content">
            <span className="hero-preview__v48-label">PRIVATE PILOT LICENSE</span>
            <h1 className="hero-preview__v48-title">
              <span>THE</span>
              <span>JOURNEY</span>
              <span>BEGINS</span>
            </h1>
            <p className="hero-preview__v48-sub">Your gateway to the freedom of helicopter flight</p>
            <button className="hero-preview__v48-btn">DISCOVER MORE</button>
          </div>
          <style>{`
            .hero-preview__v48 { position: relative; min-height: 500px; overflow: hidden; }
            .hero-preview__v48-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(250,249,246,0.92) 0%, rgba(250,249,246,0.88) 100%); }
            .hero-preview__v48-content { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; min-height: 500px; padding: 3rem; }
            .hero-preview__v48-label { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-bottom: 1.5rem; }
            .hero-preview__v48-title { display: flex; flex-direction: column; line-height: 1; margin-bottom: 1.5rem; }
            .hero-preview__v48-title span { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; letter-spacing: -0.02em; text-transform: uppercase; }
            .hero-preview__v48-title span:nth-child(1) { color: #1a1a1a; }
            .hero-preview__v48-title span:nth-child(2) { color: #4a4a4a; }
            .hero-preview__v48-title span:nth-child(3) { color: #7a7a7a; }
            .hero-preview__v48-sub { font-size: 1.1rem; color: #666; line-height: 1.8; margin-bottom: 2rem; max-width: 400px; }
            .hero-preview__v48-btn { background: #1a1a1a; color: #fff; padding: 1rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
            .hero-preview__v48-btn:hover { background: #333; }
          `}</style>
        </div>
      )}

      {/* HERO 49: Minimalist Line - Accent divider */}
      {variation === 49 && (
        <div className="hero-preview__v49">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v49-overlay"></div>
          <div className="hero-preview__v49-content">
            <div className="hero-preview__v49-line"></div>
            <span className="hero-preview__v49-label">HQ AVIATION TRAINING</span>
            <h1 className="hero-preview__v49-title">PPL(H)</h1>
            <p className="hero-preview__v49-sub">Private Pilot License for Helicopters</p>
            <button className="hero-preview__v49-btn">LEARN MORE →</button>
          </div>
          <style>{`
            .hero-preview__v49 { position: relative; min-height: 500px; overflow: hidden; }
            .hero-preview__v49-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(26,26,26,0.6) 0%, rgba(26,26,26,0.75) 100%); }
            .hero-preview__v49-content { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; min-height: 500px; color: #fff; padding: 4rem; }
            .hero-preview__v49-line { width: 60px; height: 2px; background: #fff; margin-bottom: 1.5rem; }
            .hero-preview__v49-label { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem; }
            .hero-preview__v49-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(3rem, 8vw, 5rem); font-weight: 700; letter-spacing: -0.02em; text-transform: uppercase; margin-bottom: 0.5rem; }
            .hero-preview__v49-sub { font-size: 1.1rem; color: rgba(255,255,255,0.7); margin-bottom: 2rem; }
            .hero-preview__v49-btn { background: transparent; color: #fff; padding: 1rem 2rem; border: 1px solid rgba(255,255,255,0.3); font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
            .hero-preview__v49-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.5); }
          `}</style>
        </div>
      )}

      {/* HERO 50: Grid Overlay - Technical grid lines */}
      {variation === 50 && (
        <div className="hero-preview__v50">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v50-overlay"></div>
          <div className="hero-preview__v50-grid"></div>
          <div className="hero-preview__v50-content">
            <div className="hero-preview__v50-data">
              <span>ALT: 2,500FT</span>
              <span>HDG: 270°</span>
              <span>IAS: 95KTS</span>
            </div>
            <h1 className="hero-preview__v50-title">
              <span>PPL(H)</span>
              <span>TRAINING</span>
            </h1>
            <p className="hero-preview__v50-sub">Master the technical precision of rotary flight</p>
            <div className="hero-preview__v50-specs">
              <div><span className="hero-preview__v50-num">45</span><span>Min Hours</span></div>
              <div><span className="hero-preview__v50-num">09</span><span>Exams</span></div>
              <div><span className="hero-preview__v50-num">R22/R44</span><span>Fleet</span></div>
            </div>
            <button className="hero-preview__v50-btn">INITIALIZE</button>
          </div>
          <style>{`
            .hero-preview__v50 { position: relative; min-height: 500px; overflow: hidden; background: #1a1a1a; }
            .hero-preview__v50-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(26,26,26,0.9) 0%, rgba(26,26,26,0.8) 100%); }
            .hero-preview__v50-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 50px 50px; }
            .hero-preview__v50-content { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; min-height: 500px; color: #fff; padding: 3rem; }
            .hero-preview__v50-data { display: flex; gap: 2rem; margin-bottom: 1.5rem; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; color: #999; }
            .hero-preview__v50-title { display: flex; flex-direction: column; line-height: 1; margin-bottom: 1rem; }
            .hero-preview__v50-title span { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 700; letter-spacing: -0.02em; text-transform: uppercase; }
            .hero-preview__v50-title span:first-child { color: #fff; }
            .hero-preview__v50-title span:last-child { color: rgba(255,255,255,0.5); }
            .hero-preview__v50-sub { font-size: 1rem; color: rgba(255,255,255,0.5); margin-bottom: 1.5rem; }
            .hero-preview__v50-specs { display: flex; gap: 2rem; margin-bottom: 2rem; padding: 1rem 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
            .hero-preview__v50-specs > div { font-size: 0.7rem; color: rgba(255,255,255,0.5); }
            .hero-preview__v50-num { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; color: #fff; margin-bottom: 0.25rem; }
            .hero-preview__v50-btn { background: #fff; color: #1a1a1a; padding: 1rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; width: fit-content; }
            .hero-preview__v50-btn:hover { background: #e8e6e2; }
          `}</style>
        </div>
      )}

      {/* HERO 51: Circular Focus - Central image mask */}
      {variation === 51 && (
        <div className="hero-preview__v51">
          <div className="hero-preview__v51-bg">
            <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" />
          </div>
          <div className="hero-preview__v51-content">
            <span className="hero-preview__v51-label">PRIVATE PILOT LICENSE</span>
            <h1 className="hero-preview__v51-title">
              <span>FOCUS</span>
              <span>ON YOUR</span>
              <span>DREAMS</span>
            </h1>
            <p className="hero-preview__v51-sub">The world looks different from 2,500 feet</p>
            <button className="hero-preview__v51-btn">TAKE FLIGHT</button>
          </div>
          <style>{`
            .hero-preview__v51 { position: relative; min-height: 500px; overflow: hidden; background: #faf9f6; }
            .hero-preview__v51-bg { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 280px; height: 280px; border-radius: 50%; overflow: hidden; border: 1px solid #e8e6e2; box-shadow: 0 0 0 30px rgba(232,230,226,0.3), 0 0 0 60px rgba(232,230,226,0.15); }
            .hero-preview__v51-bg img { width: 100%; height: 100%; object-fit: cover; }
            .hero-preview__v51-content { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; min-height: 500px; padding: 2rem; }
            .hero-preview__v51-label { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-bottom: 1rem; }
            .hero-preview__v51-title { display: flex; flex-direction: column; line-height: 1; margin-bottom: 1rem; }
            .hero-preview__v51-title span { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; letter-spacing: -0.02em; text-transform: uppercase; }
            .hero-preview__v51-title span:nth-child(1) { color: #1a1a1a; }
            .hero-preview__v51-title span:nth-child(2) { color: #4a4a4a; }
            .hero-preview__v51-title span:nth-child(3) { color: #7a7a7a; }
            .hero-preview__v51-sub { font-size: 1rem; color: #666; margin-bottom: 1.5rem; }
            .hero-preview__v51-btn { background: #1a1a1a; color: #fff; padding: 1rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
            .hero-preview__v51-btn:hover { background: #333; }
          `}</style>
        </div>
      )}

      {/* HERO 52: Parallax Depth - Stacked cards */}
      {variation === 52 && (
        <div className="hero-preview__v52">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v52-overlay"></div>
          <div className="hero-preview__v52-cards">
            <div className="hero-preview__v52-card hero-preview__v52-card--1">
              <span className="hero-preview__v52-num">01</span>
              <h3>GROUND SCHOOL</h3>
              <p>Theory & Knowledge</p>
            </div>
            <div className="hero-preview__v52-card hero-preview__v52-card--2">
              <span className="hero-preview__v52-num">02</span>
              <h3>FLIGHT TRAINING</h3>
              <p>Hands-On Experience</p>
            </div>
            <div className="hero-preview__v52-card hero-preview__v52-card--3">
              <span className="hero-preview__v52-num">03</span>
              <h3>SKILLS TEST</h3>
              <p>Final Assessment</p>
            </div>
          </div>
          <div className="hero-preview__v52-content">
            <h1>PPL(H) JOURNEY</h1>
            <button className="hero-preview__v52-btn">START TODAY</button>
          </div>
          <style>{`
            .hero-preview__v52 { position: relative; min-height: 500px; overflow: hidden; }
            .hero-preview__v52-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(26,26,26,0.85) 0%, rgba(26,26,26,0.75) 100%); }
            .hero-preview__v52-cards { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; gap: 1rem; padding: 2rem; z-index: 2; }
            .hero-preview__v52-card { background: rgba(250,249,246,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; width: 140px; color: #fff; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
            .hero-preview__v52-card--1 { transform: translateY(-15px) rotate(-3deg); }
            .hero-preview__v52-card--2 { transform: translateY(0) scale(1.05); z-index: 3; background: rgba(250,249,246,0.1); }
            .hero-preview__v52-card--3 { transform: translateY(-15px) rotate(3deg); }
            .hero-preview__v52-num { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; color: #999; display: block; margin-bottom: 0.5rem; }
            .hero-preview__v52-card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
            .hero-preview__v52-card p { font-size: 0.7rem; color: rgba(255,255,255,0.5); }
            .hero-preview__v52-content { position: absolute; bottom: 3rem; left: 0; right: 0; text-align: center; z-index: 4; color: #fff; }
            .hero-preview__v52-content h1 { font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 1rem; }
            .hero-preview__v52-btn { background: #fff; color: #1a1a1a; padding: 1rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
            .hero-preview__v52-btn:hover { background: #e8e6e2; }
          `}</style>
        </div>
      )}

      {/* HERO 53: Stamp Collection - Aviation passport style */}
      {variation === 53 && (
        <div className="hero-preview__v53">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v53-overlay"></div>
          <div className="hero-preview__v53-content">
            <div className="hero-preview__v53-stamps">
              <div className="hero-preview__v53-stamp hero-preview__v53-stamp--1">
                <span>EGLD</span>
                <small>DENHAM</small>
              </div>
              <div className="hero-preview__v53-stamp hero-preview__v53-stamp--2">
                <span>PPL(H)</span>
                <small>APPROVED</small>
              </div>
              <div className="hero-preview__v53-stamp hero-preview__v53-stamp--3">
                <span>CAA</span>
                <small>CERTIFIED</small>
              </div>
            </div>
            <div className="hero-preview__v53-passport">
              <h1>
                <span>YOUR</span>
                <span>AVIATION</span>
                <span>PASSPORT</span>
              </h1>
              <p>Collect experiences, earn your wings</p>
              <button className="hero-preview__v53-btn">GET STAMPED</button>
            </div>
          </div>
          <style>{`
            .hero-preview__v53 { position: relative; min-height: 500px; overflow: hidden; background: #faf9f6; }
            .hero-preview__v53-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(250,249,246,0.95) 0%, rgba(250,249,246,0.85) 100%); }
            .hero-preview__v53-content { position: relative; z-index: 2; display: flex; min-height: 500px; padding: 3rem; align-items: center; justify-content: space-between; }
            .hero-preview__v53-stamps { display: flex; flex-direction: column; gap: 1rem; }
            .hero-preview__v53-stamp { width: 90px; height: 90px; border: 2px solid; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; transform: rotate(-10deg); }
            .hero-preview__v53-stamp--1 { border-color: #1a1a1a; color: #1a1a1a; }
            .hero-preview__v53-stamp--2 { border-color: #4a4a4a; color: #4a4a4a; transform: rotate(5deg) translateX(30px); }
            .hero-preview__v53-stamp--3 { border-color: #7a7a7a; color: #7a7a7a; transform: rotate(-5deg); }
            .hero-preview__v53-stamp span { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 0.9rem; letter-spacing: 0.05em; }
            .hero-preview__v53-stamp small { font-family: 'Space Grotesk', sans-serif; font-size: 0.55rem; letter-spacing: 0.1em; }
            .hero-preview__v53-passport { text-align: right; }
            .hero-preview__v53-passport h1 { display: flex; flex-direction: column; line-height: 1; margin-bottom: 1rem; }
            .hero-preview__v53-passport h1 span { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; letter-spacing: -0.02em; text-transform: uppercase; }
            .hero-preview__v53-passport h1 span:nth-child(1) { color: #1a1a1a; }
            .hero-preview__v53-passport h1 span:nth-child(2) { color: #4a4a4a; }
            .hero-preview__v53-passport h1 span:nth-child(3) { color: #7a7a7a; }
            .hero-preview__v53-passport p { font-size: 1rem; color: #666; margin-bottom: 1.5rem; }
            .hero-preview__v53-btn { background: #1a1a1a; color: #fff; padding: 1rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
            .hero-preview__v53-btn:hover { background: #333; }
          `}</style>
        </div>
      )}

      {/* HERO 54: Progress Bar Hero - Training visualization */}
      {variation === 54 && (
        <div className="hero-preview__v54">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v54-overlay"></div>
          <div className="hero-preview__v54-content">
            <span className="hero-preview__v54-label">YOUR PROGRESS TRACKER</span>
            <h1 className="hero-preview__v54-title">PPL(H) TRAINING</h1>
            <div className="hero-preview__v54-progress">
              <div className="hero-preview__v54-bar">
                <span className="hero-preview__v54-bar-label">Ground School</span>
                <div className="hero-preview__v54-track"><div className="hero-preview__v54-fill" style={{ width: '0%' }}></div></div>
                <span className="hero-preview__v54-percent">0%</span>
              </div>
              <div className="hero-preview__v54-bar">
                <span className="hero-preview__v54-bar-label">Flight Hours</span>
                <div className="hero-preview__v54-track"><div className="hero-preview__v54-fill" style={{ width: '0%' }}></div></div>
                <span className="hero-preview__v54-percent">0/45</span>
              </div>
              <div className="hero-preview__v54-bar">
                <span className="hero-preview__v54-bar-label">Exams Passed</span>
                <div className="hero-preview__v54-track"><div className="hero-preview__v54-fill" style={{ width: '0%' }}></div></div>
                <span className="hero-preview__v54-percent">0/9</span>
              </div>
            </div>
            <button className="hero-preview__v54-btn">BEGIN YOUR JOURNEY</button>
          </div>
          <style>{`
            .hero-preview__v54 { position: relative; min-height: 500px; overflow: hidden; }
            .hero-preview__v54-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(26,26,26,0.8) 0%, rgba(26,26,26,0.85) 100%); }
            .hero-preview__v54-content { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; min-height: 500px; color: #fff; padding: 3rem; }
            .hero-preview__v54-label { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem; }
            .hero-preview__v54-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; letter-spacing: -0.02em; text-transform: uppercase; margin-bottom: 2rem; }
            .hero-preview__v54-progress { width: 100%; max-width: 400px; margin-bottom: 2rem; }
            .hero-preview__v54-bar { display: grid; grid-template-columns: 100px 1fr 50px; align-items: center; gap: 1rem; margin-bottom: 1rem; }
            .hero-preview__v54-bar-label { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; text-align: left; color: rgba(255,255,255,0.5); }
            .hero-preview__v54-track { height: 6px; background: rgba(255,255,255,0.1); overflow: hidden; }
            .hero-preview__v54-fill { height: 100%; background: #fff; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }
            .hero-preview__v54-percent { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; text-align: right; color: rgba(255,255,255,0.7); }
            .hero-preview__v54-btn { background: #fff; color: #1a1a1a; padding: 1rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
            .hero-preview__v54-btn:hover { background: #e8e6e2; }
          `}</style>
        </div>
      )}

      {/* HERO 55: Editorial Layout - Magazine style */}
      {variation === 55 && (
        <div className="hero-preview__v55">
          <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Scenic flight" className="hero-preview__bg-image" />
          <div className="hero-preview__v55-overlay"></div>
          <div className="hero-preview__v55-content">
            <span className="hero-preview__v55-issue">VOL. 35 — SINCE 2010</span>
            <h1 className="hero-preview__v55-title">
              <span>THE</span>
              <span>ART OF</span>
              <span>FLIGHT</span>
            </h1>
            <div className="hero-preview__v55-divider"></div>
            <p className="hero-preview__v55-sub">A comprehensive guide to earning your Private Pilot License</p>
            <div className="hero-preview__v55-meta">
              <span>HQ AVIATION</span>
              <span>•</span>
              <span>DENHAM AERODROME</span>
              <span>•</span>
              <span>UNITED KINGDOM</span>
            </div>
            <button className="hero-preview__v55-btn">READ THE GUIDE</button>
          </div>
          <style>{`
            .hero-preview__v55 { position: relative; min-height: 500px; overflow: hidden; }
            .hero-preview__v55-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(250,249,246,0.92) 0%, rgba(250,249,246,0.88) 100%); }
            .hero-preview__v55-content { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; min-height: 500px; padding: 3rem; }
            .hero-preview__v55-issue { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; color: #999; margin-bottom: 1.5rem; }
            .hero-preview__v55-title { display: flex; flex-direction: column; line-height: 1; margin-bottom: 1.5rem; }
            .hero-preview__v55-title span { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 6vw, 4rem); font-weight: 700; letter-spacing: -0.02em; text-transform: uppercase; }
            .hero-preview__v55-title span:nth-child(1) { color: #1a1a1a; }
            .hero-preview__v55-title span:nth-child(2) { color: #4a4a4a; }
            .hero-preview__v55-title span:nth-child(3) { color: #7a7a7a; }
            .hero-preview__v55-divider { width: 60px; height: 1px; background: linear-gradient(to right, transparent, #1a1a1a, transparent); margin-bottom: 1.5rem; }
            .hero-preview__v55-sub { font-size: 1rem; color: #666; line-height: 1.8; margin-bottom: 1rem; max-width: 400px; }
            .hero-preview__v55-meta { display: flex; gap: 0.75rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; letter-spacing: 0.1em; color: #999; margin-bottom: 2rem; }
            .hero-preview__v55-btn { background: #1a1a1a; color: #fff; padding: 1rem 2rem; border: none; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
            .hero-preview__v55-btn:hover { background: #333; }
          `}</style>
        </div>
      )}
    </div>
  );
}

// ============================================
// INTRO COMPONENTS (simplified for brevity)
// ============================================

function IntroComponent({ variation }) {
  return (
    <div className={`intro-preview intro-preview--v${variation}`}>
      <div className="intro-preview__content">
        {variation === 1 && (
          <div className="intro-preview__two-col">
            <div className="intro-preview__text">
              <span className="intro-preview__number">01</span>
              <h2>The PPL(H) is Your Gateway</h2>
              <p>Whether you dream of weekend adventures or visiting friends across the country, this is where it all begins.</p>
            </div>
            <div className="intro-preview__image">
              <img src="/assets/images/gallery/carousel/rotating1.jpg" alt="Helicopter flying" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            </div>
          </div>
        )}

        {variation === 2 && (
          <div className="intro-preview__story">
            <h2>Your Aviation Journey Starts Here</h2>
            <p>At HQ Aviation, we've been training pilots since 2010. Our structured approach ensures you receive the highest quality training.</p>
            <img src="/assets/images/facility/hq-0254.jpg" alt="HQ Facility" className="intro-preview__inline-img" />
            <p>Based at Denham Aerodrome, we offer an ideal training environment with excellent facilities.</p>
          </div>
        )}

        {variation >= 3 && variation <= 10 && (
          <div className="intro-preview__generic">
            <span className="intro-preview__number">01</span>
            <h2>Introduction Variation {variation}</h2>
            <p className="intro-preview__style-note">Style: {componentVariations.intros[variation - 1]?.style}</p>
            <p>Content preview for this introduction style...</p>
          </div>
        )}

        {variation === 11 && (
          <div className="intro-preview__photo-essay">
            <div className="intro-preview__essay-images">
              <img src="/assets/images/gallery/carousel/rotating2.jpg" alt="Training" />
              <img src="/assets/images/gallery/carousel/rotating-3.jpg" alt="Flight" />
              <img src="/assets/images/gallery/carousel/rotating-4.jpg" alt="Success" />
            </div>
            <p className="intro-preview__essay-caption">Every pilot's journey is unique. Yours begins with a single lesson.</p>
          </div>
        )}

        {variation === 12 && (
          <div className="intro-preview__instructor-bio">
            <img src="/assets/images/team/quentin-smith-profile-picture-2.jpg" alt="Quentin Smith" className="intro-preview__bio-image" />
            <div className="intro-preview__bio-text">
              <h2>Meet Your Instructor</h2>
              <h3>Quentin Smith</h3>
              <p>World Helicopter Champion, polar expedition pilot, and founder of HQ Aviation. With over 15,000 flight hours and three decades of experience, you'll learn from one of the best in the world.</p>
              <div className="intro-preview__bio-credentials">
                <span>World Aerobatic Champion</span>
                <span>South Pole by Helicopter</span>
                <span>CAA Examiner</span>
              </div>
            </div>
          </div>
        )}

        {variation === 13 && (
          <div className="intro-preview__pillars">
            <h2>Our Training Philosophy</h2>
            <div className="intro-preview__pillars-grid">
              <div className="intro-preview__pillar">
                <span className="intro-preview__pillar-icon">🛡️</span>
                <h3>Safety First</h3>
                <p>Rigorous safety standards in everything we do</p>
              </div>
              <div className="intro-preview__pillar">
                <span className="intro-preview__pillar-icon">🎯</span>
                <h3>Skill Mastery</h3>
                <p>Build confidence through structured progression</p>
              </div>
              <div className="intro-preview__pillar">
                <span className="intro-preview__pillar-icon">🚁</span>
                <h3>Freedom Awaits</h3>
                <p>Open doors to a lifetime of adventure</p>
              </div>
            </div>
          </div>
        )}

        {variation >= 14 && variation <= 20 && (
          <div className="intro-preview__styled">
            <div className="intro-preview__styled-header">
              <span className="intro-preview__number">{String(variation - 10).padStart(2, '0')}</span>
              <h2>{componentVariations.intros[variation - 1]?.name}</h2>
            </div>
            <p className="intro-preview__style-note">{componentVariations.intros[variation - 1]?.style}</p>
            <div className="intro-preview__styled-content">
              <img src="/assets/images/facility/main-sales-pic-1.jpg" alt="HQ Aviation" className="intro-preview__styled-image" />
              <p>The Private Pilot License (Helicopters) is your first step into the world of rotary flight. At HQ Aviation, we combine decades of experience with modern training methods.</p>
            </div>
          </div>
        )}

        {/* NEW: Instructor Network - Quentin with animated lines to team */}
        {variation === 21 && (
          <div className="intro-preview__instructor-network">
            <div className="intro-preview__network-header">
              <span className="intro-preview__label">World-Class Training</span>
              <h2>Training Under <span className="intro-preview__accent">Extraordinary</span> Instructors</h2>
              <p className="intro-preview__network-tagline">
                If the quality of instructing counts for anything—and it certainly does—you will learn at an exceptionally high standard,
                develop no bad habits, and become a better pilot at a much faster pace with our rigorous, hands-on training program.
              </p>
            </div>

            <div className="intro-preview__network-container">
              {/* Quentin at the center */}
              <div className="intro-preview__network-center">
                <div className="intro-preview__q-card">
                  <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="Quentin Smith" />
                  <div className="intro-preview__q-info">
                    <h3>Quentin Smith</h3>
                    <span className="intro-preview__q-title">Founder & Chief Instructor</span>
                    <div className="intro-preview__q-stats">
                      <span><strong>18,000+</strong> Instructing Hours</span>
                      <span><strong>15+</strong> Years Dedicated to Teaching</span>
                    </div>
                    <p className="intro-preview__q-dedication">
                      Quentin has dedicated his life to teaching pilots to fly to the highest possible standard.
                      Every instructor at HQ has been trained by him, carrying forward the same philosophy of excellence.
                    </p>
                  </div>
                </div>

                {/* Animated connection lines */}
                <svg className="intro-preview__network-lines" viewBox="0 0 800 400">
                  <line className="intro-preview__network-line intro-preview__network-line--1" x1="400" y1="200" x2="100" y2="350" />
                  <line className="intro-preview__network-line intro-preview__network-line--2" x1="400" y1="200" x2="280" y2="370" />
                  <line className="intro-preview__network-line intro-preview__network-line--3" x1="400" y1="200" x2="520" y2="370" />
                  <line className="intro-preview__network-line intro-preview__network-line--4" x1="400" y1="200" x2="700" y2="350" />
                </svg>
              </div>

              {/* Instructors grid below */}
              <div className="intro-preview__team-grid">
                <h4 className="intro-preview__meet-team">Meet the Instructors Q Trained</h4>
                <div className="intro-preview__instructors">
                  <div className="intro-preview__instructor-card">
                    <div className="intro-preview__instructor-avatar">👨‍✈️</div>
                    <span>Senior FI</span>
                    <small>Same Philosophy</small>
                  </div>
                  <div className="intro-preview__instructor-card">
                    <div className="intro-preview__instructor-avatar">👨‍✈️</div>
                    <span>Flight Instructor</span>
                    <small>Q's Methods</small>
                  </div>
                  <div className="intro-preview__instructor-card">
                    <div className="intro-preview__instructor-avatar">👨‍✈️</div>
                    <span>Type Instructor</span>
                    <small>Excellence Standard</small>
                  </div>
                  <div className="intro-preview__instructor-card">
                    <div className="intro-preview__instructor-avatar">👨‍✈️</div>
                    <span>New FI</span>
                    <small>Fresh Training</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="intro-preview__network-promise">
              <p>
                Even if other instructors teach you, they benefit from the same mentality and rigorous standards—
                ensuring you receive consistent, world-class instruction every time you fly.
              </p>
            </div>
          </div>
        )}

        {/* INTRO 22: Why HQ - Three compelling reasons */}
        {variation === 22 && (
          <div className="intro-preview__why-hq">
            <div className="intro-preview__why-header">
              <span className="intro-preview__label">Why Train With Us?</span>
              <h2>Three Reasons to Choose <span className="intro-preview__accent">HQ Aviation</span></h2>
            </div>
            <div className="intro-preview__why-grid">
              <div className="intro-preview__why-card">
                <div className="intro-preview__why-number">01</div>
                <h3>World-Class Instructors</h3>
                <p>Learn from Quentin Smith, World Helicopter Champion and polar expedition pilot, alongside his handpicked team of experts.</p>
                <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="Instructor" />
              </div>
              <div className="intro-preview__why-card">
                <div className="intro-preview__why-number">02</div>
                <h3>Modern Fleet</h3>
                <p>Train on Robinson's finest - R22, R44, and the turbine R66. All meticulously maintained to the highest standards.</p>
                <img src="/assets/images/used-aircraft/r66/gold-on-pad.jpg" alt="Fleet" />
              </div>
              <div className="intro-preview__why-card">
                <div className="intro-preview__why-number">03</div>
                <h3>Proven Track Record</h3>
                <p>Since 2010, we've trained hundreds of successful pilots. Our graduates fly commercially, privately, and on expeditions worldwide.</p>
                <img src="/assets/images/gallery/events/img_2199.jpg" alt="Graduates" />
              </div>
            </div>
          </div>
        )}

        {/* INTRO 23: Heritage Timeline - Since 2010 */}
        {variation === 23 && (
          <div className="intro-preview__heritage">
            <div className="intro-preview__heritage-header">
              <span className="intro-preview__label">Our Story</span>
              <h2>Excellence Since <span className="intro-preview__accent">2010</span></h2>
            </div>
            <div className="intro-preview__heritage-timeline">
              <div className="intro-preview__heritage-item">
                <span className="intro-preview__heritage-year">2010</span>
                <div className="intro-preview__heritage-content">
                  <h4>HQ Aviation Founded</h4>
                  <p>Quentin Smith establishes HQ Aviation at Denham Aerodrome</p>
                </div>
              </div>
              <div className="intro-preview__heritage-item">
                <span className="intro-preview__heritage-year">2000</span>
                <div className="intro-preview__heritage-content">
                  <h4>Robinson Dealer</h4>
                  <p>Becomes official UK Robinson Helicopter dealer</p>
                </div>
              </div>
              <div className="intro-preview__heritage-item">
                <span className="intro-preview__heritage-year">2016</span>
                <div className="intro-preview__heritage-content">
                  <h4>South Pole Flight</h4>
                  <p>First helicopter flight to the South Pole and back</p>
                </div>
              </div>
              <div className="intro-preview__heritage-item">
                <span className="intro-preview__heritage-year">Today</span>
                <div className="intro-preview__heritage-content">
                  <h4>500+ Graduates</h4>
                  <p>Continuing to train the next generation of helicopter pilots</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INTRO 24: Stats Dashboard - Fast facts */}
        {variation === 24 && (
          <div className="intro-preview__stats-dashboard">
            <div className="intro-preview__stats-header">
              <h2>HQ Aviation <span className="intro-preview__accent">By The Numbers</span></h2>
            </div>
            <div className="intro-preview__stats-grid">
              <div className="intro-preview__stat-card intro-preview__stat-card--large">
                <span className="intro-preview__stat-num">34</span>
                <span className="intro-preview__stat-unit">Years</span>
                <span className="intro-preview__stat-desc">Training Excellence</span>
              </div>
              <div className="intro-preview__stat-card">
                <span className="intro-preview__stat-num">500+</span>
                <span className="intro-preview__stat-desc">Pilots Trained</span>
              </div>
              <div className="intro-preview__stat-card">
                <span className="intro-preview__stat-num">98%</span>
                <span className="intro-preview__stat-desc">Pass Rate</span>
              </div>
              <div className="intro-preview__stat-card">
                <span className="intro-preview__stat-num">18k+</span>
                <span className="intro-preview__stat-desc">Instructing Hours</span>
              </div>
              <div className="intro-preview__stat-card">
                <span className="intro-preview__stat-num">3</span>
                <span className="intro-preview__stat-desc">Aircraft Types</span>
              </div>
              <div className="intro-preview__stat-card intro-preview__stat-card--accent">
                <span className="intro-preview__stat-num">1</span>
                <span className="intro-preview__stat-desc">World Champion Instructor</span>
              </div>
            </div>
          </div>
        )}

        {/* INTRO 25: Letter from Q - Personal message */}
        {variation === 25 && (
          <div className="intro-preview__letter">
            <div className="intro-preview__letter-paper">
              <div className="intro-preview__letter-header">
                <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" className="intro-preview__letter-logo" />
              </div>
              <div className="intro-preview__letter-body">
                <p className="intro-preview__letter-greeting">Dear Future Pilot,</p>
                <p>
                  Learning to fly a helicopter is one of the most rewarding experiences you'll ever have.
                  I've dedicated over 15 years at HQ Aviation to teaching this incredible skill, and I can tell you—there's
                  nothing quite like the moment you first hover on your own.
                </p>
                <p>
                  At HQ Aviation, we don't just teach you to pass a test. We teach you to be a confident, skilled,
                  and safe pilot. Whether you want to fly for fun, travel, or pursue a career in aviation, we'll
                  give you the foundation you need.
                </p>
                <p>
                  Come visit us at Denham. Let's have a cup of tea and talk about your flying dreams.
                </p>
                <div className="intro-preview__letter-signature">
                  <span className="intro-preview__signature">Quentin Smith</span>
                  <small>Founder, HQ Aviation</small>
                </div>
              </div>
            </div>
            <div className="intro-preview__letter-photo">
              <img src="/assets/images/team/quentin-smith-profile-picture.jpg" alt="Quentin Smith" />
            </div>
          </div>
        )}

        {/* INTRO 26: Day One Preview - What to expect */}
        {variation === 26 && (
          <div className="intro-preview__day-one">
            <div className="intro-preview__day-header">
              <span className="intro-preview__label">Your First Lesson</span>
              <h2>What Happens on <span className="intro-preview__accent">Day One</span></h2>
            </div>
            <div className="intro-preview__day-timeline">
              <div className="intro-preview__day-step">
                <span className="intro-preview__day-time">09:00</span>
                <div className="intro-preview__day-content">
                  <h4>Welcome & Briefing</h4>
                  <p>Meet your instructor, tour the facility, discuss your goals</p>
                </div>
              </div>
              <div className="intro-preview__day-step">
                <span className="intro-preview__day-time">09:30</span>
                <div className="intro-preview__day-content">
                  <h4>Aircraft Familiarization</h4>
                  <p>Learn the controls, instruments, and pre-flight checks</p>
                </div>
              </div>
              <div className="intro-preview__day-step">
                <span className="intro-preview__day-time">10:00</span>
                <div className="intro-preview__day-content">
                  <h4>Your First Flight!</h4>
                  <p>Take the controls and experience hover for the first time</p>
                </div>
              </div>
              <div className="intro-preview__day-step">
                <span className="intro-preview__day-time">10:30</span>
                <div className="intro-preview__day-content">
                  <h4>Debrief & Next Steps</h4>
                  <p>Review your flight, plan your training schedule</p>
                </div>
              </div>
            </div>
            <div className="intro-preview__day-cta">
              <p>Ready to experience it yourself?</p>
              <button className="intro-preview__btn">Book Your First Lesson</button>
            </div>
          </div>
        )}

        {/* INTRO 27-40: Varied unique designs with real content */}
        {variation >= 27 && variation <= 40 && (
          <div className="intro-preview__varied" style={{
            background: variation % 3 === 0 ? '#1a1a1a' : variation % 3 === 1 ? '#faf9f6' : '#fff'
          }}>
            <div className="intro-preview__varied-content" style={{
              color: variation % 3 === 0 ? '#fff' : '#1a1a1a'
            }}>
              <div className="intro-preview__varied-header">
                <span className="intro-preview__number">{String(variation - 20).padStart(2, '0')}</span>
                <h2>{componentVariations.intros[variation - 1]?.name}</h2>
              </div>
              <div className="intro-preview__varied-body">
                <img
                  src={`/assets/images/gallery/carousel/rotating${(variation % 8) + 1}.jpg`}
                  alt="Training"
                  className="intro-preview__varied-image"
                />
                <div className="intro-preview__varied-text">
                  <p className="intro-preview__style-label">{componentVariations.intros[variation - 1]?.style}</p>
                  <p>
                    HQ Aviation has been the UK's premier helicopter training school since 2010.
                    Our commitment to excellence and safety has produced hundreds of confident, skilled pilots.
                  </p>
                  <ul className="intro-preview__varied-list">
                    <li>Professional CAA-approved training</li>
                    <li>Modern Robinson fleet (R22, R44, R66)</li>
                    <li>Flexible scheduling for your lifestyle</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// REQUIREMENTS COMPONENTS
// ============================================

function RequirementsComponent({ variation }) {
  const requirements = [
    { label: 'Age', value: '17+', note: 'years' },
    { label: 'Medical', value: 'Class 2', note: 'certificate' },
    { label: 'Hours', value: '45', note: 'minimum' },
    { label: 'Solo', value: '10', note: 'hours' },
    { label: 'Exams', value: '9', note: 'subjects' },
    { label: 'Nav', value: '185', note: 'km' },
  ];

  return (
    <div className={`req-preview req-preview--v${variation}`}>
      {variation === 1 && (
        <div className="req-preview__grid">
          {requirements.map((req, i) => (
            <div key={i} className="req-preview__card">
              <span className="req-preview__value">{req.value}</span>
              <span className="req-preview__label">{req.label}</span>
              <span className="req-preview__note">{req.note}</span>
            </div>
          ))}
        </div>
      )}

      {variation === 2 && (
        <div className="req-preview__checklist">
          {requirements.map((req, i) => (
            <div key={i} className="req-preview__check-item">
              <span className="req-preview__checkbox">☐</span>
              <span>{req.label}: {req.value} {req.note}</span>
            </div>
          ))}
        </div>
      )}

      {variation >= 3 && variation <= 10 && (
        <div className="req-preview__generic">
          <h3>Requirements - Variation {variation}</h3>
          <p className="req-preview__style-note">Style: {componentVariations.requirements[variation - 1]?.style}</p>
          <div className="req-preview__mini-grid">
            {requirements.slice(0, 3).map((req, i) => (
              <div key={i}><strong>{req.value}</strong> {req.label}</div>
            ))}
          </div>
        </div>
      )}

      {variation >= 11 && variation <= 20 && (
        <div className="req-preview__enhanced">
          <h3>{componentVariations.requirements[variation - 1]?.name}</h3>
          <p className="req-preview__style-note">{componentVariations.requirements[variation - 1]?.style}</p>
          <div className="req-preview__enhanced-grid">
            {requirements.map((req, i) => (
              <div key={i} className="req-preview__enhanced-item">
                <div className="req-preview__enhanced-value">{req.value}</div>
                <div className="req-preview__enhanced-label">{req.label}</div>
                <div className="req-preview__enhanced-note">{req.note}</div>
              </div>
            ))}
          </div>
          <div className="req-preview__enhanced-cta">
            <p>Not sure if you qualify? <a href="#">Take our eligibility quiz</a></p>
          </div>
        </div>
      )}

      {/* NEW: Falling Cards Animation - Based on req-1 feedback */}
      {variation === 21 && (
        <Reveal>
          <div className="req-preview__falling">
            <div className="req-preview__falling-header">
              <span className="req-preview__label">PPL(H) Requirements</span>
              <h2>What You'll Need</h2>
            </div>
            <div className="req-preview__falling-grid">
              {requirements.map((req, i) => (
                <motion.div
                  key={i}
                  className="req-preview__falling-card"
                  initial={{ opacity: 0, y: -100, rotate: -10 + Math.random() * 20 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: i * 0.15,
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="req-preview__falling-value">{req.value}</div>
                  <div className="req-preview__falling-label">{req.label}</div>
                  <div className="req-preview__falling-note">{req.note}</div>
                </motion.div>
              ))}
            </div>
            <p className="req-preview__falling-note-text">
              Don't worry if these seem daunting - we guide you through every step.
            </p>
          </div>
        </Reveal>
      )}

      {/* REQ 22: Radar Display - Aviation radar aesthetic */}
      {variation === 22 && (
        <div className="req-preview__radar">
          <div className="req-preview__radar-screen">
            <div className="req-preview__radar-sweep"></div>
            <div className="req-preview__radar-rings">
              <div className="req-preview__radar-ring"></div>
              <div className="req-preview__radar-ring"></div>
              <div className="req-preview__radar-ring"></div>
            </div>
            {requirements.map((req, i) => (
              <div
                key={i}
                className="req-preview__radar-blip"
                style={{
                  left: `${30 + (i % 3) * 25}%`,
                  top: `${20 + Math.floor(i / 3) * 35}%`,
                  animationDelay: `${i * 0.3}s`
                }}
              >
                <span className="req-preview__blip-value">{req.value}</span>
                <span className="req-preview__blip-label">{req.label}</span>
              </div>
            ))}
          </div>
          <div className="req-preview__radar-header">
            <h3>Requirements <span className="req-preview__radar-status">LOCKED ON</span></h3>
            <p>All targets identified for your PPL(H) mission</p>
          </div>
        </div>
      )}

      {/* REQ 23: Glass Morphism Cards */}
      {variation === 23 && (
        <div className="req-preview__glass">
          <div className="req-preview__glass-bg">
            <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Background" />
          </div>
          <div className="req-preview__glass-content">
            <h3>PPL(H) Requirements</h3>
            <div className="req-preview__glass-grid">
              {requirements.map((req, i) => (
                <div key={i} className="req-preview__glass-card">
                  <span className="req-preview__glass-value">{req.value}</span>
                  <span className="req-preview__glass-label">{req.label}</span>
                  <span className="req-preview__glass-note">{req.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REQ 24: Checklist Paper Style */}
      {variation === 24 && (
        <div className="req-preview__paper">
          <div className="req-preview__paper-sheet">
            <div className="req-preview__paper-header">
              <h3>PRE-FLIGHT CHECKLIST</h3>
              <span className="req-preview__paper-subtitle">PPL(H) Requirements</span>
            </div>
            <div className="req-preview__paper-list">
              {requirements.map((req, i) => (
                <div key={i} className="req-preview__paper-item">
                  <span className="req-preview__paper-check">☑</span>
                  <span className="req-preview__paper-text">{req.label}</span>
                  <span className="req-preview__paper-dots">...........................</span>
                  <span className="req-preview__paper-value">{req.value} {req.note}</span>
                </div>
              ))}
            </div>
            <div className="req-preview__paper-footer">
              <span>Pilot Signature: _________________</span>
              <span>Date: _________</span>
            </div>
          </div>
        </div>
      )}

      {/* REQ 25: Badge Collection */}
      {variation === 25 && (
        <div className="req-preview__badges">
          <div className="req-preview__badges-header">
            <span className="req-preview__label">Earn Your Wings</span>
            <h3>Requirements to Unlock</h3>
          </div>
          <div className="req-preview__badges-grid">
            {requirements.map((req, i) => (
              <div key={i} className="req-preview__badge-item">
                <div className="req-preview__badge-icon">
                  {i === 0 && '🎂'}
                  {i === 1 && '❤️'}
                  {i === 2 && '⏱️'}
                  {i === 3 && '✈️'}
                  {i === 4 && '📚'}
                  {i === 5 && '🗺️'}
                </div>
                <span className="req-preview__badge-value">{req.value}</span>
                <span className="req-preview__badge-label">{req.label}</span>
                <div className="req-preview__badge-ribbon">{req.note}</div>
              </div>
            ))}
          </div>
          <div className="req-preview__badges-progress">
            <span>Complete all badges to earn your PPL(H)</span>
          </div>
        </div>
      )}

      {/* Variations 26-40: Styled with unique layouts */}
      {variation >= 26 && variation <= 40 && (
        <div className="req-preview__varied" style={{
          background: variation % 2 === 0 ? '#1a1a1a' : '#faf9f6',
          color: variation % 2 === 0 ? '#fff' : '#1a1a1a',
          padding: '3rem 2rem'
        }}>
          <div className="req-preview__varied-header">
            <span className="req-preview__label" style={{ color: variation % 2 === 0 ? '#E04A2F' : '#999' }}>
              {componentVariations.requirements[variation - 1]?.name}
            </span>
            <h3>PPL(H) Requirements</h3>
          </div>
          <div className="req-preview__varied-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            {requirements.map((req, i) => (
              <motion.div
                key={i}
                className="req-preview__varied-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{
                  background: variation % 2 === 0 ? 'rgba(255,255,255,0.1)' : '#fff',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: variation % 2 === 0 ? 'none' : '0 4px 20px rgba(0,0,0,0.08)'
                }}
              >
                <span style={{ fontSize: '2rem', fontWeight: 700, color: '#E04A2F', display: 'block' }}>
                  {req.value}
                </span>
                <span style={{ fontWeight: 600, display: 'block', marginTop: '0.5rem' }}>{req.label}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{req.note}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// JOURNEY COMPONENTS
// ============================================

function JourneyComponent({ variation }) {
  const stages = [
    { phase: '01', title: 'Ground School', hours: '~100 hrs' },
    { phase: '02', title: 'Dual Training', hours: '35 hrs' },
    { phase: '03', title: 'Solo Flight', hours: '10 hrs' },
    { phase: '04', title: 'Skills Test', hours: '~2 hrs' },
  ];

  return (
    <div className={`journey-preview journey-preview--v${variation}`}>
      {variation === 1 && (
        <div className="journey-preview__timeline">
          {stages.map((stage, i) => (
            <div key={i} className="journey-preview__stage">
              <div className="journey-preview__marker">{stage.phase}</div>
              <div className="journey-preview__stage-content">
                <h4>{stage.title}</h4>
                <span>{stage.hours}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {variation === 2 && (
        <div className="journey-preview__horizontal">
          {stages.map((stage, i) => (
            <div key={i} className="journey-preview__step">
              <span className="journey-preview__step-num">{stage.phase}</span>
              <span className="journey-preview__step-title">{stage.title}</span>
            </div>
          ))}
        </div>
      )}

      {variation >= 3 && variation <= 10 && (
        <div className="journey-preview__generic">
          <h3>Journey - Variation {variation}</h3>
          <p className="journey-preview__style-note">Style: {componentVariations.journeys[variation - 1]?.style}</p>
          <div className="journey-preview__mini-stages">
            {stages.map((s, i) => (
              <span key={i}>{s.phase} {s.title}</span>
            ))}
          </div>
        </div>
      )}

      {variation === 11 && (
        <div className="journey-preview__logbook">
          <img src="/assets/images/training/logbook.webp" alt="Pilot logbook" className="journey-preview__logbook-image" />
          <div className="journey-preview__logbook-content">
            <h3>Your Logbook Journey</h3>
            <p>Every hour logged brings you closer to your wings</p>
            <div className="journey-preview__logbook-stages">
              {stages.map((s, i) => (
                <div key={i} className="journey-preview__logbook-entry">
                  <span className="journey-preview__logbook-phase">{s.phase}</span>
                  <span className="journey-preview__logbook-title">{s.title}</span>
                  <span className="journey-preview__logbook-hours">{s.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {variation >= 12 && variation <= 20 && (
        <div className="journey-preview__enhanced">
          <h3>{componentVariations.journeys[variation - 1]?.name}</h3>
          <p className="journey-preview__style-note">{componentVariations.journeys[variation - 1]?.style}</p>
          <div className="journey-preview__enhanced-timeline">
            {stages.map((s, i) => (
              <div key={i} className="journey-preview__enhanced-stage">
                <div className="journey-preview__enhanced-number">{s.phase}</div>
                <div className="journey-preview__enhanced-info">
                  <h4>{s.title}</h4>
                  <span>{s.hours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JOURNEY 21: Flight Path SVG - Animated helicopter through milestones */}
      {variation === 21 && (
        <div className="journey-preview__flightpath">
          <div className="journey-preview__flightpath-header">
            <span className="journey-preview__label">Your Training Flight Plan</span>
            <h3>From Ground to Sky</h3>
          </div>
          <svg className="journey-preview__flightpath-svg" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E04A2F" />
                <stop offset="100%" stopColor="#28a745" />
              </linearGradient>
            </defs>
            <path
              className="journey-preview__flightpath-line"
              d="M50,250 C150,250 200,200 300,180 S450,100 550,120 S700,80 850,50"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="4"
              strokeDasharray="8,4"
            />
            {stages.map((s, i) => (
              <g key={i} transform={`translate(${100 + i * 220}, ${250 - i * 50})`}>
                <circle r="20" fill="#fff" stroke="#E04A2F" strokeWidth="3" />
                <text y="5" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1a1a1a">{s.phase}</text>
                <text y="45" textAnchor="middle" fontSize="11" fill="#1a1a1a">{s.title}</text>
                <text y="60" textAnchor="middle" fontSize="10" fill="#666">{s.hours}</text>
              </g>
            ))}
            <text x="950" y="55" fontSize="24">🎉</text>
            <text x="920" y="80" fontSize="10" fill="#28a745" fontWeight="bold">LICENSE!</text>
          </svg>
        </div>
      )}

      {/* JOURNEY 22: Mountain Climb - Base to summit metaphor */}
      {variation === 22 && (
        <div className="journey-preview__mountain">
          <div className="journey-preview__mountain-bg">
            <svg className="journey-preview__mountain-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
              <polygon points="0,400 400,50 800,400" fill="#e8e6e2" />
              <polygon points="100,400 400,120 700,400" fill="#d0ccc4" />
            </svg>
          </div>
          <div className="journey-preview__mountain-stages">
            {stages.map((s, i) => (
              <div
                key={i}
                className="journey-preview__mountain-camp"
                style={{ bottom: `${15 + i * 20}%`, left: `${20 + i * 15}%` }}
              >
                <span className="journey-preview__camp-flag">⛳</span>
                <div className="journey-preview__camp-info">
                  <strong>{s.title}</strong>
                  <span>{s.hours}</span>
                </div>
              </div>
            ))}
            <div className="journey-preview__mountain-summit">
              <span>🏆</span>
              <strong>PPL(H) License</strong>
            </div>
          </div>
          <div className="journey-preview__mountain-header">
            <h3>Climb to Your License</h3>
            <p>Every stage brings you closer to the summit</p>
          </div>
        </div>
      )}

      {/* JOURNEY 23: Metro Map - London Underground style */}
      {variation === 23 && (
        <div className="journey-preview__metro">
          <div className="journey-preview__metro-header">
            <h3>The <span className="journey-preview__metro-brand">PPL LINE</span></h3>
            <span>Your route to becoming a pilot</span>
          </div>
          <div className="journey-preview__metro-map">
            <div className="journey-preview__metro-line"></div>
            {stages.map((s, i) => (
              <div key={i} className="journey-preview__metro-station" style={{ left: `${10 + i * 22}%` }}>
                <div className="journey-preview__metro-dot"></div>
                <div className="journey-preview__metro-name">{s.title}</div>
                <div className="journey-preview__metro-time">{s.hours}</div>
              </div>
            ))}
            <div className="journey-preview__metro-station journey-preview__metro-station--end" style={{ left: '98%' }}>
              <div className="journey-preview__metro-dot journey-preview__metro-dot--end"></div>
              <div className="journey-preview__metro-name">LICENSE</div>
            </div>
          </div>
          <div className="journey-preview__metro-legend">
            <span className="journey-preview__metro-line-indicator"></span>
            <span>PPL(H) Training Route</span>
          </div>
        </div>
      )}

      {/* JOURNEY 24: Space Mission - NASA phases aesthetic */}
      {variation === 24 && (
        <div className="journey-preview__space">
          <div className="journey-preview__space-header">
            <span className="journey-preview__space-logo">HQ AVIATION</span>
            <h3>MISSION: PPL(H)</h3>
          </div>
          <div className="journey-preview__space-phases">
            {stages.map((s, i) => (
              <div key={i} className="journey-preview__space-phase">
                <div className="journey-preview__phase-number">PHASE {s.phase}</div>
                <div className="journey-preview__phase-title">{s.title.toUpperCase()}</div>
                <div className="journey-preview__phase-duration">{s.hours}</div>
                <div className={`journey-preview__phase-status ${i === 0 ? 'active' : ''}`}>
                  {i === 0 ? '● IN PROGRESS' : '○ PENDING'}
                </div>
              </div>
            ))}
          </div>
          <div className="journey-preview__space-mission-end">
            <span>🚀</span>
            <span>MISSION COMPLETE: LICENSED PILOT</span>
          </div>
        </div>
      )}

      {/* Variations 25-40: Enhanced unique designs */}
      {variation >= 25 && variation <= 40 && (
        <div className="journey-preview__varied" style={{
          background: variation % 2 === 0 ? '#1a1a1a' : 'linear-gradient(135deg, #faf9f6 0%, #fff 100%)',
          color: variation % 2 === 0 ? '#fff' : '#1a1a1a',
          padding: '3rem 2rem'
        }}>
          <div className="journey-preview__varied-header">
            <span className="journey-preview__label" style={{ color: '#E04A2F' }}>
              {componentVariations.journeys[variation - 1]?.name}
            </span>
            <h3>Your Training Journey</h3>
          </div>
          <div className="journey-preview__varied-stages" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '2rem',
            flexWrap: 'wrap'
          }}>
            {stages.map((s, i) => (
              <motion.div
                key={i}
                className="journey-preview__varied-stage"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                style={{
                  background: variation % 2 === 0 ? 'rgba(255,255,255,0.1)' : '#fff',
                  padding: '1.5rem 2rem',
                  borderRadius: '12px',
                  textAlign: 'center',
                  minWidth: '150px',
                  boxShadow: variation % 2 === 0 ? 'none' : '0 4px 20px rgba(0,0,0,0.08)',
                  position: 'relative'
                }}
              >
                <span style={{
                  display: 'block',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#E04A2F',
                  marginBottom: '0.5rem'
                }}>{s.phase}</span>
                <span style={{ fontWeight: 600, display: 'block' }}>{s.title}</span>
                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{s.hours}</span>
                {i < stages.length - 1 && (
                  <span style={{
                    position: 'absolute',
                    right: '-1.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1.2rem',
                    color: '#E04A2F'
                  }}>→</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// COSTS COMPONENTS
// ============================================

function CostsComponent({ variation }) {
  return (
    <div className={`costs-preview costs-preview--v${variation}`}>
      {variation === 1 && (
        <div className="costs-preview__cards">
          <div className="costs-preview__card">
            <h4>Pay As You Fly</h4>
            <div className="costs-preview__price">£295<span>/hr</span></div>
          </div>
          <div className="costs-preview__card costs-preview__card--featured">
            <span className="costs-preview__badge">Popular</span>
            <h4>Complete Package</h4>
            <div className="costs-preview__price">£15,000<span>from</span></div>
          </div>
          <div className="costs-preview__card">
            <h4>Ground School</h4>
            <div className="costs-preview__price">£1,200<span>complete</span></div>
          </div>
        </div>
      )}

      {variation >= 2 && variation <= 10 && (
        <div className="costs-preview__generic">
          <h3>Pricing - Variation {variation}</h3>
          <p className="costs-preview__style-note">Style: {componentVariations.costs[variation - 1]?.style}</p>
          <div className="costs-preview__summary">
            <span>From <strong>£15,000</strong></span>
          </div>
        </div>
      )}

      {variation === 11 && (
        <div className="costs-preview__breakdown">
          <h3>Training Cost Breakdown</h3>
          <div className="costs-preview__breakdown-grid">
            <div className="costs-preview__breakdown-item">
              <span className="costs-preview__breakdown-label">R22 Hourly Rate</span>
              <span className="costs-preview__breakdown-value">£275/hr</span>
            </div>
            <div className="costs-preview__breakdown-item">
              <span className="costs-preview__breakdown-label">R44 Hourly Rate</span>
              <span className="costs-preview__breakdown-value">£395/hr</span>
            </div>
            <div className="costs-preview__breakdown-item">
              <span className="costs-preview__breakdown-label">R66 Hourly Rate</span>
              <span className="costs-preview__breakdown-value">£595/hr</span>
            </div>
            <div className="costs-preview__breakdown-item costs-preview__breakdown-item--highlight">
              <span className="costs-preview__breakdown-label">Ground School</span>
              <span className="costs-preview__breakdown-value">£1,200</span>
            </div>
          </div>
          <p className="costs-preview__breakdown-note">Minimum 45 hours flight time required for PPL(H)</p>
        </div>
      )}

      {variation === 12 && (
        <div className="costs-preview__aircraft">
          <h3>Choose Your Training Aircraft</h3>
          <div className="costs-preview__aircraft-grid">
            <div className="costs-preview__aircraft-card">
              <img src="/assets/images/new-aircraft/r22/r22-main.jpg" alt="R22" style={{ width: '100%', height: '120px', objectFit: 'cover', background: '#333' }} onError={(e) => e.target.style.display='none'} />
              <h4>Robinson R22</h4>
              <p>Most economical training option</p>
              <div className="costs-preview__aircraft-price">From £12,375</div>
            </div>
            <div className="costs-preview__aircraft-card costs-preview__aircraft-card--popular">
              <span className="costs-preview__badge">Recommended</span>
              <img src="/assets/images/used-aircraft/r66/gold-on-pad.jpg" alt="R66" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
              <h4>Robinson R66</h4>
              <p>Turbine experience from day one</p>
              <div className="costs-preview__aircraft-price">From £26,775</div>
            </div>
          </div>
        </div>
      )}

      {variation >= 13 && variation <= 20 && (
        <div className="costs-preview__enhanced">
          <h3>{componentVariations.costs[variation - 1]?.name}</h3>
          <p className="costs-preview__style-note">{componentVariations.costs[variation - 1]?.style}</p>
          <div className="costs-preview__enhanced-price">
            <span className="costs-preview__enhanced-from">Complete PPL(H) from</span>
            <span className="costs-preview__enhanced-amount">£15,000</span>
            <span className="costs-preview__enhanced-note">Based on minimum hours in R22</span>
          </div>
          <button className="costs-preview__btn">Get Detailed Quote</button>
        </div>
      )}

      {/* NEW: Detailed Hourly Breakdown - Based on cost-11 feedback */}
      {variation === 21 && (
        <div className="costs-preview__hourly">
          <div className="costs-preview__hourly-header">
            <span className="costs-preview__label">Transparent Pricing</span>
            <h2>Flight Training Rates</h2>
            <p>Clear, honest pricing with no hidden fees</p>
          </div>

          <div className="costs-preview__hourly-table">
            <div className="costs-preview__hourly-row costs-preview__hourly-row--header">
              <span>Aircraft</span>
              <span>Hourly Rate</span>
              <span>Min 45 Hrs</span>
            </div>
            <div className="costs-preview__hourly-row">
              <div className="costs-preview__aircraft-info">
                <strong>Robinson R22</strong>
                <small>Entry-level, most economical</small>
              </div>
              <span className="costs-preview__hourly-rate">£275<small>/hr</small></span>
              <span className="costs-preview__hourly-total">£12,375</span>
            </div>
            <div className="costs-preview__hourly-row costs-preview__hourly-row--popular">
              <div className="costs-preview__aircraft-info">
                <strong>Robinson R44</strong>
                <span className="costs-preview__badge-small">Popular</span>
                <small>4-seater, more stable</small>
              </div>
              <span className="costs-preview__hourly-rate">£395<small>/hr</small></span>
              <span className="costs-preview__hourly-total">£17,775</span>
            </div>
            <div className="costs-preview__hourly-row">
              <div className="costs-preview__aircraft-info">
                <strong>Robinson R66</strong>
                <small>Turbine, professional experience</small>
              </div>
              <span className="costs-preview__hourly-rate">£595<small>/hr</small></span>
              <span className="costs-preview__hourly-total">£26,775</span>
            </div>
          </div>

          <div className="costs-preview__hourly-included">
            <div className="costs-preview__included-badge">
              <span className="costs-preview__included-icon">✓</span>
              <span className="costs-preview__included-text">Ground School</span>
              <span className="costs-preview__included-value">INCLUDED</span>
            </div>
            <p className="costs-preview__included-note">
              Complete ground school theory course included with all training packages - a £1,200 value
            </p>
          </div>

          <div className="costs-preview__hourly-additional">
            <h4>Additional Costs</h4>
            <div className="costs-preview__hourly-extras">
              <div className="costs-preview__extra-item">
                <span>CAA Exams (9 subjects)</span>
                <span>~£900</span>
              </div>
              <div className="costs-preview__extra-item">
                <span>Skills Test</span>
                <span>~£300</span>
              </div>
              <div className="costs-preview__extra-item">
                <span>Class 2 Medical</span>
                <span>~£200</span>
              </div>
              <div className="costs-preview__extra-item">
                <span>License Issue Fee</span>
                <span>~£180</span>
              </div>
            </div>
          </div>

          <div className="costs-preview__hourly-cta">
            <button className="costs-preview__btn costs-preview__btn--primary">Get Personalized Quote</button>
            <p className="costs-preview__hourly-financing">Flexible payment plans available</p>
          </div>
        </div>
      )}

      {/* Variations 22-40: Advanced styled previews */}
      {variation >= 22 && variation <= 40 && (
        <div className="costs-preview__advanced">
          <h3>{componentVariations.costs[variation - 1]?.name}</h3>
          <p className="costs-preview__style-note">{componentVariations.costs[variation - 1]?.style}</p>
          <div className="costs-preview__advanced-price">
            <span className="costs-preview__advanced-from">From</span>
            <span className="costs-preview__advanced-amount">£12,375</span>
          </div>
          <button className="costs-preview__btn costs-preview__btn--primary">Get Quote</button>
        </div>
      )}
    </div>
  );
}

// ============================================
// FAQ COMPONENTS
// ============================================

function FAQComponent({ variation }) {
  const faqs = [
    { q: 'How long does training take?', a: '6-12 months typically' },
    { q: 'What medical do I need?', a: 'Class 2 or LAPL medical' },
    { q: 'Is financing available?', a: 'Yes, flexible payment plans' },
  ];

  return (
    <div className={`faq-preview faq-preview--v${variation}`}>
      {variation === 1 && (
        <div className="faq-preview__accordion">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-preview__item">
              <div className="faq-preview__question">
                <span>{faq.q}</span>
                <span>+</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {variation >= 2 && variation <= 10 && (
        <div className="faq-preview__generic">
          <h3>FAQ - Variation {variation}</h3>
          <p className="faq-preview__style-note">Style: {componentVariations.faqs[variation - 1]?.style}</p>
          <div className="faq-preview__mini">
            {faqs.map((f, i) => <div key={i}>{f.q}</div>)}
          </div>
        </div>
      )}

      {variation >= 11 && variation <= 20 && (
        <div className="faq-preview__enhanced">
          <h3>{componentVariations.faqs[variation - 1]?.name}</h3>
          <p className="faq-preview__style-note">{componentVariations.faqs[variation - 1]?.style}</p>
          <div className="faq-preview__enhanced-list">
            {[...faqs,
              { q: 'Do I need perfect eyesight?', a: 'No, corrected vision is acceptable' },
              { q: 'Can I fly in winter?', a: 'Yes, weather permitting' }
            ].map((f, i) => (
              <div key={i} className="faq-preview__enhanced-item">
                <div className="faq-preview__enhanced-q">{f.q}</div>
                <div className="faq-preview__enhanced-a">{f.a}</div>
              </div>
            ))}
          </div>
          <div className="faq-preview__enhanced-more">
            <a href="#">View all FAQs →</a>
          </div>
        </div>
      )}

      {/* NEW: Video FAQ - Based on faq-11 feedback */}
      {variation === 21 && (
        <div className="faq-preview__video">
          <div className="faq-preview__video-header">
            <span className="faq-preview__label">Got Questions?</span>
            <h2>Frequently Asked Questions</h2>
            <p>Real answers from our instructors</p>
          </div>

          <div className="faq-preview__video-grid">
            <div className="faq-preview__video-item">
              <div className="faq-preview__video-thumb">
                <div className="faq-preview__video-play">▶</div>
                <span className="faq-preview__video-duration">1:24</span>
              </div>
              <h4>How long does it take to get a PPL(H)?</h4>
              <p>Typically 6-12 months depending on your schedule and weather. Most students train 1-2 times per week.</p>
            </div>

            <div className="faq-preview__video-item">
              <div className="faq-preview__video-thumb">
                <div className="faq-preview__video-play">▶</div>
                <span className="faq-preview__video-duration">2:08</span>
              </div>
              <h4>Do I need any previous flying experience?</h4>
              <p>No prior experience needed. We'll teach you everything from the very basics during your first lesson.</p>
            </div>

            <div className="faq-preview__video-item faq-preview__video-item--featured">
              <div className="faq-preview__video-thumb faq-preview__video-thumb--featured">
                <div className="faq-preview__video-play">▶</div>
                <span className="faq-preview__video-duration">3:15</span>
              </div>
              <h4>Can I fly in winter?</h4>
              <div className="faq-preview__video-answer faq-preview__video-answer--detailed">
                <p>
                  <strong>Yes, weather permitting!</strong> In fact, experiencing challenging weather conditions with a qualified
                  instructor is one of the <em>best</em> times to fly.
                </p>
                <p className="faq-preview__video-highlight">
                  One of the greatest benefits of training in the UK is that it makes <strong>better pilots</strong>—pilots who
                  are more conscientious and truly understand the effects of weather and wind on flying as part of their core
                  training process.
                </p>
                <p>
                  Our students develop real-world skills that pilots in sunnier climates often lack. This hands-on weather
                  experience is invaluable for your future flying career.
                </p>
              </div>
            </div>

            <div className="faq-preview__video-item">
              <div className="faq-preview__video-thumb">
                <div className="faq-preview__video-play">▶</div>
                <span className="faq-preview__video-duration">1:47</span>
              </div>
              <h4>What medical certificate do I need?</h4>
              <p>You'll need a Class 2 medical or LAPL medical. It's a simple exam from a CAA-approved doctor.</p>
            </div>

            <div className="faq-preview__video-item">
              <div className="faq-preview__video-thumb">
                <div className="faq-preview__video-play">▶</div>
                <span className="faq-preview__video-duration">2:33</span>
              </div>
              <h4>Is financing available?</h4>
              <p>Yes! We offer flexible payment plans so you can spread the cost of training over time.</p>
            </div>
          </div>

          <div className="faq-preview__video-cta">
            <p>Still have questions?</p>
            <button className="faq-preview__btn">Ask an Instructor</button>
          </div>
        </div>
      )}

      {/* Variations 22-40: Advanced styled previews */}
      {variation >= 22 && variation <= 40 && (
        <div className="faq-preview__advanced">
          <h3>{componentVariations.faqs[variation - 1]?.name}</h3>
          <p className="faq-preview__style-note">{componentVariations.faqs[variation - 1]?.style}</p>
          <div className="faq-preview__advanced-list">
            {faqs.map((f, i) => (
              <div key={i} className="faq-preview__advanced-item">
                <span className="faq-preview__advanced-q">{f.q}</span>
                <span className="faq-preview__advanced-a">{f.a}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// CTA COMPONENTS
// ============================================

function CTAComponent({ variation }) {
  return (
    <div className={`cta-preview cta-preview--v${variation}`}>
      {variation === 1 && (
        <div className="cta-preview__split">
          <div className="cta-preview__text">
            <h2>Ready to Begin?</h2>
            <p>Book a discovery flight today</p>
            <div className="cta-preview__buttons">
              <button className="cta-preview__btn cta-preview__btn--primary">Book Flight</button>
              <button className="cta-preview__btn">Contact Us</button>
            </div>
          </div>
          <div className="cta-preview__image">
            <div className="cta-preview__image-placeholder">CTA Image</div>
          </div>
        </div>
      )}

      {variation >= 2 && variation <= 10 && (
        <div className="cta-preview__generic">
          <h3>CTA - Variation {variation}</h3>
          <p className="cta-preview__style-note">Style: {componentVariations.ctas[variation - 1]?.style}</p>
          <button className="cta-preview__btn cta-preview__btn--primary">Get Started</button>
        </div>
      )}

      {variation === 11 && (
        <div className="cta-preview__trial">
          <div className="cta-preview__trial-content">
            <h2>Try Before You Commit</h2>
            <p>Experience helicopter flight with a 30-minute trial lesson</p>
            <div className="cta-preview__trial-price">
              <span className="cta-preview__trial-amount">£199</span>
              <span className="cta-preview__trial-note">30-minute trial flight</span>
            </div>
            <button className="cta-preview__btn cta-preview__btn--primary cta-preview__btn--large">Book Trial Flight</button>
            <p className="cta-preview__trial-reassurance">No obligation • Gift vouchers available</p>
          </div>
          <div className="cta-preview__trial-image">
            <img src="/assets/images/gallery/carousel/rotating8.jpg" alt="Trial flight" />
          </div>
        </div>
      )}

      {variation === 12 && (
        <div className="cta-preview__call">
          <h2>Speak to an Instructor</h2>
          <p>Have questions? Our team is ready to help</p>
          <a href="tel:+441234567890" className="cta-preview__phone">01234 567 890</a>
          <p className="cta-preview__hours">Mon-Sun 8am-6pm</p>
          <div className="cta-preview__call-alt">
            <span>Or</span>
            <button className="cta-preview__btn">Send Enquiry</button>
          </div>
        </div>
      )}

      {variation === 13 && (
        <div className="cta-preview__visit">
          <div className="cta-preview__visit-map">
            <div className="cta-preview__map-placeholder">
              <span>📍 Denham Aerodrome</span>
              <span>Tilehouse Lane, Denham UB9 5DF</span>
            </div>
          </div>
          <div className="cta-preview__visit-info">
            <h2>Visit Us</h2>
            <p>Come see our facilities and meet the team</p>
            <button className="cta-preview__btn cta-preview__btn--primary">Get Directions</button>
            <button className="cta-preview__btn">Schedule Tour</button>
          </div>
        </div>
      )}

      {variation >= 14 && variation <= 20 && (
        <div className="cta-preview__enhanced">
          <h2>{componentVariations.ctas[variation - 1]?.name}</h2>
          <p className="cta-preview__style-note">{componentVariations.ctas[variation - 1]?.style}</p>
          <div className="cta-preview__enhanced-actions">
            <button className="cta-preview__btn cta-preview__btn--primary cta-preview__btn--large">Book Discovery Flight</button>
            <div className="cta-preview__enhanced-secondary">
              <a href="#">Download Brochure</a>
              <span>•</span>
              <a href="#">Contact Us</a>
            </div>
          </div>
          <div className="cta-preview__enhanced-trust">
            <img src="/assets/images/logos/certifications/caa.jpg" alt="CAA Approved" style={{ height: '30px', opacity: 0.7 }} />
            <img src="/assets/images/logos/certifications/rhc.png" alt="Robinson" style={{ height: '30px', opacity: 0.7 }} />
          </div>
        </div>
      )}

      {/* NEW: Discovery Flight Hero CTA - Based on cta-1 feedback */}
      {variation === 21 && (
        <div className="cta-preview__discovery">
          <div className="cta-preview__discovery-content">
            <div className="cta-preview__discovery-text">
              <span className="cta-preview__label">Ready to Take Flight?</span>
              <h2>Experience Helicopter Flight<br /><span className="cta-preview__accent">For Yourself</span></h2>
              <p className="cta-preview__discovery-tagline">
                The best way to know if helicopter flying is for you is to try it.
                Book a 30-minute discovery flight and take the controls over the beautiful Chilterns.
              </p>

              <div className="cta-preview__discovery-features">
                <div className="cta-preview__discovery-feature">
                  <span className="cta-preview__feature-icon">🕐</span>
                  <div>
                    <strong>30 Minutes Flight Time</strong>
                    <small>You fly from takeoff to landing</small>
                  </div>
                </div>
                <div className="cta-preview__discovery-feature">
                  <span className="cta-preview__feature-icon">👨‍✈️</span>
                  <div>
                    <strong>Qualified Instructor</strong>
                    <small>Expert guidance throughout</small>
                  </div>
                </div>
                <div className="cta-preview__discovery-feature">
                  <span className="cta-preview__feature-icon">🎁</span>
                  <div>
                    <strong>Counts Towards PPL</strong>
                    <small>Not just a joyride - real training</small>
                  </div>
                </div>
              </div>

              <div className="cta-preview__discovery-pricing">
                <div className="cta-preview__discovery-price">
                  <span className="cta-preview__price-from">From</span>
                  <span className="cta-preview__price-amount">£199</span>
                </div>
                <div className="cta-preview__discovery-actions">
                  <button className="cta-preview__btn cta-preview__btn--primary cta-preview__btn--large">
                    Enquire About Discovery Flight
                  </button>
                  <button className="cta-preview__btn cta-preview__btn--outline">
                    Give as Gift
                  </button>
                </div>
              </div>

              <p className="cta-preview__discovery-reassurance">
                No commitment required • Gift vouchers available • Counts towards your license hours
              </p>
            </div>

            <div className="cta-preview__discovery-image">
              <img src="/assets/images/gallery/carousel/rotating1.jpg" alt="Discovery flight" />
              <div className="cta-preview__discovery-badge">
                <span>★ 5.0</span>
                <small>500+ happy customers</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Helicopter Tour / Visit Us CTA - Based on cta-13 feedback */}
      {variation === 22 && (
        <div className="cta-preview__tour">
          <div className="cta-preview__tour-content">
            <div className="cta-preview__tour-image">
              <img src="/assets/images/facility/hq-aviation-helicopter-hangar.webp" alt="HQ Aviation Hangar" />
            </div>

            <div className="cta-preview__tour-text">
              <span className="cta-preview__label">Love Helicopters?</span>
              <h2>Come Visit Our <span className="cta-preview__accent">Collection</span></h2>

              <p className="cta-preview__tour-tagline">
                Our helicopter collection is extensive. If you love helicopters as much as we do,
                come visit us anytime during working hours and we'll be more than happy to give you
                a tour that'll make you drool.
              </p>

              <div className="cta-preview__tour-fleet">
                <h4>Currently in our hangar:</h4>
                <div className="cta-preview__tour-aircraft">
                  <span>Robinson R22</span>
                  <span>Robinson R44</span>
                  <span>Robinson R66</span>
                  <span>+ Guest aircraft</span>
                </div>
              </div>

              <div className="cta-preview__tour-info">
                <div className="cta-preview__tour-location">
                  <span className="cta-preview__tour-icon">📍</span>
                  <div>
                    <strong>Denham Aerodrome</strong>
                    <small>Tilehouse Lane, Denham UB9 5DF</small>
                  </div>
                </div>
                <div className="cta-preview__tour-hours">
                  <span className="cta-preview__tour-icon">🕐</span>
                  <div>
                    <strong>Open Daily</strong>
                    <small>8:00am - 6:00pm (weather dependent)</small>
                  </div>
                </div>
              </div>

              <div className="cta-preview__tour-actions">
                <button className="cta-preview__btn cta-preview__btn--primary">
                  Get Directions
                </button>
                <button className="cta-preview__btn cta-preview__btn--outline">
                  Schedule a Tour
                </button>
              </div>

              <p className="cta-preview__tour-note">
                No appointment needed for casual visits • Coffee always on • Pilots always happy to chat
              </p>
            </div>
          </div>

          <div className="cta-preview__tour-map">
            <div className="cta-preview__map-container">
              <div className="cta-preview__map-placeholder">
                <span>📍</span>
                <p>Interactive Map</p>
                <small>51.5751°N, 0.5059°W</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA 23: Floating Glass Contact Card */}
      {variation === 23 && (
        <div className="cta-preview__glass-contact">
          <div className="cta-preview__glass-bg">
            <img src="/assets/images/gallery/carousel/rotating6.jpg" alt="Background" />
          </div>
          <div className="cta-preview__glass-card">
            <div className="cta-preview__glass-header">
              <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" style={{ height: '50px' }} />
              <h3>Get In Touch</h3>
            </div>
            <div className="cta-preview__glass-options">
              <a href="tel:+441234567890" className="cta-preview__glass-option">
                <span className="cta-preview__glass-icon">📞</span>
                <span>01234 567 890</span>
              </a>
              <a href="mailto:info@hqaviation.com" className="cta-preview__glass-option">
                <span className="cta-preview__glass-icon">✉️</span>
                <span>info@hqaviation.com</span>
              </a>
              <div className="cta-preview__glass-option">
                <span className="cta-preview__glass-icon">📍</span>
                <span>Denham Aerodrome, UB9 5DF</span>
              </div>
            </div>
            <button className="cta-preview__btn cta-preview__btn--primary cta-preview__btn--large">Book Consultation</button>
          </div>
        </div>
      )}

      {/* CTA 24: Countdown Offer */}
      {variation === 24 && (
        <div className="cta-preview__countdown-offer">
          <div className="cta-preview__countdown-header">
            <span className="cta-preview__label cta-preview__label--urgent">Limited Time Offer</span>
            <h2>Winter Training Special</h2>
            <p>Book your trial flight this month and save 15%</p>
          </div>
          <div className="cta-preview__countdown-timer">
            <div className="cta-preview__timer-unit">
              <span className="cta-preview__timer-num">07</span>
              <span className="cta-preview__timer-label">Days</span>
            </div>
            <div className="cta-preview__timer-sep">:</div>
            <div className="cta-preview__timer-unit">
              <span className="cta-preview__timer-num">14</span>
              <span className="cta-preview__timer-label">Hours</span>
            </div>
            <div className="cta-preview__timer-sep">:</div>
            <div className="cta-preview__timer-unit">
              <span className="cta-preview__timer-num">32</span>
              <span className="cta-preview__timer-label">Mins</span>
            </div>
          </div>
          <div className="cta-preview__countdown-pricing">
            <span className="cta-preview__original-price">£199</span>
            <span className="cta-preview__sale-price">£169</span>
          </div>
          <button className="cta-preview__btn cta-preview__btn--urgent">Claim Offer Now</button>
          <p className="cta-preview__countdown-terms">Limited availability. Terms apply.</p>
        </div>
      )}

      {/* CTA 25: Video Background CTA */}
      {variation === 25 && (
        <div className="cta-preview__video-cta">
          <div className="cta-preview__video-bg">
            <img src="/assets/images/gallery/flying/foggy-evening-flying.jpg" alt="Flying" />
            <div className="cta-preview__video-overlay"></div>
          </div>
          <div className="cta-preview__video-content">
            <span className="cta-preview__label">Your Adventure Awaits</span>
            <h2>Ready to Take<br />the Controls?</h2>
            <p>Join hundreds of successful pilots who started their journey at HQ Aviation</p>
            <div className="cta-preview__video-buttons">
              <button className="cta-preview__btn cta-preview__btn--primary cta-preview__btn--large">Start Today</button>
              <button className="cta-preview__btn cta-preview__btn--play">
                <span>▶</span> Watch Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA 26: Split Two Options */}
      {variation === 26 && (
        <div className="cta-preview__split-options">
          <div className="cta-preview__option cta-preview__option--trial">
            <h3>Try It First</h3>
            <p>Not sure yet? Start with a trial lesson</p>
            <div className="cta-preview__option-price">
              <span className="cta-preview__price-amount">£199</span>
              <span className="cta-preview__price-desc">30-min trial flight</span>
            </div>
            <button className="cta-preview__btn cta-preview__btn--outline">Book Trial</button>
          </div>
          <div className="cta-preview__option-divider">
            <span>OR</span>
          </div>
          <div className="cta-preview__option cta-preview__option--full">
            <span className="cta-preview__popular-tag">Most Popular</span>
            <h3>Go All In</h3>
            <p>Commit to your PPL and start training today</p>
            <div className="cta-preview__option-price">
              <span className="cta-preview__price-amount">£12,375</span>
              <span className="cta-preview__price-desc">Complete PPL from</span>
            </div>
            <button className="cta-preview__btn cta-preview__btn--primary">Start Training</button>
          </div>
        </div>
      )}

      {/* CTA 27: Trust Badges CTA */}
      {variation === 27 && (
        <div className="cta-preview__trust">
          <div className="cta-preview__trust-content">
            <h2>Trusted by Hundreds of Pilots</h2>
            <p>Join the HQ Aviation family and start your flying journey with confidence</p>
            <button className="cta-preview__btn cta-preview__btn--primary cta-preview__btn--large">Begin Your Journey</button>
          </div>
          <div className="cta-preview__trust-badges">
            <div className="cta-preview__trust-badge">
              <img src="/assets/images/logos/certifications/caa.jpg" alt="CAA" />
              <span>CAA Approved</span>
            </div>
            <div className="cta-preview__trust-badge">
              <img src="/assets/images/logos/certifications/rhc.png" alt="Robinson" />
              <span>Robinson Dealer</span>
            </div>
            <div className="cta-preview__trust-badge">
              <span className="cta-preview__trust-stat">34</span>
              <span>Years Experience</span>
            </div>
            <div className="cta-preview__trust-badge">
              <span className="cta-preview__trust-stat">98%</span>
              <span>Pass Rate</span>
            </div>
          </div>
        </div>
      )}

      {/* CTA 28: Gift Voucher */}
      {variation === 28 && (
        <div className="cta-preview__gift">
          <div className="cta-preview__gift-content">
            <span className="cta-preview__gift-ribbon">🎁</span>
            <h2>Give the Gift of Flight</h2>
            <p>Know someone who dreams of flying? Give them an unforgettable experience with an HQ Aviation gift voucher.</p>
            <div className="cta-preview__gift-options">
              <div className="cta-preview__gift-option">
                <span className="cta-preview__gift-value">£199</span>
                <span>Trial Flight</span>
              </div>
              <div className="cta-preview__gift-option">
                <span className="cta-preview__gift-value">£500</span>
                <span>Training Credit</span>
              </div>
              <div className="cta-preview__gift-option">
                <span className="cta-preview__gift-value">Custom</span>
                <span>Any Amount</span>
              </div>
            </div>
            <button className="cta-preview__btn cta-preview__btn--primary">Buy Gift Voucher</button>
            <p className="cta-preview__gift-note">Instant delivery • Valid 12 months • Beautifully presented</p>
          </div>
        </div>
      )}

      {/* Variations 29-40: Varied unique styles */}
      {variation >= 29 && variation <= 40 && (
        <div className="cta-preview__varied" style={{
          background: variation % 3 === 0 ? '#1a1a1a' : variation % 3 === 1 ? 'linear-gradient(135deg, #E04A2F 0%, #c43d26 100%)' : '#faf9f6',
          color: variation % 3 === 2 ? '#1a1a1a' : '#fff',
          padding: '4rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <span className="cta-preview__label" style={{ color: variation % 3 === 2 ? '#E04A2F' : 'rgba(255,255,255,0.8)' }}>
              {componentVariations.ctas[variation - 1]?.name}
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', margin: '0.5rem 0 1rem' }}>
              Ready to Start Flying?
            </h2>
            <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
              Take the first step towards your helicopter pilot license. Book a discovery flight or contact us to learn more.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="cta-preview__btn cta-preview__btn--primary cta-preview__btn--large" style={{
                background: variation % 3 === 1 ? '#fff' : '#E04A2F',
                color: variation % 3 === 1 ? '#E04A2F' : '#fff'
              }}>
                Book Discovery Flight
              </button>
              <button className="cta-preview__btn" style={{
                background: 'transparent',
                border: `2px solid ${variation % 3 === 2 ? '#1a1a1a' : '#fff'}`,
                color: variation % 3 === 2 ? '#1a1a1a' : '#fff'
              }}>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN PPL PICKER COMPONENT
// ============================================

function PPLPicker() {
  const [currentPage, setCurrentPage] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(null);
  const [showFavPanel, setShowFavPanel] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const noteInputRef = useRef(null);

  const page = pageVariations[currentPage];

  // Load favorites
  useEffect(() => {
    const stored = localStorage.getItem('ppl-picker-favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('ppl-picker-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Navigation
  const goNext = () => setCurrentPage(p => (p + 1) % pageVariations.length);
  const goPrev = () => setCurrentPage(p => (p - 1 + pageVariations.length) % pageVariations.length);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'm' || e.key === 'M') setIsMinimized(p => !p);
      if (e.key === 'Escape') {
        if (showNoteModal) setShowNoteModal(null);
        else if (showFavPanel) setShowFavPanel(false);
        else setIsMinimized(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showNoteModal, showFavPanel]);

  // Favorites helpers
  const isFavorite = (id) => favorites.some(f => f.id === id);
  const getFavoriteNote = (id) => favorites.find(f => f.id === id)?.note;

  const handleToggleFavorite = (component) => {
    if (isFavorite(component.id)) {
      setFavorites(prev => prev.filter(f => f.id !== component.id));
    } else {
      setShowNoteModal(component);
    }
  };

  const handleSaveFavorite = (note) => {
    if (!showNoteModal) return;
    setFavorites(prev => [...prev, {
      id: showNoteModal.id,
      name: showNoteModal.name,
      style: showNoteModal.style,
      note: note || '',
      pageVariation: currentPage + 1,
    }]);
    setShowNoteModal(null);
  };

  const handleCopyFavorites = () => {
    if (favorites.length === 0) {
      setCopyFeedback({ msg: 'No favorites!', ok: false });
      setTimeout(() => setCopyFeedback(null), 2000);
      return;
    }

    const lines = favorites.map(f => {
      let line = `${f.id} (${f.name})`;
      if (f.style) line += `\n   Style: ${f.style}`;
      if (f.note) line += `\n   Note: ${f.note}`;
      return line;
    });

    navigator.clipboard.writeText(lines.join('\n\n')).then(() => {
      setCopyFeedback({ msg: `Copied ${favorites.length}!`, ok: true });
    }).catch(() => {
      setCopyFeedback({ msg: 'Copy failed', ok: false });
    });
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  // Focus note input
  useEffect(() => {
    if (showNoteModal && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [showNoteModal]);

  return (
    <div className="ppl-picker-page">
      {/* Page Content */}
      <div className="ppl-picker-preview">
        <div className="ppl-picker-preview__header">
          <h1>PPL Page Variation {currentPage + 1}</h1>
          <p>Favorite individual components to build your ideal page</p>
        </div>

        <div className="ppl-picker-preview__components">
          {Object.entries(page.components).map(([type, component]) => (
            <ComponentWrapper
              key={component.id}
              component={component}
              type={type}
              variation={page.number}
              isFavorite={isFavorite(component.id)}
              favoriteNote={getFavoriteNote(component.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </div>

      {/* Picker Controls */}
      <div className={`ppl-picker-controls ${isMinimized ? 'minimized' : ''}`}>
        {/* Collapsed bar */}
        <div className="ppl-picker-controls__collapsed" onClick={() => setIsMinimized(false)}>
          <span>PPL Picker - Variation {currentPage + 1}/10</span>
          <div className="ppl-picker-controls__collapsed-nav">
            <button onClick={(e) => { e.stopPropagation(); goPrev(); }}>←</button>
            <button onClick={(e) => { e.stopPropagation(); goNext(); }}>→</button>
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}>↑</button>
          </div>
        </div>

        {/* Main controls */}
        <div className="ppl-picker-controls__main">
          <div className="ppl-picker-controls__header">
            <h3>PPL Page Picker</h3>
            <button className="ppl-picker-controls__minimize" onClick={() => setIsMinimized(true)}>−</button>
          </div>

          <div className="ppl-picker-controls__nav">
            <button className="ppl-picker-controls__nav-btn" onClick={goPrev}>←</button>
            <div className="ppl-picker-controls__info">
              <span className="ppl-picker-controls__counter">{currentPage + 1} / {pageVariations.length}</span>
              <h4>{page.name}</h4>
              <p>7 components</p>
            </div>
            <button className="ppl-picker-controls__nav-btn" onClick={goNext}>→</button>
          </div>

          <div className="ppl-picker-controls__thumbs">
            {pageVariations.map((_, i) => (
              <button
                key={i}
                className={`ppl-picker-controls__thumb ${i === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="ppl-picker-controls__footer">
            <button
              className={`ppl-picker-controls__btn ppl-picker-controls__btn--favs ${favorites.length > 0 ? 'has-items' : ''}`}
              onClick={() => setShowFavPanel(!showFavPanel)}
            >
              ★ <span>{favorites.length}</span>
            </button>
            <button
              className={`ppl-picker-controls__btn ppl-picker-controls__btn--copy ${copyFeedback ? (copyFeedback.ok ? 'success' : 'error') : ''}`}
              onClick={handleCopyFavorites}
            >
              {copyFeedback ? copyFeedback.msg : '📋 Copy'}
            </button>
          </div>

          <div className="ppl-picker-controls__hints">
            <span><kbd>←</kbd><kbd>→</kbd> Nav</span>
            <span><kbd>M</kbd> Mini</span>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="ppl-picker-modal" onClick={() => setShowNoteModal(null)}>
          <div className="ppl-picker-modal__content" onClick={e => e.stopPropagation()}>
            <div className="ppl-picker-modal__header">
              <span className="ppl-picker-modal__icon">★</span>
              <span>Add to Favorites</span>
            </div>
            <div className="ppl-picker-modal__name">{showNoteModal.name}</div>
            <div className="ppl-picker-modal__style">{showNoteModal.style}</div>
            <textarea
              ref={noteInputRef}
              className="ppl-picker-modal__input"
              placeholder="Add a comment (optional)..."
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveFavorite(e.target.value.trim());
                }
                if (e.key === 'Escape') setShowNoteModal(null);
              }}
            />
            <div className="ppl-picker-modal__actions">
              <button onClick={() => setShowNoteModal(null)}>Cancel</button>
              <button className="primary" onClick={() => handleSaveFavorite(noteInputRef.current?.value.trim())}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Panel */}
      {showFavPanel && (
        <div className="ppl-picker-favs">
          <div className="ppl-picker-favs__header">
            <strong>★ Favorites ({favorites.length})</strong>
            <button onClick={() => setShowFavPanel(false)}>×</button>
          </div>
          <div className="ppl-picker-favs__list">
            {favorites.length === 0 ? (
              <div className="ppl-picker-favs__empty">No favorites yet. Click ☆ on components to add.</div>
            ) : (
              favorites.map((fav, i) => (
                <div key={fav.id} className="ppl-picker-favs__item">
                  <div className="ppl-picker-favs__item-main">
                    <span className="ppl-picker-favs__item-name">{fav.name}</span>
                    <span className="ppl-picker-favs__item-id">{fav.id}</span>
                  </div>
                  {fav.style && <div className="ppl-picker-favs__item-style">{fav.style}</div>}
                  <div className={`ppl-picker-favs__item-note ${!fav.note ? 'empty' : ''}`}>
                    {fav.note || 'No comment'}
                  </div>
                  <div className="ppl-picker-favs__item-actions">
                    <button onClick={() => {
                      const newNote = prompt('Edit comment:', fav.note);
                      if (newNote !== null) {
                        setFavorites(prev => prev.map((f, idx) => idx === i ? { ...f, note: newNote } : f));
                      }
                    }}>✏️</button>
                    <button onClick={() => setFavorites(prev => prev.filter((_, idx) => idx !== i))}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
          {favorites.length > 0 && (
            <div className="ppl-picker-favs__footer">
              <button className="copy" onClick={handleCopyFavorites}>📋 Copy All</button>
              <button className="clear" onClick={() => { if (confirm('Clear all favorites?')) setFavorites([]); }}>
                🗑️ Clear
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        /* ===== PPL PICKER PAGE STYLES ===== */
        .ppl-picker-page {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          min-height: 100vh;
          padding-bottom: 120px;
        }

        /* Preview Area - Full width website look */
        .ppl-picker-preview {
          width: 100%;
        }

        .ppl-picker-preview__header {
          display: none;
        }

        .ppl-picker-preview__components {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Component Wrapper - Clean website look */
        .ppl-component {
          position: relative;
          overflow: hidden;
        }

        /* Subtle favorite button - only visible on hover */
        .ppl-component__fav {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          border: none;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(4px);
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px;
          color: #999;
          opacity: 0;
          transition: all 0.2s ease;
          z-index: 100;
        }

        .ppl-component:hover .ppl-component__fav {
          opacity: 1;
        }

        .ppl-component__fav:hover {
          background: rgba(255,255,255,0.95);
          color: #f59e0b;
          transform: scale(1.1);
        }

        .ppl-component__fav.active {
          opacity: 1;
          background: #f59e0b;
          color: #fff;
        }

        .ppl-component__fav.active:hover {
          background: #d97706;
          color: #fff;
        }

        /* Dark section variant */
        .ppl-component--hero .ppl-component__fav,
        .ppl-component--costs .ppl-component__fav {
          background: rgba(0,0,0,0.4);
          color: rgba(255,255,255,0.7);
        }

        .ppl-component--hero .ppl-component__fav:hover,
        .ppl-component--costs .ppl-component__fav:hover {
          background: rgba(0,0,0,0.6);
          color: #f59e0b;
        }

        .ppl-component--hero .ppl-component__fav.active,
        .ppl-component--costs .ppl-component__fav.active {
          background: #f59e0b;
          color: #fff;
        }

        /* Component Previews - Full sections */
        .hero-preview,
        .intro-preview,
        .req-preview,
        .journey-preview,
        .costs-preview,
        .faq-preview,
        .cta-preview {
          min-height: 250px;
          overflow: hidden;
        }

        .hero-preview {
          min-height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          text-align: center;
          position: relative;
        }

        .hero-preview__content {
          padding: 2rem;
          max-width: 600px;
        }

        .hero-preview__label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 1rem;
          opacity: 0.8;
        }

        .hero-preview__title {
          margin: 0 0 1rem;
          line-height: 1.1;
        }

        .hero-preview__title span {
          display: block;
        }

        .hero-preview__subtitle {
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .hero-preview__stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .hero-preview__stats div {
          text-align: center;
        }

        .hero-preview__stats strong {
          display: block;
          font-size: 2rem;
        }

        .hero-preview__stats span {
          font-size: 0.7rem;
          text-transform: uppercase;
          opacity: 0.7;
        }

        .hero-preview__content--split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          max-width: 100%;
          padding: 2rem;
          color: #1a1a1a;
          text-align: left;
        }

        .hero-preview__content--split h1 {
          font-size: 2rem;
          margin: 0 0 1rem;
        }

        .hero-preview__btn {
          padding: 0.75rem 1.5rem;
          background: #1a1a1a;
          color: #fff;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .hero-preview__btn--outline {
          background: transparent;
          border: 1px solid #1a1a1a;
          color: #1a1a1a;
        }

        .hero-preview__image-placeholder {
          background: #e5e5e5;
          height: 100%;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 0.85rem;
        }

        .hero-preview__video-indicator {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(255,255,255,0.2);
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          border-radius: 4px;
        }

        /* Intro Preview */
        .intro-preview {
          background: #fff;
          padding: 4rem 2rem;
        }

        .intro-preview__two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .intro-preview__number {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #999;
          margin-bottom: 0.5rem;
        }

        .intro-preview__text h2 {
          font-size: 1.5rem;
          margin: 0 0 1rem;
        }

        .intro-preview__image-placeholder {
          background: #f5f5f2;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
        }

        .intro-preview__story {
          max-width: 600px;
          margin: 0 auto;
        }

        .intro-preview__inline-image {
          background: #f5f5f2;
          padding: 2rem;
          margin: 1.5rem 0;
          text-align: center;
          color: #999;
        }

        .intro-preview__generic,
        .req-preview__generic,
        .journey-preview__generic,
        .costs-preview__generic,
        .faq-preview__generic,
        .cta-preview__generic {
          padding: 1rem;
          text-align: center;
        }

        .intro-preview__style-note,
        .req-preview__style-note,
        .journey-preview__style-note,
        .costs-preview__style-note,
        .faq-preview__style-note,
        .cta-preview__style-note {
          font-size: 0.85rem;
          color: #999;
          font-style: italic;
          margin: 0.5rem 0 1rem;
        }

        /* Requirements Preview */
        .req-preview {
          background: #faf9f6;
          padding: 4rem 2rem;
        }

        .req-preview__grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1px;
          background: #e5e5e5;
          max-width: 900px;
          margin: 0 auto;
        }

        .req-preview__card {
          background: #fff;
          padding: 1.5rem 1rem;
          text-align: center;
        }

        .req-preview__value {
          display: block;
          font-size: 1.75rem;
          font-weight: 700;
        }

        .req-preview__label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .req-preview__note {
          display: block;
          font-size: 0.7rem;
          color: #999;
        }

        .req-preview__checklist {
          max-width: 400px;
          margin: 0 auto;
        }

        .req-preview__check-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #eee;
        }

        .req-preview__checkbox {
          font-size: 1.25rem;
        }

        .req-preview__mini-grid {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1rem;
        }

        /* Journey Preview */
        .journey-preview {
          background: #fff;
          padding: 4rem 2rem;
        }

        .journey-preview__timeline {
          max-width: 500px;
          margin: 0 auto;
        }

        .journey-preview__stage {
          display: flex;
          gap: 1.5rem;
          padding-bottom: 1.5rem;
          border-left: 2px solid #e5e5e5;
          margin-left: 1rem;
          padding-left: 1.5rem;
          position: relative;
        }

        .journey-preview__marker {
          position: absolute;
          left: -1rem;
          width: 2rem;
          height: 2rem;
          background: #1a1a1a;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .journey-preview__stage-content h4 {
          margin: 0 0 0.25rem;
        }

        .journey-preview__stage-content span {
          font-size: 0.8rem;
          color: #999;
        }

        .journey-preview__horizontal {
          display: flex;
          justify-content: space-between;
          max-width: 800px;
          margin: 0 auto;
        }

        .journey-preview__step {
          text-align: center;
          flex: 1;
        }

        .journey-preview__step-num {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #E04A2F;
        }

        .journey-preview__step-title {
          font-size: 0.8rem;
        }

        .journey-preview__mini-stages {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }

        .journey-preview__mini-stages span {
          background: #f5f5f2;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
        }

        /* Costs Preview */
        .costs-preview {
          background: #1a1a1a;
          padding: 4rem 2rem;
          color: #fff;
        }

        .costs-preview__cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .costs-preview__card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 1.5rem;
          text-align: center;
          position: relative;
        }

        .costs-preview__card--featured {
          border-color: #E04A2F;
          background: rgba(255,255,255,0.1);
        }

        .costs-preview__badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #E04A2F;
          padding: 0.25rem 0.75rem;
          font-size: 0.65rem;
          text-transform: uppercase;
        }

        .costs-preview__card h4 {
          margin: 0 0 1rem;
          font-size: 0.9rem;
        }

        .costs-preview__price {
          font-size: 2rem;
          font-weight: 700;
        }

        .costs-preview__price span {
          font-size: 0.8rem;
          font-weight: 400;
          opacity: 0.7;
        }

        .costs-preview__summary {
          font-size: 1.5rem;
        }

        /* FAQ Preview */
        .faq-preview {
          background: #fff;
          padding: 4rem 2rem;
        }

        .faq-preview__accordion {
          max-width: 600px;
          margin: 0 auto;
        }

        .faq-preview__item {
          border-bottom: 1px solid #eee;
        }

        .faq-preview__question {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
          cursor: pointer;
        }

        .faq-preview__mini {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
          max-width: 400px;
          margin: 0 auto;
        }

        .faq-preview__mini div {
          padding: 0.5rem;
          background: #f5f5f2;
          font-size: 0.85rem;
        }

        /* CTA Preview */
        .cta-preview {
          background: #faf9f6;
          padding: 4rem 2rem;
        }

        .cta-preview__split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: center;
          max-width: 1000px;
          margin: 0 auto;
        }

        .cta-preview__text h2 {
          margin: 0 0 0.5rem;
        }

        .cta-preview__text p {
          color: #666;
          margin-bottom: 1.5rem;
        }

        .cta-preview__buttons {
          display: flex;
          gap: 1rem;
        }

        .cta-preview__btn {
          padding: 0.75rem 1.5rem;
          border: 1px solid #1a1a1a;
          background: transparent;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .cta-preview__btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .cta-preview__image-placeholder {
          background: #e5e5e5;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
        }

        /* Picker Controls */
        .ppl-picker-controls {
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 420px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          z-index: 10000;
          transition: all 0.3s ease;
        }

        .ppl-picker-controls.minimized {
          transform: translateY(calc(100% - 44px));
        }

        .ppl-picker-controls__collapsed {
          display: none;
          height: 44px;
          background: #0a0a0a;
          border-radius: 16px 16px 0 0;
          padding: 0 16px;
          align-items: center;
          justify-content: space-between;
          color: #fff;
          cursor: pointer;
          font-size: 13px;
        }

        .ppl-picker-controls.minimized .ppl-picker-controls__collapsed {
          display: flex;
        }

        .ppl-picker-controls__collapsed-nav {
          display: flex;
          gap: 8px;
        }

        .ppl-picker-controls__collapsed-nav button {
          width: 28px;
          height: 28px;
          border: none;
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-radius: 6px;
          cursor: pointer;
        }

        .ppl-picker-controls__main {
          display: block;
        }

        .ppl-picker-controls.minimized .ppl-picker-controls__main {
          visibility: hidden;
          height: 0;
          overflow: hidden;
        }

        .ppl-picker-controls__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #e5e5e5;
        }

        .ppl-picker-controls__header h3 {
          margin: 0;
          font-size: 14px;
        }

        .ppl-picker-controls__minimize {
          width: 28px;
          height: 28px;
          border: 1px solid #e5e5e5;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
        }

        .ppl-picker-controls__nav {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
        }

        .ppl-picker-controls__nav-btn {
          width: 36px;
          height: 36px;
          border: 1px solid #e5e5e5;
          background: #fff;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }

        .ppl-picker-controls__nav-btn:hover {
          background: #0a0a0a;
          color: #fff;
        }

        .ppl-picker-controls__info {
          flex: 1;
          text-align: center;
        }

        .ppl-picker-controls__counter {
          font-size: 10px;
          color: #999;
        }

        .ppl-picker-controls__info h4 {
          margin: 4px 0;
          font-size: 14px;
        }

        .ppl-picker-controls__info p {
          margin: 0;
          font-size: 11px;
          color: #666;
        }

        .ppl-picker-controls__thumbs {
          display: flex;
          gap: 4px;
          padding: 0 16px 16px;
          flex-wrap: wrap;
        }

        .ppl-picker-controls__thumb {
          width: 32px;
          height: 32px;
          border: 1px solid #e5e5e5;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }

        .ppl-picker-controls__thumb:hover {
          border-color: #333;
        }

        .ppl-picker-controls__thumb.active {
          background: #0a0a0a;
          color: #fff;
          border-color: #0a0a0a;
        }

        .ppl-picker-controls__footer {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          background: #f5f5f5;
          border-top: 1px solid #e5e5e5;
        }

        .ppl-picker-controls__btn {
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 500;
          background: #333;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .ppl-picker-controls__btn--favs.has-items {
          background: #d97706;
        }

        .ppl-picker-controls__btn--copy {
          background: #6366f1;
        }

        .ppl-picker-controls__btn--copy.success {
          background: #22c55e;
        }

        .ppl-picker-controls__btn--copy.error {
          background: #ef4444;
        }

        .ppl-picker-controls__hints {
          display: flex;
          gap: 12px;
          padding: 8px 16px;
          font-size: 10px;
          color: #999;
          border-top: 1px solid #e5e5e5;
          border-radius: 0 0 16px 16px;
        }

        .ppl-picker-controls__hints kbd {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 3px;
          padding: 1px 4px;
          font-family: inherit;
          font-size: 9px;
        }

        /* Modal */
        .ppl-picker-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
        }

        .ppl-picker-modal__content {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          width: 360px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .ppl-picker-modal__header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .ppl-picker-modal__icon {
          color: #f59e0b;
          font-size: 18px;
        }

        .ppl-picker-modal__name {
          font-weight: 600;
          padding: 8px 12px;
          background: #f5f5f5;
          border-radius: 6px;
          margin-bottom: 8px;
        }

        .ppl-picker-modal__style {
          font-size: 12px;
          color: #666;
          margin-bottom: 12px;
        }

        .ppl-picker-modal__input {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          font-size: 13px;
          font-family: inherit;
          resize: none;
          box-sizing: border-box;
        }

        .ppl-picker-modal__input:focus {
          outline: none;
          border-color: #f59e0b;
        }

        .ppl-picker-modal__actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .ppl-picker-modal__actions button {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .ppl-picker-modal__actions button:first-child {
          background: #f5f5f5;
          color: #666;
        }

        .ppl-picker-modal__actions button.primary {
          background: #f59e0b;
          color: #fff;
        }

        /* Favorites Panel */
        .ppl-picker-favs {
          position: fixed;
          bottom: 200px;
          left: 20px;
          width: 400px;
          max-height: 400px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.25);
          z-index: 10001;
          display: flex;
          flex-direction: column;
        }

        .ppl-picker-favs__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #e5e5e5;
        }

        .ppl-picker-favs__header button {
          width: 24px;
          height: 24px;
          border: none;
          background: #f5f5f5;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
        }

        .ppl-picker-favs__list {
          flex: 1;
          overflow-y: auto;
          max-height: 280px;
        }

        .ppl-picker-favs__empty {
          padding: 2rem;
          text-align: center;
          color: #999;
        }

        .ppl-picker-favs__item {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .ppl-picker-favs__item-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ppl-picker-favs__item-name {
          font-weight: 600;
          font-size: 13px;
        }

        .ppl-picker-favs__item-id {
          font-size: 10px;
          color: #999;
          font-family: monospace;
        }

        .ppl-picker-favs__item-style {
          font-size: 11px;
          color: #666;
          margin: 4px 0;
        }

        .ppl-picker-favs__item-note {
          font-size: 12px;
          padding: 6px 10px;
          background: #f5f5f5;
          border-radius: 4px;
          margin: 8px 0;
        }

        .ppl-picker-favs__item-note.empty {
          color: #bbb;
          font-style: italic;
        }

        .ppl-picker-favs__item-actions {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
        }

        .ppl-picker-favs__item-actions button {
          width: 28px;
          height: 28px;
          border: 1px solid #e5e5e5;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
        }

        .ppl-picker-favs__footer {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          border-top: 1px solid #e5e5e5;
        }

        .ppl-picker-favs__footer button {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .ppl-picker-favs__footer button.copy {
          background: #6366f1;
          color: #fff;
        }

        .ppl-picker-favs__footer button.clear {
          background: #f5f5f5;
          color: #666;
        }

        /* ===== NEW VARIATIONS 11-20 STYLES ===== */

        /* Hero Variations 11-20 */
        .hero-preview__bg-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-preview__cinematic {
          position: relative;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-preview__cinematic-overlay {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
          padding: 2rem;
        }

        .hero-preview__cinematic-overlay h1 {
          font-size: 3rem;
          margin: 0.5rem 0;
          text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }

        .hero-preview__letterbox {
          position: absolute;
          left: 0;
          right: 0;
          height: 40px;
          background: #000;
          z-index: 3;
        }

        .hero-preview__letterbox--top { top: 0; }
        .hero-preview__letterbox--bottom { bottom: 0; }

        .hero-preview__instructor,
        .hero-preview__hangar,
        .hero-preview__expedition,
        .hero-preview__sunset,
        .hero-preview__team,
        .hero-preview__scenic {
          position: relative;
          min-height: 400px;
        }

        .hero-preview__instructor-content,
        .hero-preview__dual-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 3rem;
          align-items: center;
          max-width: 1000px;
          margin: 0 auto;
        }

        .hero-preview__instructor-image img,
        .hero-preview__dual-image img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 8px;
        }

        .hero-preview__credentials,
        .hero-preview__facility-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .hero-preview__credentials span,
        .hero-preview__facility-features span {
          background: rgba(0,0,0,0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .hero-preview__cockpit,
        .hero-preview__hangar,
        .hero-preview__expedition,
        .hero-preview__sunset,
        .hero-preview__team,
        .hero-preview__scenic {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-preview__cockpit-overlay,
        .hero-preview__hangar-overlay,
        .hero-preview__expedition-overlay,
        .hero-preview__sunset-overlay,
        .hero-preview__team-overlay,
        .hero-preview__scenic-overlay {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
          padding: 2rem;
          background: rgba(0,0,0,0.4);
          border-radius: 8px;
          max-width: 600px;
        }

        .hero-preview__cockpit-overlay h1,
        .hero-preview__hangar-overlay h1,
        .hero-preview__expedition-overlay h1,
        .hero-preview__sunset-overlay h1,
        .hero-preview__team-overlay h1,
        .hero-preview__scenic-overlay h1 {
          font-size: 2.5rem;
          margin: 0.5rem 0;
        }

        .hero-preview__cockpit-hud {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
          font-family: monospace;
          font-size: 0.8rem;
          color: #4ade80;
        }

        .hero-preview__success {
          background: #faf9f6;
          padding: 3rem;
        }

        .hero-preview__success-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 1000px;
          margin: 0 auto;
          align-items: center;
        }

        .hero-preview__success-image img {
          width: 100%;
          height: 350px;
          object-fit: cover;
          border-radius: 8px;
        }

        .hero-preview__success-stats {
          display: flex;
          gap: 2rem;
          margin-top: 1.5rem;
        }

        .hero-preview__success-stats div {
          text-align: center;
        }

        .hero-preview__success-stats strong {
          display: block;
          font-size: 2.5rem;
          color: #E04A2F;
        }

        .hero-preview__dual {
          background: #f5f5f2;
        }

        .hero-preview__dual-features {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0;
        }

        .hero-preview__dual-features li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .hero-preview__dual-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #22c55e;
        }

        .hero-preview__scenic-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .hero-preview__btn--light {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.5);
          color: #fff;
        }

        .hero-preview__btn--outline-light {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.5);
          color: #fff;
        }

        /* ----- HERO 21-30: New Adventurous Designs ----- */

        /* HERO 21: Film Strip Journey */
        .hero-preview__filmstrip {
          padding: 4rem 2rem;
          background: #1a1a1a;
          color: #fff;
          overflow: hidden;
        }

        .hero-preview__filmstrip-container {
          display: flex;
          align-items: center;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-preview__film-frames {
          display: flex;
          gap: 1rem;
          padding: 1rem 0;
          background: #0a0a0a;
          border-top: 20px solid #333;
          border-bottom: 20px solid #333;
          position: relative;
        }

        .hero-preview__film-frames::before,
        .hero-preview__film-frames::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 8px;
          background: repeating-linear-gradient(90deg, transparent, transparent 10px, #1a1a1a 10px, #1a1a1a 20px);
        }

        .hero-preview__film-frames::before { top: -14px; }
        .hero-preview__film-frames::after { bottom: -14px; }

        .hero-preview__film-frame {
          width: 140px;
          height: 100px;
          flex-shrink: 0;
        }

        .hero-preview__film-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-preview__filmstrip-content h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          margin: 0 0 1rem;
        }

        /* HERO 22-26: Glass, Topo, Magazine, etc. - Generic styling with variations */
        .hero-preview__glass-cockpit,
        .hero-preview__topo-map,
        .hero-preview__magazine,
        .hero-preview__diagonal {
          padding: 4rem 2rem;
          min-height: 400px;
          position: relative;
        }

        .hero-preview__glass-cockpit {
          background: linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%);
          color: #00ff00;
        }

        .hero-preview__avionics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          max-width: 800px;
          margin: 0 auto 2rem;
        }

        .hero-preview__gauge {
          background: rgba(0,0,0,0.5);
          border: 2px solid rgba(0,255,0,0.3);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }

        .hero-preview__gauge-label {
          font-size: 0.7rem;
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .hero-preview__gauge-value {
          font-size: 1.5rem;
          font-family: 'Share Tech Mono', monospace;
          font-weight: 700;
        }

        .hero-preview__cockpit-content {
          text-align: center;
        }

        .hero-preview__cockpit-content h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          color: #fff;
          margin: 0 0 1rem;
        }

        /* HERO 27: METAR Weather Display */
        .hero-preview__metar {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%);
          color: #fff;
        }

        .hero-preview__weather-display {
          max-width: 800px;
          margin: 0 auto 2rem;
        }

        .hero-preview__metar-code {
          background: rgba(0,0,0,0.3);
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .hero-preview__metar-label {
          display: block;
          font-size: 0.75rem;
          color: #64b5f6;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .hero-preview__metar-code code {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.1rem;
          color: #81d4fa;
        }

        .hero-preview__weather-decoded {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .hero-preview__weather-item {
          background: rgba(255,255,255,0.1);
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }

        .hero-preview__weather-item--go {
          background: rgba(40, 167, 69, 0.3);
          border: 1px solid rgba(40, 167, 69, 0.5);
        }

        .hero-preview__weather-icon {
          font-size: 1.5rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .hero-preview__weather-val {
          font-size: 1.2rem;
          font-weight: 700;
          display: block;
        }

        .hero-preview__weather-desc {
          font-size: 0.75rem;
          color: #90caf9;
          text-transform: uppercase;
        }

        .hero-preview__metar-content {
          text-align: center;
        }

        .hero-preview__metar-content h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          margin: 0.5rem 0 1rem;
        }

        /* HERO 28: Brutalist Bold */
        .hero-preview__brutalist {
          padding: 4rem 2rem;
          background: #faf9f6;
          position: relative;
          overflow: hidden;
        }

        .hero-preview__brutalist-bg {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-preview__brutalist-watermark {
          font-size: clamp(15rem, 40vw, 30rem);
          font-weight: 900;
          color: rgba(0,0,0,0.03);
          line-height: 1;
        }

        .hero-preview__brutalist-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .hero-preview__brutalist-stack {
          margin-bottom: 2rem;
        }

        .hero-preview__brutalist-line {
          display: block;
          font-weight: 900;
          line-height: 0.9;
        }

        .hero-preview__brutalist-line--1 {
          font-size: clamp(4rem, 15vw, 10rem);
          color: #1a1a1a;
        }

        .hero-preview__brutalist-line--2 {
          font-size: clamp(2rem, 8vw, 5rem);
          color: #E04A2F;
        }

        .hero-preview__brutalist-line--3 {
          font-size: clamp(4rem, 15vw, 10rem);
          color: #1a1a1a;
        }

        .hero-preview__brutalist-meta {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
          font-size: 0.85rem;
          letter-spacing: 0.2em;
          color: #666;
        }

        .hero-preview__btn--brutalist {
          background: #1a1a1a;
          color: #fff;
          padding: 1rem 2rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        /* HERO 29: Polaroid Memory */
        .hero-preview__polaroid {
          padding: 4rem 2rem;
          background: #e8e4dc;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4rem;
          min-height: 450px;
        }

        .hero-preview__polaroid-scatter {
          display: flex;
          gap: 1rem;
        }

        .hero-preview__polaroid-photo {
          background: #fff;
          padding: 0.75rem 0.75rem 2.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          transition: transform 0.3s ease;
        }

        .hero-preview__polaroid-photo:hover {
          transform: scale(1.05) !important;
          z-index: 10;
        }

        .hero-preview__polaroid-photo img {
          width: 140px;
          height: 140px;
          object-fit: cover;
        }

        .hero-preview__polaroid-photo span {
          display: block;
          text-align: center;
          margin-top: 0.75rem;
          font-family: 'Caveat', cursive, sans-serif;
          font-size: 1rem;
          color: #333;
        }

        .hero-preview__polaroid-content {
          max-width: 350px;
        }

        .hero-preview__polaroid-content h1 {
          font-size: clamp(2rem, 4vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          line-height: 1.2;
        }

        /* HERO 30: Testimonial Hero */
        .hero-preview__testimonial-hero {
          padding: 4rem 2rem;
          position: relative;
          min-height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-preview__testimonial-bg {
          position: absolute;
          inset: 0;
        }

        .hero-preview__testimonial-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.3);
        }

        .hero-preview__testimonial-content {
          position: relative;
          z-index: 1;
          text-align: center;
          color: #fff;
          max-width: 700px;
        }

        .hero-preview__quote-mark {
          font-size: 6rem;
          color: #E04A2F;
          line-height: 0.5;
          font-family: Georgia, serif;
        }

        .hero-preview__testimonial-quote {
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          font-style: italic;
          line-height: 1.6;
          margin: 0 0 2rem;
        }

        .hero-preview__testimonial-author {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .hero-preview__author-avatar {
          width: 50px;
          height: 50px;
          background: #E04A2F;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .hero-preview__author-info {
          text-align: left;
        }

        .hero-preview__author-info strong {
          display: block;
        }

        .hero-preview__author-info span {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .hero-preview__testimonial-cta span {
          display: block;
          margin-bottom: 1rem;
          color: #E04A2F;
        }

        /* HERO 31-40: Dynamic variations fallback */
        .hero-preview__dynamic {
          padding: 4rem 2rem;
          position: relative;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-preview__dynamic-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .hero-preview__dynamic-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
          z-index: 1;
        }

        .hero-preview__dynamic-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 600px;
        }

        .hero-preview__dynamic-content h1 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1rem;
        }

        /* Intro Variations 11-20 */
        .intro-preview__photo-essay {
          padding: 2rem;
        }

        .intro-preview__essay-images {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .intro-preview__essay-images img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .intro-preview__essay-caption {
          text-align: center;
          font-size: 1.1rem;
          color: #666;
          font-style: italic;
        }

        .intro-preview__instructor-bio {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 2rem;
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .intro-preview__bio-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 8px;
        }

        .intro-preview__bio-credentials {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .intro-preview__bio-credentials span {
          background: #f5f5f2;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .intro-preview__pillars {
          text-align: center;
          padding: 2rem;
        }

        .intro-preview__pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 2rem;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .intro-preview__pillar {
          padding: 1.5rem;
          background: #f5f5f2;
          border-radius: 8px;
        }

        .intro-preview__pillar-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 1rem;
        }

        .intro-preview__styled {
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .intro-preview__styled-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .intro-preview__styled-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          align-items: start;
          margin-top: 1.5rem;
        }

        .intro-preview__styled-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
        }

        .intro-preview__inline-img {
          width: 100%;
          max-width: 400px;
          height: 150px;
          object-fit: cover;
          margin: 1.5rem auto;
          display: block;
        }

        /* Requirements Variations 11-20 */
        .req-preview__enhanced {
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .req-preview__enhanced-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
          margin: 2rem 0;
        }

        .req-preview__enhanced-item {
          background: #fff;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .req-preview__enhanced-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #E04A2F;
        }

        .req-preview__enhanced-label {
          font-weight: 600;
          font-size: 0.85rem;
        }

        .req-preview__enhanced-note {
          font-size: 0.75rem;
          color: #999;
        }

        .req-preview__enhanced-cta {
          margin-top: 1.5rem;
          color: #666;
        }

        .req-preview__enhanced-cta a {
          color: #E04A2F;
        }

        /* Journey Variations 11-20 */
        .journey-preview__logbook {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 2rem;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .journey-preview__logbook-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .journey-preview__logbook-stages {
          margin-top: 1.5rem;
        }

        .journey-preview__logbook-entry {
          display: flex;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px dashed #ddd;
          align-items: center;
        }

        .journey-preview__logbook-phase {
          font-weight: 700;
          color: #E04A2F;
        }

        .journey-preview__logbook-title {
          flex: 1;
        }

        .journey-preview__logbook-hours {
          color: #666;
          font-size: 0.85rem;
        }

        .journey-preview__enhanced {
          padding: 2rem;
          text-align: center;
        }

        .journey-preview__enhanced-timeline {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .journey-preview__enhanced-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .journey-preview__enhanced-number {
          width: 50px;
          height: 50px;
          background: #E04A2F;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        /* Costs Variations 11-20 */
        .costs-preview__breakdown {
          padding: 2rem;
          max-width: 700px;
          margin: 0 auto;
        }

        .costs-preview__breakdown-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .costs-preview__breakdown-item {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
        }

        .costs-preview__breakdown-item--highlight {
          grid-column: span 2;
          background: rgba(224, 74, 47, 0.2);
        }

        .costs-preview__breakdown-value {
          font-weight: 700;
        }

        .costs-preview__breakdown-note {
          margin-top: 1rem;
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .costs-preview__aircraft {
          padding: 2rem;
          background: #fff;
          color: #1a1a1a;
        }

        .costs-preview__aircraft h3 {
          text-align: center;
          margin-bottom: 2rem;
        }

        .costs-preview__aircraft-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          max-width: 700px;
          margin: 0 auto;
        }

        .costs-preview__aircraft-card {
          background: #f5f5f2;
          padding: 1.5rem;
          border-radius: 8px;
          position: relative;
        }

        .costs-preview__aircraft-card--popular {
          border: 2px solid #E04A2F;
        }

        .costs-preview__aircraft-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #E04A2F;
          margin-top: 1rem;
        }

        .costs-preview__enhanced {
          padding: 3rem;
          text-align: center;
        }

        .costs-preview__enhanced-price {
          margin: 2rem 0;
        }

        .costs-preview__enhanced-from {
          display: block;
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .costs-preview__enhanced-amount {
          display: block;
          font-size: 3rem;
          font-weight: 700;
        }

        .costs-preview__enhanced-note {
          display: block;
          font-size: 0.85rem;
          opacity: 0.6;
        }

        .costs-preview__btn {
          padding: 0.75rem 2rem;
          background: #E04A2F;
          color: #fff;
          border: none;
          cursor: pointer;
          font-size: 1rem;
        }

        /* FAQ Variations 11-20 */
        .faq-preview__enhanced {
          padding: 2rem;
          max-width: 700px;
          margin: 0 auto;
        }

        .faq-preview__enhanced-list {
          margin: 1.5rem 0;
        }

        .faq-preview__enhanced-item {
          padding: 1rem;
          background: #f5f5f2;
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }

        .faq-preview__enhanced-q {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .faq-preview__enhanced-a {
          color: #666;
          font-size: 0.9rem;
        }

        .faq-preview__enhanced-more {
          text-align: center;
        }

        .faq-preview__enhanced-more a {
          color: #E04A2F;
        }

        /* CTA Variations 11-20 */
        .cta-preview__trial {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 2rem;
          align-items: center;
        }

        .cta-preview__trial-content {
          text-align: center;
        }

        .cta-preview__trial-price {
          margin: 1.5rem 0;
        }

        .cta-preview__trial-amount {
          display: block;
          font-size: 3rem;
          font-weight: 700;
          color: #E04A2F;
        }

        .cta-preview__trial-note {
          font-size: 0.9rem;
          color: #666;
        }

        .cta-preview__trial-reassurance {
          font-size: 0.85rem;
          color: #999;
          margin-top: 1rem;
        }

        .cta-preview__trial-image img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 8px;
        }

        .cta-preview__btn--large {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        .cta-preview__call {
          text-align: center;
          padding: 3rem;
        }

        .cta-preview__phone {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          color: #E04A2F;
          text-decoration: none;
          margin: 1rem 0;
        }

        .cta-preview__hours {
          color: #666;
          margin-bottom: 1.5rem;
        }

        .cta-preview__call-alt {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #999;
        }

        .cta-preview__visit {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .cta-preview__map-placeholder {
          background: #e5e5e5;
          height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #666;
        }

        .cta-preview__visit-info {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .cta-preview__visit-info button {
          margin-top: 0.5rem;
        }

        .cta-preview__enhanced {
          text-align: center;
          padding: 3rem;
        }

        .cta-preview__enhanced-actions {
          margin: 2rem 0;
        }

        .cta-preview__enhanced-secondary {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1rem;
        }

        .cta-preview__enhanced-secondary a {
          color: #666;
        }

        .cta-preview__enhanced-trust {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
        }

        /* ===== NEW VARIATION STYLES - ADVENTUROUS DESIGNS ===== */

        /* ----- INTRO 21: Instructor Network with animated lines ----- */
        .intro-preview__instructor-network {
          padding: 4rem 2rem;
          background: linear-gradient(180deg, #faf9f6 0%, #fff 100%);
        }

        .intro-preview__network-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .intro-preview__network-header h2 {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          margin: 0.5rem 0 1rem;
        }

        .intro-preview__accent {
          color: #E04A2F;
        }

        .intro-preview__network-tagline {
          color: #666;
          line-height: 1.7;
          font-size: 1.05rem;
        }

        .intro-preview__network-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .intro-preview__network-center {
          position: relative;
          display: flex;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .intro-preview__q-card {
          display: flex;
          gap: 2rem;
          background: #fff;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          max-width: 600px;
          position: relative;
          z-index: 2;
        }

        .intro-preview__q-card img {
          width: 150px;
          height: 150px;
          border-radius: 12px;
          object-fit: cover;
        }

        .intro-preview__q-info h3 {
          margin: 0 0 0.25rem;
          font-size: 1.5rem;
        }

        .intro-preview__q-title {
          color: #E04A2F;
          font-weight: 500;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 1rem;
        }

        .intro-preview__q-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .intro-preview__q-stats span {
          background: #f5f5f2;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
        }

        .intro-preview__q-stats strong {
          color: #E04A2F;
        }

        .intro-preview__q-dedication {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        /* Animated SVG lines */
        .intro-preview__network-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 1;
          pointer-events: none;
        }

        .intro-preview__network-line {
          stroke: #E04A2F;
          stroke-width: 2;
          fill: none;
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: drawLine 1.5s ease-out forwards;
        }

        .intro-preview__network-line--1 { animation-delay: 0.5s; }
        .intro-preview__network-line--2 { animation-delay: 0.7s; }
        .intro-preview__network-line--3 { animation-delay: 0.9s; }
        .intro-preview__network-line--4 { animation-delay: 1.1s; }

        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }

        .intro-preview__team-grid {
          text-align: center;
        }

        .intro-preview__meet-team {
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .intro-preview__instructors {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .intro-preview__instructor-card {
          background: #fff;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          text-align: center;
          min-width: 140px;
        }

        .intro-preview__instructor-avatar {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        .intro-preview__instructor-card span {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .intro-preview__instructor-card small {
          color: #999;
          font-size: 0.8rem;
        }

        .intro-preview__network-promise {
          text-align: center;
          max-width: 600px;
          margin: 2rem auto 0;
          padding: 1.5rem;
          background: #f5f5f2;
          border-radius: 12px;
        }

        .intro-preview__network-promise p {
          margin: 0;
          color: #666;
          font-style: italic;
        }

        /* ----- INTRO 22: Why HQ - Three Reasons ----- */
        .intro-preview__why-hq {
          padding: 4rem 2rem;
          background: #fff;
        }

        .intro-preview__why-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .intro-preview__why-header h2 {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          margin: 0.5rem 0 0;
        }

        .intro-preview__why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .intro-preview__why-card {
          background: #faf9f6;
          border-radius: 16px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .intro-preview__why-number {
          font-size: 4rem;
          font-weight: 900;
          color: rgba(224, 74, 47, 0.1);
          position: absolute;
          top: -10px;
          right: 10px;
          line-height: 1;
        }

        .intro-preview__why-card h3 {
          margin: 0 0 0.75rem;
          font-size: 1.3rem;
          position: relative;
        }

        .intro-preview__why-card p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
          position: relative;
        }

        .intro-preview__why-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
        }

        /* ----- INTRO 23: Heritage Timeline ----- */
        .intro-preview__heritage {
          padding: 4rem 2rem;
          background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
          color: #fff;
        }

        .intro-preview__heritage-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .intro-preview__heritage-header h2 {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          margin: 0.5rem 0 0;
        }

        .intro-preview__heritage-timeline {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
          max-width: 1000px;
          margin: 0 auto;
        }

        .intro-preview__heritage-item {
          text-align: center;
          max-width: 200px;
        }

        .intro-preview__heritage-year {
          display: inline-block;
          background: #E04A2F;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .intro-preview__heritage-content h4 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
        }

        .intro-preview__heritage-content p {
          margin: 0;
          font-size: 0.9rem;
          color: #999;
        }

        /* ----- INTRO 24: Stats Dashboard ----- */
        .intro-preview__stats-dashboard {
          padding: 4rem 2rem;
          background: #faf9f6;
        }

        .intro-preview__stats-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .intro-preview__stats-header h2 {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          margin: 0;
        }

        .intro-preview__stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .intro-preview__stat-card {
          background: #fff;
          padding: 2rem 1.5rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }

        .intro-preview__stat-card--large {
          grid-column: span 2;
        }

        .intro-preview__stat-num {
          font-size: 3rem;
          font-weight: 700;
          color: #E04A2F;
          display: block;
          line-height: 1;
        }

        .intro-preview__stat-unit {
          font-size: 1.5rem;
          color: #E04A2F;
          font-weight: 600;
        }

        .intro-preview__stat-desc {
          display: block;
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        /* ----- REQ 21: Falling Cards Animation ----- */
        .req-preview__falling {
          padding: 4rem 2rem;
          background: #faf9f6;
        }

        .req-preview__falling-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .req-preview__falling-header h2 {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          margin: 0.5rem 0 0;
        }

        .req-preview__falling-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .req-preview__falling-card {
          background: #fff;
          padding: 1.5rem 1rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .req-preview__falling-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 50px rgba(0,0,0,0.15);
        }

        .req-preview__falling-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #E04A2F;
          font-family: 'Share Tech Mono', monospace;
        }

        .req-preview__falling-label {
          font-weight: 600;
          margin: 0.5rem 0 0.25rem;
          font-size: 0.95rem;
        }

        .req-preview__falling-note {
          color: #999;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .req-preview__falling-note-text {
          text-align: center;
          color: #666;
          margin-top: 2rem;
        }

        /* ----- COST 21: Detailed Hourly Breakdown ----- */
        .costs-preview__hourly {
          padding: 4rem 2rem;
          background: linear-gradient(180deg, #fff 0%, #faf9f6 100%);
        }

        .costs-preview__hourly-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .costs-preview__hourly-header h2 {
          margin: 0.5rem 0;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
        }

        .costs-preview__hourly-header p {
          color: #666;
        }

        .costs-preview__hourly-table {
          max-width: 700px;
          margin: 0 auto;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        }

        .costs-preview__hourly-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
          gap: 2rem;
        }

        .costs-preview__hourly-row--header {
          background: #1a1a1a;
          color: #fff;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .costs-preview__hourly-row--popular {
          background: linear-gradient(90deg, #fef3f2 0%, #fff 100%);
          border-left: 4px solid #E04A2F;
        }

        .costs-preview__aircraft-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .costs-preview__aircraft-info strong {
          font-size: 1.1rem;
        }

        .costs-preview__aircraft-info small {
          color: #999;
          font-size: 0.85rem;
        }

        .costs-preview__badge-small {
          display: inline-block;
          background: #E04A2F;
          color: #fff;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          text-transform: uppercase;
          font-weight: 600;
          margin-left: 0.5rem;
        }

        .costs-preview__hourly-rate {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .costs-preview__hourly-rate small {
          color: #999;
          font-weight: 400;
        }

        .costs-preview__hourly-total {
          font-weight: 700;
          color: #E04A2F;
          font-size: 1.2rem;
        }

        .costs-preview__hourly-included {
          max-width: 700px;
          margin: 2rem auto;
          background: linear-gradient(90deg, #d4edda 0%, #c3e6cb 100%);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }

        .costs-preview__included-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .costs-preview__included-icon {
          width: 32px;
          height: 32px;
          background: #28a745;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .costs-preview__included-text {
          font-weight: 600;
          font-size: 1.1rem;
          color: #155724;
        }

        .costs-preview__included-value {
          background: #28a745;
          color: #fff;
          padding: 0.35rem 1rem;
          border-radius: 20px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .costs-preview__included-note {
          margin: 0;
          color: #155724;
          font-size: 0.9rem;
        }

        .costs-preview__hourly-additional {
          max-width: 700px;
          margin: 2rem auto 0;
        }

        .costs-preview__hourly-additional h4 {
          margin: 0 0 1rem;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
        }

        .costs-preview__hourly-extras {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .costs-preview__extra-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: #f5f5f2;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .costs-preview__extra-item span:last-child {
          font-weight: 600;
        }

        .costs-preview__hourly-cta {
          text-align: center;
          margin-top: 2.5rem;
        }

        .costs-preview__hourly-financing {
          margin-top: 0.75rem;
          color: #666;
          font-size: 0.9rem;
        }

        /* ----- FAQ 21: Video FAQ ----- */
        .faq-preview__video {
          padding: 4rem 2rem;
          background: #faf9f6;
        }

        .faq-preview__video-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .faq-preview__video-header h2 {
          margin: 0.5rem 0;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
        }

        .faq-preview__video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .faq-preview__video-item {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .faq-preview__video-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }

        .faq-preview__video-item--featured {
          grid-column: span 2;
        }

        .faq-preview__video-thumb {
          height: 100px;
          background: linear-gradient(135deg, #333 0%, #1a1a1a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .faq-preview__video-thumb--featured {
          height: 120px;
        }

        .faq-preview__video-play {
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.2);
          border: 2px solid #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .faq-preview__video-thumb:hover .faq-preview__video-play {
          background: rgba(255,255,255,0.3);
          transform: scale(1.1);
        }

        .faq-preview__video-duration {
          position: absolute;
          bottom: 8px;
          right: 10px;
          background: rgba(0,0,0,0.7);
          color: #fff;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-family: 'Share Tech Mono', monospace;
        }

        .faq-preview__video-item h4 {
          padding: 1rem 1rem 0;
          margin: 0;
          font-size: 1rem;
        }

        .faq-preview__video-item p {
          padding: 0.5rem 1rem 1rem;
          margin: 0;
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .faq-preview__video-answer--detailed {
          padding: 0.5rem 1rem 1.5rem;
        }

        .faq-preview__video-answer--detailed p {
          padding: 0;
          margin-bottom: 0.75rem;
        }

        .faq-preview__video-answer--detailed p:last-child {
          margin-bottom: 0;
        }

        .faq-preview__video-highlight {
          background: linear-gradient(90deg, #d4edda 0%, #c3e6cb 100%);
          padding: 1rem !important;
          border-radius: 8px;
          color: #155724 !important;
          border-left: 4px solid #28a745;
        }

        .faq-preview__video-cta {
          text-align: center;
          margin-top: 2.5rem;
        }

        .faq-preview__video-cta p {
          margin-bottom: 1rem;
          color: #666;
        }

        .faq-preview__btn {
          padding: 0.75rem 1.5rem;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s;
        }

        .faq-preview__btn:hover {
          background: #333;
        }

        /* ----- CTA 21: Discovery Flight Hero ----- */
        .cta-preview__discovery {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #faf9f6 0%, #fff 100%);
        }

        .cta-preview__discovery-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 3rem;
          max-width: 1100px;
          margin: 0 auto;
          align-items: center;
        }

        .cta-preview__discovery-text h2 {
          font-size: clamp(2rem, 4vw, 2.8rem);
          margin: 0.5rem 0 1rem;
          line-height: 1.2;
        }

        .cta-preview__accent {
          color: #E04A2F;
        }

        .cta-preview__discovery-tagline {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .cta-preview__discovery-features {
          margin-bottom: 2rem;
        }

        .cta-preview__discovery-feature {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .cta-preview__feature-icon {
          font-size: 1.5rem;
        }

        .cta-preview__discovery-feature strong {
          display: block;
          margin-bottom: 0.2rem;
        }

        .cta-preview__discovery-feature small {
          color: #999;
          font-size: 0.85rem;
        }

        .cta-preview__discovery-pricing {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .cta-preview__discovery-price {
          display: flex;
          flex-direction: column;
        }

        .cta-preview__price-from {
          font-size: 0.85rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .cta-preview__price-amount {
          font-size: 3rem;
          font-weight: 700;
          color: #E04A2F;
          line-height: 1;
        }

        .cta-preview__discovery-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cta-preview__btn--outline {
          background: transparent;
          border: 2px solid #1a1a1a;
          color: #1a1a1a;
        }

        .cta-preview__btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .cta-preview__discovery-reassurance {
          font-size: 0.85rem;
          color: #999;
        }

        .cta-preview__discovery-image {
          position: relative;
        }

        .cta-preview__discovery-image img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .cta-preview__discovery-badge {
          position: absolute;
          bottom: -10px;
          left: 20px;
          background: #fff;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .cta-preview__discovery-badge span {
          display: block;
          font-weight: 700;
          color: #f59e0b;
        }

        .cta-preview__discovery-badge small {
          color: #666;
          font-size: 0.8rem;
        }

        /* ----- CTA 22: Helicopter Tour ----- */
        .cta-preview__tour {
          padding: 4rem 2rem;
          background: #fff;
        }

        .cta-preview__tour-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .cta-preview__tour-image img {
          width: 100%;
          height: 100%;
          min-height: 400px;
          object-fit: cover;
          border-radius: 16px;
        }

        .cta-preview__tour-text {
          padding: 1rem 0;
        }

        .cta-preview__tour-text h2 {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          margin: 0.5rem 0 1.5rem;
        }

        .cta-preview__tour-tagline {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .cta-preview__tour-fleet {
          background: #f5f5f2;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .cta-preview__tour-fleet h4 {
          margin: 0 0 0.75rem;
          font-size: 0.9rem;
          color: #666;
        }

        .cta-preview__tour-aircraft {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .cta-preview__tour-aircraft span {
          background: #fff;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .cta-preview__tour-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .cta-preview__tour-location,
        .cta-preview__tour-hours {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .cta-preview__tour-icon {
          font-size: 1.3rem;
        }

        .cta-preview__tour-location strong,
        .cta-preview__tour-hours strong {
          display: block;
        }

        .cta-preview__tour-location small,
        .cta-preview__tour-hours small {
          color: #999;
          font-size: 0.85rem;
        }

        .cta-preview__tour-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .cta-preview__tour-note {
          font-size: 0.85rem;
          color: #999;
        }

        .cta-preview__tour-map {
          margin-top: 2rem;
        }

        .cta-preview__map-container {
          background: #e5e5e5;
          border-radius: 12px;
          overflow: hidden;
        }

        .cta-preview__map-placeholder {
          height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .cta-preview__map-placeholder span {
          font-size: 2rem;
        }

        .cta-preview__map-placeholder p {
          margin: 0;
          font-weight: 600;
        }

        .cta-preview__map-placeholder small {
          color: #999;
          font-family: 'Share Tech Mono', monospace;
        }

        /* ----- REQ 22: Radar Display ----- */
        .req-preview__radar {
          padding: 4rem 2rem;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }

        .req-preview__radar-screen {
          width: 400px;
          height: 400px;
          margin: 0 auto;
          position: relative;
          background: radial-gradient(circle at center, rgba(0, 255, 0, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          border: 2px solid rgba(0, 255, 0, 0.3);
        }

        .req-preview__radar-sweep {
          position: absolute;
          width: 50%;
          height: 50%;
          top: 0;
          left: 50%;
          transform-origin: bottom left;
          background: linear-gradient(90deg, transparent 0%, rgba(0, 255, 0, 0.3) 100%);
          animation: radarSweep 3s linear infinite;
        }

        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .req-preview__radar-rings {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .req-preview__radar-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(0, 255, 0, 0.2);
        }

        .req-preview__radar-ring:nth-child(1) { width: 33%; height: 33%; }
        .req-preview__radar-ring:nth-child(2) { width: 66%; height: 66%; }
        .req-preview__radar-ring:nth-child(3) { width: 100%; height: 100%; }

        .req-preview__radar-blip {
          position: absolute;
          text-align: center;
          animation: blipPulse 2s ease-in-out infinite;
        }

        @keyframes blipPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        .req-preview__blip-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #00ff00;
          font-family: 'Share Tech Mono', monospace;
        }

        .req-preview__blip-label {
          display: block;
          font-size: 0.75rem;
          color: rgba(0, 255, 0, 0.7);
          text-transform: uppercase;
        }

        .req-preview__radar-header {
          text-align: center;
          margin-top: 2rem;
          color: #fff;
        }

        .req-preview__radar-header h3 {
          margin: 0;
          color: #00ff00;
        }

        .req-preview__radar-status {
          font-family: 'Share Tech Mono', monospace;
          background: #00ff00;
          color: #000;
          padding: 0.2rem 0.5rem;
          border-radius: 2px;
          font-size: 0.75rem;
          margin-left: 0.5rem;
        }

        /* ----- REQ 23: Glass Morphism ----- */
        .req-preview__glass {
          padding: 4rem 2rem;
          position: relative;
          min-height: 400px;
        }

        .req-preview__glass-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .req-preview__glass-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .req-preview__glass-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
        }

        .req-preview__glass-content h3 {
          color: #fff;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
          text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }

        .req-preview__glass-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }

        .req-preview__glass-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 1.5rem 1rem;
          text-align: center;
          color: #fff;
        }

        .req-preview__glass-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
        }

        .req-preview__glass-label {
          display: block;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .req-preview__glass-note {
          display: block;
          font-size: 0.8rem;
          opacity: 0.7;
        }

        /* ----- REQ 24: Paper Checklist ----- */
        .req-preview__paper {
          padding: 4rem 2rem;
          background: #e8e4dc;
          display: flex;
          justify-content: center;
        }

        .req-preview__paper-sheet {
          background: #fff;
          box-shadow: 5px 5px 30px rgba(0,0,0,0.1), -2px -2px 10px rgba(255,255,255,0.5);
          padding: 3rem;
          max-width: 500px;
          width: 100%;
          position: relative;
          transform: rotate(-1deg);
        }

        .req-preview__paper-sheet::before {
          content: '';
          position: absolute;
          top: 0;
          left: 40px;
          right: 40px;
          height: 20px;
          background: repeating-linear-gradient(90deg, transparent, transparent 5px, #eee 5px, #eee 6px);
        }

        .req-preview__paper-header {
          text-align: center;
          margin-bottom: 2rem;
          border-bottom: 2px solid #1a1a1a;
          padding-bottom: 1rem;
        }

        .req-preview__paper-header h3 {
          margin: 0;
          font-size: 1.3rem;
          letter-spacing: 0.2em;
        }

        .req-preview__paper-subtitle {
          color: #666;
          font-size: 0.85rem;
        }

        .req-preview__paper-list {
          margin-bottom: 2rem;
        }

        .req-preview__paper-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px dashed #ccc;
          font-size: 0.9rem;
        }

        .req-preview__paper-check {
          color: #28a745;
          margin-right: 0.75rem;
          font-size: 1.2rem;
        }

        .req-preview__paper-text {
          flex: 1;
          font-weight: 500;
        }

        .req-preview__paper-dots {
          color: #ccc;
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          margin: 0 0.5rem;
        }

        .req-preview__paper-value {
          font-weight: 700;
          color: #E04A2F;
        }

        .req-preview__paper-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #666;
          font-style: italic;
        }

        /* ----- REQ 25: Badge Collection ----- */
        .req-preview__badges {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        }

        .req-preview__badges-header {
          text-align: center;
          color: #fff;
          margin-bottom: 2rem;
        }

        .req-preview__badges-header h3 {
          margin: 0.5rem 0 0;
          font-size: 2rem;
        }

        .req-preview__badges-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .req-preview__badge-item {
          background: linear-gradient(180deg, #333 0%, #222 100%);
          border-radius: 12px;
          padding: 1.5rem 1rem;
          text-align: center;
          position: relative;
          border: 2px solid #444;
        }

        .req-preview__badge-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .req-preview__badge-value {
          display: block;
          font-size: 1.8rem;
          font-weight: 700;
          color: #E04A2F;
        }

        .req-preview__badge-label {
          display: block;
          color: #fff;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .req-preview__badge-ribbon {
          background: #E04A2F;
          color: #fff;
          padding: 0.25rem 0.75rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 4px;
          white-space: nowrap;
        }

        .req-preview__badges-progress {
          text-align: center;
          margin-top: 2rem;
          color: #888;
          font-size: 0.9rem;
        }

        /* ----- JOURNEY 21: Flight Path SVG ----- */
        .journey-preview__flightpath {
          padding: 4rem 2rem;
          background: linear-gradient(180deg, #e8f4ff 0%, #fff 100%);
        }

        .journey-preview__flightpath-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .journey-preview__flightpath-header h3 {
          margin: 0.5rem 0 0;
          font-size: 2rem;
        }

        .journey-preview__flightpath-svg {
          width: 100%;
          max-width: 1000px;
          height: auto;
          margin: 0 auto;
          display: block;
        }

        .journey-preview__flightpath-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawPath 3s ease-out forwards;
        }

        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }

        /* ----- JOURNEY 22: Mountain Climb ----- */
        .journey-preview__mountain {
          padding: 4rem 2rem;
          background: #1a1a1a;
          position: relative;
          min-height: 450px;
          overflow: hidden;
        }

        .journey-preview__mountain-bg {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 350px;
        }

        .journey-preview__mountain-svg {
          width: 100%;
          height: 100%;
        }

        .journey-preview__mountain-stages {
          position: absolute;
          inset: 0;
        }

        .journey-preview__mountain-camp {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.95);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .journey-preview__camp-flag {
          font-size: 1.5rem;
        }

        .journey-preview__camp-info strong {
          display: block;
          font-size: 0.9rem;
        }

        .journey-preview__camp-info span {
          font-size: 0.75rem;
          color: #666;
        }

        .journey-preview__mountain-summit {
          position: absolute;
          top: 10%;
          right: 15%;
          text-align: center;
          color: #fff;
        }

        .journey-preview__mountain-summit span {
          font-size: 3rem;
        }

        .journey-preview__mountain-summit strong {
          display: block;
          font-size: 0.9rem;
          color: #f59e0b;
        }

        .journey-preview__mountain-header {
          position: relative;
          z-index: 1;
          color: #fff;
          text-align: center;
        }

        .journey-preview__mountain-header h3 {
          margin: 0;
          font-size: 2rem;
        }

        .journey-preview__mountain-header p {
          opacity: 0.7;
        }

        /* ----- JOURNEY 23: Metro Map ----- */
        .journey-preview__metro {
          padding: 4rem 2rem;
          background: #fff;
        }

        .journey-preview__metro-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .journey-preview__metro-header h3 {
          margin: 0;
          font-size: 1.8rem;
        }

        .journey-preview__metro-brand {
          background: #E04A2F;
          color: #fff;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
        }

        .journey-preview__metro-map {
          position: relative;
          height: 150px;
          max-width: 900px;
          margin: 0 auto;
        }

        .journey-preview__metro-line {
          position: absolute;
          top: 50%;
          left: 5%;
          right: 5%;
          height: 8px;
          background: #E04A2F;
          border-radius: 4px;
          transform: translateY(-50%);
        }

        .journey-preview__metro-station {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .journey-preview__metro-dot {
          width: 24px;
          height: 24px;
          background: #fff;
          border: 4px solid #E04A2F;
          border-radius: 50%;
          margin: 0 auto 0.5rem;
        }

        .journey-preview__metro-dot--end {
          background: #28a745;
          border-color: #28a745;
        }

        .journey-preview__metro-name {
          font-weight: 600;
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .journey-preview__metro-time {
          font-size: 0.75rem;
          color: #666;
        }

        .journey-preview__metro-legend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
          font-size: 0.85rem;
          color: #666;
        }

        .journey-preview__metro-line-indicator {
          width: 30px;
          height: 6px;
          background: #E04A2F;
          border-radius: 3px;
        }

        /* ----- JOURNEY 24: Space Mission ----- */
        .journey-preview__space {
          padding: 4rem 2rem;
          background: linear-gradient(180deg, #0a0a20 0%, #1a1a40 100%);
          color: #fff;
        }

        .journey-preview__space-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .journey-preview__space-logo {
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          color: #888;
          display: block;
          margin-bottom: 0.5rem;
        }

        .journey-preview__space-header h3 {
          margin: 0;
          font-size: 2.5rem;
          letter-spacing: 0.1em;
          font-family: 'Share Tech Mono', monospace;
        }

        .journey-preview__space-phases {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .journey-preview__space-phase {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
        }

        .journey-preview__phase-number {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .journey-preview__phase-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-family: 'Share Tech Mono', monospace;
        }

        .journey-preview__phase-duration {
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 0.75rem;
        }

        .journey-preview__phase-status {
          font-size: 0.75rem;
          font-family: 'Share Tech Mono', monospace;
        }

        .journey-preview__phase-status.active {
          color: #00ff00;
        }

        .journey-preview__space-mission-end {
          text-align: center;
          margin-top: 2rem;
          font-family: 'Share Tech Mono', monospace;
        }

        .journey-preview__space-mission-end span:first-child {
          font-size: 3rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .journey-preview__space-mission-end span:last-child {
          color: #00ff00;
          letter-spacing: 0.1em;
        }

        /* ----- CTA 23: Glass Contact ----- */
        .cta-preview__glass-contact {
          padding: 4rem 2rem;
          position: relative;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cta-preview__glass-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .cta-preview__glass-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7);
        }

        .cta-preview__glass-card {
          position: relative;
          z-index: 1;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 24px;
          padding: 3rem;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        .cta-preview__glass-header {
          margin-bottom: 2rem;
        }

        .cta-preview__glass-header img {
          filter: brightness(0) invert(1);
          margin-bottom: 1rem;
        }

        .cta-preview__glass-header h3 {
          margin: 0;
          color: #fff;
          font-size: 1.5rem;
        }

        .cta-preview__glass-options {
          margin-bottom: 2rem;
        }

        .cta-preview__glass-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          margin-bottom: 0.75rem;
          color: #fff;
          text-decoration: none;
          transition: background 0.3s;
        }

        .cta-preview__glass-option:hover {
          background: rgba(255,255,255,0.2);
        }

        .cta-preview__glass-icon {
          font-size: 1.5rem;
        }

        /* ----- CTA 24: Countdown Offer ----- */
        .cta-preview__countdown-offer {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #E04A2F 0%, #c43d26 100%);
          text-align: center;
          color: #fff;
        }

        .cta-preview__countdown-header {
          margin-bottom: 2rem;
        }

        .cta-preview__label--urgent {
          background: #fff;
          color: #E04A2F;
          padding: 0.35rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .cta-preview__countdown-header h2 {
          margin: 0 0 0.5rem;
          font-size: 2.5rem;
        }

        .cta-preview__countdown-timer {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .cta-preview__timer-unit {
          background: rgba(0,0,0,0.2);
          padding: 1rem 1.5rem;
          border-radius: 8px;
        }

        .cta-preview__timer-num {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          font-family: 'Share Tech Mono', monospace;
        }

        .cta-preview__timer-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .cta-preview__timer-sep {
          font-size: 2rem;
          font-weight: 700;
          align-self: center;
        }

        .cta-preview__countdown-pricing {
          margin-bottom: 2rem;
        }

        .cta-preview__original-price {
          font-size: 1.5rem;
          text-decoration: line-through;
          opacity: 0.6;
          margin-right: 1rem;
        }

        .cta-preview__sale-price {
          font-size: 3rem;
          font-weight: 700;
        }

        .cta-preview__btn--urgent {
          background: #fff;
          color: #E04A2F;
          font-size: 1.1rem;
          padding: 1rem 2rem;
        }

        .cta-preview__btn--urgent:hover {
          background: #f5f5f5;
        }

        .cta-preview__countdown-terms {
          margin-top: 1rem;
          opacity: 0.7;
          font-size: 0.85rem;
        }

        /* ----- CTA 25: Video Background ----- */
        .cta-preview__video-cta {
          padding: 6rem 2rem;
          position: relative;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cta-preview__video-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .cta-preview__video-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cta-preview__video-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%);
        }

        .cta-preview__video-content {
          position: relative;
          z-index: 1;
          text-align: center;
          color: #fff;
          max-width: 600px;
        }

        .cta-preview__video-content h2 {
          font-size: clamp(2rem, 5vw, 3rem);
          margin: 0.5rem 0 1rem;
          line-height: 1.2;
        }

        .cta-preview__video-content p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .cta-preview__video-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-preview__btn--play {
          background: transparent;
          border: 2px solid #fff;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cta-preview__btn--play:hover {
          background: rgba(255,255,255,0.1);
        }

        /* ----- CTA 26: Split Options ----- */
        .cta-preview__split-options {
          display: flex;
          min-height: 350px;
        }

        .cta-preview__option {
          flex: 1;
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .cta-preview__option--trial {
          background: #faf9f6;
        }

        .cta-preview__option--full {
          background: #1a1a1a;
          color: #fff;
          position: relative;
        }

        .cta-preview__popular-tag {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #E04A2F;
          color: #fff;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          border-radius: 4px;
        }

        .cta-preview__option h3 {
          margin: 0 0 0.5rem;
          font-size: 1.5rem;
        }

        .cta-preview__option p {
          margin: 0 0 1.5rem;
          opacity: 0.7;
        }

        .cta-preview__option-price {
          margin-bottom: 1.5rem;
        }

        .cta-preview__option-divider {
          width: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e5e5e5;
          font-weight: 600;
          color: #666;
        }

        /* ----- CTA 27: Trust Badges ----- */
        .cta-preview__trust {
          padding: 4rem 2rem;
          background: #faf9f6;
          text-align: center;
        }

        .cta-preview__trust-content {
          margin-bottom: 3rem;
        }

        .cta-preview__trust-content h2 {
          margin: 0 0 0.5rem;
          font-size: 2rem;
        }

        .cta-preview__trust-content p {
          color: #666;
          margin-bottom: 1.5rem;
        }

        .cta-preview__trust-badges {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .cta-preview__trust-badge {
          background: #fff;
          padding: 1.5rem 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          text-align: center;
          min-width: 120px;
        }

        .cta-preview__trust-badge img {
          height: 40px;
          margin-bottom: 0.5rem;
        }

        .cta-preview__trust-stat {
          font-size: 2rem;
          font-weight: 700;
          color: #E04A2F;
          display: block;
        }

        .cta-preview__trust-badge span:last-child {
          font-size: 0.85rem;
          color: #666;
        }

        /* ----- CTA 28: Gift Voucher ----- */
        .cta-preview__gift {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #f5f0eb 0%, #fff 100%);
          display: flex;
          justify-content: center;
        }

        .cta-preview__gift-content {
          max-width: 500px;
          text-align: center;
        }

        .cta-preview__gift-ribbon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .cta-preview__gift-content h2 {
          margin: 0 0 1rem;
          font-size: 2rem;
        }

        .cta-preview__gift-content > p {
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .cta-preview__gift-options {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .cta-preview__gift-option {
          background: #fff;
          border: 2px solid #e5e5e5;
          border-radius: 12px;
          padding: 1.5rem 2rem;
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
        }

        .cta-preview__gift-option:hover {
          border-color: #E04A2F;
        }

        .cta-preview__gift-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #E04A2F;
          display: block;
        }

        .cta-preview__gift-option span:last-child {
          font-size: 0.85rem;
          color: #666;
        }

        .cta-preview__gift-note {
          margin-top: 1rem;
          font-size: 0.85rem;
          color: #999;
        }

        /* Advanced/Generic previews for 22-40 */
        .intro-preview__advanced,
        .req-preview__advanced,
        .journey-preview__advanced,
        .costs-preview__advanced,
        .faq-preview__advanced,
        .cta-preview__advanced {
          padding: 3rem 2rem;
          text-align: center;
        }

        .intro-preview__advanced-header,
        .req-preview__advanced h3,
        .journey-preview__advanced h3 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .intro-preview__advanced-content,
        .req-preview__advanced-grid {
          max-width: 800px;
          margin: 1.5rem auto 0;
        }

        .intro-preview__advanced-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .req-preview__advanced-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }

        .req-preview__advanced-item {
          background: #fff;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .req-preview__advanced-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #E04A2F;
        }

        .req-preview__advanced-label {
          font-size: 0.85rem;
          color: #666;
        }

        .journey-preview__advanced {
          background: #f5f5f2;
        }

        .costs-preview__advanced-price {
          margin: 1.5rem 0;
        }

        .costs-preview__advanced-from {
          display: block;
          font-size: 0.85rem;
          color: #999;
          text-transform: uppercase;
        }

        .costs-preview__advanced-amount {
          display: block;
          font-size: 3rem;
          font-weight: 700;
          color: #E04A2F;
        }

        .faq-preview__advanced-list {
          max-width: 600px;
          margin: 1.5rem auto 0;
          text-align: left;
        }

        .faq-preview__advanced-item {
          padding: 1rem 0;
          border-bottom: 1px solid #e5e5e5;
        }

        .faq-preview__advanced-q {
          display: block;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .faq-preview__advanced-a {
          color: #666;
          font-size: 0.9rem;
        }

        .cta-preview__advanced-actions {
          margin-top: 1.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .ppl-picker-controls {
            left: 10px;
            right: 10px;
            width: auto;
          }

          .ppl-picker-favs {
            left: 10px;
            right: 10px;
            width: auto;
          }

          .hero-preview__content--split,
          .intro-preview__two-col,
          .req-preview__grid,
          .costs-preview__cards,
          .cta-preview__split,
          .hero-preview__instructor-content,
          .hero-preview__dual-grid,
          .hero-preview__success-content,
          .intro-preview__instructor-bio,
          .intro-preview__essay-images,
          .intro-preview__pillars-grid,
          .intro-preview__styled-content,
          .journey-preview__logbook,
          .req-preview__enhanced-grid,
          .costs-preview__breakdown-grid,
          .costs-preview__aircraft-grid,
          .cta-preview__trial,
          .cta-preview__visit,
          .cta-preview__discovery-content,
          .cta-preview__tour-content,
          .intro-preview__q-card {
            grid-template-columns: 1fr;
          }

          .req-preview__grid,
          .req-preview__enhanced-grid,
          .req-preview__falling-grid,
          .req-preview__advanced-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .costs-preview__breakdown-item--highlight {
            grid-column: span 1;
          }

          .costs-preview__hourly-extras {
            grid-template-columns: 1fr;
          }

          .faq-preview__video-item--featured {
            grid-column: span 1;
          }

          .cta-preview__discovery-image img {
            height: 250px;
          }

          .intro-preview__q-card {
            flex-direction: column;
            text-align: center;
          }

          .intro-preview__q-card img {
            width: 120px;
            height: 120px;
            margin: 0 auto;
          }

          .intro-preview__q-stats {
            justify-content: center;
          }

          .intro-preview__instructors {
            flex-wrap: wrap;
          }

          .ppl-picker-controls__thumb {
            width: 28px;
            height: 28px;
            font-size: 10px;
          }
        }

        @media (max-width: 480px) {
          .req-preview__grid,
          .req-preview__enhanced-grid,
          .req-preview__falling-grid,
          .req-preview__advanced-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .costs-preview__hourly-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
            text-align: center;
          }

          .costs-preview__hourly-row--header {
            display: none;
          }

          .cta-preview__discovery-pricing {
            flex-direction: column;
            align-items: flex-start;
          }

          .intro-preview__instructor-card {
            min-width: 100px;
          }
        }
      `}</style>
    </div>
  );
}

export default PPLPicker;
