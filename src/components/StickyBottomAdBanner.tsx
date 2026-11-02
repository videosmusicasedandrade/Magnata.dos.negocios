import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface StickyBottomAdBannerProps {
  publisherId?: string;
  slotId?: string;
}

export const StickyBottomAdBanner: React.FC<StickyBottomAdBannerProps> = ({
  publisherId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-1204327016318163',
  slotId = '9876543210',
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn('AdSense init warning:', err);
    }
  }, [slotId, isCollapsed]);

  if (isCollapsed) {
    return (
      <div className="fixed bottom-[52px] sm:bottom-[56px] left-1/2 -translate-x-1/2 z-30 select-none">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-slate-900/95 border border-slate-700 text-slate-300 hover:text-amber-300 px-3 py-1 rounded-t-lg font-pixel text-[9px] shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
          title="Exibir anúncio discreto do AdSense"
        >
          <span>📢 PUBLICIDADE</span>
          <ChevronUp className="w-3 h-3 text-amber-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-[52px] sm:bottom-[56px] left-0 right-0 z-30 w-full max-w-[100vw] bg-slate-950/98 border-t border-slate-800/90 select-none shadow-2xl px-2 py-1.5 flex flex-col items-center justify-center">
      {/* Top bar label and minimize action */}
      <div className="w-full max-w-2xl flex items-center justify-between px-1 mb-0.5 text-[9px] font-retro text-slate-400">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>PUBLICIDADE DISCRETA · GOOGLE ADSENSE</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-slate-400 hover:text-white px-1 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer text-[9px] font-pixel"
          title="Minimizar anúncio"
        >
          [ OCULTAR <ChevronDown className="w-3 h-3 inline" /> ]
        </button>
      </div>

      {/* AdSense Unit Box */}
      <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-800/80 rounded-lg p-1 min-h-[50px] sm:min-h-[60px] flex items-center justify-center overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '50px' }}
          data-ad-client={publisherId}
          data-ad-slot={slotId}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
