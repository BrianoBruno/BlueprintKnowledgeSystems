# Rally Point Title Agency — Website Diagnostic

**URL audited:** https://rallypointtitle.com/
**Date:** 2026-05-30

---

## Overall Score: **4.4 / 10**

A functional template site that looks built with a drag-and-drop tool. The content is on-brand and the contact info is correct, but the design, structure, and execution do not match what a professional title & escrow agency operating across four states should present.

| Category | Score | Notes |
|---|---|---|
| Visual Design | 4/10 | Generic builder template; weak hierarchy; no brand identity beyond the logo |
| Content Quality | 5/10 | Copy is decent where it exists, but several pages are nearly empty |
| Information Architecture | 4/10 | Confusing service taxonomy; duplicate menu items; thin pages |
| Trust & Credibility | 3/10 | No team bios, no underwriter logos, empty reviews section, "© 2023" footer |
| Conversion / CTAs | 4/10 | Single generic "Send" form, no segmented CTAs (agent vs buyer vs lender) |
| Mobile / Responsive | 5/10 | Template-level responsiveness only; phone displayed twice in header |
| SEO | 4/10 | Thin pages, generic titles ("FAQs", "Resources"), no schema markup visible |
| Performance | 5/10 | Builder platform adds bloat (jQuery, multiple analytics, cookie banner JS) |

---

## What's Wrong — Specific Findings

### 1. Looks like a stock template, not a professional services brand
The site is "Powered by" a generic site builder. The hero literally repeats **"FULL SERVICE TITLE & ESCROW AGENCY"** four times — a clear duplicate-text/template glitch that survived launch.

### 2. Outdated footer
Copyright reads **© 2023**. It's currently 2026.

### 3. About page is effectively empty
Scraping returns only three headers: *Our Founder*, *Who We Serve*, *What Makes Rally Point Different?* — the content sits inside image/accordion blocks with no real founder bio, no photos, no story.

### 4. Title Services page is structurally broken
Card labels repeat ("Residential Services" appears 4× in the first column), subtitles don't match titles, and the taxonomy mixes residential, commercial, escrow, and lien searches in a confusing grid. A reader can't tell what's offered.

### 5. Resources page is a placeholder
Literal copy reads: *"VARIOUS FORMS HERE CALCULATOR CALCULATOR"*. This is unshipped.

### 6. No social proof
"OUR BLOG POSTS" and "Reviews" sections exist in the layout but contain no posts or reviews.

### 7. No trust signals
No underwriter logos (Stewart, First American, Old Republic, etc.), no ALTA Best Practices badge, no state licensing display, no team photos, no client logos.

### 8. Phone number appears twice in the header
732-359-2009 is rendered twice back-to-back — a styling/template bug.

### 9. Single unsegmented contact form
The same "Name / Email / Phone / Send" form is used for everything. A title agency converts very differently across:
- Home buyers (want education + calculator)
- Real estate agents (want fast quote + closing schedule)
- Lenders / attorneys (want a relationship)
- 1031 investors (want a specialist call)

### 10. Weak SEO
Page titles are literal menu labels ("Home", "Faqs", "Military"). No meta descriptions, no FAQ schema, no LocalBusiness schema — critical for a multi-state title agency that should rank for "title company near me" in Monmouth County NJ, West Palm Beach FL, etc.

### 11. No instant value
No title fee calculator (named on Resources page but not built), no "what to expect at closing" timeline, no document upload portal, no order-title CTA.

### 12. Inconsistent service-area messaging
Header says "Offering 1031 Exchange Services." Home copy says "NJ, NY, PA & FL." About says "Monmouth County NJ, West Palm Beach FL, and Pennsylvania." No NY office mentioned anywhere despite NY being a stated service state.

### 13. Military page is thin
Strong angle (veterans / first responders) but just three outbound links and one paragraph. A whole program could live here.

### 14. No accessibility consideration
No skip links, low contrast accent text, decorative images without alt text in scraped output.

---

## What the Rebuild Fixes

1. **A real brand system** — navy + gold + cream palette, serif/sans pairing, consistent spacing scale
2. **Clear service architecture** — Residential, Commercial, Refinance, 1031 Exchange, each with their own clean card
3. **Segmented CTAs** — separate paths for Buyers, Agents, Lenders, Investors
4. **Trust signals** — underwriters strip, stats bar, founder bio block, testimonials section
5. **Working tools** — title fee estimator, closing timeline, 1031 step tracker
6. **Real FAQ component** — accessible accordion with schema.org/FAQPage markup
7. **LocalBusiness + service-area schema** for multi-state SEO
8. **Modern, accessible, responsive** — mobile-first, keyboard-navigable, ARIA-correct
9. **No template artifacts** — no duplicate hero text, no stale copyright, no "powered by" footer
10. **Updated military page** — full Veteran/First Responder program with discount callout

---

## Tech Choices for the Rebuild

- **Pure HTML + vanilla JS + CSS** (no framework dependency) — fast, hostable anywhere, easy for the client to edit
- **CSS custom properties** for tokens (one file changes the whole brand)
- **No build step** — open files in a browser and ship to any host
- **Inline SVG icons** — no icon font, no external CDN
- **System + Google fonts** — Playfair Display (headings) + Inter (body)
