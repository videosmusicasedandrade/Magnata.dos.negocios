import React from 'react';
import { GameState } from '../../types/game';
import { INITIAL_CYBER_UPGRADES } from '../../game/constants';
import { soundEngine } from '../../game/audio';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Zap,
  Radio,
  CheckCircle2,
} from 'lucide-react';

interface SecurityTabProps {
  state: GameState;
  onUpgradeCyber: (upgradeId: string) => void;
  onTriggerSimulatedAttack: () => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  state,
  onUpgradeCyber,
  onTriggerSimulatedAttack,
}) => {
  const formatBRL = (val: number) => {
    return `R$ ${Math.round(val).toLocaleString('pt-BR')}`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Cyber Security Overview Card */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 retro-box">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 text-2xl shrink-0">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-pixel text-sm text-cyan-300">
                  Defesa Digital & Cibersegurança
                </h3>
                <span className="font-pixel text-xs bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500">
                  {state.cyberDefenseRating}% Protegido
                </span>
              </div>
              <p className="text-xs text-slate-400 font-retro mt-1">
                Ataques hackers podem desviar fundos do caixa, desmotivar funcionários e derrubar suas ações.
              </p>
            </div>
          </div>

          <button
            onClick={onTriggerSimulatedAttack}
            className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-pixel text-xs rounded-xl retro-btn flex items-center justify-center gap-2 cursor-pointer"
          >
            <Radio className="w-4 h-4 text-rose-300 animate-pulse" />
            <span>TESTAR SIMULAÇÃO DE DEFESA</span>
          </button>
        </div>

        {/* Defense Progress Meter */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="flex justify-between text-xs font-retro text-slate-400 mb-1">
            <span>Blindagem do Sistema Corporativo:</span>
            <span className="font-pixel text-cyan-400">{state.cyberDefenseRating}/100%</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-300 ${
                state.cyberDefenseRating >= 80
                  ? 'bg-cyan-400'
                  : state.cyberDefenseRating >= 50
                  ? 'bg-emerald-400'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, state.cyberDefenseRating)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3 text-center">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] font-retro text-slate-400 block">Invasões Bloqueadas</span>
              <span className="font-pixel text-sm text-emerald-400">{state.successfulDefenses}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] font-retro text-slate-400 block">Violações Sofridas</span>
              <span className="font-pixel text-sm text-rose-400">{state.breachesSuffered}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Cyber Upgrades Grid */}
      <div>
        <h3 className="font-pixel text-xs text-slate-200 mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          Infraestrutura de Segurança
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INITIAL_CYBER_UPGRADES.map((upgrade) => {
            const currentLevel = state.cyberUpgrades[upgrade.id] || 0;
            const isMax = currentLevel >= upgrade.maxLevel;
            const nextCost = Math.round(upgrade.cost * Math.pow(1.8, currentLevel));
            const canAfford = state.cash >= nextCost && !isMax;

            return (
              <div
                key={upgrade.id}
                className="bg-slate-900 border-2 border-slate-700 rounded-xl p-3.5 retro-box flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-2xl p-2 bg-slate-800 rounded-lg border border-slate-700">
                      {upgrade.icon}
                    </span>
                    <span className="font-pixel text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700">
                      Nível {currentLevel}/{upgrade.maxLevel}
                    </span>
                  </div>

                  <h4 className="font-pixel text-xs text-slate-100 mt-2">{upgrade.name}</h4>
                  <p className="text-xs text-slate-400 font-retro mt-1">{upgrade.description}</p>
                  <div className="text-[10px] text-cyan-400 font-retro mt-1">
                    Bônus: +{upgrade.defenseBoost}% de blindagem por nível
                  </div>
                </div>

                {!isMax ? (
                  <button
                    onClick={() => {
                      onUpgradeCyber(upgrade.id);
                      soundEngine.playRegister();
                    }}
                    disabled={!canAfford}
                    className={`w-full py-2 px-3 rounded-lg font-pixel text-[10px] flex items-center justify-between retro-btn cursor-pointer ${
                      canAfford
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <span>INSTALAR</span>
                    <span>{formatBRL(nextCost)}</span>
                  </button>
                ) : (
                  <div className="py-2 text-center text-cyan-400 font-pixel text-[10px] bg-cyan-950/40 rounded-lg border border-cyan-500/30">
                    🛡️ BLINDAGEM MÁXIMA
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
