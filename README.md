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
\`\`\`

Automated checks cover local asset/link integrity, headings, basic navigation markup, transcript availability, no microphone access, reduced-motion CSS, model labeling, and existing agent functionality. **They are not** automated cross-browser, Android WebView, screen-reader, Lighthouse, WCAG certification, or sales/lead-delivery tests. Verify on actual devices before publishing.

## Voice and motion

The Athena portrait is an existing generated visual asset enhanced with lightweight parallax, rotating interface rings, and breathing/glow motion. It does **not** perform physically accurate facial animation or lip sync. Site motion is decorative and can be paused; visitors with reduced-motion preferences get a static stage. Avoid auto-playing audio or animation that cannot be paused.

Narration uses the visitor's browser \`speechSynthesis\` implementation only after a click. Available voices and whether the device's speech service operates online vary by browser/OS. There is no microphone capture, no backend streaming, and no connection to Athena's model API. The topic scripts are static product education. If browser speech is unavailable, the transcript remains visible and controls are disabled.

## Customer conversion

The current form is a \`mailto:\` handoff, **not** a stored/sent CRM submission. It requires a configured email app and does not guarantee delivery. Before a public paid launch: owner-approve contact email, verify receipt, adopt terms, and implement a secure lead endpoint and payment/provisioning flow if desired.

Published numbers are **price hypotheses**, not checkout offers; the private Python framework remains an approved pilot. Neither standalone app, public Google Play listing, nor installer is currently delivered from the website.

## Publishing and security

Do not deploy the private-source website publicly without the owner's explicit approval. Use a separate public static site repository or supported hosting only after verifying image rights, accessibility, privacy notices, and contact workflow. Never put secrets in website source code or front-end configuration.

## Image attribution

Athena visual is an original generated asset created for this project, committed as \`website/assets/athena-goddess.webp\`. The newer cinematic 16:9 illustration prepared in ChatGPT can be integrated later through a proper artwork commit; no external stock-photo dependency is used in the experience.
