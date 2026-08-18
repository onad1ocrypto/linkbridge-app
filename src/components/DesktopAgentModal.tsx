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

  if (!isOpen) return null;

  const currentHost =
    typeof window !== 'undefined'
      ? window.location.host
      : 'linkbridge.app';
  const wsProtocol =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? 'wss:'
      : 'ws:';
  const targetWsUrl = `${wsProtocol}//${currentHost}/ws`;

  // Python Agent Script code
  const pythonScript = `# ==========================================================
# LinkBridge - Native OS Mouse & Keyboard Controller
# Menggerakkan Kursor OS Asli (Windows / macOS / Linux) dari HP
# ==========================================================
# Cara pakai:
# 1. Install library:  pip install pyautogui websocket-client
# 2. Jalankan script: python linkbridge-agent.py
# ==========================================================

import json
import pyautogui
import websocket
import sys

ROOM_ID = "${roomId}"
WS_URL = "${targetWsUrl}"

pyautogui.FAILSAFE = False  # Mencegah kursor terhenti di pojok layar

print(f"[*] Memulai LinkBridge Native Agent...")
print(f"[*] Menghubungkan ke Room: {ROOM_ID}")

def on_message(ws, message):
    try:
        data = json.loads(message)
        msg_type = data.get("type")
        
        # 1. Gerakkan Kursor OS Asli
        if msg_type == "mouse_move":
            dx = data.get("dx", 0) * 16
            dy = data.get("dy", 0) * 16
            pyautogui.moveRel(dx, dy)
            
        # 2. Klik Mouse OS Asli
        elif msg_type == "mouse_click":
            btn = data.get("button", "left")
            if data.get("isDown"):
                pyautogui.mouseDown(button=btn)
            else:
                pyautogui.mouseUp(button=btn)
                
        # 3. Scroll Halaman OS Asli
        elif msg_type == "mouse_scroll":
            delta = data.get("scrollY", 0)
            pyautogui.scroll(int(-delta * 6))
            
        # 4. Kontrol Media OS (Volume, Play/Pause)
        elif msg_type == "media_control":
            action = data.get("action")
            if action == "volume_up": pyautogui.press("volumeup")
            elif action == "volume_down": pyautogui.press("volumedown")
            elif action == "mute": pyautogui.press("volumemute")
            elif action == "play_pause": pyautogui.press("playpause")
            elif action == "next": pyautogui.press("nexttrack")
            elif action == "previous": pyautogui.press("prevtrack")
            
        # 5. Ketik Teks OS Asli
        elif msg_type == "keyboard_input":
            pyautogui.write(data.get("text", ""))
            
        # 6. Tombol Navigasi
        elif msg_type == "key_action":
            k = data.get("key", "").lower()
            if k == "enter": pyautogui.press("enter")
            elif k == "backspace": pyautogui.press("backspace")
            elif k == "space": pyautogui.press("space")
            elif k == "escape": pyautogui.press("esc")
            
    except Exception as e:
        pass

def on_open(ws):
    print(f"[OK] TERHUBUNG KE HP! Gerakkan kursor di HP Anda sekarang.")
    ws.send(json.dumps({
        "type": "join",
        "roomId": ROOM_ID,
        "deviceId": "native_pc_agent",
        "deviceType": "laptop",
        "deviceName": "PC Native Controller"
    }))

def on_close(ws, status, msg):
    print("[!] Koneksi terputus. Mencoba menghubungkan ulang...")

if __name__ == "__main__":
    while True:
        try:
            ws = websocket.WebSocketApp(WS_URL, on_open=on_open, on_message=on_message, on_close=on_close)
            ws.run_forever()
        except KeyboardInterrupt:
            sys.exit(0)
        except Exception:
            pass
`;

  const handleDownload = () => {
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

  const handleCopyScript = () => {
    navigator.clipboard.writeText(pythonScript);
    setCopiedScript(true);
    sounds.playClick();
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText('pip install pyautogui websocket-client');
    setCopiedCmd(true);
    sounds.playClick();
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-[#0e1017] border border-amber-500/25 rounded-3xl p-6 shadow-2xl shadow-amber-950/40 text-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Explanation */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/25">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-amber-200">
              Native OS Remote Mouse (Kontrol Penuh Kursor Laptop)
            </h3>
            <p className="text-xs text-slate-400">
              Penjelasan Sandbox Browser & Cara Menggerakkan Kursor OS Asli di Seluruh Layar Laptop
            </p>
          </div>
        </div>

        {/* Informative Explanation Callout */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-100/90 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4" />
            <span>Mengapa Browser Membatasi Kursor di Dalam Tab Web?</span>
          </div>
          <p className="text-slate-300">
            Semua browser web di dunia (Chrome, Edge, Safari) memiliki aturan keamanan (*Browser Sandbox*) yang **melarang website menggerakkan kursor asli sistem operasi di luar tab** demi mencegah malware membajak mouse Anda.
          </p>
          <p className="text-slate-300">
            <strong>Solusinya:</strong> Jalankan script pembantu ringan (*Native Companion Agent*) 1-file di bawah ini di laptop Anda. Kursor fisik laptop Windows / Mac / Linux Anda akan <strong>sepenuhnya bisa digerakkan dari HP di aplikasi apa pun (Desktop, YouTube, Game, PPT, File Explorer)!</strong>
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Langkah Cepat (Hanya 1 Menit):
          </h4>

          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-300">1. Install library Python di laptop Anda:</span>
              <div className="font-mono text-xs text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                pip install pyautogui websocket-client
              </div>
            </div>
            <button
              onClick={handleCopyCmd}
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              {copiedCmd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCmd ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-300">2. Download Script Companion untuk Room Anda ({roomId}):</span>
              <p className="text-[11px] text-slate-400">File script sudah otomatis diatur dengan PIN Room Anda</p>
            </div>
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-600/20 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download .py</span>
            </button>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-amber-300">3. Jalankan script di laptop:</span>
            <div className="font-mono text-xs text-slate-300 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
              python linkbridge-agent-{roomId}.py
            </div>
            <p className="text-[11px] text-emerald-400 pt-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Selesai! Sekarang gerakkan kursor di HP Anda, kursor laptop fisik akan langsung bergerak di seluruh layar komputer!
            </p>
          </div>
        </div>

        {/* Code Preview Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px]">Kode Script Python (Otomatis Sesuai Room {roomId}):</span>
            <button
              onClick={handleCopyScript}
              className="text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? 'Tersalin' : 'Salin Kode'}</span>
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-36 overflow-y-auto font-mono text-[11px] text-slate-300 scrollbar-thin">
            <pre>{pythonScript}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
