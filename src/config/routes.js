/**
 * HQ Aviation Site Routes Configuration
 * Generated from site-routes.json
 */

export const siteConfig = {
  siteName: "Captain Q / HQ Aviation",
  baseUrl: "https://hqaviation.com"
};

export const routes = [
  {
    title: "Home",
    path: "/",
    type: "landing_page"
  },
  {
    title: "About Us",
    path: "/about-us",
    type: "section_root",
    children: [
      {
        title: "Captain Q Story",
        path: "/about-us/captain-q-profile",
        children: [
          { title: "Around the World 1997", path: "/about-us/captain-q/around-the-world-1997" },
          { title: "Solo Flight 2000", path: "/about-us/captain-q/solo-flight-2000" },
          { title: "Pole to Pole 2002", path: "/about-us/captain-q/pole-to-pole" },
          { title: "Ice Challenger", path: "/about-us/captain-q/ice-challenger" },
          { title: "Three North Poles", path: "/about-us/captain-q/three-north-poles" },
          { title: "Iceland 2016", path: "/about-us/captain-q/iceland-2016" },
          { title: "Image Gallery: Captain Q", path: "/about-us/captain-q/gallery" }
        ]
      },
      { title: "Our Fleet (School)", path: "/about-us/our-fleet" },
      { title: "Meet the Team", path: "/about-us/team" },
      { title: "British Team", path: "/about-us/british-team" },
      { title: "Operations Team", path: "/about-us/operations-team" },
      { title: "Partnerships & Tools", path: "/about-us/partnerships" },
      { title: "Aviation Links", path: "/about-us/resources" }
    ]
  },
  {
    title: "Aircraft Sales",
    path: "/aircraft-sales",
    type: "catalog_root",
    children: [
      { title: "Compare Aircraft", path: "/aircraft-sales/compare" },
      { title: "R22 Details", path: "/aircraft-sales/new/r22" },
      {
        title: "R44 Series",
        path: "/aircraft-sales/new/r44",
        children: [
          { title: "Cadet", path: "/aircraft-sales/new/r44/cadet" },
          { title: "Raven Series", path: "/aircraft-sales/new/r44/raven" },
          { title: "Clipper Series", path: "/aircraft-sales/new/r44/clipper" }
        ]
      },
      {
        title: "R66 Turbine",
        path: "/aircraft-sales/new/r66",
        children: [
          { title: "Details", path: "/aircraft-sales/new/r66/details" },
          { title: "Stock: Palo Verde", path: "/aircraft-sales/inventory/r66-palo-verde" },
          { title: "Stock: Riviera", path: "/aircraft-sales/inventory/r66-riviera" },
          { title: "Stock: Southwood", path: "/aircraft-sales/inventory/r66-southwood" }
        ]
      },
      {
        title: "R88 Series",
        path: "/aircraft-sales/new/r88",
        children: [
          { title: "R88 Overview", path: "/aircraft-sales/new/r88/overview" },
          { title: "R88 Details", path: "/aircraft-sales/new/r88/details" },
          { title: "R88 Selected Inventory", path: "/aircraft-sales/new/r88/selected" }
        ]
      },
      {
        title: "Used Inventory",
        path: "/aircraft-sales/used",
        children: [
          { title: "Recently Sold", path: "/aircraft-sales/used/sold-archive" },
          { title: "2018 R66", path: "/aircraft-sales/used/2018-r66" },
          { title: "2006 R44 Raven II", path: "/aircraft-sales/used/2006-r44-raven-ii" },
          { title: "2007 R44 Raven II", path: "/aircraft-sales/used/2007-r44-raven-ii" }
        ]
      }
    ]
  },
  {
    title: "Flight Training",
    path: "/training",
    type: "section_root",
    children: [
      {
        title: "Beginner (PPL)",
        path: "/training/ppl",
        children: [
          { title: "Trial Lessons", path: "/training/trial-lessons" },
          { title: "Discovery Flights", path: "/training/discovery-flights" }
        ]
      },
      {
        title: "Advanced & Ratings",
        path: "/training/advanced",
        children: [
          { title: "Night Ratings", path: "/training/advanced/night-rating" },
          { title: "Instrument Ratings", path: "/training/advanced/instrument-rating" },
          { title: "Mountain Flying", path: "/training/advanced/mountain-flying" },
          { title: "Special Training", path: "/training/advanced/special" }
        ]
      },
      {
        title: "Professional (CPL)",
        path: "/training/commercial",
        children: [
          { title: "Commercial Courses", path: "/training/commercial-courses" },
          { title: "Instructor Courses", path: "/training/instructor-courses" },
          { title: "Type Ratings", path: "/training/type-ratings" },
          { title: "FAA Pilot Training", path: "/training/faa-conversion" }
        ]
      },
      {
        title: "Hire & Currency",
        path: "/training/currency",
        children: [
          { title: "Self Fly Hire", path: "/training/self-fly-hire" },
          { title: "Proficiency Checks", path: "/training/proficiency-checks" },
          { title: "Safety Courses", path: "/training/safety-courses" },
          { title: "Training FAQ", path: "/training/faq" }
        ]
      }
    ]
  },
  {
    title: "Expeditions",
    path: "/expeditions",
    type: "section_root",
    children: [
      { title: "HQ Trips Calendar", path: "/expeditions/calendar" },
      { title: "Greenland 2025", path: "/expeditions/greenland-2025" },
      { title: "Bahamas Guide", path: "/expeditions/destinations/bahamas" },
      { title: "Costa Rica Guide", path: "/expeditions/destinations/costa-rica" },
      { title: "Worldwide Archive", path: "/expeditions/archive" },
      { title: "Tour of London", path: "/expeditions/tour-of-london" },
      { title: "Bespoke Adventures", path: "/expeditions/bespoke" }
    ]
  },
  {
    title: "Services",
    path: "/services",
    type: "section_root",
    children: [
      {
        title: "Maintenance",
        path: "/services/maintenance",
        children: [
          { title: "Part 145", path: "/services/maintenance/part-145" },
          { title: "Part M (EASA)", path: "/services/maintenance/part-m" },
          { title: "Rebuilds & Overhauls", path: "/services/maintenance/rebuilds" },
          { title: "Custom Paint", path: "/services/maintenance/paint" },
          { title: "Parts Dealer", path: "/services/maintenance/parts" },
          { title: "Robinson Approved Info", path: "/services/maintenance/robinson-approved" }
        ]
      },
      {
        title: "Ownership Support",
        path: "/services/ownership",
        children: [
          { title: "Hangarage", path: "/services/hangarage" },
          { title: "Fleet Insurance", path: "/services/insurance" },
          { title: "Leaseback Management", path: "/services/leaseback" }
        ]
      },
      {
        title: "Operational Services",
        path: "/services/operations",
        children: [
          { title: "Yacht / SuperYacht HeliOps", path: "/services/yacht-heliops" },
          { title: "Ferry Flights", path: "/services/ferry-flights" },
          { title: "Pilot Provisioning", path: "/services/pilot-provisioning" },
          { title: "Special Ops", path: "/services/special-ops" }
        ]
      }
    ]
  },
  {
    title: "Media & Community",
    path: "/media",
    children: [
      { title: "Media Upload", path: "/media/upload" },
      { title: "Photo Gallery", path: "/media/gallery" },
      { title: "Video Gallery", path: "/media/videos" },
      { title: "News", path: "/media/news" },
      { title: "Blogs", path: "/media/blog" },
      { title: "Publications", path: "/media/publications" },
      { title: "Clubhouse", path: "/community/clubhouse" }
    ]
  },
  {
    title: "Store",
    path: "/store",
    children: [
      { title: "All Apparel", path: "/store/apparel" },
      { title: "R44 Cap", path: "/store/apparel/r44-cap" },
      { title: "HQ R66 Cap", path: "/store/apparel/r66-cap" },
      { title: "Gifts & Experiences", path: "/store/gifts" }
    ]
  },
  {
    title: "Contact",
    path: "/contact",
    children: [
      { title: "Pricing / Price List", path: "/contact/pricing" },
      { title: "Job Board", path: "/contact/careers" },
      { title: "Testimonials", path: "/contact/testimonials" }
    ]
  }
];

/**
 * Find a route by path and return the breadcrumb trail
 */
export function getBreadcrumbs(pathname) {
  const breadcrumbs = [{ title: "Home", path: "/" }];

  if (pathname === "/") return breadcrumbs;

  const findRoute = (routes, path, trail = []) => {
    for (const route of routes) {
      if (route.path === path) {
        return [...trail, { title: route.title, path: route.path }];
      }
      if (route.children) {
        const found = findRoute(route.children, path, [...trail, { title: route.title, path: route.path }]);
        if (found) return found;
      }
    }
    return null;
  };

  // Try exact match first
  const exactMatch = findRoute(routes, pathname);
  if (exactMatch) {
    return [...breadcrumbs, ...exactMatch];
  }

  // Build breadcrumbs from path segments
  const segments = pathname.split("/").filter(Boolean);
  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const found = findRoute(routes, currentPath);
    if (found && found.length > 0) {
      const lastItem = found[found.length - 1];
      if (!breadcrumbs.find(b => b.path === lastItem.path)) {
        breadcrumbs.push(lastItem);
      }
    } else {
      // Create a title from the segment
      const title = segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbs.push({ title, path: currentPath });
    }
  }

  return breadcrumbs;
}

/**
 * Get navigation items for the header
 */
export function getNavItems() {
  return routes
    .filter(route => route.path !== "/" && route.title !== "System Pages")
    .map(route => ({
      label: route.title,
      path: route.path,
      dropdown: route.children?.slice(0, 6).map(child => ({
        label: child.title,
        path: child.path
      }))
    }));
}

export default routes;
