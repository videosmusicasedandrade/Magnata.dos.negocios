import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OFFLINE_BRAZILIAN_CEOS_SEED,
  computeTop100Leaderboard,
  updatePlayerCeoProfile,
  exportFirebaseRealtimeDbJson,
  RTDB_LEADERBOARD_PATH,
} from './leaderboard';
import { createInitialGameState } from './storage';

test('OFFLINE_BRAZILIAN_CEOS_SEED has 99 entries with Brazilian full names (first and last name)', () => {
  assert.strictEqual(OFFLINE_BRAZILIAN_CEOS_SEED.length, 99);

  for (const ceo of OFFLINE_BRAZILIAN_CEOS_SEED) {
    assert.ok(ceo.id.startsWith('ceo_br_'), `ID should have prefix: ${ceo.id}`);
    
    // Check first name + last name
    const nameParts = ceo.ceoName.trim().split(/\s+/);
    assert.ok(
      nameParts.length >= 2,
      `CEO "${ceo.ceoName}" must contain both first and last name (found ${nameParts.length} parts)`
    );

    assert.ok(ceo.companyName.length > 2, `Company name must be valid: ${ceo.companyName}`);
    assert.ok(ceo.netWorth > 0, `Net worth must be positive for ${ceo.ceoName}`);
    assert.ok(ceo.sector.length > 2, `Sector must be valid for ${ceo.ceoName}`);
    assert.ok(ceo.state.length === 2, `Brazilian state must be 2-letter abbreviation for ${ceo.ceoName}`);
    assert.ok(ceo.biography.length > 5, `Biography must exist for ${ceo.ceoName}`);
  }
});

test('computeTop100Leaderboard correctly computes ranking for a starting player', () => {
  const gameState = createInitialGameState('garagem');
  // Starting cash is R$ 250
  const result = computeTop100Leaderboard(gameState);

  assert.strictEqual(result.leaderboard.length, 100);
  assert.strictEqual(result.totalCeos, 100);
  assert.ok(result.playerRank >= 90, `Starting player should be near the bottom rank, got: ${result.playerRank}`);
  assert.strictEqual(result.playerEntry.isPlayer, true);
  assert.ok(result.nextCeoToBeat !== null, 'Player should have a rival above them');
  assert.ok(result.diffToNextRank > 0, 'Difference to next rank should be positive');
});

test('computeTop100Leaderboard ranks player #1 when player becomes the top Brazilian magnate', () => {
  const gameState = createInitialGameState('fabrica');
  // Give player R$ 300 bilhões (surpasses #1 Jorge Paulo Guimarães with R$ 215B)
  gameState.cash = 300_000_000_000;

  const result = computeTop100Leaderboard(gameState);

  assert.strictEqual(result.playerRank, 1, 'Player should be ranked #1');
  assert.strictEqual(result.leaderboard[0].isPlayer, true);
  assert.strictEqual(result.nextCeoToBeat, null, 'Rank 1 has no rival above them');
  assert.strictEqual(result.diffToNextRank, 0);
  assert.strictEqual(result.top10[0].isPlayer, true);
});

test('computeTop100Leaderboard ranks player accurately in middle tiers', () => {
  const gameState = createInitialGameState('garagem');
  // Give player R$ 100.000.000 (R$ 100 milhões)
  gameState.cash = 100_000_000;

  const result = computeTop100Leaderboard(gameState);

  assert.ok(result.playerRank > 50 && result.playerRank < 75, `Rank should be around 55-70, got ${result.playerRank}`);
  assert.ok(result.nextCeoToBeat !== null);
  assert.ok(result.nextCeoToBeat.netWorth > result.playerEntry.netWorth);
  assert.strictEqual(result.diffToNextRank, result.nextCeoToBeat.netWorth - result.playerEntry.netWorth);
});

test('updatePlayerCeoProfile updates CEO and company names', () => {
  const gameState = createInitialGameState('garagem');
  const updated = updatePlayerCeoProfile(gameState, 'Carlos Drumond Andrade', 'Empório Brasil S.A.');

  assert.strictEqual(updated.ceoName, 'Carlos Drumond Andrade');
  assert.strictEqual(updated.companyName, 'Empório Brasil S.A.');
});

test('exportFirebaseRealtimeDbJson returns valid Firebase Realtime Database schema', () => {
  const gameState = createInitialGameState('garagem');
  const jsonStr = exportFirebaseRealtimeDbJson(gameState);
  const parsed = JSON.parse(jsonStr);

  assert.strictEqual(parsed.ref, RTDB_LEADERBOARD_PATH);
  assert.strictEqual(parsed.syncedOffline, true);
  assert.strictEqual(typeof parsed.updatedAt, 'number');
  assert.strictEqual(Object.keys(parsed.entries).length, 100);
});
