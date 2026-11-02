import React from 'react';
import { ShieldCheck, X, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto select-none">
      <div className="w-full max-w-2xl bg-slate-900 border-4 border-slate-700 rounded-2xl p-4 sm:p-6 retro-box space-y-4 max-h-[90vh] overflow-y-auto text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <h2 className="font-pixel text-xs sm:text-sm text-emerald-300">
              POLÍTICA DE PRIVACIDADE & COOKIES (LGPD / GOOGLE ADSENSE)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Policy Content */}
        <div className="space-y-4 font-retro text-xs leading-relaxed text-slate-300">
          <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-200">
              Esta política foi estruturada em conformidade com as <strong>Diretrizes de Qualidade do Google AdSense</strong> e com a <strong>LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018)</strong>.
            </p>
          </div>

          <section className="space-y-1.5">
            <h3 className="font-pixel text-xs text-amber-300">1. Informações Gerais</h3>
            <p>
              O <strong>Magnata dos Negócios</strong> compromete-se com a transparência e a segurança dos dados de seus usuários. Esta política descreve como coletamos, utilizamos e protegemos as suas informações ao utilizar nosso aplicativo/site.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-pixel text-xs text-amber-300">2. Anúncios do Google AdSense e Cookies de Terceiros</h3>
            <p>
              Para manter o jogo gratuito, utilizamos fornecedores terceirizados, incluindo o <strong>Google AdSense</strong>, para veicular anúncios quando você visita nosso site.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                O <strong>Google</strong> utiliza cookies (como o cookie DART) para veicular anúncios com base em visitas anteriores dos usuários a este ou a outros sites na Internet.
              </li>
              <li>
                Os usuários podem desativar a publicidade personalizada acessando as <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-sky-400 underline">Configurações de Anúncios do Google</a> ou visitando o site <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-sky-400 underline">www.aboutads.info</a>.
              </li>
              <li>
                Não coletamos informações de identificação pessoal (PII) sensíveis para fins publicitários sem a sua autorização prévia.
              </li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-pixel text-xs text-amber-300">3. Armazenamento Local (LocalStorage & Salve do Jogo)</h3>
            <p>
              O jogo funciona no formato <strong>100% offline e local</strong>. Seus dados de progresso (saldo, conquistas, funcionários, empresas, andares do prédio) são armazenados exclusivamente no <code>localStorage</code> e <code>IndexedDB</code> do seu próprio navegador. Nenhum dado financeiro do jogo é enviado a servidores externos.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-pixel text-xs text-amber-300">4. Seus Direitos (LGPD & GDPR)</h3>
            <p>
              Você possui total controle sobre seus dados:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pode limpar o cache e os dados do site a qualquer momento pelas configurações do navegador.</li>
              <li>Pode reiniciar seu progresso no jogo a qualquer momento através do menu de Configurações.</li>
              <li>Pode alterar suas preferências de consentimento de cookies a qualquer momento no rodapé do site.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-pixel text-xs text-amber-300">5. Contato sobre Privacidade</h3>
            <p>
              Para dúvidas ou solicitações referentes à privacidade de dados, entre em contato pelo e-mail: <strong className="text-sky-300">suporte@magnatadosnegocios.app</strong>.
            </p>
          </section>
        </div>

        {/* Footer button */}
        <div className="pt-3 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-pixel text-xs rounded-xl retro-btn cursor-pointer min-h-[44px]"
          >
            ENTENDIDO E CIENTE
          </button>
        </div>
      </div>
    </div>
  );
};
