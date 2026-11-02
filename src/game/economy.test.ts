import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateClickPower,
  calculatePassiveIncomePerSec,
  calculateNetWorth,
  getNextEconomicCycle,
  calculateTaxSeason,
  evaluateHackerAttack,
} from './economy';
import { GameState } from '../types/game';

function createMockState(partial: Partial<GameState> = {}): GameState {
  return {
    version: 1,
    companyName: 'Império Teste',
    origin: 'garagem',
    cash: 10000,
    totalEarnedAllTime: 10000,
    reputation: 500,
    skyscraperFloors: 1,
    economicCycle: 'expansao',
    cycleTimer: 60,
    baseClickValue: 10,
    tapUpgrades: {},
    employees: [],
    maxStaffCapacity: 4,
    stocks: [],
    cryptos: [],
    fixedIncomes: [],
    consortiums: [],
    physicalAssets: [],
    competitors: [],
    cyberUpgrades: {},
    cyberDefenseRating: 50,
    lastHackerAttackTimestamp: 0,
    hackerAttackUnderway: false,
    hackerTimerRemaining: 0,
    loans: [],
    currentQuarterEarnings: 20000,
    taxSeasonActive: false,
    taxesPending: 0,
    partnerships: [],
    achievements: [],
    newsFeed: [],
    totalClicks: 0,
    successfulDefenses: 0,
    breachesSuffered: 0,
    purchasedNonConsumables: [],
    transactionsHistory: [],
    wheelSpinCount: 0,
    lastWheelSpinTimestamp: 0,
    totalAdsWatched: 0,
    marketTips: [],
    pendingOfflineRewards: [],
    activeDecorations: [],
    temporaryEmployees: [],
    temporaryDefenseBoost: null,
    lastSaveTimestamp: Date.now(),
    ...partial,
  };
}

test('calculateClickPower accounts for business origin and upgrades', () => {
  const stateGaragem = createMockState({ origin: 'garagem', baseClickValue: 10 });
  const clickGaragem = calculateClickPower(stateGaragem);
  // Garagem has 1.25 clickBonus => 10 * 1.25 = 13 (rounded)
  assert.equal(clickGaragem, 13);

  const stateLojinha = createMockState({ origin: 'lojinha', baseClickValue: 10 });
  const clickLojinha = calculateClickPower(stateLojinha);
  // Lojinha has 1.5 clickBonus => 10 * 1.5 = 15
  assert.equal(clickLojinha, 15);

  // With upgrade level 1 (1.5x)
  const stateWithUpgrade = createMockState({
    origin: 'lojinha',
    baseClickValue: 10,
    tapUpgrades: { cafe_turbinado: 1 },
  });
  const clickUpgraded = calculateClickPower(stateWithUpgrade);
  // 10 * 1.5 * 1.5 = 22.5 => 23
  assert.equal(clickUpgraded, 23);
});

test('calculatePassiveIncomePerSec sums employees and asset yields', () => {
  const state = createMockState({
    origin: 'garagem',
    skyscraperFloors: 1,
    employees: [
      {
        id: 'e1',
        name: 'Carlos',
        avatarSeed: 1,
        roleTitle: 'Analista',
        rank: 'junior', // 2.2x
        specialty: 'geral',
        salary: 100,
        baseProductivity: 10,
        morale: 100,
        successRate: 50,
        hireCost: 500,
        deskIndex: 0,
      },
      {
        id: 'e2',
        name: 'Ana',
        avatarSeed: 2,
        roleTitle: 'Especialista',
        rank: 'especialista', // 12x * 1.5 specialty
        specialty: 'bolsa',
        salary: 500,
        baseProductivity: 20,
        morale: 100,
        successRate: 85,
        hireCost: 2500,
        deskIndex: 1,
      },
    ],
  });

  const income = calculatePassiveIncomePerSec(state);
  // e1: 10 * 2.2 * 1 * 1 = 22
  // e2: 20 * 12 * 1 * 1.5 = 360
  // Total = 382
  assert.equal(income, 382);
});

test('calculateNetWorth correctly sums all portfolio components and subtracts debt', () => {
  const state = createMockState({
    cash: 5000,
    stocks: [
      {
        id: 'uoog',
        ticker: 'UOOG',
        name: 'Uoogle',
        sector: 'Tech',
        price: 200,
        initialPrice: 200,
        priceHistory: [200],
        dividendYield: 0.02,
        volatility: 0.05,
        owned: 10, // R$ 2,000
        avgBuyPrice: 180,
        description: '',
      },
    ],
    cryptos: [
      {
        id: 'btg',
        symbol: 'BTG',
        name: 'Bitouro',
        price: 100000,
        initialPrice: 100000,
        priceHistory: [100000],
        volatility: 0.2,
        owned: 0.1, // R$ 10,000
        avgBuyPrice: 90000,
        description: '',
      },
    ],
    loans: [
      {
        id: 'l1',
        name: 'Empréstimo',
        amount: 3000,
        monthlyInterest: 0.02,
        totalOwed: 3000, // -3,000
        remainingMonths: 6,
        minReputation: 0,
      },
    ],
  });

  // Net worth = 5000 + 2000 + 10000 - 3000 = 14000
  const netWorth = calculateNetWorth(state);
  assert.equal(netWorth, 14000);
});

test('getNextEconomicCycle cycles properly', () => {
  assert.equal(getNextEconomicCycle('expansao'), 'aquecimento');
  assert.equal(getNextEconomicCycle('aquecimento'), 'recessao');
  assert.equal(getNextEconomicCycle('recessao'), 'recuperacao');
  assert.equal(getNextEconomicCycle('recuperacao'), 'expansao');
});

test('calculateTaxSeason reports correct liabilities and evasion risks', () => {
  const earnings = 100000;
  const fullReport = calculateTaxSeason(earnings, 100);
  assert.equal(fullReport.actualLiability, 15000);
  assert.equal(fullReport.declaredLiability, 15000);
  assert.equal(fullReport.taxEvaded, 0);
  assert.equal(fullReport.auditChance, 0);
  assert.equal(fullReport.audited, false);
  assert.equal(fullReport.reputationReward, 50);

  const partialReport = calculateTaxSeason(earnings, 50);
  assert.equal(partialReport.actualLiability, 15000);
  assert.equal(partialReport.declaredLiability, 7500);
  assert.equal(partialReport.taxEvaded, 7500);
  assert.ok(partialReport.auditChance > 0);
});

test('evaluateHackerAttack returns valid defense or damage data', () => {
  const result = evaluateHackerAttack(80, 50000);
  assert.equal(typeof result.defended, 'boolean');
  if (!result.defended) {
    assert.ok(result.cashStolen > 0);
    assert.ok(result.moraleLoss > 0);
  } else {
    assert.equal(result.cashStolen, 0);
  }
});
