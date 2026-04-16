import { useState } from 'react';
import { doc, updateDoc, addDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import AdminLayout from '../../components/admin/AdminLayout';
import { useFaqs } from '../../hooks/useFaqs';
import { db } from '../../lib/firebase';

const PAGES = [
  { key: 'discovery',      label: 'Discovery Flight',    url: '/training/trial-lessons' },
  { key: 'sfh',            label: 'Self-Fly Hire',       url: '/self-fly-hire' },
  { key: 'sales',          label: 'Sales',               url: '/sales/new' },
  { key: 'expeditions',    label: 'Expeditions',         url: '/expeditions' },
  { key: 'ppl',            label: 'PPL Training',        url: '/training/ppl' },
  { key: 'night-rating',   label: 'Night Rating',        url: '/training/night-rating' },
  { key: 'type-rating',    label: 'Type Rating',         url: '/training/type-rating' },
  { key: 'training-faq',   label: 'Training FAQ',        url: '/training/faq' },
  { key: 'helicopter-tour', label: 'Helicopter Tour',    url: '/helicopter-tour-of-london' },
  { key: 'rebuilds',       label: 'Rebuilds',            url: '/sales/rebuilds' },
];

const EMPTY = { question: '', answer: '' };

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
];

export default function AdminFaqs() {
  const [activePage, setActivePage] = useState('discovery');
  const { faqs, loading } = useFaqs(activePage);
  const [saving, setSaving] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY);
  const [creating, setCreating] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const sorted = [...faqs].sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

  async function handleClearAll() {
    if (!window.confirm('Delete ALL FAQs across every section? This cannot be undone.')) return;
    setSeeding(true);
    try {
      const snap = await getDocs(collection(db, 'faqs'));
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, 'faqs', d.id))));
    } finally {
      setSeeding(false);
    }
  }

  async function handleSeedAll() {
    const existing = await getDocs(collection(db, 'faqs'));
    if (!existing.empty) {
      if (!window.confirm(`The FAQs collection already has ${existing.size} document(s). Import anyway and add on top?`)) return;
    }
    setSeeding(true);
    try {
      await Promise.all(
        ALL_FAQS.map((faq) => addDoc(collection(db, 'faqs'), { ...faq, visible: true }))
      );
    } finally {
      setSeeding(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    try {
      await addDoc(collection(db, 'faqs'), {
        page: activePage,
        question: addForm.question.trim(),
        answer: addForm.answer.trim(),
        displayOrder: faqs.length + 1,
        visible: true,
      });
      setAddForm(EMPTY);
      setAdding(false);
    } finally {
      setCreating(false);
    }
  }

  function startEdit(faq) {
    setEditingId(faq.id);
    setEditForm({ question: faq.question ?? '', answer: faq.answer ?? '' });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(editingId);
    try {
      await updateDoc(doc(db, 'faqs', editingId), {
        question: editForm.question.trim(),
        answer: editForm.answer.trim(),
      });
      setEditingId(null);
    } finally {
      setSaving(null);
    }
  }

  async function toggleVisible(faq) {
    setSaving(faq.id);
    try {
      await updateDoc(doc(db, 'faqs', faq.id), { visible: !faq.visible });
    } finally {
      setSaving(null);
    }
  }

  async function saveOrder(id, value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) return;
    setSaving(id);
    try {
      await updateDoc(doc(db, 'faqs', id), { displayOrder: val });
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this FAQ?')) return;
    setSaving(id);
    try {
      await deleteDoc(doc(db, 'faqs', id));
    } finally {
      setSaving(null);
    }
  }

  function handlePageChange(key) {
    setActivePage(key);
    setEditingId(null);
    setAdding(false);
    setAddForm(EMPTY);
  }

  const field = {
    width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
    borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box', color: '#111827',
  };
  const lbl = {
    display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#374151',
    marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>FAQs</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage FAQ questions per page. Toggle visibility and set display order.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <a
            href={`${PAGES.find((p) => p.key === activePage)?.url}?highlight=faqs-${activePage}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgb(96, 165, 250)', textDecoration: 'none', padding: '2px 6px', borderRadius: '4px', background: 'rgb(239, 246, 255)', whiteSpace: 'nowrap' }}
          >
            Find on page ↗
          </a>
          <button
            onClick={handleClearAll}
            disabled={seeding}
            style={{ background: '#fff', color: '#dc2626', padding: '0.5rem 1.25rem', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', opacity: seeding ? 0.6 : 1 }}
          >
            {seeding ? 'Clearing…' : 'Clear all'}
          </button>
          <button
            onClick={handleSeedAll}
            disabled={seeding}
            style={{ background: '#f3f4f6', color: '#374151', padding: '0.5rem 1.25rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', opacity: seeding ? 0.6 : 1 }}
          >
            {seeding ? 'Importing…' : 'Import all FAQs'}
          </button>
          <button
            onClick={() => { setAdding((a) => !a); setEditingId(null); }}
            style={{ background: '#111827', color: '#fff', padding: '0.5rem 1.25rem', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
          >
            {adding ? 'Cancel' : '+ Add Question'}
          </button>
        </div>
      </div>

      {/* Page tabs */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
        {PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => handlePageChange(p.key)}
            style={{
              padding: '0.35rem 0.875rem', border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: activePage === p.key ? 700 : 500,
              background: activePage === p.key ? '#111827' : '#f3f4f6',
              color: activePage === p.key ? '#fff' : '#374151',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleCreate} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem' }}>
            New Question — {PAGES.find((p) => p.key === activePage)?.label}
          </h2>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={lbl}>Question</label>
            <input style={field} value={addForm.question} onChange={(e) => setAddForm((f) => ({ ...f, question: e.target.value }))} placeholder="What is…?" required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Answer</label>
            <textarea style={{ ...field, minHeight: '90px', resize: 'vertical', lineHeight: 1.6 }} value={addForm.answer} onChange={(e) => setAddForm((f) => ({ ...f, answer: e.target.value }))} required />
          </div>
          <button type="submit" disabled={creating} style={{ background: '#111827', color: '#fff', padding: '0.5rem 1.25rem', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', opacity: creating ? 0.6 : 1 }}>
            {creating ? 'Saving…' : 'Add Question'}
          </button>
        </form>
      )}

      {/* FAQ list */}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : sorted.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No questions yet — add one above.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sorted.map((faq) => (
            <div key={faq.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', opacity: faq.visible ? 1 : 0.5 }}>
              {/* Row */}
              <div style={{ background: '#fff', padding: '0.875rem 1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                {/* Order badge */}
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f3f4f6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6b7280', fontSize: '0.75rem' }}>
                  {faq.displayOrder ?? '—'}
                </div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem', margin: '0 0 0.25rem' }}>{faq.question}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{faq.answer}</p>
                </div>
                {/* Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end', flexShrink: 0 }}>
                  <button
                    onClick={() => toggleVisible(faq)}
                    disabled={saving === faq.id}
                    style={{ padding: '0.25rem 0.6rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, background: faq.visible ? '#d1fae5' : '#f3f4f6', color: faq.visible ? '#065f46' : '#374151' }}
                  >
                    {saving === faq.id ? '…' : faq.visible ? 'Visible' : 'Hidden'}
                  </button>
                  <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Order</label>
                    <input
                      type="number"
                      defaultValue={faq.displayOrder ?? ''}
                      onBlur={(e) => saveOrder(faq.id, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveOrder(faq.id, e.target.value); }}
                      style={{ width: '48px', padding: '0.2rem 0.35rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.75rem', textAlign: 'center' }}
                    />
                  </div>
                  <button
                    onClick={() => editingId === faq.id ? setEditingId(null) : startEdit(faq)}
                    style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: '4px', color: '#374151', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500, padding: '0.15rem 0.5rem' }}
                  >
                    {editingId === faq.id ? 'Cancel' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    disabled={saving === faq.id}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500, padding: 0 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Inline edit */}
              {editingId === faq.id && (
                <form onSubmit={handleUpdate} style={{ borderTop: '1px solid #e5e7eb', padding: '1rem', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={lbl}>Question</label>
                    <input style={field} value={editForm.question} onChange={(e) => setEditForm((f) => ({ ...f, question: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={lbl}>Answer</label>
                    <textarea style={{ ...field, minHeight: '90px', resize: 'vertical', lineHeight: 1.6 }} value={editForm.answer} onChange={(e) => setEditForm((f) => ({ ...f, answer: e.target.value }))} required />
                  </div>
                  <button type="submit" disabled={saving === faq.id} style={{ alignSelf: 'flex-start', background: '#111827', color: '#fff', padding: '0.4rem 1rem', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', opacity: saving === faq.id ? 0.6 : 1 }}>
                    {saving === faq.id ? 'Saving…' : 'Save changes'}
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
