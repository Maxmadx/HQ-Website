/**
 * Seed FAQ data into Firestore.
 *
 * Usage:
 *   node scripts/seed-faqs.js              — skip if collection already has data
 *   node scripts/seed-faqs.js --force      — clear ALL faqs then re-seed everything
 *   node scripts/seed-faqs.js --page=discovery          — seed one page only (skips if page has data)
 *   node scripts/seed-faqs.js --page=discovery --force  — clear that page then re-seed it
 */
'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const admin = require('../api/firebase-admin');

// ─── FAQ data ────────────────────────────────────────────────────────────────

const ALL_FAQS = [
  // Discovery Flight (5)
  { page: 'discovery', displayOrder: 1, question: 'Do I need any prior experience?', answer: "No prior experience is required. Our instructors will guide you through everything from the pre-flight briefing to hands-on flying. Discovery flights are designed for complete beginners." },
  { page: 'discovery', displayOrder: 2, question: 'Can I bring passengers?', answer: "Yes! Depending on the helicopter type and weights, you may be able to bring 1–2 passengers. Let us know when booking so we can arrange the appropriate aircraft." },
  { page: 'discovery', displayOrder: 3, question: 'What happens if the weather is bad?', answer: "Safety is our priority. If weather conditions are unsuitable, we'll reschedule at no extra cost. We monitor conditions closely and give as much notice as possible." },
  { page: 'discovery', displayOrder: 4, question: "Does this count towards my pilot's licence?", answer: "Yes! Hours flown during your discovery flight count towards PPL(H) training. We'll log everything properly if you decide to continue with us." },
  { page: 'discovery', displayOrder: 5, question: 'Is this suitable as a gift?', answer: "Absolutely! Discovery flights make unforgettable gifts. We offer vouchers valid for 12 months, giving flexibility to book at their convenience." },

  // Self-Fly Hire (6)
  { page: 'sfh', displayOrder: 1, question: 'What are the minimum requirements to hire?', answer: "You need a valid PPL(H) with a current medical certificate, the appropriate type rating for your chosen aircraft, and recent flight experience. If you haven't flown recently, we can arrange a currency check flight." },
  { page: 'sfh', displayOrder: 2, question: 'How far in advance should I book?', answer: "We recommend booking at least 48 hours in advance, especially for weekends and holidays. However, subject to availability, we can accommodate same-day bookings." },
  { page: 'sfh', displayOrder: 3, question: 'Is insurance included?', answer: "Yes, comprehensive hull and liability insurance is included in all hire rates. Your excess is £5,000 for the R22, £7,500 for the R44, and £10,000 for the R66." },
  { page: 'sfh', displayOrder: 4, question: 'Can I fly abroad?', answer: "Yes, with prior arrangement. We can assist with flight planning, customs requirements, and necessary permissions for international flights." },
  { page: 'sfh', displayOrder: 5, question: 'What happens if I need to cancel?', answer: "Cancellations made more than 24 hours before your booking receive a full refund. Cancellations within 24 hours are charged at 50% of the booking value." },
  { page: 'sfh', displayOrder: 6, question: 'Do you offer block booking discounts?', answer: "Yes, we offer discounted rates for block bookings of 10 hours or more. Contact us for a personalised quote based on your flying requirements." },

  // Sales (6)
  { page: 'sales', displayOrder: 1, question: 'How long does delivery take for a new helicopter?', answer: "Delivery times vary by model and configuration. Typically, a new Robinson takes 3–6 months from order to delivery. We'll keep you informed throughout the process." },
  { page: 'sales', displayOrder: 2, question: 'Can I trade in my current aircraft?', answer: "Yes, we accept trade-ins on all Robinson models. We'll provide a fair market valuation and apply it against your new purchase. Contact us to arrange an assessment." },
  { page: 'sales', displayOrder: 3, question: 'What financing options are available?', answer: "We work with specialist aviation finance providers to offer competitive rates. Options include hire purchase, finance lease, and operating lease. We can tailor a package to your requirements." },
  { page: 'sales', displayOrder: 4, question: 'Do you offer demo flights?', answer: "Yes, we offer demonstration flights on all Robinson models. This gives you the opportunity to experience the aircraft before committing to a purchase." },
  { page: 'sales', displayOrder: 5, question: 'What warranty comes with a new Robinson?', answer: "All new Robinsons come with a 2-year/2,000-hour factory warranty. As an authorised dealer, we handle all warranty claims directly with Robinson Helicopter Company." },
  { page: 'sales', displayOrder: 6, question: 'Can you deliver internationally?', answer: "Yes, we can arrange delivery worldwide. We handle all the paperwork, export documentation, and can arrange ferry flights or shipping depending on the destination." },

  // Expeditions (6)
  { page: 'expeditions', displayOrder: 1, question: 'Do I need flying experience to join an expedition?', answer: "No — most of our expedition participants are passengers, not pilots. If you are a pilot and wish to fly legs of the expedition, this can be arranged based on your experience and the aircraft being used." },
  { page: 'expeditions', displayOrder: 2, question: 'What is included in the expedition price?', answer: "Each expedition is bespoke, but typically includes all fuel, handling, accommodation, ground transport, and the expertise of our expedition team. Full details are provided in the expedition briefing pack." },
  { page: 'expeditions', displayOrder: 3, question: 'How many people can join an expedition?', answer: "Group size varies by expedition. Most depart with 3–8 participants across multiple aircraft. Bespoke private expeditions for smaller groups are also available." },
  { page: 'expeditions', displayOrder: 4, question: 'What happens if weather delays the expedition?', answer: "Expeditions include built-in weather days and flexible routing. Captain Q has extensive experience planning around weather in remote environments. Safety always takes priority over schedule." },
  { page: 'expeditions', displayOrder: 5, question: 'Can I bring camera equipment?', answer: "Absolutely. Many expedition participants are photographers and filmmakers. We can advise on weight and space allowances when you book, and can often accommodate larger rigs with advance notice." },
  { page: 'expeditions', displayOrder: 6, question: 'Are bespoke expeditions available?', answer: "Yes. If you have a destination in mind, we'd love to hear from it. Captain Q has flown to every continent and relishes the challenge of designing a new route. Contact us to start the conversation." },

  // PPL Training (6)
  { page: 'ppl', displayOrder: 1, question: 'How long does it take to get a PPL(H)?', answer: "The minimum is 45 flight hours, but most students take 55–70 hours depending on frequency of training and aptitude. Training full-time, you could achieve your licence in 3–4 months. Part-time students typically take 12–18 months." },
  { page: 'ppl', displayOrder: 2, question: 'Do I need any previous flying experience?', answer: "No experience is necessary. We start from the very beginning and tailor the pace to each student. A discovery flight beforehand is a great way to confirm the sport is right for you." },
  { page: 'ppl', displayOrder: 3, question: 'Can I fly in winter?', answer: "Yes. We train year-round. Winter flying builds excellent skills — shorter days mean you'll build instrument appreciation early, and cold, dense air gives great helicopter performance." },
  { page: 'ppl', displayOrder: 4, question: 'What medical certificate do I need?', answer: "A LAPL(H) or Class 2 medical certificate is required. These are obtained through a CAA-approved Aeromedical Examiner (AME). We can advise on the process when you join us." },
  { page: 'ppl', displayOrder: 5, question: 'Is financing available?', answer: "Yes. We work with aviation finance specialists who offer payment plans tailored to training. Contact us for details and we'll connect you with the right provider." },
  { page: 'ppl', displayOrder: 6, question: 'What happens after I get my PPL(H)?', answer: "The world opens up. Many graduates go straight into self-fly hire with us, others build hours toward a Commercial Pilot Licence, and some pursue type ratings or night ratings. We'll help you plan the next step." },

  // Night Rating (6)
  { page: 'night-rating', displayOrder: 1, question: 'What is a Night Rating?', answer: "A Night Rating allows PPL(H) holders to fly at night in Visual Meteorological Conditions (VMC). It significantly extends your flying capability and is a prerequisite for many commercial operations." },
  { page: 'night-rating', displayOrder: 2, question: 'How long does the Night Rating course take?', answer: "The course requires a minimum of 5 hours of night flying, including 3 hours dual instruction and 1 hour solo cross-country. Most students complete the rating within 2–4 weeks." },
  { page: 'night-rating', displayOrder: 3, question: 'Can I fly in cloud or poor visibility at night?', answer: "No. The Night Rating only covers flight in Visual Meteorological Conditions (VMC) at night. Flight in cloud or Instrument Meteorological Conditions (IMC) requires an Instrument Rating." },
  { page: 'night-rating', displayOrder: 4, question: 'What aircraft is used for night training?', answer: "We conduct night training in the Robinson R44, which is equipped with the necessary lighting and instruments for night operations." },
  { page: 'night-rating', displayOrder: 5, question: 'When is night training conducted?', answer: "Night training takes place after official sunset. The exact timing varies by season — we schedule sessions to make the most of available darkness while working around your schedule." },
  { page: 'night-rating', displayOrder: 6, question: 'Will my daylight flying improve after night training?', answer: "Consistently, yes. Night flying demands greater precision and instrument awareness. Pilots invariably report that their general flying accuracy improves significantly after completing a Night Rating." },

  // Type Rating (6)
  { page: 'type-rating', displayOrder: 1, question: 'What is a Type Rating?', answer: "A Type Rating is a qualification to fly a specific aircraft type. In helicopters, common type ratings include the Robinson R22, R44, R66, and various turbine types. You need a type rating for each aircraft type you wish to fly." },
  { page: 'type-rating', displayOrder: 2, question: 'How long does it take to get a Type Rating?', answer: "Duration varies by aircraft and your existing experience. An R44 type rating for an experienced R22 pilot might take 5–10 hours. A turbine type rating for a new turbine pilot typically takes 15–25 hours." },
  { page: 'type-rating', displayOrder: 3, question: 'Do I need any previous experience on the type?', answer: "No prior experience on the specific type is needed. You do need a valid PPL(H) and relevant experience on a similar category of aircraft. We'll assess your background before recommending the right approach." },
  { page: 'type-rating', displayOrder: 4, question: "What's the difference between piston and turbine type ratings?", answer: "Piston type ratings (R22, R44) are straightforward endorsements. Turbine type ratings (R66, larger turbines) are more involved, covering more complex systems, emergency procedures, and often require a ground school component." },
  { page: 'type-rating', displayOrder: 5, question: 'Can I do multiple type ratings at once?', answer: "It's generally better to complete one type rating before starting another, to avoid confusion between aircraft systems and handling characteristics. We'll advise on the best sequence for your goals." },
  { page: 'type-rating', displayOrder: 6, question: 'How often do type ratings need to be renewed?', answer: "UK CAA type ratings do not expire, but you must maintain currency (recent flight experience) and pass a Licence Proficiency Check (LPC) every 12 months to exercise the privileges of your licence." },

  // Training FAQ (10)
  { page: 'training-faq', displayOrder: 1,  question: 'How long does it take to get a helicopter license?', answer: "The minimum is 45 flight hours for a PPL(H), but most students require 55–70 hours. Training full-time you could achieve this in 3–4 months; part-time students typically take 12–18 months." },
  { page: 'training-faq', displayOrder: 2,  question: 'How much does helicopter training cost?', answer: "A full PPL(H) typically costs between £35,000 and £50,000 depending on the number of hours required. We offer transparent hourly rates with no hidden fees. Contact us for a personalised estimate." },
  { page: 'training-faq', displayOrder: 3,  question: 'Do I need any prior experience to learn to fly?', answer: "No experience is necessary. We welcome complete beginners. A trial lesson is a great way to experience helicopter flight before committing to a full course." },
  { page: 'training-faq', displayOrder: 4,  question: 'What medical requirements are there?', answer: "You need a LAPL(H) or Class 2 medical certificate from a CAA-approved Aeromedical Examiner. This is a straightforward medical — most healthy adults pass without issue." },
  { page: 'training-faq', displayOrder: 5,  question: 'What helicopters do you train in?', answer: "We train primarily in the Robinson R22 and R44 — the world's most widely used training helicopters. Both are safe, reliable, and excellent platforms for developing core flying skills." },
  { page: 'training-faq', displayOrder: 6,  question: 'Can I fly in any weather?', answer: "Training is conducted in Visual Meteorological Conditions (VMC). We fly in a wide range of weather but always within safety limits. Bad weather days are used for ground school and simulator training." },
  { page: 'training-faq', displayOrder: 7,  question: 'What is a trial lesson?', answer: "A trial lesson (Discovery Flight) is a 30 or 60-minute introductory flight where you take the controls under the supervision of an instructor. It counts towards your PPL(H) hours if you decide to continue." },
  { page: 'training-faq', displayOrder: 8,  question: 'Can I bring someone with me for my lesson?', answer: "Yes, depending on the aircraft type and weight allowances. An R44 can carry one additional passenger alongside student and instructor. Let us know when booking." },
  { page: 'training-faq', displayOrder: 9,  question: 'What can I do with a helicopter license?', answer: "A PPL(H) lets you fly yourself, family and friends anywhere in the UK and Europe. Many pilots go on to build hours, obtain commercial licences, night ratings, instrument ratings, or type ratings on larger aircraft." },
  { page: 'training-faq', displayOrder: 10, question: 'How do I book training or a trial lesson?', answer: "Call us on +44 1895 833373, email Operations@HQAviation.com, or use the booking form on our website. We're available 7 days a week from 09:00–17:00." },

  // Helicopter Tour of London (6)
  { page: 'helicopter-tour', displayOrder: 1, question: 'How long is the flight?', answer: "The tour lasts approximately 50 minutes of flight time, giving you ample opportunity to see all of London's iconic landmarks from the air." },
  { page: 'helicopter-tour', displayOrder: 2, question: 'Where does the tour depart from?', answer: "All tours depart from Denham Aerodrome, conveniently located just 20 minutes from Central London. We're easily accessible from the M40 and M25." },
  { page: 'helicopter-tour', displayOrder: 3, question: 'What happens if the weather is bad?', answer: "Safety is our priority. If weather conditions are unsuitable for flying, we'll contact you to reschedule at no extra cost. All bookings are fully refundable." },
  { page: 'helicopter-tour', displayOrder: 4, question: 'Can I bring a camera?', answer: "Absolutely! Photography is encouraged. The R66 offers excellent visibility with large windows perfect for capturing stunning aerial shots of London." },
  { page: 'helicopter-tour', displayOrder: 5, question: "What's the difference between shared and private?", answer: "Shared flights pair you with other guests (up to 4 passengers total). Private flights give you the entire helicopter for your group, allowing for a more intimate experience." },
  { page: 'helicopter-tour', displayOrder: 6, question: 'Is there a weight limit?', answer: "For safety and balance purposes, we need to know passenger weights in advance. Please contact us if you have any concerns." },

  // Rebuilds (6)
  { page: 'rebuilds', displayOrder: 1, question: 'How does a rebuild differ from buying new?', answer: "A rebuild strips an existing airframe to bare metal, replaces all life-limited components, and reassembles to zero-time specification. You get factory-new condition with full customisation at a fraction of the new aircraft price." },
  { page: 'rebuilds', displayOrder: 2, question: 'Can I supply my own aircraft for rebuild?', answer: "Absolutely. Many owners bring their existing helicopter for a complete rebuild. We'll assess the airframe and provide a detailed quotation based on its condition." },
  { page: 'rebuilds', displayOrder: 3, question: 'What warranty do rebuilt aircraft carry?', answer: "All rebuilt aircraft come with a comprehensive warranty covering workmanship and components. Engine overhauls carry the manufacturer's warranty. Full details are provided with each quotation." },
  { page: 'rebuilds', displayOrder: 4, question: 'How do I reserve a rebuild slot?', answer: "Contact our sales team to discuss your requirements. A refundable deposit secures your place in our build schedule. We then work together to finalise your specification before work begins." },
  { page: 'rebuilds', displayOrder: 5, question: 'Are rebuilt aircraft CAA/EASA certified?', answer: "Yes. All rebuilds are completed at our CAA Part 145 approved facility. Each aircraft receives a full Certificate of Release to Service and all necessary documentation." },
  { page: 'rebuilds', displayOrder: 6, question: 'Can I visit during the rebuild process?', answer: "We encourage it. Clients are welcome to visit our Denham facility at any stage. We also provide regular photo and video updates throughout the build." },
  { page: 'rebuilds', displayOrder: 7,  question: 'How long does a full rebuild typically take?', answer: 'A comprehensive rebuild takes 12–20 weeks depending on scope, parts availability, and any custom elements. We provide a project timeline at quotation stage and keep you updated throughout.' },
  { page: 'rebuilds', displayOrder: 8,  question: 'Can I choose a custom paint scheme?', answer: 'Yes. Custom livery is one of the most popular rebuild options. We work with specialist aviation paint shops and can produce any scheme — from factory-style to full bespoke corporate or personal livery.' },
  { page: 'rebuilds', displayOrder: 9,  question: 'What life-limited components are replaced during a rebuild?', answer: 'All life-limited components at or approaching their limits are replaced as standard. This includes main rotor blades, tail rotor blades, mast, and transmission components as applicable to the airframe hours.' },
  { page: 'rebuilds', displayOrder: 10, question: 'Do you offer financing for rebuilds?', answer: 'Yes. We work with aviation finance partners who can fund rebuild projects through structured repayment plans. Contact our sales team for an introduction once you have a rebuild quotation in hand.' },
  { page: 'rebuilds', displayOrder: 11, question: 'Can you convert a piston helicopter to turbine during a rebuild?', answer: 'Yes, subject to the airframe type and applicable STCs. We assess feasibility and regulatory requirements as part of the initial consultation before any commitment is made.' },
  { page: 'rebuilds', displayOrder: 12, question: 'Do you rebuild aircraft other than Robinson models?', answer: 'Our primary expertise is Robinson helicopters. Enquiries for other piston types are considered on a case-by-case basis — contact us to discuss your specific airframe.' },

  // PPL Training — additional questions (7–12)
  { page: 'ppl', displayOrder: 7,  question: 'How much does PPL(H) training cost?', answer: 'A full PPL(H) typically costs between £35,000 and £50,000 depending on hours flown. We provide transparent hourly rates with no hidden fees. Contact us for a personalised estimate based on your learning pace.' },
  { page: 'ppl', displayOrder: 8,  question: 'Can I train at weekends and evenings?', answer: 'Yes. We offer flexible scheduling including weekends and early-morning slots. Part-time students make excellent progress fitting sessions around work and family commitments.' },
  { page: 'ppl', displayOrder: 9,  question: 'What is the minimum age to get a helicopter licence?', answer: 'You can begin training at any age, but you must be 17 to fly solo and hold a PPL(H). Many students start lessons in their teens and complete the licence at 17.' },
  { page: 'ppl', displayOrder: 10, question: 'What ground school topics does PPL training cover?', answer: 'Ground school covers air law, meteorology, navigation, human performance, aircraft technical knowledge, communications, and principles of flight. We integrate theory with practical flying to reinforce understanding.' },
  { page: 'ppl', displayOrder: 11, question: 'How do I know when I am ready for my skills test?', answer: 'Your instructor will recommend you for the skills test when you consistently meet the required standard. There is no fixed number of hours — readiness is assessed by performance, not a calendar.' },
  { page: 'ppl', displayOrder: 12, question: 'Can I start on the R22 and move to the R44?', answer: 'Yes. Many students begin on the R22 for its low cost per hour and transition to the R44 as skills develop. Each aircraft requires its own type endorsement, which we handle as part of your training plan.' },

  // Discovery Flight — additional questions (6–12)
  { page: 'discovery', displayOrder: 6,  question: 'What will I actually do during the flight?', answer: 'After a pre-flight briefing your instructor will demonstrate basic controls, then hand them over to you. You will fly straight and level, gentle turns, and may even hover briefly — all under close supervision.' },
  { page: 'discovery', displayOrder: 7,  question: 'How long is the discovery flight?', answer: 'Discovery flights are available in 30-minute or 60-minute formats. We recommend 60 minutes for a fuller experience, including time over the London skyline and surrounding countryside.' },
  { page: 'discovery', displayOrder: 8,  question: 'Can I get a certificate or logbook entry?', answer: 'Yes. All hours count towards a future PPL(H), and we provide a logbook entry signed by the instructor. A commemorative certificate is also available on request.' },
  { page: 'discovery', displayOrder: 9,  question: 'What should I wear?', answer: 'Comfortable clothing and flat shoes are ideal. Avoid loose scarves or open footwear. Smart-casual is perfectly appropriate — there is no need for specialist gear.' },
  { page: 'discovery', displayOrder: 10, question: 'Is there an age or weight limit?', answer: 'There is no minimum age — young children must be seated safely and weighed in advance. Weight limits apply per aircraft type and are assessed at booking. Contact us if you have specific requirements.' },
  { page: 'discovery', displayOrder: 11, question: 'What if I feel unwell or nervous during the flight?', answer: 'Tell your instructor immediately — they are trained to handle this and will prioritise your comfort. Most nerves pass quickly once you have the controls. You are always in safe hands.' },
  { page: 'discovery', displayOrder: 12, question: 'Where exactly does the flight depart from?', answer: 'All discovery flights depart from Hangar E, Denham Aerodrome, Uxbridge, UB9 5DF. Free parking is available on site. We are approximately 20 minutes from Central London via the M40.' },

  // Self-Fly Hire — additional questions (7–12)
  { page: 'sfh', displayOrder: 7,  question: 'Do you provide pre-flight briefings for hired aircraft?', answer: 'Yes. Every hire session begins with a full aircraft briefing covering systems, emergency procedures, and any specific airspace or procedural notes for your planned route.' },
  { page: 'sfh', displayOrder: 8,  question: 'What happens if I encounter a technical issue during flight?', answer: 'All our aircraft are maintained to the highest standards. If an issue arises, follow standard emergency procedures and contact ATC. A full safety briefing at dispatch covers contingencies in detail.' },
  { page: 'sfh', displayOrder: 9,  question: 'Can I fly to other airfields or am I restricted to Denham?', answer: 'You can fly anywhere within your competency and approved airspace permissions. We encourage cross-country flying and can assist with route planning, PPR, and fuel availability at destination airfields.' },
  { page: 'sfh', displayOrder: 10, question: 'How do I log my hours?', answer: 'You are responsible for your own pilot logbook. We provide a copy of the aircraft journey log entry at the end of each hire. Hobbs time is used for billing and matches your logged flying time.' },
  { page: 'sfh', displayOrder: 11, question: 'What is the fuel policy?', answer: 'Aircraft are returned with the same fuel level as departure. If you land away and refuel, retain the receipt and we will credit the cost at collection. We handle all fuel arrangements at Denham.' },
  { page: 'sfh', displayOrder: 12, question: 'Can I bring a passenger on self-fly hire?', answer: 'Yes, provided you hold the appropriate type rating and the passenger weight is within limits. Let us know when booking so we can calculate weight and balance in advance.' },

  // Sales — additional questions (7–12)
  { page: 'sales', displayOrder: 7,  question: 'Can you source a specific pre-owned aircraft for me?', answer: 'Yes. If you have a particular model, year, or specification in mind and we do not have it in stock, we will actively search our network of operators and dealers to find the right aircraft.' },
  { page: 'sales', displayOrder: 8,  question: 'What is included in the price of a new Robinson?', answer: 'New Robinson prices include factory standard equipment, initial airworthiness documentation, and UK CAA registration support. Customisation such as paint schemes, avionics upgrades, and interior options are quoted separately.' },
  { page: 'sales', displayOrder: 9,  question: 'Do you offer aircraft on operating lease?', answer: 'Yes, through our finance partners we can arrange operating leases that keep capital free and give you flexibility. Monthly payments, term lengths, and buyout options are tailored to your requirements.' },
  { page: 'sales', displayOrder: 10, question: 'Can I inspect the aircraft before purchasing?', answer: 'Absolutely. Pre-purchase viewings are always welcome, and we encourage an independent pre-purchase inspection for any pre-owned aircraft. We can recommend approved inspectors if required.' },
  { page: 'sales', displayOrder: 11, question: 'What after-sale support do you provide?', answer: 'As a full-service dealer and CAA Part 145 facility, we support every aircraft we sell with scheduled maintenance, AOG support, warranty claims, and access to our parts inventory.' },
  { page: 'sales', displayOrder: 12, question: 'How does part-exchange work?', answer: 'We value your existing aircraft based on current market conditions, condition, hours, and logbooks. The valuation is applied as a credit against your new purchase, reducing the finance required.' },

  // Night Rating — additional questions (7–12)
  { page: 'night-rating', displayOrder: 7,  question: 'Is there a ground school requirement for the Night Rating?', answer: 'Yes. Before flying, you will complete ground school covering night vision, lighting systems, aerodrome lighting, instrument interpretation, and emergency procedures. This is typically a half-day session.' },
  { page: 'night-rating', displayOrder: 8,  question: 'Can I do night training in the R66?', answer: 'Night training at HQ Aviation is conducted in the Robinson R44, which is well-equipped for night operations and provides an ideal platform for developing the precision required.' },
  { page: 'night-rating', displayOrder: 9,  question: 'Are there additional insurance requirements for night flying?', answer: 'Your standard aviation insurance policy will typically extend to night operations once you hold a Night Rating. We recommend confirming with your insurer before your first solo night flight.' },
  { page: 'night-rating', displayOrder: 10, question: 'How does the Night Rating affect my PPL(H) revalidation?', answer: 'The Night Rating does not change your PPL(H) revalidation requirements. You still need to pass an LPC every 24 months. Maintaining currency in both day and night flying is strongly recommended.' },
  { page: 'night-rating', displayOrder: 11, question: 'Can I carry passengers at night with a Night Rating?', answer: 'Yes. Once you hold a Night Rating you may carry passengers at night. Build personal night flying experience before doing so, and your insurer may impose minimum night-hour requirements.' },
  { page: 'night-rating', displayOrder: 12, question: 'What is the difference between a Night Rating and an Instrument Rating?', answer: 'A Night Rating authorises flight in VMC at night. An Instrument Rating allows flight in cloud and poor visibility. Night does not mean IMC — cloud at night still requires an IR to penetrate safely.' },

  // Type Rating — additional questions (7–12)
  { page: 'type-rating', displayOrder: 7,  question: 'Do you issue a certificate after completing a type rating?', answer: 'Yes. On completion, your licence is endorsed by the examiner and we provide a signed training record. CAA licensing updates are handled through the standard process your examiner will explain.' },
  { page: 'type-rating', displayOrder: 8,  question: 'Can I go straight into self-fly hire after a type rating?', answer: 'Yes. Once type-rated on one of our hire aircraft and with sufficient recent experience, you are eligible for self-fly hire. Currency and insurance requirements are reviewed at the time of booking.' },
  { page: 'type-rating', displayOrder: 9,  question: 'Is simulator training available for type ratings?', answer: 'We focus on genuine aircraft training rather than simulator hours, which produces more confident, aircraft-ready pilots and is the standard approach for Robinson type ratings.' },
  { page: 'type-rating', displayOrder: 10, question: 'Do you offer Robinson R22 type ratings?', answer: 'Yes. The R22 type rating is one of our most popular endorsements, particularly for PPL(H) holders looking to access more training aircraft and self-fly hire options.' },
  { page: 'type-rating', displayOrder: 11, question: 'Can type rating training be conducted at another airfield?', answer: 'In some cases we can travel for type rating training, particularly for fleet operators. Contact us with your location and requirements and we will advise on feasibility and costs.' },
  { page: 'type-rating', displayOrder: 12, question: 'I hold a foreign type rating — does it need revalidating for UK operations?', answer: 'If your type rating was issued under EASA or another authority, conversion requirements vary. We can review your licence and advise on the most efficient route to UK CAA recognition.' },

  // Helicopter Tour — additional questions (7–12)
  { page: 'helicopter-tour', displayOrder: 7,  question: 'How many passengers can the helicopter carry?', answer: 'The R66 carries up to 4 passengers alongside the pilot. Shared tour packages accommodate up to 4 guests. Private charters give your group exclusive use of the aircraft.' },
  { page: 'helicopter-tour', displayOrder: 8,  question: 'Can I request a specific route or landmark?', answer: 'We offer a standard London tour route designed for maximum landmark coverage. For private charters, we can adjust the route on request — subject to airspace constraints and ATC approval.' },
  { page: 'helicopter-tour', displayOrder: 9,  question: 'Are headsets provided?', answer: 'Yes. All passengers are fitted with noise-attenuating aviation headsets. You will hear the pilot commentary clearly and can communicate with the flight crew throughout the tour.' },
  { page: 'helicopter-tour', displayOrder: 10, question: 'What time of day gives the best photography conditions?', answer: 'The golden hour shortly after sunrise or before sunset produces the most dramatic lighting. Contact us when booking if you want to discuss timing options for your flight.' },
  { page: 'helicopter-tour', displayOrder: 11, question: 'Is there anything specific I should bring?', answer: 'Just your enthusiasm and a fully charged camera. Leave loose items in the car, bring any prescription medication, and wear flat-soled shoes for comfort on the ramp.' },
  { page: 'helicopter-tour', displayOrder: 12, question: 'Is the tour suitable for nervous or first-time flyers?', answer: 'Yes. Many guests have never flown in a small aircraft before. Our pilots are experienced at putting nervous passengers at ease. The smooth nature of helicopter flight surprises most first-timers.' },

  // Expeditions — additional questions (7–12)
  { page: 'expeditions', displayOrder: 7,  question: 'What destinations have you flown to on expeditions?', answer: 'Captain Q has led expeditions across Europe, Africa, the Arctic, and beyond. Past routes include the Scottish Highlands, Norway, Iceland, Morocco, and multi-week trans-continental journeys. Each new expedition is a genuine exploration.' },
  { page: 'expeditions', displayOrder: 8,  question: 'Do I need travel insurance for an expedition?', answer: 'Yes — comprehensive travel insurance including helicopter passenger cover and emergency repatriation is mandatory for all participants. We provide guidance on suitable policies as part of the expedition briefing pack.' },
  { page: 'expeditions', displayOrder: 9,  question: 'What if I need to withdraw before the expedition departs?', answer: 'Cancellation terms vary by expedition and are detailed in your booking agreement. We strongly recommend your travel insurance includes cancellation cover. Places are often transferable within the booking window.' },
  { page: 'expeditions', displayOrder: 10, question: 'Is there a physical fitness requirement?', answer: 'Helicopter expeditions are accessible to a wide range of fitness levels. Some destinations involve light walking or remote access. Specific requirements are communicated in the expedition brief well in advance.' },
  { page: 'expeditions', displayOrder: 11, question: 'Can the expedition be filmed or used commercially?', answer: 'Photography and personal film-making are always welcome. For commercial use of footage, discuss rights with Captain Q at the time of booking. We have supported professional media projects on past expeditions.' },
  { page: 'expeditions', displayOrder: 12, question: 'How do I reserve a place on an upcoming expedition?', answer: 'Contact us via the form on this page or call +44 1895 833373. A deposit secures your place. Full details, briefing packs, and pre-departure calls are arranged once you are confirmed.' },

  // Training FAQ — additional questions (11–12)
  { page: 'training-faq', displayOrder: 11, question: 'What is the minimum age to start helicopter training?', answer: 'There is no minimum age to begin lessons, but you must be 17 to fly solo and to hold a PPL(H). Many students start training in their teens and complete the licence shortly after their 17th birthday.' },
  { page: 'training-faq', displayOrder: 12, question: 'Are there any scholarship or bursary schemes available?', answer: 'HQ Aviation supports aspiring pilots through industry contacts and occasionally offers sponsored flying opportunities. Contact us to discuss your situation — we will always try to signpost funding options where we can.' },

  // CPL Training (12)
  { page: 'cpl', displayOrder: 1,  question: 'What is a CPL(H) and what does it allow me to do?', answer: 'A Commercial Pilot Licence (Helicopter) allows you to fly helicopters for hire or reward. With a CPL(H) you can act as pilot-in-command or co-pilot on commercial helicopter operations for pay.' },
  { page: 'cpl', displayOrder: 2,  question: 'What are the entry requirements for CPL(H) training?', answer: 'You must hold a PPL(H) with a minimum of 155 total flight hours (at least 50 PIC), a valid Class 1 medical certificate, and pass all CPL(H) theoretical knowledge examinations before the skills test.' },
  { page: 'cpl', displayOrder: 3,  question: 'How many flight hours are required for a CPL(H)?', answer: 'The UK CAA requires a minimum of 155 total flight hours, of which at least 50 must be as pilot-in-command. Additional hours may be required if specific cross-country or instrument time requirements are not met.' },
  { page: 'cpl', displayOrder: 4,  question: 'How long does CPL(H) training take?', answer: 'Duration depends on your existing hours. Students entering with a PPL(H) and around 100 hours may complete the additional training in 3–6 months full-time. Part-time students typically take 12–18 months.' },
  { page: 'cpl', displayOrder: 5,  question: 'What theoretical knowledge exams are required?', answer: 'The CPL(H) requires passing UK CAA theoretical exams in Air Law, Meteorology, Navigation, Human Performance, Principles of Flight, Aircraft General Knowledge, and Communications.' },
  { page: 'cpl', displayOrder: 6,  question: 'Can I work towards a CPL(H) while holding a PPL(H)?', answer: 'Yes. Many CPL(H) students hold a PPL(H) and build hours through self-fly hire, flying as P2, and other activities that count towards CPL(H) requirements while continuing other work.' },
  { page: 'cpl', displayOrder: 7,  question: 'What is the difference between a CPL(H) and an ATPL(H)?', answer: 'A CPL(H) allows pilot-in-command on single-pilot commercial operations. An ATPL(H) is required for PIC on multi-crew commercial operations and has significantly higher hours requirements.' },
  { page: 'cpl', displayOrder: 8,  question: 'What aircraft are available for CPL(H) training at HQ Aviation?', answer: 'We conduct CPL(H) training in the Robinson R44 and R66. The R44 offers low operating costs for hour-building; the R66 turbine adds commercial relevance for students targeting turbine roles.' },
  { page: 'cpl', displayOrder: 9,  question: 'Is a Class 1 medical required for CPL(H)?', answer: 'Yes. A valid Class 1 medical certificate is required before taking the CPL(H) skills test and for exercising commercial privileges. We can advise on approved Aeromedical Examiners.' },
  { page: 'cpl', displayOrder: 10, question: 'What career opportunities does a CPL(H) open up?', answer: 'A CPL(H) opens doors to charter, aerial survey, offshore, emergency medical services, film and TV, police and coastguard aviation, and corporate transport. Most roles also require relevant type ratings and experience.' },
  { page: 'cpl', displayOrder: 11, question: 'Can I fly commercially with just a CPL(H) and no type rating?', answer: 'You need both a CPL(H) and a type rating for the specific aircraft you intend to operate commercially. The CPL(H) skills test is typically conducted on the same type you will use in your first role.' },
  { page: 'cpl', displayOrder: 12, question: 'Do you provide guidance on CAA licensing paperwork for CPL(H)?', answer: 'Yes. We support students through every stage of the licensing process, from medical declarations to skills test application, including CAA liaison where required.' },

  // Advanced Training (12)
  { page: 'advanced-training', displayOrder: 1,  question: 'What does your Advanced Training programme cover?', answer: 'Advanced Training covers specialist flight skills beyond the PPL(H) standard — including mountain flying, external load operations, confined area techniques, and precision manoeuvring for professional applications.' },
  { page: 'advanced-training', displayOrder: 2,  question: 'Do I need a PPL(H) before undertaking Advanced Training?', answer: 'Yes. A valid PPL(H) or higher licence is required for all Advanced Training courses. Some courses may also specify a minimum post-licence hours requirement. Contact us to confirm prerequisites.' },
  { page: 'advanced-training', displayOrder: 3,  question: 'What is a Mountain Flying course?', answer: 'Mountain Flying training develops the skills needed to operate safely in high terrain — orographic lift, downdraught management, route planning, and emergency procedures specific to mountain environments.' },
  { page: 'advanced-training', displayOrder: 4,  question: 'What is a sling load or external load endorsement?', answer: 'A sling load endorsement authorises you to carry underslung loads — essential for construction, logistics, and fire support. Training covers load preparation, long-line handling, communication, and emergency procedures.' },
  { page: 'advanced-training', displayOrder: 5,  question: 'How is Advanced Training different from a type rating?', answer: 'A type rating authorises you to fly a specific aircraft type. Advanced Training adds operational skill endorsements for specific techniques or environments. Both may be required depending on your role.' },
  { page: 'advanced-training', displayOrder: 6,  question: 'How long do Advanced Training courses take?', answer: 'Duration varies by endorsement. Mountain flying typically takes 3–5 days in the field. Sling load endorsements can be completed in 1–2 days. We tailor programmes to your starting experience level.' },
  { page: 'advanced-training', displayOrder: 7,  question: 'Can I combine multiple endorsements in one visit?', answer: 'Yes. We can sequence multiple endorsements in a single training period with advance planning. This is popular with operators preparing for multi-role deployments. Contact us to design a combined programme.' },
  { page: 'advanced-training', displayOrder: 8,  question: 'Is Advanced Training recognised by the UK CAA?', answer: 'Yes. All endorsements are conducted under UK CAA regulatory framework. Where formal CAA endorsement documents are issued, we handle the paperwork and provide training records on completion.' },
  { page: 'advanced-training', displayOrder: 9,  question: 'Are Advanced Training courses available year-round?', answer: 'Core courses run throughout the year. Mountain flying courses depend on location and season — we coordinate with partner sites that offer appropriate terrain and conditions. Contact us for availability.' },
  { page: 'advanced-training', displayOrder: 10, question: 'What aircraft are used for Advanced Training?', answer: 'Advanced Training is conducted across our Robinson fleet, with aircraft matched to the endorsement. The R44 is used for most programmes; the R66 is available for operators wanting turbine-specific training.' },
  { page: 'advanced-training', displayOrder: 11, question: 'Are courses available for individuals or groups?', answer: 'Both. Individual bespoke courses are the most common format, but group programmes can be arranged for operators training multiple pilots. Pricing and scheduling are discussed at the enquiry stage.' },
  { page: 'advanced-training', displayOrder: 12, question: 'Can Advanced Training hours count towards CPL(H) requirements?', answer: 'Some advanced training hours flown as PIC may count towards CPL(H) total time requirements, depending on the nature of the flying. We advise on this at planning stage so your training works towards multiple goals.' },

  // Pilot Provisioning (12)
  { page: 'pilot-provisioning', displayOrder: 1,  question: 'What is the Pilot Provisioning service?', answer: 'Pilot Provisioning places experienced, vetted helicopter pilots with operators and organisations on a contract, daily rate, or project basis. Whether you need cover, capacity, or specialist skills, we match the right pilot to your requirement.' },
  { page: 'pilot-provisioning', displayOrder: 2,  question: 'What qualifications do your provisioned pilots hold?', answer: 'All pilots hold valid UK CAA or EASA licences appropriate to the operation, current medical certificates, and relevant type ratings. Background checks and references are conducted on every pilot we place.' },
  { page: 'pilot-provisioning', displayOrder: 3,  question: 'How quickly can a pilot be made available?', answer: 'For standard coverage requests we aim to confirm a pilot within 48 hours. For short-notice or AOG cover, we maintain a roster of immediately available pilots and can often respond same-day.' },
  { page: 'pilot-provisioning', displayOrder: 4,  question: 'What types of operations do you support?', answer: 'We support charter, aerial survey, construction, agricultural, media, offshore, corporate transport, and training operations. Tell us your operation type and we will match the most experienced candidate available.' },
  { page: 'pilot-provisioning', displayOrder: 5,  question: 'Can you provide pilots for film and media work?', answer: 'Yes. We have pilots with specific experience in aerial filming, including working with camera crews and following shot lists. Familiarity with restricted airspace and multi-aircraft coordination is part of that profile.' },
  { page: 'pilot-provisioning', displayOrder: 6,  question: 'Are your pilots familiar with the Robinson fleet?', answer: 'Yes. The majority of our provisioned pilots have extensive Robinson experience on R22, R44, and R66. We can also source pilots for other piston and turbine types — let us know your specific aircraft.' },
  { page: 'pilot-provisioning', displayOrder: 7,  question: 'Do you provide pilots for long-term contracts?', answer: 'Yes. We place pilots on contracts ranging from single days to multi-year agreements. Longer placements include periodic performance reviews and the option to adjust to changing operational requirements.' },
  { page: 'pilot-provisioning', displayOrder: 8,  question: 'How does pilot vetting and background checking work?', answer: 'Every pilot undergoes licence verification, medical confirmation, reference checks, and an interview with our chief pilot. Criminal record checks are conducted where the role requires it. Full documentation is provided on placement.' },
  { page: 'pilot-provisioning', displayOrder: 9,  question: 'Can you supply a combined aircraft and pilot package?', answer: 'Yes. As an aircraft operator and pilot provider, we can offer turnkey helicopter solutions: aircraft, crew, maintenance, and insurance in a single package. Popular with operators wanting to avoid aircraft ownership complexity.' },
  { page: 'pilot-provisioning', displayOrder: 10, question: 'What geographic areas do you cover?', answer: 'We primarily serve UK operations but regularly place pilots internationally across Europe, the Middle East, and Africa. Notify us of your location and we will advise on availability and logistics.' },
  { page: 'pilot-provisioning', displayOrder: 11, question: 'Are pilots available for international assignments?', answer: 'Yes. Several of our provisioned pilots hold multi-country licences or are willing to convert for specific assignments. Visa, work permit, and insurance requirements are reviewed as part of the placement process.' },
  { page: 'pilot-provisioning', displayOrder: 12, question: 'How do I enquire about Pilot Provisioning?', answer: 'Call us on +44 1895 833373, email Operations@HQAviation.com, or use the contact form on this page. Provide the aircraft type, operation type, location, and required dates and we will respond promptly.' },

  // SuperYacht Ops (12)
  { page: 'superyacht-ops', displayOrder: 1,  question: 'What does the SuperYacht Operations service cover?', answer: 'We provide helicopter support for superyacht programmes — yacht-based operations, shore excursions, guest transfers, and aerial photography. Aircraft, crew, permits, and logistics managed end-to-end.' },
  { page: 'superyacht-ops', displayOrder: 2,  question: 'What helicopter types are suitable for superyacht operations?', answer: 'The Robinson R66 Turbine is our primary superyacht platform — compact enough for helidecks, powerful enough for warm high-altitude environments, and reliable for sustained remote operations. Larger types sourced on request.' },
  { page: 'superyacht-ops', displayOrder: 3,  question: 'What pilot qualifications are required for offshore operations?', answer: 'Pilots hold CPL(H) or higher, current instrument ratings, sea survival certificates, and helicopter underwater escape training (HUET). All crew hold valid medicals appropriate for the operation.' },
  { page: 'superyacht-ops', displayOrder: 4,  question: 'What is the maximum operational range from the yacht?', answer: 'The R66 has a range of approximately 350 nautical miles with standard tanks. Operational range depends on altitude, payload, and temperature. All flights are planned with appropriate reserves and contingency.' },
  { page: 'superyacht-ops', displayOrder: 5,  question: 'What is a helideck approval and do you work with approved vessels?', answer: 'A helideck approval is issued by the maritime authority confirming a landing area meets safety standards. We work with vessels holding appropriate approvals and can advise on the approval process for new helidecks.' },
  { page: 'superyacht-ops', displayOrder: 6,  question: 'Can you supply both the helicopter and the pilot?', answer: 'Yes. We offer turnkey superyacht packages including aircraft, qualified crew, maintenance support, fuel management, permits, and full insurance — a complete solution for vessel owners and charter managers.' },
  { page: 'superyacht-ops', displayOrder: 7,  question: 'What safety standards govern superyacht helicopter operations?', answer: 'Operations comply with UK CAA regulations, IOGP aviation safety guidelines adapted for private aviation, and applicable maritime authority requirements. Safety management systems and pre-flight risk assessments are applied on every flight.' },
  { page: 'superyacht-ops', displayOrder: 8,  question: 'Are there restrictions on night operations from a superyacht?', answer: 'Night helicopter operations from vessels require specific lighting, equipment, and crew qualifications. We assess each vessel and route individually. Most programmes operate daylight-only unless specific night capability has been established.' },
  { page: 'superyacht-ops', displayOrder: 9,  question: 'How do you handle maintenance when operating remotely?', answer: 'We carry a comprehensive spares kit for extended deployments and maintain contact with Robinson service centres globally. For planned maintenance events we position the aircraft at the nearest approved facility.' },
  { page: 'superyacht-ops', displayOrder: 10, question: 'What does a typical superyacht helicopter programme look like?', answer: 'Programmes range from a season-long Mediterranean deployment to a single-week Caribbean charter. Typically: positioning flights, daily guest transfers, coastal excursions, and crew standby as required.' },
  { page: 'superyacht-ops', displayOrder: 11, question: 'Do you operate year-round and internationally?', answer: 'Yes. We operate globally across all seasons, following clients to the Mediterranean, Caribbean, Indian Ocean, and beyond. Seasonal scheduling and advance positioning planning is included in each programme.' },
  { page: 'superyacht-ops', displayOrder: 12, question: 'Can you assist with CAA and coastal state permits for offshore operations?', answer: 'Yes. Permit management is included in our superyacht service. We handle UK CAA approvals and coordinate with coastal state aviation authorities for overflying, landing, and operational permissions throughout the programme.' },

  // Aircraft Consulting (12)
  { page: 'aircraft-consulting', displayOrder: 1,  question: 'What does the Aircraft Consulting service cover?', answer: 'Our consulting provides independent expert advice on helicopter acquisition, airworthiness, compliance, operations, and fleet management — without the conflict of interest of a pure sales operation.' },
  { page: 'aircraft-consulting', displayOrder: 2,  question: 'Can you help me decide which Robinson model is right for me?', answer: 'Yes. We assess your mission profile, budget, operational base, and maintenance support requirements and provide an objective recommendation across the Robinson range — or advise if a different type suits your needs better.' },
  { page: 'aircraft-consulting', displayOrder: 3,  question: 'Do you carry out pre-purchase inspections?', answer: 'Yes. Our engineers conduct thorough pre-purchase inspections covering airframe condition, engine and transmission health, avionics, logbook review, AD compliance, and overall airworthiness. A written report is provided.' },
  { page: 'aircraft-consulting', displayOrder: 4,  question: 'Can you review maintenance records and logbooks on my behalf?', answer: 'Absolutely. Logbook audits are one of the most valuable parts of any pre-purchase process. We identify gaps, unapproved entries, and components approaching life limits — information that materially affects value.' },
  { page: 'aircraft-consulting', displayOrder: 5,  question: 'Do you advise on hangarage, insurance, and operating cost structures?', answer: 'Yes. We can model total cost of ownership for specific aircraft types, including fuel, maintenance reserves, insurance, and hangarage — giving you a realistic picture of what ownership truly costs before you commit.' },
  { page: 'aircraft-consulting', displayOrder: 6,  question: 'What changed for UK helicopter operators after Brexit?', answer: 'Post-Brexit, UK operators need UK CAA approval rather than EASA. Aircraft on EASA registration require UK CAA validation to operate commercially in the UK. We advise on the implications for your specific aircraft and operation.' },
  { page: 'aircraft-consulting', displayOrder: 7,  question: 'Can you assist with import or export of a helicopter?', answer: 'Yes. We manage the technical, documentation, and regulatory aspects — including de-registration, re-registration, export airworthiness review, and customs classification.' },
  { page: 'aircraft-consulting', displayOrder: 8,  question: 'Do you support operators seeking an AOC or compliance review?', answer: 'Yes. We provide operational and airworthiness guidance to operators working towards an AOC or undergoing CAA oversight. This includes document review, gap analysis, and preparation for CAA audits.' },
  { page: 'aircraft-consulting', displayOrder: 9,  question: 'Are consulting services available internationally?', answer: 'Yes. We advise clients globally, conducting remote reviews and travelling for physical inspections when required. Our experience covers UK, European, Middle Eastern, and offshore operations.' },
  { page: 'aircraft-consulting', displayOrder: 10, question: 'What is the typical cost of an aircraft consulting engagement?', answer: 'Pre-purchase inspections are quoted per aircraft and location. Advisory retainers and operational reviews are quoted based on scope. Contact us with your requirement and we will provide a transparent fee structure.' },
  { page: 'aircraft-consulting', displayOrder: 11, question: 'Can you advise on hull valuation and insurance specifications?', answer: 'Yes. We provide market-based hull valuations and can review your insurance policy to confirm coverage is appropriate for your operation, particularly for commercial use or internationally deployed aircraft.' },
  { page: 'aircraft-consulting', displayOrder: 12, question: 'Do you offer ongoing advisory retainers?', answer: 'Yes. Many clients retain us for fleet oversight, regulatory updates, maintenance review, and ad hoc advice. Retainer arrangements are flexible and can be paused or expanded as needs change.' },
];

// ─── CLI flags ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const force = args.includes('--force');
const pageFlag = (args.find(a => a.startsWith('--page=')) || '').replace('--page=', '') || null;

const KNOWN_PAGES = [...new Set(ALL_FAQS.map(f => f.page))];

if (pageFlag && !KNOWN_PAGES.includes(pageFlag)) {
  console.error(`Unknown page key: "${pageFlag}". Known pages:\n  ${KNOWN_PAGES.join(', ')}`);
  process.exit(1);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const db = admin.firestore();
  const col = db.collection('faqs');

  const toSeed = pageFlag ? ALL_FAQS.filter(f => f.page === pageFlag) : ALL_FAQS;
  const scope = pageFlag ? `page "${pageFlag}"` : 'all pages';

  // Check for existing data in scope
  const existingSnap = pageFlag
    ? await col.where('page', '==', pageFlag).limit(1).get()
    : await col.limit(1).get();

  if (!existingSnap.empty && !force) {
    console.log(`FAQs already exist for ${scope}. Run with --force to clear and re-seed.`);
    process.exit(0);
  }

  // Clear existing docs in scope if --force
  if (force) {
    const toDelete = pageFlag
      ? await col.where('page', '==', pageFlag).get()
      : await col.get();

    if (!toDelete.empty) {
      // Firestore batches cap at 500 ops
      const chunks = [];
      for (let i = 0; i < toDelete.docs.length; i += 500) {
        chunks.push(toDelete.docs.slice(i, i + 500));
      }
      for (const chunk of chunks) {
        const batch = db.batch();
        chunk.forEach(d => batch.delete(d.ref));
        await batch.commit();
      }
      console.log(`  Deleted ${toDelete.docs.length} existing FAQ doc(s) for ${scope}.`);
    }
  }

  // Write in batches of 500
  const chunks = [];
  for (let i = 0; i < toSeed.length; i += 500) {
    chunks.push(toSeed.slice(i, i + 500));
  }
  for (const chunk of chunks) {
    const batch = db.batch();
    chunk.forEach(faq => batch.set(col.doc(), { ...faq, visible: true }));
    await batch.commit();
  }

  console.log(`✓ Seeded ${toSeed.length} FAQs for ${scope}.`);
  process.exit(0);
}

main().catch(err => { console.error(err.message); process.exit(1); });
