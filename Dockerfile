# Define global ARG for CAP_VERSION before any FROM
ARG CAP_VERSION=3.1.11

# ------------------------------------------------------------------------------
# Stage 1: Build the themed widget and patch the standalone assets server
# ------------------------------------------------------------------------------
FROM oven/bun:alpine AS builder
ARG CAP_VERSION
WORKDIR /build

RUN apk add --no-cache git patch

# 1. Clone versioned upstream Cap source matching the CAP_VERSION release
RUN if [ "${CAP_VERSION}" = "latest" ]; then \
      RESOLVED_VERSION=$(git ls-remote --tags --refs https://github.com/tiagozip/cap.git | grep -o 'refs/tags/standalone@[0-9.]*' | sort -V | tail -n1 | cut -d'@' -f2); \
    else \
      RESOLVED_VERSION=${CAP_VERSION}; \
    fi && \
    echo "Cloning Cap version: ${RESOLVED_VERSION}" && \
    git clone --branch standalone@${RESOLVED_VERSION} --depth=1 https://github.com/tiagozip/cap.git .

# 2. Copy and apply the standalone assets server patch
COPY standalone-assets.patch ./
RUN patch -p1 < standalone-assets.patch

# 3. Patch the dashboard source files with our interactive Widget Theme Wizard
COPY patch-dashboard.js ./
RUN bun run patch-dashboard.js .

# 4. Enter widget directory and swap default CSS with our theme.css
WORKDIR /build/widget
COPY theme.css src/src/cap.css

# 5. Install build dependencies (lightningcss, terser)
RUN bun install

# 6. Compile only the widget bundle
RUN bun -e ' \
import fs from "node:fs/promises"; \
import { transform } from "lightningcss"; \
import { minify } from "terser"; \
import { keys, shipped, shippedKeys, translations } from "./src/src/i18n/translations.js"; \
\
const minifyCSS = (input) => transform({ filename: "cap.css", code: Buffer.from(input), minify: true }).code.toString(); \
const minifyJS = async (input) => (await minify(input, { compress: { drop_console: false, dead_code: true, reduce_vars: true }, output: { comments: false }, mangle: true })).code; \
\
const rawMain = await fs.readFile("./src/src/cap.js", "utf-8"); \
const rawCSS = await fs.readFile("./src/src/cap.css", "utf-8"); \
const minifiedWorker = await minifyJS(await fs.readFile("./src/src/worker.js", "utf-8")); \
const minifiedCSS = minifyCSS(rawCSS); \
\
const keepIdx = shippedKeys.map((k) => keys.indexOf(k)); \
const i18nRows = {}; \
for (const code of shipped) { \
  i18nRows[code] = keepIdx.map((i) => translations[code][i]).join("/"); \
} \
\
const bundle = rawMain \
  .replace("%%workerScript%%", () => JSON.stringify(minifiedWorker)) \
  .replace("%%capCSS%%", () => minifiedCSS) \
  .replace("%%i18nKeys%%", () => shippedKeys.join(",")) \
  .replace("%%i18nData%%", () => JSON.stringify(i18nRows)); \
\
const templateBundle = rawMain \
  .replace("%%workerScript%%", () => JSON.stringify(minifiedWorker)) \
  .replace("%%i18nKeys%%", () => shippedKeys.join(",")) \
  .replace("%%i18nData%%", () => JSON.stringify(i18nRows)); \
\
await fs.writeFile("./src/cap.min.js", await minifyJS(bundle)); \
await fs.writeFile("./src/cap.template.js", await minifyJS(templateBundle)); \
await fs.writeFile("./src/cap-floating.min.js", await minifyJS(await fs.readFile("./src/src/cap-floating.js", "utf-8"))); \
console.log("Custom Cap widget compiled successfully!"); \
'

# ------------------------------------------------------------------------------
# Stage 2: Layer the compiled assets onto the matching version of official Cap
# ------------------------------------------------------------------------------
FROM tiago2/cap:standalone@${CAP_VERSION}
USER root

# 1. Copy the compiled custom widget into the Cap container assets directory
COPY --from=builder /build/widget/src/cap.min.js /usr/src/app/assets/widget.js
COPY --from=builder /build/widget/src/cap.template.js /usr/src/app/assets/widget.template.js
COPY --from=builder /build/widget/src/src/cap.css /usr/src/app/assets/cap.css.template
COPY --from=builder /build/widget/src/cap-floating.min.js /usr/src/app/assets/floating.js

# 2. Copy the patched version-specific assets server directly
COPY --from=builder /build/standalone/src/assets.js /usr/src/app/src/assets.js

# Ensure permissions are correct
RUN chmod -R a+rX /usr/src/app/assets

# Switch back to the standard container user
USER bun
