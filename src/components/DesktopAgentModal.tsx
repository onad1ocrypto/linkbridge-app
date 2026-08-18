import React, { useState } from 'react';
import {
  X,
  Terminal,
  Download,
  Copy,
  Check,
  Cpu,
  ShieldCheck,
  Laptop,
  Smartphone,
  Zap,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Play,
  FileCode,
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { Language, translations } from '../utils/i18n';

interface DesktopAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  serverUrl?: string;
  currentLang?: Language;
}

export const DesktopAgentModal: React.FC<DesktopAgentModalProps> = ({
  isOpen,
  onClose,
  roomId,
  serverUrl,
  currentLang = 'en',
}) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedWslCmd, setCopiedWslCmd] = useState(false);
  const [activeTab, setActiveTab] = useState<'windows' | 'wsl' | 'linux' | 'mac'>('windows');

  if (!isOpen) return null;

  const t = translations[currentLang] || translations.en;

  const currentHost =
    typeof window !== 'undefined'
      ? window.location.host
      : 'linkbridge.app';
  const wsProtocol =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? 'wss:'
      : 'ws:';
  const targetWsUrl = `${wsProtocol}//${currentHost}/ws`;

  // Cross-Platform Universal Python Agent (Windows Ctypes + WSL Interop + Linux/Mac PyAutoGUI)
  const pythonScript = `# ==========================================================
# LinkBridge - Universal Native OS Mouse & Keyboard Controller
# Compatible with: Windows (CMD/PowerShell), WSL (Ubuntu), Linux, macOS
# ==========================================================
# Quick Setup:
#   pip install websocket-client pyautogui
#   python linkbridge-agent-${roomId}.py
# ==========================================================

import os
import sys
import json
import time
import platform
import subprocess

ROOM_ID = "${roomId}"
WS_URL = "${targetWsUrl}"

# Detect Environment
IS_WINDOWS = os.name == 'nt'
IS_WSL = False
try:
    if os.path.exists('/proc/version'):
        with open('/proc/version', 'r') as f:
            if 'microsoft' in f.read().lower():
                IS_WSL = True
except Exception:
    pass

print(f"==========================================================")
print(f"  ⚡ LINKBRIDGE NATIVE DESKTOP AGENT v2.0")
print(f"  Room PIN: {ROOM_ID}")
print(f"  Platform: {platform.system()} {'(WSL Environment)' if IS_WSL else ''}")
print(f"==========================================================")

# Try importing native Windows Ctypes for 0-latency cursor control (no external libs needed)
user32 = None
if IS_WINDOWS:
    try:
        import ctypes
        user32 = ctypes.windll.user32
        print("[OK] Native Windows Ctypes Driver loaded (High-Precision)")
    except Exception:
        pass

# Fallback: PyAutoGUI
pyautogui = None
try:
    # Set default DISPLAY on Linux/WSL if not set
    if not IS_WINDOWS and 'DISPLAY' not in os.environ:
        os.environ['DISPLAY'] = ':0'
    import pyautogui
    pyautogui.FAILSAFE = False
    print("[OK] PyAutoGUI Driver loaded")
except Exception as e:
    if not user32 and not IS_WSL:
        print("[!] PyAutoGUI note: Run 'pip install pyautogui' or 'sudo apt install python3-tk'")

# Helper to move cursor smoothly
def move_mouse(dx, dy):
    try:
        if user32:
            # Native Windows Ctypes
            class POINT(ctypes.Structure):
                _fields_ = [("x", ctypes.c_long), ("y", ctypes.c_long)]
            pt = POINT()
            user32.GetCursorPos(ctypes.byref(pt))
            user32.SetCursorPos(int(pt.x + dx), int(pt.y + dy))
        elif IS_WSL:
            # WSL Windows interop via powershell.exe
            cmd = f'powershell.exe -NoProfile -Command "[System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(([System.Windows.Forms.Cursor]::Position.X + {int(dx)}), ([System.Windows.Forms.Cursor]::Position.Y + {int(dy)}))"'
            subprocess.Popen(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        elif pyautogui:
            pyautogui.moveRel(dx, dy)
    except Exception:
        pass

def click_mouse(button='left', is_down=None):
    try:
        if user32:
            MOUSEEVENTF_LEFTDOWN = 0x0002
            MOUSEEVENTF_LEFTUP = 0x0004
            MOUSEEVENTF_RIGHTDOWN = 0x0008
            MOUSEEVENTF_RIGHTUP = 0x0010
            if button == 'left':
                if is_down is True: user32.mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
                elif is_down is False: user32.mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
                else:
                    user32.mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
                    user32.mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
            elif button == 'right':
                if is_down is True: user32.mouse_event(MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, 0)
                elif is_down is False: user32.mouse_event(MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0)
                else:
                    user32.mouse_event(MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, 0)
                    user32.mouse_event(MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0)
        elif pyautogui:
            if is_down is True: pyautogui.mouseDown(button=button)
            elif is_down is False: pyautogui.mouseUp(button=button)
            else: pyautogui.click(button=button)
    except Exception:
        pass

def scroll_mouse(delta):
    try:
        if user32:
            MOUSEEVENTF_WHEEL = 0x0800
            user32.mouse_event(MOUSEEVENTF_WHEEL, 0, 0, int(-delta * 12), 0)
        elif pyautogui:
            pyautogui.scroll(int(-delta * 6))
    except Exception:
        pass

def handle_media(action):
    try:
        if pyautogui:
            key_map = {
                "volume_up": "volumeup",
                "volume_down": "volumedown",
                "mute": "volumemute",
                "play_pause": "playpause",
                "next": "nexttrack",
                "previous": "prevtrack"
            }
            if action in key_map:
                pyautogui.press(key_map[action])
    except Exception:
        pass

def handle_text(text):
    try:
        if pyautogui:
            pyautogui.write(text)
    except Exception:
        pass

def handle_key(key):
    try:
        if pyautogui:
            k = key.lower()
            if k in ["enter", "backspace", "space", "escape", "up", "down", "left", "right"]:
                pyautogui.press(k)
    except Exception:
        pass

# Websocket client handler
def on_message(ws, message):
    try:
        data = json.loads(message)
        msg_type = data.get("type")
        
        if msg_type == "mouse_move":
            dx = data.get("dx", 0) * 18
            dy = data.get("dy", 0) * 18
            move_mouse(dx, dy)
            
        elif msg_type == "mouse_click":
            click_mouse(data.get("button", "left"), data.get("isDown"))
            
        elif msg_type == "mouse_scroll":
            scroll_mouse(data.get("scrollY", 0))
            
        elif msg_type == "media_control":
            handle_media(data.get("action"))
            
        elif msg_type == "keyboard_input":
            handle_text(data.get("text", ""))
            
        elif msg_type == "key_action":
            handle_key(data.get("key", ""))
            
    except Exception as e:
        pass

def on_open(ws):
    print(f"\\n>>> [SUCCESS] CONNECTED TO PHONE!")
    print(f">>> You can now touch your phone trackpad to move your PC mouse cursor freely.\\n")
    ws.send(json.dumps({
        "type": "join",
        "roomId": ROOM_ID,
        "deviceId": "native_pc_agent",
        "deviceType": "laptop",
        "deviceName": "PC Native Controller"
    }))

def on_close(ws, status, msg):
    print("[!] Disconnected. Auto-reconnecting in 2 seconds...")
    time.sleep(2)

def main():
    try:
        import websocket
    except ImportError:
        print("[!] Missing 'websocket-client'. Installing automatically...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "websocket-client"])
        import websocket

    print(f"[*] Connecting to {WS_URL} ...")
    while True:
        try:
            ws = websocket.WebSocketApp(
                WS_URL,
                on_open=on_open,
                on_message=on_message,
                on_close=on_close
            )
            ws.run_forever()
        except KeyboardInterrupt:
            print("\\n[!] Exiting LinkBridge Agent.")
            sys.exit(0)
        except Exception as e:
            time.sleep(2)

if __name__ == "__main__":
    main()
`;

  // Windows 1-Click Batch File (.bat)
  const windowsBatScript = `@echo off
title LinkBridge - Native PC Mouse Controller
echo ============================================================
echo   LINKBRIDGE NATIVE OS MOUSE CONTROLLER (Windows 1-Click)
echo   Connecting to Room PIN: ${roomId}
echo ============================================================
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python tidak ditemukan di Windows Anda!
    echo Silakan download dan install Python dari https://www.python.org/downloads/
    echo (Pastikan centang "Add python.exe to PATH" saat install)
    pause
    exit /b
)

echo [*] Memeriksa websocket-client...
python -c "import websocket" >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Menginstall websocket-client...
    pip install websocket-client pyautogui
)

echo [*] Menjalankan LinkBridge Agent...
python linkbridge-agent-${roomId}.py
pause
`;

  // WSL / Linux Shell Script (.sh)
  const wslShellScript = `#!/usr/bin/env bash
echo "============================================================"
echo "  LINKBRIDGE NATIVE OS MOUSE CONTROLLER (WSL & Linux)"
echo "  Room PIN: ${roomId}"
echo "============================================================"

# Check and install python dependencies if needed
if ! command -v python3 &> /dev/null; then
    echo "[*] Installing python3..."
    sudo apt update && sudo apt install -y python3 python3-pip python3-tk
fi

pip3 install --quiet websocket-client pyautogui 2>/dev/null || pip install --quiet websocket-client pyautogui 2>/dev/null

echo "[*] Launching LinkBridge Agent..."
python3 linkbridge-agent-${roomId}.py
`;

  // Download Handlers
  const handleDownloadPy = () => {
    const blob = new Blob([pythonScript], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkbridge-agent-${roomId}.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sounds.playClick();
  };

  const handleDownloadBat = () => {
    const blob = new Blob([windowsBatScript], { type: 'application/x-bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Run_LinkBridge_${roomId}.bat`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sounds.playClick();
  };

  const handleDownloadSh = () => {
    const blob = new Blob([wslShellScript], { type: 'application/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `run_wsl_${roomId}.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sounds.playClick();
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(pythonScript);
    setCopiedScript(true);
    sounds.playClick();
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText('pip install websocket-client pyautogui');
    setCopiedCmd(true);
    sounds.playClick();
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleCopyWslCmd = () => {
    navigator.clipboard.writeText(`sudo apt update && sudo apt install -y python3-pip python3-tk && pip install websocket-client pyautogui && python3 linkbridge-agent-${roomId}.py`);
    setCopiedWslCmd(true);
    sounds.playClick();
    setTimeout(() => setCopiedWslCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-3xl bg-[#0e1017] border border-amber-500/25 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-amber-950/40 text-slate-100 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors border border-slate-800"
          title={t.close}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Explanation */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/25 shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-amber-200">
              {t.osAgentTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {t.osAgentSubtitle}
            </p>
          </div>
        </div>

        {/* Informative Explanation Callout */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-100/90 leading-relaxed space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.whySandboxTitle}</span>
          </div>
          <p className="text-slate-300">
            {t.whySandboxDesc}
          </p>
        </div>

        {/* OS Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
          {[
            { id: 'windows', label: '🪟 Windows (Paling Mudah)', badge: 'Rekomendasi' },
            { id: 'wsl', label: '🐧 WSL (Ubuntu di Windows)', badge: 'Fix Terminal' },
            { id: 'linux', label: '🐧 Linux Ubuntu Asli' },
            { id: 'mac', label: '🍎 macOS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                sounds.playClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase font-bold ${
                    activeTab === tab.id
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: WINDOWS (RECOMMENDED) */}
        {activeTab === 'windows' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">
                  Cara 1: ⚡ 1-Click Launcher (Tanpa Ketik Terminal)
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Paling Praktis
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Download file batch dan python berikut, letakkan di folder yang sama (misal di folder Downloads), lalu <strong>Double-Click file .bat</strong>:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={handleDownloadBat}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Run_LinkBridge.bat</span>
                </button>

                <button
                  onClick={handleDownloadPy}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-500/30 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span>Download linkbridge-agent.py</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-slate-200">
                Cara 2: Lewat Windows PowerShell / CMD (Bukan WSL)
              </span>
              <p className="text-xs text-slate-400">
                Buka <strong>PowerShell</strong> atau <strong>Command Prompt</strong> di Windows, lalu jalankan:
              </p>
              <div className="font-mono text-xs text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <span>python linkbridge-agent-{roomId}.py</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`python linkbridge-agent-${roomId}.py`);
                    setCopiedCmd(true);
                    setTimeout(() => setCopiedCmd(false), 2000);
                  }}
                  className="text-[11px] text-amber-300 font-semibold"
                >
                  {copiedCmd ? 'Tersalin!' : 'Salin'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: WSL UBUNTU (SOLUTION FOR ERROR) */}
        {activeTab === 'wsl' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Why Error in WSL Callout */}
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Kenapa Tadi Error di Terminal WSL Ubuntu?</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                WSL adalah sistem Linux terisolasi di dalam Windows. Saat menjalankan library GUI Linux seperti <code>pyautogui</code> di WSL, terminal akan error (misal <em>DISPLAY not set</em> atau <em>externally-managed-environment</em>) karena WSL tidak memiliki desktop X11 langsung.
              </p>
              <p className="text-amber-300 font-medium">
                💡 <strong>Solusi Terbaik:</strong> Script kami sekarang sudah diperbarui untuk otomatis mendeteksi WSL dan langsung mengendalikan kursor Windows host!
              </p>
            </div>

            {/* Step for WSL */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-300">
                Langkah Menjalankan di WSL Ubuntu:
              </span>
              <p className="text-xs text-slate-300">
                1. Salin script di bawah ini ke file di WSL atau download:
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadPy}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download linkbridge-agent.py</span>
                </button>

                <button
                  onClick={handleDownloadSh}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download run_wsl.sh</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 pt-2">
                2. Install paket dependensi websocket dan jalankan di terminal WSL:
              </p>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="font-mono text-xs text-emerald-400 break-all select-all">
                  sudo apt update && sudo apt install -y python3-pip python3-tk && pip install websocket-client && python3 linkbridge-agent-{roomId}.py
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleCopyWslCmd}
                    className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1"
                  >
                    {copiedWslCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedWslCmd ? 'Perintah Tersalin!' : 'Salin Perintah 1 Baris'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: LINUX NATIVE */}
        {activeTab === 'linux' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
              <span className="font-bold text-amber-300">Instruksi untuk Linux Desktop (Ubuntu / Debian / Fedora / Arch):</span>
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                  sudo apt install -y python3-tk python3-dev<br />
                  pip install pyautogui websocket-client<br />
                  python3 linkbridge-agent-{roomId}.py
                </div>
              </div>
              <p className="text-slate-400">
                Jika Anda menggunakan Wayland dan kursor tidak bergerak, pastikan sesi login menggunakan Xorg (X11) atau berikan izin accessibility.
              </p>
              <button
                onClick={handleDownloadPy}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Python Script</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: MACOS */}
        {activeTab === 'mac' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
              <span className="font-bold text-amber-300">Instruksi untuk macOS (Apple Silicon / Intel):</span>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-slate-200">
                pip3 install pyautogui websocket-client<br />
                python3 linkbridge-agent-{roomId}.py
              </div>
              <p className="text-amber-200/90 leading-relaxed">
                ⚠️ <strong>Penting di macOS:</strong> Berikan izin kontrol mouse di <em>System Settings → Privacy & Security → Accessibility</em> untuk Terminal atau IDE Anda.
              </p>
              <button
                onClick={handleDownloadPy}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Python Script</span>
              </button>
            </div>
          </div>
        )}

        {/* Python Code Viewer */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px] font-semibold">{t.scriptCodeTitle} ({roomId}):</span>
            <button
              onClick={handleCopyScript}
              className="text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? t.copied : t.copyCode}</span>
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 max-h-36 overflow-y-auto font-mono text-[11px] text-slate-300 scrollbar-thin">
            <pre>{pythonScript}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
