# FAQ Scrollable + Load More Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every FAQ section scrollable when side-by-side with a "Visit Us" panel (desktop — height matches the map card, list scrolls inside), and add a "Load More" button for all standalone FAQ sections and the mobile view of side-by-side sections. Expand every FAQ page to 12 questions minimum to guarantee overflow content.

**Architecture:** `arrivalStyles` (exported from `src/components/ArrivalSection.jsx` and shared by DiscoveryFlight + FinalPPL) receives the scroll CSS. Standalone pages each gain a `showAllFaqs` useState, slice `faqs`/`rawFaqs` to first 6, and render a Load More button. FAQ content added to `scripts/seed-faqs.js` and seeded with `--force`.

**Tech Stack:** React useState, Framer Motion, Firestore via useFaqs hook, inline CSS-in-JSX `<style>` blocks.

---

### Task 1: Expand seed-faqs.js with 12 questions per page

**Files:**
- Modify: `scripts/seed-faqs.js`

Add entries after existing ones for each page. Run `node scripts/seed-faqs.js --page=<key> --force` per page after editing.

- [ ] **Step 1: Add PPL additional questions (6 → 12)**

In `ALL_FAQS`, after the existing 6 `page: 'ppl'` entries, add:

```javascript
{ page: 'ppl', displayOrder: 7,  question: 'How much does PPL(H) training cost?', answer: 'A full PPL(H) typically costs between £35,000 and £50,000 depending on hours flown. We provide transparent hourly rates with no hidden fees. Contact us for a personalised estimate based on your learning pace.' },
{ page: 'ppl', displayOrder: 8,  question: 'Can I train at weekends and evenings?', answer: 'Yes. We offer flexible scheduling including weekends and early-morning slots. Part-time students make excellent progress fitting sessions around work and family commitments.' },
{ page: 'ppl', displayOrder: 9,  question: 'What is the minimum age to get a helicopter licence?', answer: 'You can begin training at any age, but you must be 17 to fly solo and hold a PPL(H). Many students start lessons in their teens and complete the licence at 17.' },
{ page: 'ppl', displayOrder: 10, question: 'What ground school topics does PPL training cover?', answer: 'Ground school covers air law, meteorology, navigation, human performance, aircraft technical knowledge, communications, and principles of flight. We integrate theory with practical flying to reinforce understanding.' },
{ page: 'ppl', displayOrder: 11, question: 'How do I know when I am ready for my skills test?', answer: 'Your instructor will recommend you for the skills test when you consistently meet the required standard. There is no fixed number of hours — readiness is assessed by performance, not a calendar.' },
{ page: 'ppl', displayOrder: 12, question: 'Can I start on the R22 and move to the R44?', answer: 'Yes. Many students begin on the R22 for its low cost per hour and transition to the R44 as skills develop. Each aircraft requires its own type endorsement, which we handle as part of your training plan.' },
```

- [ ] **Step 2: Add Discovery additional questions (5 → 12)**

After the existing 5 `page: 'discovery'` entries:

```javascript
{ page: 'discovery', displayOrder: 6,  question: 'What will I actually do during the flight?', answer: 'After a pre-flight briefing your instructor will demonstrate basic controls, then hand them over to you. You will fly straight and level, gentle turns, and may even hover briefly — all under close supervision.' },
{ page: 'discovery', displayOrder: 7,  question: 'How long is the discovery flight?', answer: 'Discovery flights are available in 30-minute or 60-minute formats. We recommend 60 minutes for a fuller experience, including time over the London skyline and surrounding countryside.' },
{ page: 'discovery', displayOrder: 8,  question: 'Can I get a certificate or logbook entry?', answer: 'Yes. All hours count towards a future PPL(H), and we provide a logbook entry signed by the instructor. A commemorative certificate is also available on request.' },
{ page: 'discovery', displayOrder: 9,  question: 'What should I wear?', answer: 'Comfortable clothing and flat shoes are ideal. Avoid loose scarves or open footwear. Smart-casual is perfectly appropriate — there is no need for specialist gear.' },
{ page: 'discovery', displayOrder: 10, question: 'Is there an age or weight limit?', answer: 'There is no minimum age — young children must be seated safely and weighed in advance. Weight limits apply per aircraft type and are assessed at booking. Contact us if you have specific requirements.' },
{ page: 'discovery', displayOrder: 11, question: 'What if I feel unwell or nervous during the flight?', answer: 'Tell your instructor immediately — they are trained to handle this and will prioritise your comfort. Most nerves pass quickly once you have the controls. You are always in safe hands.' },
{ page: 'discovery', displayOrder: 12, question: 'Where exactly does the flight depart from?', answer: 'All discovery flights depart from Hangar E, Denham Aerodrome, Uxbridge, UB9 5DF. Free parking is available on site. We are approximately 20 minutes from Central London via the M40.' },
```

- [ ] **Step 3: Add SFH additional questions (6 → 12)**

After the existing 6 `page: 'sfh'` entries:

```javascript
{ page: 'sfh', displayOrder: 7,  question: 'Do you provide pre-flight briefings for hired aircraft?', answer: 'Yes. Every hire session begins with a full aircraft briefing covering systems, emergency procedures, and any specific airspace or procedural notes for your planned route.' },
{ page: 'sfh', displayOrder: 8,  question: 'What happens if I encounter a technical issue during flight?', answer: 'All our aircraft are maintained to the highest standards. If an issue arises, follow standard emergency procedures and contact ATC. A full safety briefing at dispatch covers contingencies in detail.' },
{ page: 'sfh', displayOrder: 9,  question: 'Can I fly to other airfields or am I restricted to Denham?', answer: 'You can fly anywhere within your competency and approved airspace permissions. We encourage cross-country flying and can assist with route planning, PPR, and fuel availability at destination airfields.' },
{ page: 'sfh', displayOrder: 10, question: 'How do I log my hours?', answer: 'You are responsible for your own pilot logbook. We provide a copy of the aircraft journey log entry at the end of each hire. Hobbs time is used for billing and matches your logged flying time.' },
{ page: 'sfh', displayOrder: 11, question: 'What is the fuel policy?', answer: 'Aircraft are returned with the same fuel level as departure. If you land away and refuel, retain the receipt and we will credit the cost at collection. We handle all fuel arrangements at Denham.' },
{ page: 'sfh', displayOrder: 12, question: 'Can I bring a passenger on self-fly hire?', answer: 'Yes, provided you hold the appropriate type rating and the passenger weight is within limits. Let us know when booking so we can calculate weight and balance in advance.' },
```

- [ ] **Step 4: Add Sales additional questions (6 → 12)**

After the existing 6 `page: 'sales'` entries:

```javascript
{ page: 'sales', displayOrder: 7,  question: 'Can you source a specific pre-owned aircraft for me?', answer: 'Yes. If you have a particular model, year, or specification in mind and we do not have it in stock, we will actively search our network of operators and dealers to find the right aircraft.' },
{ page: 'sales', displayOrder: 8,  question: 'What is included in the price of a new Robinson?', answer: 'New Robinson prices include factory standard equipment, initial airworthiness documentation, and UK CAA registration support. Customisation such as paint schemes, avionics upgrades, and interior options are quoted separately.' },
{ page: 'sales', displayOrder: 9,  question: 'Do you offer aircraft on operating lease?', answer: 'Yes, through our finance partners we can arrange operating leases that keep capital free and give you flexibility. Monthly payments, term lengths, and buyout options are tailored to your requirements.' },
{ page: 'sales', displayOrder: 10, question: 'Can I inspect the aircraft before purchasing?', answer: 'Absolutely. Pre-purchase viewings are always welcome, and we encourage an independent pre-purchase inspection for any pre-owned aircraft. We can recommend approved inspectors if required.' },
{ page: 'sales', displayOrder: 11, question: 'What after-sale support do you provide?', answer: 'As a full-service dealer and CAA Part 145 facility, we support every aircraft we sell with scheduled maintenance, AOG support, warranty claims, and access to our parts inventory.' },
{ page: 'sales', displayOrder: 12, question: 'How does part-exchange work?', answer: 'We value your existing aircraft based on current market conditions, condition, hours, and logbooks. The valuation is applied as a credit against your new purchase, reducing the finance required.' },
```

- [ ] **Step 5: Add Night Rating additional questions (6 → 12)**

```javascript
{ page: 'night-rating', displayOrder: 7,  question: 'Is there a ground school requirement for the Night Rating?', answer: 'Yes. Before flying, you will complete ground school covering night vision, lighting systems, aerodrome lighting, instrument interpretation, and emergency procedures. This is typically a half-day session.' },
{ page: 'night-rating', displayOrder: 8,  question: 'Can I do night training in the R66?', answer: 'Night training at HQ Aviation is conducted in the Robinson R44, which is well-equipped for night operations and provides an ideal platform for developing the precision required.' },
{ page: 'night-rating', displayOrder: 9,  question: 'Are there additional insurance requirements for night flying?', answer: 'Your standard aviation insurance policy will typically extend to night operations once you hold a Night Rating. We recommend confirming with your insurer before your first solo night flight.' },
{ page: 'night-rating', displayOrder: 10, question: 'How does the Night Rating affect my PPL(H) revalidation?', answer: 'The Night Rating does not change your PPL(H) revalidation requirements. You still need to pass an LPC every 24 months. Maintaining currency in both day and night flying is strongly recommended.' },
{ page: 'night-rating', displayOrder: 11, question: 'Can I carry passengers at night with a Night Rating?', answer: 'Yes. Once you hold a Night Rating you may carry passengers at night. Build personal night flying experience before doing so, and your insurer may impose minimum night-hour requirements.' },
{ page: 'night-rating', displayOrder: 12, question: 'What is the difference between a Night Rating and an Instrument Rating?', answer: 'A Night Rating authorises flight in VMC at night. An Instrument Rating allows flight in cloud and poor visibility. Night does not mean IMC — cloud at night still requires an IR to penetrate safely.' },
```

- [ ] **Step 6: Add Type Rating additional questions (6 → 12)**

```javascript
{ page: 'type-rating', displayOrder: 7,  question: 'Do you issue a certificate after completing a type rating?', answer: 'Yes. On completion, your licence is endorsed by the examiner and we provide a signed training record. CAA licensing updates are handled through the standard process your examiner will explain.' },
{ page: 'type-rating', displayOrder: 8,  question: 'Can I go straight into self-fly hire after a type rating?', answer: 'Yes. Once type-rated on one of our hire aircraft and with sufficient recent experience, you are eligible for self-fly hire. Currency and insurance requirements are reviewed at the time of booking.' },
{ page: 'type-rating', displayOrder: 9,  question: 'Is simulator training available for type ratings?', answer: 'We focus on genuine aircraft training rather than simulator hours, which produces more confident, aircraft-ready pilots and is the standard approach for Robinson type ratings.' },
{ page: 'type-rating', displayOrder: 10, question: 'Do you offer Robinson R22 type ratings?', answer: 'Yes. The R22 type rating is one of our most popular endorsements, particularly for PPL(H) holders looking to access more training aircraft and self-fly hire options.' },
{ page: 'type-rating', displayOrder: 11, question: 'Can type rating training be conducted at another airfield?', answer: 'In some cases we can travel for type rating training, particularly for fleet operators. Contact us with your location and requirements and we will advise on feasibility and costs.' },
{ page: 'type-rating', displayOrder: 12, question: 'I hold a foreign type rating — does it need revalidating for UK operations?', answer: 'If your type rating was issued under EASA or another authority, conversion requirements vary. We can review your licence and advise on the most efficient route to UK CAA recognition.' },
```

- [ ] **Step 7: Add Helicopter Tour additional questions (6 → 12)**

```javascript
{ page: 'helicopter-tour', displayOrder: 7,  question: 'How many passengers can the helicopter carry?', answer: 'The R66 carries up to 4 passengers alongside the pilot. Shared tour packages accommodate up to 4 guests. Private charters give your group exclusive use of the aircraft.' },
{ page: 'helicopter-tour', displayOrder: 8,  question: 'Can I request a specific route or landmark?', answer: 'We offer a standard London tour route designed for maximum landmark coverage. For private charters, we can adjust the route on request — subject to airspace constraints and ATC approval.' },
{ page: 'helicopter-tour', displayOrder: 9,  question: 'Are headsets provided?', answer: 'Yes. All passengers are fitted with noise-attenuating aviation headsets. You will hear the pilot commentary clearly and can communicate with the flight crew throughout the tour.' },
{ page: 'helicopter-tour', displayOrder: 10, question: 'What time of day gives the best photography conditions?', answer: 'The golden hour shortly after sunrise or before sunset produces the most dramatic lighting. Contact us when booking if you want to discuss timing options for your flight.' },
{ page: 'helicopter-tour', displayOrder: 11, question: 'Is there anything specific I should bring?', answer: 'Just your enthusiasm and a fully charged camera. Leave loose items in the car, bring any prescription medication, and wear flat-soled shoes for comfort on the ramp.' },
{ page: 'helicopter-tour', displayOrder: 12, question: 'Is the tour suitable for nervous or first-time flyers?', answer: 'Yes. Many guests have never flown in a small aircraft before. Our pilots are experienced at putting nervous passengers at ease. The smooth nature of helicopter flight surprises most first-timers.' },
```

- [ ] **Step 8: Add Expeditions additional questions (6 → 12)**

```javascript
{ page: 'expeditions', displayOrder: 7,  question: 'What destinations have you flown to on expeditions?', answer: 'Captain Q has led expeditions across Europe, Africa, the Arctic, and beyond. Past routes include the Scottish Highlands, Norway, Iceland, Morocco, and multi-week trans-continental journeys. Each new expedition is a genuine exploration.' },
{ page: 'expeditions', displayOrder: 8,  question: 'Do I need travel insurance for an expedition?', answer: 'Yes — comprehensive travel insurance including helicopter passenger cover and emergency repatriation is mandatory for all participants. We provide guidance on suitable policies as part of the expedition briefing pack.' },
{ page: 'expeditions', displayOrder: 9,  question: 'What if I need to withdraw before the expedition departs?', answer: 'Cancellation terms vary by expedition and are detailed in your booking agreement. We strongly recommend your travel insurance includes cancellation cover. Places are often transferable within the booking window.' },
{ page: 'expeditions', displayOrder: 10, question: 'Is there a physical fitness requirement?', answer: 'Helicopter expeditions are accessible to a wide range of fitness levels. Some destinations involve light walking or remote access. Specific requirements are communicated in the expedition brief well in advance.' },
{ page: 'expeditions', displayOrder: 11, question: 'Can the expedition be filmed or used commercially?', answer: 'Photography and personal film-making are always welcome. For commercial use of footage, discuss rights with Captain Q at the time of booking. We have supported professional media projects on past expeditions.' },
{ page: 'expeditions', displayOrder: 12, question: 'How do I reserve a place on an upcoming expedition?', answer: 'Contact us via the form on this page or call +44 1895 833373. A deposit secures your place. Full details, briefing packs, and pre-departure calls are arranged once you are confirmed.' },
```

- [ ] **Step 9: Add Rebuilds additional questions (6 → 12)**

```javascript
{ page: 'rebuilds', displayOrder: 7,  question: 'How long does a full rebuild typically take?', answer: 'A comprehensive rebuild takes 12–20 weeks depending on scope, parts availability, and any custom elements. We provide a project timeline at quotation stage and keep you updated throughout.' },
{ page: 'rebuilds', displayOrder: 8,  question: 'Can I choose a custom paint scheme?', answer: 'Yes. Custom livery is one of the most popular rebuild options. We work with specialist aviation paint shops and can produce any scheme — from factory-style to full bespoke corporate or personal livery.' },
{ page: 'rebuilds', displayOrder: 9,  question: 'What life-limited components are replaced during a rebuild?', answer: 'All life-limited components at or approaching their limits are replaced as standard. This includes main rotor blades, tail rotor blades, mast, and transmission components as applicable to the airframe hours.' },
{ page: 'rebuilds', displayOrder: 10, question: 'Do you offer financing for rebuilds?', answer: 'Yes. We work with aviation finance partners who can fund rebuild projects through structured repayment plans. Contact our sales team for an introduction once you have a rebuild quotation in hand.' },
{ page: 'rebuilds', displayOrder: 11, question: 'Can you convert a piston helicopter to turbine during a rebuild?', answer: 'Yes, subject to the airframe type and applicable STCs. We assess feasibility and regulatory requirements as part of the initial consultation before any commitment is made.' },
{ page: 'rebuilds', displayOrder: 12, question: 'Do you rebuild aircraft other than Robinson models?', answer: 'Our primary expertise is Robinson helicopters. Enquiries for other piston types are considered on a case-by-case basis — contact us to discuss your specific airframe.' },
```

- [ ] **Step 10: Add Training FAQ additional questions (10 → 12)**

```javascript
{ page: 'training-faq', displayOrder: 11, question: 'What is the minimum age to start helicopter training?', answer: 'There is no minimum age to begin lessons, but you must be 17 to fly solo and to hold a PPL(H). Many students start training in their teens and complete the licence shortly after their 17th birthday.' },
{ page: 'training-faq', displayOrder: 12, question: 'Are there any scholarship or bursary schemes available?', answer: 'HQ Aviation supports aspiring pilots through industry contacts and occasionally offers sponsored flying opportunities. Contact us to discuss your situation — we will always try to signpost funding options where we can.' },
```

- [ ] **Step 11: Add CPL questions (0 → 12)**

```javascript
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
```

- [ ] **Step 12: Add Advanced Training questions (0 → 12)**

```javascript
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
```

- [ ] **Step 13: Add Pilot Provisioning questions (0 → 12)**

```javascript
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
```

- [ ] **Step 14: Add SuperYacht Ops questions (0 → 12)**

```javascript
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
```

- [ ] **Step 15: Add Aircraft Consulting questions (0 → 12)**

```javascript
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
```

- [ ] **Step 16: Run seed script for all pages**

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main
node scripts/seed-faqs.js --page=ppl --force
node scripts/seed-faqs.js --page=discovery --force
node scripts/seed-faqs.js --page=sfh --force
node scripts/seed-faqs.js --page=sales --force
node scripts/seed-faqs.js --page=night-rating --force
node scripts/seed-faqs.js --page=type-rating --force
node scripts/seed-faqs.js --page=helicopter-tour --force
node scripts/seed-faqs.js --page=expeditions --force
node scripts/seed-faqs.js --page=rebuilds --force
node scripts/seed-faqs.js --page=training-faq --force
node scripts/seed-faqs.js --page=cpl --force
node scripts/seed-faqs.js --page=advanced-training --force
node scripts/seed-faqs.js --page=pilot-provisioning --force
node scripts/seed-faqs.js --page=superyacht-ops --force
node scripts/seed-faqs.js --page=aircraft-consulting --force
```

Expected output for each: `✓ Seeded N FAQs for page "X".`

- [ ] **Step 17: Commit**

```bash
git add scripts/seed-faqs.js
git commit -m "feat(faqs): expand all FAQ pages to 12 questions, seed 5 previously empty pages"
```

---

### Task 2: Make df-faq__list scrollable in ArrivalSection.jsx

**Files:**
- Modify: `src/components/ArrivalSection.jsx` (around line 360 — the `arrivalStyles` exported const)

This one change affects both DiscoveryFlight.jsx and FinalPPL.jsx since both import `arrivalStyles` from here.

- [ ] **Step 1: Find `.df-faq__list` in `arrivalStyles` and add flex + scroll properties**

Current text to find:
```css
        .df-faq__list {
          display: flex;
          flex-direction: column;
          gap: 0;
```

Replace with:
```css
        .df-faq__list {
          display: flex;
          flex-direction: column;
          gap: 0;
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #e0deda transparent;
```

- [ ] **Step 2: Add Load More button CSS and mobile overrides to `arrivalStyles`**

Immediately after the block that closes `.df-faq__list { ... }`, add:

```css
        .df-faq__load-more {
          display: none;
        }

        @media (max-width: 768px) {
          .df-location-faq__container {
            grid-template-columns: 1fr;
          }
          .df-location-faq__divider {
            display: none;
          }
          .df-faq__list {
            overflow-y: visible;
            flex: unset;
            min-height: unset;
          }
          .df-faq__item--mobile-hidden {
            display: none;
          }
          .df-faq__load-more {
            display: block;
            width: 100%;
            margin-top: 1.5rem;
            padding: 0.9rem 1.5rem;
            background: transparent;
            border: 1px solid #1a1a1a;
            color: #1a1a1a;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.72rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            cursor: pointer;
            transition: background 0.2s ease, color 0.2s ease;
          }
          .df-faq__load-more:hover {
            background: #1a1a1a;
            color: #fff;
          }
        }
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ArrivalSection.jsx
git commit -m "feat(faqs): scrollable df-faq__list on desktop, Load More CSS for mobile"
```

---

### Task 3: Add mobile Load More to DiscoveryFlight.jsx

**Files:**
- Modify: `src/pages/DiscoveryFlight.jsx`

- [ ] **Step 1: Add `showAllFaqs` state near line 1018**

Find the line:
```jsx
const { faqs } = useFaqs('discovery', { visibleOnly: true });
```

Add immediately after it:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

- [ ] **Step 2: Update FAQ item class to add `df-faq__item--mobile-hidden` for items beyond index 5**

Find (around line 1119):
```jsx
className={`df-faq__item ${openFaq === i ? 'df-faq__item--open' : ''}`}
```

Replace with:
```jsx
className={`df-faq__item ${openFaq === i ? 'df-faq__item--open' : ''}${i >= 6 && !showAllFaqs ? ' df-faq__item--mobile-hidden' : ''}`}
```

- [ ] **Step 3: Add Load More button after closing `</div>` of `df-faq__list`**

Find the closing `</div>` that ends the `df-faq__list` block (the `</div>` just before `</div>` that closes `df-location-faq__right`). Add after it:

```jsx
{faqs.length > 6 && !showAllFaqs && (
  <button className="df-faq__load-more" onClick={() => setShowAllFaqs(true)}>
    Load More
  </button>
)}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/DiscoveryFlight.jsx
git commit -m "feat(discovery): mobile Load More button for FAQ section"
```

---

### Task 4: Add mobile Load More to FinalPPL.jsx

**Files:**
- Modify: `src/pages/FinalPPL.jsx`

Same pattern as Task 3. Uses identical `df-*` classes from the shared `arrivalStyles`.

- [ ] **Step 1: Add `showAllFaqs` state near line 300**

Find the line:
```jsx
const { faqs } = useFaqs('ppl', { visibleOnly: true });
```

Add immediately after it:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

- [ ] **Step 2: Update FAQ item class (around line 822)**

Find:
```jsx
className={`df-faq__item ${openFaq === i ? 'df-faq__item--open' : ''}`}
```

Replace with:
```jsx
className={`df-faq__item ${openFaq === i ? 'df-faq__item--open' : ''}${i >= 6 && !showAllFaqs ? ' df-faq__item--mobile-hidden' : ''}`}
```

- [ ] **Step 3: Add Load More button after closing `</div>` of `df-faq__list` (around line 843)**

```jsx
{faqs.length > 6 && !showAllFaqs && (
  <button className="df-faq__load-more" onClick={() => setShowAllFaqs(true)}>
    Load More
  </button>
)}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/FinalPPL.jsx
git commit -m "feat(ppl): mobile Load More button for FAQ section"
```

---

### Task 5: Add Load More to all standalone FAQ pages

Each standalone page follows the same 3-step pattern per page: add `showAllFaqs` state, slice the FAQ array, add button + CSS. All 13 pages are covered below.

**Files:** NightRating, SelfFlyHire, TypeRating, HelicopterTourOfLondon, FinalExpeditions, Sales, AdvancedTraining, PilotProvisioning, SuperYachtOps, CPL, AircraftConsulting, PPL, Rebuilds

**Load More button CSS** (copy this for each page, substituting the page prefix):

```css
.{PREFIX}-faq__load-more {
  margin-top: 1.5rem;
  display: block;
  width: 100%;
  padding: 0.9rem 1.5rem;
  background: transparent;
  border: 1px solid #1a1a1a;
  color: #1a1a1a;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}
.{PREFIX}-faq__load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 1 — NightRating.jsx** (prefix: `nr`, state at line 232, list at line 591, faqs alias: `faqs`)

Add after `const [openFaq, setOpenFaq] = useState(null);` at line 232:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

Change line 592 from `{faqs.map((faq, i) => (` to:
```jsx
{(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
```

After the closing `</div>` of `nr-faq__list`, add:
```jsx
{!showAllFaqs && faqs.length > 6 && (
  <button className="nr-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
)}
```

Add to the `nr-faq` inline `<style>` block:
```css
.nr-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.nr-faq__load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 2 — SelfFlyHire.jsx** (prefix: `sfh2`, state at line 248, list at line 810, faqs alias: `faqs`)

Add after `const [openFaq, setOpenFaq] = useState(null);` at line 248:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

Change line 811 from `{faqs.map((faq, i) => (` to:
```jsx
{(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
```

After the closing `</div>` of `sfh2-faq__list`, add:
```jsx
{!showAllFaqs && faqs.length > 6 && (
  <button className="sfh2-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
)}
```

Add to the `sfh2-faq` inline `<style>` block:
```css
.sfh2-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.sfh2-faq__load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 3 — TypeRating.jsx** (prefix: `tr`, state at line 313, faqs alias: `faqs`)

Add after `const [openFaq, setOpenFaq] = useState(null);` at line 313:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

Find `<div className="tr-faq__list">` and the `{faqs.map(` inside it. Change to:
```jsx
{(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
```

After closing `</div>` of `tr-faq__list`:
```jsx
{!showAllFaqs && faqs.length > 6 && (
  <button className="tr-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
)}
```

Add to inline `<style>`:
```css
.tr-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.tr-faq__load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 4 — HelicopterTourOfLondon.jsx** (prefix: `ltour`, state at line 381, faqs alias: `faqs`)

Add after `const [openFaq, setOpenFaq] = useState(null);` at line 381:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

Find `<div className="ltour-faq__list">` and `{faqs.map(`. Change to:
```jsx
{(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
```

After closing `</div>` of `ltour-faq__list`:
```jsx
{!showAllFaqs && faqs.length > 6 && (
  <button className="ltour-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
)}
```

Add to inline `<style>`:
```css
.ltour-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.ltour-faq__load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 5 — FinalExpeditions.jsx** (prefix: `fexp`, state at line 1298, faqs alias: `faqs`)

Add after `const [openFaq, setOpenFaq] = useState(null);` at line 1298:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

Find `<div className="fexp-faq__list">` and `{faqs.map(`. Change to:
```jsx
{(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
```

After closing `</div>` of `fexp-faq__list`:
```jsx
{!showAllFaqs && faqs.length > 6 && (
  <button className="fexp-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
)}
```

Add to inline `<style>`:
```css
.fexp-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.fexp-faq__load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 6 — Sales.jsx** (prefix: `sales`, state at line 896, list at line 1674, faqs alias: `faqs`)

Add after `const [openFaq, setOpenFaq] = useState(null);` at line 896:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

Change line 1675 from `{faqs.map((faq, i) => (` to:
```jsx
{(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
```

After closing `</div>` of `sales-faq__list`:
```jsx
{!showAllFaqs && faqs.length > 6 && (
  <button className="sales-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
)}
```

Add near `.sales-faq__list` CSS (around line 4365):
```css
.sales-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.sales-faq__load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 7 — AdvancedTraining.jsx** (prefix: `adv`, state at line 212, faqs alias: `faqs`)

Add after `const [openFaq, setOpenFaq] = useState(null);` at line 212:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

Find `<div className="adv-faq__list">` and `{faqs.map(`. Change to:
```jsx
{(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
```

After closing `</div>` of `adv-faq__list`:
```jsx
{!showAllFaqs && faqs.length > 6 && (
  <button className="adv-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
)}
```

Add to inline `<style>`:
```css
.adv-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.adv-faq__load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 8 — PilotProvisioning.jsx** (prefix: `pp`, state at line 214, faqs alias: `faqs`)

Add after `const [openFaq, setOpenFaq] = useState(null);` at line 214:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

Find `<div className="pp-faq__list">` and `{faqs.map(`. Change to:
```jsx
{(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
```

After closing `</div>` of `pp-faq__list`:
```jsx
{!showAllFaqs && faqs.length > 6 && (
  <button className="pp-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
)}
```

Add to inline `<style>`:
```css
.pp-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.pp-faq__load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 9 — SuperYachtOps.jsx** (prefix: `syo`, state at line 281, faqs alias: `faqs`)

Add after `const [openFaq, setOpenFaq] = useState(null);` at line 281:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

Find `<div className="syo-faq__list">` and `{faqs.map(`. Change to:
```jsx
{(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
```

After closing `</div>` of `syo-faq__list`:
```jsx
{!showAllFaqs && faqs.length > 6 && (
  <button className="syo-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
)}
```

Add to inline `<style>`:
```css
.syo-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.syo-faq__load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 10 — CPL.jsx** (prefix: `cpl`, state at line 213, list at line 631, **faqs alias: `rawFaqs`**)

Add after `const [openFaq, setOpenFaq] = useState(null);` at line 213:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

Change line 632 from `{rawFaqs.map((faq, i) => (` to:
```jsx
{(showAllFaqs ? rawFaqs : rawFaqs.slice(0, 6)).map((faq, i) => (
```

After closing `</div>` of `cpl-faq__list`:
```jsx
{!showAllFaqs && rawFaqs.length > 6 && (
  <button className="cpl-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
)}
```

Add to inline `<style>`:
```css
.cpl-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.cpl-faq__load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 11 — AircraftConsulting.jsx** (prefix: `ac`, state at line 221, **faqs alias: `rawFaqs`**)

Add after `const [openFaq, setOpenFaq] = useState(null);` at line 221:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

Find `<div className="ac-faq__list">` and `{rawFaqs.map(`. Change to:
```jsx
{(showAllFaqs ? rawFaqs : rawFaqs.slice(0, 6)).map((faq, i) => (
```

After closing `</div>` of `ac-faq__list`:
```jsx
{!showAllFaqs && rawFaqs.length > 6 && (
  <button className="ac-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
)}
```

Add to inline `<style>`:
```css
.ac-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.ac-faq__load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 12 — PPL.jsx** (prefix: `ppl`, state at line 115, list at line 375, **loop variable: `index` not `i`**, faqs alias: `faqs`)

Add after `const [openFaq, setOpenFaq] = useState(null);` at line 115:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

Change line 376 from `{faqs.map((faq, index) => (` to:
```jsx
{(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, index) => (
```

After closing `</div>` of `ppl-faq__list`:
```jsx
{!showAllFaqs && faqs.length > 6 && (
  <button className="ppl-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
)}
```

Add near `.ppl-faq__container` CSS (around line 1031):
```css
.ppl-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.ppl-faq__load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 13 — Rebuilds.jsx FaqBlock component** (prefix: `rb__faq`, **state var: `openIndex`**, state at line 323, list at line 327, faqs alias: `faqs`)

The FAQ lives inside the `FaqBlock` component defined in Rebuilds.jsx. Add after `const [openIndex, setOpenIndex] = useState(null);` at line 323:
```jsx
const [showAllFaqs, setShowAllFaqs] = useState(false);
```

Change line 328 from `{faqs.map((item, i) => (` to:
```jsx
{(showAllFaqs ? faqs : faqs.slice(0, 6)).map((item, i) => (
```

After closing `</div>` of `rb__faq-list` (around line 340):
```jsx
{!showAllFaqs && faqs.length > 6 && (
  <button className="rb__faq-load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
)}
```

Add near `.rb__faq-list` CSS (around line 1455):
```css
.rb__faq-load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.rb__faq-load-more:hover { background: #1a1a1a; color: #fff; }
```

- [ ] **Step 14: Commit all standalone page changes**

```bash
git add src/pages/NightRating.jsx src/pages/SelfFlyHire.jsx src/pages/TypeRating.jsx \
  src/pages/HelicopterTourOfLondon.jsx src/pages/FinalExpeditions.jsx src/pages/Sales.jsx \
  src/pages/AdvancedTraining.jsx src/pages/PilotProvisioning.jsx src/pages/SuperYachtOps.jsx \
  src/pages/CPL.jsx src/pages/AircraftConsulting.jsx src/pages/PPL.jsx src/pages/Rebuilds.jsx
git commit -m "feat(faqs): Load More button on all 13 standalone FAQ sections"
```
