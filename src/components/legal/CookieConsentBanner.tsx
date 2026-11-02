import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPrivacyPolicy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenPrivacyPolicy,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('magnata_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('magnata_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem('magnata_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-14 left-2 right-2 sm:left-4 sm:right-auto sm:max-w-md z-50 bg-slate-900/98 border-2 border-amber-500/80 rounded-xl p-3.5 shadow-2xl retro-box text-slate-100 font-retro text-xs animate-slide-up space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Cookie className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
          <h4 className="font-pixel text-[11px] text-amber-300">AVISO DE COOKIES & PRIVACIDADE (LGPD)</h4>
        </div>
        <button
          onClick={handleRejectNonEssential}
          className="text-slate-400 hover:text-white p-1"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[11px] text-slate-300 leading-snug">
        Utilizamos armazenamento local (localStorage) para salvar seu progresso no jogo e cookies do <strong>Google AdSense</strong> para veicular anúncios e métricas de uso em conformidade com a LGPD.
      </p>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleAcceptAll}
          className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-[10px] rounded-lg font-bold shadow cursor-pointer min-h-[40px] flex items-center justify-center"
        >
          ACEITAR E CONTINUAR
        </button>

        <button
          onClick={() => {
            onOpenPrivacyPolicy();
          }}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel text-[9px] rounded-lg border border-slate-700 cursor-pointer min-h-[40px] flex items-center justify-center underline"
        >
          SABER MAIS
        </button>
      </div>
    </div>
  );
};
