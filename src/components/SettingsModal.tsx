import React from 'react';
import { PlanType } from '../types/game';
import { Settings, Shield, Zap, Lock, Check, X, Volume2, VolumeX, RotateCcw, Crown, Sparkles } from 'lucide-react';
import { soundEngine } from '../game/audio';

interface SettingsModalProps {
  isOpen: boolean;
  currentPlan: PlanType;
  isMuted: boolean;
  onTogglePlan: (newPlan: PlanType) => void;
  onToggleMute: () => void;
  onResetGame: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentPlan,
  isMuted,
  onTogglePlan,
  onToggleMute,
  onResetGame,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-4 border-amber-500/80 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden retro-box my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 px-4 py-3 border-b-2 border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400 animate-spin-slow" />
            <h3 className="font-pixel text-sm sm:text-base text-amber-300">
              CONFIGURAÇÕES & CONTROLE DE PLANO
            </h3>
          </div>
          <button
            onClick={() => {
              soundEngine.playCoin();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Current Plan Banner */}
          <div
            className={`p-4 rounded-xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              currentPlan === 'VIP'
                ? 'bg-gradient-to-r from-amber-950/80 to-purple-950/80 border-amber-400 shadow-amber-500/10'
                : 'bg-slate-800/80 border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center shrink-0 ${
                  currentPlan === 'VIP'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-400'
                    : 'bg-slate-700 border-slate-500 text-slate-400'
                }`}
              >
                {currentPlan === 'VIP' ? <Crown className="w-6 h-6 animate-pulse" /> : <Shield className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-xs text-slate-300 uppercase">Seu Plano Atual:</span>
                  <span
                    className={`font-pixel text-xs px-2 py-0.5 rounded ${
                      currentPlan === 'VIP'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {currentPlan === 'VIP' ? '★ PLANO VIP (ATIVADO)' : 'PLANO COMUM'}
                  </span>
                </div>
                <p className="font-retro text-xs text-slate-300 mt-1">
                  {currentPlan === 'VIP'
                    ? 'Bolsa, Criptos, Consórcios e +20% em todos os ganhos ativados!'
                    : 'Apenas funções básicas ativas. Alterne para o VIP a qualquer momento!'}
                </p>
              </div>
            </div>

            {/* Plan Switch Button */}
            <button
              onClick={() => {
                soundEngine.playFanfare();
                onTogglePlan(currentPlan === 'VIP' ? 'COMUM' : 'VIP');
              }}
              className={`w-full sm:w-auto px-4 py-3 rounded-xl font-pixel text-xs shadow-lg transition-transform active:scale-95 cursor-pointer min-h-[48px] flex items-center justify-center gap-2 shrink-0 ${
                currentPlan === 'VIP'
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/50'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold border-2 border-amber-300'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {currentPlan === 'VIP' ? 'Mudar para Plano Comum' : 'Ativar Plano VIP (Gratuito)'}
              </span>
            </button>
          </div>

          <p className="font-retro text-xs text-amber-300/80 bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-lg">
            💡 <strong>Nota da Versão de Desenvolvimento:</strong> Você pode alternar livremente entre os planos
            VIP e Comum para testar a experiência do usuário. No lançamento na Google Play Store, o plano VIP será
            desbloqueado via compras dentro do app.
          </p>

          {/* Feature Comparison Table */}
          <div className="space-y-2">
            <h4 className="font-pixel text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>📊</span>
              <span>Comparativo de Recursos entre os Planos</span>
            </h4>

            <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-950/60 font-retro text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/90 border-b border-slate-700 font-pixel text-[11px] text-slate-300">
                    <th className="p-2.5">Recurso / Funcionalidade</th>
                    <th className="p-2.5 text-center w-24">Plano Comum</th>
                    <th className="p-2.5 text-center w-24 bg-amber-950/60 text-amber-300">Plano VIP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-2.5">Clicar e ganhar moedas</td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold bg-amber-950/30"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Contratar / Treinar funcionários</td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold bg-amber-950/30"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Investir em Renda Fixa</td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold bg-amber-950/30"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Roleta de Anúncios com prêmios</td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold bg-amber-950/30"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Ataques Hackers e Eventos</td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold bg-amber-950/30"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="bg-slate-900/60">
                    <td className="p-2.5 font-bold text-amber-300">📈 Bolsa de Ações (Uoogle, Applo, etc.)</td>
                    <td className="p-2.5 text-center text-rose-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold bg-amber-950/30"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="bg-slate-900/60">
                    <td className="p-2.5 font-bold text-amber-300">₿ Mercado de Criptomoedas</td>
                    <td className="p-2.5 text-center text-rose-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold bg-amber-950/30"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="bg-slate-900/60">
                    <td className="p-2.5 font-bold text-amber-300">🤝 Consórcios (Imobiliário e Serviços)</td>
                    <td className="p-2.5 text-center text-rose-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold bg-amber-950/30"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-400">⚡ Bônus de +20% em todos os ganhos</td>
                    <td className="p-2.5 text-center text-slate-500">—</td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold bg-amber-950/30">+20%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-cyan-300">🛡️ -40% Tentativas de Ataque Hacker</td>
                    <td className="p-2.5 text-center text-slate-500">—</td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold bg-amber-950/30">-40%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-purple-300">🎨 Decoração Exclusiva no Escritório</td>
                    <td className="p-2.5 text-center text-slate-500">—</td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold bg-amber-950/30"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Google AdSense Integration & Status Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h4 className="font-pixel text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎯</span>
              <span>Google AdSense · Status & Conformidade</span>
            </h4>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2 font-retro text-xs text-slate-300">
              <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-800">
                <span className="text-slate-400">ID de Editor (ads.txt):</span>
                <span className="font-pixel text-emerald-400 text-[10px]">
                  {import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-0000000000000000'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>ads.txt no diretório raiz</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Meta tags & Schema JSON-LD</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Política de Privacidade & LGPD</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Termos & Isenção Moeda Virtual</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Sound, Legal & Game Controls */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => {
                soundEngine.playCoin();
                onToggleMute();
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-retro text-xs border border-slate-700 cursor-pointer min-h-[44px]"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'Som: Desativado' : 'Som: Ativado'}</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Tem certeza de que deseja reiniciar todo o progresso do jogo?')) {
                  onResetGame();
                }
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 font-retro text-xs cursor-pointer min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar Progresso</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
