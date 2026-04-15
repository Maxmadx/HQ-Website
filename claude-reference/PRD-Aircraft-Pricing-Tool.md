# Product Requirements Document: Aircraft Pricing Intelligence Tool

**Version:** 1.0
**Date:** February 2026
**Author:** HQ Aviation Development Team
**Status:** Draft

---

## 1. Executive Summary

The Aircraft Pricing Intelligence Tool is a new module within the HQ Aviation admin dashboard that provides data-driven pricing guidance for helicopter sales. By visualizing historical sales data, market trends, and comparative analytics, sales staff can make more informed pricing decisions and justify valuations to clients with concrete market evidence.

---

## 2. Problem Statement

### Current Challenges:
- Pricing decisions are based on intuition and fragmented market knowledge
- No centralized view of historical sales performance
- Difficult to explain pricing rationale to buyers/sellers with evidence
- Regional price variations (UK vs US vs EU) are not systematically tracked
- No visibility into how factors like hours, age, and condition affect realized prices
- Lost revenue from underpricing or lost deals from overpricing

### Opportunity:
Leverage our own sales data plus external market data to create a competitive pricing advantage and establish HQ Aviation as a trusted authority on helicopter valuations.

---

## 3. Goals & Success Metrics

### Primary Goals:
1. Reduce pricing decision time by 50%
2. Improve pricing accuracy (reduce variance between ask and sale price)
3. Provide evidence-based valuations for client negotiations
4. Identify market trends early to optimize inventory timing

### Success Metrics:
| Metric | Current | Target |
|--------|---------|--------|
| Avg. time to price a listing | 2-3 hours | <30 min |
| Ask-to-sale price ratio | Unknown | Track & improve |
| Days on market | Varies | Reduce by 15% |
| Client pricing disputes | Frequent | Reduce by 50% |

---

## 4. User Stories

### As a Sales Manager:
- I want to see historical prices for similar aircraft so I can set competitive asking prices
- I want to compare UK vs US market prices to advise clients on where to sell
- I want to generate a market analysis report to share with sellers

### As a Salesperson:
- I want quick access to comparable sales when negotiating with buyers
- I want to understand how aircraft hours affect pricing
- I want to see price trends over time to advise on timing

### As Management:
- I want to track our pricing accuracy over time
- I want to identify which aircraft types have the best margins
- I want market intelligence for strategic inventory decisions

---

## 5. Feature Requirements

### 5.1 Historical Sales Database

**Data Structure:**
```javascript
{
  // Sale Record
  id: string,

  // Aircraft Details
  manufacturer: string,        // e.g., "Robinson", "Airbus", "Bell"
  model: string,               // e.g., "R44 Raven II", "H125"
  year: number,
  serialNumber: string,
  registration: string,

  // Condition at Sale
  totalHours: number,
  engineHours: number,
  condition: 'excellent' | 'good' | 'fair' | 'project',

  // Pricing
  askingPrice: number,
  salePrice: number,
  currency: 'GBP' | 'USD' | 'EUR',
  priceUSD: number,            // Normalized for comparison

  // Sale Context
  saleDate: Timestamp,
  daysOnMarket: number,
  region: 'UK' | 'US' | 'EU' | 'Asia' | 'Other',
  country: string,

  // Source
  source: 'internal' | 'market_data' | 'manual_entry',
  sourceDetails: string,       // e.g., "Controller.com", "Internal Sale"
  helicopterId: string | null, // Link to our listings if internal

  // Equipment & Features (affects value)
  equipment: string[],         // e.g., ["IFR", "Air Con", "Leather Interior"]
  modifications: string[],

  // Metadata
  createdAt: Timestamp,
  createdBy: string,
  notes: string
}
```

**Data Sources:**
1. **Internal Sales** - Auto-populate from our "Mark as Sold" workflow
2. **Manual Entry** - Form for entering market/competitor sales
3. **Import** - CSV import for bulk historical data
4. **Future: API Integration** - Controller.com, ASO, etc.

---

### 5.2 Pricing Visualization Dashboard

#### 5.2.1 Price Scatter Plot (Primary View)

**X-Axis Options:**
- Sale Date (time series)
- Total Hours
- Aircraft Age (years)
- Engine Hours to TBO

**Y-Axis:**
- Sale Price (normalized to USD or selected currency)

**Data Points:**
- Each sale is a dot on the plot
- Dot size can represent days on market
- Dot color represents data segments (see 5.2.2)
- Hover shows full sale details
- Click opens sale record

**Plot Features:**
- Trend line (linear regression)
- Moving average line
- Price bands (percentiles: 25th, 50th, 75th)
- Zoom and pan
- Export as image

#### 5.2.2 Data Segmentation (Color Coding)

Users can segment data by:

| Segment By | Colors/Legend |
|------------|---------------|
| Region | UK=Blue, US=Red, EU=Green, Asia=Orange |
| Source | Internal=Purple, Market=Gray |
| Condition | Excellent=Green, Good=Blue, Fair=Yellow, Project=Red |
| Year Range | Gradient by decade |
| Custom Tags | User-defined |

**Segment Controls:**
- Toggle segments on/off
- Solo a single segment
- Compare any two segments side-by-side

#### 5.2.3 Filters Panel

| Filter | Type | Options |
|--------|------|---------|
| Manufacturer | Multi-select | All manufacturers in data |
| Model | Multi-select | Filtered by manufacturer |
| Year Range | Slider | Min-Max from data |
| Hours Range | Slider | 0 - Max hours |
| Price Range | Slider | 0 - Max price |
| Sale Date | Date range | Custom or presets |
| Region | Multi-select | UK, US, EU, Asia, Other |
| Condition | Multi-select | Excellent, Good, Fair, Project |
| Source | Multi-select | Internal, Market, Manual |

---

### 5.3 Price Estimator Tool

#### Input Form:
```
┌─────────────────────────────────────────────────┐
│  ESTIMATE AIRCRAFT VALUE                        │
├─────────────────────────────────────────────────┤
│  Manufacturer:  [Robinson        ▼]             │
│  Model:         [R44 Raven II    ▼]             │
│  Year:          [2018           ]               │
│  Total Hours:   [850            ]               │
│  Engine Hours:  [850            ]               │
│  Condition:     [Good           ▼]              │
│  Region:        [UK             ▼]              │
│  Equipment:     [IFR] [Air Con] [+Add]          │
│                                                 │
│  [Calculate Estimate]                           │
└─────────────────────────────────────────────────┘
```

#### Output Display:
```
┌─────────────────────────────────────────────────┐
│  ESTIMATED VALUE RANGE                          │
├─────────────────────────────────────────────────┤
│                                                 │
│  ██████████████████░░░░░░░░                     │
│  $285,000 ──────── $320,000 ──────── $355,000   │
│  Low              Estimated           High      │
│                                                 │
│  Based on 23 comparable sales                   │
│  Confidence: High (R² = 0.87)                   │
│                                                 │
├─────────────────────────────────────────────────┤
│  COMPARABLE SALES                               │
│  ┌────────────────────────────────────────────┐ │
│  │ 2019 R44 Raven II • 720 hrs • $335,000    │ │
│  │ Sold Dec 2025 • UK • Excellent            │ │
│  ├────────────────────────────────────────────┤ │
│  │ 2017 R44 Raven II • 920 hrs • $298,000    │ │
│  │ Sold Nov 2025 • UK • Good                 │ │
│  ├────────────────────────────────────────────┤ │
│  │ 2018 R44 Raven II • 800 hrs • $315,000    │ │
│  │ Sold Oct 2025 • US • Good                 │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
│  [View All Comparables] [Generate Report]       │
└─────────────────────────────────────────────────┘
```

#### Estimation Algorithm:
1. Filter to same manufacturer + model
2. Apply similarity scoring based on:
   - Year difference (weight: 25%)
   - Hours difference (weight: 30%)
   - Condition match (weight: 20%)
   - Region match (weight: 15%)
   - Recency of sale (weight: 10%)
3. Calculate weighted average of top 10-20 comparables
4. Apply adjustments for equipment differences
5. Return range (25th to 75th percentile of weighted results)

---

### 5.4 Market Trends View

#### Price Index Chart:
- Track average prices by model over time
- Normalize to index (e.g., Jan 2020 = 100)
- Show multiple models on same chart
- Identify appreciation/depreciation trends

#### Regional Comparison:
```
┌─────────────────────────────────────────────────┐
│  R44 RAVEN II - REGIONAL PRICE COMPARISON       │
├─────────────────────────────────────────────────┤
│                                                 │
│  UK Market     ████████████████████  $312,000   │
│  US Market     ██████████████████    $295,000   │
│  EU Market     ███████████████████   $305,000   │
│                                                 │
│  Premium/Discount vs US:                        │
│  UK: +5.7%  |  EU: +3.4%                        │
│                                                 │
│  Based on sales from last 12 months             │
└─────────────────────────────────────────────────┘
```

#### Depreciation Curves:
- Plot value vs age for each model
- Show depreciation rate per year
- Compare against book values (if available)

---

### 5.5 Data Management

#### Manual Entry Form:
- Add individual sale records
- Validation for required fields
- Duplicate detection (same serial number + date)

#### CSV Import:
- Template download
- Column mapping UI
- Validation report before import
- Rollback capability

#### Data Quality:
- Flag outliers automatically
- Review queue for anomalous entries
- Source attribution for all data
- Edit history/audit trail

---

### 5.6 Reporting

#### Quick Report (PDF):
- Single aircraft valuation summary
- Comparable sales list
- Market context paragraph
- HQ Aviation branding
- Shareable with clients

#### Market Report (PDF):
- Model-specific market analysis
- Price trends
- Regional breakdown
- Volume statistics
- Professional formatting

---

## 6. Technical Architecture

### 6.1 Data Storage

**Firestore Collections:**
```
/pricing_sales           - Historical sale records
/pricing_estimates       - Saved estimates (for tracking accuracy)
/pricing_reports         - Generated reports metadata
/pricing_data_sources    - External data source configs
```

### 6.2 Charts Library

**Recommended:** Chart.js or Recharts
- Scatter plots with multiple datasets
- Line charts for trends
- Interactive tooltips
- Responsive design
- Export to PNG/SVG

### 6.3 Calculations

**Client-side:**
- Filtering and basic statistics
- Real-time estimate updates

**Server-side (Cloud Functions):**
- Regression analysis
- Report generation (PDF)
- Data import processing
- Currency conversion (daily rates)

---

## 7. UI/UX Design

### 7.1 Navigation

New sidebar item: **"Pricing Tool"** (or "Market Intelligence")
- Icon: Chart/graph icon
- Position: After "Listings", before "Contacts"
- Permission: New permission `PRICING_VIEW`, `PRICING_MANAGE`

### 7.2 Page Structure

```
/pricing                 - Main dashboard with chart
/pricing/estimate        - Price estimator tool
/pricing/data            - Data management (add/import/edit)
/pricing/reports         - Report generation
/pricing/trends          - Market trends analysis
```

### 7.3 Responsive Design

- Desktop: Full chart with side panel filters
- Tablet: Collapsible filters, full-width chart
- Mobile: Simplified view, list-based comparables

---

## 8. Permissions

| Permission | Description |
|------------|-------------|
| `PRICING_VIEW` | View charts and estimates |
| `PRICING_ESTIMATE` | Use price estimator |
| `PRICING_DATA_ADD` | Add sale records manually |
| `PRICING_DATA_IMPORT` | Import CSV data |
| `PRICING_DATA_EDIT` | Edit/delete records |
| `PRICING_REPORTS` | Generate reports |

**Role Defaults:**
- Viewer: `PRICING_VIEW`
- Editor: `PRICING_VIEW`, `PRICING_ESTIMATE`
- Admin: All pricing permissions
- Super Admin: All pricing permissions

---

## 9. Implementation Phases

### Phase 1: Foundation (MVP)
- [ ] Database schema and Firestore setup
- [ ] Basic data entry form
- [ ] CSV import functionality
- [ ] Simple scatter plot with filters
- [ ] Manufacturer/Model filtering

### Phase 2: Visualization
- [ ] Advanced chart interactivity
- [ ] Data segmentation (color coding)
- [ ] Trend lines and statistics
- [ ] Chart export

### Phase 3: Estimation
- [ ] Price estimator algorithm
- [ ] Comparable sales matching
- [ ] Confidence scoring
- [ ] Estimate history tracking

### Phase 4: Reporting
- [ ] PDF report generation
- [ ] Quick valuation reports
- [ ] Market analysis reports
- [ ] Email sharing

### Phase 5: Advanced
- [ ] Regional comparison tools
- [ ] Depreciation curves
- [ ] Price index tracking
- [ ] API integrations (future)

---

## 10. Data Seeding

### Initial Data Requirements:
1. **Internal Sales History**
   - Export all "sold" helicopters from current system
   - Include ask price and sale price
   - Backfill any missing data

2. **Market Research Data**
   - Compile recent sales from:
     - Controller.com listings (historical)
     - Trade-a-Plane
     - Industry contacts
     - Auction results
   - Aim for 200+ records across popular models

3. **Model/Manufacturer Reference**
   - Standard model names
   - Typical specifications
   - Equipment options list

---

## 11. Future Considerations

### Potential Enhancements:
- **AI-Powered Insights:** Natural language market summaries
- **Predictive Pricing:** ML models for future price predictions
- **Inventory Recommendations:** Suggest acquisitions based on demand
- **Client Portal:** Share market data with select clients
- **API Access:** Monetize data via API
- **Mobile App:** On-the-go valuations at trade shows

### Integration Opportunities:
- Controller.com API (if available)
- Currency exchange rate APIs
- Economic indicators (interest rates, fuel prices)
- Flight tracking data (utilization patterns)

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Insufficient data | Low accuracy | Aggressive data collection, manual entry incentives |
| Data quality issues | Wrong estimates | Validation, outlier detection, source tracking |
| Currency fluctuations | Price comparison errors | Daily rate updates, store in multiple currencies |
| Competitor data accuracy | Misleading insights | Source attribution, confidence indicators |
| User adoption | Wasted investment | Training, demonstrate value, iterate on UX |

---

## 13. Open Questions

1. What is the minimum number of comparable sales needed for a reliable estimate?
2. Should we track competitor asking prices (not just sales)?
3. How do we handle private sales where price is unknown?
4. Should estimates be versioned/time-stamped for audit purposes?
5. Do we need multi-currency display or normalize everything to USD?
6. What's our data retention policy for pricing records?

---

## 14. Appendix

### A. Sample Data Schema (CSV Import)

```csv
manufacturer,model,year,serial_number,registration,total_hours,engine_hours,condition,asking_price,sale_price,currency,sale_date,region,country,source,equipment,notes
Robinson,R44 Raven II,2018,14523,G-HELI,850,850,good,340000,315000,GBP,2025-11-15,UK,United Kingdom,internal,"IFR,Air Con",Clean sale
Bell,206B,2005,4521,N206BA,5200,1200,fair,425000,395000,USD,2025-10-22,US,United States,market_data,,High hours but recent overhaul
```

### B. Competitor Analysis

| Platform | Data Available | Access Method |
|----------|---------------|---------------|
| Controller.com | Listings, some sold | Manual, no API |
| Trade-a-Plane | Listings | Manual |
| ASO | Listings | Manual |
| AvBuyer | Listings | Manual |
| Heli-Mart | Listings, forums | Manual |

### C. Reference Pricing Guides

- Aircraft Bluebook (subscription)
- Vref (subscription)
- NAAA Price Digest
- HeliValue$ (industry standard)

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 2026 | Dev Team | Initial draft |
