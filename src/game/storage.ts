import { GameState, BusinessOriginId } from '../types/game';
import {
  BUSINESS_ORIGINS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_COMPETITORS,
  INITIAL_CONSORTIUMS,
  INITIAL_CRYPTOS,
  INITIAL_FIXED_INCOME,
  INITIAL_LOANS,
  INITIAL_PARTNERSHIPS,
  INITIAL_PHYSICAL_ASSETS,
  INITIAL_STOCKS,
} from './constants';
import { calculatePassiveIncomePerSec } from './economy';

const STORAGE_KEY = 'magnata_game_save_v1';

export function createInitialGameState(originId: BusinessOriginId = 'garagem'): GameState {
  const origin = BUSINESS_ORIGINS.find((o) => o.id === originId) || BUSINESS_ORIGINS[0];

  return {
    version: 1,
    companyName: 'Império Magnata',
    ceoName: 'Você (CEO)',
    origin: originId,
    cash: origin.startingCash,
    totalEarnedAllTime: origin.startingCash,
    reputation: 100, // Starts at 100
    skyscraperFloors: 1, // Starts at Floor 1

    economicCycle: 'expansao',
    cycleTimer: 60, // 60s per cycle

    baseClickValue: 2,
    tapUpgrades: {},

    employees: [
      {
        id: 'emp_init_1',
        name: 'Tiago Dev',
        avatarSeed: 1,
        roleTitle: 'Estagiário Dedicado',
        rank: 'estagiario',
        specialty: 'geral',
        salary: 20,
        baseProductivity: 3,
        morale: 100,
        successRate: 40,
        hireCost: 0,
        deskIndex: 0,
      },
    ],
    maxStaffCapacity: 4,

    stocks: JSON.parse(JSON.stringify(INITIAL_STOCKS)),
    cryptos: JSON.parse(JSON.stringify(INITIAL_CRYPTOS)),
    fixedIncomes: JSON.parse(JSON.stringify(INITIAL_FIXED_INCOME)),
    consortiums: JSON.parse(JSON.stringify(INITIAL_CONSORTIUMS)),

    physicalAssets: JSON.parse(JSON.stringify(INITIAL_PHYSICAL_ASSETS)),
    competitors: JSON.parse(JSON.stringify(INITIAL_COMPETITORS)),

    cyberUpgrades: {},
    cyberDefenseRating: 20,
    lastHackerAttackTimestamp: Date.now(),
    hackerAttackUnderway: false,
    hackerTimerRemaining: 0,

    loans: JSON.parse(JSON.stringify(INITIAL_LOANS)),
    currentQuarterEarnings: 0,
    taxSeasonActive: false,
    taxesPending: 0,

    partnerships: JSON.parse(JSON.stringify(INITIAL_PARTNERSHIPS)),
    achievements: JSON.parse(JSON.stringify(INITIAL_ACHIEVEMENTS)),
    newsFeed: [
      {
        id: 'news_init',
        title: 'Bem-vindo ao Mercado Financeiro!',
        impactText: 'Comece clicando para gerar suas primeiras moedas e contrate seu time.',
        targetCategory: 'geral',
        priceMultiplier: 1.0,
        timestamp: Date.now(),
      },
    ],

    totalClicks: 0,
    successfulDefenses: 0,
    breachesSuffered: 0,
    totalAdsWatched: 0,
    lastSaveTimestamp: Date.now(),

    // Monetization & Wheel
    purchasedNonConsumables: [],
    transactionsHistory: [],
    wheelSpinCount: 0,
    lastWheelSpinTimestamp: 0,
    marketTips: [],
    pendingOfflineRewards: [],
    activeDecorations: [],
    temporaryEmployees: [],
    temporaryDefenseBoost: null,
  };
}

export function saveGame(state: GameState): void {
  try {
    const data = {
      ...state,
      lastSaveTimestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Falha ao salvar progresso:', e);
  }
}

export interface OfflineEarningsResult {
  state: GameState;
  offlineSeconds: number;
  offlineCashEarned: number;
  hackerAttackOccurred: boolean;
  hackerBreach: boolean;
}

export function loadGame(): OfflineEarningsResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const state: GameState = {
      ...createInitialGameState(parsed.origin || 'garagem'),
      ...parsed,
      purchasedNonConsumables: parsed.purchasedNonConsumables || [],
      transactionsHistory: parsed.transactionsHistory || [],
      wheelSpinCount: parsed.wheelSpinCount || 0,
      marketTips: parsed.marketTips || [],
      pendingOfflineRewards: parsed.pendingOfflineRewards || [],
      activeDecorations: parsed.activeDecorations || [],
      temporaryEmployees: parsed.temporaryEmployees || [],
      temporaryDefenseBoost: parsed.temporaryDefenseBoost || null,
      totalAdsWatched: parsed.totalAdsWatched || 0,
    };

    // Calculate offline gains
    const now = Date.now();
    const elapsedSeconds = Math.max(0, Math.floor((now - (state.lastSaveTimestamp || now)) / 1000));
    
    // Cap offline gains to 8 hours (28,800 seconds)
    const cappedSeconds = Math.min(28800, elapsedSeconds);
    let offlineCashEarned = 0;
    let hackerAttackOccurred = false;
    let hackerBreach = false;

    if (cappedSeconds > 10) {
      const passivePerSec = calculatePassiveIncomePerSec(state);
      // Offline efficiency 70%
      offlineCashEarned = Math.round(passivePerSec * cappedSeconds * 0.7);
      state.cash += offlineCashEarned;
      state.totalEarnedAllTime += offlineCashEarned;
      state.currentQuarterEarnings += offlineCashEarned;

      // Check if offline hacker attack attempted (if away > 15 minutes)
      if (cappedSeconds > 900 && Math.random() < 0.4) {
        hackerAttackOccurred = true;
        const defenseChance = Math.min(0.95, state.cyberDefenseRating / 100);
        if (Math.random() > defenseChance) {
          hackerBreach = true;
          const stolen = Math.round(state.cash * 0.08);
          state.cash = Math.max(0, state.cash - stolen);
          state.breachesSuffered += 1;
          state.reputation = Math.max(10, state.reputation - 25);
        } else {
          state.successfulDefenses += 1;
        }
      }
    }

    state.lastSaveTimestamp = now;
    return {
      state,
      offlineSeconds: cappedSeconds,
      offlineCashEarned,
      hackerAttackOccurred,
      hackerBreach,
    };
  } catch (e) {
    console.error('Falha ao carregar progresso:', e);
    return null;
  }
}

export function clearGameSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
