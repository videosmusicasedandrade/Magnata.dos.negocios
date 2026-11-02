import React, { useEffect, useRef, useState } from 'react';
import { EconomicCycle, Employee } from '../types/game';
import { soundEngine } from '../game/audio';

interface OfficeCanvasProps {
  employees: Employee[];
  skyscraperFloors: number;
  economicCycle: EconomicCycle;
  hackerAttackUnderway: boolean;
  onTap: (x: number, y: number) => void;
  clickPower: number;
  activeDecorations?: string[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
  isCrit?: boolean;
}

interface WorkerSprite {
  id: string;
  name: string;
  role: string;
  deskX: number;
  deskY: number;
  currX: number;
  currY: number;
  targetX: number;
  targetY: number;
  state: 'typing' | 'walking' | 'coffee' | 'thinking';
  direction: 1 | -1;
  frame: number;
  bubble: string | null;
  bubbleTimer: number;
  hairColor: string;
  shirtColor: string;
  skinColor: string;
  jumpOffset: number;
}

const HAIR_COLORS = ['#3e2723', '#212121', '#ffb300', '#d84315', '#795548', '#8d6e63'];
const SHIRT_COLORS = ['#1e88e5', '#43a047', '#e53935', '#8e24aa', '#fb8c00', '#00acc1'];
const SKIN_COLORS = ['#ffcc80', '#ffe0b2', '#d7ccc8', '#bcaaa4', '#8d6e63'];
const BUBBLES = ['💰', '📈', '☕', '💡', '💻', '🚀', '📊', '🔥'];

export const OfficeCanvas: React.FC<OfficeCanvasProps> = ({
  employees,
  skyscraperFloors,
  economicCycle,
  hackerAttackUnderway,
  onTap,
  clickPower,
  activeDecorations = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const workersRef = useRef<WorkerSprite[]>([]);
  const deskShakeRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const nextIdRef = useRef<number>(1);
  const [comboCount, setComboCount] = useState<number>(0);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync workers list with employees
  useEffect(() => {
    const existing = new Map(workersRef.current.map((w) => [w.id, w]));
    const desks = [
      { x: 120, y: 240 },
      { x: 260, y: 240 },
      { x: 400, y: 240 },
      { x: 540, y: 240 },
      { x: 180, y: 340 },
      { x: 340, y: 340 },
      { x: 480, y: 340 },
    ];

    const updated: WorkerSprite[] = employees.map((emp, idx) => {
      const desk = desks[idx % desks.length];
      const prev = existing.get(emp.id);
      if (prev) {
        return {
          ...prev,
          name: emp.name,
          role: emp.roleTitle,
        };
      }
      const seed = emp.avatarSeed || idx;
      return {
        id: emp.id,
        name: emp.name,
        role: emp.roleTitle,
        deskX: desk.x,
        deskY: desk.y,
        currX: desk.x,
        currY: desk.y,
        targetX: desk.x,
        targetY: desk.y,
        state: 'typing',
        direction: 1,
        frame: 0,
        bubble: '💡',
        bubbleTimer: 60 + (seed % 60),
        hairColor: HAIR_COLORS[seed % HAIR_COLORS.length],
        shirtColor: SHIRT_COLORS[(seed * 3) % SHIRT_COLORS.length],
        skinColor: SKIN_COLORS[(seed * 2) % SKIN_COLORS.length],
        jumpOffset: 0,
      };
    });

    workersRef.current = updated;
  }, [employees]);

  // Main 60 FPS animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Virtual Coordinate Resolution (600 x 380)
      const VIRTUAL_W = 600;
      const VIRTUAL_H = 380;
      const scaleX = width / VIRTUAL_W;
      const scaleY = height / VIRTUAL_H;

      ctx.save();
      ctx.scale(scaleX, scaleY);

      // 1. Draw Background: Sky & City View from Skyscraper
      drawSkyline(ctx, VIRTUAL_W, VIRTUAL_H, skyscraperFloors, time);

      // 2. Draw Office Room Interior
      drawOfficeRoom(ctx, VIRTUAL_W, VIRTUAL_H, skyscraperFloors, deskShakeRef.current);

      // Decay desk shake
      if (deskShakeRef.current > 0) {
        deskShakeRef.current *= 0.85;
        if (deskShakeRef.current < 0.2) deskShakeRef.current = 0;
      }

      // 3. Draw Desks & Computers
      drawDesks(ctx, workersRef.current.length, skyscraperFloors);

      // 4. Update & Draw Workers
      updateAndDrawWorkers(ctx, workersRef.current, time);

      // 5. Draw CEO Centerpiece Desk (Tap Area)
      drawCEODesk(ctx, VIRTUAL_W / 2, VIRTUAL_H - 65, deskShakeRef.current);

      // 6. Update and Draw Particles
      updateAndDrawParticles(ctx, particlesRef.current);

      // 7. Update and Draw Floating Numbers
      updateAndDrawFloatingTexts(ctx, floatingTextsRef.current);

      // 8. Hacker Invasion Glitch Lines Overlay
      if (hackerAttackUnderway) {
        drawHackerAlarmOverlay(ctx, VIRTUAL_W, VIRTUAL_H, time);
      }

      // 9. Economic cycle ambiance overlay (subtle bottom ticker arrow particles)
      drawCycleAmbiance(ctx, VIRTUAL_W, VIRTUAL_H, economicCycle, time);

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [skyscraperFloors, economicCycle, hackerAttackUnderway]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = Math.floor(rect.width);
        canvasRef.current.height = Math.floor(rect.height);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle Tap
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = (canvas.width || 600) / 600;
    const scaleY = (canvas.height || 380) / 380;
    const x = (e.clientX - rect.left) / scaleX;
    const y = (e.clientY - rect.top) / scaleY;

    // Check if worker was tapped
    for (const w of workersRef.current) {
      const dist = Math.hypot(w.currX - x, w.currY - y);
      if (dist < 40) {
        w.jumpOffset = 18;
        w.bubble = '❤️';
        w.bubbleTimer = 90;
        soundEngine.playCoin();
        break;
      }
    }

    // Trigger Tap action
    onTap(x, y);
    soundEngine.playCoin();

    // Critical tap chance (15%)
    const isCrit = Math.random() < 0.15;
    const gain = isCrit ? clickPower * 3 : clickPower;

    // Shake desk
    deskShakeRef.current = isCrit ? 6 : 3;

    // Spawn floating text
    floatingTextsRef.current.push({
      id: nextIdRef.current++,
      x,
      y: y - 10,
      text: isCrit ? `CRÍTICO! +R$ ${gain.toLocaleString('pt-BR')}` : `+R$ ${gain.toLocaleString('pt-BR')}`,
      color: isCrit ? '#facc15' : '#4ade80',
      alpha: 1,
      scale: isCrit ? 1.4 : 1.0,
      isCrit,
    });

    // Spawn coin particles
    const particleCount = isCrit ? 14 : 7;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        alpha: 1,
        color: Math.random() > 0.4 ? '#facc15' : '#fbbf24',
        size: 3 + Math.random() * 3,
      });
    }

    // Combo multiplier tracker
    setComboCount((c) => c + 1);
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setComboCount(0);
    }, 1200);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[250px] sm:h-[320px] md:h-[380px] overflow-hidden rounded-xl border-4 border-slate-700 bg-slate-900 shadow-xl retro-box select-none cursor-pointer"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className="w-full h-full block pixelated"
      />

      {/* Floating Combo Indicator */}
      {comboCount > 2 && (
        <div className="absolute top-3 right-3 bg-amber-500/95 text-slate-950 font-pixel text-[10px] sm:text-xs px-2.5 py-1 rounded shadow-lg border-2 border-amber-300 animate-bounce pointer-events-none">
          COMBO x{comboCount}! 🔥
        </div>
      )}

      {/* Click Hint Bar */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 max-w-[95%] bg-slate-950/85 border border-slate-600/70 text-slate-200 text-[9px] sm:text-[11px] font-retro px-3 py-1 rounded-full pointer-events-none flex items-center justify-center gap-1.5 truncate shadow">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
        <span className="truncate">Toque para faturar! (+R$ {clickPower}/toque)</span>
      </div>

      {/* Floor & Office Badge */}
      <div className="absolute top-2.5 left-2.5 bg-slate-900/95 border border-slate-600 text-slate-200 text-[10px] sm:text-xs font-pixel px-2 py-0.5 rounded flex items-center gap-1.5 pointer-events-none">
        <span className="text-amber-400">🏢</span>
        <span>Andar {skyscraperFloors}</span>
      </div>
    </div>
  );
};

// ================= CANVAS DRAWING HELPERS =================

function drawSkyline(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  floors: number,
  time: number
) {
  // Horizon / sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
  if (floors >= 20) {
    // High altitude sunset/night
    skyGrad.addColorStop(0, '#0f172a');
    skyGrad.addColorStop(1, '#312e81');
  } else if (floors >= 5) {
    skyGrad.addColorStop(0, '#1e293b');
    skyGrad.addColorStop(1, '#2563eb');
  } else {
    // Low floor urban day
    skyGrad.addColorStop(0, '#38bdf8');
    skyGrad.addColorStop(1, '#93c5fd');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h * 0.55);

  // Moving Pixel Clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  const cloud1X = ((time * 15) % (w + 100)) - 50;
  const cloud2X = (((time * 8) + 200) % (w + 120)) - 60;
  drawPixelCloud(ctx, cloud1X, 35);
  drawPixelCloud(ctx, cloud2X, 70);

  // Distant City Skyscrapers
  const buildingWidth = 45;
  const numBuildings = Math.ceil(w / buildingWidth) + 1;
  ctx.fillStyle = floors >= 15 ? '#090d16' : '#1e293b';

  for (let i = 0; i < numBuildings; i++) {
    const bHeight = 70 + ((i * 37) % 110);
    const bX = i * buildingWidth;
    const bY = h * 0.55 - bHeight;
    ctx.fillRect(bX, bY, buildingWidth - 6, bHeight);

    // Windows
    ctx.fillStyle = (i + Math.floor(time * 0.5)) % 3 === 0 ? '#fef08a' : '#475569';
    for (let wy = bY + 10; wy < h * 0.55 - 15; wy += 14) {
      for (let wx = bX + 6; wx < bX + buildingWidth - 10; wx += 10) {
        ctx.fillRect(wx, wy, 4, 6);
      }
    }
    ctx.fillStyle = floors >= 15 ? '#090d16' : '#1e293b';
  }
}

function drawPixelCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillRect(x + 10, y, 40, 10);
  ctx.fillRect(x, y + 10, 60, 14);
  ctx.fillRect(x + 5, y + 24, 50, 8);
}

function drawOfficeRoom(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  floors: number,
  shake: number
) {
  const wallY = h * 0.45;

  // Office Back Wall
  ctx.fillStyle = floors >= 20 ? '#1e1b4b' : floors >= 10 ? '#1e293b' : '#334155';
  ctx.fillRect(0, wallY, w, h * 0.15);

  // Large Panoramic Window Frame
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, w - 40, wallY - 10);

  // Window mullions (vertical bars)
  for (let wx = 20; wx < w - 40; wx += (w - 40) / 4) {
    ctx.beginPath();
    ctx.moveTo(wx, 20);
    ctx.lineTo(wx, wallY + 10);
    ctx.stroke();
  }

  // Baseboard trim
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, wallY + h * 0.15 - 4, w, 8);

  // Floor (Wood parquet or luxury carpet depending on floors)
  const floorY = wallY + h * 0.15;
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);

  if (floors >= 20) {
    // Marble tiles
    floorGrad.addColorStop(0, '#111827');
    floorGrad.addColorStop(1, '#030712');
  } else if (floors >= 5) {
    // Parquet Wood
    floorGrad.addColorStop(0, '#78350f');
    floorGrad.addColorStop(1, '#451a03');
  } else {
    // Concrete / Industrial Garage
    floorGrad.addColorStop(0, '#475569');
    floorGrad.addColorStop(1, '#1e293b');
  }

  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY, w, h - floorY);

  // Floor perspective lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  for (let fx = 0; fx < w; fx += 50) {
    ctx.beginPath();
    ctx.moveTo(fx, floorY);
    ctx.lineTo(fx * 1.3 - w * 0.15, h);
    ctx.stroke();
  }

  // Water Cooler / Plant on the left
  drawOfficeDecor(ctx, 30, floorY + 20, floors);
}

function drawOfficeDecor(ctx: CanvasRenderingContext2D, x: number, y: number, floors: number) {
  // Plant pot
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x, y + 20, 20, 22);
  // Plant foliage
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(x - 6, y, 32, 20);
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(x - 2, y + 4, 24, 14);

  // Golden Bull / Trophy if high floors
  if (floors >= 10) {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + 40, y + 10, 24, 18);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x + 56, y + 6, 12, 10);
  }
}

function drawDesks(ctx: CanvasRenderingContext2D, staffCount: number, floors: number) {
  const desks = [
    { x: 120, y: 240 },
    { x: 260, y: 240 },
    { x: 400, y: 240 },
    { x: 540, y: 240 },
    { x: 180, y: 340 },
    { x: 340, y: 340 },
    { x: 480, y: 340 },
  ];

  desks.forEach((d, idx) => {
    // Desk table
    ctx.fillStyle = floors >= 15 ? '#1e293b' : '#92400e';
    ctx.fillRect(d.x - 30, d.y + 10, 60, 20);
    // Desk legs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(d.x - 28, d.y + 30, 6, 22);
    ctx.fillRect(d.x + 22, d.y + 30, 6, 22);

    // Computer Monitor
    ctx.fillStyle = '#334155';
    ctx.fillRect(d.x - 14, d.y - 12, 28, 20);
    // Glowing Screen
    ctx.fillStyle = idx < staffCount ? '#38bdf8' : '#1e293b';
    ctx.fillRect(d.x - 11, d.y - 9, 22, 14);
    // Keyboard
    ctx.fillStyle = '#64748b';
    ctx.fillRect(d.x - 12, d.y + 13, 24, 5);

    // Coffee mug
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(d.x + 16, d.y + 12, 6, 7);
  });
}

function updateAndDrawWorkers(
  ctx: CanvasRenderingContext2D,
  workers: WorkerSprite[],
  time: number
) {
  workers.forEach((w) => {
    // Handle jump offset decay
    if (w.jumpOffset > 0) {
      w.jumpOffset -= 1.5;
      if (w.jumpOffset < 0) w.jumpOffset = 0;
    }

    // Handle bubble timer
    if (w.bubbleTimer > 0) {
      w.bubbleTimer -= 1;
      if (w.bubbleTimer === 0) {
        w.bubble = null;
      }
    } else if (Math.random() < 0.005) {
      w.bubble = BUBBLES[Math.floor(Math.random() * BUBBLES.length)];
      w.bubbleTimer = 90;
    }

    // Draw Worker Sprite (8-bit style)
    const px = w.currX;
    const py = w.currY - w.jumpOffset;

    // Head
    ctx.fillStyle = w.skinColor;
    ctx.fillRect(px - 7, py - 32, 14, 13);

    // Hair
    ctx.fillStyle = w.hairColor;
    ctx.fillRect(px - 8, py - 35, 16, 7);

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px - 4, py - 27, 3, 3);
    ctx.fillRect(px + 2, py - 27, 3, 3);

    // Shirt / Torso
    ctx.fillStyle = w.shirtColor;
    ctx.fillRect(px - 9, py - 19, 18, 16);

    // Tie / Collar
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - 2, py - 19, 4, 8);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(px - 1, py - 18, 2, 7);

    // Typing Hands animation
    const handBob = Math.sin(time * 12 + px) * 2;
    ctx.fillStyle = w.skinColor;
    ctx.fillRect(px - 12, py - 10 + handBob, 4, 4);
    ctx.fillRect(px + 8, py - 10 - handBob, 4, 4);

    // Legs / Pants
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px - 7, py - 3, 5, 12);
    ctx.fillRect(px + 2, py - 3, 5, 12);

    // Speech / thought bubble
    if (w.bubble) {
      drawSpeechBubble(ctx, px, py - 42, w.bubble);
    }
  });
}

function drawSpeechBubble(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(x - 14, y - 14, 28, 22, 6);
  ctx.fill();
  ctx.stroke();

  // Pointer
  ctx.beginPath();
  ctx.moveTo(x - 3, y + 8);
  ctx.lineTo(x, y + 13);
  ctx.lineTo(x + 3, y + 8);
  ctx.fill();
  ctx.stroke();

  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y - 3);
}

function drawCEODesk(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  shake: number
) {
  const shakeX = (Math.random() - 0.5) * shake;
  const shakeY = (Math.random() - 0.5) * shake;

  const dx = x + shakeX;
  const dy = y + shakeY;

  // Big Mahogany Executive Desk
  ctx.fillStyle = '#451a03';
  ctx.fillRect(dx - 90, dy, 180, 42);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(dx - 85, dy + 5, 170, 8);

  // Gold plaque on desk: "CEO MAGNATA"
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(dx - 35, dy + 18, 70, 14);
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CEO MAGNATA', dx, dy + 28);

  // Stacks of Cash on Desk
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(dx - 70, dy - 12, 24, 12);
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(dx - 68, dy - 20, 20, 9);

  // Gold Safe / Piggy bank
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(dx + 50, dy - 16, 20, 16);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(dx + 56, dy - 12, 8, 8);

  // Laptop
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(dx - 15, dy - 18, 30, 18);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(dx - 18, dy, 36, 4);
}

function updateAndDrawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2; // gravity
    p.alpha -= 0.025;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    ctx.restore();
  }
}

function updateAndDrawFloatingTexts(ctx: CanvasRenderingContext2D, texts: FloatingText[]) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = texts.length - 1; i >= 0; i--) {
    const t = texts[i];
    t.y -= 1.8;
    t.alpha -= 0.02;

    if (t.alpha <= 0) {
      texts.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0, t.alpha);
    ctx.font = t.isCrit ? 'bold 15px "Press Start 2P", monospace' : '12px "Press Start 2P", monospace';
    // Dark outline
    ctx.fillStyle = '#0f172a';
    ctx.fillText(t.text, t.x + 1, t.y + 1);
    // Fill
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, t.x, t.y);
    ctx.restore();
  }
}

function drawHackerAlarmOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number
) {
  ctx.save();
  // Red pulsing border
  const pulse = (Math.sin(time * 15) + 1) * 0.25;
  ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + pulse})`;
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, w - 10, h - 10);

  // Scanlines
  ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
  for (let y = 0; y < h; y += 6) {
    ctx.fillRect(0, y, w, 2);
  }

  // Header Warning Text
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 10px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('⚠️ ALERTA: ATAQUE HACKER! ⚠️', w / 2, 35);
  ctx.restore();
}

function drawCycleAmbiance(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cycle: EconomicCycle,
  time: number
) {
  if (cycle === 'expansao' || cycle === 'aquecimento') {
    // Little green upward arrows floating
    ctx.fillStyle = cycle === 'aquecimento' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(34, 197, 94, 0.4)';
    const offset = (time * 20) % 80;
    ctx.font = '10px monospace';
    ctx.fillText('▲', w - 50, h - 80 - offset);
    ctx.fillText('▲', 80, h - 60 - offset * 0.8);
  } else if (cycle === 'recessao') {
    // Downward red arrows
    ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
    const offset = (time * 20) % 80;
    ctx.font = '10px monospace';
    ctx.fillText('▼', w - 50, h - 140 + offset);
    ctx.fillText('▼', 80, h - 120 + offset * 0.8);
  }
}
