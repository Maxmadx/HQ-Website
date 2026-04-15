# HQ Aviation - Firestore Integration PRD
## Used Helicopter Inventory System

---

### 1. Overview

Integrate Firebase Firestore as the backend database for HQ Aviation's used helicopter inventory. This enables dynamic listing management without code changes, real-time updates, and an admin interface for inventory management.

---

### 2. Goals

- **Dynamic Inventory**: Add, edit, remove helicopter listings without touching code
- **Real-time Updates**: Listings appear immediately when published
- **Scalable**: Handle growing inventory and traffic
- **Admin-friendly**: Non-technical staff can manage listings

---

### 3. Data Model

#### Collection: `helicopters`

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string (auto) | Document ID | `abc123xyz` |
| `model` | string | Aircraft model | `"Robinson R44 Raven II"` |
| `manufacturer` | string | Manufacturer name | `"Robinson"` |
| `year` | number | Year of manufacture | `2019` |
| `registration` | string | Aircraft registration | `"G-HQAV"` |
| `serialNumber` | string | Serial number | `"14567"` |
| `totalHours` | number | Total airframe hours | `1250` |
| `price` | number | Price in GBP | `350000` |
| `priceDisplay` | string | Display price | `"£350,000"` or `"POA"` |
| `status` | string | Listing status | `"available"` / `"sold"` / `"reserved"` |
| `condition` | string | Aircraft condition | `"Excellent"` |
| `description` | string | Full description | `"Well-maintained..."` |
| `highlights` | array | Key selling points | `["Low hours", "Fresh overhaul"]` |
| `specs` | object | Technical specifications | See below |
| `images` | array | Image URLs | `[{url, alt, isPrimary}]` |
| `documents` | array | PDF specs/reports | `[{name, url}]` |
| `featured` | boolean | Show in featured section | `true` |
| `sortOrder` | number | Display order | `1` |
| `createdAt` | timestamp | Date added | `2024-01-15` |
| `updatedAt` | timestamp | Last modified | `2024-02-01` |
| `soldAt` | timestamp | Date sold (if applicable) | `null` |

#### Specs Object Structure
```javascript
{
  engine: "Lycoming IO-540",
  engineHours: 1250,
  engineTBO: 2200,
  rotorHours: 1250,
  fuelCapacity: "120 litres",
  usefulLoad: "408 kg",
  maxSpeed: "130 kts",
  range: "300 nm",
  avionics: ["Garmin GTN 650", "GTX 345 Transponder"],
  equipment: ["Leather interior", "Air conditioning", "Pop-out floats"]
}
```

#### Images Array Structure
```javascript
[
  { url: "/assets/helicopters/g-hqav-1.jpg", alt: "Exterior front", isPrimary: true },
  { url: "/assets/helicopters/g-hqav-2.jpg", alt: "Cockpit", isPrimary: false },
  { url: "/assets/helicopters/g-hqav-3.jpg", alt: "Interior", isPrimary: false }
]
```

---

### 4. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for helicopter listings
    match /helicopters/{helicopterId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Enquiries collection (form submissions)
    match /enquiries/{enquiryId} {
      allow create: if true;  // Anyone can submit enquiry
      allow read, update, delete: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

### 5. Website Integration

#### 5.1 Firebase SDK Setup

Add to `index.html` and relevant pages:
```html
<script type="module">
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
  import { getFirestore, collection, getDocs, query, where, orderBy }
    from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "hq-website-4abc7.firebaseapp.com",
    projectId: "hq-website-4abc7",
    storageBucket: "hq-website-4abc7.appspot.com",
    messagingSenderId: "XXXXXX",
    appId: "YOUR_APP_ID"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  window.HQFirebase = { app, db };
</script>
```

#### 5.2 Fetching Listings

```javascript
// Get all available helicopters
async function getAvailableHelicopters() {
  const q = query(
    collection(db, 'helicopters'),
    where('status', '==', 'available'),
    orderBy('sortOrder')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get recently sold
async function getRecentlySold() {
  const q = query(
    collection(db, 'helicopters'),
    where('status', '==', 'sold'),
    orderBy('soldAt', 'desc'),
    limit(6)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get featured helicopters
async function getFeaturedHelicopters() {
  const q = query(
    collection(db, 'helicopters'),
    where('status', '==', 'available'),
    where('featured', '==', true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

#### 5.3 Rendering Listings

```javascript
function renderHelicopterCard(helicopter) {
  const primaryImage = helicopter.images?.find(img => img.isPrimary) || helicopter.images?.[0];

  return `
    <div class="helicopter-card" data-id="${helicopter.id}">
      <div class="helicopter-image">
        <img src="${primaryImage?.url || '/assets/images/placeholder.jpg'}" alt="${helicopter.model}">
        ${helicopter.status === 'reserved' ? '<span class="badge reserved">Reserved</span>' : ''}
      </div>
      <div class="helicopter-info">
        <h3>${helicopter.model}</h3>
        <p class="year-reg">${helicopter.year} | ${helicopter.registration}</p>
        <p class="hours">${helicopter.totalHours.toLocaleString()} hours</p>
        <p class="price">${helicopter.priceDisplay}</p>
        <a href="/helicopter/${helicopter.id}" class="btn">View Details</a>
      </div>
    </div>
  `;
}
```

---

### 6. Pages Affected

| Page | Changes |
|------|---------|
| `used-aircraft-2.html` | Fetch & render from Firestore |
| Individual helicopter pages | Dynamic page or query string based |
| Homepage | Featured listings section |

---

### 7. Admin Options

**Option A: Firebase Console** (Immediate)
- Use Firebase Console directly to add/edit listings
- No development needed
- Suitable for technical users

**Option B: Simple Admin Page** (Phase 2)
- Build `/admin` page with forms
- Firebase Authentication for login
- CRUD interface for listings

**Option C: Third-party CMS** (Phase 2)
- Integrate Forestry.io or similar
- Connect to Firestore
- User-friendly interface

---

### 8. Implementation Phases

#### Phase 1: Foundation (Current)
- [x] Firebase project created
- [ ] Firestore database configured
- [ ] Security rules deployed
- [ ] Firebase SDK added to website
- [ ] Create initial helicopter documents in Firestore

#### Phase 2: Integration
- [ ] Create `helicopters.js` module for data fetching
- [ ] Update `used-aircraft-2.html` to render from Firestore
- [ ] Implement helicopter card component
- [ ] Add loading states and error handling

#### Phase 3: Enhancement
- [ ] Individual helicopter detail pages
- [ ] Enquiry form with Firestore submission
- [ ] Image optimization and lazy loading
- [ ] Search and filter functionality

#### Phase 4: Admin (Optional)
- [ ] Admin authentication
- [ ] Listing management interface
- [ ] Image upload to Firebase Storage

---

### 9. Sample Firestore Documents

**Available Helicopter:**
```json
{
  "model": "Robinson R66 Turbine",
  "manufacturer": "Robinson",
  "year": 2021,
  "registration": "G-HELI",
  "serialNumber": "0987",
  "totalHours": 450,
  "price": 650000,
  "priceDisplay": "£650,000",
  "status": "available",
  "condition": "Excellent",
  "description": "Exceptional low-hour R66 with full options package. One owner from new, maintained by HQ Aviation since delivery. Fresh 100-hour inspection completed.",
  "highlights": [
    "Single owner from new",
    "Full leather interior",
    "Air conditioning",
    "Garmin avionics suite"
  ],
  "specs": {
    "engine": "Rolls-Royce RR300",
    "engineHours": 450,
    "engineTBO": 3000,
    "avionics": ["Garmin G500H", "GTN 750", "GTX 345"],
    "equipment": ["Air conditioning", "Leather seats", "USB charging"]
  },
  "images": [
    { "url": "/assets/helicopters/r66-g-heli-1.jpg", "alt": "R66 exterior", "isPrimary": true },
    { "url": "/assets/helicopters/r66-g-heli-2.jpg", "alt": "Cockpit view", "isPrimary": false }
  ],
  "featured": true,
  "sortOrder": 1,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-02-01T14:30:00Z",
  "soldAt": null
}
```

**Sold Helicopter:**
```json
{
  "model": "Robinson R44 Raven II",
  "manufacturer": "Robinson",
  "year": 2018,
  "registration": "G-SOLD",
  "totalHours": 1800,
  "price": 295000,
  "priceDisplay": "SOLD",
  "status": "sold",
  "images": [
    { "url": "/assets/helicopters/r44-g-sold-1.jpg", "alt": "R44 exterior", "isPrimary": true }
  ],
  "featured": false,
  "sortOrder": 99,
  "soldAt": "2024-01-20T00:00:00Z"
}
```

---

### 10. Next Steps

1. Complete `firebase init` setup
2. Add sample helicopter documents via Firebase Console
3. Integrate Firebase SDK into website
4. Test data fetching
5. Build helicopter card rendering
6. Deploy and verify
