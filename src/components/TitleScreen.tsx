import React, { useState, useEffect } from 'react';
import { BusinessOriginId } from '../types/game';
import { BUSINESS_ORIGINS } from '../game/constants';
import { soundEngine } from '../game/audio';
import { Sparkles, Play, RotateCcw, Volume2, VolumeX, Shield, Briefcase } from 'lucide-react';

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

  // Keyboard shortcut: Space or Enter triggers start
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
      className="relative min-h-[100dvh] w-full bg-slate-950 flex flex-col justify-between items-center p-3 sm:p-6 overflow-y-auto select-none"
    >
      {/* Background Retro Skyline & Stars */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,#020617_1px)] [background-size:24px_24px]" />
      </div>

      {/* Top Bar with Mute & Tag */}
      <header className="w-full max-w-4xl flex items-center justify-between gap-2 z-10 mb-2">
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-retro text-amber-400 shadow-md">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate">TAP TAP TRILLIONAIRE STYLE</span>
        </div>

        <button
          onClick={onToggleMute}
          aria-label={isMuted ? 'Ativar Som' : 'Desativar Som'}
          className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 shadow-md"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </header>

      {/* Center Stage: Title Lockup & Bespoke Emblem */}
      <main className="flex flex-col items-center text-center z-10 max-w-2xl my-auto py-2">
        {/* Bespoke Pixel Art Gold Vault Emblem */}
        <div className="relative mb-3">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 border-4 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center animate-bounce">
            <span className="text-4xl sm:text-5xl">💰</span>
          </div>
          <div className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 font-pixel text-[9px] sm:text-[10px] px-2 py-0.5 rounded border border-emerald-300 shadow font-bold">
            100% OFFLINE
          </div>
        </div>

        {/* Bespoke Inline SVG Logo */}
        <svg
          viewBox="0 0 600 110"
          className="w-full max-w-lg h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          <text
            x="300"
            y="45"
            textAnchor="middle"
            fontFamily="'Press Start 2P', monospace"
            fontSize="32"
            fill="url(#goldGrad)"
            stroke="#0f172a"
            strokeWidth="8"
            paintOrder="stroke fill"
          >
            MAGNATA
          </text>
          <text
            x="300"
            y="85"
            textAnchor="middle"
            fontFamily="'Press Start 2P', monospace"
            fontSize="24"
            fill="#38bdf8"
            stroke="#0f172a"
            strokeWidth="6"
            paintOrder="stroke fill"
          >
            DOS NEGÓCIOS
          </text>
        </svg>

        <p className="font-retro text-xs sm:text-sm text-slate-300 max-w-md mt-1 mb-5">
          Toque para enriquecer, contrate analistas, invista em ações, criptos e consórcios e erga seu império corporativo!
        </p>

        {/* Origin Selector or Continue Actions */}
        {showOriginSelect ? (
          <div className="w-full space-y-3.5">
            <h3 className="font-pixel text-[11px] sm:text-xs text-amber-300">
              ESCOLHA A ORIGEM DO SEU PRIMEIRO NEGÓCIO:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              {BUSINESS_ORIGINS.map((origin) => {
                const isSelected = origin.id === selectedOrigin;
                return (
                  <div
                    key={origin.id}
                    onClick={() => {
                      setSelectedOrigin(origin.id);
                      soundEngine.playCoin();
                    }}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-3xl mb-1.5">{origin.icon}</div>
                    <h4 className="font-pixel text-xs text-slate-100">{origin.name}</h4>
                    <p className="font-retro text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {origin.description}
                    </p>
                    <div className="font-retro text-[10px] text-emerald-400 mt-2 font-bold">
                      {origin.initialBonus}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                data-start="true"
                onClick={() => onStartNewGame(selectedOrigin)}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-pixel text-xs sm:text-sm rounded-xl retro-btn flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>INICIAR JORNADA BILIONÁRIA</span>
              </button>

              {hasSavedGame && (
                <button
                  onClick={() => setShowOriginSelect(false)}
                  className="font-retro text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
                >
                  Voltar ao jogo salvo
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm space-y-3">
            <button
              data-start="true"
              onClick={onContinueGame}
              className="w-full py-4 bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-pixel text-sm rounded-xl retro-btn flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>CONTINUAR IMPÉRIO</span>
            </button>

            <button
              onClick={() => setShowOriginSelect(true)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel text-xs rounded-xl retro-btn flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>NOVO JOGO (DO ZERO)</span>
            </button>
          </div>
        )}
      </main>

      {/* Flat Control Hints Footer */}
      <footer className="w-full max-w-2xl text-center z-10">
        <div className="font-retro text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
          Toque na tela para enriquecer · Enter / Barra de Espaço para Começar · 100% Offline
        </div>
      </footer>
    </div>
  );
};
