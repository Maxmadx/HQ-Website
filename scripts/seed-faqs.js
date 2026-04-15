require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const admin = require('../api/firebase-admin');

const ALL_FAQS = [
  // discovery (5)
  { page: 'discovery', displayOrder: 1, question: 'Do I need any prior experience?', answer: "No prior experience is required. Our instructors will guide you through everything from the pre-flight briefing to hands-on flying. Discovery flights are designed for complete beginners." },
  { page: 'discovery', displayOrder: 2, question: 'Can I bring passengers?', answer: "Yes! Depending on the helicopter type and weights, you may be able to bring 1–2 passengers. Let us know when booking so we can arrange the appropriate aircraft." },
  { page: 'discovery', displayOrder: 3, question: 'What happens if the weather is bad?', answer: "Safety is our priority. If weather conditions are unsuitable, we'll reschedule at no extra cost. We monitor conditions closely and give as much notice as possible." },
  { page: 'discovery', displayOrder: 4, question: "Does this count towards my pilot's licence?", answer: "Yes! Hours flown during your discovery flight count towards PPL(H) training. We'll log everything properly if you decide to continue with us." },
  { page: 'discovery', displayOrder: 5, question: 'Is this suitable as a gift?', answer: "Absolutely! Discovery flights make unforgettable gifts. We offer vouchers valid for 12 months, giving flexibility to book at their convenience." },

  // sfh (6)
  { page: 'sfh', displayOrder: 1, question: 'What are the minimum requirements to hire?', answer: "You need a valid PPL(H) with a current medical certificate, the appropriate type rating for your chosen aircraft, and recent flight experience. If you haven't flown recently, we can arrange a currency check flight." },
  { page: 'sfh', displayOrder: 2, question: 'How far in advance should I book?', answer: "We recommend booking at least 48 hours in advance, especially for weekends and holidays. However, subject to availability, we can accommodate same-day bookings." },
  { page: 'sfh', displayOrder: 3, question: 'Is insurance included?', answer: "Yes, comprehensive hull and liability insurance is included in all hire rates. Your excess is £5,000 for the R22, £7,500 for the R44, and £10,000 for the R66." },
  { page: 'sfh', displayOrder: 4, question: 'Can I fly abroad?', answer: "Yes, with prior arrangement. We can assist with flight planning, customs requirements, and necessary permissions for international flights." },
  { page: 'sfh', displayOrder: 5, question: 'What happens if I need to cancel?', answer: "Cancellations made more than 24 hours before your booking receive a full refund. Cancellations within 24 hours are charged at 50% of the booking value." },
  { page: 'sfh', displayOrder: 6, question: 'Do you offer block booking discounts?', answer: "Yes, we offer discounted rates for block bookings of 10 hours or more. Contact us for a personalised quote based on your flying requirements." },

  // sales (6)
  { page: 'sales', displayOrder: 1, question: 'How long does delivery take for a new helicopter?', answer: "Delivery times vary by model and configuration. Typically, a new Robinson takes 3–6 months from order to delivery. We'll keep you informed throughout the process." },
  { page: 'sales', displayOrder: 2, question: 'Can I trade in my current aircraft?', answer: "Yes, we accept trade-ins on all Robinson models. We'll provide a fair market valuation and apply it against your new purchase. Contact us to arrange an assessment." },
  { page: 'sales', displayOrder: 3, question: 'What financing options are available?', answer: "We work with specialist aviation finance providers to offer competitive rates. Options include hire purchase, finance lease, and operating lease. We can tailor a package to your requirements." },
  { page: 'sales', displayOrder: 4, question: 'Do you offer demo flights?', answer: "Yes, we offer demonstration flights on all Robinson models. This gives you the opportunity to experience the aircraft before committing to a purchase." },
  { page: 'sales', displayOrder: 5, question: 'What warranty comes with a new Robinson?', answer: "All new Robinsons come with a 2-year/2,000-hour factory warranty. As an authorised dealer, we handle all warranty claims directly with Robinson Helicopter Company." },
  { page: 'sales', displayOrder: 6, question: 'Can you deliver internationally?', answer: "Yes, we can arrange delivery worldwide. We handle all the paperwork, export documentation, and can arrange ferry flights or shipping depending on the destination." },

  // expeditions (6)
  { page: 'expeditions', displayOrder: 1, question: 'Do I need flying experience to join an expedition?', answer: "No — most of our expedition participants are passengers, not pilots. If you are a pilot and wish to fly legs of the expedition, this can be arranged based on your experience and the aircraft being used." },
  { page: 'expeditions', displayOrder: 2, question: 'What is included in the expedition price?', answer: "Each expedition is bespoke, but typically includes all fuel, handling, accommodation, ground transport, and the expertise of our expedition team. Full details are provided in the expedition briefing pack." },
  { page: 'expeditions', displayOrder: 3, question: 'How many people can join an expedition?', answer: "Group size varies by expedition. Most depart with 3–8 participants across multiple aircraft. Bespoke private expeditions for smaller groups are also available." },
  { page: 'expeditions', displayOrder: 4, question: 'What happens if weather delays the expedition?', answer: "Expeditions include built-in weather days and flexible routing. Captain Q has extensive experience planning around weather in remote environments. Safety always takes priority over schedule." },
  { page: 'expeditions', displayOrder: 5, question: 'Can I bring camera equipment?', answer: "Absolutely. Many expedition participants are photographers and filmmakers. We can advise on weight and space allowances when you book, and can often accommodate larger rigs with advance notice." },
  { page: 'expeditions', displayOrder: 6, question: 'Are bespoke expeditions available?', answer: "Yes. If you have a destination in mind, we'd love to hear from it. Captain Q has flown to every continent and relishes the challenge of designing a new route. Contact us to start the conversation." },

  // ppl (6)
  { page: 'ppl', displayOrder: 1, question: 'How long does it take to get a PPL(H)?', answer: "The minimum is 45 flight hours, but most students take 55–70 hours depending on frequency of training and aptitude. Training full-time, you could achieve your licence in 3–4 months. Part-time students typically take 12–18 months." },
  { page: 'ppl', displayOrder: 2, question: 'Do I need any previous flying experience?', answer: "No experience is necessary. We start from the very beginning and tailor the pace to each student. A discovery flight beforehand is a great way to confirm the sport is right for you." },
  { page: 'ppl', displayOrder: 3, question: 'Can I fly in winter?', answer: "Yes. We train year-round. Winter flying builds excellent skills — shorter days mean you'll build instrument appreciation early, and cold, dense air gives great helicopter performance." },
  { page: 'ppl', displayOrder: 4, question: 'What medical certificate do I need?', answer: "A LAPL(H) or Class 2 medical certificate is required. These are obtained through a CAA-approved Aeromedical Examiner (AME). We can advise on the process when you join us." },
  { page: 'ppl', displayOrder: 5, question: 'Is financing available?', answer: "Yes. We work with aviation finance specialists who offer payment plans tailored to training. Contact us for details and we'll connect you with the right provider." },
  { page: 'ppl', displayOrder: 6, question: 'What happens after I get my PPL(H)?', answer: "The world opens up. Many graduates go straight into self-fly hire with us, others build hours toward a Commercial Pilot Licence, and some pursue type ratings or night ratings. We'll help you plan the next step." },

  // night-rating (6)
  { page: 'night-rating', displayOrder: 1, question: 'What is a Night Rating?', answer: "A Night Rating allows PPL(H) holders to fly at night in Visual Meteorological Conditions (VMC). It significantly extends your flying capability and is a prerequisite for many commercial operations." },
  { page: 'night-rating', displayOrder: 2, question: 'How long does the Night Rating course take?', answer: "The course requires a minimum of 5 hours of night flying, including 3 hours dual instruction and 1 hour solo cross-country. Most students complete the rating within 2–4 weeks." },
  { page: 'night-rating', displayOrder: 3, question: 'Can I fly in cloud or poor visibility at night?', answer: "No. The Night Rating only covers flight in Visual Meteorological Conditions (VMC) at night. Flight in cloud or Instrument Meteorological Conditions (IMC) requires an Instrument Rating." },
  { page: 'night-rating', displayOrder: 4, question: 'What aircraft is used for night training?', answer: "We conduct night training in the Robinson R44, which is equipped with the necessary lighting and instruments for night operations." },
  { page: 'night-rating', displayOrder: 5, question: 'When is night training conducted?', answer: "Night training takes place after official sunset. The exact timing varies by season — we schedule sessions to make the most of available darkness while working around your schedule." },
  { page: 'night-rating', displayOrder: 6, question: 'Will my daylight flying improve after night training?', answer: "Consistently, yes. Night flying demands greater precision and instrument awareness. Pilots invariably report that their general flying accuracy improves significantly after completing a Night Rating." },

  // type-rating (6)
  { page: 'type-rating', displayOrder: 1, question: 'What is a Type Rating?', answer: "A Type Rating is a qualification to fly a specific aircraft type. In helicopters, common type ratings include the Robinson R22, R44, R66, and various turbine types. You need a type rating for each aircraft type you wish to fly." },
  { page: 'type-rating', displayOrder: 2, question: 'How long does it take to get a Type Rating?', answer: "Duration varies by aircraft and your existing experience. An R44 type rating for an experienced R22 pilot might take 5–10 hours. A turbine type rating for a new turbine pilot typically takes 15–25 hours." },
  { page: 'type-rating', displayOrder: 3, question: 'Do I need any previous experience on the type?', answer: "No prior experience on the specific type is needed. You do need a valid PPL(H) and relevant experience on a similar category of aircraft. We'll assess your background before recommending the right approach." },
  { page: 'type-rating', displayOrder: 4, question: "What's the difference between piston and turbine type ratings?", answer: "Piston type ratings (R22, R44) are straightforward endorsements. Turbine type ratings (R66, larger turbines) are more involved, covering more complex systems, emergency procedures, and often require a ground school component." },
  { page: 'type-rating', displayOrder: 5, question: 'Can I do multiple type ratings at once?', answer: "It's generally better to complete one type rating before starting another, to avoid confusion between aircraft systems and handling characteristics. We'll advise on the best sequence for your goals." },
  { page: 'type-rating', displayOrder: 6, question: 'How often do type ratings need to be renewed?', answer: "UK CAA type ratings do not expire, but you must maintain currency (recent flight experience) and pass a Licence Proficiency Check (LPC) every 12 months to exercise the privileges of your licence." },

  // training-faq (10)
  { page: 'training-faq', displayOrder: 1, question: 'How long does it take to get a helicopter license?', answer: "The minimum is 45 flight hours for a PPL(H), but most students require 55–70 hours. Training full-time you could achieve this in 3–4 months; part-time students typically take 12–18 months." },
  { page: 'training-faq', displayOrder: 2, question: 'How much does helicopter training cost?', answer: "A full PPL(H) typically costs between £35,000 and £50,000 depending on the number of hours required. We offer transparent hourly rates with no hidden fees. Contact us for a personalised estimate." },
  { page: 'training-faq', displayOrder: 3, question: 'Do I need any prior experience to learn to fly?', answer: "No experience is necessary. We welcome complete beginners. A trial lesson is a great way to experience helicopter flight before committing to a full course." },
  { page: 'training-faq', displayOrder: 4, question: 'What medical requirements are there?', answer: "You need a LAPL(H) or Class 2 medical certificate from a CAA-approved Aeromedical Examiner. This is a straightforward medical — most healthy adults pass without issue." },
  { page: 'training-faq', displayOrder: 5, question: 'What helicopters do you train in?', answer: "We train primarily in the Robinson R22 and R44 — the world's most widely used training helicopters. Both are safe, reliable, and excellent platforms for developing core flying skills." },
  { page: 'training-faq', displayOrder: 6, question: 'Can I fly in any weather?', answer: "Training is conducted in Visual Meteorological Conditions (VMC). We fly in a wide range of weather but always within safety limits. Bad weather days are used for ground school and simulator training." },
  { page: 'training-faq', displayOrder: 7, question: 'What is a trial lesson?', answer: "A trial lesson (Discovery Flight) is a 30 or 60-minute introductory flight where you take the controls under the supervision of an instructor. It counts towards your PPL(H) hours if you decide to continue." },
  { page: 'training-faq', displayOrder: 8, question: 'Can I bring someone with me for my lesson?', answer: "Yes, depending on the aircraft type and weight allowances. An R44 can carry one additional passenger alongside student and instructor. Let us know when booking." },
  { page: 'training-faq', displayOrder: 9, question: 'What can I do with a helicopter license?', answer: "A PPL(H) lets you fly yourself, family and friends anywhere in the UK and Europe. Many pilots go on to build hours, obtain commercial licences, night ratings, instrument ratings, or type ratings on larger aircraft." },
  { page: 'training-faq', displayOrder: 10, question: 'How do I book training or a trial lesson?', answer: "Call us on +44 1895 833373, email Operations@HQAviation.com, or use the booking form on our website. We're available 7 days a week from 09:00–17:00." },
];

async function main() {
  const db = admin.firestore();
  const col = db.collection('faqs');

  const existing = await col.limit(1).get();
  if (!existing.empty) {
    console.log('faqs collection already has data — skipping seed. Delete existing docs first to re-seed.');
    process.exit(0);
  }

  const batch = db.batch();
  for (const faq of ALL_FAQS) {
    batch.set(col.doc(), { ...faq, visible: true });
  }
  await batch.commit();
  console.log(`✓ Seeded ${ALL_FAQS.length} FAQs into Firestore.`);
  process.exit(0);
}

main().catch((err) => { console.error(err.message); process.exit(1); });
