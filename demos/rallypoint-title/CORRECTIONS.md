# What Playwright Revealed — Reconciliation Notes

The original diagnostic was based on a static HTML scrape that missed everything rendered client-side. Live render through Playwright revealed major content I'd missed:

## Wrong assumptions in v1

| v1 assumption | Reality |
|---|---|
| Navy + gold palette | **Deep maroon red + black + white** — that's the actual brand |
| "Reviews section is empty" | **4.7 stars, 79 Google reviews** — live, with named reviewers |
| "Blog posts unpopulated" | **10+ real, recent blog posts** with categorized navigation |
| "FAQs are just text" | **9 embedded YouTube videos** — one per FAQ |
| "Resources page is a placeholder" | Two real cards: Forms (13 PDFs) + Calculator |
| "Calculator named but not built" | Confirmed — it exists as a stub link to "FIND OUT MORE" |
| "Forms page placeholder" | **13 downloadable PDFs** with real NJ-specific titles |
| "Free Home Buyer Checklist is text" | Real interactive flipbook at heyzine.com |
| "Military page is thin" | Confirmed thin, but has full-bleed American flag photo |

## Real content I'm preserving in v2

### Real Google reviews (from Maps embed)
- **4.7 stars · 79 reviews**
- Leath Cao — 5/5/2026: "It was a pleasure working with Rally Point Title Agency for our h..."
- Mike Jakubik — 5/4/2026: "Rally Point was great as always! Kept our transaction on time and..."
- Marco Basile — 4/23/2026: "As a first time experience with the 1031 Exchange program, Rally Po..."

### 9 YouTube videos (FAQs page)
- What is title insurance — `OtY6_MKQe6w`
- How long does the title policy last — `c8D2Sgacq0A`
- How much does Title cost — `n33TSEjX_NY`
- Who orders the title search — `0nXljKSJJOI`
- Owner's vs Lender's title policy — `v-u9eSMOhZ0`
- Is title insurance necessary on a refinance — `JMH5CJwFYGQ`
- How to prevent wire fraud — `EMPVL-P6Qiw`
- What is a 1031 Exchange — `exyprA9U_N8`
- Steps in a real estate closing — `3KTxJ_Dpgx0`

### 13 downloadable PDF forms
Real downloads from `img1.wsimg.com/blobby/go/9b83977c-…/downloads/`:
- Title Insurance Order Form
- Affidavit of Consideration (Buyer / Seller-2010)
- Estate Questionnaire
- FIRPTA Affidavit
- L-9 Resident / Non-Resident
- NJ Estate Tax Return 2017
- NJ Non-Resident Sellers Tax Declaration
- NJ Resident Estate Tax Form
- NJ Sellers Residency Certification Exemption
- NJ Standard Real Estate Contract
- NJ Waiver of Sellers Filing Requirement

### Real blog posts
Categorized: 1031 Exchange · New Jersey Lifestyle · Real Estate · Real Estate Investing · Title Insurance
- Best Jersey Shore Towns for Year-Round Living (May 2026)
- Can You Sell a House in Foreclosure in New Jersey? (May 2026)
- Title Company Fees in Matawan NJ (May 2026)
- A First-Time Homebuyer's Guide to Title Services in New Jersey
- Guide to Title Services & FAQs in New Jersey
- Fort Monmouth Luxury Real Estate & 1031 Exchanges
- Best Timing Strategies for a 1031 Exchange in Any Market
- Can You Use a 1031 Exchange Out of State?
- What Are "Clouds on Title" in NJ and How Are They Cleared?
- How Does a 1031 Exchange Fit Into Estate Planning?

### 8 service tiles (services page reality)
Residential Services · Property Transfers · Title Examination · Commercial Purchases · Refinance Services · Owner / Lender Insurance · Property Lien Searches · Escrow & Settlement Services

### Pages I'm adding in v2 that v1 was missing
- `forms.html` — real PDF download list
- `blogs.html` — real categorized blog index
- `checklist.html` — link to the live flipbook
