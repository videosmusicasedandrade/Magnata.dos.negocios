import React, { useState, useEffect } from 'react';
import { X, ChevronUp, ShieldCheck } from 'lucide-react';

interface StickyBottomAdBannerProps {
  publisherId?: string;
  slotId?: string;
}

export const StickyBottomAdBanner: React.FC<StickyBottomAdBannerProps> = ({
  publisherId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-1204327016318163',
  slotId = '9876543210',
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (!isDismissed) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        // Ignored in non-live or blocked AdSense environments
      }
    }
  }, [slotId, isDismissed]);

  if (isDismissed) {
    return (
      <div className="fixed bottom-[54px] right-2 z-30 select-none">
        <button
          onClick={() => setIsDismissed(false)}
          className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-amber-300 px-2 py-1 rounded-t font-pixel text-[8px] shadow-md flex items-center gap-1 cursor-pointer transition-colors"
          title="Ver anúncio parceiro discreto"
        >
          <span>📢 ANÚNCIO</span>
          <ChevronUp className="w-3 h-3 text-amber-400" />
        </button>
      </div>
    );
  }

  return (
    <div
      style={{ maxHeight: '46px', height: '46px', minHeight: '46px' }}
      className="fixed bottom-[54px] left-0 right-0 z-30 w-full max-w-[100vw] h-[46px] max-h-[46px] min-h-[46px] bg-slate-950/98 border-t border-slate-800 select-none shadow-xl px-2 flex items-center justify-between gap-1 overflow-hidden"
    >
      {/* 1. Left Compact Tag */}
      <div className="flex items-center gap-1 shrink-0 bg-slate-900 border border-slate-700/80 px-1.5 py-0.5 rounded text-[8px] font-retro text-slate-400">
        <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
        <span className="font-pixel text-[7px] text-slate-300 uppercase">ADSENSE</span>
      </div>

      {/* 2. Middle Ad Slot (Strictly clamped to 38px, no white blowout) */}
      <div
        style={{ maxHeight: '38px', height: '38px', minHeight: '38px' }}
        className="flex-1 max-w-xl h-[38px] max-h-[38px] min-h-[38px] bg-slate-900/80 border border-slate-800 rounded px-2 flex items-center justify-center overflow-hidden mx-1 text-center"
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '100%', height: '36px', maxHeight: '36px', overflow: 'hidden' }}
          data-ad-client={publisherId}
          data-ad-slot={slotId}
          data-ad-format="horizontal"
        />
        {/* Subtle dark retro fallback label if AdSense hasn't served creative yet */}
        <span className="font-retro text-[10px] text-slate-400 truncate pointer-events-none">
          Magnata dos Negócios · Anúncio Discreto
        </span>
      </div>

      {/* 3. Right Dismiss Button */}
      <button
        onClick={() => setIsDismissed(true)}
        className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition-colors cursor-pointer shrink-0 min-h-[28px] min-w-[28px] flex items-center justify-center"
        title="Ocultar anúncio da barra inferior"
        aria-label="Ocultar anúncio"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
