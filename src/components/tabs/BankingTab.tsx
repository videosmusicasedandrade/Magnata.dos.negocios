import React from 'react';
import { GameState } from '../../types/game';
import { soundEngine } from '../../game/audio';
import {
  Landmark,
  FileText,
  AlertTriangle,
  BadgePercent,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface BankingTabProps {
  state: GameState;
  onTakeLoan: (loanId: string) => void;
  onPayOffLoan: (loanId: string) => void;
  onOpenTaxModal: () => void;
}

export const BankingTab: React.FC<BankingTabProps> = ({
  state,
  onTakeLoan,
  onPayOffLoan,
  onOpenTaxModal,
}) => {
  const formatBRL = (val: number) => {
    return `R$ ${Math.round(val).toLocaleString('pt-BR')}`;
  };

  const totalDebt = state.loans.reduce((acc, l) => acc + (l.totalOwed > 0 ? l.totalOwed : 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Header & Financial Health */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 retro-box flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-pixel text-sm text-amber-300 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-400" />
            Sistema Bancário & Crédito Empresarial
          </h2>
          <p className="text-xs text-slate-400 font-retro mt-0.5">
            Pegue empréstimos para crescer rápido, mas gerencie o endividamento para evitar falência.
          </p>
        </div>

        {/* Reputation credit multiplier */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-right">
            <div className="text-[10px] font-retro text-slate-400">Score de Crédito (Reputação)</div>
            <div className="font-pixel text-xs text-yellow-400">{state.reputation} Pontos</div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-right">
            <div className="text-[10px] font-retro text-slate-400">Dívida Total Ativa</div>
            <div className="font-pixel text-xs text-rose-400">{formatBRL(totalDebt)}</div>
          </div>
        </div>
      </div>

      {/* 2. Tax Season Quick Callout */}
      <div className="bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border-2 border-blue-500/50 rounded-xl p-4 retro-box flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-900/60 rounded-xl border border-blue-400 text-2xl">
            📑
          </div>
          <div>
            <h3 className="font-pixel text-xs text-blue-300">
              Declaração de Impostos da Receita Federal
            </h3>
            <p className="text-xs text-slate-300 font-retro mt-0.5">
              Faturamento do período:{' '}
              <strong className="text-emerald-400">{formatBRL(state.currentQuarterEarnings)}</strong>.
              Declare certinho para ganhar reputação ou tente omitir receitas correndo risco de Malha Fina!
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTaxModal}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-pixel text-xs rounded-xl retro-btn flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <FileText className="w-4 h-4" />
          <span>DECLARAR IMPOSTO</span>
        </button>
      </div>

      {/* 3. Loan Products */}
      <div>
        <h3 className="font-pixel text-xs text-slate-200 mb-3 flex items-center gap-2">
          <BadgePercent className="w-4 h-4 text-emerald-400" />
          Linhas de Crédito Disponíveis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {state.loans.map((loan) => {
            const hasEnoughReputation = state.reputation >= loan.minReputation;
            const isLoanActive = loan.totalOwed > 0;
            const earlyPayoffCost = Math.round(loan.totalOwed * 0.92); // 8% early discount

            return (
              <div
                key={loan.id}
                className={`border-2 rounded-xl p-4 retro-box flex flex-col justify-between space-y-3 ${
                  isLoanActive
                    ? 'bg-amber-950/30 border-amber-500/60'
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      Juros: {(loan.monthlyInterest * 100).toFixed(1)}% ao mês
                    </span>
                    {isLoanActive ? (
                      <span className="font-pixel text-[11px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500">
                        EM ANDAMENTO
                      </span>
                    ) : (
                      <span className="font-retro text-xs text-slate-400">
                        Exige Reputação {loan.minReputation}+
                      </span>
                    )}
                  </div>

                  <h4 className="font-pixel text-xs text-slate-100 mt-2">{loan.name}</h4>

                  <div className="mt-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1 font-retro">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Valor do Crédito:</span>
                      <span className="text-emerald-400 font-pixel">{formatBRL(loan.amount)}</span>
                    </div>
                    {isLoanActive && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Saldo Devedor:</span>
                          <span className="text-rose-400 font-pixel">{formatBRL(loan.totalOwed)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Meses Restantes:</span>
                          <span className="text-slate-200 font-pixel">{loan.remainingMonths} meses</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  {!isLoanActive ? (
                    <button
                      onClick={() => {
                        onTakeLoan(loan.id);
                        soundEngine.playRegister();
                      }}
                      disabled={!hasEnoughReputation}
                      className={`w-full py-2.5 px-3 rounded-lg font-pixel text-[10px] sm:text-xs flex items-center justify-center gap-2 retro-btn cursor-pointer min-h-[48px] ${
                        hasEnoughReputation
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <Landmark className="w-4 h-4 shrink-0" />
                      <span className="truncate">CONTRATAR ({formatBRL(loan.amount)})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onPayOffLoan(loan.id);
                        soundEngine.playFanfare();
                      }}
                      disabled={state.cash < earlyPayoffCost}
                      className={`w-full py-2.5 px-3 rounded-lg font-pixel text-[10px] sm:text-xs flex items-center justify-center gap-2 retro-btn cursor-pointer min-h-[48px] ${
                        state.cash >= earlyPayoffCost
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span className="truncate">QUITAR COM -8% ({formatBRL(earlyPayoffCost)})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
