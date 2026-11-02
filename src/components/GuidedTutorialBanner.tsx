import React from 'react';
import { Sparkles, ChevronRight, X, HelpCircle, CheckCircle2, ArrowDown } from 'lucide-react';
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
    advisorTitle: 'Conselheiro Magnata',
    message: 'Bem-vindo, CEO! Toque no centro da tela ou na sua mesa do escritório para faturar suas primeiras moedas e dar o pontapé inicial!',
    actionHint: 'Toque 3 vezes na tela ou clique em Próximo!',
    targetTab: 'escritorio',
    highlightText: 'Toque na tela',
  },
  {
    id: 1,
    title: '2. Contrate sua Equipe',
    avatarEmoji: '👨‍💼',
    advisorTitle: 'Diretor de RH',
    message: 'Excelente! Dinheiro em caixa. Agora abra a aba "Equipe" no menu inferior para contratar executivos e gerar renda passiva automática!',
    actionHint: 'Abra a aba "Equipe" no menu inferior!',
    targetTab: 'equipe',
    highlightText: 'Aba Equipe',
  },
  {
    id: 2,
    title: '3. Invista no Mercado',
    avatarEmoji: '📈',
    advisorTitle: 'Analista de Mercado',
    message: 'Ótimo trabalho! Sua equipe está gerando moedas a cada segundo. Vá até a aba "Mercado" para comprar Ações e Criptomoedas!',
    actionHint: 'Explore a aba "Mercado"!',
    targetTab: 'mercado',
    highlightText: 'Aba Mercado',
  },
  {
    id: 3,
    title: '4. Fique Atento à Economia',
    avatarEmoji: '🗞️',
    advisorTitle: 'Economista Chefe',
    message: 'Dica de Mestre: Acompanhe as Notícias e o Ciclo Econômico no topo para saber exatamente quando comprar na baixa e vender na alta!',
    actionHint: 'Observe o indicador de Ciclo no HUD do topo!',
    targetTab: 'escritorio',
    highlightText: 'Ciclo Econômico',
  },
  {
    id: 4,
    title: '5. Domine o Mercado!',
    avatarEmoji: '👑',
    advisorTitle: 'Sócio Fundador',
    message: 'Sensacional! Você aprendeu o básico. Agora erga os andares do seu Arranha-Céu, adquira concorrentes e suba no Ranking dos Top 100 CEOs!',
    actionHint: 'Concluir Tutorial e Jogar! 🎉',
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
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl bg-slate-900/98 border-2 border-amber-400 rounded-2xl p-3.5 sm:p-4 shadow-[0_10px_35px_rgba(245,158,11,0.35)] retro-box backdrop-blur-none transition-all duration-300 animate-fadeIn"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-amber-500/30">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] sm:text-xs bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 shadow">
            <Sparkles className="w-3 h-3 fill-current" />
            TUTORIAL GUIADO
          </span>
          <span className="font-retro text-xs text-amber-300">
            Passo {currentStep + 1} de {totalSteps}
          </span>
        </div>

        <button
          onClick={onSkipTutorial}
          className="font-retro text-[10px] sm:text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          title="Pular Tutorial"
        >
          <span>Pular</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content Area: Character Speech Bubble */}
      <div className="flex items-start gap-3">
        {/* Pixel Character Avatar */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-300 flex items-center justify-center text-2xl sm:text-3xl shadow-md animate-bounce">
            {stepConfig.avatarEmoji}
          </div>
          <span className="font-pixel text-[8px] text-amber-300 mt-1 text-center max-w-[64px] truncate">
            {stepConfig.advisorTitle}
          </span>
        </div>

        {/* Speech Bubble Text Box */}
        <div className="flex-1 min-w-0 bg-slate-950/90 border border-slate-700/80 rounded-xl p-2.5 sm:p-3 relative retro-box">
          <p className="font-retro text-xs sm:text-sm text-slate-200 leading-relaxed">
            {stepConfig.message}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 font-retro text-[10px] sm:text-xs text-amber-400">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{stepConfig.actionHint}</span>
            </div>

            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-pixel text-[10px] sm:text-xs rounded-lg retro-btn flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 ml-auto"
            >
              <span>{isLastStep ? 'Concluir! 🎉' : 'Próximo'}</span>
              {!isLastStep && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Dots Indicator */}
      <div className="flex justify-center gap-1.5 mt-2.5">
        {TUTORIAL_STEPS.map((step, idx) => (
          <div
            key={step.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentStep
                ? 'w-6 bg-amber-400'
                : idx < currentStep
                ? 'w-2.5 bg-emerald-500'
                : 'w-2.5 bg-slate-700'
            }`}
          />
        ))}
      </div>
    </aside>
  );
};
