/**
 * Plain-English explanations for every tile/metric on /admin/analytics.
 * Each entry: { title, body }. Title appears bold at top of the popover; body is the prose.
 *
 * Edit copy here without touching component code.
 */

export const GLOSSARY = {
  // ─── Top Metric Cards ─────────────────────────────────────────
  pageViews: {
    title: 'Page Views',
    body: 'The total number of pages loaded on your site in this period. One person visiting four pages counts as four page views. A high number means people are exploring rather than bouncing off the first page they land on.',
  },
  uniqueSessions: {
    title: 'Unique Sessions',
    body: 'The number of separate visits to your site. One person opening the site, browsing for ten minutes, then leaving counts as one session. A new session starts after 30 minutes of inactivity. This is your closest equivalent to "how many real visitors today".',
  },
  bounceRate: {
    title: 'Bounce Rate',
    body: 'The percentage of visitors who leave after viewing only one page. Lower is better. Under 40% is healthy for an aviation site — visitors are clicking through to learn more. Over 60% suggests the landing page is not engaging or the visitor was not who you expected.',
  },
  avgTimeOnPage: {
    title: 'Average Time on Page',
    body: 'How long, on average, visitors spend on a single page before moving on. Two minutes is good — they are reading, not skimming. Under 30 seconds suggests the page is not holding their attention or they could not find what they wanted.',
  },
  avgScrollDepth: {
    title: 'Average Scroll Depth',
    body: 'How far down the page visitors scroll, on average. 100% means they reach the very bottom. Above 60% means most people are reading the full page. Below 40% suggests the most important content needs to move higher up.',
  },

  // ─── Purchase Funnel tile ─────────────────────────────────────
  purchaseFunnel: {
    title: 'Purchase Funnel — Discovery Flight',
    body: 'How many people moved through each step toward a Discovery Flight booking. The funnel narrows from "looked at a flight" to "actually paid". A big drop between two steps tells you exactly where customers hesitate — that is the spot to fix.',
  },
  viewedProduct: {
    title: 'Viewed Product',
    body: 'The number of separate visits where someone reached the Discovery Flight page (/training/trial-lessons or /training/discovery-flights). They have shown active interest but have not yet picked a card or clicked Book Now.',
  },
  startedCheckout: {
    title: 'Started Checkout',
    body: 'Visits where someone picked an aircraft + duration and clicked Book Now. They are committed enough to start filling in their details. The drop from this number to "Purchased" is your biggest lever — that is where you save abandoned carts.',
  },
  purchased: {
    title: 'Purchased',
    body: 'Confirmed payments. Each one is a real Discovery Flight booking processed by Stripe. Counts unique payment intents — duplicate webhooks (Stripe occasionally sends the same one twice) are deduped automatically.',
  },
  aov: {
    title: 'AOV (Average Order Value)',
    body: 'The average amount paid per booking. £350 means every booking is worth £350 on average. If this drops, it suggests buyers are picking shorter cheaper flights or skipping add-ons. If it rises, premium options are selling well.',
  },
  revenue: {
    title: 'Revenue',
    body: 'The total amount paid by Discovery Flight customers in this period. This is gross revenue from Stripe — before any refunds, fees, or tax. Match it against the Stripe dashboard for a reconciliation check.',
  },
  medianTimeToConvert: {
    title: 'Median Time to Convert',
    body: 'Half of your buyers complete payment faster than this number; half take longer. If it says "3 hours", most decide quickly. If it says "5 days", they are researching for a while before booking — which means follow-up email and remarketing matter more than a perfect first impression.',
  },
  funnelSourceFilter: {
    title: 'Source Filter',
    body: 'Splits the funnel by where the visitor came from (Google, Instagram, direct, etc.). Switch the filter to see if Google traffic converts better than Instagram, or whether direct visitors are your warmest audience. The biggest insights live behind this dropdown.',
  },

  // ─── Abandoned Cart tile ──────────────────────────────────────
  abandonedCarts: {
    title: 'Abandoned Carts',
    body: 'People who started a Discovery Flight booking and stopped before paying. We save their email at step one of checkout, so we can follow up and try to win them back. The recoverable carts table below shows who you can email right now.',
  },
  recoverableHeadline: {
    title: '£X Recoverable',
    body: 'The total pound value of abandoned carts that have an email on file and have not unsubscribed. This is the money sitting on the table — every pound here is reachable with a recovery email. Click "Send recovery" on any cart to try.',
  },
  cartsTotal: {
    title: 'Carts',
    body: 'The total number of carts created in this period — every booking-in-progress, including the ones that completed. The denominator for everything else.',
  },
  cartsAbandoned: {
    title: 'Abandoned',
    body: 'Carts that did not complete checkout. By default a cart is marked abandoned after 1 hour of inactivity. Industry average abandonment rate is around 70%. Over half of these are typically still recoverable.',
  },
  cartsRecoverable: {
    title: 'Recoverable',
    body: 'Carts where we have an email and the customer has not unsubscribed — regardless of status. These appear the moment the email is captured, not just after a cart goes abandoned.',
  },
  cartsContacted: {
    title: 'Contacted',
    body: 'Recoverable carts you have manually marked as contacted. If "Recoverable" is high but "Contacted" is low, there are captured emails waiting for you to reach out.',
  },
  cartsRecovered: {
    title: 'Recovered',
    body: 'Carts that were abandoned, received a recovery email, and then completed payment. This is the success metric — every recovered cart is a booking you would have lost without the follow-up. Industry benchmark is 5–15% recovery rate.',
  },

  // ─── Search Keywords (GSC) tile ───────────────────────────────
  searchKeywords: {
    title: 'Search Keywords (Google)',
    body: 'What people typed into Google to find your site, and how often you appeared in results. Pulled nightly from Google Search Console. Data lags 2 days (Google\'s reporting delay), so today is not yet visible.',
  },
  gscClicks: {
    title: 'Clicks',
    body: 'How many times someone clicked through to your site from a Google search result. The most important number on this tile — clicks are real visitors who chose you over competitors in the search list.',
  },
  gscImpressions: {
    title: 'Impressions',
    body: 'How many times your site appeared in Google search results — whether or not anyone clicked. High impressions with low clicks means people see your listing but it is not compelling enough to click. Time to improve titles and descriptions.',
  },
  gscCtr: {
    title: 'CTR (Click-Through Rate)',
    body: 'Of all the times your site appeared in search results, what percentage actually clicked. A 3% CTR means 3 in 100 searchers chose you. Aviation queries average 2–5%. Higher means your listing stands out; lower means competitors are winning the click.',
  },
  gscAvgPosition: {
    title: 'Avg. Position',
    body: 'Where you typically appear in Google search results, on average. 1 = top of page one. 10 = bottom of page one. 11+ = page two or worse. Below 4 is good — almost everyone clicks through. Above 10 means you are buried and rarely seen.',
  },

  // ─── Existing AdminAnalytics CardTitles ───────────────────────
  pageViewsAndSessions: {
    title: 'Page Views & Sessions over Time',
    body: 'A daily view of traffic over the selected period. Purple is unique sessions (real people); blue is page views (total page loads). The two lines tell you whether more people are visiting OR existing visitors are looking at more pages.',
  },
  timeOnPageByUrl: {
    title: 'Time on Page by URL',
    body: 'Which pages hold attention longest. The trial-lessons or discovery-flights page should ideally be near the top — that means people are reading the value prop, not bouncing. A short time on a key sales page is a warning sign.',
  },
  bookingJourney: {
    title: 'Booking Journey',
    body: 'A simplified path from landing on the site to completing a booking. Useful as a sanity check that the funnel still flows the way you expect. If you see drop-offs at unexpected steps, those are the pages to investigate.',
  },
  topPages: {
    title: 'Top Pages',
    body: 'The pages people view most often, ranked by page views. Your homepage will usually be #1. If a non-homepage page (like a specific aircraft listing) ranks high, that page is doing real marketing work for you.',
  },
  trafficSources: {
    title: 'Traffic Sources',
    body: 'How people arrive at your site, grouped by category: Google, social media (Instagram/Facebook), direct (typed the URL or clicked a saved link), email, and other. Tells you which marketing channels are actually delivering visitors.',
  },
  topReferrers: {
    title: 'Top Referrers',
    body: 'The specific external sites sending you traffic. Google.com is usually #1. If a flying-themed forum, blog, or partner site appears here, that is a relationship worth cultivating — they are doing free marketing for you.',
  },
  devicesAndBrowsers: {
    title: 'Devices & Browsers',
    body: 'Mobile vs desktop vs tablet, and which browsers people use. If 70% of your traffic is mobile, the mobile experience needs to be flawless. If a particular browser is over-represented, test the booking flow on it.',
  },
  topCountries: {
    title: 'Top Countries',
    body: 'Where in the world your visitors are based, by IP geolocation. The world map shades each country darker the more visits it has had — hover any country for the exact number. UK should dominate. International visitors are interesting — they may be planning aviation holidays, looking for unusual experiences, or competitors checking up on you.',
  },
  sessionsByHour: {
    title: 'Sessions by Hour (UTC)',
    body: 'When during the day people visit. Typically a daytime curve with peaks around lunch and evening. If you see a flat distribution, you have international traffic balancing UK time zones. Useful for picking the best time to push a social post.',
  },
  scrollDepthByPage: {
    title: 'Scroll Depth by Page',
    body: 'How far down each page visitors scroll before leaving. A sales page that gets only 30% scroll depth is not delivering its message — the call-to-action is below where most people stop reading.',
  },
  topUserJourneys: {
    title: 'Top User Journeys',
    body: 'The most common sequences of pages people visit. "Home → Trial Lessons → Checkout" is the path you want to see frequently. Unexpected journeys (e.g. visitors looping through About Us repeatedly) often reveal that they are looking for something specific they cannot find.',
  },
  topUtmCampaigns: {
    title: 'Top UTM Campaigns',
    body: 'Visits tagged with a specific marketing campaign via UTM parameters in the URL (utm_campaign=...). Tells you which paid or tracked campaigns are actually delivering traffic. Untagged links show as "(none)".',
  },
  topUtmSources: {
    title: 'Top UTM Sources',
    body: 'The platform/source that brought tagged visitors (utm_source=...). Common values: google, facebook, instagram, newsletter. If you tag your social posts, this tile tells you which platform actually drives clicks.',
  },
  topCtaClicks: {
    title: 'Top CTA Clicks',
    body: 'Which call-to-action buttons people click most often: Book Now, Contact, Sign Up, etc. A high "Book Now" count is good. A high "Contact" count alongside few bookings suggests visitors have unanswered questions blocking the booking — worth a FAQ rewrite.',
  },
  topFormSubmits: {
    title: 'Top Form Submit Pages',
    body: 'The pages where visitors submit a form (contact, enquiry, alert signup). Tells you which pages are converting interest into a contactable lead. If a page gets lots of views but no submits, the form might be hidden or the page is not ready to ask for the email yet.',
  },

  // ─── Referral Funnel + Top Referrers ──────────────────────────
  referralFunnel: {
    title: 'Referral Funnel',
    body: 'How "refer a friend" performs end to end. It follows a flow rather than a strict narrowing funnel: a customer sees their confirmation, shares their link, their friend arrives, and the friend books. Because the first two steps are the referrer and the last two are the friend, a later step can occasionally be higher than an earlier one — that just means past referrals are still converting.',
  },
  referralConfirmationViewed: {
    title: 'Confirmation Viewed',
    body: 'Visits that reached the booking-confirmed page, where the "refer a friend" card is shown. This is the pool of customers who had the chance to share their referral link.',
  },
  referralShareClicked: {
    title: 'Share Clicked',
    body: 'Visits where the customer used a share affordance on the referral card — copying the link, opening the OS share sheet, or viewing the free-gift details. A low number here versus "Confirmation Viewed" means the share card is not compelling enough.',
  },
  referralFriendArrived: {
    title: 'Friend Arrived',
    body: 'Separate visits that landed on the site via a referral link (a ?ref= code in the URL). This is the friend clicking through — proof the share actually travelled.',
  },
  referralFriendBooked: {
    title: 'Friend Booked',
    body: 'Bookings that were paid for using a referral code. Each one is a real Discovery Flight booking attributed to a friend’s referral — and triggers the free gift for the original customer.',
  },
  topReferrers: {
    title: 'Top Referrers',
    body: 'The customers who have successfully referred friends, ranked by how many friends booked. Names come from the original booking that owns each referral code. Use this to thank your best advocates — and to spot who might deserve a little extra.',
  },

  // ─── Header controls ──────────────────────────────────────────
  visitorSegment: {
    title: 'New vs Returning',
    body: 'Filters the whole dashboard to first-time or returning visitors. "Returning" means the same browser was also seen in the previous period of equal length — so on a 30-day view, someone who last visited 45 days ago still reads as "New". Visitors whose browser blocks storage can not be classified and only appear under "All". Period-over-period change is hidden while a segment is active, because the previous period is not itself segmented.',
  },
};
