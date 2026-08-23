import React, { useEffect, useState } from 'react';
import { SukhoiSu57Fighter } from './SukhoiSu57Fighter';
import { soundEngine } from '../utils/soundEngine';

export interface JetFlyMission {
  id: string;
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  productName?: string;
}

export interface FighterJetFlyOverlayProps {
  missions?: JetFlyMission[];
  onMissionComplete?: (id: string) => void;
  startX?: number;
  startY?: number;
  targetElementId?: string;
  onAnimationComplete?: () => void;
  productName?: string;
}

interface ActiveJetAnimation {
  id: string;
  x: number;
  y: number;
  angle: number;
  scale: number;
  opacity: number;
  afterburner: number;
  productName?: string;
  trailPoints: { x: number; y: number; opacity: number }[];
}

export const FighterJetFlyOverlay: React.FC<FighterJetFlyOverlayProps> = ({
  missions,
  onMissionComplete,
  startX,
  startY,
  targetElementId = 'navbar-cart-button',
  onAnimationComplete,
  productName,
}) => {
  const [activeJets, setActiveJets] = useState<ActiveJetAnimation[]>([]);
  const [shockwaves, setShockwaves] = useState<{ id: string; x: number; y: number }[]>([]);

  useEffect(() => {
    const activeMissions: JetFlyMission[] = [];

    if (missions && Array.isArray(missions) && missions.length > 0) {
      activeMissions.push(...missions);
    } else if (startX !== undefined && startY !== undefined) {
      activeMissions.push({
        id: `single-flight-${Date.now()}`,
        startX,
        startY,
        productName,
      });
    }

    if (activeMissions.length === 0) return;

    activeMissions.forEach((mission) => {
      // Find destination coordinates (Cart icon in navbar)
      let targetX = mission.endX;
      let targetY = mission.endY;

      if (targetX === undefined || targetY === undefined) {
        const cartEl = document.getElementById(targetElementId || 'navbar-cart-button');
        if (cartEl) {
          const rect = cartEl.getBoundingClientRect();
          targetX = rect.left + rect.width / 2;
          targetY = rect.top + rect.height / 2;
        } else {
          targetX = 65; // Left corner in RTL top header
          targetY = 40;
        }
      }

      // Play authentic jet takeoff sound
      soundEngine.playJetTakeoff();

      const startTime = performance.now();
      const duration = 1450; // Slower, graceful flight trajectory (~1.45 seconds)

      // Start, Control Points, and End Point for smooth 3D Bezier arc
      const p0 = { x: mission.startX, y: mission.startY };
      const p3 = { x: targetX, y: targetY };
      
      // Control point 1: Gentle initial vertical climb up & outwards
      const cp1X = p0.x + (p0.x < p3.x ? -60 : 60);
      const cp1Y = p0.y - 180;

      // Control point 2: High altitude banking curve towards destination
      const cp2X = (p0.x + p3.x) / 2 + (p0.x < p3.x ? 40 : -40);
      const cp2Y = Math.min(p0.y, p3.y) - 140;

      const trailHistory: { x: number; y: number; opacity: number }[] = [];

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const rawT = Math.min(1, elapsed / duration);
        
        // Smooth Cubic S-curve easing (accelerate gently, cruise, decelerate into docking)
        const t = rawT < 0.5 
          ? 4 * rawT * rawT * rawT 
          : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

        // Cubic Bezier Formula: B(t) = (1-t)^3 * P0 + 3(1-t)^2*t * P1 + 3(1-t)*t^2 * P2 + t^3 * P3
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;

        const currentX = uuu * p0.x + 3 * uu * t * cp1X + 3 * u * tt * cp2X + ttt * p3.x;
        const currentY = uuu * p0.y + 3 * uu * t * cp1Y + 3 * u * tt * cp2Y + ttt * p3.y;

        // Calculate tangent vector for realistic pitch & roll angle
        const delta = 0.015;
        const tNext = Math.min(1, t + delta);
        const uNext = 1 - tNext;
        const nextX = uNext * uNext * uNext * p0.x + 3 * uNext * uNext * tNext * cp1X + 3 * uNext * tNext * tNext * cp2X + tNext * tNext * tNext * p3.x;
        const nextY = uNext * uNext * uNext * p0.y + 3 * uNext * uNext * tNext * cp1Y + 3 * uNext * tNext * tNext * cp2Y + tNext * tNext * tNext * p3.y;

        const dx = nextX - currentX;
        const dy = nextY - currentY;
        // SVG jet nose points up (0 deg) -> +90 deg offset
        const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

        // Dynamic 3D Scale: Takes off slightly smaller, zooms in during high-altitude climb, smoothly shrinks into cart capsule
        const currentScale = 0.65 + Math.sin(rawT * Math.PI) * 0.55 * (1 - rawT * 0.4);
        const currentOpacity = rawT > 0.9 ? (1 - rawT) / 0.1 : 1;

        // Add trail particle
        trailHistory.push({ x: currentX, y: currentY, opacity: 0.85 });
        if (trailHistory.length > 8) trailHistory.shift();

        setActiveJets((prev) => {
          const others = prev.filter((j) => j.id !== mission.id);
          if (rawT >= 1) return others;
          return [
            ...others,
            {
              id: mission.id,
              x: currentX,
              y: currentY,
              angle: angleDeg,
              scale: currentScale,
              opacity: currentOpacity,
              afterburner: 1 - rawT * 0.3,
              productName: mission.productName,
              trailPoints: [...trailHistory],
            },
          ];
        });

        if (rawT < 1) {
          requestAnimationFrame(animate);
        } else {
          // Mission completed at cart button
          soundEngine.playSonicBoom();
          soundEngine.playAddCart();
          
          setShockwaves((prev) => [
            ...prev,
            { id: `${mission.id}-shock`, x: p3.x, y: p3.y },
          ]);

          setTimeout(() => {
            setShockwaves((prev) => prev.filter((s) => s.id !== `${mission.id}-shock`));
          }, 700);

          if (onMissionComplete) {
            onMissionComplete(mission.id);
          }
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }
      };

      requestAnimationFrame(animate);
    });
  }, [missions, startX, startY, targetElementId, onMissionComplete, onAnimationComplete, productName]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Active Jets in Flight */}
      {activeJets.map((jet) => (
        <React.Fragment key={jet.id}>
          {/* Contrail Heat Particles */}
          {jet.trailPoints.map((tp, idx) => {
            const particleOpacity = (idx / jet.trailPoints.length) * 0.6;
            return (
              <div
                key={idx}
                className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-amber-500 blur-[2px] pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${tp.x}px`,
                  top: `${tp.y}px`,
                  opacity: particleOpacity,
                  transform: `scale(${(idx / jet.trailPoints.length) * 1.5})`,
                }}
              />
            );
          })}

          {/* Jet Body Container */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
            style={{
              left: `${jet.x}px`,
              top: `${jet.y}px`,
              opacity: jet.opacity,
              transform: `scale(${jet.scale})`,
            }}
          >
            {/* Su-57 Fighter Jet */}
            <SukhoiSu57Fighter
              size={120}
              rollAngle={jet.angle}
              afterburnerIntensity={jet.afterburner}
            />

            {/* Glowing Supply Package Attached to Cargo Pylon */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-black font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.9)] border border-white flex items-center gap-1.5 whitespace-nowrap animate-bounce"
            >
              <span>🎮</span>
              <span>{jet.productName ? jet.productName.slice(0, 15) : 'تحویل به سبد خرید'}</span>
            </div>
          </div>
        </React.Fragment>
      ))}

      {/* Supersonic Sonic Ring Shockwave on Cart Docking */}
      {shockwaves.map((sw) => (
        <div
          key={sw.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${sw.x}px`, top: `${sw.y}px` }}
        >
          <div className="w-24 h-24 rounded-full border-2 border-amber-400 animate-ping opacity-75" />
          <div className="absolute inset-0 w-16 h-16 -translate-x-1/2 -translate-y-1/2 m-auto rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 blur-md opacity-90 animate-pulse" />
        </div>
      ))}
    </div>
  );
};
