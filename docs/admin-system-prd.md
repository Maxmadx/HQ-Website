# Admin System - Product Requirements Document

## Overview

Internal administration system for HQ operations staff to manage aircraft listings, blog content, and customer enquiries.

---

## 1. User Authentication

### 1.1 Sign Up / Account Creation
- **Invite-only system** - No public registration
- Admin users can invite new team members via email
- Invite link expires after 48 hours
- Required fields:
  - Full name
  - Email address (must be company domain)
  - Password (min 12 characters, 1 uppercase, 1 number, 1 special character)
  - Role assignment (set by inviting admin)

### 1.2 Login
- Email + password authentication
- "Remember me" option (30-day session)
- Account lockout after 5 failed attempts (15-minute cooldown)
- Optional: Two-factor authentication (TOTP via authenticator app)

### 1.3 Password Management
- Forgot password flow via email link (expires in 1 hour)
- Force password change every 90 days
- Cannot reuse last 5 passwords
- Password strength indicator on creation

### 1.4 Session Management
- Automatic logout after 8 hours of inactivity
- View active sessions
- Ability to revoke sessions remotely

---

## 2. User Roles & Permissions

### 2.1 Role Hierarchy

| Role | Description |
|------|-------------|
| **Super Admin** | Full system access, can manage other admins |
| **Admin** | Full content access, can invite users |
| **Editor** | Can create/edit listings and blogs, cannot delete or publish |
| **Viewer** | Read-only access to all content |

### 2.2 Permission Matrix

| Action | Super Admin | Admin | Editor | Viewer |
|--------|-------------|-------|--------|--------|
| View listings | ✓ | ✓ | ✓ | ✓ |
| Create listings | ✓ | ✓ | ✓ | ✗ |
| Edit listings | ✓ | ✓ | ✓ | ✗ |
| Delete listings | ✓ | ✓ | ✗ | ✗ |
| Publish listings | ✓ | ✓ | ✗ | ✗ |
| Mark as sold | ✓ | ✓ | ✓ | ✗ |
| Manage blogs | ✓ | ✓ | ✓ | ✗ |
| View enquiries | ✓ | ✓ | ✓ | ✓ |
| Respond to enquiries | ✓ | ✓ | ✓ | ✗ |
| Invite users | ✓ | ✓ | ✗ | ✗ |
| Manage users | ✓ | ✗ | ✗ | ✗ |
| View audit logs | ✓ | ✓ | ✗ | ✗ |
| System settings | ✓ | ✗ | ✗ | ✗ |

---

## 3. Listing Management

### 3.1 Create Listing

**Required Fields:**
- Aircraft title/name
- Manufacturer
- Model
- Year of manufacture
- Registration number
- Serial number
- Price (with currency selection)
- Listing status (Draft, Published, Sold, Archived)

**Specification Fields:**
- Remaining hours (airframe)
- Remaining hours (engine 1, engine 2 if applicable)
- Total landings
- Useful load
- Max range
- Cruise speed
- Seating configuration
- Avionics suite

**Media:**
- Primary image (required)
- Gallery images (up to 50)
- Image reordering via drag-and-drop
- Supported formats: JPG, PNG, WebP
- Auto-resize to max 2400px width
- Prospectus PDF upload

**Content:**
- Short description (for listing cards, 200 char limit)
- Full description (rich text editor)
- Interior description
- Avionics description
- Maintenance history notes

**Metadata:**
- Featured listing toggle
- SEO title override
- SEO meta description
- URL slug (auto-generated, editable)

### 3.2 Edit Listing
- All fields editable
- Version history (last 20 revisions)
- Compare versions side-by-side
- Restore previous version
- Preview before publishing

### 3.3 Listing Status Workflow

```
Draft → Published → Sold
         ↓           ↓
      Archived    Archived
```

- **Draft**: Only visible to admin users
- **Published**: Live on website
- **Sold**: Displays "SOLD" banner, optionally hide price
- **Archived**: Removed from site, retained in system

### 3.4 Mark as Sold
- Select sold date
- Optional: Final sale price (internal only)
- Optional: Buyer notes (internal only)
- Choose to show/hide from website
- Automatic notification to users who enquired about this listing

### 3.5 Listing List View
- Table view with sortable columns
- Filter by: status, manufacturer, year range, price range
- Search by: title, registration, serial number
- Bulk actions: archive, change status
- Export to CSV

---

## 4. Blog Management

### 4.1 Create Blog Post

**Required Fields:**
- Title
- Content (rich text editor with image embedding)
- Featured image
- Category (select or create new)
- Author (defaults to current user)

**Optional Fields:**
- Excerpt (auto-generated from content if blank)
- Tags (comma-separated)
- SEO title override
- SEO meta description
- URL slug
- Publish date (schedule for future)

### 4.2 Rich Text Editor Features
- Headings (H2, H3, H4)
- Bold, italic, underline
- Bullet and numbered lists
- Block quotes
- Image upload and embedding
- Video embed (YouTube, Vimeo)
- Links (internal and external)
- Tables

### 4.3 Blog Post Status
- **Draft**: Work in progress
- **Scheduled**: Set to publish at future date/time
- **Published**: Live on website
- **Archived**: Removed from site

### 4.4 Categories
- Create/edit/delete categories
- Assign colour for visual identification
- Set category description
- Reorder categories

### 4.5 Blog List View
- Filter by: status, category, author, date range
- Search by title and content
- Sort by: date, title, views

---

## 5. Enquiry Management

### 5.1 Enquiry Inbox
- List of all customer enquiries
- Source tracking (which listing, contact form, etc.)
- Status: New, In Progress, Responded, Closed
- Assign to team member
- Priority flag

### 5.2 Enquiry Details
- Customer name, email, phone
- Message content
- Listing reference (if applicable)
- Timestamp
- Response history

### 5.3 Respond to Enquiry
- Reply via system (sends email to customer)
- Email templates for common responses
- Attach documents
- Internal notes (not sent to customer)

### 5.4 Enquiry Notifications
- Email notification to assigned users for new enquiries
- Daily digest option
- Escalation if no response in 24 hours

---

## 6. Media Library

### 6.1 Central Media Storage
- Upload images independent of listings
- Organise into folders
- Tag images for searchability
- View usage (which listings use this image)

### 6.2 Image Processing
- Auto-generate thumbnails
- Lazy loading optimisation
- WebP conversion for performance
- Preserve original uploads

### 6.3 Document Storage
- PDF prospectuses
- Maintenance records
- Inspection reports
- Version tracking for documents

---

## 7. Dashboard & Analytics

### 7.1 Overview Dashboard
- Active listings count
- Enquiries this week/month
- Most viewed listings
- Recent activity feed

### 7.2 Listing Analytics
- Page views per listing
- Enquiry conversion rate
- Time on page
- Traffic sources

### 7.3 Reports
- Listings added per month
- Sales by month/quarter/year
- Enquiry response times
- User activity summary

---

## 8. Audit Logging

### 8.1 Tracked Actions
- User login/logout
- Listing create/edit/delete/status change
- Blog post create/edit/delete/publish
- User invite/role change
- Enquiry status changes
- Document uploads

### 8.2 Log Details
- Timestamp
- User who performed action
- Action type
- Affected item
- Before/after values for edits
- IP address

### 8.3 Log Retention
- Retain logs for 2 years
- Export logs to CSV
- Filter by user, action type, date range

---

## 9. System Settings

### 9.1 General Settings
- Company name and logo
- Contact email addresses
- Default currency
- Timezone

### 9.2 Email Settings
- SMTP configuration
- Email templates (enquiry response, password reset, invite)
- Email footer content

### 9.3 Website Settings
- Featured listings selection
- Homepage content blocks
- Footer links
- Social media links

### 9.4 Integrations
- Google Analytics tracking ID
- Newsletter service API (Mailchimp, etc.)
- CRM integration (future)

---

## 10. Technical Requirements

### 10.1 Security
- HTTPS only
- Password hashing (bcrypt)
- CSRF protection
- XSS prevention
- SQL injection prevention
- Rate limiting on login endpoints
- Regular security audits

### 10.2 Performance
- Page load under 2 seconds
- Image optimisation pipeline
- Database query optimisation
- CDN for static assets

### 10.3 Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

### 10.4 Responsive Design
- Desktop optimised (primary use case)
- Tablet support for field use
- Mobile view for quick checks

---

## 11. Future Considerations

- **Multi-language support** for international listings
- **Automated valuation tools** integration
- **Customer portal** for registered buyers
- **API access** for third-party listing sites
- **Mobile app** for on-the-go management
- **Automated social media posting** on new listings
- **Email marketing integration** for listing updates to subscribers

---

## Appendix A: User Flows

### A.1 New User Onboarding
1. Admin sends invite email
2. User clicks invite link
3. User creates password
4. User completes profile (name, phone)
5. User lands on dashboard

### A.2 Add New Listing
1. Click "Add Listing" from dashboard or listings page
2. Fill required fields (title, manufacturer, model, year, price)
3. Upload images (drag-and-drop or file picker)
4. Add specifications
5. Write description
6. Save as draft or publish immediately
7. Preview on live site

### A.3 Mark Listing as Sold
1. Open listing
2. Click "Mark as Sold"
3. Enter sold date
4. Optionally add sale price and notes
5. Choose visibility (show with SOLD banner or hide)
6. Confirm
7. System notifies users who enquired about listing

---

## Appendix B: Email Templates

### B.1 User Invite
Subject: You've been invited to [Company] Admin

### B.2 Password Reset
Subject: Reset your password

### B.3 Enquiry Response
Subject: RE: Your enquiry about [Aircraft Title]

### B.4 Listing Sold Notification
Subject: Update on [Aircraft Title] - Now Sold
