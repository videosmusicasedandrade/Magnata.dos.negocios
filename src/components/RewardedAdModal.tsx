import React, { useState, useEffect } from 'react';
import { soundEngine } from '../game/audio';
import { Film, CheckCircle2, X, Sparkles, Play } from 'lucide-react';

interface RewardedAdModalProps {
  isOpen: boolean;
  onAdCompleted: () => void;
  onClose: () => void;
}

const SAMPLE_ADS = [
  {
    title: 'Bit-Runner 2077',
    tagline: 'O clássico arcade cyberpunk em pixel art!',
    icon: '🕹️',
    gradient: 'from-purple-900 to-indigo-950',
    accent: 'text-purple-300',
  },
  {
    title: 'Pixel Miner Tycoon',
    tagline: 'Minere gemas preciosas e construa seu império subterrâneo.',
    icon: '⛏️',
    gradient: 'from-amber-900 to-slate-950',
    accent: 'text-amber-300',
  },
  {
    title: 'Retro Taxi 8-Bit',
    tagline: 'Dirija em alta velocidade pelas ruas retrô de Nova York!',
    icon: '🚕',
    gradient: 'from-emerald-900 to-slate-950',
    accent: 'text-emerald-300',
  },
];

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onAdCompleted,
  onClose,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5);
  const [adInfo, setAdInfo] = useState(SAMPLE_ADS[0]);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(5);
      return;
    }

    setAdInfo(SAMPLE_ADS[Math.floor(Math.random() * SAMPLE_ADS.length)]);
    setSecondsRemaining(5);

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = ((5 - secondsRemaining) / 5) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-none p-4 select-none">
      <div className="w-full max-w-md bg-slate-950 border-4 border-amber-500 rounded-2xl p-6 retro-box shadow-[0_0_50px_rgba(245,158,11,0.4)] text-center space-y-4">
        {/* Ad Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-400" />
            <span className="font-pixel text-[10px] text-amber-400 uppercase tracking-wider">
              ANÚNCIO RECOMPENSADO (GOOGLE PLAY)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-white transition-colors cursor-pointer"
            title="Cancelar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ad Creative Frame */}
        <div className={`p-8 rounded-xl bg-gradient-to-b ${adInfo.gradient} border-2 border-slate-700 space-y-3`}>
          <div className="w-20 h-20 rounded-2xl bg-black/50 border-2 border-slate-600 flex items-center justify-center text-4xl mx-auto shadow-inner">
            {adInfo.icon}
          </div>

          <div>
            <h3 className={`font-pixel text-sm ${adInfo.accent}`}>{adInfo.title}</h3>
            <p className="font-retro text-xs text-slate-300 mt-1">{adInfo.tagline}</p>
          </div>

          <div className="inline-block py-1 px-3 bg-white/10 rounded-full font-retro text-[10px] text-slate-300 border border-white/20">
            ★ ★ ★ ★ ★ 4.9 na Google Play Store
          </div>
        </div>

        {/* Progress Countdown Bar */}
        <div className="space-y-1">
          <div className="flex justify-between font-retro text-xs text-slate-400">
            <span>Recompensa em:</span>
            <span className="font-pixel text-amber-400">
              {secondsRemaining > 0 ? `${secondsRemaining}s` : 'PRONTO!'}
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-amber-400 transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        {secondsRemaining === 0 ? (
          <button
            onClick={() => {
              soundEngine.playFanfare();
              onAdCompleted();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-pixel text-xs rounded-xl retro-btn flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>GIRAR ROLETA DE PRÊMIOS!</span>
          </button>
        ) : (
          <div className="py-3 text-slate-500 font-retro text-xs border border-slate-800 rounded-xl bg-slate-900/50">
            Aguarde o término do anúncio para liberar seu giro grátis...
          </div>
        )}

        <div className="text-[10px] font-retro text-slate-500">
          ✓ Anúncio 100% opcional · Sem interrupções forçadas · Assista quantas vezes quiser!
        </div>
      </div>
    </div>
  );
};
