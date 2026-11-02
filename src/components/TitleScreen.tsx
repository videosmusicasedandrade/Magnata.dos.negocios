import React, { useState, useEffect } from 'react';
import { BusinessOriginId } from '../types/game';
import { BUSINESS_ORIGINS } from '../game/constants';
import { soundEngine } from '../game/audio';
import { Sparkles, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface TitleScreenProps {
  hasSavedGame: boolean;
  onStartNewGame: (origin: BusinessOriginId) => void;
  onContinueGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  hasSavedGame,
  onStartNewGame,
  onContinueGame,
  isMuted,
  onToggleMute,
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState<BusinessOriginId>('garagem');
  const [showOriginSelect, setShowOriginSelect] = useState<boolean>(!hasSavedGame);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (hasSavedGame && !showOriginSelect) {
          onContinueGame();
        } else {
          onStartNewGame(selectedOrigin);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSavedGame, showOriginSelect, selectedOrigin, onContinueGame, onStartNewGame]);

  return (
    <div
      style={{ backgroundColor: '#020617', color: '#f8fafc' }}
      className="relative min-h-[100dvh] w-full max-w-[100vw] bg-slate-950 flex flex-col justify-between items-center p-3 sm:p-5 overflow-x-hidden overflow-y-auto select-none"
    >
      {/* Background Star Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,#020617_1px)] [background-size:20px_20px]" />
      </div>

      {/* 1. Header: Style tag & Sound toggle */}
      <header className="w-full max-w-xl flex items-center justify-between gap-2 z-10 shrink-0 pb-2">
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-retro text-amber-300 shadow">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">ESTILO TAP TAP TRILLIONAIRE</span>
        </div>

        <button
          onClick={onToggleMute}
          aria-label={isMuted ? 'Ativar Som' : 'Desativar Som'}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer shrink-0 shadow min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </header>

      {/* 2. Main Title Section */}
      <main className="w-full max-w-xl flex flex-col items-center text-center z-10 py-3 space-y-3">
        {/* Emblem Vault Box */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border-4 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center justify-center animate-bounce">
            <span className="text-3xl sm:text-4xl">💰</span>
          </div>
          <span className="bg-emerald-600 text-white font-pixel text-[9px] px-2.5 py-0.5 rounded-md border border-emerald-400 font-bold shadow">
            100% OFFLINE
          </span>
        </div>

        {/* Title Logo */}
        <div className="space-y-1 w-full px-2">
          <h1 className="font-pixel text-xl sm:text-3xl text-amber-400 tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            MAGNATA
          </h1>
          <h2 className="font-pixel text-base sm:text-2xl text-sky-400 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            DOS NEGÓCIOS
          </h2>
        </div>

        <p className="font-retro text-xs sm:text-sm text-slate-300 max-w-md px-2 leading-relaxed">
          Toque para enriquecer, contrate analistas, invista em ações, criptos e consórcios e construa seu império!
        </p>

        {/* Origin Selection or Continue Options */}
        {showOriginSelect ? (
          <div className="w-full space-y-3 pt-1">
            <h3 className="font-pixel text-[10px] sm:text-xs text-amber-300 px-1">
              ESCOLHA O NEGÓCIO INICIAL:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left w-full">
              {BUSINESS_ORIGINS.map((origin) => {
                const isSelected = origin.id === selectedOrigin;
                return (
                  <div
                    key={origin.id}
                    onClick={() => {
                      setSelectedOrigin(origin.id);
                      soundEngine.playCoin();
                    }}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl shrink-0">{origin.icon}</span>
                      <h4 className="font-pixel text-xs text-slate-100 truncate">{origin.name}</h4>
                    </div>
                    <p className="font-retro text-[10px] text-slate-300 line-clamp-2">
                      {origin.description}
                    </p>
                    <div className="font-retro text-[10px] text-emerald-400 mt-1.5 font-bold">
                      {origin.initialBonus}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col items-center gap-2 w-full">
              <button
                data-start="true"
                onClick={() => onStartNewGame(selectedOrigin)}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-pixel text-xs rounded-xl retro-btn flex items-center justify-center gap-2 cursor-pointer shadow-xl min-h-[48px] active:scale-95 font-bold"
              >
                <Play className="w-4 h-4 fill-current shrink-0" />
                <span className="truncate">INICIAR JORNADA BILIONÁRIA</span>
              </button>

              {hasSavedGame && (
                <button
                  onClick={() => setShowOriginSelect(false)}
                  className="font-retro text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer p-2 min-h-[44px] flex items-center justify-center"
                >
                  Voltar ao jogo salvo
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm space-y-3 pt-2">
            <button
              data-start="true"
              onClick={onContinueGame}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-pixel text-xs sm:text-sm rounded-xl retro-btn flex items-center justify-center gap-2 cursor-pointer shadow-xl min-h-[48px] active:scale-95 font-bold"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span>CONTINUAR IMPÉRIO</span>
            </button>

            <button
              onClick={() => setShowOriginSelect(true)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-xs rounded-xl retro-btn flex items-center justify-center gap-2 cursor-pointer border border-slate-700 min-h-[44px]"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>NOVO JOGO (DO ZERO)</span>
            </button>
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <footer className="w-full max-w-xl text-center z-10 shrink-0 pt-3">
        <div className="font-retro text-[10px] text-slate-400 border-t border-slate-800 pt-2">
          Toque para enriquecer · Compatível com todos os celulares · 100% Offline
        </div>
      </footer>
    </div>
  );
};
