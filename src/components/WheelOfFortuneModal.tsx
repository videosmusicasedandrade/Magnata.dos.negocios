import React, { useState, useEffect, useRef } from 'react';
import { WheelRewardResult, WheelSector } from '../types/game';
import { WHEEL_SECTORS, pickRandomWheelSector } from '../game/adsAndWheel';
import { soundEngine } from '../game/audio';
import { X, Sparkles, Gift, Play, RotateCcw, CheckCircle2 } from 'lucide-react';

interface WheelOfFortuneModalProps {
  isOpen: boolean;
  onSpinCompleted: (sector: WheelSector) => void;
  onWatchAnotherAd: () => void;
  onClose: () => void;
  autoSpinOnOpen?: boolean;
}

export const WheelOfFortuneModal: React.FC<WheelOfFortuneModalProps> = ({
  isOpen,
  onSpinCompleted,
  onWatchAnotherAd,
  onClose,
  autoSpinOnOpen = false,
}) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [winningSector, setWinningSector] = useState<WheelSector | null>(null);
  const [showPrizeOverlay, setShowPrizeOverlay] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTickSectorRef = useRef<number>(-1);

  // Auto-spin if requested when opening after watching ad
  useEffect(() => {
    if (isOpen) {
      setWinningSector(null);
      setShowPrizeOverlay(false);
      if (autoSpinOnOpen) {
        startSpin();
      }
    }
  }, [isOpen, autoSpinOnOpen]);

  const numSectors = WHEEL_SECTORS.length;
  const sectorAngle = (2 * Math.PI) / numSectors;

  // Draw the Wheel on Canvas
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Outer Gold Rim with Retro Bulbs
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#b45309';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    // Bulb lights around the rim
    const totalBulbs = 24;
    for (let i = 0; i < totalBulbs; i++) {
      const bulbAngle = (i * 2 * Math.PI) / totalBulbs + angle * 0.5;
      const bx = centerX + (radius + 5) * Math.cos(bulbAngle);
      const by = centerY + (radius + 5) * Math.sin(bulbAngle);
      ctx.beginPath();
      ctx.arc(bx, by, 3, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#fef08a' : '#f59e0b';
      ctx.fill();
    }
    ctx.restore();

    // 2. Draw Sectors
    WHEEL_SECTORS.forEach((sec, i) => {
      const startA = angle + i * sectorAngle;
      const endA = startA + sectorAngle;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startA, endA);
      ctx.closePath();
      ctx.fillStyle = sec.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();

      // Sector Label & Icon
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startA + sectorAngle / 2);

      // Icon
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sec.icon, radius * 0.72, 0);

      // Label text
      ctx.font = 'bold 9px "Press Start 2P", monospace';
      ctx.fillStyle = sec.textColor;
      ctx.fillText(sec.label.substring(0, 10), radius * 0.42, 0);

      ctx.restore();
      ctx.restore();
    });

    // 3. Center Hub / Spinner Knob
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke();

    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', centerX, centerY);
    ctx.restore();

    // 4. Pointer at top (pointing downward into the wheel at 12 o'clock / -Math.PI / 2)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX - 12, 10);
    ctx.lineTo(centerX + 12, 10);
    ctx.lineTo(centerX, 32);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    drawWheel(currentAngle);
  }, [currentAngle]);

  const startSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setShowPrizeOverlay(false);
    setWinningSector(null);

    // Target winning sector
    const chosenSector = pickRandomWheelSector();
    const sectorIndex = WHEEL_SECTORS.findIndex((s) => s.id === chosenSector.id);

    // Calculate target angle so pointer at top (-PI/2) aligns with chosen sector
    // Pointer is at angle 3*PI/2 (top)
    const pointerAngle = (3 * Math.PI) / 2;
    const targetSectorCenter = sectorIndex * sectorAngle + sectorAngle / 2;
    // Total spins: 5 full rotations + offset
    const fullSpins = 6 * 2 * Math.PI;
    const finalAngle = fullSpins + (pointerAngle - targetSectorCenter);

    const startTime = performance.now();
    const duration = 4000; // 4 seconds spin
    const startAngle = currentAngle % (2 * Math.PI);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Smooth deceleration curve (cubic ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const angleNow = startAngle + (finalAngle - startAngle) * easeOut;

      // Play tick sound when crossing sectors
      const normalizedAngle = (angleNow % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const currentSectorIdx = Math.floor(normalizedAngle / sectorAngle);
      if (currentSectorIdx !== lastTickSectorRef.current) {
        lastTickSectorRef.current = currentSectorIdx;
        soundEngine.playCoin();
      }

      setCurrentAngle(angleNow);
      drawWheel(angleNow);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setWinningSector(chosenSector);
        setShowPrizeOverlay(true);
        soundEngine.playFanfare();
        onSpinCompleted(chosenSector);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-none p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border-4 border-amber-500 rounded-2xl p-5 retro-box shadow-[0_0_50px_rgba(245,158,11,0.5)] text-center space-y-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎡</span>
            <div className="text-left">
              <h2 className="font-pixel text-sm text-amber-300">
                ROLETA DE PRÊMIOS DA FORTUNA
              </h2>
              <span className="font-retro text-[10px] text-slate-400">
                Sem limite diário · Giros 100% grátis assistindo anúncios
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSpinning}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wheel Canvas Display */}
        <div className="relative flex items-center justify-center py-2">
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="block pixelated drop-shadow-2xl"
          />
        </div>

        {/* Prize Notification Overlay */}
        {showPrizeOverlay && winningSector && (
          <div className="p-4 bg-emerald-950/80 border-2 border-emerald-400 rounded-xl retro-box shadow-lg space-y-2">
            <div className="text-3xl">{winningSector.icon}</div>
            <h3 className="font-pixel text-sm text-emerald-300">
              PARABÉNS! VOCÊ GANHOU:
            </h3>
            <div className="font-pixel text-xs text-amber-300">{winningSector.label}</div>
            <p className="font-retro text-xs text-slate-200">{winningSector.description}</p>
            <div className="text-[10px] font-retro text-emerald-400">
              ✓ Prêmio creditado e salvo automaticamente no seu império!
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2 border-t border-slate-800">
          {!isSpinning && !showPrizeOverlay && (
            <button
              onClick={startSpin}
              className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-pixel text-xs rounded-xl retro-btn cursor-pointer shadow-lg animate-pulse"
            >
              GIRAR ROLETA AGORA!
            </button>
          )}

          {showPrizeOverlay && (
            <>
              <button
                onClick={() => {
                  onWatchAnotherAd();
                }}
                className="w-full sm:flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-pixel text-xs rounded-xl retro-btn flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>GIRAR DE NOVO (+1 ANÚNCIO)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-xs rounded-xl retro-btn cursor-pointer"
              >
                VOLTAR AO ESCRITÓRIO
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
