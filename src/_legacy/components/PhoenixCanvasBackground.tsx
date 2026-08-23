import React, { useEffect, useRef } from 'react';

interface PhoenixCanvasBackgroundProps {
  scrollProgress: number; // 0 to 1
  mousePos?: { x: number; y: number };
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  color: string;
  alpha: number;
  phase: number;
  speed: number;
  life: number;
  maxLife: number;
  isFireEmber?: boolean;
}

export const PhoenixCanvasBackground: React.FC<PhoenixCanvasBackgroundProps> = ({
  scrollProgress = 0,
  mousePos = { x: 0.5, y: 0.5 },
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const flameParticlesRef = useRef<Particle[]>([]);
  const scrollProgressRef = useRef(scrollProgress);
  const mousePosRef = useRef(mousePos);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress ?? 0;
  }, [scrollProgress]);

  useEffect(() => {
    mousePosRef.current = mousePos ?? { x: 0.5, y: 0.5 };
  }, [mousePos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initPhoenixPoints();
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: e.clientX / (window.innerWidth || 1),
        y: e.clientY / (window.innerHeight || 1),
      };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });

    // Color palette matching Phoenix logo
    const phoenixColors = [
      '#FFA100', // Fiery Gold
      '#FF4B2B', // Radiant Coral
      '#FF007F', // Deep Magenta
      '#C026D3', // Fuchsia
      '#8A2BE2', // Electric Violet
      '#6366F1', // Indigo
    ];

    // Generate Phoenix shape coordinates
    const initPhoenixPoints = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(220, Math.floor(width / 7));
      const centerX = width * 0.5;
      const centerY = height * 0.45;
      const scale = Math.min(width, height) * 0.38;

      for (let i = 0; i < particleCount; i++) {
        // Parametric Wing & Body formulas
        const t = (i / particleCount) * Math.PI * 2;
        const side = i % 2 === 0 ? 1 : -1;
        const wingSpan = Math.sin(t * 1.5) * scale;
        const wingLift = -Math.cos(t) * (scale * 0.65) - Math.abs(Math.sin(t * 2)) * (scale * 0.25);

        const px = centerX + side * (Math.abs(wingSpan) + Math.random() * 20);
        const py = centerY + wingLift + (Math.random() - 0.5) * 25;

        particles.push({
          x: px,
          y: py,
          originX: px,
          originY: py,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2.5 + 1.2,
          baseSize: Math.random() * 2.5 + 1.2,
          color: phoenixColors[i % phoenixColors.length],
          alpha: Math.random() * 0.6 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.01,
          life: 0,
          maxLife: 200 + Math.random() * 100,
        });
      }
      particlesRef.current = particles;

      // Flame embers for hot sections
      const flameCount = 100;
      const flames: Particle[] = [];
      for (let j = 0; j < flameCount; j++) {
        flames.push({
          x: Math.random() * width,
          y: height + Math.random() * 200,
          originX: Math.random() * width,
          originY: height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * 2.5 + 1.5),
          size: Math.random() * 3 + 1,
          baseSize: Math.random() * 3 + 1,
          color: Math.random() > 0.4 ? '#FF5500' : '#FF0055',
          alpha: Math.random() * 0.8 + 0.2,
          phase: Math.random() * Math.PI,
          speed: 0.03,
          life: Math.random() * 100,
          maxLife: 120 + Math.random() * 60,
          isFireEmber: true,
        });
      }
      flameParticlesRef.current = flames;
    };

    initPhoenixPoints();

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const curScroll = scrollProgressRef.current ?? 0;
      const curMouse = mousePosRef.current ?? { x: 0.5, y: 0.5 };

      // Scenario State based on scrollProgress
      // 0.0 - 0.28: Hero - Phoenix Soaring
      // 0.28 - 0.58: Hot Section - Igniting into Fire & Sparks
      // 0.58 - 0.82: AI Section - Dissolving & Reassembling
      // 0.82 - 1.0: Footer & End - Ascending Flight

      const isFirePhase = curScroll > 0.22 && curScroll < 0.65;
      const fireIntensity = Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (curScroll - 0.22) / 0.43))));
      const isReassemblingPhase = curScroll >= 0.58 && curScroll < 0.82;
      const reassemblyFactor = isReassemblingPhase ? Math.sin(Math.PI * ((curScroll - 0.58) / 0.24)) : 0;
      const flightOffset = curScroll * height * 0.75;

      // 1. Ambient Background Nebulae & Radial Glows
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45 - flightOffset * 0.4,
        50,
        width * 0.5,
        height * 0.45 - flightOffset * 0.4,
        Math.max(width, height) * 0.65
      );

      if (fireIntensity > 0.1) {
        // Fiery background shift during Hot Deals
        bgGrad.addColorStop(0, `rgba(255, 60, 20, ${0.12 * fireIntensity})`);
        bgGrad.addColorStop(0.4, `rgba(220, 20, 80, ${0.08 * fireIntensity})`);
        bgGrad.addColorStop(0.8, 'rgba(10, 7, 18, 0)');
      } else {
        // Celestial Phoenix purple-gold aura
        bgGrad.addColorStop(0, 'rgba(255, 120, 40, 0.07)');
        bgGrad.addColorStop(0.35, 'rgba(180, 30, 140, 0.05)');
        bgGrad.addColorStop(0.7, 'rgba(100, 30, 200, 0.03)');
        bgGrad.addColorStop(1, 'rgba(6, 4, 11, 0)');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Phoenix Constellation / Particle Wings
      const particles = particlesRef.current || [];
      const wingFlap = Math.sin(frame * 0.035) * (20 + fireIntensity * 25);
      const targetCenterY = height * 0.45 - flightOffset + (isReassemblingPhase ? Math.sin(frame * 0.05) * 40 : 0);

      // Render connected energy lines between close particles
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i += 3) {
        const p1 = particles[i];
        for (let j = i + 1; j < Math.min(i + 4, particles.length); j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 75) {
            const lineAlpha = (1 - dist / 75) * 0.25 * (1 - fireIntensity * 0.5);
            ctx.strokeStyle = `rgba(255, 120, 180, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw and update each Phoenix Particle
      particles.forEach((p, idx) => {
        p.phase += p.speed;

        // Base flight motion
        const flapOffset = (idx % 2 === 0 ? 1 : -1) * (Math.sin(p.phase) * wingFlap);
        let targetX = p.originX + Math.sin(p.phase * 0.7) * 15;
        let targetY = p.originY - flightOffset + flapOffset;

        // Fire phase: particles burst outwards like sparks
        if (fireIntensity > 0) {
          const explodeAngle = (idx / particles.length) * Math.PI * 2;
          const explodeDist = fireIntensity * (80 + Math.sin(idx + frame * 0.05) * 40);
          targetX += Math.cos(explodeAngle) * explodeDist;
          targetY += Math.sin(explodeAngle) * explodeDist - fireIntensity * 30;
        }

        // Reassembly phase: spiral suction effect
        if (reassemblyFactor > 0) {
          const spiralAngle = frame * 0.04 + idx * 0.1;
          const spiralRad = (1 - reassemblyFactor * 0.6) * 120;
          targetX = width * 0.5 + Math.cos(spiralAngle) * spiralRad;
          targetY = targetCenterY + Math.sin(spiralAngle) * (spiralRad * 0.6);
        }

        // Mouse avoidance/attraction
        const mouseX = curMouse?.x ?? 0.5;
        const mouseY = curMouse?.y ?? 0.5;
        const dxMouse = mouseX * width - p.x;
        const dyMouse = mouseY * height - p.y;
        const mouseDist = Math.hypot(dxMouse, dyMouse);
        if (mouseDist < 120 && mouseDist > 0) {
          const force = (120 - mouseDist) / 120;
          targetX -= (dxMouse / mouseDist) * force * 25;
          targetY -= (dyMouse / mouseDist) * force * 25;
        }

        // Smooth interpolation
        p.x += (targetX - p.x) * 0.08;
        p.y += (targetY - p.y) * 0.08;

        // Glow render
        ctx.save();
        ctx.beginPath();
        const pulseSize = p.baseSize * (1 + Math.sin(p.phase * 2) * 0.3 + fireIntensity * 0.6);
        ctx.arc(p.x, p.y, Math.max(0.5, pulseSize), 0, Math.PI * 2);

        if (fireIntensity > 0.4) {
          ctx.fillStyle = idx % 2 === 0 ? '#FFA100' : '#FF2A6D';
          ctx.shadowColor = '#FF5500';
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
        }

        ctx.globalAlpha = Math.min(1, p.alpha * (0.8 + fireIntensity * 0.4));
        ctx.fill();
        ctx.restore();
      });

      // 3. Fire Embers & Sparks during Hot Deals phase
      if (fireIntensity > 0.05) {
        const flames = flameParticlesRef.current || [];
        flames.forEach((flame) => {
          flame.life++;
          flame.x += flame.vx + Math.sin(frame * 0.05 + flame.life * 0.1) * 0.8;
          flame.y += flame.vy * (1 + fireIntensity * 1.5);

          if (flame.y < -20 || flame.life > flame.maxLife) {
            flame.y = height + Math.random() * 50;
            flame.x = width * 0.2 + Math.random() * (width * 0.6);
            flame.life = 0;
          }

          const emberProgress = flame.life / flame.maxLife;
          const emberAlpha = (1 - emberProgress) * flame.alpha * fireIntensity;

          ctx.save();
          ctx.beginPath();
          ctx.arc(flame.x, flame.y, flame.size * (1 - emberProgress * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = flame.life % 2 === 0 ? '#FFA000' : '#FF2E7E';
          ctx.shadowColor = '#FF4500';
          ctx.shadowBlur = 10;
          ctx.globalAlpha = emberAlpha;
          ctx.fill();
          ctx.restore();
        });
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.92 }}
    />
  );
};
