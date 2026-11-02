import React from 'react';
import { Lock, Crown, Settings } from 'lucide-react';
import { soundEngine } from '../game/audio';

interface VipLockBannerProps {
  featureName: string;
  description: string;
  onOpenSettings: () => void;
}

export const VipLockBanner: React.FC<VipLockBannerProps> = ({
  featureName,
  description,
  onOpenSettings,
}) => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-900 border-2 border-amber-500/60 rounded-2xl p-6 text-center space-y-4 shadow-2xl retro-box max-w-xl mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto animate-bounce">
        <Crown className="w-8 h-8" />
      </div>

      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-pixel text-xs uppercase mb-2">
          <Lock className="w-3.5 h-3.5" />
          <span>RECURSO EXCLUSIVO DO PLANO VIP</span>
        </div>
        <h3 className="font-pixel text-base sm:text-lg text-slate-100">{featureName}</h3>
        <p className="font-retro text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={() => {
            soundEngine.playCoin();
            onOpenSettings();
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-pixel text-xs shadow-xl flex items-center justify-center gap-2 mx-auto cursor-pointer transition-transform active:scale-95 min-h-[48px]"
        >
          <Settings className="w-4 h-4" />
          <span>ATIVAR PLANO VIP GRATUITAMENTE (⚙️)</span>
        </button>
      </div>
    </div>
  );
};
