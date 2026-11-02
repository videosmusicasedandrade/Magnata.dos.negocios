import React from 'react';
import { FileText, X, AlertTriangle, Scale, Coins } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto select-none">
      <div className="w-full max-w-2xl bg-slate-900 border-4 border-slate-700 rounded-2xl p-4 sm:p-6 retro-box space-y-4 max-h-[90vh] overflow-y-auto text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400 shrink-0" />
            <h2 className="font-pixel text-xs sm:text-sm text-indigo-300">
              TERMOS DE SERVIÇO E USO DO JOGO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terms Content */}
        <div className="space-y-4 font-retro text-xs leading-relaxed text-slate-300">
          <div className="bg-amber-950/60 border border-amber-500/40 p-3 rounded-xl flex items-start gap-2.5">
            <Coins className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-200">
              <strong>AVISO DE MOEDA VIRTUAL:</strong> Todas as moedas, saldos, ações, criptomoedas e patrimônios exibidos no <em>Magnata dos Negócios</em> são estritamente fictícios e válidos apenas dentro da simulação do jogo. Não possuem qualquer valor monetário no mundo real nem podem ser trocados por dinheiro de verdade.
            </p>
          </div>

          <section className="space-y-1.5">
            <h3 className="font-pixel text-xs text-amber-300">1. Aceitação dos Termos</h3>
            <p>
              Ao utilizar o jogo <strong>Magnata dos Negócios</strong>, você concorda expressamente em cumprir estes Termos de Serviço. Caso não concorde com qualquer disposição, solicitamos que não utilize o aplicativo.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-pixel text-xs text-amber-300">2. Uso Permitido e Conduta</h3>
            <p>
              O jogo destina-se ao entretenimento pessoal. É proibido utilizar scripts automatizados, métodos de hacking ou engenharia reversa para manipular injustamente o sistema ou inflar rankings.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-pixel text-xs text-amber-300">3. Propriedade Intelectual</h3>
            <p>
              Todos os elementos de arte em pixel art, sons, marcas parodiadas (ex: Uoogle, Facedok, Bitouro) e código-fonte do jogo são protegidos por direitos autorais. O estilo retro é inspirado no gênero clássico de jogos de clique empresarial.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-pixel text-xs text-amber-300">4. Isenção de Responsabilidade Financeira</h3>
            <p>
              As oscilações de mercado, investimentos em ações e criptomoedas no jogo são algoritmos simulados de entretenimento. <strong>Nada no jogo constitui recomendação de investimento financeiro real</strong>.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-pixel text-xs text-amber-300">5. Alterações nos Termos</h3>
            <p>
              Reservamo-nos o direito de atualizar estes termos a qualquer momento para manter conformidade com regulamentações legais e políticas do Google AdSense.
            </p>
          </section>
        </div>

        {/* Footer button */}
        <div className="pt-3 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-pixel text-xs rounded-xl retro-btn cursor-pointer min-h-[44px]"
          >
            LI E ACEITO OS TERMOS
          </button>
        </div>
      </div>
    </div>
  );
};
