import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateGooglePlayOrderId,
  processGooglePlayPurchase,
  restorePurchases,
  IN_APP_PRODUCTS,
} from './billing';
import { WHEEL_SECTORS, pickRandomWheelSector, applyWheelReward } from './adsAndWheel';
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
        owned: 0,
        avgBuyPrice: 0,
        description: '',
      },
    ],
    cryptos: [],
    fixedIncomes: [],
    consortiums: [
      {
        id: 'c1',
        name: 'Sede Própria',
        category: 'imovel',
        totalValue: 500000,
        totalInstallments: 50,
        paidInstallments: 5,
        installmentValue: 10000,
        isContemplated: false,
        minBidPercent: 20,
        benefitDescription: '+100 R$/s',
        passiveBonus: 100,
      },
    ],
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

test('generateGooglePlayOrderId generates valid GPA pattern', () => {
  const id = generateGooglePlayOrderId();
  assert.match(id, /^GPA\.\d{4}-\d{4}-\d{4}-\d{5}$/);
});

test('processGooglePlayPurchase correctly credits consumable capital pack', () => {
  const state = createMockState({ cash: 10000 });
  const result = processGooglePlayPurchase(state, 'capital_seed_50k');

  assert.equal(result.success, true);
  assert.equal(result.updatedState.cash, 60000);
  assert.equal(result.updatedState.transactionsHistory.length, 1);
  assert.equal(result.updatedState.transactionsHistory[0].productId, 'capital_seed_50k');
  assert.match(result.receipt.orderId, /^GPA\./);
});

test('processGooglePlayPurchase applies non-consumable legendary staff and prevents duplicates', () => {
  const state = createMockState({ employees: [] });
  const result = processGooglePlayPurchase(state, 'legendary_elon');

  assert.equal(result.success, true);
  assert.ok(result.updatedState.purchasedNonConsumables.includes('legendary_elon'));
  assert.ok(result.updatedState.employees.some((e) => e.name === 'Elon Musketeiro'));

  // Attempt duplicate purchase of non-consumable
  const duplicateResult = processGooglePlayPurchase(result.updatedState, 'legendary_elon');
  assert.equal(duplicateResult.success, false);
  assert.match(duplicateResult.message, /já possui/i);
});

test('processGooglePlayPurchase applies VIP decor and skyscraper boosts', () => {
  const state = createMockState({ skyscraperFloors: 1, activeDecorations: [] });
  const decorResult = processGooglePlayPurchase(state, 'decor_golden_bull');
  assert.equal(decorResult.success, true);
  assert.ok(decorResult.updatedState.activeDecorations.includes('golden_bull'));

  const floorResult = processGooglePlayPurchase(decorResult.updatedState, 'free_floor_boost');
  assert.equal(floorResult.success, true);
  assert.equal(floorResult.updatedState.skyscraperFloors, 4);
});

test('restorePurchases restores missing non-consumables properly', () => {
  // Simulate user switching devices: has 'legendary_buffet' in purchasedNonConsumables, but empty employees list
  const state = createMockState({
    purchasedNonConsumables: ['legendary_buffet', 'decor_quantum_desk'],
    employees: [],
    activeDecorations: [],
  });

  const restore = restorePurchases(state);
  assert.equal(restore.restoredCount, 2);
  assert.ok(restore.updatedState.employees.some((e) => e.name === 'Warren Bufê'));
  assert.ok(restore.updatedState.activeDecorations.includes('quantum_desk'));
});

test('WHEEL_SECTORS contains 6 valid sectors with positive weights', () => {
  assert.equal(WHEEL_SECTORS.length, 6);
  for (const s of WHEEL_SECTORS) {
    assert.ok(s.weight > 0);
    assert.ok(s.label.length > 0);
  }
});

test('applyWheelReward grants cash reward and increments spin count', () => {
  const state = createMockState({ cash: 10000, wheelSpinCount: 0 });
  const cashSector = WHEEL_SECTORS.find((s) => s.type === 'dinheiro')!;
  assert.ok(cashSector, 'Cash sector must exist');
  const result = applyWheelReward(state, cashSector);

  assert.equal(result.updatedState.wheelSpinCount, 1);
  assert.ok(result.updatedState.cash > 10000);
  assert.ok(result.result.description.length > 0);
});
