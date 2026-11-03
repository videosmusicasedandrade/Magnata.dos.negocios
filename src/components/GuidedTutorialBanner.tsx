import React from 'react';
import { Sparkles, ChevronRight, X } from 'lucide-react';
import { soundEngine } from '../game/audio';

export interface TutorialStepConfig {
  id: number;
  title: string;
  avatarEmoji: string;
  advisorTitle: string;
  message: string;
  actionHint: string;
  targetTab?: string;
  highlightText: string;
}

export const TUTORIAL_STEPS: TutorialStepConfig[] = [
  {
    id: 0,
    title: '1. Toque para Enriquecer',
    avatarEmoji: '💼',
    advisorTitle: 'Conselheiro',
    message: 'Toque na mesa do seu escritório para faturar suas primeiras moedas!',
    actionHint: 'Toque na tela!',
    targetTab: 'escritorio',
    highlightText: 'Toque na tela',
  },
  {
    id: 1,
    title: '2. Contrate sua Equipe',
    avatarEmoji: '👨‍💼',
    advisorTitle: 'Diretor de RH',
    message: 'Abra a aba "Equipe" no menu para contratar analistas e gerar renda passiva.',
    actionHint: 'Abra a aba "Equipe"!',
    targetTab: 'equipe',
    highlightText: 'Aba Equipe',
  },
  {
    id: 2,
    title: '3. Invista no Mercado',
    avatarEmoji: '📈',
    advisorTitle: 'Analista',
    message: 'Visite a aba "Mercado" para comprar Ações e Criptomoedas na baixa!',
    actionHint: 'Explore a aba "Mercado"!',
    targetTab: 'mercado',
    highlightText: 'Aba Mercado',
  },
  {
    id: 3,
    title: '4. Ciclos Econômicos',
    avatarEmoji: '🗞️',
    advisorTitle: 'Economista',
    message: 'Acompanhe as Notícias e o Ciclo Econômico no topo para lucrar mais.',
    actionHint: 'Observe o ciclo no topo!',
    targetTab: 'escritorio',
    highlightText: 'Ciclo Econômico',
  },
  {
    id: 4,
    title: '5. Domine o Mercado!',
    avatarEmoji: '👑',
    advisorTitle: 'Sócio Fundador',
    message: 'Construa andares no prédio e suba no Ranking dos Top 100 CEOs!',
    actionHint: 'Boa sorte, Magnata! 🎉',
    targetTab: 'escritorio',
    highlightText: 'Jornada Bilionária',
  },
];

interface GuidedTutorialBannerProps {
  currentStep: number;
  activeTab: string;
  onNextStep: () => void;
  onSkipTutorial: () => void;
  onNavigateTab: (tab: string) => void;
}

export const GuidedTutorialBanner: React.FC<GuidedTutorialBannerProps> = ({
  currentStep,
  activeTab,
  onNextStep,
  onSkipTutorial,
  onNavigateTab,
}) => {
  const stepConfig = TUTORIAL_STEPS[currentStep] || TUTORIAL_STEPS[TUTORIAL_STEPS.length - 1];
  const totalSteps = TUTORIAL_STEPS.length;
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = () => {
    soundEngine.playCoin();
    if (stepConfig.targetTab && stepConfig.targetTab !== activeTab) {
      onNavigateTab(stepConfig.targetTab);
    }
    onNextStep();
  };

  return (
    <aside
      aria-label="Tutorial Guiado"
      style={{ left: '8px', right: '8px', margin: '0 auto', maxWidth: '480px' }}
      className="fixed bottom-[104px] sm:bottom-[112px] z-40 bg-slate-900/98 border-2 border-amber-400 rounded-xl p-2.5 sm:p-3 shadow-2xl retro-box backdrop-blur-none transition-all duration-200 select-none"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-amber-500/30">
        <div className="flex items-center gap-1.5">
          <span className="font-pixel text-[9px] sm:text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 shadow">
            <Sparkles className="w-2.5 h-2.5 fill-current" />
            TUTORIAL ({currentStep + 1}/{totalSteps})
          </span>
          <span className="font-retro text-[10px] text-amber-300 truncate max-w-[150px]">
            {stepConfig.title}
          </span>
        </div>

        <button
          onClick={onSkipTutorial}
          className="font-retro text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          title="Fechar Tutorial"
        >
          <span>Pular</span>
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Main Content Area: Character Avatar + Text */}
      <div className="flex items-center gap-2.5">
        {/* Pixel Character Avatar */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-300 flex items-center justify-center text-lg sm:text-2xl shadow">
            {stepConfig.avatarEmoji}
          </div>
          <span className="font-pixel text-[7px] text-amber-300 mt-0.5 text-center max-w-[48px] truncate">
            {stepConfig.advisorTitle}
          </span>
        </div>

        {/* Speech Bubble Text Box */}
        <div className="flex-1 min-w-0 bg-slate-950/80 border border-slate-700/80 rounded-lg p-2">
          <p className="font-retro text-[11px] sm:text-xs text-slate-200 leading-snug line-clamp-2">
            {stepConfig.message}
          </p>

          <div className="mt-1.5 flex items-center justify-between gap-1 pt-1 border-t border-slate-800">
            <span className="font-retro text-[9px] text-amber-400 truncate max-w-[160px]">
              👉 {stepConfig.actionHint}
            </span>

            <button
              onClick={handleNext}
              className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-pixel text-[9px] rounded retro-btn flex items-center gap-1 cursor-pointer shadow active:scale-95 shrink-0 font-bold"
            >
              <span>{isLastStep ? 'Concluir! 🎉' : 'Próximo'}</span>
              {!isLastStep && <ChevronRight className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
