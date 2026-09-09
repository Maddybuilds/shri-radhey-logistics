# PROJECT HANDOUT — Shri Radhey Logistics Website

> **Read this first.** This file is the single source of truth for anyone (human or AI agent)
> picking up this project. It records what exists, what must NOT be touched, what the next job
> is, and where every piece of source material lives. Last updated: **2026-06-08**.

---

## 0. TL;DR FOR A NEW AGENT

- This is a **Vite + React + Three.js (R3F)** single-page website for **Shri Radhey Logistics Pvt Ltd**, a 15+ year Indian logistics firm.
- The **top of the page is a finished, scroll-driven 3D experience** (animated truck → zoom out → globe → India city tour). **DO NOT REDESIGN OR REFACTOR THE 3D CODE.** Treat it as a black box labeled `[3D TRUCK HERO — EXISTING]` and `[3D INDIA GLOBE — EXISTING]`.
- The **current job is to DESIGN (not build yet) the content sections that go BELOW the 3D experience** — About through Footer — to a premium, enterprise-grade standard.
- **All website copy is final and must be used VERBATIM.** Source: `C:\Users\mishr\Downloads\shri-radhey-FINAL-copy.md`. Do not invent or reword copy.
- **Stitch MCP was set up then ABANDONED.** The user decided to use Claude to design directly instead of Stitch. See §6. The `.mcp.json`/`.env` files still exist but are unused for design.
- Current instruction status: **"just design, don't build the web right now."** Produce the design first; do not start writing the new section components until told.

---

## 1. WHAT THIS PROJECT IS

| | |
|---|---|
| **Company** | Shri Radhey Logistics Pvt Ltd |
| **Type** | B2B logistics / transportation / supply-chain firm, 15+ years, India |
| **Domain** | shriradheylogistics.co.in |
| **Site type** | Single-page scrolling website (one cohesive flowing page, top to bottom) |
| **Working dir** | `C:\shri radhey logistics` |
| **Git** | NOT a git repo yet (no `.git`). `.gitignore` exists and is ready. |

---

## 2. TECH STACK (from package.json)

- **Build tool:** Vite `^5.4.11`
- **Framework:** React `^18.3.1` + ReactDOM, `@vitejs/plugin-react`
- **3D:** `three` `^0.169.0`, `@react-three/fiber` `^8.17.10`, `@react-three/drei` `^9.114.0`
- **Animation:** `gsap` `^3.15.0` (uses the `ScrollTrigger` plugin)
- **Scripts:** `npm run dev` (Vite dev server), `npm run build`, `npm run preview`
- Entry: `index.html` → `src/main.jsx` → `<App/>` → `<ScrollScene/>`

---

## 3. CURRENT STATE — THE EXISTING 3D EXPERIENCE (⚠️ DO NOT REDESIGN)

The **entire app right now is a scroll-driven 3D scene.** `App.jsx` renders only `<ScrollScene/>`.
Scroll position (via GSAP ScrollTrigger over a `1500vh` tall track) scrubs a master timeline through
**10 stages**:

1. **Stages 1–5 (scroll 0–40%): Truck hero.** A Draco-compressed truck GLB (`/models/truck.glb`)
   with custom-built cargo stack, trailer interior, cab shell + interior, headlights, exhaust
   smoke particles, rolling wheels, door-open animation, and a departure roll-away.
2. **Stage 6 (40–50%):** Camera lifts to bird's-eye, truck fades out, background navy → space black.
3. **Stage 7 (50–60%):** Textured Earth globe materializes.
4. **Stage 8 (60–75%):** Camera zooms/locks onto North India; glowing India outline + city markers appear.
5. **Stages 9–10 (75–100%):** A follow-cam "tour" — a shrunken truck drives the surface trail
   **Lucknow → Noida → Delhi → Amritsar**, with DOM city-name captions fading in at each stop.

### Files that make up the 3D experience — **treat as off-limits for the redesign**
- `src/App.jsx` — root; renders `<ScrollScene/>`.
- `src/components/ScrollScene.jsx` — the GSAP scroll timeline, the persistent R3F `<Canvas>`, lighting, the `Rig` (scroll-owned camera), and `CityCaptions` DOM overlay. **This is where new content sections will eventually be integrated below the canvas** (see §7 integration note).
- `src/TruckViewer.jsx` — all truck geometry/animation (cargo, interiors, cab, headlights, smoke, wheels, fade). Heavily tuned imperatively against the GLB's named nodes.
- `src/components/GlobeScene.jsx` — Earth, India outline, city markers, dotted tour trail, follow-camera math. Exports `CITIES` and `captionAlpha`.
- `src/index.css` — global styles + scroll-scene/caption/overlay CSS. `body` bg is `#0a1a3a`; `.scroll-root` is `1500vh`; `.canvas-wrap` is `position: fixed`.
- `src/main.jsx`, `index.html` — entry points.

### Assets
- `public/models/truck.glb` — the truck model (Draco-compressed; decoder loaded from gstatic CDN).
- `dist/models/truck.glb` — build output copy.
- Globe earth texture is loaded from `/textures/earth_daymap.jpg` with a three.js-CDN fallback (note: the local texture path is referenced but may not be present in `public/textures/`).

### Shared animation contract
`ScrollScene` owns a single mutable `anim` ref object (camera pos, `open`, `headlight`, `truckZ`,
`globeOpacity`, `journey`, follow-cam fields, etc.). It is mutated in place by GSAP and read in
`useFrame` by `TruckViewer`/`GlobeScene` — **never** triggers React re-renders. Don't change its shape.

> 🔴 **RULE:** The hero + globe zones map to the two design placeholders. In any design or build,
> represent them as `[3D TRUCK HERO — EXISTING]` and `[3D INDIA GLOBE — EXISTING]` placeholder
> blocks. The new content sections flow **after** these.

---

## 4. THE DESIGN TASK (what to produce next)

Design a **premium, high-fidelity, single-page B2B logistics website**, desktop-first **plus a
mobile-responsive version of each section.** Design only — **do not build the web app yet** until
the user approves the design.

### 4.1 Brand & visual direction
- **Tone:** premium, trustworthy, enterprise-grade, established & credible — NOT a flashy startup. Think Maersk / DHL / Blue Dart maturity, but warmer and more modern.
- **Palette:**
  - Primary deep navy: **`#16264a`**
  - Accent warm orange (CTAs/highlights, the single accent): **`#f5821f`** (or similar)
  - Surfaces: clean greys, white / very-light-grey section backgrounds, navy text.
- **Feel:** clean grid, soft shadows, medium rounded corners, subtle depth. Smooth, calm, expensive. Lots of white space (premium = breathing room, not clutter).
- **Context:** serves FMCG, pharma, heavy equipment, government ration distribution. Must feel solid and dependable.

### 4.2 Typography (FONT UPGRADE — make it feel rich/editorial)
- **Headings:** a high-end font with character — try **Clash Display**, **Satoshi**, **General Sans**, or **Fraunces** (editorial/luxury). Fallback: **Montserrat** bold with *tighter letter-spacing* and *larger sizes*.
- **Body:** clean premium sans — **Inter**, **Satoshi**, or **General Sans**.
- **Optional accent serif** (**Fraunces** / **Canela**) for big pull-quotes or the Vision statement, for a touch of class.
- Make headings **BIG and confident.** Use strong **weight contrast** (very bold headings vs light body) for the expensive editorial look.
- Add **generous letter-spacing on small-caps eyebrows/labels** (e.g. "GET IN TOUCH").
- (Note: current 3D experience uses `system-ui`; the new sections should introduce the upgraded font system.)

### 4.3 Reusable components to define
- Buttons: **primary (orange)** and **secondary (outline)**.
- Cards, stat tiles, industry tiles, the quote form.
- A consistent spacing system; navy/grey/orange palette applied throughout.

---

## 5. SECTIONS & FINAL COPY

> **COPY IS FINAL. USE VERBATIM.** Full text lives in `C:\Users\mishr\Downloads\shri-radhey-FINAL-copy.md`.
> Below is the authoritative section list **as it appears in that file** (this is the order/content to design to).
> Where the original verbal brief and the final-copy doc differ, **the final-copy doc wins.**

**Brand basics:** Name "Shri Radhey Logistics Pvt Ltd"; "SR" monogram + wordmark logo;
email info@shriradheylogistics.co.in; phones +91 9359001122 / +91 9140334550;
nav = About Us · Services · Company · Ventures · Contact Us.

Sections in the final copy doc, in order:
1. **HERO** → maps to `[3D TRUCK HERO — EXISTING]`. (H1, subhead, CTAs "Get Quote Now / Learn More", stat row.) *Design as placeholder only.*
2. **ABOUT** — H2 "About Shri Radhey Logistics", tagline, "Our Journey" body, "15+ Years of Excellence" badge, 3 foundation cards (3 Established Companies / ₹20L Strong Capital Base / ∞ Commitment to Excellence).
3. **VISION** — centered "Our Vision" statement + supporting body. *(Good candidate for the accent serif pull-quote.)*
4. **CORE VALUES** — 4 cards: Excellence, Reliability, Trust, Innovation (icon + title + one-liner).
5. **GROWTH STRATEGY** — 4 points (Geographic Expansion, Technology Integration, Service Diversification, Strategic Partnerships) + "Future Milestones" timeline (2026 Pan-India Coverage, 2027 International Operations).
6. **COMPANY STRUCTURE** — stat row (2 Directors / 20+ Staff / 1 Base Office / 2 Branch Offices); office locations (Lucknow base–operational, Noida–operational, Ludhiana–upcoming); "Strong Financial Foundation" block (₹20L initial capital headline). *(This section is in the final copy but was NOT in the original verbal brief — include it.)*
7. **OUR SERVICES** — 4 cards (Full Truck Load, Part Truck Load, Pan-India Network, Industry Expertise) + "Fleet & Partnerships" highlight block w/ bullets incl. Heavy Equipment Transport.
8. **INDUSTRIES & SPECIALIZED SERVICES** — 8 icon tiles (FMCG Products, Food Products, Ration Distribution, Heavy Equipment, ATM Services, Plant Shifting, Infrastructure, Manufacturing) + "Specialized Heavy Equipment Services" feature strip.
9. **CORE OFFERINGS** — 3 columns (End-to-End Supply Chain / Technology and Innovation / Service Capabilities), each a capability list.
10. **COST REDUCTION vs REVENUE ENHANCEMENT** — two-column comparison, 3 grouped lists each side. Suggest left navy / right orange-tinted, visually balanced.
11. **INDUSTRIES WE SERVE** — 7 industries w/ small icons (Pharmaceuticals & Wellness, FMCG, Apparels & Footwear, Electronics & Electricals, Retail Outlets, E-commerce, Auto & Engineering).
12. **STRATEGIC VENTURES & ASSOCIATIONS** — Ashok Leyland (active partnership), NAFED Ration Distribution, Corporate Associations (ICDS, Gati, Caper India), Biscuit sector (Priya Gold, Bonbon — 7 yrs) + 4-item "Track Record" summary row.
13. **CONTACT** — eyebrow "GET IN TOUCH", H2 "Let's Start a Conversation". Left: "Request a Quote" form (Full Name*, Company, Email*, Phone*, Service dropdown, Message*). Right: contact details (Head Office Lucknow, phones, email, business hours), locations (Noida operational / Ludhiana coming soon), 24/7 assistance CTA.
14. **FOOTER** — company name, contact info, locations (Lucknow HQ · Noida · Ludhiana upcoming), business hours, nav links.

### ⚠️ Known reconciliation notes (read before designing)
- The **original verbal brief had 12 design sections** and did NOT include a "Company Structure" section; the **final copy has it as section 6.** Follow the final copy (include Company Structure).
- The final-copy doc's footer at the bottom lists **"Fixes applied"** — name standardized to "Shri Radhey" (not "Shree Radhe"); branches = 1 base + 2 branches (Noida operational, Ludhiana upcoming); "7 years in the biscuit sector"; stale 2025 milestone removed; staff "20+". Respect these — don't reintroduce the old wording.
- Globe tour cities (Lucknow/Noida/Delhi/Amritsar) are a **3D-scene artistic choice** and differ from the business office list (Lucknow/Noida/Ludhiana). Don't "fix" the 3D scene to match.

---

## 6. STITCH MCP — SET UP THEN ABANDONED

The user originally wanted to export a Stitch design via MCP. We set up the connection, then the
user said **"ditch the stitch, use Claude to design instead."** So **Stitch is no longer part of the
workflow.** Design is being done directly with Claude.

Files created during that setup (still on disk, currently unused for design):
- `.mcp.json` — defines an `http` MCP server `stitch` → `${STITCH_MCP_URL}`, header `X-Goog-Api-Key: ${STITCH_API_KEY}`. No secrets inside (uses env-var expansion).
- `.env` — holds `STITCH_MCP_URL=https://stitch.googleapis.com/mcp` and `STITCH_API_KEY=...`. **Gitignored.** ⚠️ The key was pasted into chat once — **rotate it** in Google Cloud if security matters.
- `.env.example` — committable template.
- `.gitignore` — updated to ignore `.env`, `.env.*` (except `.env.example`), `*.key`, `*.pem`, plus the original `node_modules`, `dist`, `*.local`, `.vite`.

**If you don't need Stitch:** these files can be deleted, or left dormant. They do not affect the
Vite app build. Note Claude Code only reads `${VAR}` from the environment at startup (it does not
auto-load `.env`), and the `stitch` server was never confirmed connected.

---

## 7. INTEGRATION NOTES (for when build is approved — NOT YET)

When the design is approved and it's time to build the new sections:
- The new content lives **below** the 3D scroll experience. Today `ScrollScene` is the whole page and
  its `.canvas-wrap` is `position: fixed` over a `1500vh` `.scroll-root`. The new sections should
  begin **after** the scroll track ends (i.e., after the `.scroll-root` block, in normal document
  flow), so they scroll up over / after the fixed canvas finishes its timeline. Decide on the
  hand-off (e.g., a sentinel spacer, or moving the canvas to only cover the hero range) carefully —
  **do not break the existing ScrollTrigger math (`start: 'top top'`, `end: 'bottom bottom'`).**
- Keep the new section styling in a **separate CSS file/module** (e.g. `src/sections.css` or
  CSS modules) so you don't disturb `index.css`'s scene styles.
- Build the new sections as **self-contained React components** (e.g. `src/sections/About.jsx`, etc.)
  rendered after `<ScrollScene/>` in `App.jsx`. Do not modify `TruckViewer.jsx` or `GlobeScene.jsx`.
- Introduce the upgraded font system (§4.2) via `index.html` `<link>` or a CSS `@import` /
  self-hosted fonts, scoped so it doesn't change the 3D caption styling unless intended.
- `ScrollScene.jsx` currently has `markers: true` on ScrollTrigger and `console.log` scroll
  debugging — these are dev aids; remember to disable before any production build.

---

## 8. OPEN ITEMS / DECISIONS PENDING

- [ ] Confirm whether to **delete the Stitch MCP files** (`.mcp.json`, `.env`, `.env.example`) now that Stitch is dropped.
- [ ] **Rotate the Stitch API key** (it was exposed in chat).
- [ ] Produce the **design** for sections 2–14 (per §4–§5) — desktop + mobile. (Current active task; "design, don't build.")
- [ ] Choose final heading/body fonts from §4.2 options.
- [ ] Later: `git init` if version control is wanted (`.gitignore` already prepared).
- [ ] Later: build + integrate sections per §7 once design is approved.

---

## 9. SOURCE-OF-TRUTH FILE MAP

| What | Where |
|---|---|
| **Final website copy (VERBATIM)** | `C:\Users\mishr\Downloads\shri-radhey-FINAL-copy.md` |
| This handout | `C:\shri radhey logistics\handout.md` |
| 3D scroll system | `src/components/ScrollScene.jsx`, `src/TruckViewer.jsx`, `src/components/GlobeScene.jsx` |
| Global/scene CSS | `src/index.css` |
| Truck model | `public/models/truck.glb` |
| MCP config (dormant) | `.mcp.json`, `.env`, `.env.example` |
| Claude Code local settings | `.claude/settings.local.json` |
