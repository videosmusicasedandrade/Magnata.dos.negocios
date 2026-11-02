import React from 'react';
import { GameState } from '../../types/game';
import { soundEngine } from '../../game/audio';
import { Trophy, Award, CheckCircle2, Sparkles } from 'lucide-react';

interface AchievementsTabProps {
  state: GameState;
  onClaimAchievement: (achievementId: string) => void;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({
  state,
  onClaimAchievement,
}) => {
  const formatBRL = (val: number) => {
    return `R$ ${Math.round(val).toLocaleString('pt-BR')}`;
  };

  const getCEOTitle = (reputation: number, netWorth: number) => {
    if (netWorth >= 1e12) return { title: 'Trilionário Galáctico', color: 'text-purple-400' };
    if (netWorth >= 1e9) return { title: 'Bilionário das Finanças', color: 'text-amber-400' };
    if (netWorth >= 1e6) return { title: 'Lobo de Wall Street', color: 'text-emerald-400' };
    if (netWorth >= 1e5) return { title: 'Empresário Consolidado', color: 'text-blue-400' };
    if (netWorth >= 1e4) return { title: 'Dono do Bairro', color: 'text-cyan-400' };
    return { title: 'Empreendedor Iniciante', color: 'text-slate-300' };
  };

  const currentTitle = getCEOTitle(state.reputation, state.totalEarnedAllTime);
  const unlockedCount = state.achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-4">
      {/* 1. CEO Prestige Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border-2 border-amber-500/50 rounded-xl p-4 retro-box flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl p-3 bg-amber-900/40 rounded-xl border border-amber-400">
            👑
          </div>
          <div>
            <div className="text-xs font-retro text-amber-400">TÍTULO HONORÁRIO ATUAL:</div>
            <h2 className={`font-pixel text-base ${currentTitle.color}`}>{currentTitle.title}</h2>
            <div className="text-xs font-retro text-slate-300 mt-0.5">
              Conquistas Desbloqueadas: {unlockedCount} de {state.achievements.length}
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-right">
          <div className="text-[10px] font-retro text-slate-400">Pontos de Prestígio</div>
          <div className="font-pixel text-sm text-yellow-400">{state.reputation} ⭐</div>
        </div>
      </div>

      {/* 2. Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {state.achievements.map((ach) => {
          return (
            <div
              key={ach.id}
              className={`border-2 rounded-xl p-4 retro-box flex flex-col justify-between space-y-3 ${
                ach.unlocked
                  ? 'bg-amber-950/30 border-amber-500/60'
                  : 'bg-slate-900 border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl p-2.5 bg-slate-800 rounded-xl border border-slate-700 shrink-0">
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-pixel text-xs text-slate-100 truncate">{ach.title}</h4>
                    {ach.unlocked ? (
                      <span className="flex items-center gap-1 font-pixel text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500">
                        <CheckCircle2 className="w-3 h-3" /> CONQUISTADO
                      </span>
                    ) : (
                      <span className="font-pixel text-[10px] text-slate-400">
                        {Math.min(ach.progress, ach.maxProgress)}/{ach.maxProgress}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-retro mt-1">{ach.description}</p>

                  <div className="mt-2 flex items-center gap-3 text-xs font-retro">
                    <span className="text-emerald-400">+{formatBRL(ach.rewardCash)}</span>
                    <span className="text-yellow-400">+{ach.rewardPrestige} Prestígio</span>
                  </div>
                </div>
              </div>

              {!ach.unlocked ? (
                <div>
                  {ach.progress >= ach.maxProgress ? (
                    <button
                      onClick={() => {
                        onClaimAchievement(ach.id);
                        soundEngine.playFanfare();
                      }}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-[10px] rounded-lg retro-btn animate-bounce cursor-pointer"
                    >
                      RESGATAR RECOMPENSA!
                    </button>
                  ) : (
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-1.5 bg-amber-950/40 text-amber-300 font-pixel text-[10px] rounded-lg border border-amber-500/30">
                  ⭐ RECOMPENSA COLETADA
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
