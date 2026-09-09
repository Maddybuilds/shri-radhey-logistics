# HANDOFF — Shri Radhey Logistics frontend build

> **Living checkpoint.** Updated between every task. If a session ends mid-build, a new
> session resumes from here. Last updated: **2026-06-09** · **DESIGN RESET v2** (course correction).
> Authoritative copy (VERBATIM): `C:\Users\mishr\Downloads\shri-radhey-FINAL-copy.md` (also mirrored
> in `handout.md`). NOTE: user referenced `content-source.md` — that file does not exist; the
> FINAL-copy.md is the verbatim source of truth. Copy is already embedded in the section components.

## ⚠️ DESIGN RESET v3 — AGENCY-GRADE FLAT REDESIGN (2026-06-09) — ACTIVE
Flat sections still read "AI-template": same rhythm everywhere (centered heading + row of icon-in-circle
cards), no imagery, everything centered, flat/no depth. v3 = serious visual redesign of FLAT SECTIONS ONLY
to look like a real agency-designed premium B2B logistics site (Maersk/DHL maturity, warmer + editorial).

**UNCHANGED (strict):** palette (Deep Blue #182350 / Floral White #FEFAEF / Pale Brown #B9915E / Powder Blue
#AFD2FA — NO new colors); 3D truck + globe + overlays; Get Quote logic (mailto+Gmail+WhatsApp+Call);
fonts (Fraunces headings + Inter body — go bigger/heavier if weak); subtle fade-in only (no text-reveal).

**Fix all AI tells:** (1) every section a DIFFERENT layout; (2) drastically reduce icon-in-circle cards →
big typographic numbers / image zones / asymmetric blocks / editorial lists; (3) add labeled IMAGE
PLACEHOLDER zones at real aspect ratios (`[IMG: …]`) — assume real photography exists; (4) strong LEFT
alignment + intentional asymmetry (center only where earned); (5) depth/layering — images bleeding past
section edges, overlapping cards, bento grids, layered shadows, z-index play. Pale Brown as real accent
(thin rules, number highlights, small-caps eyebrows, button fills). Faint grid/line motif on dark sections.

**New shared primitive:** `ImagePlaceholder` (labeled aspect-ratio block, Deep-Blue or grey, `[IMG: label]`).

### Per-section layout plan (v3)
- **About** — asymmetric split: big left text col; right TALL image `[IMG: truck on highway, 4:5]`;
  "15+ Years" badge OVERLAPS image bottom edge. Foundation facts (3 / ₹20L / ∞) as a thin typographic row.
- **TrustStats** — slim full-width strip, HUGE editorial numbers + hairline dividers (no icon chips).
- **Vision** — full-bleed Deep Blue, large centered editorial statement, generous padding, faint grid motif.
- **Core Values** — 4 alternating LEFT-aligned rows with oversized 01–04 numbers (kill the 4 cards/icons).
- **Growth Strategy** — real horizontal ROADMAP timeline for milestones; 4 pillars as editorial left list.
- **Company Structure** — big typographic stats + offices as a row beside `[IMG: India map w/ office pins]`.
- **Services** — feature ONE hero service large w/ `[IMG: loading dock]`, then 3 smaller (asymmetric, not 4 equal).
- **How We Work** — keep numbered process timeline (already a distinct visual); add faint grid motif.
- **Industries & Specialized (8)** — BENTO magazine grid, image-bg tiles + label overlays, varied sizes
  (some tiles span 2). `[IMG: FMCG / food / heavy equipment / ATM / plant / infra …]`.
- **Core Offerings (3)** — editorial 3-column lists, big column numbers + thin rules (NOT boxed cards).
- **Cost vs Revenue** — genuine SPLIT-SCREEN: left Deep Blue (Cost) / right Floral White (Revenue), big numbers.
- **Quote CTA** — keep (reframed banner already on-brief).
- **Industries We Serve (7)** — horizontal chip/“logo-strip” row (no cards).
- **Strategic Ventures** — Ashok Leyland + NAFED as large CASE-STUDY blocks w/ `[IMG: heavy equipment transport]`;
  smaller associations below.
- **Insights / Testimonials** — keep, but real `[IMG]` zones on Insights; Testimonials → large editorial quote.
- **Contact** — split: form on Floral White LEFT, Deep Blue panel RIGHT w/ contact info + `[IMG: map / Lucknow]`.
- **Footer** — keep (deep-blue + pale-brown accent rule); add faint grid motif.

### v3 PROCESS
1. [x] Update HANDOFF.md with this direction.
2. [→] **Show plan → WAIT for go.** ← AWAITING APPROVAL
3. [ ] Build **About + Industries & Specialized** FIRST as proof sections → WAIT for approval.
4. [ ] Build remaining sections; update HANDOFF after each.

> NOTE: v3 supersedes v2's flat-section layouts but builds ON the v2 palette/token cleanup (already on-palette,
> no orange/#fff). `frontend-design` skill NOT installed → applying discipline directly. `content-source.md`
> does not exist → using verbatim copy already in components / `shri-radhey-FINAL-copy.md`.

## ⚠️ DESIGN RESET v2 — NEW DIRECTION (2026-06-09)
Major course correction. The previous design system (navy `#16264a` + **orange** `#f5821f`,
Lovable/SaaS-leaning) is **scrapped**. We are restarting the design system with a strict new
palette and an editorial, premium-B2B direction. **The 3D truck, 3D globe, and the GSAP master
timeline are NOT touched.** Their text OVERLAYS are kept working but restyled into the new palette/fonts.

### NEW PALETTE (STRICT — exact hex only)
- **Deep Blue `#182350`** — PRIMARY, dominant. Navbar bg (scrolled), footer, dark sections,
  headings on light bg, primary buttons.
- **Floral White `#FEFAEF`** — main page background (warm cream). Replaces ALL pure white.
- **Pale Brown `#B9915E`** — ACCENT / THE STAR. CTAs, highlights, hover states, decorative strokes,
  stat numbers, badges. Used everywhere orange/gold previously was.
- **Powder Blue `#AFD2FA`** — SOFT accent. Subtle backgrounds, info cards, hover tints. Sparingly.
- **Greys** — 2–3 cool neutrals tinted toward Deep Blue (borders/dividers/muted text).
- **Banned:** NO red, NO yellow, NO pure white (`#fff`), NO black (`#000`). Dark = Deep Blue. Light = Floral White.

### STYLE DIRECTION (STRICT)
- Premium B2B enterprise (Maersk / DHL / Blue Dart maturity) but **warmer + editorial**.
- Editorial magazine feel: big confident headings, generous whitespace, strong weight contrast.
- Calm, established, 15-year-respected-firm — NOT a startup. Structural, clear grid, restrained motion.
- Indian B2B logistics: serious, trustworthy, professional.
- **NOT:** Lovable-style gradient bubble cards, playful startup vibe, oversized rounded corners,
  generic SaaS, colorful/festive.
- **NO scroll-choreographed text** on flat sections (no word-by-word reveal, typewriter, text-reveal-on-scroll).
  Subtle fade-in only.

### TYPOGRAPHY (STRICT)
- Headings: ONE of Clash Display / Satoshi / General Sans / **Fraunces** (serif, editorial luxury). Big, heavy.
- Body: Inter or Satoshi, light-to-regular for contrast vs headings.
- Eyebrows: small caps, wide tracked letter-spacing, Pale Brown.
- Strong weight contrast (very bold headings vs light body) = the expensive editorial look.
- **Pending decision:** heading font (recommend Fraunces — fits "warmer + editorial", already loaded).

### MOTION (STRICT)
- Subtle fade-in on section enter (Framer Motion, ~400ms, no bounce).
- Soft hover lift on cards (translateY -4px, soften shadow).
- Smooth section anchor scrolling.
- 3D truck + globe scroll animations stay exactly as-is. **NOTHING else** (no parallax everywhere,
  no scroll choreography on text).

### KEEP UNTOUCHED
- 3D truck hero (`TruckViewer.jsx`, R3F).
- 3D globe section (`GlobeScene.jsx`).
- GSAP master timeline (`ScrollScene.jsx`).
- Truck + globe text OVERLAYS (`src/overlays/HeroOverlays.jsx`, `GlobeOverlays.jsx`): heading beside
  truck side, stats at front, services at back doors, counters beside globe. Keep them WORKING —
  only restyle their text into the new palette + fonts.

### REDESIGN FROM SCRATCH (all flat sections)
Navbar · About · Vision · Core Values (4 cards) · Growth Strategy · Services (4 cards + Fleet/Partnerships)
· Industries & Specialized (8 tiles) · Core Offerings (3-col) · Cost Reduction vs Revenue Enhancement
(2-col compare) · Industries We Serve (7-grid) · Strategic Ventures & Associations · Contact / Get Quote
+ modal · Footer.

## GET QUOTE FORM (spec retained from v1 — already built, restyle only)
13-field modal: Name, Company, Phone (+91), Email, City, Service dropdown, Trucks Needed dropdown,
Cargo Type, Pickup, Delivery, Tonnage, Frequency, Message. Submit → mailto:
`info@shriradheylogistics.co.in` with formatted body; fallback to Gmail web compose if no mail app.
Plus WhatsApp button (`wa.me/919359001122`) and Call button (`tel:+919359001122`).
Files: `src/lib/quoteFields.js`, `src/lib/sendQuote.js`, `src/context/QuoteContext.jsx`, `src/components/QuoteModal.jsx`.

## PROCESS (this reset)
1. [x] Update HANDOFF.md with new direction.
2. [ ] **Show design tokens (palette map + fonts + spacing + radius scale) → WAIT for approval.** ← **NEXT**
3. [ ] Build About section FULLY as the visual sample → WAIT for approval.
4. [ ] Then build remaining sections; restyle overlays. Update HANDOFF.md after each.

## TASK STATUS (v2)
- [x] **R0. Tokens approved** — heading font = **Fraunces** (serif); palette/spacing/radius/shadow tokens locked.
- [x] **R1. sections.css token block rewritten** — new strict palette + cool greys + text tokens; v1
  names (`--navy`/`--orange`/`--white`/…) aliased to new palette so un-migrated sections stay on-palette.
  Radius tightened (4/8/12). Shadows deep-blue-tinted. Buttons remapped: `--primary`=Deep Blue,
  `--accent`=Pale Brown (star), `--secondary` outline, `--call`=Deep Blue. Fraunces+Inter already in index.html.
- [→] **R2. About sample section — BUILT, awaiting approval (gate).** Floral-White section, eyebrow=Pale Brown
  tracked, Fraunces h2 (tighter tracking), light body, Pale-Brown badge + fc-num stat numbers, foundation
  cards with thin pale-brown left rule + soft -4px hover lift. `npm run build` ✓.
- [ ] **R3. Navbar restyle**
- [→] **R4. Remaining flat sections restyle (Vision → Footer)** — IN PROGRESS via targeted hard-redesigns:
  - [x] **Contact** (`Contact.jsx`) — HARD REDESIGN. Now a dark Deep-Blue editorial section: left info rail
    (channels grid, office strip with status chips, assist CTA with Call + WhatsApp) + floating Floral-White
    form card with badge header + privacy note + success state. Form moved to `--accent` (Pale Brown) submit.
    Shared `.field` styles moved on-palette: Pale-Brown focus ring, **no red** (errors use `--pale-brown-700`).
    Classes renamed `.contact-grid`→`.contact-layout`; removed old `.info-card/.loc-card/.assist-card`.
  - [x] **Services / Fleet & Partnerships** (`Services.jsx`) — HARD REDESIGN. Dark gradient panel, eyebrow +
    Fraunces heading + meta checklist + `--accent` CTA (→#contact) on left; 2×2 `.fleet-feature` grid with
    Pale-Brown icon chips + hover lift on right. Replaced old `.fleet-list`.
  - [x] **Company Structure** (`CompanyStructure.jsx`) — HARD REDESIGN. Stat tiles → `.struct-stat` cards
    (icon chip, Pale-Brown Fraunces number, top accent rule on hover). Office cards → `.office-head`
    (pin chip + status), big city name, region eyebrow, dashed border for Upcoming. Finance block → dark
    gradient, eyebrow + checklist + featured ₹20L card with kicker + `.finance-tags` chips.
  - [x] **FULL bottom-of-page redesign sweep** (user: "design the bottom part after globe fully… look
    built by human not AI"). Goal = layout VARIETY, not the same centered-heading-over-card-grid everywhere:
    - **Navbar** — scrolled state now Deep-Blue solid (was white); floral-white links, Pale-Brown hover,
      Pale-Brown brand mark, light hamburger; Get Quote → `accent` (Pale Brown). `.nav .btn--ghost` lightened.
    - **Vision** — centered → asymmetric **left-ruled editorial pull-quote** on deep-blue gradient + glow.
    - **Core Values** — 4 identical cards → **asymmetric sticky intro + numbered editorial list** (01–04,
      hairline dividers, icon flips to deep-blue on hover, padding-shift hover).
    - **Growth Strategy / milestones** — palette fixes (deep-blue gradient panel, pale-brown timeline/nums).
    - **Industries & Specialized** — tile icons deep-blue→pale-brown on hover; **spec-strip orange→deep-blue
      gradient** with glow + pale-brown chips.
    - **Core Offerings** — first column now an **emphasized Deep-Blue feature card** (breaks 3-identical-box),
      pale-brown checks/icon tints, hover lift.
    - **Cost vs Revenue** — **contrasting columns**: Cost = deep-blue gradient card, Revenue = cream card;
      pale-brown accents (removed #ffb066/#fff hardcodes).
    - **Industries We Serve** — 7 centered cards → **sticky asymmetric intro + 2-col tile flow** (`.served-*`,
      icon flips on hover). Updated responsive refs `.serve-grid`→`.served-grid/.served-layout`.
    - **Strategic Ventures** — venture cards on-palette, feature = deep-blue gradient, pale-brown logos,
      refined green Active tag, track-record hover lift.
    - **Footer** — deep-blue-900 + **Pale-Brown top accent rule**, pale-brown headings/link-hover/icons,
      floral-white brand; removed #fff.
  - Off-palette `#ffb066` (orange-gold) eliminated everywhere (incl. globe overlay eyebrow/labels → Pale Brown).
    Remaining `#fff` are only low-opacity glass tints / text on dark 3D scenes (≈floral-white, imperceptible).
  - `npm run build` ✓ after the full sweep.
- [x] **R4b. NEW "How We Work" section** (`HowWeWork.jsx`, registered in `SiteContent` after Services).
  Inspiration-driven (LogiCart-style numbered process) but rebuilt in our palette: 5-step process timeline —
  Deep-Blue numbered circle nodes on a Pale-Brown dashed connector path, Pale-Brown step icon, title, desc,
  centered, hover lift; closing "Get a Quote" CTA via `useQuote()`. Responsive: 5→2→1 cols, connector hidden
  when stacked. NOTE: process steps are generic-but-true logistics stages (not fabricated business facts).
- [x] **R4c. NEW Quote CTA banner** (`QuoteCTA.jsx`, lazy, registered in `SiteContent` after CostRevenue).
  Reframed the inspiration's app-download band → Deep-Blue gradient band with Pale-Brown glow, faint truck
  glyph, eyebrow + Fraunces heading + lead + actions: "Get a Quote" (`useQuote`), "Call …", "WhatsApp".
  Uses real contact actions (no fake app/store links).
- [x] **R4d. Full inspiration build** (user: "use it fully") — three more sections added, all registered
  in `SiteContent`:
  - **TrustStats** (`TrustStats.jsx`, eager, after About) — 4-stat panel on a Powder-Blue-tint band.
    REAL figures only: 15+ Years, 19,000+ Pin Codes, 75M+ cu.ft Warehousing, 3 Offices. Pale-Brown icon
    chips + numbers, divided panel, collapses 4→2→1.
  - **Insights** (`Insights.jsx`, lazy, before Contact) — 3-card "Insights" grid; Deep-Blue gradient media
    header + Pale-Brown category pill + title/excerpt/read-more. ⚠️ PLACEHOLDER article titles/excerpts —
    no photos used (gradient+icon), nothing presented as a dated real event. USER TO REPLACE with real posts.
  - **Testimonials** (`Testimonials.jsx`, lazy, before Contact) — 3 quote cards, Pale-Brown filled stars,
    Fraunces quote, initial avatar. ⚠️ PLACEHOLDER quotes with SECTOR-ROLE attributions (no invented
    person/company names) to avoid fabricated endorsements. USER TO REPLACE with real client quotes.
- Section order now: About → TrustStats → Vision → CoreValues → GrowthStrategy → CompanyStructure →
  Services → HowWeWork → IndustriesSpecialized → CoreOfferings → CostRevenue → QuoteCTA → IndustriesServed
  → StrategicVentures → Insights → Testimonials → Contact → Footer.
- [x] **R5a. Globe overlay headline** — "From across India to wherever you need" → **"Pan-India"**;
  eyebrow "Pan-India Reach" → "Our Network". (Rest of overlays/3D untouched.) Remaining: Hero overlay restyle.
- [ ] **R6. Verify + final HANDOFF update** — `npm run build` ✓ (built in 5.53s) after these redesigns.

### Status-chip note
Operational = refined green (`#2f7d4f` on `#e8f4ec`) — green is allowed (only red/yellow/white/black banned);
Upcoming = Pale-Brown tint. Form errors use Pale-Brown (not red) to honor the strict palette.

## EXISTING FILES (v1 — being restyled, NOT rebuilt unless noted)
- `index.html` — Fraunces + Inter font links (will adjust if font decision changes).
- `src/sections.css` — **WILL BE REWRITTEN** with new tokens/styles. Scoped under `.sr-site`.
- `src/lib/icons.jsx` — ~50 inline stroke SVGs, `currentColor`. Reusable as-is.
- `src/components/ui/` — Button, SectionHeading, Reveal, Card, StatTile, IndustryTile. Restyle via CSS;
  Button variants may be renamed (drop `--orange` semantics → `--accent` = Pale Brown).
- `src/sections/` — About…Footer + SiteContent index. Copy VERBATIM, restyle markup/classes as needed.
  Section ids: About=#about, Services=#services, CompanyStructure=#company, StrategicVentures=#ventures,
  Contact=#contact.
- `src/overlays/HeroOverlays.jsx`, `GlobeOverlays.jsx` — restyle text only.
- `src/App.jsx` — `QuoteProvider` > skip-link + Navbar + ScrollScene + SiteContent + QuoteModal.

## KEY CONVENTIONS
- Wrap flat content in `.sr-site` (z-index:10, **Floral White** bg, fonts) so it scrolls over the fixed
  3D canvas. Inner container `.sr-wrap` (max 1200px). Section `.sr-section` (+ dark/soft variants).
- Section header: `.sr-section-head` > `.sr-eyebrow` (Pale Brown, tracked) + `h2.sr-h2` + `p.sr-lead`.
- Brand: "Shri Radhey Logistics Pvt Ltd"; email info@shriradheylogistics.co.in;
  phones +91 9359001122 / +91 9140334550; WhatsApp 919359001122.
  Nav: About Us · Services · Company · Ventures · Contact Us.

## 3D HANDOFF MECHANICS (reference — DO NOT CHANGE)
- `ScrollScene` owns mutable `anim` ref (camX/camZ/open/headlight/journey/indiaLock/globeOpacity…),
  scrubbed by GSAP over `.scroll-root` (1500vh), read in useFrame. DO NOT change its shape/timeline.
- Overlays read `anim` in a rAF loop. Stage map: truck SIDE ~0–0.18, FRONT ~0.22–0.30,
  BACK/doors ~0.55–0.72, globe via indiaLock/globeOpacity.
- Remove `markers:true` + `console.log` in ScrollScene before final build.
