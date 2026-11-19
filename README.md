# Athena Aegis Systems — website

Static, multi-page website for **Athena** (AI intelligence) and **Aegis** (defense-in-depth controls). Hosted separately from the private Python agent and future applications. Built with accessible HTML, CSS, and vanilla JavaScript; no runtime build step or front-end credentials.

## Pages

| Path | Purpose |
| --- | --- |
| `index.html` | Homepage, product overview, previews, FAQ, indicative pricing, inquiry |
| `athena.html` | Digital Acropolis: intelligence, evidence and model orchestration |
| `aegis.html` | Spartan Citadel: security principles and a **static** gate illustration |
| `experience.html` | Decorative Athena avatar and optional **prewritten browser** narration |
| `editions.html` | Planned Qwen-first PC and Android application editions |
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

The displayed **$19.99/month** is owner-selected proposed pricing; the site does not run checkout, subscriptions or provisioning. The inquiry form prepares a `mailto:` message in the visitor's own email app. **It does not transmit, store, or guarantee delivery of leads**. Verify recipient and production fulfillment before charging customers.

The Aegis gate example is a fixed demonstration, **not a live security verdict**. Aegis and Athena do not promise complete defense, universal accuracy, or autonomous authorization of financial and production actions.

## Publishing

The `CNAME` file targets `athenaaegissystems.com`; DNS and GitHub Pages settings are managed separately. This repository contains only static public web content. Do not commit keys, private agent source, model weights, customer inquiries or payment secrets here.

Before announcing public release, confirm: working HTTPS/custom domain; browser and mobile layout; all links; voice behavior; contact-email receipt; privacy/terms; license for bundled model weights; installer signing; download integrity; and accessibility.

Website changes do **not** deploy the Windows or Android applications, change DNS, or implement checkout.
