import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BusinessOriginId,
  EconomicCycle,
  Employee,
  GameState,
  NewsItem,
  StaffSpecialty,
  StrategicDilemma,
} from './types/game';
import {
  createInitialGameState,
  loadGame,
  saveGame,
  OfflineEarningsResult,
} from './game/storage';
import {
  calculateClickPower,
  calculateNetWorth,
  calculatePassiveIncomePerSec,
  evaluateHackerAttack,
  getEconomicCycleInfo,
  getNextEconomicCycle,
} from './game/economy';
import { soundEngine } from './game/audio';
import { STRATEGIC_DILEMMAS } from './game/constants';
import { HUD } from './components/HUD';
import { OfficeCanvas } from './components/OfficeCanvas';
import { TitleScreen } from './components/TitleScreen';
import { TapBusinessTab } from './components/tabs/TapBusinessTab';
import { StaffTab } from './components/tabs/StaffTab';
import { MarketTab } from './components/tabs/MarketTab';
import { ExpansionTab } from './components/tabs/ExpansionTab';
import { BankingTab } from './components/tabs/BankingTab';
import { SecurityTab } from './components/tabs/SecurityTab';
import { PartnershipsTab } from './components/tabs/PartnershipsTab';
import { AchievementsTab } from './components/tabs/AchievementsTab';
import { ShopTab } from './components/tabs/ShopTab';
import { LeaderboardTab } from './components/tabs/LeaderboardTab';
import { HackerAlertModal } from './components/HackerAlertModal';
import { TaxSeasonModal } from './components/TaxSeasonModal';
import { DilemmaModal } from './components/DilemmaModal';
import { SkyscraperModal } from './components/SkyscraperModal';
import { WheelOfFortuneModal } from './components/WheelOfFortuneModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { GuidedTutorialBanner, TUTORIAL_STEPS } from './components/GuidedTutorialBanner';
import { processGooglePlayPurchase, restorePurchases } from './game/billing';
import { applyWheelReward } from './game/adsAndWheel';
import { updatePlayerCeoProfile } from './game/leaderboard';
import { SettingsModal } from './components/SettingsModal';
import { ConsortiumsTab } from './components/tabs/ConsortiumsTab';
import { PrivacyPolicyModal } from './components/legal/PrivacyPolicyModal';
import { TermsOfServiceModal } from './components/legal/TermsOfServiceModal';
import { AboutAndContactModal } from './components/legal/AboutAndContactModal';
import { CookieConsentBanner } from './components/legal/CookieConsentBanner';
import { AdSenseBanner } from './components/AdSenseBanner';
import { StickyBottomAdBanner } from './components/StickyBottomAdBanner';
import { REAL_TO_GAME_SPEED_FACTOR, getFloorConstructionTimeRealSeconds } from './game/time';
import {
  Briefcase,
  Users,
  TrendingUp,
  Building2,
  Landmark,
  ShieldCheck,
  Handshake,
  Trophy,
  Award,
  X,
  Info,
  ShoppingBag,
  Gift,
  Settings,
} from 'lucide-react';

type TabId =
  | 'escritorio'
  | 'equipe'
  | 'mercado'
  | 'consorcio'
  | 'expansao'
  | 'financas'
  | 'cyber'
  | 'ranking'
  | 'parcerias'
  | 'conquistas'
  | 'loja';

export default function App() {
  const [inGame, setInGame] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>(() => {
    const loaded = loadGame();
    return loaded ? loaded.state : createInitialGameState('garagem');
  });

  const [activeTab, setActiveTab] = useState<TabId>('escritorio');
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getIsMuted());

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSkyscraperOpen, setIsSkyscraperOpen] = useState<boolean>(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState<boolean>(false);
  const [isCycleInfoOpen, setIsCycleInfoOpen] = useState<boolean>(false);
  const [activeDilemma, setActiveDilemma] = useState<StrategicDilemma | null>(null);
  const [offlineNotice, setOfflineNotice] = useState<OfflineEarningsResult | null>(null);
  const [isWheelOpen, setIsWheelOpen] = useState<boolean>(false);
  const [isRewardedAdOpen, setIsRewardedAdOpen] = useState<boolean>(false);
  const [autoSpinOnWheelOpen, setAutoSpinOnWheelOpen] = useState<boolean>(false);
  const [billingToast, setBillingToast] = useState<string | null>(null);

  // AdSense Policy Legal Modals State
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [aboutInitialTab, setAboutInitialTab] = useState<'about' | 'contact'>('about');

  // Check ?autostart=1 support for automated testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('autostart') === '1') {
        setInGame(true);
        document.body.dataset.state = 'playing';
      }
    }
  }, []);

  // Update body dataset state
  useEffect(() => {
    document.body.dataset.state = inGame ? 'playing' : 'title';
  }, [inGame]);

  // Check offline earnings on boot
  useEffect(() => {
    const loaded = loadGame();
    if (loaded && loaded.offlineCashEarned > 0) {
      setOfflineNotice(loaded);
    }
  }, []);

  // Check online reconnection for pending offline rewards
  useEffect(() => {
    const handleOnline = () => {
      setGameState((prev) => {
        if (!prev.pendingOfflineRewards || prev.pendingOfflineRewards.length === 0) return prev;
        soundEngine.playFanfare();
        setBillingToast(`Conexão restabelecida! ${prev.pendingOfflineRewards.length} recompensas offline creditadas.`);
        return {
          ...prev,
          pendingOfflineRewards: [],
        };
      });
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  // 1-second simulation clock
  useEffect(() => {
    if (!inGame) return;

    const interval = setInterval(() => {
      setGameState((prev) => {
        const next = { ...prev };

        // 1. In-Game Clock Advance (1s real = 6s game)
        next.gameTimeSeconds = (next.gameTimeSeconds || 0) + REAL_TO_GAME_SPEED_FACTOR;

        // 1.1 Floor Construction Timer
        if (next.floorUnderConstruction && next.floorUnderConstruction.realSecondsRemaining > 0) {
          next.floorUnderConstruction = {
            ...next.floorUnderConstruction,
            realSecondsRemaining: next.floorUnderConstruction.realSecondsRemaining - 1,
          };
          if (next.floorUnderConstruction.realSecondsRemaining <= 0) {
            next.skyscraperFloors = next.floorUnderConstruction.targetFloor;
            next.maxStaffCapacity = Math.min(12, 4 + Math.floor(next.skyscraperFloors / 5));
            next.reputation += 40;
            next.floorUnderConstruction = null;
            setBillingToast(`🏢 ${next.skyscraperFloors}º Andar do Arranha-Céu Concluído!`);
            setTimeout(() => setBillingToast(null), 4000);
          }
        }

        // 1.2 Passive income
        const passiveIncome = calculatePassiveIncomePerSec(next);
        next.cash += passiveIncome;
        next.totalEarnedAllTime += passiveIncome;
        next.currentQuarterEarnings += passiveIncome;

        // 1.2 Expire temporary employees
        if (next.temporaryEmployees && next.temporaryEmployees.length > 0) {
          next.temporaryEmployees = next.temporaryEmployees.filter((e) => e.expiresAt > Date.now());
        }

        // 1.3 Expire temporary defense boost
        if (next.temporaryDefenseBoost && next.temporaryDefenseBoost.expiresAt <= Date.now()) {
          next.temporaryDefenseBoost = null;
        }

        // 1.4 Expire market tips
        if (next.marketTips && next.marketTips.length > 0) {
          next.marketTips = next.marketTips.filter((t) => t.expiresAt > Date.now());
        }

        // 2. Advance economic cycle timer
        next.cycleTimer -= 1;
        if (next.cycleTimer <= 0) {
          next.economicCycle = getNextEconomicCycle(next.economicCycle);
          next.cycleTimer = 60; // 60 seconds per cycle

          // Add news item about cycle change
          const cycleInfo = getEconomicCycleInfo(next.economicCycle);
          next.newsFeed.push({
            id: 'news_cycle_' + Date.now(),
            title: `Mercado entrou em ${cycleInfo.label}!`,
            impactText: cycleInfo.description,
            targetCategory: 'macro',
            priceMultiplier: 1.0,
            timestamp: Date.now(),
          });
        }

        // 3. Fluctuate Stocks & Cryptos
        const cycleInfo = getEconomicCycleInfo(next.economicCycle);

        next.stocks = next.stocks.map((stock) => {
          // Volatility swing (-volatility% to +volatility%)
          const swing = (Math.random() * 2 - 1) * stock.volatility * 0.15;
          const cycleBias = (cycleInfo.stockFactor - 1) * 0.05;
          let newPrice = Math.max(1, Math.round((stock.price * (1 + swing + cycleBias)) * 100) / 100);
          const history = [...stock.priceHistory.slice(-15), newPrice];
          return {
            ...stock,
            price: newPrice,
            priceHistory: history,
          };
        });

        next.cryptos = next.cryptos.map((crypto) => {
          const swing = (Math.random() * 2 - 1) * crypto.volatility * 0.25;
          const cycleBias = (cycleInfo.cryptoFactor - 1) * 0.08;
          let newPrice = Math.max(0.0001, Number((crypto.price * (1 + swing + cycleBias)).toFixed(4)));
          const history = [...crypto.priceHistory.slice(-15), newPrice];
          return {
            ...crypto,
            price: newPrice,
            priceHistory: history,
          };
        });

        // 4. Fixed income accumulation (compound interest)
        next.fixedIncomes = next.fixedIncomes.map((fi) => {
          if (fi.investedAmount > 0) {
            // annualRate / 365 / 86400 (accelerated for game loop: 1s = ~1 day)
            const yieldGained = (fi.investedAmount * fi.annualRate) / 60;
            return {
              ...fi,
              accumulatedYield: Math.round((fi.accumulatedYield + yieldGained) * 100) / 100,
            };
          }
          return fi;
        });

        // 5. Trigger tax season reminder if earnings high
        if (next.currentQuarterEarnings > 50000 && !next.taxSeasonActive && Math.random() < 0.008) {
          next.taxSeasonActive = true;
          setIsTaxModalOpen(true);
        }

        // 6. Hacker attack event chance (every few minutes, mitigated by defense rating)
        const timeSinceLastAttack = Date.now() - next.lastHackerAttackTimestamp;
        if (timeSinceLastAttack > 90000 && !next.hackerAttackUnderway && Math.random() < 0.015) {
          next.hackerAttackUnderway = true;
          next.lastHackerAttackTimestamp = Date.now();
        }

        // 7. Random Strategic Dilemma (1% chance per second, once every 60s)
        if (!activeDilemma && Math.random() < 0.005) {
          const randomDilemma = STRATEGIC_DILEMMAS[Math.floor(Math.random() * STRATEGIC_DILEMMAS.length)];
          setActiveDilemma(randomDilemma);
        }

        // 8. Progress achievements check
        next.achievements = next.achievements.map((ach) => {
          let currentProgress = ach.progress;
          if (ach.id === 'primeiro_real') currentProgress = next.totalEarnedAllTime;
          if (ach.id === 'cliques_100') currentProgress = next.totalClicks;
          if (ach.id === 'primeiro_funcionario') currentProgress = next.employees.length;
          if (ach.id === 'primeiro_andar') currentProgress = next.skyscraperFloors;
          if (ach.id === 'hacker_defendido') currentProgress = next.successfulDefenses;
          if (ach.id === 'milionario') currentProgress = calculateNetWorth(next);
          if (ach.id === 'bilionario') currentProgress = calculateNetWorth(next);
          if (ach.id === 'monopolio_primeiro') {
            currentProgress = next.competitors.filter((c) => c.acquired).length;
          }
          if (ach.id === 'equipe_especialista') {
            currentProgress = next.employees.filter((e) => e.rank === 'especialista' || e.rank === 'lendario').length;
          }
          return {
            ...ach,
            progress: currentProgress,
          };
        });

        // 9. Keep news feed concise (last 5)
        if (next.newsFeed.length > 8) {
          next.newsFeed = next.newsFeed.slice(-8);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [inGame, activeDilemma]);

  // Auto-save every 3 seconds
  useEffect(() => {
    if (!inGame) return;
    const saveTimer = setInterval(() => {
      saveGame(gameState);
    }, 3000);
    return () => clearInterval(saveTimer);
  }, [inGame, gameState]);

  // Tutorial step handlers
  const handleNextTutorialStep = () => {
    setGameState((prev) => {
      const currentStep = prev.tutorialStep ?? 0;
      if (currentStep >= TUTORIAL_STEPS.length - 1) {
        return {
          ...prev,
          tutorialActive: false,
        };
      }
      const nextStep = currentStep + 1;
      const targetTab = TUTORIAL_STEPS[nextStep]?.targetTab as TabId;
      if (targetTab) {
        setActiveTab(targetTab);
      }
      return {
        ...prev,
        tutorialStep: nextStep,
        tutorialActive: true,
      };
    });
  };

  const handleSkipTutorial = () => {
    setGameState((prev) => ({
      ...prev,
      tutorialActive: false,
    }));
  };

  const handleOpenTutorial = () => {
    setGameState((prev) => ({
      ...prev,
      tutorialStep: 0,
      tutorialActive: true,
    }));
    setActiveTab('escritorio');
  };

  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    soundEngine.playCoin();

    setGameState((prev) => {
      if (!prev.tutorialActive) return prev;
      const step = prev.tutorialStep ?? 0;
      if (step === 1 && tab === 'equipe') {
        return { ...prev, tutorialStep: 2 };
      }
      if (step === 2 && tab === 'mercado') {
        return { ...prev, tutorialStep: 3 };
      }
      return prev;
    });
  };

  // Manual Tap handler
  const handleTap = useCallback((x?: number, y?: number) => {
    setGameState((prev) => {
      const clickVal = calculateClickPower(prev);
      const isCrit = Math.random() < 0.15;
      const finalGain = isCrit ? clickVal * 3 : clickVal;

      const nextClicks = prev.totalClicks + 1;
      let nextStep = prev.tutorialStep ?? 0;
      if (prev.tutorialActive && (nextStep === 0 || nextStep === undefined)) {
        if (nextClicks >= 3) {
          nextStep = 1;
        }
      }

      return {
        ...prev,
        cash: prev.cash + finalGain,
        totalEarnedAllTime: prev.totalEarnedAllTime + finalGain,
        currentQuarterEarnings: prev.currentQuarterEarnings + finalGain,
        totalClicks: nextClicks,
        tutorialStep: nextStep,
      };
    });
  }, []);

  // Buy Tap Upgrade
  const handleBuyTapUpgrade = (upgradeId: string) => {
    setGameState((prev) => {
      const currentLevel = prev.tapUpgrades[upgradeId] || 0;
      const upgrade = prev.tapUpgrades;
      // find cost
      const baseCost = [50, 180, 650, 2400, 9500, 45000][
        ['cafe_turbinado', 'mouse_ergonomico', 'teclado_mecanico', 'cadeira_gamer', 'monitor_ultrawide', 'dedo_de_ouro'].indexOf(upgradeId)
      ] || 100;
      const cost = Math.round(baseCost * Math.pow(1.6, currentLevel));
      if (prev.cash < cost) return prev;

      soundEngine.playRegister();
      return {
        ...prev,
        cash: prev.cash - cost,
        tapUpgrades: {
          ...prev.tapUpgrades,
          [upgradeId]: currentLevel + 1,
        },
      };
    });
  };

  // Staff Management Handlers
  const handleHireEmployee = (employee: Employee) => {
    setGameState((prev) => ({
      ...prev,
      cash: prev.cash - employee.hireCost,
      employees: [...prev.employees, employee],
    }));
  };

  const handlePromoteEmployee = (employeeId: string) => {
    setGameState((prev) => {
      const costs: Record<string, number> = {
        estagiario: 800,
        junior: 3500,
        senior: 15000,
        especialista: 60000,
      };
      const nextRanks: Record<string, any> = {
        estagiario: 'junior',
        junior: 'senior',
        senior: 'especialista',
        especialista: 'lendario',
      };

      const updated = prev.employees.map((emp) => {
        if (emp.id === employeeId) {
          const cost = costs[emp.rank] || 0;
          if (prev.cash < cost) return emp;
          return {
            ...emp,
            rank: nextRanks[emp.rank] || emp.rank,
            baseProductivity: emp.baseProductivity * 1.5,
          };
        }
        return emp;
      });

      const targetEmp = prev.employees.find((e) => e.id === employeeId);
      const cost = targetEmp ? costs[targetEmp.rank] || 0 : 0;

      return {
        ...prev,
        cash: prev.cash - cost,
        employees: updated,
      };
    });
  };

  const handleTrainEmployee = (employeeId: string, specialty: StaffSpecialty) => {
    setGameState((prev) => {
      const cost = 2500;
      if (prev.cash < cost) return prev;

      const updated = prev.employees.map((emp) => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            specialty,
            successRate: Math.min(95, emp.successRate + 20),
          };
        }
        return emp;
      });

      return {
        ...prev,
        cash: prev.cash - cost,
        employees: updated,
      };
    });
  };

  const handleBonusEmployee = (employeeId: string) => {
    setGameState((prev) => {
      if (prev.cash < 200) return prev;
      return {
        ...prev,
        cash: prev.cash - 200,
        employees: prev.employees.map((emp) =>
          emp.id === employeeId ? { ...emp, morale: 100 } : emp
        ),
      };
    });
  };

  const handleFireEmployee = (employeeId: string) => {
    setGameState((prev) => ({
      ...prev,
      employees: prev.employees.filter((emp) => emp.id !== employeeId),
    }));
  };

  const handlePizzaFriday = () => {
    setGameState((prev) => {
      if (prev.cash < 450) return prev;
      return {
        ...prev,
        cash: prev.cash - 450,
        employees: prev.employees.map((emp) => ({
          ...emp,
          morale: Math.min(100, emp.morale + 30),
        })),
      };
    });
  };

  // Market Stock & Crypto Handlers
  const handleBuyStock = (stockId: string, quantity: number) => {
    setGameState((prev) => {
      const stock = prev.stocks.find((s) => s.id === stockId);
      if (!stock) return prev;
      const totalCost = stock.price * quantity;
      if (prev.cash < totalCost) return prev;

      return {
        ...prev,
        cash: prev.cash - totalCost,
        stocks: prev.stocks.map((s) =>
          s.id === stockId ? { ...s, owned: s.owned + quantity } : s
        ),
      };
    });
  };

  const handleSellStock = (stockId: string, quantity: number) => {
    setGameState((prev) => {
      const stock = prev.stocks.find((s) => s.id === stockId);
      if (!stock || stock.owned < quantity) return prev;
      const revenue = stock.price * quantity;

      return {
        ...prev,
        cash: prev.cash + revenue,
        stocks: prev.stocks.map((s) =>
          s.id === stockId ? { ...s, owned: s.owned - quantity } : s
        ),
      };
    });
  };

  const handleBuyCrypto = (cryptoId: string, quantity: number) => {
    setGameState((prev) => {
      const crypto = prev.cryptos.find((c) => c.id === cryptoId);
      if (!crypto) return prev;
      const totalCost = crypto.price * quantity;
      if (prev.cash < totalCost) return prev;

      return {
        ...prev,
        cash: prev.cash - totalCost,
        cryptos: prev.cryptos.map((c) =>
          c.id === cryptoId ? { ...c, owned: c.owned + quantity } : c
        ),
      };
    });
  };

  const handleSellCrypto = (cryptoId: string, quantity: number) => {
    setGameState((prev) => {
      const crypto = prev.cryptos.find((c) => c.id === cryptoId);
      if (!crypto || crypto.owned < quantity) return prev;
      const revenue = crypto.price * quantity;

      return {
        ...prev,
        cash: prev.cash + revenue,
        cryptos: prev.cryptos.map((c) =>
          c.id === cryptoId ? { ...c, owned: c.owned - quantity } : c
        ),
      };
    });
  };

  // Fixed Income
  const handleInvestFixedIncome = (fixedIncomeId: string, amount: number) => {
    setGameState((prev) => {
      if (prev.cash < amount) return prev;
      return {
        ...prev,
        cash: prev.cash - amount,
        fixedIncomes: prev.fixedIncomes.map((fi) =>
          fi.id === fixedIncomeId ? { ...fi, investedAmount: fi.investedAmount + amount } : fi
        ),
      };
    });
  };

  const handleRedeemFixedIncome = (fixedIncomeId: string) => {
    setGameState((prev) => {
      const fi = prev.fixedIncomes.find((f) => f.id === fixedIncomeId);
      if (!fi) return prev;
      const totalReturn = fi.investedAmount + fi.accumulatedYield;

      return {
        ...prev,
        cash: prev.cash + totalReturn,
        fixedIncomes: prev.fixedIncomes.map((f) =>
          f.id === fixedIncomeId ? { ...f, investedAmount: 0, accumulatedYield: 0 } : f
        ),
      };
    });
  };

  // Consortiums
  const handlePayConsortiumInstallment = (consortiumId: string) => {
    setGameState((prev) => {
      const cons = prev.consortiums.find((c) => c.id === consortiumId);
      if (!cons || prev.cash < cons.installmentValue || cons.isContemplated) return prev;

      const nextPaid = cons.paidInstallments + 1;
      const isContemplated = nextPaid >= cons.totalInstallments || Math.random() < 0.05; // 5% lottery chance!

      return {
        ...prev,
        cash: prev.cash - cons.installmentValue,
        reputation: isContemplated ? prev.reputation + 100 : prev.reputation,
        consortiums: prev.consortiums.map((c) =>
          c.id === consortiumId
            ? { ...c, paidInstallments: nextPaid, isContemplated: c.isContemplated || isContemplated }
            : c
        ),
      };
    });
  };

  const handleBidConsortium = (consortiumId: string) => {
    setGameState((prev) => {
      const cons = prev.consortiums.find((c) => c.id === consortiumId);
      if (!cons || cons.isContemplated) return prev;
      const bidCost = Math.round(cons.totalValue * cons.minBidPercent);
      if (prev.cash < bidCost) return prev;

      return {
        ...prev,
        cash: prev.cash - bidCost,
        reputation: prev.reputation + 150,
        consortiums: prev.consortiums.map((c) =>
          c.id === consortiumId ? { ...c, isContemplated: true } : c
        ),
      };
    });
  };

  // Plan Switch Handler
  const handleTogglePlan = (newPlan: 'VIP' | 'COMUM') => {
    setGameState((prev) => ({
      ...prev,
      plan: newPlan,
    }));
    setBillingToast(`Plano alterado para ${newPlan}!`);
    setTimeout(() => setBillingToast(null), 3000);
  };

  // Service Equipment Purchase Handler
  const handleBuyServiceEquipment = (equipmentId: string) => {
    setGameState((prev) => {
      const equip = prev.serviceEquipments?.find((e) => e.id === equipmentId);
      if (!equip || prev.cash < equip.cost || equip.owned) return prev;

      const updated = prev.serviceEquipments.map((e) =>
        e.id === equipmentId ? { ...e, owned: true } : e
      );

      return {
        ...prev,
        cash: prev.cash - equip.cost,
        serviceEquipments: updated,
        reputation: prev.reputation + 75,
      };
    });
    setBillingToast('🎉 Carta de Equipamento Adquirida e Ativada!');
    setTimeout(() => setBillingToast(null), 3000);
  };

  // Skyscraper Construction & Ad Speedup Handlers
  const handleBuildSkyscraperFloor = () => {
    setGameState((prev) => {
      const targetFloor = prev.skyscraperFloors + 1;
      const cost = Math.round(5000 * Math.pow(1.45, prev.skyscraperFloors - 1));
      if (prev.cash < cost || prev.skyscraperFloors >= 50 || prev.floorUnderConstruction) return prev;

      const totalRealSeconds = getFloorConstructionTimeRealSeconds(targetFloor);

      return {
        ...prev,
        cash: prev.cash - cost,
        floorUnderConstruction: {
          targetFloor,
          realSecondsRemaining: totalRealSeconds,
          totalRealSeconds,
          cost,
          startedAtTimestamp: Date.now(),
        },
      };
    });
  };

  const handleSpeedUpConstruction = () => {
    setGameState((prev) => {
      if (!prev.floorUnderConstruction) return prev;
      // Reduce 30 real minutes (1800 real seconds / 3h game time)
      const newRemaining = Math.max(0, prev.floorUnderConstruction.realSecondsRemaining - 1800);
      let updatedFloors = prev.skyscraperFloors;
      let activeConstruction = {
        ...prev.floorUnderConstruction,
        realSecondsRemaining: newRemaining,
      };

      if (newRemaining <= 0) {
        updatedFloors = prev.floorUnderConstruction.targetFloor;
        return {
          ...prev,
          skyscraperFloors: updatedFloors,
          maxStaffCapacity: Math.min(12, 4 + Math.floor(updatedFloors / 5)),
          reputation: prev.reputation + 40,
          floorUnderConstruction: null,
          totalAdsWatched: prev.totalAdsWatched + 1,
        };
      }

      return {
        ...prev,
        floorUnderConstruction: activeConstruction,
        totalAdsWatched: prev.totalAdsWatched + 1,
      };
    });
    setBillingToast('⚡ Tempo de construção reduzido em 30 minutos reais!');
    setTimeout(() => setBillingToast(null), 3000);
  };

  const handleResetGame = () => {
    const initial = createInitialGameState('garagem');
    saveGame(initial);
    setGameState(initial);
    setIsSettingsOpen(false);
    setBillingToast('Progresso do jogo foi completamente reiniciado.');
    setTimeout(() => setBillingToast(null), 3000);
  };

  const handleUpgradePhysicalAsset = (assetId: string) => {
    setGameState((prev) => {
      const asset = prev.physicalAssets.find((a) => a.id === assetId);
      if (!asset) return prev;
      const nextCost = asset.level === 0 ? asset.cost : Math.round(asset.upgradeCost * Math.pow(1.5, asset.level));
      if (prev.cash < nextCost) return prev;

      return {
        ...prev,
        cash: prev.cash - nextCost,
        reputation: prev.reputation + 25,
        physicalAssets: prev.physicalAssets.map((a) =>
          a.id === assetId ? { ...a, level: a.level + 1 } : a
        ),
      };
    });
  };

  const handleAcquireCompetitor = (competitorId: string) => {
    setGameState((prev) => {
      const comp = prev.competitors.find((c) => c.id === competitorId);
      if (!comp || prev.cash < comp.cost || comp.acquired) return prev;

      return {
        ...prev,
        cash: prev.cash - comp.cost,
        reputation: prev.reputation + 150,
        competitors: prev.competitors.map((c) =>
          c.id === competitorId ? { ...c, acquired: true } : c
        ),
      };
    });
  };

  // Banking: Loans & Taxes
  const handleTakeLoan = (loanId: string) => {
    setGameState((prev) => {
      const loan = prev.loans.find((l) => l.id === loanId);
      if (!loan || loan.totalOwed > 0 || prev.reputation < loan.minReputation) return prev;

      return {
        ...prev,
        cash: prev.cash + loan.amount,
        loans: prev.loans.map((l) => (l.id === loanId ? { ...l, totalOwed: l.amount } : l)),
      };
    });
  };

  const handlePayOffLoan = (loanId: string) => {
    setGameState((prev) => {
      const loan = prev.loans.find((l) => l.id === loanId);
      if (!loan || loan.totalOwed <= 0) return prev;
      const cost = Math.round(loan.totalOwed * 0.92);
      if (prev.cash < cost) return prev;

      return {
        ...prev,
        cash: prev.cash - cost,
        reputation: prev.reputation + 60, // early payoff reputation reward
        loans: prev.loans.map((l) => (l.id === loanId ? { ...l, totalOwed: 0 } : l)),
      };
    });
  };

  // Cyber Security
  const handleUpgradeCyber = (upgradeId: string) => {
    setGameState((prev) => {
      const currentLevel = prev.cyberUpgrades[upgradeId] || 0;
      const baseCosts: Record<string, number> = {
        firewall_basico: 800,
        antivirus_corporativo: 3200,
        autenticacao_2fa: 12000,
        pentester_especialista: 45000,
        soc_247: 180000,
        criptografia_quantica: 800000,
      };
      const defenseBoosts: Record<string, number> = {
        firewall_basico: 12,
        antivirus_corporativo: 15,
        autenticacao_2fa: 18,
        pentester_especialista: 20,
        soc_247: 22,
        criptografia_quantica: 25,
      };

      const cost = Math.round((baseCosts[upgradeId] || 1000) * Math.pow(1.8, currentLevel));
      if (prev.cash < cost) return prev;

      return {
        ...prev,
        cash: prev.cash - cost,
        cyberUpgrades: {
          ...prev.cyberUpgrades,
          [upgradeId]: currentLevel + 1,
        },
        cyberDefenseRating: Math.min(98, prev.cyberDefenseRating + (defenseBoosts[upgradeId] || 10)),
      };
    });
  };

  // Hacker Defense Result Handlers
  const handleHackerDefendSuccess = () => {
    soundEngine.playFanfare();
    setGameState((prev) => ({
      ...prev,
      hackerAttackUnderway: false,
      successfulDefenses: prev.successfulDefenses + 1,
      reputation: prev.reputation + 30,
    }));
  };

  const handleHackerDefendFail = () => {
    soundEngine.playBuzzer();
    setGameState((prev) => {
      const outcome = evaluateHackerAttack(prev.cyberDefenseRating, prev.cash);
      return {
        ...prev,
        hackerAttackUnderway: false,
        cash: Math.max(0, prev.cash - outcome.cashStolen),
        breachesSuffered: prev.breachesSuffered + 1,
        reputation: Math.max(10, prev.reputation - outcome.reputationLoss),
        employees: prev.employees.map((e) => ({
          ...e,
          morale: Math.max(20, e.morale - outcome.moraleLoss),
        })),
      };
    });
  };

  // Partnerships & Achievements
  const handleActivatePartnership = (partnershipId: string) => {
    setGameState((prev) => ({
      ...prev,
      partnerships: prev.partnerships.map((p) =>
        p.id === partnershipId ? { ...p, active: true } : p
      ),
    }));
  };

  const handleClaimAchievement = (achievementId: string) => {
    setGameState((prev) => {
      const ach = prev.achievements.find((a) => a.id === achievementId);
      if (!ach || ach.unlocked) return prev;

      return {
        ...prev,
        cash: prev.cash + ach.rewardCash,
        reputation: prev.reputation + ach.rewardPrestige,
        achievements: prev.achievements.map((a) =>
          a.id === achievementId ? { ...a, unlocked: true } : a
        ),
      };
    });
  };

  // Dilemma Choice Handler
  const handleDilemmaChoice = (option: 'A' | 'B') => {
    if (!activeDilemma) return;
    const choice = option === 'A' ? activeDilemma.optionA : activeDilemma.optionB;

    setGameState((prev) => {
      let newCash = prev.cash + (choice.effect.cash || 0);
      let newRep = Math.max(0, prev.reputation + (choice.effect.reputation || 0));

      return {
        ...prev,
        cash: Math.max(0, newCash),
        reputation: newRep,
        employees: prev.employees.map((e) => ({
          ...e,
          morale: Math.min(100, Math.max(10, e.morale + (choice.effect.morale || 0))),
        })),
      };
    });

    setActiveDilemma(null);
  };

  // Tax Season Complete Handler
  const handleTaxComplete = (taxPaid: number, reputationDelta: number) => {
    setGameState((prev) => ({
      ...prev,
      cash: Math.max(0, prev.cash - taxPaid),
      reputation: Math.max(0, prev.reputation + reputationDelta),
      currentQuarterEarnings: 0,
      taxSeasonActive: false,
    }));
  };

  // Google Play Billing Handlers
  const handleBuyInAppProduct = (productId: string) => {
    const result = processGooglePlayPurchase(gameState, productId);
    if (result.success) {
      soundEngine.playFanfare();
      setGameState(result.updatedState);
      setBillingToast(result.message);
      setTimeout(() => setBillingToast(null), 4000);
    } else {
      soundEngine.playBuzzer();
      alert(result.message);
    }
  };

  const handleRestorePurchases = () => {
    const result = restorePurchases(gameState);
    soundEngine.playFanfare();
    setGameState(result.updatedState);
    if (result.restoredCount > 0) {
      setBillingToast(`Restauração concluída! ${result.restoredCount} itens vinculados recuperados.`);
    } else {
      setBillingToast('Nenhuma compra não-consumível pendente para restaurar.');
    }
    setTimeout(() => setBillingToast(null), 4000);
  };

  // Rewarded Ad & Wheel of Fortune Handlers
  const handleStartRewardedAd = () => {
    setIsRewardedAdOpen(true);
  };

  const handleRewardedAdCompleted = () => {
    setIsRewardedAdOpen(false);
    setAutoSpinOnWheelOpen(true);
    setIsWheelOpen(true);
  };

  const handleWheelSpinCompleted = (sector: any) => {
    setAutoSpinOnWheelOpen(false);
    setGameState((prev) => {
      const { updatedState, result } = applyWheelReward(prev, sector);
      setBillingToast(`🎉 ${result.title} — ${result.description}`);
      setTimeout(() => setBillingToast(null), 5000);
      return updatedState;
    });
  };

  const handleUpdateCeoProfile = (newCeoName: string, newCompanyName: string) => {
    setGameState((prev) => updatePlayerCeoProfile(prev, newCeoName, newCompanyName));
    setBillingToast(`Perfil atualizado: ${newCeoName} (${newCompanyName})`);
    setTimeout(() => setBillingToast(null), 3000);
  };

  const clickPower = calculateClickPower(gameState);
  const netWorth = calculateNetWorth(gameState);
  const passiveIncomePerSec = calculatePassiveIncomePerSec(gameState);

  // If on Title Screen, render TitleScreen component along with legal modals & consent
  if (!inGame) {
    return (
      <>
        <TitleScreen
          hasSavedGame={!!loadGame()}
          onStartNewGame={(origin) => {
            setGameState(createInitialGameState(origin));
            setInGame(true);
          }}
          onContinueGame={() => {
            const loaded = loadGame();
            if (loaded) setGameState(loaded.state);
            setInGame(true);
          }}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(soundEngine.toggleMute())}
          onOpenPrivacyPolicy={() => setIsPrivacyOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
          onOpenAbout={() => {
            setAboutInitialTab('about');
            setIsAboutOpen(true);
          }}
        />

        <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
        <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
        <AboutAndContactModal
          isOpen={isAboutOpen}
          initialTab={aboutInitialTab}
          onClose={() => setIsAboutOpen(false)}
        />
        <CookieConsentBanner onOpenPrivacyPolicy={() => setIsPrivacyOpen(true)} />
      </>
    );
  }

  return (
    <div className="w-full min-h-[100vh] flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* 1. TOP HUD */}
      <HUD
        cash={gameState.cash}
        netWorth={netWorth}
        passiveIncomePerSec={passiveIncomePerSec}
        reputation={gameState.reputation}
        economicCycle={gameState.economicCycle}
        cycleTimer={gameState.cycleTimer}
        skyscraperFloors={gameState.skyscraperFloors}
        cyberDefenseRating={gameState.cyberDefenseRating}
        hackerAttackUnderway={gameState.hackerAttackUnderway}
        newsFeed={gameState.newsFeed}
        plan={gameState.plan}
        gameTimeSeconds={gameState.gameTimeSeconds}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(soundEngine.toggleMute())}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSkyscraper={() => setIsSkyscraperOpen(true)}
        onOpenCycleInfo={() => setIsCycleInfoOpen(true)}
        onOpenWheel={() => setIsRewardedAdOpen(true)}
        onOpenShop={() => handleSelectTab('loja')}
        onOpenLeaderboard={() => handleSelectTab('ranking')}
        onOpenTutorial={handleOpenTutorial}
      />

      {/* Floating Billing / Reward Toast */}
      {billingToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-emerald-950/95 border-2 border-emerald-400 text-emerald-300 font-pixel text-xs px-4 py-2.5 rounded-xl shadow-2xl retro-box flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{billingToast}</span>
        </div>
      )}

      {/* 2. MAIN WORKSPACE (Scrollable Game Hub) */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-4 max-w-7xl w-full mx-auto pb-36 sm:pb-44">
        {/* Offline Earnings Welcome Banner */}
        {offlineNotice && (
          <div className="bg-emerald-950/80 border-2 border-emerald-500 rounded-xl p-3.5 flex items-center justify-between gap-3 retro-box">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💤</span>
              <div>
                <h4 className="font-pixel text-xs text-emerald-300">
                  Bem-vindo de volta, CEO!
                </h4>
                <p className="font-retro text-xs text-slate-300">
                  Seus funcionários trabalharam enquanto você estava ausente e faturaram{' '}
                  <strong className="text-emerald-400 font-pixel">
                    R$ {offlineNotice.offlineCashEarned.toLocaleString('pt-BR')}
                  </strong>
                  !
                </p>
              </div>
            </div>
            <button
              onClick={() => setOfflineNotice(null)}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Animated Office Simulator (The Centerpiece Canvas) */}
        <OfficeCanvas
          employees={gameState.employees}
          skyscraperFloors={gameState.skyscraperFloors}
          economicCycle={gameState.economicCycle}
          hackerAttackUnderway={gameState.hackerAttackUnderway}
          onTap={handleTap}
          clickPower={clickPower}
          activeDecorations={gameState.activeDecorations}
        />

        {/* Tab Content Display */}
        <section className="mt-4">
          {activeTab === 'escritorio' && (
            <TapBusinessTab
              state={gameState}
              clickPower={clickPower}
              onBuyTapUpgrade={handleBuyTapUpgrade}
              onManualTap={() => handleTap()}
            />
          )}

          {activeTab === 'equipe' && (
            <StaffTab
              state={gameState}
              onHireEmployee={handleHireEmployee}
              onPromoteEmployee={handlePromoteEmployee}
              onTrainEmployee={handleTrainEmployee}
              onBonusEmployee={handleBonusEmployee}
              onFireEmployee={handleFireEmployee}
              onPizzaFriday={handlePizzaFriday}
            />
          )}

          {activeTab === 'mercado' && (
            <MarketTab
              state={gameState}
              onBuyStock={handleBuyStock}
              onSellStock={handleSellStock}
              onBuyCrypto={handleBuyCrypto}
              onSellCrypto={handleSellCrypto}
              onInvestFixedIncome={handleInvestFixedIncome}
              onRedeemFixedIncome={handleRedeemFixedIncome}
              onPayConsortiumInstallment={handlePayConsortiumInstallment}
              onBidConsortium={handleBidConsortium}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {activeTab === 'consorcio' && (
            <ConsortiumsTab
              state={gameState}
              onPayConsortiumInstallment={handlePayConsortiumInstallment}
              onBidConsortium={handleBidConsortium}
              onBuyServiceEquipment={handleBuyServiceEquipment}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {activeTab === 'expansao' && (
            <ExpansionTab
              state={gameState}
              onBuildSkyscraperFloor={handleBuildSkyscraperFloor}
              onSpeedUpConstruction={handleSpeedUpConstruction}
              onUpgradePhysicalAsset={handleUpgradePhysicalAsset}
              onAcquireCompetitor={handleAcquireCompetitor}
            />
          )}

          {activeTab === 'financas' && (
            <BankingTab
              state={gameState}
              onTakeLoan={handleTakeLoan}
              onPayOffLoan={handlePayOffLoan}
              onOpenTaxModal={() => setIsTaxModalOpen(true)}
            />
          )}

          {activeTab === 'cyber' && (
            <SecurityTab
              state={gameState}
              onUpgradeCyber={handleUpgradeCyber}
              onTriggerSimulatedAttack={() =>
                setGameState((prev) => ({
                  ...prev,
                  hackerAttackUnderway: true,
                }))
              }
            />
          )}

          {activeTab === 'parcerias' && (
            <PartnershipsTab
              state={gameState}
              onActivatePartnership={handleActivatePartnership}
            />
          )}

          {activeTab === 'conquistas' && (
            <AchievementsTab
              state={gameState}
              onClaimAchievement={handleClaimAchievement}
            />
          )}

          {activeTab === 'loja' && (
            <ShopTab
              state={gameState}
              onBuyProduct={handleBuyInAppProduct}
              onRestorePurchases={handleRestorePurchases}
              onOpenWheelOfFortune={handleStartRewardedAd}
            />
          )}

          {/* AdSense Policy Compliant Ad Unit */}
          <AdSenseBanner />

          {/* Policy Pages Footer Bar */}
          <footer className="w-full text-center py-3 border-t border-slate-800/80 space-y-2 font-retro text-[10px] text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="hover:text-emerald-400 underline cursor-pointer p-1"
              >
                Política de Privacidade & LGPD
              </button>
              <button
                onClick={() => setIsTermsOpen(true)}
                className="hover:text-indigo-400 underline cursor-pointer p-1"
              >
                Termos de Serviço
              </button>
              <button
                onClick={() => {
                  setAboutInitialTab('about');
                  setIsAboutOpen(true);
                }}
                className="hover:text-amber-400 underline cursor-pointer p-1"
              >
                Sobre o Jogo
              </button>
              <button
                onClick={() => {
                  setAboutInitialTab('contact');
                  setIsAboutOpen(true);
                }}
                className="hover:text-sky-400 underline cursor-pointer p-1"
              >
                Contato & Suporte
              </button>
            </div>
            <p className="text-[9px] text-slate-500">
              Magnata dos Negócios © 2026 · Estrutura Aprovada para Google AdSense
            </p>
          </footer>
        </section>
      </main>

      {/* Discrete Sticky Bottom AdSense Banner (Non-intrusive) */}
      <StickyBottomAdBanner />

      {/* 3. DOCK / BOTTOM NAVIGATION BAR (Android Mobile + Web Optimized) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-[100vw] bg-slate-900/98 border-t-2 border-slate-700 px-2 py-1.5 flex items-center justify-start sm:justify-around overflow-x-auto scrollbar-none gap-2 sm:gap-1 select-none shadow-2xl">
        <button
          onClick={() => handleSelectTab('escritorio')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 min-h-[48px] min-w-[52px] ${
            activeTab === 'escritorio'
              ? 'text-amber-400 bg-amber-950/80 font-pixel scale-105 border border-amber-500/50'
              : 'text-slate-300 hover:text-white font-retro'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span className="text-[9px]">Empresa</span>
        </button>

        <button
          onClick={() => handleSelectTab('equipe')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 min-h-[48px] min-w-[52px] ${
            activeTab === 'equipe'
              ? 'text-indigo-400 bg-indigo-950/80 font-pixel scale-105 border border-indigo-500/50'
              : 'text-slate-300 hover:text-white font-retro'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[9px]">Equipe</span>
        </button>

        <button
          onClick={() => handleSelectTab('mercado')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 min-h-[48px] min-w-[52px] ${
            activeTab === 'mercado'
              ? 'text-blue-400 bg-blue-950/80 font-pixel scale-105 border border-blue-500/50'
              : 'text-slate-300 hover:text-white font-retro'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-[9px]">Mercado</span>
        </button>

        <button
          onClick={() => handleSelectTab('consorcio')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 min-h-[48px] min-w-[52px] ${
            activeTab === 'consorcio'
              ? 'text-purple-400 bg-purple-950/80 font-pixel scale-105 border border-purple-500/50'
              : 'text-slate-300 hover:text-white font-retro'
          }`}
        >
          <Handshake className="w-4 h-4 text-purple-400" />
          <span className="text-[9px]">Consórcio</span>
        </button>

        <button
          onClick={() => handleSelectTab('expansao')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 min-h-[48px] min-w-[52px] ${
            activeTab === 'expansao'
              ? 'text-purple-400 bg-purple-950/80 font-pixel scale-105 border border-purple-500/50'
              : 'text-slate-300 hover:text-white font-retro'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="text-[9px]">Expansão</span>
        </button>

        <button
          onClick={() => handleSelectTab('financas')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 min-h-[48px] min-w-[52px] ${
            activeTab === 'financas'
              ? 'text-emerald-400 bg-emerald-950/80 font-pixel scale-105 border border-emerald-500/50'
              : 'text-slate-300 hover:text-white font-retro'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span className="text-[9px]">Banco/IR</span>
        </button>

        <button
          onClick={() => handleSelectTab('cyber')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 min-h-[48px] min-w-[52px] ${
            activeTab === 'cyber'
              ? 'text-cyan-400 bg-cyan-950/80 font-pixel scale-105 border border-cyan-500/50'
              : 'text-slate-300 hover:text-white font-retro'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[9px]">Cyber</span>
        </button>

        <button
          onClick={() => handleSelectTab('ranking')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 min-h-[48px] min-w-[52px] ${
            activeTab === 'ranking'
              ? 'text-amber-400 bg-amber-950/80 font-pixel scale-105 border border-amber-500/50'
              : 'text-slate-300 hover:text-white font-retro'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-[9px]">Top 100</span>
        </button>

        <button
          onClick={() => handleSelectTab('loja')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 min-h-[48px] min-w-[52px] ${
            activeTab === 'loja'
              ? 'text-emerald-400 bg-emerald-950/80 font-pixel scale-105 border border-emerald-500/50'
              : 'text-slate-300 hover:text-white font-retro'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px]">Loja Play</span>
        </button>

        <button
          onClick={() => handleSelectTab('conquistas')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 min-h-[48px] min-w-[52px] ${
            activeTab === 'conquistas'
              ? 'text-yellow-400 bg-yellow-950/80 font-pixel scale-105 border border-yellow-500/50'
              : 'text-slate-300 hover:text-white font-retro'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span className="text-[9px]">Metas</span>
        </button>
      </nav>

      {/* 4. MODALS & POPUPS */}
      {/* Settings & Gear Control Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        currentPlan={gameState.plan}
        isMuted={isMuted}
        onTogglePlan={handleTogglePlan}
        onToggleMute={() => setIsMuted(soundEngine.toggleMute())}
        onResetGame={handleResetGame}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Guided Tutorial Overlay Banner */}
      {gameState.tutorialActive && (
        <GuidedTutorialBanner
          currentStep={gameState.tutorialStep ?? 0}
          activeTab={activeTab}
          onNextStep={handleNextTutorialStep}
          onSkipTutorial={handleSkipTutorial}
          onNavigateTab={(tab) => handleSelectTab(tab as TabId)}
        />
      )}

      {/* Rewarded Video Ad Modal */}
      <RewardedAdModal
        isOpen={isRewardedAdOpen}
        onAdCompleted={handleRewardedAdCompleted}
        onClose={() => setIsRewardedAdOpen(false)}
      />

      {/* Animated Wheel of Fortune Modal */}
      <WheelOfFortuneModal
        isOpen={isWheelOpen}
        autoSpinOnOpen={autoSpinOnWheelOpen}
        onSpinCompleted={handleWheelSpinCompleted}
        onWatchAnotherAd={() => {
          setIsWheelOpen(false);
          setIsRewardedAdOpen(true);
        }}
        onClose={() => setIsWheelOpen(false)}
      />

      {/* Real-time Hacker Alert Modal */}
      <HackerAlertModal
        isOpen={gameState.hackerAttackUnderway}
        onDefend={handleHackerDefendSuccess}
        onFail={handleHackerDefendFail}
      />

      {/* Tax Season Modal */}
      <TaxSeasonModal
        isOpen={isTaxModalOpen}
        earnings={gameState.currentQuarterEarnings}
        onComplete={handleTaxComplete}
        onClose={() => setIsTaxModalOpen(false)}
      />

      {/* Strategic CEO Dilemma Modal */}
      <DilemmaModal
        dilemma={activeDilemma}
        onChooseOption={handleDilemmaChoice}
      />

      {/* Skyscraper HQ Modal */}
      <SkyscraperModal
        isOpen={isSkyscraperOpen}
        floors={gameState.skyscraperFloors}
        cash={gameState.cash}
        onBuildNextFloor={handleBuildSkyscraperFloor}
        onClose={() => setIsSkyscraperOpen(false)}
      />

      {/* Economic Cycle Info Modal */}
      {isCycleInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-none p-4 select-none">
          <div className="w-full max-w-md bg-slate-900 border-4 border-slate-700 rounded-2xl p-5 retro-box space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <h3 className="font-pixel text-xs text-amber-300 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Ciclos Econômicos & Mercado
              </h3>
              <button
                onClick={() => setIsCycleInfoOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-retro">
              <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40">
                <strong className="font-pixel text-[11px] text-emerald-400 block mb-0.5">
                  1. EXPANSÃO:
                </strong>
                Economia aquecida, ações e criptos em valorização gradual.
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-500/40">
                <strong className="font-pixel text-[11px] text-amber-400 block mb-0.5">
                  2. SUPERAQUECIMENTO (BOOM):
                </strong>
                Lucros máximos e loucura especulativa em criptos! Porém risco iminente de correção.
              </div>
              <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/40">
                <strong className="font-pixel text-[11px] text-rose-400 block mb-0.5">
                  3. RECESSÃO:
                </strong>
                Bolsa e criptomoedas em queda acentuada. Renda Fixa se torna o refúgio perfeito!
              </div>
              <div className="p-2.5 rounded-lg bg-cyan-950/50 border border-cyan-500/40">
                <strong className="font-pixel text-[11px] text-cyan-400 block mb-0.5">
                  4. RECUPERAÇÃO:
                </strong>
                Fundo do poço superado. Ótima fase para comprar ativos desvalorizados antes do próximo ciclo!
              </div>
            </div>

            <button
              onClick={() => setIsCycleInfoOpen(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-pixel text-xs rounded-xl retro-btn"
            >
              ENTENDIDO
            </button>
          </div>
        </div>
      )}

      {/* AdSense Legal & Policy Modals */}
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <AboutAndContactModal
        isOpen={isAboutOpen}
        initialTab={aboutInitialTab}
        onClose={() => setIsAboutOpen(false)}
      />
      <CookieConsentBanner onOpenPrivacyPolicy={() => setIsPrivacyOpen(true)} />
    </div>
  );
}

