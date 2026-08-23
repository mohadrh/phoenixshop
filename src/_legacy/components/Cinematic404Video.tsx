import React, { useState, useRef, useEffect } from 'react';
import { PhoenixLogo } from './PhoenixLogo';
import { 
  AlertTriangle, 
  Home, 
  RotateCcw, 
  Terminal, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Crosshair, 
  Radio, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface Cinematic404VideoProps {
  onReturnHome: () => void;
}

export const Cinematic404Video: React.FC<Cinematic404VideoProps> = ({ onReturnHome }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[TACTICAL_LINK_ERROR]: Sector 404 Unreachable',
    '[TELEMETRY]: Phoenix Squad lost satellite signal',
    '[ALERT]: Coordinates corrupted by electronic warfare',
    '[STATUS]: Emergency extraction protocol standby...',
  ]);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // Periodic simulated tactical radar telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#05030a] text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden select-none">
      
      {/* Background Cinematic Battlefield Canvas / Video Simulation */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=2000&q=85"
          alt="Battlefield 404 Backdrop"
          className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.25] saturate-[1.2]"
        />
        
        {/* Tactical Scanlines & CRT Distortion Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05030a] via-[#05030a]/70 to-[#05030a]/80" />
      </div>

      {/* Top Header Tactical Status Bar */}
      <header className="relative z-10 flex items-center justify-between border-b border-red-500/20 pb-4">
        <div className="flex items-center gap-3">
          <PhoenixLogo size={34} showText={true} />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-mono border border-red-500/40 animate-pulse">
            EMERGENCY PROTOCOL ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5 text-red-400">
            <Radio className="w-4 h-4 animate-spin" />
            <span>GPS CORRUPTED</span>
          </div>
          <button
            onClick={() => {
              const muted = soundEngine.toggleMute();
              setIsVideoMuted(muted);
            }}
            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center gap-1.5"
          >
            {!isVideoMuted ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>صدا</span>
          </button>
        </div>
      </header>

      {/* Main Center 404 HUD Stage */}
      <main className="relative z-10 my-auto py-12 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
        
        {/* Glitch 404 Headline */}
        <div className="relative">
          <div className={`text-7xl sm:text-9xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-rose-600 to-amber-500 ${
            isGlitching ? 'translate-x-1 filter blur-[1px]' : ''
          }`}>
            ۴۰۴
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
            <Crosshair className="w-36 h-36 text-red-500 animate-spin" style={{ animationDuration: '25s' }} />
          </div>
        </div>

        {/* Tactical Error Explanation in Persian */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>سیگنال مفقود شده • صفحه‌ی مورد نظر در نقشه عملیاتی وجود ندارد</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-vazir)' }}>
            منطقه‌ی خارج از دسترس! ققنوس در حال بازنشانی مسیر
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            آدرس یا صفحه‌ای که به دنبال آن بودید تغییر کرده یا به علت نبردهای سنگین سروری جابجا شده است. برای دریافت اکانت‌های قانونی به پایگاه مرکزی فروشگاه بازگردید.
          </p>
        </div>

        {/* Live Terminal Telemetry Box */}
        <div className="w-full max-w-xl bg-black/70 rounded-2xl border border-red-500/30 p-4 text-left font-mono text-[11px] text-zinc-400 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 font-bold">TACTICAL HUD LOGS</span>
            </div>
            <span className="text-[10px] text-zinc-500">SYS_BUILD_2026_X</span>
          </div>
          <div className="space-y-1">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-red-500">&gt;</span>
                <span className={idx === 0 ? 'text-amber-400 font-bold' : ''}>{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-md">
          
          <button
            onClick={() => {
              soundEngine.playFireIgnite();
              onReturnHome();
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff7a18] via-[#ff2e7e] to-[#8a2be2] text-white font-bold text-sm shadow-[0_0_25px_rgba(255,100,50,0.5)] hover:shadow-[0_0_35px_rgba(255,46,126,0.7)] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>بازگشت به پایگاه فروشگاه</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setTerminalLogs(prev => [...prev, `[USER_RETRY]: Signal ping sent at ${new Date().toLocaleTimeString()}`]);
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl glass-card border border-white/15 text-zinc-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>تست مجدد اتصال سرور</span>
          </button>
        </div>
      </main>

      {/* Footer Tactical Telemetry */}
      <footer className="relative z-10 border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
        <span>ققنوس شاپ • پشتیبانی آنلاین ۲۴ ساعته در کنار شماست</span>
        <div className="flex items-center gap-3">
          <span>کد خطا: HTTP_404_NOT_FOUND</span>
          <span>سرور: IRAN_TEHRAN_DATACENTER</span>
        </div>
      </footer>
    </div>
  );
};
