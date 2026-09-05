import { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Code, 
  RefreshCw, 
  CheckCircle, 
  Copy, 
  Check, 
  Sparkles, 
  Terminal, 
  Sliders,
  Flame,
  Workflow
} from 'lucide-react';

interface ThemeVars {
  background: string;
  borderColor: string;
  borderRadius: string;
  color: string;
  focusRing: string;
  widgetWidth: string;
}

const presets: Record<string, { name: string; vars: ThemeVars }> = {
  light: {
    name: 'Default Light',
    vars: {
      background: '#fdfdfd',
      borderColor: '#dddddd',
      borderRadius: '14px',
      color: '#212121',
      focusRing: '#0066cc',
      widgetWidth: '260px'
    }
  },
  dark: {
    name: 'Classic Dark',
    vars: {
      background: '#1a1a1a',
      borderColor: '#333333',
      borderRadius: '14px',
      color: '#f7fafc',
      focusRing: '#3182ce',
      widgetWidth: '260px'
    }
  },
  warmAmber: {
    name: 'Warm Amber',
    vars: {
      background: '#fffbeb',
      borderColor: '#fef3c7',
      borderRadius: '10px',
      color: '#78350f',
      focusRing: '#d97706',
      widgetWidth: '260px'
    }
  },
  emerald: {
    name: 'Emerald Forest',
    vars: {
      background: '#f0fdf4',
      borderColor: '#dcfce7',
      borderRadius: '16px',
      color: '#14532d',
      focusRing: '#16a34a',
      widgetWidth: '280px'
    }
  },
  cyberpunk: {
    name: 'Cyberpunk Neon',
    vars: {
      background: '#0d0e15',
      borderColor: '#ff007f',
      borderRadius: '0px',
      color: '#00ffcc',
      focusRing: '#00ffcc',
      widgetWidth: '300px'
    }
  },
  stealth: {
    name: 'Stealth Slate',
    vars: {
      background: '#0f172a',
      borderColor: '#1e293b',
      borderRadius: '8px',
      color: '#94a3b8',
      focusRing: '#38bdf8',
      widgetWidth: '250px'
    }
  },
  midnightAmethyst: {
    name: 'Midnight Amethyst',
    vars: {
      background: '#0a0518',
      borderColor: '#241242',
      borderRadius: '12px',
      color: '#c084fc',
      focusRing: '#a855f7',
      widgetWidth: '270px'
    }
  },
  dracula: {
    name: 'Dracula Dark',
    vars: {
      background: '#282a36',
      borderColor: '#44475a',
      borderRadius: '8px',
      color: '#f8f8f2',
      focusRing: '#bd93f9',
      widgetWidth: '265px'
    }
  },
  nordicFrost: {
    name: 'Nordic Frost',
    vars: {
      background: '#f8fafc',
      borderColor: '#e2e8f0',
      borderRadius: '10px',
      color: '#334155',
      focusRing: '#0284c7',
      widgetWidth: '260px'
    }
  },
  synthwave: {
    name: 'Synthwave Outrun',
    vars: {
      background: '#1a0826',
      borderColor: '#f43f5e',
      borderRadius: '4px',
      color: '#f472b6',
      focusRing: '#f43f5e',
      widgetWidth: '290px'
    }
  },
  solarizedLight: {
    name: 'Solarized Light',
    vars: {
      background: '#fdf6e3',
      borderColor: '#eee8d5',
      borderRadius: '12px',
      color: '#586e75',
      focusRing: '#268bd2',
      widgetWidth: '260px'
    }
  },
  gruvboxDark: {
    name: 'Gruvbox Dark',
    vars: {
      background: '#282828',
      borderColor: '#3c3836',
      borderRadius: '6px',
      color: '#ebdbb2',
      focusRing: '#fe8019',
      widgetWidth: '270px'
    }
  },
  retroConsole: {
    name: 'Retro Console',
    vars: {
      background: '#000000',
      borderColor: '#33ff33',
      borderRadius: '0px',
      color: '#33ff33',
      focusRing: '#33ff33',
      widgetWidth: '280px'
    }
  },
  oceanicDeep: {
    name: 'Oceanic Deep',
    vars: {
      background: '#04151f',
      borderColor: '#113f59',
      borderRadius: '14px',
      color: '#2ec4b6',
      focusRing: '#2ec4b6',
      widgetWidth: '260px'
    }
  },
  rosePine: {
    name: 'Rose Pine',
    vars: {
      background: '#191724',
      borderColor: '#26233a',
      borderRadius: '8px',
      color: '#e0def4',
      focusRing: '#ebbcac',
      widgetWidth: '260px'
    }
  },
  minimalStark: {
    name: 'Minimal Stark',
    vars: {
      background: '#ffffff',
      borderColor: '#111111',
      borderRadius: '0px',
      color: '#111111',
      focusRing: '#111111',
      widgetWidth: '250px'
    }
  },
  coffeeGrind: {
    name: 'Coffee Grind',
    vars: {
      background: '#2b1e17',
      borderColor: '#4a3525',
      borderRadius: '10px',
      color: '#d4bda8',
      focusRing: '#8c6239',
      widgetWidth: '260px'
    }
  },
  royalVelvet: {
    name: 'Royal Velvet',
    vars: {
      background: '#0a1128',
      borderColor: '#1c2541',
      borderRadius: '16px',
      color: '#e2e8f0',
      focusRing: '#cca43b',
      widgetWidth: '275px'
    }
  },
  tokyoNight: {
    name: 'Tokyo Night',
    vars: {
      background: '#1a1b26',
      borderColor: '#24283b',
      borderRadius: '8px',
      color: '#a9b1d6',
      focusRing: '#7aa2f7',
      widgetWidth: '260px'
    }
  },
  crimsonRust: {
    name: 'Crimson Rust',
    vars: {
      background: '#1c0d0d',
      borderColor: '#3d1c1c',
      borderRadius: '12px',
      color: '#ff6b6b',
      focusRing: '#e63946',
      widgetWidth: '265px'
    }
  }
};

export default function App() {
  const [theme, setTheme] = useState<ThemeVars>({ ...presets.light.vars });
  const [activePreset, setActivePreset] = useState<string>('light');
  const [captchaState, setCaptchaState] = useState<'idle' | 'verifying' | 'done' | 'error'>('idle');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [copystate, setCopystate] = useState<string>('Copy Snippet');
  const [activeTab, setActiveTab] = useState<'customize' | 'authentik' | 'snippet'>('customize');
  
  // Custom texts
  const [textIdle, setTextIdle] = useState<string>('Verify with Cap');
  const [textVerifying, setTextVerifying] = useState<string>('Solving Proof-of-Work...');
  const [textDone, setTextDone] = useState<string>('Verification Complete');
  const [textError, setTextError] = useState<string>('Failed to verify');

  // Simulated PoW logging
  const [logs, setLogs] = useState<string[]>([
    'System: Cap CAPTCHA Studio initialized.',
    'Ready: Choose presets or customize variables.',
    'Action: Click the Cap Widget to solve a simulated PoW challenge.'
  ]);
  const [hashRate, setHashRate] = useState<number>(0);
  const [nonceCount, setNonceCount] = useState<number>(0);
  const [solveDuration, setSolveDuration] = useState<number>(0);
  const [isRunningPoW, setIsRunningPoW] = useState<boolean>(false);
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Scroll terminal logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Handle CSS variable injection to preview widget
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--cap-background', theme.background);
    root.style.setProperty('--cap-border-color', theme.borderColor);
    root.style.setProperty('--cap-border-radius', theme.borderRadius);
    root.style.setProperty('--cap-color', theme.color);
    root.style.setProperty('--cap-focus-ring', theme.focusRing);
    root.style.setProperty('--cap-widget-width', theme.widgetWidth);
  }, [theme]);

  const handlePresetSelect = (key: string) => {
    setActivePreset(key);
    setTheme({ ...presets[key].vars });
    setLogs(prev => [
      ...prev,
      `[Preset] Loaded preset: "${presets[key].name}"`
    ]);
  };

  const handleValChange = (field: keyof ThemeVars, value: string) => {
    setActivePreset('custom');
    setTheme(prev => ({ ...prev, [field]: value }));
  };

  const startProofOfWork = async () => {
    if (isRunningPoW) return;
    setIsRunningPoW(true);
    setCaptchaState('verifying');
    setLogs(prev => [
      ...prev,
      `[PoW Initiated] Challenge Salt: "${Math.random().toString(36).substring(2, 10)}"`,
      `[PoW Target] Prefix: "0000"`,
      `[PoW Worker] Mining thread spawned. Calculating nonces...`
    ]);

    const startTime = performance.now();
    let nonce = 0;

    const interval = setInterval(() => {
      nonce += Math.floor(Math.random() * 25) + 10;
      setNonceCount(nonce);
      setHashRate(Math.floor(Math.random() * 1500) + 1200);

      if (nonce > 480) {
        clearInterval(interval);
        const duration = ((performance.now() - startTime) / 1000).toFixed(2);
        setSolveDuration(parseFloat(duration));
        setCaptchaState('done');
        setIsRunningPoW(false);
        setLogs(prev => [
          ...prev,
          `[PoW SUCCESS] Found solution nonce: ${nonce}`,
          `[PoW Verify] Verified locally in ${duration}s.`
        ]);
      } else {
        setLogs(prev => [
          ...prev,
          `Mining... Nonce: ${nonce} | HR: ${Math.floor(Math.random() * 1500) + 1200} H/s`
        ]);
      }
    }, 180);
  };

  const triggerRecompile = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setLogs(prev => [
      ...prev,
      ' ',
      '--- 💾 SERVER-SIDE RECOMPILATION STARTED ---',
      `[Build] Target file: /usr/src/app/assets/widget.js`,
      `[Build] Ingesting template widget bundle (widget.template.js)...`,
      `[Build] Merging customized theme CSS properties...`,
      `   - --cap-background: ${theme.background}`,
      `   - --cap-color: ${theme.color}`,
      `   - --cap-border-color: ${theme.borderColor}`,
      `   - --cap-border-radius: ${theme.borderRadius}`,
      `   - --cap-widget-width: ${theme.widgetWidth}`,
      `[Build] Splicing Custom Localization Strings:`,
      `   - Idle: "${textIdle}"`,
      `   - Verifying: "${textVerifying}"`,
      `   - Success: "${textDone}"`,
      `   - Error: "${textError}"`,
      `[Build] Compressing stylesheet with local minifier...`,
      `[Build] Overwriting widget.js bundle at /usr/src/app/assets/widget.js...`,
      '[Build] ✅ Recompilation successful! Custom texts baked permanently.',
      '--------------------------------------------',
      ' '
    ]);

    setTimeout(() => {
      setIsCompiling(false);
    }, 1200);
  };

  const copySnippet = () => {
    const origin = window.location.origin;
    const snippet = `<script src="${origin}/assets/widget.js"></script>\n<cap-widget data-cap-api-endpoint="${origin}/sitekey/"></cap-widget>`;
    navigator.clipboard.writeText(snippet);
    setCopystate('Copied!');
    setTimeout(() => setCopystate('Copy Snippet'), 2000);
  };

  const resetWidget = () => {
    setCaptchaState('idle');
    setIsRunningPoW(false);
    setNonceCount(0);
    setHashRate(0);
    setLogs(prev => [...prev, '[System] Reset widget state.']);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Header Banner */}
      <header className="border-b border-[#1f1f23] bg-[#0c0c0e] py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Cap CAPTCHA <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded font-mono font-semibold">THEME WIZARD</span>
              </h1>
              <p className="text-xs text-[#71717a]">Simulated local playground & recompiler server interface</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono text-[#a1a1aa]">Container Server Active</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left Column: Live Preview & Terminal Logs */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Box 1: Theme Visualizer Preview */}
          <div className="bg-[#121214] border border-[#1f1f23] rounded-xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden group">
            <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] font-mono text-[#71717a] uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-indigo-400" /> Live Preview Frame
            </div>

            {/* Custom Interactive Simulated Widget */}
            <div className="my-8 flex justify-center">
              <div 
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.borderColor,
                  borderRadius: theme.borderRadius,
                  color: theme.color,
                  width: theme.widgetWidth,
                }}
                className="h-14 border flex items-center justify-between px-4 cursor-pointer select-none transition-all duration-300 relative overflow-hidden"
                onClick={() => {
                  if (captchaState === 'idle') startProofOfWork();
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox / Loader Container */}
                  <div 
                    style={{ borderColor: theme.borderColor }}
                    className="h-5 w-5 border rounded flex items-center justify-center relative overflow-hidden bg-black/10"
                  >
                    {captchaState === 'idle' && (
                      <div className="h-2.5 w-2.5 rounded bg-transparent group-hover:bg-indigo-500/20" />
                    )}

                    {captchaState === 'verifying' && (
                      <div 
                        style={{ borderTopColor: theme.focusRing }}
                        className="h-3.5 w-3.5 border-2 border-transparent rounded-full animate-spin"
                      />
                    )}

                    {captchaState === 'done' && (
                      <CheckCircle style={{ color: theme.focusRing }} className="h-4 w-4" />
                    )}

                    {captchaState === 'error' && (
                      <span className="text-red-500 font-bold text-xs">!</span>
                    )}
                  </div>

                  <span className="text-xs font-semibold font-sans text-ellipsis overflow-hidden whitespace-nowrap max-w-[160px]" title={
                    captchaState === 'idle' ? textIdle :
                    captchaState === 'verifying' ? textVerifying :
                    captchaState === 'done' ? textDone : textError
                  }>
                    {captchaState === 'idle' && textIdle}
                    {captchaState === 'verifying' && textVerifying}
                    {captchaState === 'done' && textDone}
                    {captchaState === 'error' && textError}
                  </span>
                </div>

                <div className="flex flex-col items-end opacity-60">
                  <span className="text-[9px] font-mono uppercase tracking-wider font-bold">PoW</span>
                  <span className="text-[8px] font-mono">cap.dev</span>
                </div>

                {/* Simulated Focus Ring Indicator */}
                <div 
                  style={{ borderColor: theme.focusRing }}
                  className="absolute inset-0 border-2 rounded-[inherit] pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>

            <button 
              onClick={resetWidget}
              className="text-[10px] font-mono text-[#71717a] hover:text-[#a1a1aa] border border-[#27272a] bg-black/20 hover:bg-black/40 px-3 py-1 rounded transition-all active:scale-95"
            >
              Reset Widget State
            </button>
          </div>

          {/* Box 2: Server Logs Terminal */}
          <div className="bg-[#09090b] border border-[#1f1f23] rounded-xl flex flex-col flex-1 min-h-[250px] font-mono text-xs overflow-hidden">
            <div className="bg-[#0f0f11] px-4 py-2.5 border-b border-[#1f1f23] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-indigo-400" /> Container Server Output Logs
              </span>
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500/50"></span>
                <span className="h-2 w-2 rounded-full bg-yellow-500/50"></span>
                <span className="h-2 w-2 rounded-full bg-green-500/50"></span>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 max-h-[300px] space-y-1.5 text-indigo-300">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed whitespace-pre-wrap">{log}</div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Simulated Live Analytics Bar */}
            <div className="bg-[#0c0c0e] border-t border-[#1f1f23] py-2 px-4 flex items-center justify-between text-[10px] text-[#71717a]">
              <div className="flex gap-4">
                <span>Nonce: <strong className="text-white font-mono">{nonceCount}</strong></span>
                <span>Speed: <strong className="text-white font-mono">{hashRate} H/s</strong></span>
              </div>
              <span>Solve Time: <strong className="text-white font-mono">{solveDuration ? `${solveDuration}s` : '0.0s'}</strong></span>
            </div>
          </div>

        </section>

        {/* Right Column: Control Panels, Presets, and Authentik Integration */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="border border-[#1f1f23] bg-[#121214] rounded-xl flex flex-col flex-1 min-h-[580px]">
            
            {/* Nav Headers */}
            <div className="flex border-b border-[#1f1f23] bg-[#0c0c0e] rounded-t-xl overflow-x-auto">
              <button
                onClick={() => setActiveTab('customize')}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all shrink-0 ${
                  activeTab === 'customize'
                    ? 'border-indigo-500 text-indigo-400 bg-[#121214]'
                    : 'border-transparent text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#151518]'
                }`}
              >
                <Sliders className="h-4 w-4" />
                Customize Customizer
              </button>
              <button
                onClick={() => setActiveTab('authentik')}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all shrink-0 ${
                  activeTab === 'authentik'
                    ? 'border-indigo-500 text-indigo-400 bg-[#121214]'
                    : 'border-transparent text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#151518]'
                }`}
              >
                <Workflow className="h-4 w-4" />
                Authentik Guide
              </button>
              <button
                onClick={() => setActiveTab('snippet')}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all shrink-0 ${
                  activeTab === 'snippet'
                    ? 'border-indigo-500 text-indigo-400 bg-[#121214]'
                    : 'border-transparent text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#151518]'
                }`}
              >
                <Code className="h-4 w-4" />
                Frontend Code
              </button>
            </div>

            {/* TAB 1: Theme Settings Customizer */}
            {activeTab === 'customize' && (
              <div className="p-6 flex-1 flex flex-col gap-5 overflow-y-auto max-h-[640px]">
                
                {/* Visual Preset Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa] flex justify-between">
                    <span>Select Preset Theme</span>
                    <span className="text-indigo-400 font-bold">20 Premium Options</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(presets).map(([key, item]) => (
                      <button
                        key={key}
                        onClick={() => handlePresetSelect(key)}
                        className={`text-[11px] px-2.5 py-2 border rounded-lg transition-all text-left font-semibold flex items-center justify-between ${
                          activePreset === key 
                            ? 'border-indigo-500 bg-indigo-950/20 text-[#f4f4f5]' 
                            : 'border-[#1f1f23] bg-[#18181b] hover:border-[#27272a] text-[#71717a] hover:text-[#e4e4e7]'
                        }`}
                      >
                        <span className="truncate pr-1">{item.name}</span>
                        {activePreset === key && <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0"></span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#1f1f23] my-1" />

                {/* Variable Tuning Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Bg */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider">Background Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={theme.background}
                        onChange={(e) => handleValChange('background', e.target.value)}
                        className="h-9 w-12 bg-[#18181b] border border-[#27272a] rounded cursor-pointer p-0.5"
                      />
                      <input 
                        type="text" 
                        value={theme.background.toUpperCase()}
                        onChange={(e) => handleValChange('background', e.target.value)}
                        className="flex-1 bg-[#18181b] border border-[#1f1f23] rounded px-3 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider">Text Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={theme.color}
                        onChange={(e) => handleValChange('color', e.target.value)}
                        className="h-9 w-12 bg-[#18181b] border border-[#27272a] rounded cursor-pointer p-0.5"
                      />
                      <input 
                        type="text" 
                        value={theme.color.toUpperCase()}
                        onChange={(e) => handleValChange('color', e.target.value)}
                        className="flex-1 bg-[#18181b] border border-[#1f1f23] rounded px-3 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  {/* Border Color */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider">Border Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={theme.borderColor}
                        onChange={(e) => handleValChange('borderColor', e.target.value)}
                        className="h-9 w-12 bg-[#18181b] border border-[#27272a] rounded cursor-pointer p-0.5"
                      />
                      <input 
                        type="text" 
                        value={theme.borderColor.toUpperCase()}
                        onChange={(e) => handleValChange('borderColor', e.target.value)}
                        className="flex-1 bg-[#18181b] border border-[#1f1f23] rounded px-3 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  {/* Focus Ring */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider">Focus Ring Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={theme.focusRing}
                        onChange={(e) => handleValChange('focusRing', e.target.value)}
                        className="h-9 w-12 bg-[#18181b] border border-[#27272a] rounded cursor-pointer p-0.5"
                      />
                      <input 
                        type="text" 
                        value={theme.focusRing.toUpperCase()}
                        onChange={(e) => handleValChange('focusRing', e.target.value)}
                        className="flex-1 bg-[#18181b] border border-[#1f1f23] rounded px-3 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider flex justify-between">
                      Border Radius <span>{theme.borderRadius}</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="28" 
                      value={parseInt(theme.borderRadius) || 0}
                      onChange={(e) => handleValChange('borderRadius', e.target.value + 'px')}
                      className="accent-indigo-500 bg-[#18181b] h-1.5 rounded-lg appearance-none cursor-pointer border border-[#1f1f23]"
                    />
                  </div>

                  {/* Width */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider flex justify-between">
                      Widget Width <span>{theme.widgetWidth}</span>
                    </label>
                    <input 
                      type="range" 
                      min="200" 
                      max="400" 
                      step="5"
                      value={parseInt(theme.widgetWidth) || 260}
                      onChange={(e) => handleValChange('widgetWidth', e.target.value + 'px')}
                      className="accent-indigo-500 bg-[#18181b] h-1.5 rounded-lg appearance-none cursor-pointer border border-[#1f1f23]"
                    />
                  </div>

                </div>

                <div className="border-t border-[#1f1f23] my-1" />

                {/* Localization / Custom Texts Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></span>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">📝 Custom Widget Labels</label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono text-[#a1a1aa]">Idle Label</span>
                      <input 
                        type="text" 
                        value={textIdle} 
                        onChange={(e) => setTextIdle(e.target.value)}
                        className="bg-[#18181b] border border-[#1f1f23] rounded px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono text-[#a1a1aa]">Verifying Label</span>
                      <input 
                        type="text" 
                        value={textVerifying} 
                        onChange={(e) => setTextVerifying(e.target.value)}
                        className="bg-[#18181b] border border-[#1f1f23] rounded px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono text-[#a1a1aa]">Success Label</span>
                      <input 
                        type="text" 
                        value={textDone} 
                        onChange={(e) => setTextDone(e.target.value)}
                        className="bg-[#18181b] border border-[#1f1f23] rounded px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono text-[#a1a1aa]">Error Label</span>
                      <input 
                        type="text" 
                        value={textError} 
                        onChange={(e) => setTextError(e.target.value)}
                        className="bg-[#18181b] border border-[#1f1f23] rounded px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Theme & Recompile Action */}
                <div className="mt-auto pt-4 border-t border-[#1f1f23] flex flex-col gap-3">
                  <div className="bg-[#18181b] border border-[#1f1f23] p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Flame className="h-4 w-4 text-orange-500" /> Server Compile Engine
                      </h4>
                      <p className="text-[11px] text-[#71717a]">Applying a theme compiles the static JS asset inside your container directly.</p>
                    </div>
                    <button
                      onClick={triggerRecompile}
                      disabled={isCompiling}
                      className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#1f1f23] disabled:text-[#71717a] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
                      {isCompiling ? 'Compiling Widget...' : '💾 Save & Recompile Widget JS'}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: Authentik Integration Guide */}
            {activeTab === 'authentik' && (
              <div className="p-6 flex-1 flex flex-col gap-5 overflow-y-auto max-h-[500px]">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-2">
                    <Workflow className="h-4 w-4" /> Authentik Captcha Stage Guide
                  </h3>
                  <p className="text-xs text-[#a1a1aa]">How to configure your custom-branded Cap widget directly in Authentik's Captcha Stage with zero extra CSS.</p>
                </div>

                <div className="space-y-4 text-xs">
                  
                  {/* Step 1 */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 font-mono text-[11px]">
                      <span className="h-5 w-5 rounded-full bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-[10px]">1</span>
                      Configure the Authentik Captcha Stage
                    </h4>
                    <p className="text-[#a1a1aa] leading-relaxed pl-7">
                      In your Authentik Admin Interface, go to <strong className="text-white">Flows and Stages &gt; Stages</strong> and create or edit your **Captcha Stage**. Fill in the fields exactly as follows:
                    </p>
                    <div className="pl-7 space-y-3 font-mono text-[11px]">
                      <div className="bg-black/30 border border-[#1f1f23] p-3 rounded-lg space-y-2">
                        <div>
                          <span className="text-indigo-400 font-semibold text-[10px] uppercase block">JavaScript URL:</span>
                          <span className="text-[#e4e4e7] break-all">{window.location.origin}/assets/widget.js</span>
                        </div>
                        <div>
                          <span className="text-indigo-400 font-semibold text-[10px] uppercase block">API Verification URL:</span>
                          <span className="text-[#e4e4e7] break-all">{window.location.origin}/&lt;site-key&gt;/siteverify</span>
                        </div>
                        <div>
                          <span className="text-indigo-400 font-semibold text-[10px] uppercase block">Request Content Type:</span>
                          <span className="text-[#e4e4e7]">JSON</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 font-mono text-[11px]">
                      <span className="h-5 w-5 rounded-full bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-[10px]">2</span>
                      Zero Branding CSS Required
                    </h4>
                    <p className="text-[#a1a1aa] leading-relaxed pl-7">
                      Authentik renders the captcha element programmatically without allowing custom inline attribute injection. Because your custom theme variables are **baked directly into your self-hosted <code className="text-indigo-400 bg-indigo-950/20 px-1 py-0.5 rounded font-mono">widget.js</code> bundle** when you click "Save & Recompile Widget JS", Authentik's registration pages will display your fully branded widget automatically!
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 font-mono text-[11px]">
                      <span className="h-5 w-5 rounded-full bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-[10px]">3</span>
                      Theme Persistence
                    </h4>
                    <p className="text-[#a1a1aa] leading-relaxed pl-7">
                      Your styles are saved permanently into the container's persistent asset layer. Whenever you update your branding, simply adjust the colors in this wizard and hit compile to sync your entire Authentik stack instantly.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: Code Snippet Snippet */}
            {activeTab === 'snippet' && (
              <div className="p-6 flex-1 flex flex-col gap-6">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-indigo-400 font-bold">Standard Form HTML Injection</h3>
                  <p className="text-xs text-[#a1a1aa]">Paste this snippet directly into your frontend client login or submission form.</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <pre className="bg-[#09090b] p-4 rounded-xl border border-[#1f1f23] font-mono text-[10px] text-indigo-300 overflow-x-auto leading-relaxed">
{`<!-- Load Cap Widget -->
<script src="${window.location.origin}/assets/widget.js" defer></script>

<!-- Add Interactive Cap Web Component -->
<cap-widget 
  data-cap-api-endpoint="${window.location.origin}/sitekey/"
  style="
    --cap-background: ${theme.background};
    --cap-color: ${theme.color};
    --cap-border-color: ${theme.borderColor};
    --cap-focus-ring: ${theme.focusRing};
    --cap-border-radius: ${theme.borderRadius};
    --cap-widget-width: ${theme.widgetWidth};
  "
></cap-widget>`}
                    </pre>
                    
                    <button
                      onClick={copySnippet}
                      className="absolute top-3 right-3 bg-[#121214] border border-[#1f1f23] hover:border-[#27272a] text-[10px] text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      {copystate === 'Copied!' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      {copystate}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1f1f23] bg-[#0c0c0e] py-4 px-6 text-center text-xs font-mono text-[#52525b] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>Active Token Clearance Authority: SHA-256 Proof-of-Work Node</span>
          <span>© 2026 Cap Theme Studio | Open-Source Security Protocol Complete</span>
        </div>
      </footer>

    </div>
  );
}
