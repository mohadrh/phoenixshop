'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Gamepad2, Pause, Play, RotateCcw } from 'lucide-react';
import { sound } from '../../lib/sound';

/**
 * بازی سطح‌ها — پلتفرمر افقی.
 *
 * ققنوس روی زمین می‌دود، از روی شکاف‌ها می‌پرد و از کنار چهار پرچم رد
 * می‌شود. هر پرچم که بالا برود، یک سطح از کارت باشگاه پایین همین سکشن
 * روشن می‌شود. یعنی بازی تزئین نیست — همان چیزی را توضیح می‌دهد که
 * جدول سطح‌ها می‌گوید، فقط طوری که یادت بماند.
 *
 * چند تصمیم فنی که کیفیت حرکت را می‌سازند:
 *
 *  ۱. گام ثابت فیزیک (۱/۱۲۰ ثانیه) با انباشتگر. با delta خام، پرش روی
 *     مانیتور ۱۴۴ هرتز کوتاه‌تر از ۶۰ هرتز درمی‌آید — همان باگی که در
 *     پلتفرمرهای وب زیاد دیده می‌شود.
 *  ۲. coyote time و بافر پرش. آدم‌ها دکمه را چند فریم زودتر یا دیرتر
 *     می‌زنند؛ بدون این دو، بازی «سفت» و ناعادلانه حس می‌شود.
 *  ۳. جاذبه‌ی نامتقارن: پایین‌آمدن سنگین‌تر از بالا رفتن است. قوس پرش
 *     این‌طور قاطع‌تر به نظر می‌رسد.
 *  ۴. افتادن در شکاف مجازات ندارد — به آخرین پرچم برمی‌گردی. این یک
 *     سکشن فروشگاه است، نه یک بازی سخت.
 */

/* ---------------------------------------------------------------
   ثابت‌های دنیا
--------------------------------------------------------------- */

const VIEW_H = 340;          // ارتفاع بوم
const GROUND_Y = 268;        // سطح زمین در مختصات بوم
const RUN_SPEED = 250;       // پیکسل بر ثانیه
const GRAVITY_UP = 1750;
const GRAVITY_DOWN = 2600;   // سقوط سنگین‌تر از صعود
const JUMP_V = -640;
const COYOTE = 0.1;          // ثانیه
const BUFFER = 0.14;         // ثانیه
const STEP = 1 / 120;        // گام ثابت فیزیک

/** شکاف‌های زمین — [شروع, پایان] در مختصات دنیا */
const GAPS: [number, number][] = [
  [1180, 1330],
  [2380, 2560],
  [3050, 3200],
  [3760, 3960],
  [4520, 4700],
];

/** سکوهای شناور — [x, y, عرض] */
const PLATFORMS: { x: number; y: number; w: number }[] = [
  { x: 1150, y: 190, w: 130 },
  { x: 1520, y: 160, w: 110 },
  { x: 2360, y: 185, w: 150 },
  { x: 2760, y: 150, w: 120 },
  { x: 3020, y: 195, w: 130 },
  { x: 3480, y: 155, w: 120 },
  { x: 3740, y: 190, w: 160 },
  { x: 4180, y: 150, w: 130 },
  { x: 4500, y: 185, w: 170 },
];

/** پرچم‌ها — هر کدام یک سطح باشگاه را باز می‌کند */
const FLAGS = [
  { x: 900, label: 'برنز' },
  { x: 2050, label: 'نقره' },
  { x: 3400, label: 'طلا' },
  { x: 4850, label: 'الماس' },
];

const FINISH_X = 5250;

/* ---------------------------------------------------------------
   سه سرزمین.

   مسیر از دنیای ققنوس شروع می‌شود، از سرزمین هوش مصنوعی رد می‌شود و
   به سرزمین گیم می‌رسد — یعنی همان سه چیزی که این فروشگاه است.

   هر سرزمین پالت و اثاثیه‌ی خودش را دارد. مرزها نرم‌اند: در ۲۶۰ پیکسل
   آخر هر سرزمین رنگ‌ها به سرزمین بعدی میان‌یابی می‌شوند، وگرنه عبور
   از مرز مثل عوض شدن ناگهانی اسلاید دیده می‌شود نه سفر.
--------------------------------------------------------------- */

interface Zone {
  id: 'phoenix' | 'ai' | 'game';
  name: string;
  until: number;
  /** آسمان: بالا، میانه، پایین */
  sky: [string, string, string];
  far: string;    // کوه دور
  near: string;   // تپه‌ی نزدیک
  ground: string;
  accent: string; // لبه‌ی زمین و اثاثیه
  glow: string;   // سحابی
}

const ZONES: Zone[] = [
  {
    id: 'phoenix',
    name: 'سرزمین ققنوس',
    until: 1900,
    sky: ['#150707', '#2a0f14', '#3d1518'],
    far: '#2b1018',
    near: '#3a1520',
    ground: '#41182a',
    accent: '#f59440',
    glow: 'rgba(245,148,64,0.20)',
  },
  {
    id: 'ai',
    name: 'سرزمین هوش مصنوعی',
    until: 3700,
    sky: ['#04101a', '#062033', '#08304a'],
    far: '#0a2438',
    near: '#0d3049',
    ground: '#0f3a54',
    accent: '#38bdf8',
    glow: 'rgba(56,189,248,0.20)',
  },
  {
    id: 'game',
    name: 'سرزمین گیم',
    until: 99999,
    sky: ['#0b0518', '#190a30', '#251047'],
    far: '#1c0e35',
    near: '#261446',
    ground: '#2d1852',
    accent: '#a855f7',
    glow: 'rgba(168,85,247,0.22)',
  },
];

const BLEND_SPAN = 260;

/** شماره‌ی سرزمین در یک نقطه از دنیا */
function zoneIndexAt(x: number): number {
  for (let i = 0; i < ZONES.length; i++) if (x < ZONES[i].until) return i;
  return ZONES.length - 1;
}

/** سرزمین فعلی، سرزمین بعدی، و نسبت میان‌یابی بینشان (۰ تا ۱) */
function zoneMix(x: number): { a: Zone; b: Zone; t: number; index: number } {
  const i = zoneIndexAt(x);
  const a = ZONES[i];
  const b = ZONES[Math.min(i + 1, ZONES.length - 1)];
  const dist = a.until - x;
  const t = dist < BLEND_SPAN ? 1 - dist / BLEND_SPAN : 0;
  return { a, b, t: Math.max(0, Math.min(1, t)), index: i };
}

/** میان‌یابی دو رنگ hex — بدون کتابخانه، چون فقط همین‌جا لازم است */
function mixHex(c1: string, c2: string, t: number): string {
  if (t <= 0) return c1;
  if (t >= 1) return c2;
  const n = (c: string) => [
    parseInt(c.slice(1, 3), 16),
    parseInt(c.slice(3, 5), 16),
    parseInt(c.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = n(c1);
  const [r2, g2, b2] = n(c2);
  const h = (v: number) => Math.round(v).toString(16).padStart(2, '0');
  return `#${h(r1 + (r2 - r1) * t)}${h(g1 + (g2 - g1) * t)}${h(b1 + (b2 - b1) * t)}`;
}


/** سکه‌ها — فقط برای اینکه مسیر خالی نباشد */
const COINS: { x: number; y: number }[] = [];
for (let i = 0; i < 46; i++) {
  const x = 420 + i * 105;
  const inGap = GAPS.some(([a, b]) => x > a - 40 && x < b + 40);
  const onPlat = PLATFORMS.find((p) => x > p.x && x < p.x + p.w);
  if (inGap && !onPlat) continue;
  COINS.push({ x, y: onPlat ? onPlat.y - 30 : GROUND_Y - 48 - (i % 3) * 26 });
}

/* ---------------------------------------------------------------
   وضعیت بازی — بیرون از React نگه داشته می‌شود.

   هر فریم setState صدا زدن یعنی صدها رندر در ثانیه. فقط رویدادهای
   معنادار (رد شدن از پرچم، پایان) به React خبر داده می‌شوند.
--------------------------------------------------------------- */

interface Star { x: number; y: number; r: number; depth: number; tw: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; hue: number }

interface World {
  t: number;
  camX: number;
  px: number;
  py: number;
  vy: number;
  onGround: boolean;
  coyote: number;
  buffer: number;
  facing: number;
  flap: number;
  running: boolean;
  done: boolean;
  flagsHit: boolean[];
  coinsGot: boolean[];
  coinCount: number;
  lastSafeX: number;
  stars: Star[];
  parts: Particle[];
  shake: number;
  /** آخرین سرزمینی که نامش اعلام شد، و عمر باقی‌مانده‌ی اعلان */
  zoneShown: number;
  zoneBanner: number;
}

function makeWorld(): World {
  const stars: Star[] = [];
  for (let i = 0; i < 90; i++) {
    stars.push({
      x: Math.random() * 6000,
      y: Math.random() * 210,
      r: Math.random() * 1.5 + 0.4,
      depth: 0.15 + Math.random() * 0.5,
      tw: Math.random() * Math.PI * 2,
    });
  }
  return {
    t: 0,
    camX: 0,
    px: 90,
    py: GROUND_Y,
    vy: 0,
    onGround: true,
    coyote: 0,
    buffer: 0,
    facing: 1,
    flap: 0,
    running: false,
    done: false,
    flagsHit: [false, false, false, false],
    coinsGot: COINS.map(() => false),
    coinCount: 0,
    lastSafeX: 90,
    stars,
    parts: [],
    shake: 0,
    zoneShown: 0,
    zoneBanner: 0,
  };
}

const onSolidGround = (x: number) => !GAPS.some(([a, b]) => x > a && x < b);

export function LevelUpGame({
  onFlag,
  unlockedByCart,
}: {
  /** وقتی از پرچم i رد شد */
  onFlag: (index: number) => void;
  /** سطح‌هایی که با خرید واقعی باز شده‌اند — از ابتدا روشن‌اند */
  unlockedByCart: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<World>(makeWorld());
  const rafRef = useRef<number>(0);
  const phoenixRef = useRef<HTMLImageElement | null>(null);

  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [coins, setCoins] = useState(0);
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLSpanElement>(null);
  const [reduce, setReduce] = useState(false);

  /* تصویر ققنوس یک بار لود می‌شود؛ اگر نرسید، شکل جایگزین کشیده می‌شود */
  useEffect(() => {
    const img = new Image();
    img.src = '/brand/phoenix-mark.png';
    img.onload = () => { phoenixRef.current = img; };
  }, []);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const jump = useCallback(() => {
    const w = worldRef.current;
    if (!w.running || w.done) return;
    w.buffer = BUFFER;
  }, []);

  /* ---------- ورودی ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        // فقط وقتی بازی در جریان است اسکرول را می‌گیریم
        if (worldRef.current.running) e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [jump]);

  /* ---------- حلقه‌ی بازی ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let last = performance.now();
    let acc = 0;
    let width = canvas.clientWidth;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(VIEW_H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    /* ---------- فیزیک، گام ثابت ---------- */
    const step = () => {
      const w = worldRef.current;
      if (!w.running || w.done) return;

      w.t += STEP;
      w.px += RUN_SPEED * STEP;
      w.flap += STEP * (w.onGround ? 9 : 5);

      // بافر و coyote
      w.buffer = Math.max(0, w.buffer - STEP);
      w.coyote = w.onGround ? COYOTE : Math.max(0, w.coyote - STEP);

      if (w.buffer > 0 && w.coyote > 0) {
        w.vy = JUMP_V;
        w.onGround = false;
        w.coyote = 0;
        w.buffer = 0;
        sound.jump();
        for (let i = 0; i < 8; i++) {
          w.parts.push({
            x: w.px, y: w.py, vx: (Math.random() - 0.6) * 90, vy: Math.random() * 60,
            life: 0, max: 0.4 + Math.random() * 0.3, hue: 28 + Math.random() * 22,
          });
        }
      }

      // جاذبه‌ی نامتقارن
      w.vy += (w.vy < 0 ? GRAVITY_UP : GRAVITY_DOWN) * STEP;
      w.py += w.vy * STEP;

      // برخورد با سکوها — فقط از بالا، و فقط وقتی در حال سقوط است
      let landed = false;
      for (const p of PLATFORMS) {
        if (w.vy >= 0 && w.px > p.x - 14 && w.px < p.x + p.w + 14) {
          const prevY = w.py - w.vy * STEP;
          if (prevY <= p.y && w.py >= p.y) {
            w.py = p.y;
            w.vy = 0;
            landed = true;
            break;
          }
        }
      }

      // برخورد با زمین
      if (!landed && w.py >= GROUND_Y && onSolidGround(w.px)) {
        w.py = GROUND_Y;
        w.vy = 0;
        landed = true;
      }

      if (landed && !w.onGround) {
        sound.land();
        w.shake = 3;
      }
      w.onGround = landed;
      if (landed && onSolidGround(w.px)) w.lastSafeX = w.px;

      // افتادن در شکاف — بازگشت به آخرین جای امن
      if (w.py > VIEW_H + 90) {
        sound.fall();
        w.px = Math.max(90, w.lastSafeX - 120);
        w.py = GROUND_Y - 120;
        w.vy = 0;
        w.shake = 10;
      }

      // پرچم‌ها
      FLAGS.forEach((f, i) => {
        if (!w.flagsHit[i] && w.px >= f.x) {
          w.flagsHit[i] = true;
          sound.flag();
          w.shake = 6;
          for (let k = 0; k < 26; k++) {
            w.parts.push({
              x: f.x, y: GROUND_Y - 30 - Math.random() * 90,
              vx: (Math.random() - 0.5) * 160, vy: -Math.random() * 200,
              life: 0, max: 0.7 + Math.random() * 0.5, hue: Math.random() * 40,
            });
          }
          onFlag(i);
        }
      });

      // سکه‌ها
      COINS.forEach((c, i) => {
        if (w.coinsGot[i]) return;
        // مرکز ققنوس ۲۲ پیکسل بالای پاهایش است
        if (Math.abs(w.px - c.x) < 24 && Math.abs(w.py - 22 - c.y) < 40) {
          w.coinsGot[i] = true;
          w.coinCount += 1;
          sound.coin();
          setCoins(w.coinCount);
        }
      });

      // پایان
      if (w.px >= FINISH_X) {
        w.done = true;
        w.running = false;
        if (barRef.current) barRef.current.style.width = '100%';
        sound.fanfare();
        setDone(true);
        setRunning(false);
      }

      // دوربین — کمی جلوتر از بازیکن، با میان‌یابی نرم
      const want = w.px - width * 0.32;
      w.camX += (Math.max(0, want) - w.camX) * Math.min(1, STEP * 9);

      /* نوار پیشرفت مستقیم روی DOM نوشته می‌شود، نه با setState.
         این تابع ۱۲۰ بار در ثانیه اجرا می‌شود؛ setState در آن یعنی
         ۱۲۰ رندر React در ثانیه برای عرض یک نوار. */
      const pr = Math.min(1, w.px / FINISH_X);
      if (barRef.current) barRef.current.style.width = `${pr * 100}%`;

      // ذرات
      for (let i = w.parts.length - 1; i >= 0; i--) {
        const p = w.parts[i];
        p.life += STEP;
        if (p.life >= p.max) { w.parts.splice(i, 1); continue; }
        p.x += p.vx * STEP;
        p.y += p.vy * STEP;
        p.vy += 220 * STEP;
      }

      // دنباله‌ی آتش پشت ققنوس
      if (w.t % 0.03 < STEP) {
        w.parts.push({
          x: w.px - 16, y: w.py - 20 + (Math.random() - 0.5) * 10,
          vx: -60 - Math.random() * 60, vy: (Math.random() - 0.5) * 40,
          life: 0, max: 0.35 + Math.random() * 0.25, hue: 18 + Math.random() * 26,
        });
      }

      w.shake = Math.max(0, w.shake - STEP * 26);
      w.zoneBanner = Math.max(0, w.zoneBanner - STEP);

      /* ورود به سرزمین تازه — نامش یک بار اعلام می‌شود */
      const zi = zoneIndexAt(w.px);
      if (zi !== w.zoneShown) {
        w.zoneShown = zi;
        w.zoneBanner = 2.6;
        sound.success();
      }
    };

    /* ---------- رسم ---------- */
    const draw = () => {
      const w = worldRef.current;
      const H = VIEW_H;
      const cam = w.camX;

      ctx.clearRect(0, 0, width, H);

      const sx = w.shake ? (Math.random() - 0.5) * w.shake : 0;
      const sy = w.shake ? (Math.random() - 0.5) * w.shake : 0;
      ctx.save();
      ctx.translate(sx, sy);

      /* سرزمین از روی مرکز قاب خوانده می‌شود نه لبه‌ی چپ، تا تغییر
         رنگ همان‌جایی حس شود که بازیکن هست. */
      const zm = zoneMix(cam + width / 2);
      const zAccent = mixHex(zm.a.accent, zm.b.accent, zm.t);

      // ---- آسمان ----
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, mixHex(zm.a.sky[0], zm.b.sky[0], zm.t));
      sky.addColorStop(0.45, mixHex(zm.a.sky[1], zm.b.sky[1], zm.t));
      sky.addColorStop(1, mixHex(zm.a.sky[2], zm.b.sky[2], zm.t));
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, H);

      // ---- ستاره‌ها، سه عمق ----
      w.stars.forEach((s) => {
        const x = ((s.x - cam * s.depth) % 6000 + 6000) % 6000;
        if (x > width + 10) return;
        const tw = 0.55 + Math.sin(w.t * 2 + s.tw) * 0.45;
        ctx.globalAlpha = tw * (0.3 + s.depth);
        ctx.fillStyle = s.depth > 0.45 ? '#ffd7a8' : '#cfd6ff';
        ctx.beginPath();
        ctx.arc(x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // ---- سحابی دور ----
      const neb = ctx.createRadialGradient(
        width * 0.7 - cam * 0.04, 70, 10,
        width * 0.7 - cam * 0.04, 70, 260
      );
      neb.addColorStop(0, zm.t > 0.5 ? zm.b.glow : zm.a.glow);
      neb.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, width, H);

      // ---- کوه‌های دور، پارالاکس ۰٫۲ ----
      ctx.fillStyle = mixHex(zm.a.far, zm.b.far, zm.t);
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= width; x += 8) {
        const wx = x + cam * 0.2;
        const y = 214 - Math.sin(wx * 0.0032) * 34 - Math.sin(wx * 0.0011) * 22;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, H);
      ctx.closePath();
      ctx.fill();

      // ---- تپه‌های نزدیک‌تر، پارالاکس ۰٫۴۵ ----
      ctx.fillStyle = mixHex(zm.a.near, zm.b.near, zm.t);
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= width; x += 8) {
        const wx = x + cam * 0.45;
        const y = 244 - Math.sin(wx * 0.0058 + 2) * 22 - Math.sin(wx * 0.0021) * 14;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, H);
      ctx.closePath();
      ctx.fill();

      /* ---- بناهای سرزمین ----

         بلند و کم‌تعداد، نه ریز و پرتعداد. نسخه‌ی قبلی اشیای ۲۰ پیکسلی
         می‌کشید که از پشت تپه‌ها اصلاً دیده نمی‌شدند. یک بنای بلند در
         هر ۴۲۰ پیکسل، سیلوئتِ افق را می‌سازد — همان چیزی که به صحنه
         عمق و «جا» می‌دهد.

         پارالاکس ۰٫۶: نزدیک‌تر از تپه، دورتر از زمین. */
      const LAND_GAP = 420;
      const landPar = 0.6;
      const firstLand = Math.floor((cam * landPar - 260) / LAND_GAP) * LAND_GAP;

      for (let wx = firstLand; wx < cam * landPar + width + 260; wx += LAND_GAP) {
        const x = wx - cam * landPar;
        if (x < -260 || x > width + 260) continue;

        /* سرزمینِ خودِ بنا از مختصات دنیای خودش خوانده می‌شود، وگرنه
           بناهای نزدیک مرز رنگ اشتباه می‌گیرند */
        const oz = zoneMix(wx / landPar);
        const acc = mixHex(oz.a.accent, oz.b.accent, oz.t);
        const body = mixHex(mixHex(oz.a.far, oz.b.far, oz.t), '#000000', 0.35);
        const seed = Math.abs(Math.sin(wx * 0.013));
        const baseY = 252;

        ctx.save();

        if (oz.a.id === 'phoenix') {
          /* ستون آتش — پایه‌ی سنگی بلند با منقلی که نبض دارد */
          const hgt = 92 + seed * 46;
          const pulse = 0.78 + Math.sin(w.t * 2.6 + wx * 0.01) * 0.22;

          ctx.fillStyle = body;
          ctx.beginPath();
          ctx.moveTo(x - 15, baseY);
          ctx.lineTo(x - 9, baseY - hgt);
          ctx.lineTo(x + 9, baseY - hgt);
          ctx.lineTo(x + 15, baseY);
          ctx.closePath();
          ctx.fill();

          // کاسه‌ی آتش
          ctx.fillStyle = mixHex(body, '#ffffff', 0.1);
          roundRect(ctx, x - 16, baseY - hgt - 9, 32, 10, 3);
          ctx.fill();

          const fg = ctx.createRadialGradient(
            x, baseY - hgt - 20, 2, x, baseY - hgt - 20, 40 * pulse
          );
          fg.addColorStop(0, 'rgba(255,238,200,0.95)');
          fg.addColorStop(0.35, acc);
          fg.addColorStop(1, 'rgba(214,49,111,0)');
          ctx.fillStyle = fg;
          ctx.beginPath();
          ctx.arc(x, baseY - hgt - 20, 40 * pulse, 0, Math.PI * 2);
          ctx.fill();

          // اخگرهای بالارونده
          for (let k = 0; k < 3; k++) {
            const ph = (w.t * 0.5 + k * 0.33 + seed) % 1;
            ctx.globalAlpha = (1 - ph) * 0.7;
            ctx.fillStyle = acc;
            ctx.beginPath();
            ctx.arc(
              x + Math.sin(ph * 7 + k) * 13,
              baseY - hgt - 26 - ph * 66,
              1.8 - ph, 0, Math.PI * 2
            );
            ctx.fill();
          }
        } else if (oz.a.id === 'ai') {
          /* برج داده — بدنه‌ی باریک با طبقات روشن و بشقاب بالای سر */
          const hgt = 108 + seed * 54;

          ctx.fillStyle = body;
          roundRect(ctx, x - 13, baseY - hgt, 26, hgt, 4);
          ctx.fill();

          // طبقات چشمک‌زن
          const floors = Math.floor(hgt / 22);
          for (let k = 0; k < floors; k++) {
            const fy = baseY - 16 - k * 22;
            const on = Math.sin(w.t * 1.8 + k * 1.3 + wx * 0.008) > -0.35;
            ctx.globalAlpha = on ? 0.85 : 0.2;
            ctx.fillStyle = acc;
            ctx.fillRect(x - 8, fy, 16, 3);
          }
          ctx.globalAlpha = 1;

          // آنتن و چراغ نوک برج
          ctx.strokeStyle = body;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(x, baseY - hgt);
          ctx.lineTo(x, baseY - hgt - 26);
          ctx.stroke();

          const blink = 0.45 + Math.sin(w.t * 3.4 + wx) * 0.55;
          ctx.globalAlpha = Math.max(0, blink);
          ctx.fillStyle = acc;
          ctx.beginPath();
          ctx.arc(x, baseY - hgt - 28, 3.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.arc(x, baseY - hgt - 28, 10, 0, Math.PI * 2);
          ctx.fill();

          // خط داده به برج بعدی
          ctx.globalAlpha = 0.22;
          ctx.strokeStyle = acc;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x + 13, baseY - hgt + 14);
          ctx.lineTo(x + LAND_GAP - 13, baseY - hgt + 40);
          ctx.stroke();
        } else {
          /* برج آرکید — بلوک‌های روی هم با علامت وسط، مثل ستون آجری */
          const rows = 3 + Math.round(seed * 2);
          for (let k = 0; k < rows; k++) {
            const by = baseY - 26 - k * 26;
            const wdt = 46 - k * 4;
            ctx.globalAlpha = 0.92;
            ctx.fillStyle = body;
            roundRect(ctx, x - wdt / 2, by, wdt, 24, 4);
            ctx.fill();
            ctx.globalAlpha = 0.7;
            ctx.strokeStyle = acc;
            ctx.lineWidth = 1.2;
            roundRect(ctx, x - wdt / 2, by, wdt, 24, 4);
            ctx.stroke();
            // علامت «؟» ساده‌شده وسط بلوک
            ctx.globalAlpha = 0.55 + Math.sin(w.t * 2 + k) * 0.2;
            ctx.fillStyle = acc;
            ctx.fillRect(x - 2.5, by + 8, 5, 5);
          }
          // پرچم نوک برج
          ctx.globalAlpha = 0.9;
          ctx.strokeStyle = acc;
          ctx.lineWidth = 2;
          const ty = baseY - 26 - rows * 26;
          ctx.beginPath();
          ctx.moveTo(x, ty);
          ctx.lineTo(x, ty - 22);
          ctx.stroke();
          ctx.fillStyle = acc;
          ctx.beginPath();
          ctx.moveTo(x, ty - 22);
          ctx.lineTo(x + 18 + Math.sin(w.t * 3) * 3, ty - 16);
          ctx.lineTo(x, ty - 10);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }
      ctx.globalAlpha = 1;

      /* ---- مه بین لایه‌ها ----
         بدون این، تپه و زمین دو مقوای چسبیده به هم‌اند. مه فاصله‌ی
         هوایی می‌سازد — همان چیزی که در منظره‌ی واقعی عمق می‌دهد. */
      const fog = ctx.createLinearGradient(0, 196, 0, GROUND_Y);
      fog.addColorStop(0, 'rgba(0,0,0,0)');
      fog.addColorStop(1, zm.t > 0.5 ? zm.b.glow : zm.a.glow);
      ctx.fillStyle = fog;
      ctx.fillRect(0, 196, width, GROUND_Y - 196);

      /* ---- شعاع‌های نور از بالا ----
         سه باریکه‌ی مورب که آرام نبض می‌زنند. کم‌رنگ‌اند تا صحنه را
         شست‌وشو ندهند؛ کارشان فقط جهت دادن به نور است. */
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 3; k++) {
        const bx = ((k * 380 - cam * 0.08) % (width + 500) + width + 500) % (width + 500) - 250;
        const alpha = 0.05 + Math.sin(w.t * 0.7 + k * 2) * 0.03;
        const sg = ctx.createLinearGradient(bx, 0, bx + 90, GROUND_Y);
        sg.addColorStop(0, `rgba(255,255,255,${Math.max(0, alpha)})`);
        sg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.moveTo(bx, 0);
        ctx.lineTo(bx + 54, 0);
        ctx.lineTo(bx + 128, GROUND_Y);
        ctx.lineTo(bx + 40, GROUND_Y);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // ---- سکوهای شناور ----      // ---- سکوهای شناور ----
      PLATFORMS.forEach((p) => {
        const x = p.x - cam;
        if (x + p.w < -40 || x > width + 40) return;
        const pz = zoneMix(p.x + p.w / 2);
        const pAccent = mixHex(pz.a.accent, pz.b.accent, pz.t);
        ctx.fillStyle = mixHex(pz.a.ground, pz.b.ground, pz.t);
        roundRect(ctx, x, p.y, p.w, 18, 6);
        ctx.fill();
        const g = ctx.createLinearGradient(x, p.y, x + p.w, p.y);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(0.5, pAccent);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x, p.y, p.w, 2);
      });

      // ---- زمین با شکاف‌ها ----
      let segStart = 0;
      const edges: number[] = [];
      GAPS.forEach(([a, b]) => { edges.push(a, b); });
      const bounds = [0, ...edges, 6200];
      for (let i = 0; i < bounds.length - 1; i += 2) {
        segStart = bounds[i];
        const segEnd = bounds[i + 1];
        const x = segStart - cam;
        const segW = segEnd - segStart;
        if (x + segW < -40 || x > width + 40) continue;
        ctx.fillStyle = mixHex(zm.a.ground, zm.b.ground, zm.t);
        ctx.fillRect(x, GROUND_Y, segW, H - GROUND_Y);
        // لبه‌ی نورانی، به رنگ همان سرزمین
        const g = ctx.createLinearGradient(0, GROUND_Y, 0, GROUND_Y + 4);
        g.addColorStop(0, zAccent);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x, GROUND_Y, segW, 4);
      }

      // ---- سکه‌ها ----
      COINS.forEach((c, i) => {
        if (w.coinsGot[i]) return;
        const x = c.x - cam;
        if (x < -20 || x > width + 20) return;
        const bob = Math.sin(w.t * 3 + i) * 3;
        // چرخش با فشرده کردن عرض — سکه‌ی سه‌بعدی بدون سه‌بعدی
        const sq = Math.abs(Math.cos(w.t * 3 + i * 0.7));
        ctx.save();
        ctx.translate(x, c.y + bob);
        ctx.scale(Math.max(0.15, sq), 1);
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#f0b429';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffe08a';
        ctx.stroke();
        ctx.restore();
      });

      // ---- پرچم‌ها ----
      FLAGS.forEach((f, i) => {
        const x = f.x - cam;
        if (x < -80 || x > width + 80) return;
        const hit = w.flagsHit[i];
        const base = GROUND_Y;
        const top = base - 118;

        ctx.strokeStyle = '#cdd6e2';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, base);
        ctx.lineTo(x, top);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, top - 4, 5, 0, Math.PI * 2);
        ctx.fillStyle = hit ? '#f0b429' : '#8b93a1';
        ctx.fill();

        // پرچم پایین است تا وقتی رد نشده‌ای، بعد بالا می‌رود
        const raise = hit ? Math.min(1, (w.t % 1000) * 0 + 1) : 0;
        const fy = hit ? top + 8 : base - 46;
        const wave = Math.sin(w.t * 5 + i) * 4 * (hit ? 1 : 0.35);

        ctx.beginPath();
        ctx.moveTo(x + 2, fy);
        ctx.quadraticCurveTo(x + 26, fy + 8 + wave, x + 50, fy + 2);
        ctx.lineTo(x + 50, fy + 30);
        ctx.quadraticCurveTo(x + 26, fy + 36 + wave, x + 2, fy + 28);
        ctx.closePath();
        const fg = ctx.createLinearGradient(x, fy, x + 50, fy + 30);
        fg.addColorStop(0, hit ? '#ff5f6d' : '#7a2230');
        fg.addColorStop(1, hit ? '#c81e3a' : '#511824');
        ctx.fillStyle = fg;
        ctx.fill();

        if (hit) {
          ctx.shadowColor = 'rgba(255,95,109,0.8)';
          ctx.shadowBlur = 18;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // برچسب سطح
        ctx.font = '700 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = hit ? '#ffd9a8' : '#6d7484';
        ctx.fillText(f.label, x + 24, base + 20);
        void raise;
      });

      // ---- خط پایان ----
      {
        const x = FINISH_X - cam;
        if (x > -60 && x < width + 60) {
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 3; c++) {
              ctx.fillStyle = (r + c) % 2 ? '#ffffff' : '#1a1130';
              ctx.fillRect(x + c * 12, GROUND_Y - 118 + r * 14, 12, 14);
            }
          }
          ctx.strokeStyle = '#cdd6e2';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x, GROUND_Y);
          ctx.lineTo(x, GROUND_Y - 122);
          ctx.stroke();
        }
      }

      // ---- ذرات ----
      w.parts.forEach((p) => {
        const k = 1 - p.life / p.max;
        ctx.globalAlpha = k;
        ctx.fillStyle = `hsl(${p.hue}, 95%, ${45 + k * 25}%)`;
        ctx.beginPath();
        ctx.arc(p.x - cam, p.y, 1 + k * 3.4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // ---- ققنوس ----
      {
        const x = w.px - cam;
        const y = w.py;
        const flap = Math.sin(w.flap) * (w.onGround ? 0.12 : 0.4);
        const tilt = Math.max(-0.35, Math.min(0.45, w.vy / 1800));

        ctx.save();
        ctx.translate(x, y - 22);
        ctx.rotate(tilt);

        // هاله
        const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 42);
        glow.addColorStop(0, 'rgba(245,148,64,0.5)');
        glow.addColorStop(1, 'rgba(245,148,64,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, Math.PI * 2);
        ctx.fill();

        const img = phoenixRef.current;
        if (img) {
          ctx.save();
          ctx.scale(1, 1 + flap * 0.28);
          ctx.drawImage(img, -26, -26, 52, 52);
          ctx.restore();
        } else {
          // جایگزین تا وقتی تصویر برسد
          ctx.fillStyle = '#f59440';
          ctx.beginPath();
          ctx.ellipse(0, 0, 16, 12 + flap * 5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.restore();

      /* ---- اعلان نام سرزمین ----
         محو شدن دو سر دارد: ورود سریع، خروج آرام. عدد ۰٫۴ و ۰٫۶ یعنی
         متن زود خوانا شود و بعد بی‌عجله برود. */
      if (w.zoneBanner > 0) {
        const z = ZONES[w.zoneShown];
        const fade = Math.min(1, w.zoneBanner / 0.6, (2.6 - w.zoneBanner) / 0.4);
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.textAlign = 'center';
        ctx.font = '900 19px Vazirmatn, system-ui, sans-serif';
        ctx.shadowColor = z.accent;
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#fff';
        ctx.fillText(z.name, width / 2, 54);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = fade * 0.8;
        ctx.fillStyle = z.accent;
        ctx.fillRect(width / 2 - 34, 64, 68, 2);
        ctx.restore();
      }

      // ---- مه لبه‌ها، تا برش بوم خشک نباشد ----
      const fadeL = ctx.createLinearGradient(0, 0, 44, 0);
      fadeL.addColorStop(0, 'rgba(10,7,19,1)');
      fadeL.addColorStop(1, 'rgba(10,7,19,0)');
      ctx.fillStyle = fadeL;
      ctx.fillRect(0, 0, 44, H);

      const fadeR = ctx.createLinearGradient(width - 44, 0, width, 0);
      fadeR.addColorStop(0, 'rgba(10,7,19,0)');
      fadeR.addColorStop(1, 'rgba(10,7,19,1)');
      ctx.fillStyle = fadeR;
      ctx.fillRect(width - 44, 0, 44, H);
    };

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      let dt = (now - last) / 1000;
      last = now;
      // بعد از تب‌سوییچ، dt عظیم می‌شود — سقف می‌گذاریم تا از دیوار رد نشود
      if (dt > 0.25) dt = 0.25;
      acc += dt;
      let guard = 0;
      while (acc >= STEP && guard < 240) { step(); acc -= STEP; guard++; }
      draw();
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [onFlag]);

  /* ---------- کنترل‌ها ---------- */

  const start = () => {
    const w = worldRef.current;
    if (w.done) return restart();
    sound.init();
    w.running = true;
    setRunning(true);
  };

  const pause = () => {
    const w = worldRef.current;
    w.running = false;
    setRunning(false);
    // فقط همین‌جا لازم است تا دکمه «ادامه» شود، نه «شروع»
    setProgress(Math.min(1, w.px / FINISH_X));
  };

  const restart = () => {
    const fresh = makeWorld();
    fresh.running = true;
    worldRef.current = fresh;
    if (barRef.current) barRef.current.style.width = '0%';
    setCoins(0);
    setDone(false);
    setProgress(0);
    setRunning(true);
    sound.click();
  };

  if (reduce) {
    return (
      <div className="lvl lvl--static">
        <p>
          این بخش یک بازی کوچک است که با حرکت اجرا می‌شود. چون حالت «کاهش حرکت»
          روی دستگاه شما فعال است، اجرا نمی‌شود — همه‌ی سطح‌ها پایین به‌صورت
          کامل فهرست شده‌اند.
        </p>
      </div>
    );
  }

  return (
    <div className="lvl" ref={hostRef}>
      <canvas
        ref={canvasRef}
        className="lvl__canvas"
        style={{ height: VIEW_H }}
        onPointerDown={(e) => { e.preventDefault(); if (!running) start(); else jump(); }}
        role="img"
        aria-label="بازی سطح‌های باشگاه — با فاصله یا لمس صفحه بپر"
      />

      {/* روکش شروع */}
      {!running && !done && (
        <div className="lvl__overlay">
          <Gamepad2 className="lvl__overlay-icon" />
          <b>چهار پرچم تا الماس</b>
          <span>
            ققنوس خودش می‌دود. کار تو فقط پریدن است — با <kbd>Space</kbd> یا
            لمس صفحه. از هر پرچم که رد شوی، یک سطح باشگاه پایین روشن می‌شود.
          </span>
          <button type="button" className="lvl__start" onClick={start}>
            <Play className="w-4 h-4" />
            {progress > 0 ? 'ادامه' : 'شروع'}
          </button>
        </div>
      )}

      {/* روکش پایان */}
      {done && (
        <div className="lvl__overlay">
          <b>رسیدی به خط پایان</b>
          <span>
            هر چهار پرچم را زدی. <span className="num-en">{coins.toLocaleString('fa-IR')}</span> سکه
            هم جمع کردی — سکه‌ها فقط برای دل خودت‌اند، امتیاز واقعی با خرید
            جمع می‌شود.
          </span>
          <button type="button" className="lvl__start" onClick={restart}>
            <RotateCcw className="w-4 h-4" />
            یک بار دیگر
          </button>
        </div>
      )}

      {/* نوار وضعیت */}
      <div className="lvl__hud">
        <div className="lvl__progress" aria-hidden="true">
          <span ref={barRef} />
          {FLAGS.map((f, i) => (
            <i
              key={f.label}
              className={worldRef.current.flagsHit[i] || i < unlockedByCart ? 'is-hit' : ''}
              style={{ insetInlineStart: `${(f.x / FINISH_X) * 100}%` }}
            />
          ))}
        </div>

        <span className="lvl__coins num-en">
          {coins.toLocaleString('fa-IR')} <small>سکه</small>
        </span>

        {running ? (
          <button type="button" className="lvl__ctl" onClick={pause} aria-label="توقف">
            <Pause className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button type="button" className="lvl__ctl" onClick={start} aria-label="ادامه">
            <Play className="w-3.5 h-3.5" />
          </button>
        )}
        <button type="button" className="lvl__ctl" onClick={restart} aria-label="از اول">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* دکمه‌ی پرش موبایل */}
      {running && (
        <button
          type="button"
          className="lvl__jump"
          onPointerDown={(e) => { e.preventDefault(); jump(); }}
          aria-label="پرش"
        >
          پرش
        </button>
      )}
    </div>
  );
}

/** مستطیل گردگوشه — روی سافاری قدیمی roundRect بومی نیست */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
