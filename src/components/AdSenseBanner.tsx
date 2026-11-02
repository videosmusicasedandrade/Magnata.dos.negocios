import React, { useEffect } from 'react';
import { Sparkles, Info } from 'lucide-react';

interface AdSenseBannerProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId = '1234567890',
  format = 'auto',
  className = '',
}) => {
  const publisherId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-0000000000000000';
  const isRealPublisherConfigured = publisherId !== 'ca-pub-0000000000000000';

  useEffect(() => {
    if (isRealPublisherConfigured) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.warn('Google AdSense script error or blocked:', err);
      }
    }
  }, [isRealPublisherConfigured, slotId]);

  return (
    <div className={`w-full my-3 flex flex-col items-center justify-center select-none ${className}`}>
      {/* Policy Compliant Ad Label */}
      <div className="w-full max-w-xl flex items-center justify-between px-2 mb-1 text-[9px] font-retro text-slate-500 uppercase tracking-wider">
        <span>PUBLICIDADE · GOOGLE ADSENSE</span>
        <span className="text-[8px] opacity-70">Anúncio seguro</span>
      </div>

      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 min-h-[90px] flex items-center justify-center shadow-inner overflow-hidden">
        {isRealPublisherConfigured ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '90px' }}
            data-ad-client={publisherId}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full p-2 bg-slate-950/80 rounded-lg border border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30 text-amber-400">
                <Sparkles className="w-4 h-4 shrink-0" />
              </div>
              <div className="text-left">
                <h5 className="font-pixel text-[10px] text-amber-300">ESPAÇO RESERVADO GOOGLE ADSENSE</h5>
                <p className="font-retro text-[10px] text-slate-400">
                  Compatível com o AdSense. Insira seu ID <code className="text-emerald-400 font-pixel">ca-pub-XXXXXXXX</code> em Configurações.
                </p>
              </div>
            </div>

            <span className="font-pixel text-[9px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700 shrink-0">
              PRONTO P/ APROVAÇÃO
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
