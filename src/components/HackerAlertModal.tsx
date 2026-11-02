import React, { useEffect, useState } from 'react';
import { soundEngine } from '../game/audio';
import { ShieldAlert, ShieldCheck, Zap } from 'lucide-react';

interface HackerAlertModalProps {
  isOpen: boolean;
  onDefend: () => void;
  onFail: () => void;
}

export const HackerAlertModal: React.FC<HackerAlertModalProps> = ({
  isOpen,
  onDefend,
  onFail,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(6.0);
  const [clicksNeeded, setClicksNeeded] = useState<number>(3);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(6.0);
      setClicksNeeded(3);
      return;
    }

    soundEngine.playHackerAlarm();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          onFail();
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen, onFail]);

  if (!isOpen) return null;

  const handleInterceptClick = () => {
    soundEngine.playCoin();
    if (clicksNeeded <= 1) {
      onDefend();
    } else {
      setClicksNeeded((c) => c - 1);
    }
  };

  const progressPercent = (timeLeft / 6.0) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-none p-4 select-none">
      <div className="w-full max-w-md bg-slate-950 border-4 border-red-600 rounded-2xl p-6 retro-box shadow-[0_0_50px_rgba(239,68,68,0.6)] text-center animate-pulse space-y-4">
        <div className="inline-block p-4 rounded-full bg-red-950 border-2 border-red-500 text-red-500">
          <ShieldAlert className="w-12 h-12 animate-bounce" />
        </div>

        <div>
          <span className="font-pixel text-[10px] bg-red-600 text-white px-2 py-0.5 rounded uppercase tracking-widest">
            INVASÃO DETECTADA
          </span>
          <h2 className="font-pixel text-lg text-red-400 mt-2">ATAQUE HACKER!</h2>
          <p className="font-retro text-xs text-slate-300 mt-1">
            Criminosos digitais estão tentando burlar seus firewalls e desviar o caixa da empresa!
          </p>
        </div>

        {/* Countdown Bar */}
        <div className="space-y-1">
          <div className="flex justify-between font-pixel text-xs text-red-400">
            <span>TEMPO RESTANTE:</span>
            <span>{timeLeft.toFixed(1)}s</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-red-600">
            <div
              className="h-full bg-red-500 transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Panic Intercept Button */}
        <button
          onClick={handleInterceptClick}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-pixel text-sm rounded-xl retro-btn cursor-pointer shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5 text-yellow-300" />
          <span>BLOQUEAR INVASÃO! ({clicksNeeded}x)</span>
        </button>

        <p className="font-retro text-[11px] text-slate-400">
          Toque rapidamente no botão acima antes que a barra zere para repelir os invasores!
        </p>
      </div>
    </div>
  );
};
