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

- **🎨 Dynamic Theme Wizard**: Integrated seamlessly into the Cap dashboard to visually edit background colors, text colors, focus rings, borders, radiuses, and widths.
- **📝 Live Text Customization**: Customize the 4 core CAPTCHA state labels (Idle, Verifying, Success, Error) on-the-fly to match your voice or language.
- **⚙️ Elysia Server-Side Recompilation Engine**: A custom `/recompile-widget` route executes real-time template replacement and instant asset compilation inside the running container.
- **🌈 20 Premium Theme Presets**:
  1. **Default Light** — Clean and crisp standard styling.
  2. **Classic Dark** — Refined midnight palette.
  3. **Warm Amber** — Cozy warm sepia.
  4. **Emerald Forest** — Botanical green highlights.
  5. **Cyberpunk Neon** — High-energy stark magenta and cyan.
  6. **Stealth Slate** — Low-profile slate grey and blue.
  7. **Midnight Amethyst** — Deep luxurious cosmic purple.
  8. **Dracula Dark** — The classic programmer's favorite.
  9. **Nordic Frost** — Polar light grey with sharp icy-blue highlights.
  10. **Synthwave Outrun** — 80s grid aesthetic with vibrant rose accents.
  11. **Solarized Light** — Eye-friendly paper-colored vintage contrast.
  12. **Gruvbox Dark** — Warm retro-terminal palette.
  13. **Retro Console** — Monochrome green-phosphor console styling.
  14. **Oceanic Deep** — Submarine deep dark blue and aquamarine.
  15. **Rose Pine** — Desaturated earthy rose and pine needles.
  16. **Minimal Stark** — High-contrast premium black and white borders.
  17. **Coffee Grind** — Deep roasted espresso and cream accents.
  18. **Royal Velvet** — Regal navy canvas with rich gold outlines.
  19. **Tokyo Night** — Slick neon blue and dark slate shadows.
  20. **Crimson Rust** — Industrial brick-red elements.

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
