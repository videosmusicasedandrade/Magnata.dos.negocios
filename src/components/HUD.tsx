import { EconomicCycle, NewsItem, PlanType } from '../types/game';
import { getEconomicCycleInfo } from '../game/economy';
import { formatGameTime } from '../game/time';
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
  Settings,
  Clock,
  Crown,
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
  plan: PlanType;
  gameTimeSeconds: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
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
  plan,
  gameTimeSeconds,
  isMuted,
  onToggleMute,
  onOpenSettings,
  onOpenSkyscraper,
  onOpenCycleInfo,
  onOpenWheel,
  onOpenShop,
  onOpenLeaderboard,
  onOpenTutorial,
}) => {
  const cycleInfo = getEconomicCycleInfo(economicCycle);
  const latestNews = newsFeed[newsFeed.length - 1];
  const clockInfo = formatGameTime(gameTimeSeconds);

  const formatBRL = (val: number) => {
    if (val >= 1e12) return `R$ ${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `R$ ${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `R$ ${(val / 1e6).toFixed(2)}M`;
    if (val >= 1e3) return `R$ ${(val / 1e3).toFixed(1)}K`;
    return `R$ ${Math.round(val).toLocaleString('pt-BR')}`;
  };

  return (
    <header className="w-full max-w-[100vw] bg-slate-900/98 border-b-4 border-slate-700 select-none text-slate-100 shadow-xl overflow-x-hidden">
      {/* 1. Breaking News Ticker Tape & Action Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-2 py-1 flex flex-wrap items-center justify-between gap-1.5 overflow-x-hidden">
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px] overflow-hidden">
          <span className="font-pixel text-[8px] sm:text-[9px] bg-red-600 text-white px-1 py-0.5 rounded uppercase tracking-wider shrink-0 animate-pulse">
            URGENTE
          </span>
          <p className="font-retro text-[11px] sm:text-xs text-amber-300 truncate">
            {latestNews ? `${latestNews.title} — ${latestNews.impactText}` : 'Mercado financeiro operando com alta liquidez.'}
          </p>
        </div>

        {/* Action Shortcuts & Gear Settings Button */}
        <div className="flex items-center gap-1 shrink-0 overflow-x-auto scrollbar-none py-0.5">
          {/* Gear Settings Button (⚙️) */}
          <button
            onClick={() => {
              soundEngine.playCoin();
              onOpenSettings();
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-pixel text-[10px] font-bold shadow cursor-pointer transition-transform active:scale-95 min-h-[38px] shrink-0"
            title="Configurações & Troca de Plano"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>⚙️ {plan}</span>
          </button>

          {onOpenTutorial && (
            <button
              onClick={() => {
                onOpenTutorial();
                soundEngine.playCoin();
              }}
              className="flex items-center gap-1 px-1.5 py-1 rounded bg-amber-600 text-slate-950 font-pixel text-[9px] font-bold shrink-0 min-h-[38px]"
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
              className="flex items-center gap-1 px-1.5 py-1 rounded bg-indigo-600 text-white font-pixel text-[9px] shrink-0 min-h-[38px]"
            >
              <span>🏆 RANK</span>
            </button>
          )}

          {/* Wheel shortcut button */}
          <button
            onClick={onOpenWheel}
            className="flex items-center gap-1 px-1.5 py-1 rounded bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-pixel text-[9px] font-bold shrink-0 min-h-[38px] animate-pulse"
          >
            <span>🎡 ROLETA</span>
          </button>

          {/* Shop shortcut button */}
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1 px-1.5 py-1 rounded bg-emerald-600 text-white font-pixel text-[9px] shrink-0 min-h-[38px]"
          >
            <span>🛒 LOJA</span>
          </button>

          <button
            onClick={() => {
              onToggleMute();
              soundEngine.playCoin();
            }}
            aria-label={isMuted ? 'Ativar Som' : 'Desativar Som'}
            className="p-1.5 rounded bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center shrink-0"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* 2. Primary Financial Stat Grid (Clean 2-column or 4-column layout fitting J5 Prime) */}
      <div className="p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap items-center justify-between gap-1.5">
        {/* Treasury Cash (Saldo em Caixa) */}
        <div className="bg-slate-950/80 border border-emerald-500/40 p-1.5 rounded-lg flex items-center gap-1.5 min-w-0">
          <div className="w-7 h-7 rounded bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-pixel text-[10px] shrink-0 font-bold">
            R$
          </div>
          <div className="min-w-0">
            <div className="text-[8px] font-retro text-slate-300 uppercase truncate">
              Caixa
            </div>
            <div className="font-pixel text-xs text-emerald-400 font-bold tabular-nums truncate">
              {formatBRL(cash)}
            </div>
          </div>
        </div>

        {/* Net Worth (Patrimônio Líquido Total) */}
        <div className="bg-slate-950/80 border border-indigo-500/40 p-1.5 rounded-lg flex items-center gap-1.5 min-w-0">
          <div className="w-7 h-7 rounded bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[8px] font-retro text-slate-300 uppercase truncate">
              Patrimônio
            </div>
            <div className="font-pixel text-[11px] text-indigo-300 font-bold tabular-nums truncate">
              {formatBRL(netWorth)}
            </div>
          </div>
        </div>

        {/* Passive Revenue per second (Renda Passiva) */}
        <div className="bg-slate-950/80 border border-amber-500/40 p-1.5 rounded-lg flex items-center gap-1.5 min-w-0">
          <div className="w-7 h-7 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[8px] font-retro text-slate-300 uppercase truncate">
              Passiva
            </div>
            <div className="font-pixel text-[11px] text-amber-400 font-bold tabular-nums truncate">
              +{formatBRL(passiveIncomePerSec)}/s
            </div>
          </div>
        </div>

        {/* In-Game Clock Display */}
        <div className="bg-slate-950/80 border border-amber-500/40 p-1.5 rounded-lg flex items-center gap-1.5 min-w-0">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-pixel text-[10px] text-amber-300 truncate">{clockInfo.fullStr}</span>
        </div>

        {/* Economic Cycle Pill */}
        <button
          onClick={onOpenCycleInfo}
          className={`flex items-center justify-center gap-1 p-1.5 rounded-lg border text-[10px] font-pixel ${cycleInfo.bgColor} ${cycleInfo.color} cursor-pointer hover:brightness-110 min-w-0 truncate`}
        >
          <span className="truncate">{cycleInfo.badge}</span>
          <span className="text-[8px] text-slate-300 font-retro">({cycleTimer}s)</span>
        </button>

        {/* Skyscraper Floor Shortcut */}
        <button
          onClick={onOpenSkyscraper}
          className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-purple-950/80 border border-purple-500/50 text-purple-200 text-[10px] font-pixel hover:bg-purple-900/80 cursor-pointer min-w-0 truncate"
        >
          <Building2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="truncate">Andar {skyscraperFloors}</span>
        </button>

        {/* Reputation Rating */}
        <div className="bg-slate-950/80 border border-slate-700 p-1.5 rounded-lg flex items-center justify-between gap-1 text-xs min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <Award className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="text-slate-200 font-retro text-[9px] truncate">Rep:</span>
          </div>
          <span className="font-pixel text-yellow-400 text-[10px] tabular-nums font-bold">
            {reputation}
          </span>
        </div>

        {/* Cyber Defense Indicator */}
        <div
          className={`p-1.5 rounded-lg border flex items-center justify-between gap-1 text-xs min-w-0 ${
            hackerAttackUnderway
              ? 'bg-red-950 border-red-500 text-red-300 animate-pulse'
              : 'bg-slate-950/80 border-slate-700 text-cyan-300'
          }`}
        >
          <div className="flex items-center gap-1 min-w-0">
            {hackerAttackUnderway ? (
              <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            )}
            <span className="font-retro text-[9px] truncate">Cyber:</span>
          </div>
          <span className="font-pixel text-[10px] tabular-nums font-bold">{cyberDefenseRating}%</span>
        </div>
      </div>
    </header>
  );
};
