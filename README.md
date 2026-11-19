# Athena Aegis Systems — website

Static, multi-page website for **Athena** (AI intelligence) and **Aegis** (defense-in-depth controls). Hosted separately from the private Python agent and future applications. Built with accessible HTML, CSS, and vanilla JavaScript; no runtime build step or front-end credentials.

## Pages

| Path | Purpose |
| --- | --- |
| `index.html` | Homepage, product overview, previews, FAQ, subscription pricing, inquiry |
| `athena.html` | Digital Acropolis: intelligence, evidence and model orchestration |
| `aegis.html` | Spartan Citadel: security principles and a **static** gate illustration |
| `experience.html` | Decorative Athena avatar and optional **prewritten browser** narration |
| `editions.html` | Planned Qwen-first PC and Android application editions |
| `terminal-preview.html` | Interactive four-way PC/mobile Athena/Aegis terminal concept with static demo tasks |
| `integration.html` | Private Python developer-preview integration guidance |
| `legal.html` | Preview disclosures, limitations and terms |
| `404.html` | Branded not-found fallback |

## Run locally

From this repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`. The site is published from the **repository root**, not a `website/` subfolder.

## Validation

```bash
python -m unittest discover -s tests -v
for file in *.js; do node --check "$file"; done
```

The source checks cover local files, links/anchors, page semantics, social metadata, and artwork. They do **not** replace interactive browser tests, performance measurements, Android device testing, screen-reader review, or actual lead-delivery verification. A GitHub Actions workflow runs these checks on pushes and pull requests.

## Visual language and motion

The opening homepage blue-water Athena / red-fire Aegis artwork remains unchanged. Subsequent realm cards use distinct cybernetic SVG artwork; supporting editorial areas use separate marble Athena and Spartan guardian assets. Images are served from the local `assets/` folder, not third-party photo servers.

World animations are optional, capped and pause when out of view. The motion control remembers a preference locally in the browser, honors OS reduced-motion settings, and does not use tracking. The Athena stage is 2D visual animation, **not** a rigged 3D/lip-synced character or live AI. Browser speech requires a user click and reads one of four fixed scripts; it is not a conversational agent.

## Product and purchase status

The Python framework is a private developer preview. Desktop (planned **Qwen3.8-27B**) and Android (planned **Qwen3.5-4B**) applications are under development. The intention is a **Qwen-first experience** with locally available models and **direct downloads from this website**, subject to model licensing, installer security, bandwidth, device and performance validation. There is **no downloadable product bundle yet**.

The $19.99 monthly subscription opens the owner’s Stripe checkout. Installation access is confirmed personally after purchase. The inquiry form prepares a local email draft that visitors can open in a mail app or copy into webmail.

The Aegis gate example is a fixed demonstration, **not a live security verdict**. Aegis and Athena do not promise complete defense, universal accuracy, or autonomous authorization of financial and production actions.

## Publishing

The `CNAME` file targets `athenaaegissystems.com`; DNS and GitHub Pages settings are managed separately. This repository contains only static public web content. Do not commit keys, private agent source, model weights, customer inquiries or payment secrets here.

Before announcing public release, confirm: working HTTPS/custom domain; browser and mobile layout; all links; voice behavior; contact-email receipt; privacy/terms; license for bundled model weights; installer signing; download integrity; and accessibility.

Website changes do **not** deploy the Windows or Android applications, change DNS, or implement checkout.

## Interactive PC / Android app showcase

The homepage and Editions page contain a four-card Athena PC, Aegis PC, Athena Android, and Aegis Android preview gallery. Links open `terminal-preview.html` with `device` and `mode` URL parameters. The terminal includes a working mode toggle, device switch, workflow examples, responsive desktop and phone frames, keyboard-operable controls, and a local-only prompt demonstration. Scripts do not call a model, track visitor data or claim to perform security scans. The real Qwen-first Windows/Android applications remain separate development projects.

Original cinematic concept renders and cutouts are packaged separately for marketing as a downloadable asset kit. The live website now includes optimized WEBP PC and Android concept art, alternate portraits, short prerecorded voice samples, and lightweight interface overlays. The terminal remains a local-only scripted preview.
**Future true character animation:** produce an approved, rights-cleared
loop or a rigged character with facial/eye/hand gestures and synchronized
mouth shapes. Optimize a short WebM/MP4 loop with a static fallback; never
start audio automatically. Verify device performance on Windows and Android.

## Digital Greece / Digital Sparta visual system (WEB-3)

Two distinct but connected visual worlds now share one product identity.

- **Athena — the Digital Acropolis:** sapphire, ivory and gold; a
  holographic temple skyline, divine marble imagery and orbital light.
- **Aegis — the Spartan Citadel:** obsidian, hematite and bronze;
  fortified ramparts, defensive shield, scanning light and hard geometry.

The scenes are locally committed vector assets in
website/assets/digital-acropolis.svg and website/assets/digital-sparta.svg.
The portrait remains website/assets/athena-goddess.webp. Decorative
animation is CSS-based. The new worlds.js adds reveal effects, motion
pause and a curated Aegis gate example; it does not modify voice.
The gate is a fixed illustration, NOT a live Python security scan.

Buyer path: homepage → Athena or Aegis → integration / editions → inquiry.
The form is a mail-app handoff configured in app.js, not a real CRM
submission. Check recipient delivery before any public launch.

Static CI tests local links, asset presence, HTML semantics, accessibility
markers and product disclaimers; Node checks script syntax. Real browsers,
screen readers, motion performance, payment/contact delivery and user
testing are separate release checks, not certified by CI.

The owner controls athenaaegissystems.com and Muse manages DNS.
Do not modify DNS, public deployment, Stripe billing or Muse-owned audio
from this design branch. Hosting should isolate the static site from the
private Python repo and all credentials.


## Blue Digital Water / Red Digital Fire — earlier visual iteration

The website uses the owner's **last two approved high-resolution images**:

- `website/assets/athena-water.webp` — Athena with sapphire digital water,
  a luminous owl, and the Acropolis.
- `website/assets/aegis-fire.webp` — Aegis as a bronze-armored Spartan
  guardian with dark red digital fire, spear and shield.

Both are 1122 × 1402 WebP images, approximately 325–356 KB. These were introduced during the first water/fire redesign, before the
owner selected the two canonical homepage images and later requested varied
character artwork. They remain available for distinct dedicated pages. No CSS blur is applied to character
pixels and image scales are kept restrained for sharpness.

`website/living-realms.css` gives the two realms separate identities:
cool water glows and liquid ambience versus dark-crimson ember energy.
`website/living-realms.js` draws transparent currents and embers on
a canvas overlay with no network calls. It caps its drawing to around
30fps on desktop or 19fps on mobile, limits pixel density and particle
count, stops when out of view, and obeys reduced-motion and the existing
pause button. All character images remain visible if JavaScript is off.
The original Acropolis and Citadel SVGs still support architectural
backdrops. Muse's voice/AI audio code is unchanged.

**Important distinction:** these are high-resolution cinematic artworks
enhanced by interactive *2D* environmental motion. They are not
photorealistic video, skeletal 3D avatars, or lip-synced AI characters.
For truly lifelike facial animation, a separately licensed video or
rigged-character pipeline still needs to be integrated and tested.

Run the website tests and syntax checks in GitHub Actions. Real mobile
GPU/battery behavior, browser visual quality and screen-reader review
remain separate pre-launch checks. Public DNS, payment and app deployment
are intentionally outside this visual change.

## Official matched character images — canonical owner uploads (WEB-CANON-1)

The **final approved characters** are the two images the owner uploaded
on 2026-11-19: **Athena in luminous blue digital water with her owl** and
**Aegis in dark-red digital fire with the bronze shield and spear**.
These are the exact uploaded file bytes, not another AI-generated version,
the previous low-resolution AVIF, or a substitute image.

- `assets/athena-canon.jpg` — 1229 × 1536, 635,508 bytes
- `assets/aegis-canon.jpg` — 1229 × 1536, 669,696 bytes
- `assets/athena-aegis-share-card.webp` — 1200 × 630 brand preview
  constructed from those exact portraits for social link sharing.

Although the original uploads were named `.png`, their underlying
encoding is JPEG; serving under `.jpg` maintains byte identity and the
proper browser MIME type. Regression tests pin SHA-256 checksums so
future edits cannot silently replace the approved faces.

The homepage **opening split hero** retains these two exact canonical images.
Later cards and pages deliberately use **different** illustrations, preserving
the owner-approved first impression without repeating the same character
portrait throughout the experience. `canonical-worlds.css`
layers blue liquid glows, warm fire currents, a slower architectural
backdrop, and glowing aura without blurring or upscaling portrait pixels.
The existing transparent `living-realms.js` canvas adds animated
water ripples and drifting ember trails.

**Motion / performance:** existing site pause buttons and
`prefers-reduced-motion` disable ambient animation; artwork remains
readable without JavaScript. Real browser screenshot testing and
mobile GPU/thermal checks are still required before public launch.
The images are beautiful *still character illustrations* over animated
environments, not full motion-capture, lip-synced, or 3D avatars.

**Non-overlap with other agents:** Muse's voice/TTS code,
production Aegis security, DNS, and billing are unchanged. The preview
inquiry remains a mail-app handoff; confirm production deployment
separately. The older `athena-water.webp` and `aegis-fire.webp` images now serve as
unique standalone page hero art; `aegis-spartan-guardian.avif` remains a
legacy asset and is not presented.

## Different character image at each appearance (WEB-ART-VARIETY-1)

**Preserve first fold:** The initial homepage split hero remains the
owner-selected, unchanged athena-canon.jpg and aegis-canon.jpg. Neither
is replaced, reprocessed, or reused as a later character illustration.
The paired share card still uses the original canonical character images.

**Distinct images by placement** (one source image per visible portrait):

| Placement | Athena | Aegis |
| --- | --- | --- |
| Homepage opening (unchanged) | athena-canon.jpg | aegis-canon.jpg |
| Homepage realm cards, first scroll | athena-android-oracle.jpg | aegis-android-sentinel.jpg |
| Homepage editorial / philosophy | athena-marble-wisdom.jpg | aegis-spartan-patrol.jpg |
| Standalone Athena and Aegis page heroes | athena-water.webp | aegis-fire.webp |
| Athena character voice experience | athena-holographic-book.webp | — |
| Editions / applications | athena-throne-intelligence.webp | — |

The four image assets from the recent user uploads are the robotic
Athena and Aegis pair, marble Athena and a traditional Spartan guardian.
Despite three .png upload filenames, all four carry JPEG image data and
are stored with the browser-correct .jpg extension without re-encoding.
The extra Holographic Book and Throne scenes are distinct high-resolution
earlier Athena illustrations encoded as WebP for quick page loading.
All images are committed locally; no external image endpoints are needed.

Athena retains blue liquid light and gold Greek architectural themes;
Aegis retains Spartan forms, bronze, and crimson fire. Character image
URLs in nonhero CSS were replaced with architecture and gradients,
avoiding accidental duplicate portraits layered under foreground images.
Existing ambient 2D motion, reduced-motion options, and pause controls
remain; portraits themselves are still illustrations (no lip sync).

Website tests verify distinct image references across home, dedicated
pages, voice experience and editions, SHA-256 integrity of the four
owner uploads, and unchanged canonical opening hero files.

Muse's narration/TTS implementation was not edited. Public deployment,
Windows and Android installers, security rules and DNS are outside this
artwork-focused change.

## November 19 QA review

The four-way interactive terminal preview is illustrative only. Its local, scripted responses do not provide real model inference, input filtering, approval enforcement, account provisioning or security verdicts. The live subscription checkout is linked from the homepage. Desktop and Android release availability is documented on the Editions page.

GitHub Actions now saves a one-day source snapshot for browser QA in addition to checking markup/assets and JavaScript syntax. Full-device and screen-reader acceptance tests remain separate publication gates.
