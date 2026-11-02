import React from 'react';
import { StrategicDilemma } from '../types/game';
import { soundEngine } from '../game/audio';
import { HelpCircle, Sparkles } from 'lucide-react';

interface DilemmaModalProps {
  dilemma: StrategicDilemma | null;
  onChooseOption: (option: 'A' | 'B') => void;
}

export const DilemmaModal: React.FC<DilemmaModalProps> = ({
  dilemma,
  onChooseOption,
}) => {
  if (!dilemma) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-none p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border-4 border-amber-500 rounded-2xl p-6 retro-box space-y-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-950 border-2 border-amber-400 rounded-xl text-3xl">
            💡
          </div>
          <div>
            <span className="font-pixel text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-bold uppercase">
              DECISÃO ESTRATÉGICA DO CEO
            </span>
            <h2 className="font-pixel text-sm sm:text-base text-amber-300 mt-1">
              {dilemma.title}
            </h2>
          </div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs font-retro text-slate-200">
          <p>{dilemma.situation}</p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Option A */}
          <button
            onClick={() => {
              onChooseOption('A');
              soundEngine.playCoin();
            }}
            className="w-full p-4 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-amber-400 rounded-xl text-left retro-btn cursor-pointer transition-all"
          >
            <h4 className="font-pixel text-xs text-amber-300">{dilemma.optionA.label}</h4>
            <p className="font-retro text-xs text-slate-400 mt-1">{dilemma.optionA.description}</p>
          </button>

          {/* Option B */}
          <button
            onClick={() => {
              onChooseOption('B');
              soundEngine.playCoin();
            }}
            className="w-full p-4 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-blue-400 rounded-xl text-left retro-btn cursor-pointer transition-all"
          >
            <h4 className="font-pixel text-xs text-blue-300">{dilemma.optionB.label}</h4>
            <p className="font-retro text-xs text-slate-400 mt-1">{dilemma.optionB.description}</p>
          </button>
        </div>
      </div>
    </div>
  );
};
