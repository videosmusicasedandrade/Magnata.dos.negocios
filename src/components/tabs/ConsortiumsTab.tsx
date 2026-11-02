import React, { useState } from 'react';
import { GameState } from '../../types/game';
import { VipLockBanner } from '../VipLockBanner';
import { soundEngine } from '../../game/audio';
import { Building2, Coffee, Sparkles, CheckCircle2, Ticket, Award, Lock } from 'lucide-react';

interface ConsortiumsTabProps {
  state: GameState;
  onPayConsortiumInstallment: (consortiumId: string) => void;
  onBidConsortium: (consortiumId: string) => void;
  onBuyServiceEquipment: (equipmentId: string) => void;
  onOpenSettings: () => void;
}

export const ConsortiumsTab: React.FC<ConsortiumsTabProps> = ({
  state,
  onPayConsortiumInstallment,
  onBidConsortium,
  onBuyServiceEquipment,
  onOpenSettings,
}) => {
  const [subTab, setSubTab] = useState<'imobiliario' | 'servicos'>('imobiliario');

  if (state.plan === 'COMUM') {
    return (
      <VipLockBanner
        featureName="Consórcios Imobiliários & de Serviços"
        description="Planeje a expansão da sua sede e adquira equipamentos de ponta sem juros bancários. Exclusivo do Plano VIP!"
        onOpenSettings={onOpenSettings}
      />
    );
  }

  const formatBRL = (val: number) => `R$ ${Math.round(val).toLocaleString('pt-BR')}`;

  return (
    <div className="space-y-4 select-none">
      {/* Tab Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-2 border-purple-500/50 rounded-2xl p-4 sm:p-5 retro-box text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            <h2 className="font-pixel text-base sm:text-lg text-purple-300">
              SISTEMA DE CONSÓRCIOS & EQUIPAMENTOS VIP
            </h2>
          </div>
          <p className="font-retro text-xs text-slate-300 mt-1 max-w-2xl">
            Planejamento inteligente para aquisição de andares corporativos e tecnologia de escritório.
            Pague mensalidades sem juros, concorra nos sorteios ou dê lances de contemplação!
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-purple-500/30 w-full md:w-auto shrink-0">
          <button
            onClick={() => {
              soundEngine.playCoin();
              setSubTab('imobiliario');
            }}
            className={`flex-1 md:flex-initial px-3 py-2 rounded-lg font-pixel text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px] ${
              subTab === 'imobiliario'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Imobiliário</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playCoin();
              setSubTab('servicos');
            }}
            className={`flex-1 md:flex-initial px-3 py-2 rounded-lg font-pixel text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px] ${
              subTab === 'servicos'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Serviços & Equipamentos</span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Consórcio Imobiliário */}
      {subTab === 'imobiliario' && (
        <div className="space-y-3">
          <p className="font-retro text-xs text-amber-300/90 bg-slate-900 border border-slate-700 p-3 rounded-xl">
            ⚠️ <strong>Regra Oficial do Consórcio:</strong> Mesmo após ser contemplado e receber a carta de crédito,
            você continuará pagando as parcelas restantes até a quitação total do contrato.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {state.consortiums.map((cons) => {
              const progressPct = Math.round((cons.paidInstallments / cons.totalInstallments) * 100);
              const bidValue = Math.round(cons.totalValue * cons.minBidPercent);
              const canPayInstallment = state.cash >= cons.installmentValue && cons.paidInstallments < cons.totalInstallments;
              const canBid = state.cash >= bidValue && !cons.isContemplated;

              return (
                <div
                  key={cons.id}
                  className={`bg-slate-900 border-2 rounded-xl p-4 flex flex-col justify-between gap-3 retro-box transition-all ${
                    cons.isContemplated
                      ? 'border-emerald-500/80 bg-emerald-950/20'
                      : 'border-slate-700 hover:border-purple-500/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-pixel text-xs text-purple-300 font-bold line-clamp-1">
                        {cons.name}
                      </span>
                      {cons.isContemplated ? (
                        <span className="font-pixel text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-bold shrink-0">
                          CONTEMPLADO 🎉
                        </span>
                      ) : (
                        <span className="font-pixel text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded shrink-0">
                          {progressPct}% Pago
                        </span>
                      )}
                    </div>

                    <p className="font-retro text-xs text-slate-300 line-clamp-2 min-h-[32px]">
                      {cons.benefitDescription}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 my-2">
                      <div
                        className="bg-purple-500 h-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-retro text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Valor da Carta:</span>
                        <strong className="text-emerald-400 font-pixel text-xs">
                          {formatBRL(cons.totalValue)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Mensalidade:</span>
                        <strong className="text-amber-400 font-pixel text-xs">
                          {formatBRL(cons.installmentValue)}/mês
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        soundEngine.playCoin();
                        onPayConsortiumInstallment(cons.id);
                      }}
                      disabled={!canPayInstallment}
                      className={`w-full py-2.5 px-3 rounded-lg font-pixel text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer min-h-[44px] ${
                        canPayInstallment
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Ticket className="w-4 h-4" />
                      <span>
                        Pagar Parcela ({cons.paidInstallments}/{cons.totalInstallments})
                      </span>
                    </button>

                    {!cons.isContemplated && (
                      <button
                        onClick={() => {
                          soundEngine.playFanfare();
                          onBidConsortium(cons.id);
                        }}
                        disabled={!canBid}
                        className={`w-full py-2 px-3 rounded-lg font-pixel text-[11px] flex items-center justify-center gap-1 transition-transform active:scale-95 cursor-pointer min-h-[40px] ${
                          canBid
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Dar Lance ({formatBRL(bidValue)})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Consórcio de Serviços & Equipamentos */}
      {subTab === 'servicos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.serviceEquipments?.map((equip) => {
            const canAfford = state.cash >= equip.cost && !equip.owned;

            return (
              <div
                key={equip.id}
                className={`bg-slate-900 border-2 rounded-xl p-4 flex flex-col justify-between gap-3 retro-box transition-all ${
                  equip.owned
                    ? 'border-emerald-500/80 bg-emerald-950/20'
                    : 'border-slate-700 hover:border-indigo-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl shrink-0">{equip.icon}</span>
                    <div>
                      <h4 className="font-pixel text-xs text-indigo-300 font-bold line-clamp-1">
                        {equip.name}
                      </h4>
                      <span className="font-retro text-[10px] text-emerald-400 font-bold">
                        {equip.benefitText}
                      </span>
                    </div>
                  </div>

                  <p className="font-retro text-xs text-slate-300 line-clamp-3">
                    {equip.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="font-pixel text-xs text-emerald-400 font-bold">
                    {formatBRL(equip.cost)}
                  </div>

                  {equip.owned ? (
                    <div className="flex items-center gap-1 font-pixel text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/40">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Adquirido</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        soundEngine.playRegister();
                        onBuyServiceEquipment(equip.id);
                      }}
                      disabled={!canAfford}
                      className={`px-4 py-2.5 rounded-xl font-pixel text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer min-h-[44px] ${
                        canAfford
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold shadow-lg'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Comprar Carta</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
