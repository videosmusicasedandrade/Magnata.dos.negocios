import React from 'react';
import { soundEngine } from '../game/audio';
import { Building2, X, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface SkyscraperModalProps {
  isOpen: boolean;
  floors: number;
  cash: number;
  onBuildNextFloor: () => void;
  onClose: () => void;
}

export const SkyscraperModal: React.FC<SkyscraperModalProps> = ({
  isOpen,
  floors,
  cash,
  onBuildNextFloor,
  onClose,
}) => {
  if (!isOpen) return null;

  const nextFloorCost = Math.round(5000 * Math.pow(1.45, floors - 1));
  const canAfford = cash >= nextFloorCost && floors < 50;

  const formatBRL = (val: number) => `R$ ${Math.round(val).toLocaleString('pt-BR')}`;

  const getTierName = (f: number) => {
    if (f >= 40) return { title: 'Megatorre Suprema & Heliponto', icon: '🚁', color: 'text-amber-400' };
    if (f >= 25) return { title: 'Penthouse dos Bilionários', icon: '💎', color: 'text-purple-400' };
    if (f >= 15) return { title: 'Torre Corporativa Faria Lima', icon: '🏢', color: 'text-blue-400' };
    if (f >= 5) return { title: 'Hub Tecnológico & Co-working', icon: '🚀', color: 'text-cyan-400' };
    return { title: 'Garagem & Origem Humilde', icon: '🧱', color: 'text-slate-300' };
  };

  const tier = getTierName(floors);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-none p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border-4 border-purple-500 rounded-2xl p-5 retro-box space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-400 flex items-center justify-center text-2xl">
              🏢
            </div>
            <div>
              <h2 className="font-pixel text-sm text-purple-300">
                Arranha-Céu Magnata HQ
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`font-pixel text-xs ${tier.color}`}>
                  {tier.icon} {tier.title}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Stats */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-center">
          <div>
            <span className="text-[10px] font-retro text-slate-400 block">ANDAR ATUAL</span>
            <span className="font-pixel text-base text-purple-300">{floors} de 50</span>
          </div>
          <div>
            <span className="text-[10px] font-retro text-slate-400 block">BÔNUS TOTAL HQ</span>
            <span className="font-pixel text-base text-emerald-400">+{(floors - 1) * 10}% Renda</span>
          </div>
        </div>

        {/* Floors Vertical Visualizer (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[320px]">
          {Array.from({ length: 50 }, (_, i) => 50 - i).map((floorNum) => {
            const isUnlocked = floorNum <= floors;
            const isCurrent = floorNum === floors;
            const floorTier = getTierName(floorNum);

            return (
              <div
                key={floorNum}
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  isCurrent
                    ? 'bg-purple-950/80 border-purple-400 shadow-md animate-pulse'
                    : isUnlocked
                    ? 'bg-slate-800/80 border-slate-600'
                    : 'bg-slate-950/50 border-slate-800 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-pixel text-xs w-8 text-center text-slate-400">
                    {floorNum}º
                  </span>
                  <div>
                    <span className="font-pixel text-[11px] block">
                      {floorTier.icon} {floorTier.title}
                    </span>
                    <span className="font-retro text-[10px] text-slate-400">
                      +10% Renda Passiva · +5% Poder de Clique
                    </span>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <span className="font-pixel text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ATIVO
                    </span>
                  ) : (
                    <span className="font-pixel text-[10px] text-slate-600">BLOQUEADO</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Build Next Floor Button */}
        <div className="pt-2 border-t border-slate-700">
          {floors < 50 ? (
            <button
              onClick={() => {
                if (canAfford) {
                  onBuildNextFloor();
                  soundEngine.playFanfare();
                }
              }}
              disabled={!canAfford}
              className={`w-full py-3 rounded-xl font-pixel text-xs retro-btn flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                canAfford
                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <ChevronUp className="w-4 h-4" />
              <span>CONSTRUIR ANDAR {floors + 1} ({formatBRL(nextFloorCost)})</span>
            </button>
          ) : (
            <div className="py-3 text-center font-pixel text-xs text-yellow-400 bg-yellow-950/40 border border-yellow-500/40 rounded-xl">
              👑 ARRANHA-CÉU 100% CONCLUÍDO! MONOPÓLIO TOTAL!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
