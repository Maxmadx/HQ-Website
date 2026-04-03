# HQ Aviation Blog System Design

## Overview

Create a comprehensive blog system with 17 aviation-focused articles as React components. Each blog targets a 5-10 minute read with professional but warm tone, placeholder cards for illustrations, and integration with existing HQ Aviation assets.

## Requirements

- **Format**: React components per post (maximum flexibility)
- **Scope**: All 17 blog topics from initial-blogs.json
- **Tone**: Professional but warm - expert authority with approachable language
- **Graphics**: Placeholder cards with title/description for future illustrations, plus existing images from /assets/images/

## Architecture

```
src/
├── blog/
│   ├── posts.json                    # Metadata for all posts
│   └── components/                   # Shared blog components
│       ├── BlogLayout.jsx            # Common layout wrapper
│       ├── IllustrationPlaceholder.jsx  # Placeholder card for graphics
│       ├── Callout.jsx               # Info/warning/tip boxes
│       ├── KeyPoint.jsx              # Highlighted key takeaways
│       └── ReadingTime.jsx           # Reading time indicator
├── pages/
│   ├── Blog.jsx                      # Blog listing page
│   └── blog/                         # Individual posts (17 files)
│       ├── PPLGuide.jsx
│       ├── MasteringTheHover.jsx
│       ├── WinterFlying.jsx
│       ├── MaintenanceCheck.jsx
│       ├── LondonHeliLanes.jsx
│       ├── Autorotations.jsx
│       ├── NightRating.jsx
│       ├── OwnershipVsHire.jsx
│       ├── PreFlightWalkaround.jsx
│       ├── MedicalCertificates.jsx
│       ├── WeatherDecisions.jsx
│       ├── TurbineFlight.jsx
│       ├── RadioTelephony.jsx
│       ├── FlightInstructor.jsx
│       ├── ConfinedAreas.jsx
│       ├── RR300Engine.jsx
│       └── WhyWeFly.jsx
```

## Shared Components

### IllustrationPlaceholder
Large card component for marking where illustrations should be placed:
- Title field (what the illustration should show)
- Description field (detailed description of the visual)
- Styled as a prominent placeholder card

### Callout
Styled boxes for tips, warnings, and key information:
- Variants: info, warning, tip, quote
- Icon + colored border styling

### KeyPoint
Highlighted summary boxes for key takeaways:
- Used at end of sections
- Bullet point format

### BlogLayout
Common wrapper providing:
- Hero image
- Title, category, date, author
- Reading time calculation
- Back navigation
- Related posts section

## Content Guidelines

### Per Post Structure
- Hero image from existing /assets/images/
- 1,500-2,000 words (5-10 minute read)
- 3-5 IllustrationPlaceholder components per post
- Mix of paragraphs, Callout, and KeyPoint components
- Related posts suggestions at bottom

### Writing Style
- Professional but warm tone
- Expert authority with approachable language
- First-person plural ("we", "our") for HQ Aviation voice
- Active voice preferred
- Technical accuracy with accessible explanations

## Blog Topics (17 total)

### Training & Licensing
1. Your Journey to the Cockpit: A Guide to the PPL(H)
2. Mastering the Hover: Tips for Student Pilots
3. Night Rating: Extending Your Horizons After Sunset
4. Medical Certificates Explained: Class 1 or Class 2?
5. Becoming a Flight Instructor: Sharing the Passion

### Technical & Safety
6. Understanding Autorotations: Safety Through Physics
7. The Importance of the Pre-Flight Walkaround
8. Weather Decision Making: Go or No-Go?
9. Radio Telephony: Tips for Clearer Communication
10. Confined Area Operations: Tips for Off-Airfield Landings

### Operations & Navigation
11. Winter Flying at Denham: Safety and Preparation
12. Navigating London: A Guide to the Heli-Lanes

### Maintenance & Engineering
13. Behind the Scenes: The 100-Hour Maintenance Check
14. The Rolls-Royce RR300 Engine: A Maintenance Perspective

### Aircraft & Ownership
15. Introduction to Turbine Flight: The Robinson R66
16. Aircraft Ownership vs. Self-Fly Hire

### Lifestyle
17. Why We Fly: The Mental Health Benefits of Aviation

## Routing

Add to App.jsx:
- `/blog` - Blog listing page
- `/blog/:postId` - Individual blog post (dynamic routing to components)

## posts.json Schema

```json
{
  "id": "ppl-guide",
  "title": "Your Journey to the Cockpit: A Guide to the PPL(H)",
  "category": "Training",
  "date": "2026-02-15",
  "excerpt": "Everything you need to know about obtaining your Private Pilot License...",
  "image": "/assets/images/training/...",
  "author": "HQ Aviation",
  "readingTime": "8 min",
  "published": true,
  "component": "PPLGuide"
}
```

## Success Criteria

- All 17 blogs written and integrated
- Consistent styling across all posts
- Clear placeholder cards for future illustrations
- Working navigation between posts
- Blog listing page showing all published posts
- BlogSection on homepage shows 2 latest posts
