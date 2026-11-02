import React, { useState } from 'react';
import { calculateTaxSeason } from '../game/economy';
import { soundEngine } from '../game/audio';
import { FileText, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TaxSeasonModalProps {
  isOpen: boolean;
  earnings: number;
  onComplete: (taxPaid: number, reputationDelta: number, audited: boolean) => void;
  onClose: () => void;
}

export const TaxSeasonModal: React.FC<TaxSeasonModalProps> = ({
  isOpen,
  earnings,
  onComplete,
  onClose,
}) => {
  const [result, setResult] = useState<{
    audited: boolean;
    taxPaid: number;
    reputationDelta: number;
    fine: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleDeclare = (percent: number) => {
    const outcome = calculateTaxSeason(earnings, percent);

    if (outcome.audited) {
      soundEngine.playBuzzer();
      const totalPaid = outcome.declaredLiability + outcome.fine;
      const repDelta = -outcome.reputationPenalty;
      setResult({
        audited: true,
        taxPaid: totalPaid,
        reputationDelta: repDelta,
        fine: outcome.fine,
      });
      onComplete(totalPaid, repDelta, true);
    } else {
      soundEngine.playCoin();
      const totalPaid = outcome.declaredLiability;
      const repDelta = outcome.reputationReward;
      setResult({
        audited: false,
        taxPaid: totalPaid,
        reputationDelta: repDelta,
        fine: 0,
      });
      onComplete(totalPaid, repDelta, false);
    }
  };

  const formatBRL = (val: number) => `R$ ${Math.round(val).toLocaleString('pt-BR')}`;
  const totalTaxFull = Math.max(0, Math.round(earnings * 0.15));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-none p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border-4 border-blue-500 rounded-2xl p-6 retro-box space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-950 border-2 border-blue-400 rounded-xl text-3xl">
            🏛️
          </div>
          <div>
            <h2 className="font-pixel text-sm sm:text-base text-blue-300">
              Receita Federal — Declaração Fiscal
            </h2>
            <p className="font-retro text-xs text-slate-300">
              Período de auditoria corporativa dos lucros empresariais.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-retro space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Faturamento no Período:</span>
            <span className="text-slate-100 font-pixel">{formatBRL(earnings)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Alíquota Base (15%):</span>
            <span className="text-amber-400 font-pixel">{formatBRL(totalTaxFull)}</span>
          </div>
        </div>

        {/* Choices or Results */}
        {!result ? (
          <div className="space-y-3 pt-2">
            <p className="font-retro text-xs text-slate-300">
              Escolha sua postura na declaração:
            </p>

            {/* Option 1: 100% Honest */}
            <button
              onClick={() => handleDeclare(100)}
              className="w-full p-3.5 bg-slate-800 hover:bg-emerald-950/60 border-2 border-slate-600 hover:border-emerald-500 rounded-xl text-left retro-btn cursor-pointer transition-all"
            >
              <div className="flex justify-between items-center">
                <span className="font-pixel text-xs text-emerald-400">
                  1. Declarar 100% Corretamente
                </span>
                <span className="font-retro text-xs text-emerald-300">+50 Reputação</span>
              </div>
              <p className="font-retro text-xs text-slate-400 mt-1">
                Paga {formatBRL(totalTaxFull)}. Risco de auditoria: 0%. Ganha selo Empresa Limpa.
              </p>
            </button>

            {/* Option 2: 50% */}
            <button
              onClick={() => handleDeclare(50)}
              className="w-full p-3.5 bg-slate-800 hover:bg-amber-950/60 border-2 border-slate-600 hover:border-amber-500 rounded-xl text-left retro-btn cursor-pointer transition-all"
            >
              <div className="flex justify-between items-center">
                <span className="font-pixel text-xs text-amber-400">
                  2. Omitir Parte dos Lucros (50%)
                </span>
                <span className="font-retro text-xs text-amber-300">Risco Médio</span>
              </div>
              <p className="font-retro text-xs text-slate-400 mt-1">
                Paga apenas {formatBRL(totalTaxFull * 0.5)}. Risco de 35% de cair na Malha Fina!
              </p>
            </button>

            {/* Option 3: 20% */}
            <button
              onClick={() => handleDeclare(20)}
              className="w-full p-3.5 bg-slate-800 hover:bg-rose-950/60 border-2 border-slate-600 hover:border-rose-500 rounded-xl text-left retro-btn cursor-pointer transition-all"
            >
              <div className="flex justify-between items-center">
                <span className="font-pixel text-xs text-rose-400">
                  3. Declarar Quase Nada (20%)
                </span>
                <span className="font-retro text-xs text-rose-300">Risco Alto!</span>
              </div>
              <p className="font-retro text-xs text-slate-400 mt-1">
                Paga apenas {formatBRL(totalTaxFull * 0.2)}. Risco de 75% de fiscalização com multa pesada!
              </p>
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {result.audited ? (
              <div className="p-4 bg-rose-950/60 border-2 border-rose-500 rounded-xl text-center space-y-2">
                <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto animate-bounce" />
                <h3 className="font-pixel text-sm text-rose-300">
                  CAIU NA MALHA FINA DA RECEITA!
                </h3>
                <p className="font-retro text-xs text-slate-300">
                  Os fiscais detectaram inconsistências nos relatórios contábeis.
                </p>
                <div className="text-xs font-pixel text-rose-400">
                  Multa + Imposto Devido: {formatBRL(result.taxPaid)}
                </div>
                <div className="text-xs font-retro text-rose-400">
                  Perda de Reputação: {result.reputationDelta} pontos
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/60 border-2 border-emerald-500 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="font-pixel text-sm text-emerald-300">
                  DECLARAÇÃO PROCESSADA COM SUCESSO!
                </h3>
                <p className="font-retro text-xs text-slate-300">
                  Nenhuma auditoria necessária. Empresa regularizada perante o Fisco.
                </p>
                <div className="text-xs font-pixel text-emerald-400">
                  Imposto Pago: {formatBRL(result.taxPaid)}
                </div>
                {result.reputationDelta > 0 && (
                  <div className="text-xs font-retro text-yellow-400">
                    Bônus de Reputação: +{result.reputationDelta} pontos!
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setResult(null);
                onClose();
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-pixel text-xs rounded-xl retro-btn cursor-pointer"
            >
              CONTINUAR OS NEGÓCIOS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
