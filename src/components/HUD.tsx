import React from 'react';
import { EconomicCycle, NewsItem } from '../types/game';
import { getEconomicCycleInfo } from '../game/economy';
import { soundEngine } from '../game/audio';
import {
  Volume2,
  VolumeX,
  Building2,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Award,
  Sparkles,
} from 'lucide-react';

interface HUDProps {
  cash: number;
  netWorth: number;
  passiveIncomePerSec: number;
  reputation: number;
  economicCycle: EconomicCycle;
  cycleTimer: number;
  skyscraperFloors: number;
  cyberDefenseRating: number;
  hackerAttackUnderway: boolean;
  newsFeed: NewsItem[];
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSkyscraper: () => void;
  onOpenCycleInfo: () => void;
  onOpenWheel: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard?: () => void;
  onOpenTutorial?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  cash,
  netWorth,
  passiveIncomePerSec,
  reputation,
  economicCycle,
  cycleTimer,
  skyscraperFloors,
  cyberDefenseRating,
  hackerAttackUnderway,
  newsFeed,
  isMuted,
  onToggleMute,
  onOpenSkyscraper,
  onOpenCycleInfo,
  onOpenWheel,
  onOpenShop,
  onOpenLeaderboard,
  onOpenTutorial,
}) => {
  const cycleInfo = getEconomicCycleInfo(economicCycle);
  const latestNews = newsFeed[newsFeed.length - 1];

  const formatBRL = (val: number) => {
    if (val >= 1e12) return `R$ ${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `R$ ${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `R$ ${(val / 1e6).toFixed(2)}M`;
    if (val >= 1e3) return `R$ ${(val / 1e3).toFixed(1)}K`;
    return `R$ ${Math.round(val).toLocaleString('pt-BR')}`;
  };

  return (
    <header className="w-full bg-slate-900/95 border-b-4 border-slate-700 select-none text-slate-100 shadow-md">
      {/* 1. Breaking News Ticker Tape */}
      <div className="bg-slate-950 border-b border-slate-800 px-3 py-1 flex items-center justify-between text-xs overflow-hidden">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-pixel text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 animate-pulse">
            URGENTE
          </span>
          <p className="font-retro text-xs text-amber-300 truncate">
            {latestNews ? `${latestNews.title} — ${latestNews.impactText}` : 'Mercado financeiro operando com alta liquidez.'}
          </p>
        </div>

        {/* Action Shortcuts & Audio Mute */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {onOpenTutorial && (
            <button
              onClick={() => {
                onOpenTutorial();
                soundEngine.playCoin();
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-pixel text-[9px] shadow cursor-pointer transition-transform active:scale-95 font-bold"
              title="Abrir Tutorial Guiado"
            >
              <span>💡 TUTORIAL</span>
            </button>
          )}

          {onOpenLeaderboard && (
            <button
              onClick={() => {
                onOpenLeaderboard();
                soundEngine.playCoin();
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-pixel text-[9px] shadow cursor-pointer transition-transform active:scale-95"
            >
              <span>🏆 TOP 100</span>
            </button>
          )}

          {/* Wheel shortcut button */}
          <button
            onClick={onOpenWheel}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-pixel text-[9px] hover:brightness-110 shadow animate-pulse cursor-pointer"
          >
            <span>🎡 ROLETA</span>
          </button>

          {/* Shop shortcut button */}
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 text-white font-pixel text-[9px] hover:bg-emerald-500 shadow cursor-pointer"
          >
            <span>🛒 LOJA</span>
          </button>

          <button
            onClick={() => {
              onToggleMute();
              soundEngine.playCoin();
            }}
            aria-label={isMuted ? 'Ativar Som' : 'Desativar Som'}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* 2. Primary Financial Stat Clusters (Tabular Numerals) */}
      <div className="px-3 py-2 flex flex-wrap items-center justify-between gap-2.5">
        {/* Treasury Cash (Saldo em Caixa) */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 font-pixel text-xs shrink-0">
            R$
          </div>
          <div>
            <div className="text-[9px] font-retro text-slate-400 uppercase tracking-wider">
              Saldo em Caixa
            </div>
            <div className="font-pixel text-sm sm:text-base text-emerald-400 font-bold tabular-nums">
              {formatBRL(cash)}
            </div>
          </div>
        </div>

        {/* Net Worth (Patrimônio Líquido Total) */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center text-indigo-400 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-retro text-slate-400 uppercase tracking-wider">
              Patrimônio Total
            </div>
            <div className="font-pixel text-xs sm:text-sm text-indigo-300 font-bold tabular-nums">
              {formatBRL(netWorth)}
            </div>
          </div>
        </div>

        {/* Passive Revenue per second (Renda Passiva) */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-retro text-slate-400 uppercase tracking-wider">
              Renda Passiva
            </div>
            <div className="font-pixel text-xs sm:text-sm text-amber-400 tabular-nums">
              +{formatBRL(passiveIncomePerSec)}/s
            </div>
          </div>
        </div>

        {/* Economic Cycle Pill */}
        <button
          onClick={onOpenCycleInfo}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-pixel ${cycleInfo.bgColor} ${cycleInfo.color} cursor-pointer hover:brightness-110 transition-all`}
        >
          <span>{cycleInfo.badge}</span>
          <span className="text-[9px] text-slate-400 font-retro">({cycleTimer}s)</span>
        </button>

        {/* Skyscraper Floor Shortcut */}
        <button
          onClick={onOpenSkyscraper}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-950/70 border border-purple-500/40 text-purple-300 text-[11px] font-pixel hover:bg-purple-900/60 transition-colors cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Andar {skyscraperFloors}</span>
        </button>

        {/* Reputation Rating */}
        <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded text-xs">
          <Award className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-slate-300 font-retro text-[10px]">Reputação:</span>
          <span className="font-pixel text-yellow-400 text-[10px] tabular-nums">
            {reputation}
          </span>
        </div>

        {/* Cyber Defense Indicator */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded border text-xs ${
            hackerAttackUnderway
              ? 'bg-red-950 border-red-500 text-red-400 animate-pulse'
              : 'bg-slate-800/80 border-slate-700 text-cyan-300'
          }`}
        >
          {hackerAttackUnderway ? (
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span className="font-retro text-[10px]">Cyber:</span>
          <span className="font-pixel text-[10px] tabular-nums">{cyberDefenseRating}%</span>
        </div>
      </div>
    </header>
  );
};
