import React from 'react';
import { GameState } from '../../types/game';
import { soundEngine } from '../../game/audio';
import {
  Building2,
  Landmark,
  Crown,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface ExpansionTabProps {
  state: GameState;
  onBuildSkyscraperFloor: () => void;
  onUpgradePhysicalAsset: (assetId: string) => void;
  onAcquireCompetitor: (competitorId: string) => void;
}

export const ExpansionTab: React.FC<ExpansionTabProps> = ({
  state,
  onBuildSkyscraperFloor,
  onUpgradePhysicalAsset,
  onAcquireCompetitor,
}) => {
  // Cost to build next floor: 5000 * 1.5^(floors - 1)
  const nextFloor = state.skyscraperFloors + 1;
  const floorCost = Math.round(5000 * Math.pow(1.45, state.skyscraperFloors - 1));
  const canAffordFloor = state.cash >= floorCost && state.skyscraperFloors < 50;

  const formatBRL = (val: number) => {
    return `R$ ${Math.round(val).toLocaleString('pt-BR')}`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Arranha-Céu HQ (Skyscraper Construction) */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-2 border-purple-500/50 rounded-xl p-4 sm:p-5 retro-box">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-900/60 border-2 border-purple-400 flex items-center justify-center text-3xl shrink-0 shadow-lg">
              🏢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-pixel text-sm sm:text-base text-purple-300">
                  Arranha-Céu Corporativo
                </h3>
                <span className="font-pixel text-xs bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded border border-purple-400/50">
                  Andar {state.skyscraperFloors}/50
                </span>
              </div>
              <p className="text-xs text-slate-300 font-retro mt-1 max-w-xl">
                Cada andar erguido expande o espaço físico, atrai investidores e concede{' '}
                <strong className="text-emerald-400">+10% de Renda Passiva</strong> e{' '}
                <strong className="text-amber-400">+5% no Clique</strong>!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (canAffordFloor) {
                onBuildSkyscraperFloor();
                soundEngine.playFanfare();
              }
            }}
            disabled={!canAffordFloor}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-pixel text-xs retro-btn flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
              canAffordFloor
                ? 'bg-purple-600 hover:bg-purple-500 text-white animate-pulse'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>CONSTRUIR ANDAR {nextFloor} ({formatBRL(floorCost)})</span>
          </button>
        </div>
      </div>

      {/* 2. Physical Assets (Bens Físicos & Patrimônio) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-pixel text-xs text-slate-200 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-400" />
            Patrimônio Físico & Infraestrutura Real
          </h3>
          <span className="text-xs font-retro text-slate-400">
            Gera fluxo de caixa mensal automático e valoriza seu patrimônio líquido.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.physicalAssets.map((asset) => {
            const nextCost = asset.level === 0 ? asset.cost : Math.round(asset.upgradeCost * Math.pow(1.5, asset.level));
            const canAfford = state.cash >= nextCost && asset.level < asset.maxLevel;

            return (
              <div
                key={asset.id}
                className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 retro-box flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2 bg-slate-800 rounded-xl border border-slate-700">
                      {asset.icon}
                    </span>
                    <span className="font-pixel text-[11px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
                      Nível {asset.level}/{asset.maxLevel}
                    </span>
                  </div>

                  <h4 className="font-pixel text-xs text-slate-100 mt-2">{asset.name}</h4>
                  <p className="text-xs text-slate-400 font-retro mt-1">{asset.description}</p>

                  <div className="mt-2 text-xs font-retro text-emerald-400">
                    Rendimento: +{formatBRL(asset.monthlyRevenue * Math.max(1, asset.level))}/s
                  </div>
                </div>

                <button
                  onClick={() => {
                    onUpgradePhysicalAsset(asset.id);
                    soundEngine.playRegister();
                  }}
                  disabled={!canAfford}
                  className={`w-full py-2 px-3 rounded-lg font-pixel text-[10px] flex items-center justify-between retro-btn cursor-pointer ${
                    canAfford
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>{asset.level === 0 ? 'ADQUIRIR BEM' : 'MODERNIZAR'}</span>
                  <span>{formatBRL(nextCost)}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Competitor Hostile Takeovers (Monopólios) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-pixel text-xs text-slate-200 flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            Aquisição de Concorrentes & Monopólio
          </h3>
          <span className="text-xs font-retro text-slate-400">
            Compre empresas rivais inteiras para eliminar a concorrência e receber lucros perpétuos.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {state.competitors.map((comp) => {
            const canAfford = state.cash >= comp.cost && !comp.acquired;

            return (
              <div
                key={comp.id}
                className={`border-2 rounded-xl p-4 retro-box flex flex-col justify-between space-y-3 ${
                  comp.acquired
                    ? 'bg-yellow-950/30 border-yellow-500/60'
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {comp.sector}
                    </span>
                    {comp.acquired ? (
                      <span className="font-pixel text-xs text-yellow-400 bg-yellow-950 px-2 py-0.5 rounded border border-yellow-500">
                        🏆 MONOPOLIZADA
                      </span>
                    ) : (
                      <span className="font-pixel text-xs text-slate-300">
                        {formatBRL(comp.cost)}
                      </span>
                    )}
                  </div>

                  <h4 className="font-pixel text-xs text-slate-100 mt-2">{comp.name}</h4>
                  <p className="text-xs text-slate-400 font-retro mt-1">{comp.description}</p>

                  <div className="mt-2 text-xs font-retro text-emerald-400">
                    Lucro Monopolista: +{formatBRL(comp.monopolyRevenue)}/s
                  </div>
                </div>

                {!comp.acquired ? (
                  <button
                    onClick={() => {
                      onAcquireCompetitor(comp.id);
                      soundEngine.playFanfare();
                    }}
                    disabled={!canAfford}
                    className={`w-full py-2.5 px-3 rounded-lg font-pixel text-[10px] flex items-center justify-center gap-2 retro-btn cursor-pointer ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <Crown className="w-4 h-4" />
                    <span>COMPRAR CONCORRENTE ({formatBRL(comp.cost)})</span>
                  </button>
                ) : (
                  <div className="text-center py-2 bg-yellow-900/30 text-yellow-300 font-pixel text-xs rounded-lg border border-yellow-500/40">
                    👑 EMPRESA 100% SOB SEU CONTROLE
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
