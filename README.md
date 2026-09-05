# Cap CAPTCHA Theme Studio 🎨

An open-source, non-invasive customization layer and compilation extension for [Cap CAPTCHA (`tiagozip/cap`)](https://github.com/tiagozip/cap). Specially designed to support baked-in styles and user-defined state labels inside self-hosted environments.

---

## ⚡ The Authentik Problem & Our Solution

### The Problem
When configuring a CAPTCHA Stage in **Authentik**, the platform programmatically loads your external script and renders the `<cap-widget>` custom element dynamically on registration or login screens. 
Because of this programmatic rendering and **Shadow DOM encapsulation**, standard external CSS customizers or global styles fail to penetrate or style the captcha widget.

### The Solution: Baked-In Assets
This patch introduces a **Container-Level Recompilation Engine** that surgically merges your styling variables and custom labels directly into the static `/usr/src/app/assets/widget.js` script bundle inside the Docker container at runtime. 
- **Zero-CSS Integration**: The theme and state labels are already baked inside the Shadow DOM's internal stylesheet. The widget displays with your custom branding with **absolutely zero custom styles or HTML templates needed in Authentik!**
- **Dynamic On-The-Fly Customization**: Includes a rich, interactive visual customizer injected straight into the upstream Cap Dashboard.

---

## ✨ Features

- **🎨 Dynamic Theme Wizard**: Integrated seamlessly into the Cap dashboard with a clean **4-Tab Navigation System** (**Colors & Layout**, **Checkbox & Spinner**, **i18n Labels**, **ARIA / Accessibility**).
- **🌈 50 Premium Theme Presets**: From Catppuccin and Solarized to Kanagawa, Dracula, Gruvbox, Tokyo Night, Everforest, and Cyberpunk.
- **🎨 18 Configurable CSS Custom Properties**:
  - `--cap-background` (Background color)
  - `--cap-color` (Text / foreground color)
  - `--cap-border-color` (Widget border color)
  - `--cap-focus-ring` (Focus ring outline color)
  - `--cap-border-radius` (Corner radius: 0px – 28px)
  - `--cap-widget-width` (Widget width: 180px – 420px)
  - `--cap-widget-height` (Widget height: 30px – 80px)
  - `--cap-widget-padding` (Widget padding: 0px – 30px)
  - `--cap-gap` (Gap between checkbox & label: 0px – 30px)
  - `--cap-font` (Font family stack)
  - `--cap-checkbox-size` (Checkbox box size: 16px – 36px)
  - `--cap-checkbox-border-radius` (Checkbox corner radius: 0px – 16px)
  - `--cap-checkbox-margin` (Checkbox outer margin: 0px – 12px)
  - `--cap-checkbox-border` (Checkbox border style)
  - `--cap-checkbox-background` (Checkbox unchecked background)
  - `--cap-spinner-color` (Spinner active bar color)
  - `--cap-spinner-background-color` (Spinner track color)
  - `--cap-spinner-thickness` (Spinner stroke thickness: 1px – 10px)
- **📝 11 Custom i18n & ARIA Attributes**:
  - `data-cap-i18n-initial-state` (Initial idle text label)
  - `data-cap-i18n-verifying-label` (PoW solving in-progress label)
  - `data-cap-i18n-solved-label` (Verification success label)
  - `data-cap-i18n-error-label` (Verification error label)
  - `data-cap-i18n-troubleshooting-label` (Troubleshooting link text)
  - `data-cap-i18n-wasm-disabled` (WASM disabled warning label)
  - `data-cap-i18n-required-label` (Form validation required notice)
  - `data-cap-i18n-verify-aria-label` (ARIA button description)
  - `data-cap-i18n-verifying-aria-label` (ARIA verifying announcement)
  - `data-cap-i18n-verified-aria-label` (ARIA success announcement)
  - `data-cap-i18n-error-aria-label` (ARIA error announcement)
- **⚙️ Elysia Server-Side Recompilation Engine**: A custom `/recompile-widget` route executes real-time template replacement and instant asset compilation inside the running container.

---

## 🎨 50 Included Theme Presets

1. **Default Light** — Clean and crisp standard light styling.
2. **Classic Dark** — Refined midnight palette.
3. **Warm Amber** — Cozy sepia and honey tones.
4. **Emerald Forest** — Botanical green highlights.
5. **Cyberpunk Neon** — High-energy stark magenta and cyan.
6. **Stealth Slate** — Low-profile slate grey and blue.
7. **Midnight Amethyst** — Deep luxurious cosmic purple.
8. **Dracula Dark** — The classic programmer's dark palette.
9. **Nordic Frost** — Polar light grey with sharp icy-blue highlights.
10. **Synthwave Outrun** — 80s grid aesthetic with vibrant rose accents.
11. **Solarized Light** — Eye-friendly paper-colored vintage contrast.
12. **Solarized Dark** — Deep teal-slate Solarized dark theme.
13. **Gruvbox Dark** — Warm retro-terminal palette.
14. **Gruvbox Light** — Creamy parchment retro terminal contrast.
15. **Retro Console** — Monochrome green-phosphor console styling.
16. **Oceanic Deep** — Submarine deep dark blue and aquamarine.
17. **Rose Pine** — Desaturated earthy rose and pine needles.
18. **Rose Pine Dawn** — Warm muted blush and pastel dawn tones.
19. **Rose Pine Moon** — Deep indigo night atmosphere.
20. **Minimal Stark** — High-contrast black and white borders.
21. **Coffee Grind** — Deep roasted espresso and cream accents.
22. **Royal Velvet** — Regal navy canvas with rich gold outlines.
23. **Tokyo Night** — Slick neon blue and dark slate shadows.
24. **Crimson Rust** — Industrial brick-red elements.
25. **Catppuccin Mocha** — Deep soothing pastel dark.
26. **Catppuccin Latte** — Soothing light pastel canvas.
27. **Catppuccin Macchiato** — Warm dark pastel grey.
28. **Catppuccin Frappé** — Soft dark pastel grey.
29. **Monokai Pro** — Vibrant yellow, cyan, and charcoal.
30. **One Dark Pro** — Iconic Atom dark editor theme.
31. **Nordic Night** — Dark arctic ice and slate.
32. **Kanagawa Dragon** — Dark Japanese ink & gold theme.
33. **Kanagawa Wave** — Classic Kanagawa ocean blue and parchment.
34. **Everforest Dark** — Comfortable green forest dark palette.
35. **Everforest Light** — Soft warm natural green light theme.
36. **Material Ocean** — Deep ocean cyan & navy.
37. **Night Owl** — Deep navy blue designed for night coding.
38. **Palenight** — Soothing purple-grey dark palette.
39. **Cobalt 2** — High-contrast blue and bright yellow.
40. **Andromeda** — Deep space dark with vivid green highlights.
41. **Shades of Purple** — Bold purple background with yellow controls.
42. **Horizon Dark** — Warm sunset orange & deep indigo.
43. **Cybernetic Gold** — Dark metallic gold & obsidian.
44. **Midnight Emerald** — Dark jewel green & mint accents.
45. **Matcha Latte** — Soothing matcha tea light theme.
46. **Sunset Glow** — Deep plum & sunset orange glow.
47. **Matrix Cyber** — Minimalist matrix green on black.
48. **Lavender Mist** — Soft pastel purple & lavender.
49. **Oxford Navy** — Classic academic navy & ice blue.
50. **Cherry Blossom** — Soft pink & magenta blossom theme.

---

## 📋 Full HTML Widget Snippet Reference

```html
<script src="https://<your-instance>/assets/widget.js"></script>
<cap-widget 
  data-cap-api-endpoint="https://<your-instance>/<site-key>/"
  data-cap-i18n-initial-state="Verify you're human"
  data-cap-i18n-verifying-label="Verifying..."
  data-cap-i18n-solved-label="You're human"
  data-cap-i18n-error-label="Error"
  data-cap-i18n-troubleshooting-label="Troubleshooting"
  data-cap-i18n-wasm-disabled="Enable WASM for significantly faster solving"
  data-cap-i18n-required-label="Please verify you're human"
  data-cap-i18n-verify-aria-label="Click to verify you're a human"
  data-cap-i18n-verifying-aria-label="Verifying, please wait"
  data-cap-i18n-verified-aria-label="Verified"
  data-cap-i18n-error-aria-label="An error occurred, please try again"
  style="--cap-background: #fdfdfd; --cap-color: #212121; --cap-border-color: #dddddd8f; --cap-border-radius: 14px; --cap-widget-width: 230px; --cap-widget-height: 30px; --cap-widget-padding: 14px; --cap-gap: 15px; --cap-font: system-ui, -apple-system, sans-serif; --cap-checkbox-size: 25px; --cap-checkbox-border: 1px solid #aaaaaad1; --cap-checkbox-border-radius: 6px; --cap-checkbox-background: #fafafa91; --cap-checkbox-margin: 2px; --cap-spinner-color: #000; --cap-spinner-background-color: #eee; --cap-spinner-thickness: 5px;"
></cap-widget>
```

---

## 🛠️ Authentik Captcha Stage Setup Guide

In your **Authentik Admin Interface**, navigate to **Flows and Stages > Stages** and create or edit a **Captcha Stage**. Fill in the configurations exactly as follows:

1. **JavaScript URL**: 
   ```text
   https://<your-cap-domain>/assets/widget.js
   ```
2. **API Verification URL**: 
   ```text
   https://<your-cap-domain>/<your-site-key>/siteverify
   ```
3. **Request Content Type**: Select `JSON`.

*That's it! Since your custom theme variables and labels are compiled directly into the dynamic `widget.js` script, Authentik's portal will render your fully custom-branded CAPTCHA automatically with zero inline styling overrides.*

---

## 🚀 Quick Start with Docker Compose

To run the custom themed Cap container on your server, replace the default `image:` in your `docker-compose.yml` with our patched image:

```yaml
services:
  cap:
    image: ghcr.io/humidyne-labs/cap-themed:latest # 👈 Use the custom themed Cap image
    container_name: cap
    ports:
      - "3000:3000"
    environment:
      ADMIN_KEY: your_secret_password
      REDIS_URL: redis://valkey:6379
    depends_on:
      valkey:
        condition: service_healthy
    restart: unless-stopped

  valkey:
    image: valkey/valkey:9-alpine
    container_name: cap-valkey
    volumes:
      - valkey-data:/data
    command: valkey-server --save 60 1 --loglevel warning --maxmemory-policy noeviction
    healthcheck:
      test: ["CMD", "valkey-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

volumes:
  valkey-data:
```

---

## 📂 Repository Structure & File Breakdown

To keep things clean, the repository separates the **production patch files** (used by Docker to build the branded Cap container) from the **local preview playground** (used for testing the Theme Wizard in Vite/AI Studio).

### 🚀 Production Patch & Container Build Files (Core Repo)
These are the core files required to build and deploy the patched Cap container:

| File | Purpose |
| :--- | :--- |
| **`Dockerfile`** | Multi-stage build that clones `tiagozip/cap`, applies patches, and bakes template assets into the image. |
| **`patch-dashboard.js`** | Node.js script that injects the Theme Wizard UI and Recompiler handlers into Cap's dashboard files. |
| **`standalone-assets.patch`** | Patch file modifying Cap's Elysia server (`assets.js`) to serve modified static widget assets from disk. |
| **`.env.example`** | Documents runtime variables (`CAP_VERSION`, port settings, etc.). |
| **`README.md` & `LICENSE`** | Documentation and Apache 2.0 license terms. |

---

### 🧪 Local Preview UI Sandbox Files
These files power the interactive local React playground for testing the theme engine in dev mode:

| File / Folder | Purpose |
| :--- | :--- |
| **`src/` (`App.tsx`, `main.tsx`)** | Interactive React Theme Wizard sandbox and simulated PoW widget preview. |
| **`index.html`** | HTML entrypoint for the local preview app. |
| **`vite.config.ts` & `tailwind.config.js`** | Build configuration for the React dev environment. |
| **`package.json` & `bun.lock`** | Local development dependencies. |

---

## 📦 How the Build Layer Works

The **multi-stage Docker build** handles target building and version resolution:

1. **Stage 1 (Builder)**: Clones the upstream Cap tag matching the desired `CAP_VERSION` (from your `.env` or build arguments), applies the Elysia router assets patch (`standalone-assets.patch`), and injects the interactive Theme Wizard UI into the dashboard.
2. **Stage 2 (Final Layer)**: Starts from the official `tiago2/cap` container, mounts the compiled custom widget templates, overrides the assets server script, and deploys.

### Local Development / Testing

To start the local visual playground sandbox:
```bash
# Install local playground dependencies
npm install

# Start the dev server & preview container
npm run dev
```

### 🤖 CI/CD Container Publishing

The included GitHub Actions workflow (`.github/workflows/build-container.yml`) automatically builds multi-arch (`amd64`, `arm64`) Docker images whenever changes are pushed to `main`:

- **GitHub Container Registry (Zero-Config Default)**: Pushes automatically to `ghcr.io/humidyne-labs/cap-themed:latest` using GitHub's built-in `GITHUB_TOKEN` (no manual secrets required!).
- **Docker Hub (Optional)**: If you add `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` in your repository Secrets, it will also mirror the build to Docker Hub automatically.

---

## 👥 Contributors

- **humiditron** (Project Visionary, Lead Integrator, & Patch Inventor)
- **AI Coding Assistant** (Co-developer & Theme Wizard Architect, Powered by Gemini & AI Studio)

---

## 📄 License

This patch and the underlying project are released under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). You are fully permitted to modify, distribute, and self-host these customized assets for your apps and enterprise security structures.
