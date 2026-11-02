import React, { useState } from 'react';
import { Info, Mail, Send, CheckCircle2, Sparkles, X, Globe, Gamepad2 } from 'lucide-react';
import { soundEngine } from '../../game/audio';

interface AboutAndContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'about' | 'contact';
}

export const AboutAndContactModal: React.FC<AboutAndContactModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'about',
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'contact'>(initialTab);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    soundEngine.playFanfare();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto select-none">
      <div className="w-full max-w-2xl bg-slate-900 border-4 border-slate-700 rounded-2xl p-4 sm:p-6 retro-box space-y-4 max-h-[90vh] overflow-y-auto text-slate-100">
        
        {/* Header & Subtabs */}
        <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playCoin();
                setActiveTab('about');
              }}
              className={`px-3 py-1.5 rounded-lg font-pixel text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>SOBRE O JOGO</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playCoin();
                setActiveTab('contact');
              }}
              className={`px-3 py-1.5 rounded-lg font-pixel text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>CONTATO & SUPORTE</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TAB 1: ABOUT THE GAME */}
        {activeTab === 'about' && (
          <div className="space-y-4 font-retro text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 text-2xl shrink-0">
                🏢
              </div>
              <div>
                <h3 className="font-pixel text-sm text-amber-300">Magnata dos Negócios</h3>
                <p className="text-[11px] text-slate-400">Versão 1.5.0 · Desenvolvido no Brasil · 100% Responsivo</p>
              </div>
            </div>

            <p>
              O <strong>Magnata dos Negócios</strong> é um simulador estratégico e jogo clicker em pixel art retro. Inspirado nos grandes clássicos como <em>Tap Tap Trillionaire</em>, seu objetivo é erguer um império empresarial do zero, começando em uma garagem modesta até conquistar um arranha-céu corporativo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <h4 className="font-pixel text-[11px] text-emerald-400 mb-1">🎮 Mecânicas Principais</h4>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-300">
                  <li>Toque rápido para gerar capital inicial</li>
                  <li>Contratação e treino de especialistas</li>
                  <li>Mercado financeiro: Bolsa & Criptos</li>
                  <li>Consórcios imobiliários e de serviços</li>
                  <li>Construção de andares corporativos</li>
                </ul>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <h4 className="font-pixel text-[11px] text-sky-400 mb-1">🛡️ Qualidade & Transparência</h4>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-300">
                  <li>100% Funcional em celular, tablet e PC</li>
                  <li>Sem anúncios compulsórios ou invasivos</li>
                  <li>Salva progresso offline no navegador</li>
                  <li>Conformidade com Google AdSense</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT & SUPPORT */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <p className="font-retro text-xs text-slate-300">
              Dúvidas, sugestões de novos recursos ou suporte com sua conta? Envie uma mensagem diretamente para nossa equipe:
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-retro space-y-1">
              <div className="text-slate-400">E-mail Oficial de Suporte:</div>
              <div className="font-pixel text-sky-400 text-sm">suporte@magnatadosnegocios.app</div>
            </div>

            {submitted ? (
              <div className="bg-emerald-950/80 border-2 border-emerald-500 rounded-xl p-4 text-center space-y-2 font-retro">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-pixel text-xs text-emerald-300">MENSAGEM ENVIADA COM SUCESSO!</h4>
                <p className="text-xs text-slate-300">
                  Obrigado pelo seu contato. Responderemos no seu e-mail o mais breve possível.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-[10px] rounded-lg border border-slate-700"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} className="space-y-3 font-retro text-xs">
                <div>
                  <label className="block text-slate-300 font-pixel text-[10px] mb-1">SEU NOME / CEO:</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: Carlos Silva"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-sans focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-pixel text-[10px] mb-1">SEU E-MAIL:</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-sans focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-pixel text-[10px] mb-1">MENSAGEM / DÚVIDA:</label>
                  <textarea
                    required
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Descreva sua dúvida, sugestão ou suporte..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-sans focus:outline-none focus:border-sky-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-400 hover:to-sky-600 text-white font-pixel text-xs rounded-xl retro-btn flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Send className="w-4 h-4" />
                  <span>ENVIAR MENSAGEM AO SUPORTE</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-xs rounded-xl retro-btn cursor-pointer min-h-[44px]"
          >
            FECHAR
          </button>
        </div>
      </div>
    </div>
  );
};
