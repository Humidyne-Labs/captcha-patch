import fs from "node:fs/promises";
import path from "node:path";

async function patch() {
  const rootDir = process.argv[2] || ".";
  console.log(`🚀 Patching Cap Standalone files in: ${rootDir}`);

  const dashboardJsPath = path.join(rootDir, "standalone/public/js/dashboard.js");
  const indexHtmlPath = path.join(rootDir, "standalone/public/index.html");
  const styleCssPath = path.join(rootDir, "standalone/public/assets/style.css");

  // 1. Patch dashboard.js
  console.log(`📝 Patching ${dashboardJsPath}...`);
  let jsContent = await fs.readFile(dashboardJsPath, "utf-8");

  // Define our new renderIntegrationTab function
  const newRenderIntegrationTab = `function renderIntegrationTab(key) {
  const sk = key.siteKey;
  const origin = location.origin;
  const endpoint = \`\${origin}/\${sk}/\`;
  const widget = \`<script src="\${origin}/assets/widget.js"></script>\\n<cap-widget data-cap-api-endpoint="\${endpoint}"></cap-widget>\`;
  const nodeSnippet = \`const res = await fetch("\${origin}/siteverify", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ secret: process.env.CAP_SECRET, response: token }),
});
const { success } = await res.json();\`;
  const aiPrompt = \`Implement Cap (self-hosted CAPTCHA) in this codebase, or migrate from the existing CAPTCHA solution if one is present.

## Configuration

- Site key: \\\`\${sk}\\\`
- Server URL: \\\`\${origin}\\\`
- API endpoint: \\\`\${endpoint}\\\`

## Step 1: Read the docs

Fetch these first:
- https://trycap.dev/llms.txt
- https://trycap.dev/agent.md

## Step 2: Plan before coding

Before writing code, output a short plan covering:
1. What CAPTCHA solution (if any) exists today and every place it's used (frontend mounts, backend verification, env vars, config files)
2. Which Cap mode fits best: standard widget, invisible, or floating (check the docs for tradeoffs)
3. File-by-file change list
4. How you'll verify it works end-to-end

Wait for nothing and proceed once the plan is written.

## Step 3: Migration rules (if replacing an existing solution)

- Remove the old library, scripts, env vars, and verification calls completely. No dead code.
- Match the old solution's UX placement (same forms, same trigger points).
- Preserve existing error handling and failure UX.
- Update any tests, mocks, or fixtures that referenced the old CAPTCHA.

## Step 4: Implement

- Secrets go in env vars, never hardcoded.
- Token must be verified server-side on every protected route. Frontend-only checks don't count.
- Handle: missing token, invalid token, network failure to the Cap server, expired token.

## Step 5: Test it

Execute a basic test to make sure everything works. Check valid token, missing token, and invalid token cases.

If anything fails and you are sure it's Cap's issue:

1. Double-check that you're using the latest widget and standalone version.
2. Double-check your secret, endpoint, and that you're sending the token in the right field. Consult the docs
3. Instruct the user to open an issue on GitHub: https://github.com/tiagozip/cap\`;

  return \`
    <div class="integration-layout">
      <!-- Widget Theme Wizard -->
      <div class="theme-wizard-container">
        <div class="theme-wizard-header" style="margin-bottom: 16px;">
          <h3 class="config-section-title" style="margin: 0 0 4px 0;">🎨 Widget Theme Wizard</h3>
          <p class="integration-hint" style="margin: 0;">Customize the visual styling of your Cap widget dynamically. Pick a preset or choose custom colors to perfectly match your brand.</p>
        </div>
        
        <div class="theme-wizard-grid">
          <!-- Controls -->
          <div class="theme-wizard-controls">
            <div class="theme-field">
              <label>Presets</label>
              <select id="themePresetSelect" class="theme-select">
                <option value="light">Default Light</option>
                <option value="dark">Classic Dark</option>
                <option value="warmAmber">Warm Amber</option>
                <option value="emerald">Emerald Forest</option>
                <option value="cyberpunk">Cyberpunk Neon</option>
                <option value="stealth">Stealth Slate</option>
                <option value="midnightAmethyst">Midnight Amethyst</option>
                <option value="dracula">Dracula Dark</option>
                <option value="nordicFrost">Nordic Frost</option>
                <option value="synthwave">Synthwave Outrun</option>
                <option value="solarizedLight">Solarized Light</option>
                <option value="solarizedDark">Solarized Dark</option>
                <option value="gruvboxDark">Gruvbox Dark</option>
                <option value="gruvboxLight">Gruvbox Light</option>
                <option value="retroConsole">Retro Console</option>
                <option value="oceanicDeep">Oceanic Deep</option>
                <option value="rosePine">Rose Pine</option>
                <option value="rosePineDawn">Rose Pine Dawn</option>
                <option value="rosePineMoon">Rose Pine Moon</option>
                <option value="minimalStark">Minimal Stark</option>
                <option value="coffeeGrind">Coffee Grind</option>
                <option value="royalVelvet">Royal Velvet</option>
                <option value="tokyoNight">Tokyo Night</option>
                <option value="crimsonRust">Crimson Rust</option>
                <option value="catppuccinMocha">Catppuccin Mocha</option>
                <option value="catppuccinLatte">Catppuccin Latte</option>
                <option value="catppuccinMacchiato">Catppuccin Macchiato</option>
                <option value="catppuccinFrappe">Catppuccin Frappé</option>
                <option value="monokaiPro">Monokai Pro</option>
                <option value="oneDarkPro">One Dark Pro</option>
                <option value="nordicNight">Nordic Night</option>
                <option value="kanagawaDragon">Kanagawa Dragon</option>
                <option value="kanagawaWave">Kanagawa Wave</option>
                <option value="everforestDark">Everforest Dark</option>
                <option value="everforestLight">Everforest Light</option>
                <option value="materialOcean">Material Ocean</option>
                <option value="nightOwl">Night Owl</option>
                <option value="palenight">Palenight</option>
                <option value="cobalt2">Cobalt 2</option>
                <option value="andromeda">Andromeda</option>
                <option value="shadesOfPurple">Shades of Purple</option>
                <option value="horizonDark">Horizon Dark</option>
                <option value="cyberneticGold">Cybernetic Gold</option>
                <option value="midnightEmerald">Midnight Emerald</option>
                <option value="matchaLatte">Matcha Latte</option>
                <option value="sunsetGlow">Sunset Glow</option>
                <option value="matrixCyber">Matrix Cyber</option>
                <option value="lavenderMist">Lavender Mist</option>
                <option value="oxfordNavy">Oxford Navy</option>
                <option value="cherryBlossom">Cherry Blossom</option>
                <option value="custom">Custom Colorway</option>
              </select>
            </div>
            
            <div class="theme-controls-row">
              <div class="theme-field-color">
                <label>Background</label>
                <div class="color-picker-wrapper">
                  <input type="color" id="themeBg" value="#fdfdfd">
                  <input type="text" id="themeBgText" value="#fdfdfd">
                </div>
              </div>
              <div class="theme-field-color">
                <label>Text Color</label>
                <div class="color-picker-wrapper">
                  <input type="color" id="themeColor" value="#212121">
                  <input type="text" id="themeColorText" value="#212121">
                </div>
              </div>
            </div>

            <div class="theme-controls-row">
              <div class="theme-field-color">
                <label>Border Color</label>
                <div class="color-picker-wrapper">
                  <input type="color" id="themeBorder" value="#dddddd">
                  <input type="text" id="themeBorderText" value="#dddddd">
                </div>
              </div>
              <div class="theme-field-color">
                <label>Focus Ring</label>
                <div class="color-picker-wrapper">
                  <input type="color" id="themeFocus" value="#0066cc">
                  <input type="text" id="themeFocusText" value="#0066cc">
                </div>
              </div>
            </div>

            <div class="theme-controls-row">
              <div class="theme-field-range">
                <label>Border Radius (<span id="themeRadiusVal">14px</span>)</label>
                <input type="range" id="themeRadius" min="0" max="28" value="14" step="1">
              </div>
              <div class="theme-field-range">
                <label>Widget Width (<span id="themeWidthVal">260px</span>)</label>
                <input type="range" id="themeWidth" min="200" max="400" value="260" step="5">
              </div>
            </div>

            <div class="theme-controls-row">
              <div class="theme-field-range">
                <label>Widget Height (<span id="themeHeightVal">54px</span>)</label>
                <input type="range" id="themeHeight" min="40" max="75" value="54" step="1">
              </div>
              <div class="theme-field-range">
                <label>Checkbox Size (<span id="themeCheckboxSizeVal">25px</span>)</label>
                <input type="range" id="themeCheckboxSize" min="16" max="32" value="25" step="1">
              </div>
            </div>

            <!-- Custom Widget Labels Section -->
            <div style="margin-top: 14px; border-top: 1px dashed var(--border-color, #e2e8f0); padding-top: 14px;">
              <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: var(--text-secondary, #718096); display: block; margin-bottom: 8px;">📝 Custom Widget Labels</span>
              <div class="theme-controls-row" style="margin-bottom: 10px;">
                <div class="theme-field">
                  <label>Idle Text</label>
                  <input type="text" id="themeTextIdle" value="Verify with Cap" class="theme-select" style="padding: 6px 10px; font-size: 12px; height: 34px;">
                </div>
                <div class="theme-field">
                  <label>Verifying Text</label>
                  <input type="text" id="themeTextVerifying" value="Solving Proof-of-Work..." class="theme-select" style="padding: 6px 10px; font-size: 12px; height: 34px;">
                </div>
              </div>
              <div class="theme-controls-row">
                <div class="theme-field">
                  <label>Success Text</label>
                  <input type="text" id="themeTextDone" value="Verification Complete" class="theme-select" style="padding: 6px 10px; font-size: 12px; height: 34px;">
                </div>
                <div class="theme-field">
                  <label>Error Text</label>
                  <input type="text" id="themeTextError" value="Failed to verify" class="theme-select" style="padding: 6px 10px; font-size: 12px; height: 34px;">
                </div>
              </div>
            </div>
            
            <button type="button" class="theme-save-btn" id="themeRecompileBtn" style="margin-top: 16px; height: 40px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" style="margin-right:6px;"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save Theme & Compile Widget
            </button>
          </div>
          
          <!-- Live Preview -->
          <div class="theme-wizard-preview">
            <label class="preview-label">Live Preview</label>
            <div class="preview-box-wrapper">
              <div class="preview-box" id="themePreviewBox">
                <cap-widget id="previewCapWidget" data-cap-api-endpoint="\${endpoint}"></cap-widget>
              </div>
              <button type="button" class="preview-reset-btn" id="themePreviewResetBtn" title="Reset widget state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12" style="margin-right:4px;"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2"/></svg>
                Reset widget
              </button>
            </div>
          </div>
        </div>
      </div>

      <h3 class="config-section-title">Frontend Snippet</h3>
      <p class="integration-hint">Include this HTML snippet in your client form where you want the CAPTCHA widget to render. It updates in real-time with your styles!</p>
      <div class="code-block" id="frontendSnippetBlock" data-raw="\${escapeHtml(widget)}">
        <button class="code-copy">Copy</button>
        <pre><code class="hl" id="frontendSnippetCode">\${highlight(widget)}</code></pre>
      </div>

      <h3 class="config-section-title" style="margin-top: 24px;">Server verification</h3>
      <div class="code-block" data-raw="\${escapeHtml(nodeSnippet)}" style="margin-top: 12px;">
        <button class="code-copy">Copy</button>
        <pre><code class="hl">\${highlight(nodeSnippet)}</code></pre>
      </div>

      <h3 class="config-section-title" style="margin-top: 24px;">AI prompt</h3>
      <p class="integration-hint">Drop this into your AI assistant to have it implement Cap end-to-end.</p>
      <div class="code-block code-block-prompt" data-raw="\${escapeHtml(aiPrompt)}">
        <pre><code>\${escapeHtml(aiPrompt)}</code></pre>
        <button class="code-copy code-copy-large">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          <span class="code-copy-label">Copy prompt</span>
        </button>
      </div>
    </div>
  \`;
}`;

  // Find renderIntegrationTab index and replace it
  const startIdx = jsContent.indexOf("function renderIntegrationTab(key) {");
  const endIdx = jsContent.indexOf("function wireIntegrationCopy(root) {");

  if (startIdx === -1 || endIdx === -1) {
    throw new Error("Could not find function definitions in dashboard.js");
  }

  const before = jsContent.slice(0, startIdx);
  const after = jsContent.slice(endIdx);

  // Define our new wireThemeWizard function and the patched wireIntegrationCopy
  const themeWizardJs = `
function wireThemeWizard(root, key) {
  if (root.dataset.themeWizardWired) return;
  root.dataset.themeWizardWired = "true";

  const presetSelect = root.querySelector("#themePresetSelect");
  const bgInput = root.querySelector("#themeBg");
  const bgText = root.querySelector("#themeBgText");
  const colorInput = root.querySelector("#themeColor");
  const colorText = root.querySelector("#themeColorText");
  const borderInput = root.querySelector("#themeBorder");
  const borderText = root.querySelector("#themeBorderText");
  const focusInput = root.querySelector("#themeFocus");
  const focusText = root.querySelector("#themeFocusText");
  const radiusInput = root.querySelector("#themeRadius");
  const radiusVal = root.querySelector("#themeRadiusVal");
  const widthInput = root.querySelector("#themeWidth");
  const widthVal = root.querySelector("#themeWidthVal");
  const previewBox = root.querySelector("#themePreviewBox");
  const resetBtn = root.querySelector("#themePreviewResetBtn");
  const snippetCode = root.querySelector("#frontendSnippetCode");
  const snippetBlock = root.querySelector("#frontendSnippetBlock");

  // Custom text inputs
  const textIdleInput = root.querySelector("#themeTextIdle");
  const textVerifyingInput = root.querySelector("#themeTextVerifying");
  const textDoneInput = root.querySelector("#themeTextDone");
  const textErrorInput = root.querySelector("#themeTextError");

  if (!presetSelect) return;

  const presets = {
    light: { bg: "#fdfdfd", color: "#212121", border: "#dddddd", focus: "#0066cc", radius: "14", width: "260", height: "54", checkboxSize: "25" },
    dark: { bg: "#1a1a1a", color: "#f7fafc", border: "#333333", focus: "#3182ce", radius: "14", width: "260", height: "54", checkboxSize: "25" },
    warmAmber: { bg: "#fffbeb", color: "#78350f", border: "#fef3c7", focus: "#d97706", radius: "10", width: "260", height: "54", checkboxSize: "25" },
    emerald: { bg: "#f0fdf4", color: "#14532d", border: "#dcfce7", focus: "#16a34a", radius: "16", width: "280", height: "54", checkboxSize: "25" },
    cyberpunk: { bg: "#0d0e15", color: "#00ffcc", border: "#ff007f", focus: "#00ffcc", radius: "0", width: "300", height: "54", checkboxSize: "24" },
    stealth: { bg: "#0f172a", color: "#94a3b8", border: "#1e293b", focus: "#38bdf8", radius: "8", width: "250", height: "50", checkboxSize: "24" },
    midnightAmethyst: { bg: "#0a0518", color: "#c084fc", border: "#241242", focus: "#a855f7", radius: "12", width: "270", height: "54", checkboxSize: "25" },
    dracula: { bg: "#282a36", color: "#f8f8f2", border: "#44475a", focus: "#bd93f9", radius: "8", width: "265", height: "54", checkboxSize: "25" },
    nordicFrost: { bg: "#f8fafc", color: "#334155", border: "#e2e8f0", focus: "#0284c7", radius: "10", width: "260", height: "54", checkboxSize: "25" },
    synthwave: { bg: "#1a0826", color: "#f472b6", border: "#f43f5e", focus: "#f43f5e", radius: "4", width: "290", height: "54", checkboxSize: "25" },
    solarizedLight: { bg: "#fdf6e3", color: "#586e75", border: "#eee8d5", focus: "#268bd2", radius: "12", width: "260", height: "54", checkboxSize: "25" },
    solarizedDark: { bg: "#002b36", color: "#839496", border: "#073642", focus: "#268bd2", radius: "12", width: "260", height: "54", checkboxSize: "25" },
    gruvboxDark: { bg: "#282828", color: "#ebdbb2", border: "#3c3836", focus: "#fe8019", radius: "6", width: "270", height: "54", checkboxSize: "25" },
    gruvboxLight: { bg: "#fbf1c7", color: "#3c3836", border: "#ebdbb2", focus: "#b57614", radius: "6", width: "270", height: "54", checkboxSize: "25" },
    retroConsole: { bg: "#000000", color: "#33ff33", border: "#33ff33", focus: "#33ff33", radius: "0", width: "280", height: "52", checkboxSize: "24" },
    oceanicDeep: { bg: "#04151f", color: "#2ec4b6", border: "#113f59", focus: "#2ec4b6", radius: "14", width: "260", height: "54", checkboxSize: "25" },
    rosePine: { bg: "#191724", color: "#e0def4", border: "#26233a", focus: "#ebbcac", radius: "8", width: "260", height: "54", checkboxSize: "25" },
    rosePineDawn: { bg: "#faf4ed", color: "#575279", border: "#f2e9e1", focus: "#d7827e", radius: "8", width: "260", height: "54", checkboxSize: "25" },
    rosePineMoon: { bg: "#232136", color: "#e0def4", border: "#393552", focus: "#c4a7e7", radius: "8", width: "260", height: "54", checkboxSize: "25" },
    minimalStark: { bg: "#ffffff", color: "#111111", border: "#111111", focus: "#111111", radius: "0", width: "250", height: "50", checkboxSize: "24" },
    coffeeGrind: { bg: "#2b1e17", color: "#d4bda8", border: "#4a3525", focus: "#8c6239", radius: "10", width: "260", height: "54", checkboxSize: "25" },
    royalVelvet: { bg: "#0a1128", color: "#e2e8f0", border: "#1c2541", focus: "#cca43b", radius: "16", width: "275", height: "54", checkboxSize: "25" },
    tokyoNight: { bg: "#1a1b26", color: "#a9b1d6", border: "#24283b", focus: "#7aa2f7", radius: "8", width: "260", height: "54", checkboxSize: "25" },
    crimsonRust: { bg: "#1c0d0d", color: "#ff6b6b", border: "#3d1c1c", focus: "#e63946", radius: "12", width: "265", height: "54", checkboxSize: "25" },
    catppuccinMocha: { bg: "#1e1e2e", color: "#cdd6f4", border: "#313244", focus: "#cba6f7", radius: "12", width: "260", height: "54", checkboxSize: "25" },
    catppuccinLatte: { bg: "#eff1f5", color: "#4c4f69", border: "#e6e9ef", focus: "#8839ef", radius: "12", width: "260", height: "54", checkboxSize: "25" },
    catppuccinMacchiato: { bg: "#24273a", color: "#cad3f5", border: "#363a4f", focus: "#f5a97f", radius: "12", width: "260", height: "54", checkboxSize: "25" },
    catppuccinFrappe: { bg: "#303446", color: "#c6d0f5", border: "#414559", focus: "#ca9ee6", radius: "12", width: "260", height: "54", checkboxSize: "25" },
    monokaiPro: { bg: "#2d2a2e", color: "#fcfcfa", border: "#403e41", focus: "#ffd866", radius: "8", width: "260", height: "54", checkboxSize: "25" },
    oneDarkPro: { bg: "#282c34", color: "#abb2bf", border: "#3e4451", focus: "#61afef", radius: "10", width: "260", height: "54", checkboxSize: "25" },
    nordicNight: { bg: "#2e3440", color: "#eceff4", border: "#4c566a", focus: "#88c0d0", radius: "8", width: "260", height: "54", checkboxSize: "25" },
    kanagawaDragon: { bg: "#181616", color: "#c5c9c5", border: "#282727", focus: "#e6c384", radius: "8", width: "260", height: "54", checkboxSize: "25" },
    kanagawaWave: { bg: "#1f1f28", color: "#dcd7ba", border: "#2a2a37", focus: "#7e9cd8", radius: "8", width: "260", height: "54", checkboxSize: "25" },
    everforestDark: { bg: "#2d353b", color: "#d3c6aa", border: "#3d484f", focus: "#a7c080", radius: "10", width: "260", height: "54", checkboxSize: "25" },
    everforestLight: { bg: "#fdf6e3", color: "#5c6a72", border: "#f4f0d9", focus: "#8da101", radius: "10", width: "260", height: "54", checkboxSize: "25" },
    materialOcean: { bg: "#0f111a", color: "#8f93a2", border: "#1f2233", focus: "#80cbd0", radius: "8", width: "260", height: "54", checkboxSize: "25" },
    nightOwl: { bg: "#011627", color: "#d6deeb", border: "#0b2942", focus: "#82aaff", radius: "10", width: "260", height: "54", checkboxSize: "25" },
    palenight: { bg: "#292d3e", color: "#a6accd", border: "#3a3f58", focus: "#c792ea", radius: "10", width: "260", height: "54", checkboxSize: "25" },
    cobalt2: { bg: "#193549", color: "#e1efef", border: "#152c3e", focus: "#ffc600", radius: "10", width: "265", height: "54", checkboxSize: "25" },
    andromeda: { bg: "#262a33", color: "#d5dec1", border: "#323846", focus: "#00e676", radius: "10", width: "260", height: "54", checkboxSize: "25" },
    shadesOfPurple: { bg: "#2d2b55", color: "#ffffff", border: "#1e1e3f", focus: "#fad000", radius: "12", width: "260", height: "54", checkboxSize: "25" },
    horizonDark: { bg: "#1c1e26", color: "#d5d8da", border: "#2e303e", focus: "#e95678", radius: "8", width: "260", height: "54", checkboxSize: "25" },
    cyberneticGold: { bg: "#121212", color: "#e5c07b", border: "#282828", focus: "#d19a66", radius: "4", width: "270", height: "52", checkboxSize: "24" },
    midnightEmerald: { bg: "#061a14", color: "#a7f3d0", border: "#0e382c", focus: "#10b981", radius: "14", width: "265", height: "54", checkboxSize: "25" },
    matchaLatte: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", focus: "#22c55e", radius: "14", width: "260", height: "54", checkboxSize: "25" },
    sunsetGlow: { bg: "#1a0f1d", color: "#f472b6", border: "#3b0764", focus: "#f97316", radius: "12", width: "270", height: "54", checkboxSize: "25" },
    matrixCyber: { bg: "#050d08", color: "#22c55e", border: "#14532d", focus: "#4ade80", radius: "2", width: "280", height: "52", checkboxSize: "24" },
    lavenderMist: { bg: "#faf5ff", color: "#6b21a8", border: "#e9d5ff", focus: "#a855f7", radius: "16", width: "260", height: "54", checkboxSize: "25" },
    oxfordNavy: { bg: "#0f172a", color: "#e2e8f0", border: "#1e293b", focus: "#38bdf8", radius: "10", width: "260", height: "54", checkboxSize: "25" },
    cherryBlossom: { bg: "#fff5f7", color: "#9d174d", border: "#fbcfe8", focus: "#ec4899", radius: "14", width: "260", height: "54", checkboxSize: "25" }
  };

  const heightInput = root.querySelector("#themeHeight");
  const heightVal = root.querySelector("#themeHeightVal");
  const checkboxSizeInput = root.querySelector("#themeCheckboxSize");
  const checkboxSizeVal = root.querySelector("#themeCheckboxSizeVal");

  function updatePreviewAndCode() {
    const bg = bgInput.value;
    const color = colorInput.value;
    const border = borderInput.value;
    const focus = focusInput.value;
    const radius = radiusInput.value + "px";
    const width = widthInput.value + "px";
    const height = heightInput ? heightInput.value + "px" : "54px";
    const checkboxSize = checkboxSizeInput ? checkboxSizeInput.value + "px" : "25px";

    radiusVal.textContent = radius;
    widthVal.textContent = width;
    if (heightVal && heightInput) heightVal.textContent = height;
    if (checkboxSizeVal && checkboxSizeInput) checkboxSizeVal.textContent = checkboxSize;

    const widgetEl = previewBox.querySelector("cap-widget");
    if (widgetEl) {
      widgetEl.style.setProperty("--cap-background", bg);
      widgetEl.style.setProperty("--cap-color", color);
      widgetEl.style.setProperty("--cap-border-color", border);
      widgetEl.style.setProperty("--cap-focus-ring", focus);
      widgetEl.style.setProperty("--cap-border-radius", radius);
      widgetEl.style.setProperty("--cap-widget-width", width);
      widgetEl.style.setProperty("--cap-widget-height", height);
      widgetEl.style.setProperty("--cap-checkbox-size", checkboxSize);
    }

    const origin = location.origin;
    const endpoint = \`\${origin}/\${key.siteKey}/\`;
    const styleAttr = \`style="--cap-background: \${bg}; --cap-color: \${color}; --cap-border-color: \${border}; --cap-focus-ring: \${focus}; --cap-border-radius: \${radius}; --cap-widget-width: \${width}; --cap-widget-height: \${height}; --cap-checkbox-size: \${checkboxSize};"\`;
    
    const widgetSnippet = \`<script src="\${origin}/assets/widget.js"></script>\\n<cap-widget data-cap-api-endpoint="\${endpoint}"\\n  \${styleAttr}>\\n</cap-widget>\`;

    snippetCode.innerHTML = highlight(widgetSnippet);
    snippetBlock.dataset.raw = widgetSnippet;
  }

  function setupColorSync(picker, text) {
    picker.addEventListener("input", () => {
      text.value = picker.value.toUpperCase();
      presetSelect.value = "custom";
      updatePreviewAndCode();
    });
    text.addEventListener("input", () => {
      let val = text.value;
      if (!val.startsWith("#")) val = "#" + val;
      if (/^#[0-9A-F]{6}$/i.test(val)) {
        picker.value = val;
        presetSelect.value = "custom";
        updatePreviewAndCode();
      }
    });
  }

  setupColorSync(bgInput, bgText);
  setupColorSync(colorInput, colorText);
  setupColorSync(borderInput, borderText);
  setupColorSync(focusInput, focusText);

  radiusInput.addEventListener("input", () => {
    presetSelect.value = "custom";
    updatePreviewAndCode();
  });
  widthInput.addEventListener("input", () => {
    presetSelect.value = "custom";
    updatePreviewAndCode();
  });

  if (heightInput) {
    heightInput.addEventListener("input", () => {
      presetSelect.value = "custom";
      updatePreviewAndCode();
    });
  }
  if (checkboxSizeInput) {
    checkboxSizeInput.addEventListener("input", () => {
      presetSelect.value = "custom";
      updatePreviewAndCode();
    });
  }

  if (textIdleInput) {
    textIdleInput.addEventListener("input", updatePreviewAndCode);
    textVerifyingInput.addEventListener("input", updatePreviewAndCode);
    textDoneInput.addEventListener("input", updatePreviewAndCode);
    textErrorInput.addEventListener("input", updatePreviewAndCode);
  }

  presetSelect.addEventListener("change", () => {
    const p = presets[presetSelect.value];
    if (p) {
      bgInput.value = p.bg;
      bgText.value = p.bg.toUpperCase();
      colorInput.value = p.color;
      colorText.value = p.color.toUpperCase();
      borderInput.value = p.border;
      borderText.value = p.border.toUpperCase();
      focusInput.value = p.focus;
      focusText.value = p.focus.toUpperCase();
      radiusInput.value = p.radius;
      widthInput.value = p.width;
      if (heightInput) heightInput.value = p.height || "54";
      if (checkboxSizeInput) checkboxSizeInput.value = p.checkboxSize || "25";
      updatePreviewAndCode();
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const origin = location.origin;
      const endpoint = \`\${origin}/\${key.siteKey}/\`;
      previewBox.innerHTML = \`<cap-widget id="previewCapWidget" data-cap-api-endpoint="\${endpoint}"></cap-widget>\`;
      updatePreviewAndCode();
    });
  }

  // Hook recompiler trigger button
  const recompileBtn = root.querySelector("#themeRecompileBtn");
  if (recompileBtn) {
    recompileBtn.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (recompileBtn.disabled) return;
      recompileBtn.disabled = true;
      const originalText = recompileBtn.innerHTML;
      recompileBtn.textContent = "Compiling Widget...";

      try {
        const payload = {
          bg: bgInput.value,
          color: colorInput.value,
          border: borderInput.value,
          focus: focusInput.value,
          radius: radiusInput.value + "px",
          width: widthInput.value + "px",
          height: heightInput ? heightInput.value + "px" : "54px",
          checkboxSize: checkboxSizeInput ? checkboxSizeInput.value + "px" : "25px",
          textIdle: textIdleInput ? textIdleInput.value : "Verify with Cap",
          textVerifying: textVerifyingInput ? textVerifyingInput.value : "Solving Proof-of-Work...",
          textDone: textDoneInput ? textDoneInput.value : "Verification Complete",
          textError: textErrorInput ? textErrorInput.value : "Failed to verify"
        };

        let res = await fetch("/assets/recompile-widget", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok && res.status === 404) {
          res = await fetch("/recompile-widget", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        }

        let data;
        try {
          data = await res.json();
        } catch (_) {
          data = { error: await res.text() };
        }

        if (res.ok && data.success) {
          recompileBtn.innerHTML = "✓ Theme Applied & Compiled!";
          recompileBtn.style.backgroundColor = "#10b981";
          recompileBtn.style.color = "#ffffff";
          setTimeout(() => {
            recompileBtn.disabled = false;
            recompileBtn.innerHTML = originalText;
            recompileBtn.style.backgroundColor = "";
            recompileBtn.style.color = "";
            if (resetBtn) resetBtn.click();
          }, 2500);
        } else {
          recompileBtn.innerHTML = "❌ Failed: " + (data.error || "Server Error");
          recompileBtn.style.backgroundColor = "#ef4444";
          recompileBtn.style.color = "#ffffff";
          setTimeout(() => {
            recompileBtn.disabled = false;
            recompileBtn.innerHTML = originalText;
            recompileBtn.style.backgroundColor = "";
            recompileBtn.style.color = "";
          }, 3000);
        }
      } catch (err) {
        recompileBtn.innerHTML = "❌ Error: " + err.message;
        recompileBtn.style.backgroundColor = "#ef4444";
        recompileBtn.style.color = "#ffffff";
        setTimeout(() => {
          recompileBtn.disabled = false;
          recompileBtn.innerHTML = originalText;
          recompileBtn.style.backgroundColor = "";
          recompileBtn.style.color = "";
        }, 3000);
      }
    };
  }

  presetSelect.value = "light";
  presetSelect.dispatchEvent(new Event("change"));
}
`;

  // Insert our function and override wireIntegrationCopy
  let patchedJs = before + newRenderIntegrationTab + "\n\n" + themeWizardJs + "\n\n" + after;

  // Let's wire wireThemeWizard inside wireIntegrationCopy
  const wireTarget = "function wireIntegrationCopy(root) {";
  const wireIndex = patchedJs.indexOf(wireTarget);
  if (wireIndex !== -1) {
    const patchInsertion = `\n  if (typeof wireThemeWizard === "function") {\n    wireThemeWizard(root, selectedKey);\n  }\n`;
    patchedJs = patchedJs.slice(0, wireIndex + wireTarget.length) + patchInsertion + patchedJs.slice(wireIndex + wireTarget.length);
  }

  await fs.writeFile(dashboardJsPath, patchedJs, "utf-8");
  console.log("✅ dashboard.js patched successfully!");

  // 1b. Patch assets.js to add /recompile-widget endpoint
  const assetsJsPath = path.join(rootDir, "standalone/src/assets.js");
  console.log(`📝 Patching ${assetsJsPath}...`);
  try {
    let assetsContent = await fs.readFile(assetsJsPath, "utf-8");
    const targetEnd = `    return content;\n  });`;
    if (assetsContent.includes(targetEnd)) {
      const recompileRoute = `    return content;
  })
  .post("/recompile-widget", async ({ body, set }) => {
    try {
      const { bg, color, border, focus, radius, width, height, checkboxSize, textIdle, textVerifying, textDone, textError } = body;
      const templateCss = await Bun.file("/usr/src/app/assets/cap.css.template").text();

      // Prepend host-level CSS custom property definitions
      const hostCss = \`:host{--cap-background:\${bg};--cap-color:\${color};--cap-border-color:\${border};--cap-focus-ring:\${focus};--cap-border-radius:\${radius};--cap-widget-width:\${width};--cap-widget-height:\${height || "54px"};--cap-checkbox-size:\${checkboxSize || "25px"};}\`;

      // Replace var(--cap-xxx, default) fallbacks throughout the stylesheet
      let newCss = hostCss + templateCss
        .replace(/var\(--cap-background\\s*,\\s*[^)]+\)/g, \`var(--cap-background, \${bg})\`)
        .replace(/var\(--cap-color\\s*,\\s*[^)]+\)/g, \`var(--cap-color, \${color})\`)
        .replace(/var\(--cap-border-color\\s*,\\s*[^)]+\)/g, \`var(--cap-border-color, \${border})\`)
        .replace(/var\(--cap-focus-ring\\s*,\\s*[^)]+\)/g, \`var(--cap-focus-ring, \${focus})\`)
        .replace(/var\(--cap-border-radius\\s*,\\s*[^)]+\)/g, \`var(--cap-border-radius, \${radius})\`)
        .replace(/var\(--cap-widget-width\\s*,\\s*[^)]+\)/g, \`var(--cap-widget-width, \${width})\`)
        .replace(/var\(--cap-widget-height\\s*,\\s*[^)]+\)/g, \`var(--cap-widget-height, \${height || "54px"})\`)
        .replace(/var\(--cap-checkbox-size\\s*,\\s*[^)]+\)/g, \`var(--cap-checkbox-size, \${checkboxSize || "25px"})\`);

      const templateJs = await Bun.file("/usr/src/app/assets/widget.template.js").text();
      const minifiedCss = newCss
        .replace(/\\/\\*[\\s\\S]*?\\*\\//g, "")
        .replace(/\\s+/g, " ")
        .replace(/\\s*([{};:])\\s*/g, "$1")
        .trim();
      let finalJs = templateJs.replace("%%capCSS%%", () => minifiedCss);
      if (textIdle && textVerifying && textDone && textError) {
        finalJs = finalJs.replace(
          "Verify with Cap/Solving Proof-of-Work.../Verification Complete/Failed to verify",
          \`\${textIdle}/\${textVerifying}/\${textDone}/\${textError}\`
        );
      }
      await Bun.write("/usr/src/app/assets/widget.js", finalJs);
      try { if (typeof db !== "undefined" && db.set) await db.set("asset:widget.js", finalJs); } catch (_) {}
      return { success: true };
    } catch (err) {
      set.status = 500;
      return { error: err.message };
    }
  });`;
      assetsContent = assetsContent.replace(targetEnd, recompileRoute);
      await fs.writeFile(assetsJsPath, assetsContent, "utf-8");
      console.log("✅ assets.js patched successfully with /recompile-widget!");
    } else {
      console.log("⚠️ Target end not found in assets.js, skipping recompile route patch.");
    }
  } catch (err) {
    console.error("⚠️ Failed to patch assets.js:", err.message);
  }

  // 1c. Patch siteverify.js to prevent TypeError crash on missing response tokens
  const siteverifyJsPath = path.join(rootDir, "standalone/src/siteverify.js");
  try {
    let svContent = await fs.readFile(siteverifyJsPath, "utf-8");
    if (!svContent.includes("if (!response || typeof response !== 'string')")) {
      svContent = svContent.replace(
        /const\s*\{\s*secret\s*,\s*response\s*\}\s*=\s*body\s*;?/g,
        `const { secret, response } = body || {};\n    if (!response || typeof response !== "string") {\n      return { success: false, error: "invalid-input-response" };\n    }`
      );
      await fs.writeFile(siteverifyJsPath, svContent, "utf-8");
      console.log("✅ siteverify.js patched successfully with response guard!");
    }
  } catch (err) {
    console.log("ℹ️ siteverify.js not found or skipping patch:", err.message);
  }

  // 2. Patch index.html
  console.log(`📝 Patching ${indexHtmlPath}...`);
  let htmlContent = await fs.readFile(indexHtmlPath, "utf-8");
  if (!htmlContent.includes("/assets/widget.js")) {
    htmlContent = htmlContent.replace(
      `<script src="./public/js/dashboard.js"></script>`,
      `<script src="/assets/widget.js"></script>\n    <script src="./public/js/dashboard.js"></script>`
    );
    await fs.writeFile(indexHtmlPath, htmlContent, "utf-8");
    console.log("✅ index.html patched successfully!");
  } else {
    console.log("ℹ️ index.html already contains widget.js reference.");
  }

  // 3. Patch style.css
  console.log(`📝 Patching ${styleCssPath}...`);
  let cssContent = await fs.readFile(styleCssPath, "utf-8");
  const customStyles = `
/* --- Cap Widget Theming Wizard Styles --- */
.theme-wizard-container {
  background: var(--card-bg, var(--bg-card, rgba(255, 255, 255, 0.03)));
  border: 1px solid var(--border-color, var(--border, rgba(255, 255, 255, 0.1)));
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  color: var(--text-color, var(--text-primary, inherit));
}
.theme-wizard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 16px;
}
@media (max-width: 768px) {
  .theme-wizard-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
.theme-wizard-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.theme-controls-row {
  display: flex;
  gap: 12px;
}
.theme-controls-row > div {
  flex: 1;
}
.theme-field, .theme-field-color, .theme-field-range {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.theme-field label, .theme-field-color label, .theme-field-range label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted, var(--text-secondary, #a0aec0));
}
.theme-select {
  padding: 8px 32px 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color, var(--border, rgba(255, 255, 255, 0.15)));
  background-color: #1e293b;
  color: #f8fafc;
  font-size: 13px;
  outline: none;
  width: 100%;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}
.theme-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
.theme-select option {
  background-color: #0f172a;
  color: #f8fafc;
  padding: 8px 12px;
}
.theme-select option:checked,
.theme-select option:hover,
.theme-select option:focus {
  background-color: #2563eb !important;
  color: #ffffff !important;
}
.color-picker-wrapper {
  display: flex;
  border: 1px solid var(--border-color, var(--border, rgba(255, 255, 255, 0.15)));
  border-radius: 6px;
  overflow: hidden;
  height: 36px;
  background: var(--input-bg, var(--bg-input, rgba(0, 0, 0, 0.2)));
}
.color-picker-wrapper input[type="color"] {
  border: none;
  padding: 0;
  width: 36px;
  height: 36px;
  cursor: pointer;
  background: none;
}
.color-picker-wrapper input[type="text"] {
  border: none;
  padding: 0 10px;
  flex: 1;
  font-size: 13px;
  font-family: monospace;
  background: transparent;
  color: var(--text-color, var(--text-primary, inherit));
  outline: none;
}
.theme-field-range input[type="range"] {
  width: 100%;
  height: 6px;
  background: var(--border-color, var(--border, rgba(255, 255, 255, 0.15)));
  border-radius: 3px;
  outline: none;
  margin: 10px 0;
  -webkit-appearance: none;
}
.theme-field-range input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent, var(--primary, var(--blue, #3182ce)));
  cursor: pointer;
}
.theme-wizard-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.preview-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted, var(--text-secondary, #a0aec0));
}
.preview-box-wrapper {
  border: 1px solid var(--border-color, var(--border, rgba(255, 255, 255, 0.1)));
  border-radius: 8px;
  background: var(--bg-preview, var(--card-bg, rgba(0, 0, 0, 0.15)));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  gap: 16px;
  height: 100%;
  min-height: 180px;
  position: relative;
}
.preview-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.preview-reset-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted, var(--text-secondary, #a0aec0));
  background: var(--card-bg, var(--bg-card, rgba(255, 255, 255, 0.05)));
  border: 1px solid var(--border-color, var(--border, rgba(255, 255, 255, 0.1)));
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.preview-reset-btn:hover {
  background: var(--input-bg, var(--bg-input, rgba(255, 255, 255, 0.1)));
  color: var(--text-color, var(--text-primary, inherit));
}
.theme-save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent, var(--primary, var(--blue, #3182ce)));
  color: #ffffff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: opacity 0.2s;
}
.theme-save-btn:hover {
  opacity: 0.9;
}
.theme-save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;

  if (!cssContent.includes(".theme-wizard-container")) {
    cssContent += customStyles;
    await fs.writeFile(styleCssPath, cssContent, "utf-8");
    console.log("✅ style.css appended successfully!");
  } else {
    console.log("ℹ️ style.css already contains theme-wizard styles.");
  }
}

patch().catch((err) => {
  console.error("❌ Patching failed:", err);
  process.exit(1);
});
