# Type Rating Enquiry Form — Design Spec
**Date:** 2026-04-16

## Overview

Add an inline enquiry form to the `/type-rating` page that reveals below the aircraft grid when a user clicks an Enquire button inside an expanded aircraft card. The form auto-populates with the selected aircraft and submits to the existing `/api/leads` endpoint, surfacing in the admin Leads panel with no backend changes required.

---

## 1. Enquire Button (Expanded Aircraft Card)

- Remove the existing `<a href="/contact?subject=type-rating-...">` "Enquire Now" link from each expanded aircraft card
- Replace with a new button styled like `alert-adv__intent-btn`:
  - Full-width card-style button
  - `↗` icon on the left
  - Bold title: "Enquire About This Type Rating"
  - Subtitle: "Tell us your experience level and goals. We'll get back to you within 24 hours."
- On click:
  - Sets `selectedAircraft` state to the aircraft model name
  - If form not yet visible: triggers reveal animation and scrolls to form
  - If form already visible: updates aircraft field silently and re-scrolls

---

## 2. Form Section

### Position
Below the aircraft grid section, within the same page scroll flow.

### Reveal Behaviour
- Hidden by default (height: 0, opacity: 0)
- On first Enquire click: animates into view (smooth height expand + fade in)
- Stays visible for the rest of the session — subsequent Enquire clicks only update the aircraft field and re-scroll, no re-animation

### Fields
| Field    | Type          | Behaviour                              |
|----------|---------------|----------------------------------------|
| Aircraft | Text (locked) | Read-only, auto-filled from card click |
| Name     | Text          | Required                               |
| Email    | Email         | Required                               |
| Phone    | Tel           | Optional                               |
| Message  | Textarea      | Optional                               |

### Submit Button
Standard submit button matching the page's existing `.tr-btn` style.

### States
- Default → Submitting (disabled, spinner) → Success (confirmation message, form hidden) → Error (inline error message, form re-enabled)

---

## 3. Form Submission

- `POST /api/leads`
- Payload:
  ```json
  {
    "name": "...",
    "email": "...",
    "phone": "...",
    "subject": "Type Rating — {aircraft model}",
    "message": "...",
    "source": "type-rating-page"
  }
  ```
- No backend changes needed — appears automatically in admin Leads panel filtered by source

---

## 4. Admin Integration

No changes required to the admin panel. Submissions appear in `AdminLeads.jsx` with:
- Subject: "Type Rating — Robinson R44" (etc.)
- Source: "type-rating-page"
- Filterable and manageable via existing status/notes workflow

---

## 5. Scope — What This Does NOT Include

- No new API endpoints
- No changes to AdminLeads or AdminDashboard
- No email notifications (handled by existing lead capture flow if configured)
- No changes to the Contact page
