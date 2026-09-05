import fs from "node:fs/promises";
import path from "node:path";

async function patch() {
  const rootDir = process.argv[2] || ".";
  console.log(`🚀 Patching Cap Standalone files in: ${rootDir}`);

  let dashboardJsPath = path.join(rootDir, "standalone/public/js/dashboard.js");
  let indexHtmlPath = path.join(rootDir, "standalone/public/index.html");
  let styleCssPath = path.join(rootDir, "standalone/public/assets/style.css");

  try {
    await fs.access(dashboardJsPath);
  } catch {
    dashboardJsPath = path.join(rootDir, "public/js/dashboard.js");
    indexHtmlPath = path.join(rootDir, "public/index.html");
    styleCssPath = path.join(rootDir, "public/assets/style.css");
  }

  try {
    await fs.access(dashboardJsPath);
  } catch {
    console.log(`ℹ️ Target files not found at ${dashboardJsPath}. Pass target directory as argument: node patch-dashboard.js /path/to/cap`);
    return;
  }

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
    <div class="integration-layout" data-site-key="\${sk}">
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

            <!-- Tab Navigation for Controls -->
            <div class="theme-tab-nav-wrapper">
              <button type="button" class="tab-scroll-arrow left" id="themeTabScrollLeft" aria-label="Scroll left">‹</button>
              <div class="theme-tab-bar" id="themeTabBar">
                <button type="button" class="theme-tab-btn active" data-target="themeTabColors">🎨 Colors & Layout</button>
                <button type="button" class="theme-tab-btn" data-target="themeTabCheckbox">☑️ Checkbox & Spinner</button>
                <button type="button" class="theme-tab-btn" data-target="themeTabLabels">📝 i18n Labels</button>
                <button type="button" class="theme-tab-btn" data-target="themeTabAria">♿ ARIA / A11y</button>
              </div>
              <button type="button" class="tab-scroll-arrow right" id="themeTabScrollRight" aria-label="Scroll right">›</button>
            </div>
            
            <!-- SECTION 1: Colors & Layout -->
            <div id="themeTabColors" class="theme-tab-content">
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

              <div class="theme-controls-row" style="margin-top: 10px;">
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

              <div class="theme-controls-row" style="margin-top: 10px;">
                <div class="theme-field-range">
                  <label>Border Radius (<span id="themeRadiusVal">14px</span>)</label>
                  <input type="range" id="themeRadius" min="0" max="28" value="14" step="1">
                </div>
                <div class="theme-field-range">
                  <label>Widget Width (<span id="themeWidthVal">260px</span>)</label>
                  <input type="range" id="themeWidth" min="180" max="420" value="260" step="5">
                </div>
              </div>

              <div class="theme-controls-row" style="margin-top: 10px;">
                <div class="theme-field-range">
                  <label>Widget Height (<span id="themeHeightVal">54px</span>)</label>
                  <input type="range" id="themeHeight" min="30" max="80" value="54" step="1">
                </div>
                <div class="theme-field-range">
                  <label>Padding (<span id="themePaddingVal">14px</span>)</label>
                  <input type="range" id="themePadding" min="0" max="30" value="14" step="1">
                </div>
              </div>

              <div class="theme-controls-row" style="margin-top: 10px;">
                <div class="theme-field-range">
                  <label>Gap (<span id="themeGapVal">15px</span>)</label>
                  <input type="range" id="themeGap" min="0" max="30" value="15" step="1">
                </div>
                <div class="theme-field">
                  <label>Font Family</label>
                  <input type="text" id="themeFont" value="system-ui, -apple-system, sans-serif" class="theme-select" style="padding: 6px 10px; font-size: 11px; height: 34px;">
                </div>
              </div>
            </div>

            <!-- SECTION 2: Checkbox & Spinner -->
            <div id="themeTabCheckbox" class="theme-tab-content" style="display: none;">
              <div class="theme-controls-row">
                <div class="theme-field-range">
                  <label>Checkbox Size (<span id="themeCheckboxSizeVal">25px</span>)</label>
                  <input type="range" id="themeCheckboxSize" min="16" max="36" value="25" step="1">
                </div>
                <div class="theme-field-range">
                  <label>Checkbox Radius (<span id="themeCheckboxRadiusVal">6px</span>)</label>
                  <input type="range" id="themeCheckboxRadius" min="0" max="16" value="6" step="1">
                </div>
              </div>

              <div class="theme-controls-row" style="margin-top: 10px;">
                <div class="theme-field-range">
                  <label>Checkbox Margin (<span id="themeCheckboxMarginVal">2px</span>)</label>
                  <input type="range" id="themeCheckboxMargin" min="0" max="12" value="2" step="1">
                </div>
                <div class="theme-field">
                  <label>Checkbox Border</label>
                  <input type="text" id="themeCheckboxBorder" value="1px solid #aaaaaad1" class="theme-select" style="padding: 6px 10px; font-size: 11px; height: 34px;">
                </div>
              </div>

              <div class="theme-controls-row" style="margin-top: 10px;">
                <div class="theme-field-color">
                  <label>Checkbox Bg</label>
                  <div class="color-picker-wrapper">
                    <input type="color" id="themeCheckboxBg" value="#fafafa">
                    <input type="text" id="themeCheckboxBgText" value="#fafafa91">
                  </div>
                </div>
                <div class="theme-field-color">
                  <label>Spinner Bar</label>
                  <div class="color-picker-wrapper">
                    <input type="color" id="themeSpinnerColor" value="#000000">
                    <input type="text" id="themeSpinnerColorText" value="#000000">
                  </div>
                </div>
              </div>

              <div class="theme-controls-row" style="margin-top: 10px;">
                <div class="theme-field-color">
                  <label>Spinner Track</label>
                  <div class="color-picker-wrapper">
                    <input type="color" id="themeSpinnerBg" value="#eeeeee">
                    <input type="text" id="themeSpinnerBgText" value="#eeeeee">
                  </div>
                </div>
                <div class="theme-field-range">
                  <label>Spinner Thickness (<span id="themeSpinnerThicknessVal">5px</span>)</label>
                  <input type="range" id="themeSpinnerThickness" min="1" max="10" value="5" step="1">
                </div>
              </div>
            </div>

            <!-- SECTION 3: Custom i18n Labels -->
            <div id="themeTabLabels" class="theme-tab-content" style="display: none;">
              <div class="theme-controls-row">
                <div class="theme-field">
                  <label>Initial State (Idle)</label>
                  <input type="text" id="themeTextIdle" value="Verify you're human" class="theme-select" style="padding: 6px 10px; font-size: 11px; height: 34px;">
                </div>
                <div class="theme-field">
                  <label>Verifying Label</label>
                  <input type="text" id="themeTextVerifying" value="Verifying..." class="theme-select" style="padding: 6px 10px; font-size: 11px; height: 34px;">
                </div>
              </div>
              <div class="theme-controls-row" style="margin-top: 10px;">
                <div class="theme-field">
                  <label>Solved Label</label>
                  <input type="text" id="themeTextDone" value="You're human" class="theme-select" style="padding: 6px 10px; font-size: 11px; height: 34px;">
                </div>
                <div class="theme-field">
                  <label>Error Label</label>
                  <input type="text" id="themeTextError" value="Error" class="theme-select" style="padding: 6px 10px; font-size: 11px; height: 34px;">
                </div>
              </div>
              <div class="theme-controls-row" style="margin-top: 10px;">
                <div class="theme-field">
                  <label>Troubleshooting Link</label>
                  <input type="text" id="themeTextTroubleshooting" value="Troubleshooting" class="theme-select" style="padding: 6px 10px; font-size: 11px; height: 34px;">
                </div>
                <div class="theme-field">
                  <label>Required Field Label</label>
                  <input type="text" id="themeTextRequired" value="Please verify you're human" class="theme-select" style="padding: 6px 10px; font-size: 11px; height: 34px;">
                </div>
              </div>
              <div class="theme-controls-row" style="margin-top: 10px;">
                <div class="theme-field" style="width: 100%;">
                  <label>WASM Disabled Notice</label>
                  <input type="text" id="themeTextWasmDisabled" value="Enable WASM for significantly faster solving" class="theme-select" style="padding: 6px 10px; font-size: 11px; height: 34px;">
                </div>
              </div>
            </div>

            <!-- SECTION 4: ARIA & Accessibility -->
            <div id="themeTabAria" class="theme-tab-content" style="display: none;">
              <div class="theme-controls-row">
                <div class="theme-field">
                  <label>Verify Button ARIA</label>
                  <input type="text" id="themeAriaVerify" value="Click to verify you're a human" class="theme-select" style="padding: 6px 10px; font-size: 11px; height: 34px;">
                </div>
                <div class="theme-field">
                  <label>Verifying ARIA</label>
                  <input type="text" id="themeAriaVerifying" value="Verifying, please wait" class="theme-select" style="padding: 6px 10px; font-size: 11px; height: 34px;">
                </div>
              </div>
              <div class="theme-controls-row" style="margin-top: 10px;">
                <div class="theme-field">
                  <label>Verified ARIA</label>
                  <input type="text" id="themeAriaVerified" value="Verified" class="theme-select" style="padding: 6px 10px; font-size: 11px; height: 34px;">
                </div>
                <div class="theme-field">
                  <label>Error ARIA</label>
                  <input type="text" id="themeAriaError" value="An error occurred, please try again" class="theme-select" style="padding: 6px 10px; font-size: 11px; height: 34px;">
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
    light: { bg: "#ffffff", color: "#0f172a", border: "#e2e8f0", focus: "#2563eb", radius: "12", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #cbd5e1", checkboxBg: "#f8fafc", spinnerColor: "#2563eb", spinnerBg: "#e2e8f0", spinnerThickness: "3" },
    dark: { bg: "#1e293b", color: "#f8fafc", border: "#334155", focus: "#38bdf8", radius: "12", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #475569", checkboxBg: "#0f172a", spinnerColor: "#38bdf8", spinnerBg: "#334155", spinnerThickness: "3" },
    warmAmber: { bg: "#fffbeb", color: "#78350f", border: "#fde68a", focus: "#d97706", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #fcd34d", checkboxBg: "#fef3c7", spinnerColor: "#d97706", spinnerBg: "#fde68a", spinnerThickness: "3" },
    emerald: { bg: "#f0fdf4", color: "#14532d", border: "#bbf7d0", focus: "#16a34a", radius: "14", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "8", checkboxMargin: "2", checkboxBorder: "1.5px solid #86efac", checkboxBg: "#dcfce7", spinnerColor: "#16a34a", spinnerBg: "#bbf7d0", spinnerThickness: "3" },
    cyberpunk: { bg: "#0d0e15", color: "#00ffcc", border: "#ff007f", focus: "#00ffcc", radius: "0", width: "280", height: "52", checkboxSize: "22", checkboxRadius: "0", checkboxMargin: "2", checkboxBorder: "2px solid #ff007f", checkboxBg: "#180022", spinnerColor: "#00ffcc", spinnerBg: "#3d0026", spinnerThickness: "4" },
    stealth: { bg: "#0f172a", color: "#94a3b8", border: "#1e293b", focus: "#38bdf8", radius: "8", width: "260", height: "50", checkboxSize: "22", checkboxRadius: "4", checkboxMargin: "2", checkboxBorder: "1.5px solid #334155", checkboxBg: "#020617", spinnerColor: "#38bdf8", spinnerBg: "#1e293b", spinnerThickness: "3" },
    midnightAmethyst: { bg: "#0f0921", color: "#e9d5ff", border: "#2e1a47", focus: "#c084fc", radius: "14", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "8", checkboxMargin: "2", checkboxBorder: "1.5px solid #4c1d95", checkboxBg: "#1e1035", spinnerColor: "#c084fc", spinnerBg: "#2e1a47", spinnerThickness: "3" },
    dracula: { bg: "#282a36", color: "#f8f8f2", border: "#44475a", focus: "#bd93f9", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #6272a4", checkboxBg: "#21222c", spinnerColor: "#bd93f9", spinnerBg: "#44475a", spinnerThickness: "3" },
    nordicFrost: { bg: "#f8fafc", color: "#1e293b", border: "#e2e8f0", focus: "#0284c7", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #cbd5e1", checkboxBg: "#f1f5f9", spinnerColor: "#0284c7", spinnerBg: "#e2e8f0", spinnerThickness: "3" },
    synthwave: { bg: "#1a0826", color: "#f472b6", border: "#a21caf", focus: "#f43f5e", radius: "6", width: "280", height: "54", checkboxSize: "24", checkboxRadius: "4", checkboxMargin: "2", checkboxBorder: "1.5px solid #f43f5e", checkboxBg: "#2e0c42", spinnerColor: "#f43f5e", spinnerBg: "#581c87", spinnerThickness: "4" },
    solarizedLight: { bg: "#fdf6e3", color: "#586e75", border: "#eee8d5", focus: "#268bd2", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #93a1a1", checkboxBg: "#f5efdc", spinnerColor: "#268bd2", spinnerBg: "#eee8d5", spinnerThickness: "3" },
    solarizedDark: { bg: "#002b36", color: "#839496", border: "#073642", focus: "#268bd2", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #586e75", checkboxBg: "#001e26", spinnerColor: "#268bd2", spinnerBg: "#073642", spinnerThickness: "3" },
    gruvboxDark: { bg: "#282828", color: "#ebdbb2", border: "#3c3836", focus: "#fe8019", radius: "8", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "4", checkboxMargin: "2", checkboxBorder: "1.5px solid #504945", checkboxBg: "#1d2021", spinnerColor: "#fe8019", spinnerBg: "#3c3836", spinnerThickness: "3" },
    gruvboxLight: { bg: "#fbf1c7", color: "#3c3836", border: "#ebdbb2", focus: "#b57614", radius: "8", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "4", checkboxMargin: "2", checkboxBorder: "1.5px solid #d5c4a1", checkboxBg: "#f2e5b1", spinnerColor: "#b57614", spinnerBg: "#ebdbb2", spinnerThickness: "3" },
    retroConsole: { bg: "#000000", color: "#33ff33", border: "#116611", focus: "#33ff33", radius: "0", width: "280", height: "50", checkboxSize: "22", checkboxRadius: "0", checkboxMargin: "2", checkboxBorder: "2px solid #33ff33", checkboxBg: "#002200", spinnerColor: "#33ff33", spinnerBg: "#004400", spinnerThickness: "4" },
    oceanicDeep: { bg: "#04151f", color: "#e0f2fe", border: "#0e3a52", focus: "#2ec4b6", radius: "12", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #14597d", checkboxBg: "#020b10", spinnerColor: "#2ec4b6", spinnerBg: "#0e3a52", spinnerThickness: "3" },
    rosePine: { bg: "#191724", color: "#e0def4", border: "#26233a", focus: "#ebbcba", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #31748f", checkboxBg: "#1f1d2e", spinnerColor: "#ebbcba", spinnerBg: "#26233a", spinnerThickness: "3" },
    rosePineDawn: { bg: "#faf4ed", color: "#575279", border: "#f2e9e1", focus: "#d7827e", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #dfdad9", checkboxBg: "#fffaf3", spinnerColor: "#d7827e", spinnerBg: "#f2e9e1", spinnerThickness: "3" },
    rosePineMoon: { bg: "#232136", color: "#e0def4", border: "#393552", focus: "#c4a7e7", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #44415a", checkboxBg: "#2a273f", spinnerColor: "#c4a7e7", spinnerBg: "#393552", spinnerThickness: "3" },
    minimalStark: { bg: "#ffffff", color: "#000000", border: "#000000", focus: "#000000", radius: "0", width: "260", height: "50", checkboxSize: "22", checkboxRadius: "0", checkboxMargin: "2", checkboxBorder: "2px solid #000000", checkboxBg: "#ffffff", spinnerColor: "#000000", spinnerBg: "#e5e5e5", spinnerThickness: "3" },
    coffeeGrind: { bg: "#2b1e17", color: "#f3e9dc", border: "#4a3525", focus: "#c08a5b", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #6b4d36", checkboxBg: "#1f1510", spinnerColor: "#c08a5b", spinnerBg: "#4a3525", spinnerThickness: "3" },
    royalVelvet: { bg: "#0a1128", color: "#f1f5f9", border: "#1c2541", focus: "#cca43b", radius: "14", width: "275", height: "54", checkboxSize: "24", checkboxRadius: "8", checkboxMargin: "2", checkboxBorder: "1.5px solid #3a506b", checkboxBg: "#050914", spinnerColor: "#cca43b", spinnerBg: "#1c2541", spinnerThickness: "3" },
    tokyoNight: { bg: "#1a1b26", color: "#a9b1d6", border: "#24283b", focus: "#7aa2f7", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #414868", checkboxBg: "#16161e", spinnerColor: "#7aa2f7", spinnerBg: "#24283b", spinnerThickness: "3" },
    crimsonRust: { bg: "#1c0d0d", color: "#fca5a5", border: "#3d1c1c", focus: "#e63946", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #632b2b", checkboxBg: "#120707", spinnerColor: "#e63946", spinnerBg: "#3d1c1c", spinnerThickness: "3" },
    catppuccinMocha: { bg: "#1e1e2e", color: "#cdd6f4", border: "#313244", focus: "#cba6f7", radius: "12", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #45475a", checkboxBg: "#181825", spinnerColor: "#cba6f7", spinnerBg: "#313244", spinnerThickness: "3" },
    catppuccinLatte: { bg: "#eff1f5", color: "#4c4f69", border: "#ccd0da", focus: "#8839ef", radius: "12", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #bcc0cc", checkboxBg: "#e6e9ef", spinnerColor: "#8839ef", spinnerBg: "#ccd0da", spinnerThickness: "3" },
    catppuccinMacchiato: { bg: "#24273a", color: "#cad3f5", border: "#363a4f", focus: "#f5a97f", radius: "12", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #494d64", checkboxBg: "#1e2030", spinnerColor: "#f5a97f", spinnerBg: "#363a4f", spinnerThickness: "3" },
    catppuccinFrappe: { bg: "#303446", color: "#c6d0f5", border: "#414559", focus: "#ca9ee6", radius: "12", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #51576d", checkboxBg: "#292c3c", spinnerColor: "#ca9ee6", spinnerBg: "#414559", spinnerThickness: "3" },
    monokaiPro: { bg: "#2d2a2e", color: "#fcfcfa", border: "#403e41", focus: "#ffd866", radius: "8", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #5b585c", checkboxBg: "#221f22", spinnerColor: "#ffd866", spinnerBg: "#403e41", spinnerThickness: "3" },
    oneDarkPro: { bg: "#282c34", color: "#abb2bf", border: "#3e4451", focus: "#61afef", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #545862", checkboxBg: "#21252b", spinnerColor: "#61afef", spinnerBg: "#3e4451", spinnerThickness: "3" },
    nordicNight: { bg: "#2e3440", color: "#eceff4", border: "#4c566a", focus: "#88c0d0", radius: "8", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #434c5e", checkboxBg: "#242933", spinnerColor: "#88c0d0", spinnerBg: "#4c566a", spinnerThickness: "3" },
    kanagawaDragon: { bg: "#181616", color: "#c5c9c5", border: "#282727", focus: "#e6c384", radius: "8", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #393836", checkboxBg: "#121010", spinnerColor: "#e6c384", spinnerBg: "#282727", spinnerThickness: "3" },
    kanagawaWave: { bg: "#1f1f28", color: "#dcd7ba", border: "#2a2a37", focus: "#7e9cd8", radius: "8", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #363646", checkboxBg: "#16161d", spinnerColor: "#7e9cd8", spinnerBg: "#2a2a37", spinnerThickness: "3" },
    everforestDark: { bg: "#2d353b", color: "#d3c6aa", border: "#3d484f", focus: "#a7c080", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #4f5b62", checkboxBg: "#232a2e", spinnerColor: "#a7c080", spinnerBg: "#3d484f", spinnerThickness: "3" },
    everforestLight: { bg: "#fdf6e3", color: "#5c6a72", border: "#e0dcbe", focus: "#8da101", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #bdba9d", checkboxBg: "#f4eed8", spinnerColor: "#8da101", spinnerBg: "#e0dcbe", spinnerThickness: "3" },
    materialOcean: { bg: "#0f111a", color: "#8f93a2", border: "#1f2233", focus: "#80cbd0", radius: "8", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #30354d", checkboxBg: "#090a10", spinnerColor: "#80cbd0", spinnerBg: "#1f2233", spinnerThickness: "3" },
    nightOwl: { bg: "#011627", color: "#d6deeb", border: "#0b2942", focus: "#82aaff", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #13426b", checkboxBg: "#010d18", spinnerColor: "#82aaff", spinnerBg: "#0b2942", spinnerThickness: "3" },
    palenight: { bg: "#292d3e", color: "#a6accd", border: "#3a3f58", focus: "#c792ea", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #4e5578", checkboxBg: "#1f2230", spinnerColor: "#c792ea", spinnerBg: "#3a3f58", spinnerThickness: "3" },
    cobalt2: { bg: "#193549", color: "#e1efef", border: "#152c3e", focus: "#ffc600", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #234966", checkboxBg: "#0d2130", spinnerColor: "#ffc600", spinnerBg: "#152c3e", spinnerThickness: "3" },
    andromeda: { bg: "#262a33", color: "#d5dec1", border: "#323846", focus: "#00e676", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #475063", checkboxBg: "#1b1e24", spinnerColor: "#00e676", spinnerBg: "#323846", spinnerThickness: "3" },
    shadesOfPurple: { bg: "#2d2b55", color: "#ffffff", border: "#1e1e3f", focus: "#fad000", radius: "12", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #3d3b73", checkboxBg: "#1d1b3a", spinnerColor: "#fad000", spinnerBg: "#1e1e3f", spinnerThickness: "3" },
    horizonDark: { bg: "#1c1e26", color: "#d5d8da", border: "#2e303e", focus: "#e95678", radius: "8", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #43475c", checkboxBg: "#121319", spinnerColor: "#e95678", spinnerBg: "#2e303e", spinnerThickness: "3" },
    cyberneticGold: { bg: "#121212", color: "#e5c07b", border: "#282828", focus: "#d19a66", radius: "4", width: "270", height: "52", checkboxSize: "22", checkboxRadius: "2", checkboxMargin: "2", checkboxBorder: "1.5px solid #3e3e3e", checkboxBg: "#080808", spinnerColor: "#d19a66", spinnerBg: "#282828", spinnerThickness: "3" },
    midnightEmerald: { bg: "#061a14", color: "#a7f3d0", border: "#0e382c", focus: "#10b981", radius: "14", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "8", checkboxMargin: "2", checkboxBorder: "1.5px solid #165b47", checkboxBg: "#020d0a", spinnerColor: "#10b981", spinnerBg: "#0e382c", spinnerThickness: "3" },
    matchaLatte: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0", focus: "#22c55e", radius: "14", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "8", checkboxMargin: "2", checkboxBorder: "1.5px solid #86efac", checkboxBg: "#dcfee5", spinnerColor: "#22c55e", spinnerBg: "#bbf7d0", spinnerThickness: "3" },
    sunsetGlow: { bg: "#1a0f1d", color: "#f472b6", border: "#3b0764", focus: "#f97316", radius: "12", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #581c87", checkboxBg: "#100813", spinnerColor: "#f97316", spinnerBg: "#3b0764", spinnerThickness: "3" },
    matrixCyber: { bg: "#050d08", color: "#22c55e", border: "#14532d", focus: "#4ade80", radius: "2", width: "280", height: "52", checkboxSize: "22", checkboxRadius: "0", checkboxMargin: "2", checkboxBorder: "2px solid #16a34a", checkboxBg: "#020804", spinnerColor: "#4ade80", spinnerBg: "#14532d", spinnerThickness: "4" },
    lavenderMist: { bg: "#faf5ff", color: "#6b21a8", border: "#e9d5ff", focus: "#a855f7", radius: "16", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "8", checkboxMargin: "2", checkboxBorder: "1.5px solid #d8b4fe", checkboxBg: "#f3e8ff", spinnerColor: "#a855f7", spinnerBg: "#e9d5ff", spinnerThickness: "3" },
    oxfordNavy: { bg: "#0f172a", color: "#e2e8f0", border: "#1e293b", focus: "#38bdf8", radius: "10", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "6", checkboxMargin: "2", checkboxBorder: "1.5px solid #334155", checkboxBg: "#090e1a", spinnerColor: "#38bdf8", spinnerBg: "#1e293b", spinnerThickness: "3" },
    cherryBlossom: { bg: "#fff5f7", color: "#9d174d", border: "#fbcfe8", focus: "#ec4899", radius: "14", width: "270", height: "54", checkboxSize: "24", checkboxRadius: "8", checkboxMargin: "2", checkboxBorder: "1.5px solid #f472b6", checkboxBg: "#fce7f3", spinnerColor: "#ec4899", spinnerBg: "#fbcfe8", spinnerThickness: "3" }
  };

  const heightInput = root.querySelector("#themeHeight");
  const heightVal = root.querySelector("#themeHeightVal");
  const paddingInput = root.querySelector("#themePadding");
  const paddingVal = root.querySelector("#themePaddingVal");
  const gapInput = root.querySelector("#themeGap");
  const gapVal = root.querySelector("#themeGapVal");
  const fontInput = root.querySelector("#themeFont");

  const checkboxSizeInput = root.querySelector("#themeCheckboxSize");
  const checkboxSizeVal = root.querySelector("#themeCheckboxSizeVal");
  const checkboxRadiusInput = root.querySelector("#themeCheckboxRadius");
  const checkboxRadiusVal = root.querySelector("#themeCheckboxRadiusVal");
  const checkboxMarginInput = root.querySelector("#themeCheckboxMargin");
  const checkboxMarginVal = root.querySelector("#themeCheckboxMarginVal");
  const checkboxBorderInput = root.querySelector("#themeCheckboxBorder");
  const checkboxBgInput = root.querySelector("#themeCheckboxBg");
  const checkboxBgText = root.querySelector("#themeCheckboxBgText");

  const spinnerColorInput = root.querySelector("#themeSpinnerColor");
  const spinnerColorText = root.querySelector("#themeSpinnerColorText");
  const spinnerBgInput = root.querySelector("#themeSpinnerBg");
  const spinnerBgText = root.querySelector("#themeSpinnerBgText");
  const spinnerThicknessInput = root.querySelector("#themeSpinnerThickness");
  const spinnerThicknessVal = root.querySelector("#themeSpinnerThicknessVal");

  // i18n inputs
  const textTroubleshootingInput = root.querySelector("#themeTextTroubleshooting");
  const textWasmDisabledInput = root.querySelector("#themeTextWasmDisabled");
  const textRequiredInput = root.querySelector("#themeTextRequired");

  // ARIA inputs
  const ariaVerifyInput = root.querySelector("#themeAriaVerify");
  const ariaVerifyingInput = root.querySelector("#themeAriaVerifying");
  const ariaVerifiedInput = root.querySelector("#themeAriaVerified");
  const ariaErrorInput = root.querySelector("#themeAriaError");

  // Wire Tab Navigation
  const tabTabBar = root.querySelector("#themeTabBar");
  const tabScrollLeftBtn = root.querySelector("#themeTabScrollLeft");
  const tabScrollRightBtn = root.querySelector("#themeTabScrollRight");
  const tabBtns = root.querySelectorAll(".theme-tab-btn");
  const tabContents = root.querySelectorAll(".theme-tab-content");

  function updateScrollArrows() {
    if (!tabTabBar) return;
    const maxScroll = tabTabBar.scrollWidth - tabTabBar.clientWidth;
    if (maxScroll <= 2) {
      if (tabScrollLeftBtn) tabScrollLeftBtn.style.display = "none";
      if (tabScrollRightBtn) tabScrollRightBtn.style.display = "none";
    } else {
      if (tabScrollLeftBtn) {
        tabScrollLeftBtn.style.display = "flex";
        if (tabTabBar.scrollLeft <= 2) tabScrollLeftBtn.classList.add("disabled");
        else tabScrollLeftBtn.classList.remove("disabled");
      }
      if (tabScrollRightBtn) {
        tabScrollRightBtn.style.display = "flex";
        if (tabTabBar.scrollLeft >= maxScroll - 2) tabScrollRightBtn.classList.add("disabled");
        else tabScrollRightBtn.classList.remove("disabled");
      }
    }
  }

  if (tabScrollLeftBtn && tabTabBar) {
    tabScrollLeftBtn.onclick = (e) => {
      e.preventDefault();
      tabTabBar.scrollBy({ left: -140, behavior: "smooth" });
    };
  }
  if (tabScrollRightBtn && tabTabBar) {
    tabScrollRightBtn.onclick = (e) => {
      e.preventDefault();
      tabTabBar.scrollBy({ left: 140, behavior: "smooth" });
    };
  }

  if (tabTabBar) {
    tabTabBar.addEventListener("scroll", updateScrollArrows);
    window.addEventListener("resize", updateScrollArrows);
    setTimeout(updateScrollArrows, 100);

    // Mouse wheel horizontal scrolling
    tabTabBar.addEventListener("wheel", (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        tabTabBar.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // Click & Drag horizontal scroll on tab bar
    let isMouseDown = false;
    let startX = 0;
    let scrollLeftStart = 0;

    tabTabBar.addEventListener("mousedown", (e) => {
      isMouseDown = true;
      startX = e.pageX - tabTabBar.offsetLeft;
      scrollLeftStart = tabTabBar.scrollLeft;
      tabTabBar.classList.add("is-dragging");
    });

    window.addEventListener("mousemove", (e) => {
      if (!isMouseDown) return;
      const x = e.pageX - tabTabBar.offsetLeft;
      const walk = (x - startX) * 1.5;
      tabTabBar.scrollLeft = scrollLeftStart - walk;
    });

    window.addEventListener("mouseup", () => {
      if (isMouseDown) {
        isMouseDown = false;
        tabTabBar.classList.remove("is-dragging");
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Auto-center active tab smoothly into view
      btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

      tabContents.forEach(c => {
        if (c.id === targetId) {
          c.style.display = "block";
        } else {
          c.style.display = "none";
        }
      });
      updateScrollArrows();
    });
  });

  function updatePreviewAndCode() {
    const bg = bgInput.value;
    const color = colorInput.value;
    const border = borderInput.value;
    const focus = focusInput.value;
    const radius = radiusInput.value + "px";
    const width = widthInput.value + "px";
    const height = heightInput ? heightInput.value + "px" : "54px";
    const padding = paddingInput ? paddingInput.value + "px" : "14px";
    const gap = gapInput ? gapInput.value + "px" : "15px";
    const font = fontInput ? fontInput.value : "system-ui, -apple-system, sans-serif";

    const checkboxSize = checkboxSizeInput ? checkboxSizeInput.value + "px" : "25px";
    const checkboxRadius = checkboxRadiusInput ? checkboxRadiusInput.value + "px" : "6px";
    const checkboxMargin = checkboxMarginInput ? checkboxMarginInput.value + "px" : "2px";
    const checkboxBorder = checkboxBorderInput ? checkboxBorderInput.value : "1px solid #aaaaaad1";
    const checkboxBg = checkboxBgInput ? checkboxBgInput.value : "#fafafa";
    const spinnerColor = spinnerColorInput ? spinnerColorInput.value : "#000000";
    const spinnerBg = spinnerBgInput ? spinnerBgInput.value : "#eeeeee";
    const spinnerThickness = spinnerThicknessInput ? spinnerThicknessInput.value + "px" : "5px";

    radiusVal.textContent = radius;
    widthVal.textContent = width;
    if (heightVal && heightInput) heightVal.textContent = height;
    if (paddingVal && paddingInput) paddingVal.textContent = padding;
    if (gapVal && gapInput) gapVal.textContent = gap;
    if (checkboxSizeVal && checkboxSizeInput) checkboxSizeVal.textContent = checkboxSize;
    if (checkboxRadiusVal && checkboxRadiusInput) checkboxRadiusVal.textContent = checkboxRadius;
    if (checkboxMarginVal && checkboxMarginInput) checkboxMarginVal.textContent = checkboxMargin;
    if (spinnerThicknessVal && spinnerThicknessInput) spinnerThicknessVal.textContent = spinnerThickness;

    const widgetEl = previewBox.querySelector("cap-widget");
    const textIdle = textIdleInput ? textIdleInput.value : "Verify you're human";
    const textVerifying = textVerifyingInput ? textVerifyingInput.value : "Verifying...";
    const textDone = textDoneInput ? textDoneInput.value : "You're human";
    const textError = textErrorInput ? textErrorInput.value : "Error";
    const textTroubleshooting = textTroubleshootingInput ? textTroubleshootingInput.value : "Troubleshooting";
    const textWasmDisabled = textWasmDisabledInput ? textWasmDisabledInput.value : "Enable WASM for significantly faster solving";
    const textRequired = textRequiredInput ? textRequiredInput.value : "Please verify you're human";

    const ariaVerify = ariaVerifyInput ? ariaVerifyInput.value : "Click to verify you're a human";
    const ariaVerifying = ariaVerifyingInput ? ariaVerifyingInput.value : "Verifying, please wait";
    const ariaVerified = ariaVerifiedInput ? ariaVerifiedInput.value : "Verified";
    const ariaError = ariaErrorInput ? ariaErrorInput.value : "An error occurred, please try again";

    if (widgetEl) {
      widgetEl.style.setProperty("--cap-background", bg);
      widgetEl.style.setProperty("--cap-color", color);
      widgetEl.style.setProperty("--cap-border-color", border);
      widgetEl.style.setProperty("--cap-focus-ring", focus);
      widgetEl.style.setProperty("--cap-border-radius", radius);
      widgetEl.style.setProperty("--cap-widget-width", width);
      widgetEl.style.setProperty("--cap-widget-height", height);
      widgetEl.style.setProperty("--cap-widget-padding", padding);
      widgetEl.style.setProperty("--cap-gap", gap);
      widgetEl.style.setProperty("--cap-font", font);

      widgetEl.style.setProperty("--cap-checkbox-size", checkboxSize);
      widgetEl.style.setProperty("--cap-checkbox-border", checkboxBorder);
      widgetEl.style.setProperty("--cap-checkbox-border-radius", checkboxRadius);
      widgetEl.style.setProperty("--cap-checkbox-background", checkboxBg);
      widgetEl.style.setProperty("--cap-checkbox-margin", checkboxMargin);

      widgetEl.style.setProperty("--cap-spinner-color", spinnerColor);
      widgetEl.style.setProperty("--cap-spinner-background-color", spinnerBg);
      widgetEl.style.setProperty("--cap-spinner-thickness", spinnerThickness);

      widgetEl.setAttribute("data-cap-i18n-initial-state", textIdle);
      widgetEl.setAttribute("data-cap-i18n-verifying-label", textVerifying);
      widgetEl.setAttribute("data-cap-i18n-solved-label", textDone);
      widgetEl.setAttribute("data-cap-i18n-error-label", textError);
      widgetEl.setAttribute("data-cap-i18n-troubleshooting-label", textTroubleshooting);
      widgetEl.setAttribute("data-cap-i18n-wasm-disabled", textWasmDisabled);
      widgetEl.setAttribute("data-cap-i18n-required-label", textRequired);

      widgetEl.setAttribute("data-cap-i18n-verify-aria-label", ariaVerify);
      widgetEl.setAttribute("data-cap-i18n-verifying-aria-label", ariaVerifying);
      widgetEl.setAttribute("data-cap-i18n-verified-aria-label", ariaVerified);
      widgetEl.setAttribute("data-cap-i18n-error-aria-label", ariaError);

      if (typeof widgetEl.animateLabel === "function") {
        widgetEl.animateLabel(textIdle);
      } else if (widgetEl.shadowRoot) {
        const labelEl = widgetEl.shadowRoot.querySelector(".label.active");
        if (labelEl) labelEl.textContent = textIdle;
      }
    }

    const siteKey = (key && key.siteKey) ? key.siteKey : (root.getAttribute("data-site-key") || root.dataset.siteKey || "");
    const origin = location.origin;
    const endpoint = origin + "/" + siteKey + "/";
    const styleAttr = 'style="--cap-background: ' + bg + '; --cap-color: ' + color + '; --cap-border-color: ' + border + '; --cap-focus-ring: ' + focus + '; --cap-border-radius: ' + radius + '; --cap-widget-width: ' + width + '; --cap-widget-height: ' + height + '; --cap-widget-padding: ' + padding + '; --cap-gap: ' + gap + '; --cap-font: ' + font + '; --cap-checkbox-size: ' + checkboxSize + '; --cap-checkbox-border: ' + checkboxBorder + '; --cap-checkbox-border-radius: ' + checkboxRadius + '; --cap-checkbox-background: ' + checkboxBg + '; --cap-checkbox-margin: ' + checkboxMargin + '; --cap-spinner-color: ' + spinnerColor + '; --cap-spinner-background-color: ' + spinnerBg + '; --cap-spinner-thickness: ' + spinnerThickness + ';"';
    
    const i18nAttrs = 'data-cap-i18n-initial-state="' + textIdle + '"\\n  data-cap-i18n-verifying-label="' + textVerifying + '"\\n  data-cap-i18n-solved-label="' + textDone + '"\\n  data-cap-i18n-error-label="' + textError + '"\\n  data-cap-i18n-troubleshooting-label="' + textTroubleshooting + '"\\n  data-cap-i18n-wasm-disabled="' + textWasmDisabled + '"\\n  data-cap-i18n-required-label="' + textRequired + '"\\n  data-cap-i18n-verify-aria-label="' + ariaVerify + '"\\n  data-cap-i18n-verifying-aria-label="' + ariaVerifying + '"\\n  data-cap-i18n-verified-aria-label="' + ariaVerified + '"\\n  data-cap-i18n-error-aria-label="' + ariaError + '"';
    
    const widgetSnippet = '<script src="' + origin + '/assets/widget.js"></script>\\n<cap-widget data-cap-api-endpoint="' + endpoint + '"\\n  ' + i18nAttrs + '\\n  ' + styleAttr + '>\\n</cap-widget>';

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
  if (checkboxBgInput && checkboxBgText) setupColorSync(checkboxBgInput, checkboxBgText);
  if (spinnerColorInput && spinnerColorText) setupColorSync(spinnerColorInput, spinnerColorText);
  if (spinnerBgInput && spinnerBgText) setupColorSync(spinnerBgInput, spinnerBgText);

  [radiusInput, widthInput, heightInput, paddingInput, gapInput, checkboxSizeInput, checkboxRadiusInput, checkboxMarginInput, spinnerThicknessInput].forEach(inp => {
    if (inp) {
      inp.addEventListener("input", () => {
        presetSelect.value = "custom";
        updatePreviewAndCode();
      });
    }
  });

  [fontInput, checkboxBorderInput, textIdleInput, textVerifyingInput, textDoneInput, textErrorInput, textTroubleshootingInput, textWasmDisabledInput, textRequiredInput, ariaVerifyInput, ariaVerifyingInput, ariaVerifiedInput, ariaErrorInput].forEach(inp => {
    if (inp) {
      inp.addEventListener("input", () => {
        presetSelect.value = "custom";
        updatePreviewAndCode();
      });
    }
  });

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
      if (checkboxSizeInput) checkboxSizeInput.value = p.checkboxSize || "24";
      if (checkboxRadiusInput) checkboxRadiusInput.value = p.checkboxRadius || "6";
      if (checkboxMarginInput) checkboxMarginInput.value = p.checkboxMargin || "2";
      if (checkboxBorderInput) checkboxBorderInput.value = p.checkboxBorder || ("1px solid " + p.border);
      
      if (checkboxBgInput) {
        checkboxBgInput.value = (p.checkboxBg && p.checkboxBg.startsWith("#")) ? p.checkboxBg.slice(0, 7) : p.bg;
        if (checkboxBgText) checkboxBgText.value = (p.checkboxBg || p.bg).toUpperCase();
      }
      if (spinnerColorInput) {
        spinnerColorInput.value = (p.spinnerColor && p.spinnerColor.startsWith("#")) ? p.spinnerColor.slice(0, 7) : p.focus;
        if (spinnerColorText) spinnerColorText.value = (p.spinnerColor || p.focus).toUpperCase();
      }
      if (spinnerBgInput) {
        spinnerBgInput.value = (p.spinnerBg && p.spinnerBg.startsWith("#")) ? p.spinnerBg.slice(0, 7) : p.border;
        if (spinnerBgText) spinnerBgText.value = (p.spinnerBg || p.border).toUpperCase();
      }
      if (spinnerThicknessInput) spinnerThicknessInput.value = p.spinnerThickness || "3";

      updatePreviewAndCode();
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const siteKey = (key && key.siteKey) ? key.siteKey : (root.getAttribute("data-site-key") || root.dataset.siteKey || "");
      const origin = location.origin;
      const endpoint = \`\${origin}/\${siteKey}/\`;
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
          padding: paddingInput ? paddingInput.value + "px" : "14px",
          gap: gapInput ? gapInput.value + "px" : "15px",
          font: fontInput ? fontInput.value : "system-ui, -apple-system, sans-serif",
          checkboxSize: checkboxSizeInput ? checkboxSizeInput.value + "px" : "25px",
          checkboxBorder: checkboxBorderInput ? checkboxBorderInput.value : "1px solid #aaaaaad1",
          checkboxRadius: checkboxRadiusInput ? checkboxRadiusInput.value + "px" : "6px",
          checkboxBg: checkboxBgInput ? checkboxBgInput.value : "#fafafa",
          checkboxMargin: checkboxMarginInput ? checkboxMarginInput.value + "px" : "2px",
          spinnerColor: spinnerColorInput ? spinnerColorInput.value : "#000000",
          spinnerBg: spinnerBgInput ? spinnerBgInput.value : "#eeeeee",
          spinnerThickness: spinnerThicknessInput ? spinnerThicknessInput.value + "px" : "5px",
          textIdle: textIdleInput ? textIdleInput.value : "Verify you're human",
          textVerifying: textVerifyingInput ? textVerifyingInput.value : "Verifying...",
          textDone: textDoneInput ? textDoneInput.value : "You're human",
          textError: textErrorInput ? textErrorInput.value : "Error",
          textTroubleshooting: textTroubleshootingInput ? textTroubleshootingInput.value : "Troubleshooting",
          textWasmDisabled: textWasmDisabledInput ? textWasmDisabledInput.value : "Enable WASM for significantly faster solving",
          textRequired: textRequiredInput ? textRequiredInput.value : "Please verify you're human",
          ariaVerify: ariaVerifyInput ? ariaVerifyInput.value : "Click to verify you're a human",
          ariaVerifying: ariaVerifyingInput ? ariaVerifyingInput.value : "Verifying, please wait",
          ariaVerified: ariaVerifiedInput ? ariaVerifiedInput.value : "Verified",
          ariaError: ariaErrorInput ? ariaErrorInput.value : "An error occurred, please try again"
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
    const patchInsertion = `\n  if (typeof wireThemeWizard === "function") {\n    const k = (typeof selectedKey !== "undefined") ? selectedKey : null;\n    wireThemeWizard(root, k);\n  }\n`;
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
      const {
        bg, color, border, focus, radius, width, height, padding, gap, font,
        checkboxSize, checkboxBorder, checkboxRadius, checkboxBg, checkboxMargin,
        spinnerColor, spinnerBg, spinnerThickness,
        textIdle, textVerifying, textDone, textError
      } = body;
      const templateCss = await Bun.file("/usr/src/app/assets/cap.css.template").text();

      // Prepend host-level CSS custom property definitions
      const hostCss = \`:host{--cap-background:\${bg};--cap-color:\${color};--cap-border-color:\${border};--cap-focus-ring:\${focus};--cap-border-radius:\${radius};--cap-widget-width:\${width};--cap-widget-height:\${height || "54px"};--cap-widget-padding:\${padding || "14px"};--cap-gap:\${gap || "15px"};--cap-font:\${font || "system-ui, -apple-system, sans-serif"};--cap-checkbox-size:\${checkboxSize || "25px"};--cap-checkbox-border:\${checkboxBorder || "1px solid #aaaaaad1"};--cap-checkbox-border-radius:\${checkboxRadius || "6px"};--cap-checkbox-background:\${checkboxBg || "#fafafa91"};--cap-checkbox-margin:\${checkboxMargin || "2px"};--cap-spinner-color:\${spinnerColor || "#000000"};--cap-spinner-background-color:\${spinnerBg || "#eeeeee"};--cap-spinner-thickness:\${spinnerThickness || "5px"};}\`;

      // Replace var(--cap-xxx, default) fallbacks throughout the stylesheet
      let newCss = hostCss + templateCss
        .replace(/var\(--cap-background\\s*,\\s*[^)]+\)/g, \`var(--cap-background, \${bg})\`)
        .replace(/var\(--cap-color\\s*,\\s*[^)]+\)/g, \`var(--cap-color, \${color})\`)
        .replace(/var\(--cap-border-color\\s*,\\s*[^)]+\)/g, \`var(--cap-border-color, \${border})\`)
        .replace(/var\(--cap-focus-ring\\s*,\\s*[^)]+\)/g, \`var(--cap-focus-ring, \${focus})\`)
        .replace(/var\(--cap-border-radius\\s*,\\s*[^)]+\)/g, \`var(--cap-border-radius, \${radius})\`)
        .replace(/var\(--cap-widget-width\\s*,\\s*[^)]+\)/g, \`var(--cap-widget-width, \${width})\`)
        .replace(/var\(--cap-widget-height\\s*,\\s*[^)]+\)/g, \`var(--cap-widget-height, \${height || "54px"})\`)
        .replace(/var\(--cap-widget-padding\\s*,\\s*[^)]+\)/g, \`var(--cap-widget-padding, \${padding || "14px"})\`)
        .replace(/var\(--cap-gap\\s*,\\s*[^)]+\)/g, \`var(--cap-gap, \${gap || "15px"})\`)
        .replace(/var\(--cap-font\\s*,\\s*[^)]+\)/g, \`var(--cap-font, \${font || "system-ui, -apple-system, sans-serif"})\`)
        .replace(/var\(--cap-checkbox-size\\s*,\\s*[^)]+\)/g, \`var(--cap-checkbox-size, \${checkboxSize || "25px"})\`)
        .replace(/var\(--cap-checkbox-border\\s*,\\s*[^)]+\)/g, \`var(--cap-checkbox-border, \${checkboxBorder || "1px solid #aaaaaad1"})\`)
        .replace(/var\(--cap-checkbox-border-radius\\s*,\\s*[^)]+\)/g, \`var(--cap-checkbox-border-radius, \${checkboxRadius || "6px"})\`)
        .replace(/var\(--cap-checkbox-background\\s*,\\s*[^)]+\)/g, \`var(--cap-checkbox-background, \${checkboxBg || "#fafafa91"})\`)
        .replace(/var\(--cap-checkbox-margin\\s*,\\s*[^)]+\)/g, \`var(--cap-checkbox-margin, \${checkboxMargin || "2px"})\`)
        .replace(/var\(--cap-spinner-color\\s*,\\s*[^)]+\)/g, \`var(--cap-spinner-color, \${spinnerColor || "#000000"})\`)
        .replace(/var\(--cap-spinner-background-color\\s*,\\s*[^)]+\)/g, \`var(--cap-spinner-background-color, \${spinnerBg || "#eeeeee"})\`)
        .replace(/var\(--cap-spinner-thickness\\s*,\\s*[^)]+\)/g, \`var(--cap-spinner-thickness, \${spinnerThickness || "5px"})\`);

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
  width: 100%;
  box-sizing: border-box;
}
.theme-wizard-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  margin-top: 16px;
}
@media (max-width: 900px) {
  .theme-wizard-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
.theme-wizard-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.theme-tab-nav-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  margin-bottom: 14px;
  background: var(--bg-card, rgba(15, 23, 42, 0.6));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  border-radius: 10px;
  padding: 4px;
  min-width: 0;
}
.theme-tab-bar {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  user-select: none;
  -webkit-user-select: none;
  cursor: grab;
  padding: 2px;
  width: 100%;
}
.theme-tab-bar::-webkit-scrollbar {
  display: none;
}
.theme-tab-bar.is-dragging {
  cursor: grabbing;
  scroll-behavior: auto;
}
.theme-tab-btn {
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--text-muted, #94a3b8);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}
.theme-tab-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
}
.theme-tab-btn.active {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
}
.tab-scroll-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(30, 41, 59, 0.9);
  color: #cbd5e1;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
  z-index: 2;
}
.tab-scroll-arrow:hover {
  background: #334155;
  color: #ffffff;
  border-color: #3b82f6;
}
.tab-scroll-arrow.disabled {
  opacity: 0.3;
  pointer-events: none;
}
.theme-controls-row {
  display: flex;
  gap: 12px;
}
.theme-controls-row > div {
  flex: 1;
  min-width: 0;
}
.theme-field, .theme-field-color, .theme-field-range {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
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
  min-width: 0;
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
  padding: 24px 12px;
  gap: 16px;
  height: 100%;
  min-height: 180px;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  overflow-x: auto;
}
.preview-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  padding: 4px;
}
.preview-box cap-widget {
  max-width: 100%;
  box-sizing: border-box;
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

  if (cssContent.includes("/* --- Cap Widget Theming Wizard Styles --- */")) {
    const idx = cssContent.indexOf("/* --- Cap Widget Theming Wizard Styles --- */");
    cssContent = cssContent.slice(0, idx) + customStyles;
    await fs.writeFile(styleCssPath, cssContent, "utf-8");
    console.log("✅ style.css updated successfully!");
  } else {
    cssContent += customStyles;
    await fs.writeFile(styleCssPath, cssContent, "utf-8");
    console.log("✅ style.css appended successfully!");
  }
}

patch().catch((err) => {
  console.error("❌ Patching failed:", err);
  process.exit(1);
});
