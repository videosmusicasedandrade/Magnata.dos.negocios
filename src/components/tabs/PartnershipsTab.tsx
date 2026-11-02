import React from 'react';
import { GameState } from '../../types/game';
import { soundEngine } from '../../game/audio';
import { Handshake, Award, Clock, CheckCircle2 } from 'lucide-react';

interface PartnershipsTabProps {
  state: GameState;
  onActivatePartnership: (partnershipId: string) => void;
}

export const PartnershipsTab: React.FC<PartnershipsTabProps> = ({
  state,
  onActivatePartnership,
}) => {
  const formatBRL = (val: number) => {
    return `R$ ${Math.round(val).toLocaleString('pt-BR')}`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 retro-box">
        <h2 className="font-pixel text-sm text-amber-300 flex items-center gap-2">
          <Handshake className="w-5 h-5 text-amber-400" />
          Parcerias Estratégicas B2B
        </h2>
        <p className="text-xs text-slate-400 font-retro mt-1">
          Feche contratos com grandes marcas do mercado para gerar receita mensal automática.
          Parcerias de prestígio exigem alta reputação corporativa!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {state.partnerships.map((part) => {
          const meetsReputation = state.reputation >= part.minReputation;

          return (
            <div
              key={part.id}
              className={`border-2 rounded-xl p-4 retro-box flex flex-col justify-between space-y-3 ${
                part.active
                  ? 'bg-emerald-950/30 border-emerald-500/60'
                  : 'bg-slate-900 border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl p-2 bg-slate-800 rounded-lg border border-slate-700">
                    {part.icon}
                  </span>
                  {part.active ? (
                    <span className="flex items-center gap-1 font-pixel text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CONTRATO ATIVO
                    </span>
                  ) : (
                    <span className="font-retro text-xs text-slate-400">
                      Exige Reputação {part.minReputation}+
                    </span>
                  )}
                </div>

                <h4 className="font-pixel text-xs text-slate-100 mt-2">{part.name}</h4>
                <p className="text-[11px] font-retro text-amber-400 mt-0.5">Parceiro: {part.partnerName}</p>
                <p className="text-xs text-slate-400 font-retro mt-1">{part.missionDescription}</p>

                <div className="mt-2 text-xs font-retro text-emerald-400">
                  Repasse Mensal: +{formatBRL(part.monthlyRevenue)}/s
                </div>
              </div>

              <div>
                {!part.active ? (
                  <button
                    onClick={() => {
                      onActivatePartnership(part.id);
                      soundEngine.playFanfare();
                    }}
                    disabled={!meetsReputation}
                    className={`w-full py-2.5 px-3 rounded-lg font-pixel text-[10px] flex items-center justify-center gap-2 retro-btn cursor-pointer ${
                      meetsReputation
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <Handshake className="w-4 h-4" />
                    <span>ASSINAR CONTRATO</span>
                  </button>
                ) : (
                  <div className="py-2 text-center text-emerald-400 font-pixel text-[10px] bg-emerald-950/40 rounded-lg border border-emerald-500/40">
                    🤝 PARCERIA EM OPERAÇÃO
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
