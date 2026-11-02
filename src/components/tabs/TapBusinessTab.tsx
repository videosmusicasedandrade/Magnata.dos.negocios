import React from 'react';
import { GameState } from '../../types/game';
import { BUSINESS_ORIGINS, INITIAL_TAP_UPGRADES } from '../../game/constants';
import { soundEngine } from '../../game/audio';
import { Sparkles, MousePointerClick, Zap, Coffee } from 'lucide-react';

interface TapBusinessTabProps {
  state: GameState;
  clickPower: number;
  onBuyTapUpgrade: (upgradeId: string) => void;
  onManualTap: () => void;
}

export const TapBusinessTab: React.FC<TapBusinessTabProps> = ({
  state,
  clickPower,
  onBuyTapUpgrade,
  onManualTap,
}) => {
  const currentOrigin = BUSINESS_ORIGINS.find((o) => o.id === state.origin) || BUSINESS_ORIGINS[0];

  return (
    <div className="space-y-4">
      {/* 1. Origin Company Card */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 retro-box flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl p-3 bg-slate-800 border-2 border-slate-600 rounded-xl">
            {currentOrigin.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-pixel text-sm text-amber-300">{state.companyName}</h2>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-retro border border-slate-600">
                {currentOrigin.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-retro mt-0.5">{currentOrigin.tagline}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-retro">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Bônus Ativo: {currentOrigin.initialBonus}</span>
            </div>
          </div>
        </div>

        {/* Big Tap Button */}
        <button
          onClick={() => {
            onManualTap();
            soundEngine.playCoin();
          }}
          className="w-full md:w-auto px-4 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-pixel text-xs sm:text-sm rounded-xl retro-btn flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-transform min-h-[48px] font-bold"
        >
          <MousePointerClick className="w-4 h-4 shrink-0" />
          <span className="truncate">FATURAR (+R$ {clickPower.toLocaleString('pt-BR')})</span>
        </button>
      </div>

      {/* 2. Upgrades Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-pixel text-xs text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Melhorias de Clique & Produtividade
          </h3>
          <span className="text-xs font-retro text-slate-400">
            Poder de Clique Atual: <strong className="text-emerald-400 font-pixel">R$ {clickPower}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INITIAL_TAP_UPGRADES.map((upgrade) => {
            const currentLevel = state.tapUpgrades[upgrade.id] || 0;
            // Cost scales by 1.6x per level
            const nextCost = Math.round(upgrade.cost * Math.pow(1.6, currentLevel));
            const canAfford = state.cash >= nextCost;

            return (
              <div
                key={upgrade.id}
                className="bg-slate-900 border-2 border-slate-700/80 rounded-xl p-3 flex flex-col justify-between retro-box hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl p-2 bg-slate-800 rounded-lg border border-slate-700 shrink-0">
                    {upgrade.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-pixel text-[11px] text-slate-100 truncate">
                        {upgrade.name}
                      </h4>
                      <span className="font-retro text-xs bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded border border-slate-700 shrink-0 ml-1">
                        Nv. {currentLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-retro mt-1 line-clamp-2">
                      {upgrade.description}
                    </p>
                    <div className="text-[10px] text-emerald-400 font-retro mt-1">
                      Multiplicador: +{(upgrade.multiplierPerLevel * 100 - 100).toFixed(0)}% por nível
                    </div>
                  </div>
                </div>

                <button
                  disabled={!canAfford}
                  onClick={() => onBuyTapUpgrade(upgrade.id)}
                  className={`mt-3 w-full py-2 px-3 rounded-lg font-pixel text-[10px] flex items-center justify-between retro-btn cursor-pointer ${
                    canAfford
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>EVOLUIR</span>
                  <span className="font-pixel">R$ {nextCost.toLocaleString('pt-BR')}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Quick Stats & Office Coffee */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
          <div className="text-[10px] font-retro text-slate-400 uppercase">Total de Cliques</div>
          <div className="font-pixel text-base text-amber-400 mt-1 tabular-nums">
            {state.totalClicks.toLocaleString('pt-BR')}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
          <div className="text-[10px] font-retro text-slate-400 uppercase">Capacidade da Equipe</div>
          <div className="font-pixel text-base text-cyan-400 mt-1 tabular-nums">
            {state.employees.length} / {state.maxStaffCapacity}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
          <div className="text-[10px] font-retro text-slate-400 uppercase">Faturamento Histórico</div>
          <div className="font-pixel text-base text-emerald-400 mt-1 tabular-nums">
            R$ {Math.round(state.totalEarnedAllTime).toLocaleString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
};
