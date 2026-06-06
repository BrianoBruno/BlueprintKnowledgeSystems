# Rally Point Title — Rebuild Plan

> Internal planning document for the Rally Point Title Agency website rebuild.
> Captures architecture decisions, the rationale behind each, and what's still open.
>
> Last updated: 2026-06-03 · Author: Blueprint Knowledge Systems

---

## 1. Context

**Client:** Rally Point Title Agency — title & escrow agency in Matawan, NJ. Founder: Emily Robinson.

**Current state:** Live site at `https://rallypointtitle.com/` is built on **GoDaddy Website Builder (Airo / DPS 2.0)**. It has working bones (HTTPS, sitemaps, schema attempt, 46 published blog posts) but scores **41/100 on SEO audit** — see `rallypointtitle-seo-audit-2026-06-03.pdf`. Reviews widget is empty, blog meta descriptions are templated, schema is malformed, no geo keywords in title/H1.

**This project:** Pitch a full rebuild on a platform Blueprint Knowledge Systems can fully control, hosted on the client's existing cPanel hosting (or a recommended migration target). Demo at `/demos/rallypoint-title/` shows the proposed design direction using real content scraped from the live site.

---

## 2. Architecture Decisions

| Layer | Decision | Why |
|---|---|---|
| **CMS** | Grav CMS (flat-file, PHP) | Runs on cPanel; per-post SEO metadata built into the architecture; no DB to maintain; ports cleanly from the hand-coded demo |
| **Hosting** | Client's existing cPanel | No migration friction; supports PHP+SMTP for email; sufficient for a brochure+blog site |
| **Contact form / email** | PHP + Resend transactional API | Reliable deliverability without depending on cPanel mail reputation; 3,000 emails/mo free tier covers any plausible contact-form volume |
| **Quote tool** | Qualia widget (existing client integration) | Already exists in their workflow; preserves whatever ops process they have around Qualia |
| **Reviews** | Google Places API or Trustindex/Elfsight widget | Surfaces the real 79-review/4.7-star data from their actual GBP; ends the "empty Reviews section" SEO finding |
| **Analytics** | Google Tag Manager + GA4 | Replaces the existing direct GA4 install with a managed container Emily can extend later |
| **Schema** | Hand-rolled JSON-LD in Grav theme | Fixes the malformed `LocalBusiness` block from the audit; emits `TitleCompany` + `Article` per post |

---

## 3. CMS — Grav

### Decision
**Grav CMS**, hosted on the client's existing cPanel account.

### Why not WordPress
- Heavier maintenance burden (security patches, plugin sprawl, database upkeep)
- The demo design ports more cleanly to Grav's Twig templating than to WP's PHP template hierarchy
- No DB means backups are a folder copy, attack surface is smaller, and page loads are faster

### Why not stay on GoDaddy Airo
- Cannot edit raw HTML/CSS/JS, so the SEO fixes from the audit can't be implemented
- Cannot inject custom JSON-LD schema
- Per-post meta descriptions cannot be edited individually (the root cause of the templated-meta-description finding affecting 46 URLs)
- Cannot add custom blog post H1s
- No path to state-specific landing pages with custom routing

### Trade-off accepted
Grav has a smaller ecosystem than WordPress. If the client ever needs to hire someone other than Blueprint Knowledge Systems to maintain the site, the freelance pool is smaller. This is mitigated by the long-term managed-care relationship (Blueprint remains the maintainer).

### Capabilities confirmed
- ✅ Image upload via admin panel media tab + built-in responsive image pipeline (`image.jpg?cropResize=800,600`)
- ✅ Tagging via `taxonomy: { tag: [...] }` in frontmatter — auto-generates `/blog/tag:foo` archive pages
- ✅ Per-page SEO metadata (`title`, `metadata.description`, `og:*`, `canonical`, `robots`) editable via admin form
- ✅ Schema markup via theme template using same frontmatter

---

## 4. Per-Post SEO Metadata

### Problem this solves
The SEO audit identified that all 46 blog posts on the live GoDaddy site share the same default meta description ("Expert 1031 Exchange Services...") and the H1 of every post is literally the word "Blog." Single biggest organic loss on the site.

### Decision
Every post in Grav is a markdown file with YAML frontmatter. The admin panel exposes each frontmatter field as a form field. Standard frontmatter shape:

```yaml
---
title: Title Company Fees in Matawan NJ          # → <title> AND <h1>
date: '2026-05-18 14:18'
taxonomy:
  tag: [title-insurance, matawan, closing-costs]
  category: title-insurance
hero_image: title-fees-hero.jpg
metadata:
  description: 'If you are buying, selling, or refinancing a home in Matawan, understanding title company fees is an important part of preparing for closing costs.'
  keywords: 'title company fees, matawan, monmouth county'
  'og:title': 'Title Company Fees in Matawan NJ'
  'og:description': '...'
  'og:image': 'fees-hero.jpg'
  'twitter:card': 'summary_large_image'
robots: 'index, follow'
canonical: 'https://rallypointtitle.com/blog/title-company-fees-in-matawan-nj'
---
```

### Coaching layer
Grav lacks WordPress + Yoast's traffic-light "your meta description is too short" UI. Mitigation: provide Emily with a short Loom + one-page cheat sheet covering:
- Meta description: 140–160 chars, ends with a CTA
- Title tag: 50–60 chars, includes city/state when applicable
- Featured image: 1200×630 for OG/Twitter
- One focus keyword per post

---

## 5. Email / Contact Form

### Decision
**PHP form handler + Resend transactional API.** Form posts to `/contact-submit.php`, which validates input, sends via Resend's HTTPS API, and redirects to `/thanks.html`.

### Why not PHP `mail()`
Shared cPanel IP reputation is weak; SPF/DKIM alignment is hit-or-miss; legitimate submissions land in spam or get silently dropped. Every "we never got your message" client complaint comes from this.

### Why not PHPMailer + cPanel SMTP
Workable fallback if Resend is unavailable, but deliverability still depends on the shared host's reputation. Resend gives consistent deliverability and 3,000 emails/mo free — covers any plausible contact-form volume forever.

### Required hardening
| Concern | Implementation |
|---|---|
| Spam bots | Cloudflare Turnstile (free, invisible) |
| Header injection | Strip `\r`, `\n` from any field used in email headers |
| Server-side validation | Re-validate required + email + length on PHP |
| Rate limiting | Session/filesystem counter, max 3 submissions/IP/hour |
| CSRF | Hidden token in form, validate on submit |
| Visitor confirmation | Redirect to `/thanks.html`; optional auto-responder email |

### Routing
- `To:` → `title@rallypointtitle.com`
- `From:` → `noreply@rallypointtitle.com` (Resend-verified domain)
- `Reply-To:` → the submitter's email address (so "Reply" in their inbox replies to the lead)
- 1031-specific form variant routes to `Exchange@RallyPointTitle.com`

---

## 6. Qualia Quote Widget

### Decision
Keep the Qualia integration the client already uses. Implemented in the demo as:

1. Loader script in `<head>` on every page:
   `<script async src="https://connect.qualia.com/quote-widget/scripts/init" id="qualia-quote-widget-loader" data-token="qiJDEkmAyG8nGbLLg"></script>`
2. Trigger anchors: `<a href="#" class="get-qualia-quote">Get Quote</a>` — in the nav CTA, hero, resources page, and CTA bands

### In Grav
- Loader script goes in the base theme template's `<head>` (loads on every page)
- Trigger anchors render from page templates and any content block

### Open question for the live site (still on GoDaddy)
Can the Qualia widget be embedded in the existing GoDaddy Airo install? Answer documented in client email draft: **probably yes on Premium tier+** via Custom Code (head) + Custom HTML block (trigger). Needs ~10 min inside the client's account to verify their plan tier supports Custom Code injection.

---

## 7. State Landing Pages

### Decision
Build four state-specific landing pages at launch:
- `/title-services-new-jersey`
- `/title-services-new-york`
- `/title-services-pennsylvania`
- `/title-services-florida`

### Why
SEO audit flagged that the site references serving NJ/NY/PA/FL but has no dedicated page for any. For a multi-state title agency, geo-page-per-state is industry-standard — each page targets its own state's search volume and competitor set.

### Page shape
Each page covers:
- State-specific opener (1–2 paragraphs)
- Services offered in that state (residential title, commercial, 1031, escrow)
- State-specific regulatory notes (NJ Realty Transfer Fee, FL Documentary Stamp Tax, etc.)
- Map / office location if applicable (Monmouth County for NJ; West Palm Beach for FL)
- CTA → Qualia quote widget

### Content responsibility
Blueprint drafts; Emily reviews/approves before publish.

---

## 8. Reviews Integration

### Decision — LOCKED
**Google Places API (New) → daily JSON cache on the cPanel host → rendered by Grav theme template + aggregateRating JSON-LD emitted from the same source.**

No third-party widget, no recurring subscription, no client-side API call on every page load. Fully owned.

### Why this approach
- Unlocks the `aggregateRating` schema — directly fixes the audit finding about missing rich-result stars in SERPs
- Effectively $0/mo (Google's standing $200/mo Maps Platform free credit covers ~400,000× our usage)
- One JSON file on the host — no fragile real-time vendor dependency on each page render
- Compliant with Google's ToS (30-day cache limit, attribution back to GBP)

### Accepted constraint
**Places API returns at most 5 reviews per request — this is a hard Google cap.** Plan ships 5 most-relevant inline + a "Read all 79 on Google" CTA linking to the GBP. If Emily later wants all 79 scrollable on-page, the upgrade path is either (a) Business Profile API with OAuth, or (b) Trustindex/Featurable widget at $5–15/mo. Either is a separate scope.

### Implementation pattern

**1. Resolve the Place ID once** — Rally Point's GBP CID is `6508921509388670086`. Convert to a Place ID via Google's Place ID Finder and store as a Grav site config constant.

**2. Daily cron** (cPanel → Cron Jobs, 4am):
```bash
0 4 * * * curl -s "https://places.googleapis.com/v1/places/${PLACE_ID}" \
  -H "X-Goog-Api-Key: ${API_KEY}" \
  -H "X-Goog-FieldMask: rating,userRatingCount,reviews,googleMapsUri" \
  > /home/rallypoint/data/reviews.json
```

**3. Grav theme template** reads the cached JSON on render:
```php
$data = json_decode(file_get_contents('/home/rallypoint/data/reviews.json'), true);
// $data['rating']           → 4.7
// $data['userRatingCount']  → 79
// $data['reviews']          → array of 5 most relevant
```

**4. Schema emitted from the same data** (this is the SEO win):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TitleCompany",
  "name": "Rally Point Title Agency",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "79"
  }
}
</script>
```

### ToS compliance checklist
| Requirement | How we comply |
|---|---|
| Cache reviews ≤ 30 days | Daily refresh cron |
| Attribute Google | "Read all on Google" CTA links to GBP |
| Do not modify review text | Display as returned from API; truncate with "..." if needed but never paraphrase |
| Do not aggregate with non-Google review sources | Only Google reviews surfaced in this section |

### Cost
~$0.50/month nominal API charges, fully covered by Google's $200/mo Maps Platform free credit. **Effective monthly cost: $0.**

### Failure modes + mitigations
- **Cron fails / API quota exceeded:** template falls back to last-known-good `reviews.json` (which is always on disk). If file is missing entirely, render the static fallback ("4.7★ · 79 reviews on Google →" with no inline cards).
- **API field changes:** monitored as part of $75/mo managed care monthly check.
- **Place ID changes:** rare, but if Emily creates a new GBP, update the constant.

---

## 9. Pricing Structure

| Item | Cost | Notes |
|---|---|---|
| One-time build | **$3,500** | Includes design, content port, Grav setup, contact form, schema, 4 state landing pages, Qualia integration, deployment |
| Managed Care | **$75/month** | Includes 1hr/mo content updates, security patches, plugin updates, performance + SEO monitoring, priority email + phone support, monthly analytics report |

### What's NOT included (would be quoted separately)
- Additional state landing pages beyond the 4 at launch
- Net-new content writing (Emily provides drafts; we edit + publish)
- Hosting itself (client retains their cPanel account)
- Migration from Places API (5 reviews) to Business Profile API or third-party widget (all 79 reviews) — only if Emily later wants all reviews scrollable on-page

---

## 10. Demo State (What's Already Built)

Located at `/demos/rallypoint-title/` — accessible at `https://blueprintknowledgesystems.com/demos/rallypoint-title/` (noindex'd per `robots.txt` and per-page meta).

### Pages
11 HTML pages — index, about, services, 1031-exchange, forms, faqs, blogs, military, contact, checklist, resources.

### Content provenance
- **Founder photo + bio** — pulled from the live site's `/our-founder` page (Emily Robinson)
- **All 46 blog posts** — scraped from the live blog with titles, dates, excerpts, and hero images, linking back to the canonical `rallypointtitle.com/blogs/f/<slug>` URLs
- **Services, forms, FAQ topics, military resource links** — all paraphrased from the live site

### Fabricated content removed
Two independent reviewers cross-checked the demo against the live site and flagged 13+ hallucinations. All confirmed false claims were stripped:
- ALTA Best Practices 2026 badge → removed
- Underwriters & Affiliations strip (Stewart, First American, Old Republic, Fidelity, NJLTA) → removed
- Fake "4.7 / 79 reviews" stat strip → replaced with verifiable claims
- "$0 wire-fraud losses" → removed
- "Est. 2014" → removed
- Three named fake reviewers (Leath Cao, Mike Jakubik, Marco Basile) → replaced with Google Reviews placeholder
- Invented service promises (mobile notary tri-state, CE-credit lunch & learns, encrypted portal, reverse exchange experience, etc.) → removed
- Military settlement-fee discount → removed
- Aberdeen Road parking detail → removed
- "Manhattan" / "Lehigh Valley" geography → removed
- Anonymous "RP" founder card → restored to Emily Robinson

### Technical features in place
- Qualia widget loader + trigger anchors wired on every page
- noindex meta on every page; `/demos/` disallowed in robots.txt
- Mobile-responsive across desktop / tablet / mobile (Playwright-verified)
- Real Rally Point logo (transparent PNG keyed from their JPG)

### Not in the demo yet
- Contact form backend (form UI exists, no PHP handler)
- State landing pages (mentioned in scope, not built)
- Reviews integration (empty-state placeholder in place)
- Schema fixes (still using the simplified `LocalBusiness` block, not the full `TitleCompany` + `aggregateRating` we'd ship)

---

## 11. Security Baseline

### Third-party script integrity (SRI)
**Standard:** every external `<script>` we embed should carry `integrity="sha384-..." crossorigin="anonymous"` so a CDN or vendor compromise cannot silently inject hostile code into the page.

**Per-vendor reality:**

| Vendor / script | SRI feasible? | Plan |
|---|---|---|
| Qualia quote widget (`/quote-widget/scripts/init`) | ❌ Not as currently distributed — non-versioned URL, vendor pushes updates in-place. Adding SRI would break the integration the next time Qualia ships a loader update | **Open question for Qualia support:** do they offer a versioned/pinned URL with a published hash? If yes, switch to it. If no, document the residual risk and load the script with `referrerpolicy="no-referrer"` + a CSP `script-src` allowlist as compensating controls |
| Google Tag Manager | ✅ Yes — pin to a versioned `gtag.js?id=…` and publish the SRI hash | Add SRI on the GTM snippet |
| Cloudflare Turnstile | ✅ Vendor publishes versioned URLs | Use Turnstile's pinned version + SRI |
| Resend (API only) | N/A — server-side, no client script | n/a |
| Google Reviews API | N/A — server-side fetch, rendered as plain HTML | n/a |

### Compensating controls (regardless of SRI status)
- **Content-Security-Policy** header listing explicit `script-src` allowlist of vendor origins (Qualia, Google, Cloudflare) so an attacker who compromises one vendor can't inject scripts pretending to be another
- **Subresource boundary:** Qualia loader runs in the page context (can read the DOM and form data); avoid putting it on pages that handle sensitive PII unless the client signs off on that scope explicitly
- **Periodic audit:** monthly check that vendor script hashes haven't drifted unexpectedly (part of the $75/mo managed care)

## 12. Open Questions / Pending Client Confirmation

1. **GoDaddy plan tier** — does Rally Point's current Airo plan support Custom Code injection? Needed before quoting the Qualia integration on the live site (if they don't go full rebuild).
2. **Domain & DNS** — does the client want the new build deployed to `rallypointtitle.com` directly (DNS swap) or staged at a subdomain (`new.rallypointtitle.com`) for review before cutover?
3. **Google Cloud project for Places API** — Blueprint can provision under its own GCP account and bill the API usage through managed care (effectively $0 given the free credit), OR Emily creates a GCP project under her Google account and grants Blueprint access. Owner-of-record question more than a cost question.
4. **Blog migration path** — keep linking 46 posts to the live GoDaddy URLs (current demo approach) OR migrate post content into Grav and serve from new URLs with 301 redirects from the old?
5. **Email provider** — Resend (recommended) or stay with the existing setup? Need to know what Emily currently uses for `title@` / `Exchange@`.
6. **State landing pages content** — does Emily want to draft or should Blueprint draft with her review?

---

### Vendor-direct question
**Q7.** Does Qualia offer a versioned/pinned URL for the quote-widget loader that publishes an SRI hash? If not, what's their guidance on supply-chain mitigation for embedding partners? *(Action: email Qualia support before launch.)*

---

## 13. Reference Documents

- `rallypointtitle-seo-audit-2026-06-03.pdf` — Blueprint-branded SEO audit, 41/100 score, full findings
- `/demos/rallypoint-title/` — working demo
- `CORRECTIONS.md` — earlier QA notes (pre-overhaul)
- `DIAGNOSTIC.md` — earlier diagnostics (pre-overhaul)
