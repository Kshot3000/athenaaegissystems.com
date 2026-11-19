# Athena commercial website

Static multi-page commercial website under \`website/\`, built with HTML, CSS, and vanilla JavaScript. No build dependencies or backend service are required.

## Pages

- \`index.html\` — framework value proposition, Aegis, use cases, pricing hypotheses, and pilot inquiry.
- \`experience.html\` — animated digital statue; optional text-to-speech narration of four **pre-written** product scripts. Not a live AI chat.
- \`editions.html\` — in-development desktop and Android product plans: Athena+Aegis with Qwen3.8-27B for PC and Qwen3.5-4B for Android.
- \`integration.html\` — developer-preview Python setup, tests, and provider environment variables.
- \`legal.html\` — plain-language private-preview, privacy and pricing disclosures.

## Preview locally

From the repository root:

\`\`\`bash
python -m http.server 8000 --directory website
\`\`\`

Visit \`http://localhost:8000\` and open \`experience.html\` or \`editions.html\` from the homepage.

## Test

\`\`\`bash
python -m unittest discover -s tests -v
node --check website/app.js
node --check website/experience.js
node --check website/worlds.js
\`\`\`

Automated checks cover local asset/link integrity, headings, basic navigation markup, transcript availability, no microphone access, reduced-motion CSS, model labeling, and existing agent functionality. **They are not** automated cross-browser, Android WebView, screen-reader, Lighthouse, WCAG certification, or sales/lead-delivery tests. Verify on actual devices before publishing.

## Voice and motion

The Athena portrait is an existing generated visual asset enhanced with lightweight parallax, rotating interface rings, and breathing/glow motion. It does **not** perform physically accurate facial animation or lip sync. Site motion is decorative and can be paused; visitors with reduced-motion preferences get a static stage. Avoid auto-playing audio or animation that cannot be paused.

Narration uses the visitor's browser \`speechSynthesis\` implementation only after a click. Available voices and whether the device's speech service operates online vary by browser/OS. There is no microphone capture, no backend streaming, and no connection to Athena's model API. The topic scripts are static product education. If browser speech is unavailable, the transcript remains visible and controls are disabled.

## Customer conversion

The current form is a \`mailto:\` handoff, **not** a stored/sent CRM submission. It requires a configured email app and does not guarantee delivery. Before a public paid launch: owner-approve contact email, verify receipt, adopt terms, and implement a secure lead endpoint and payment/provisioning flow if desired.

The owner selected **$19.99/month** for Athena + Aegis, but this static site does not have self-service checkout or automatic license provisioning. Verify payment and fulfillment before accepting orders. The private Python framework remains an approved pilot. Neither standalone app, public Google Play listing, nor installer is currently delivered from the website.

## Publishing and security

Do not deploy the private-source website publicly without the owner's explicit approval. Use a separate public static site repository or supported hosting only after verifying image rights, accessibility, privacy notices, and contact workflow. Never put secrets in website source code or front-end configuration.

## Image attribution

Athena visual is an original generated asset created for this project, committed as \`website/assets/athena-goddess.webp\`. The newer cinematic 16:9 illustration prepared in ChatGPT can be integrated later through a proper artwork commit; no external stock-photo dependency is used in the experience.

## Athena visual-presence layer (AVATAR-VISUAL-1)

`experience.html` now loads `avatar-stage.css` and `avatar-stage.js` as a
**purely visual** extension. It adds layered gold/blue glows, orbit/sigil
lighting, a deterministic constellation canvas, and pointer-aware lighting.
The art is still a 2D image: this is a higher-quality *visual presentation*,
not a rigged 3D face, viseme-driven lip-sync, photorealistic motion capture,
or a real-time talking avatar. The atmosphere runs at approximately 30fps,
uses at most 58 particles, pauses when offscreen/hidden, honors
reduced-motion settings, and can be stopped by the existing motion button.
The portrait remains visible if JavaScript or canvas support is absent.

**Voice ownership:** Muse owns future voice recording, TTS, and voice
integration. This visual extension neither imports nor changes the existing
speech engine (`experience.js`). If Muse introduces a richer audio service,
keep audio separate from the visual engine, require explicit user activation,
and leave captions/transcripts accessible.

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


## Blue Digital Water / Red Digital Fire — selected paired character art

The website uses the owner's **last two approved high-resolution images**:

- `website/assets/athena-water.webp` — Athena with sapphire digital water,
  a luminous owl, and the Acropolis.
- `website/assets/aegis-fire.webp` — Aegis as a bronze-armored Spartan
  guardian with dark red digital fire, spear and shield.

Both are 1122 × 1402 WebP images, approximately 325–356 KB. These replace
the small 480 × 600 Aegis image in every prominent hero and homepage
appearance, and they replace the previous Athena portrait in the main
showcase and voice-preview scene. No CSS blur is applied to character
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
