import {
  EconomicCycle,
  Employee,
  GameState,
  StaffRank,
} from '../types/game';
import { BUSINESS_ORIGINS, INITIAL_TAP_UPGRADES } from './constants';

export const RANK_MULTIPLIERS: Record<StaffRank, number> = {
  estagiario: 1.0,
  junior: 2.2,
  senior: 5.0,
  especialista: 12.0,
  lendario: 30.0,
};

export const RANK_LABELS: Record<StaffRank, string> = {
  estagiario: 'Estagiário',
  junior: 'Júnior',
  senior: 'Sênior',
  especialista: 'Especialista',
  lendario: 'Lendário',
};

export const SPECIALTY_LABELS: Record<string, string> = {
  geral: 'Geral & Apoio',
  bolsa: 'Bolsa de Valores',
  cripto: 'Criptomoedas',
  renda_fixa: 'Renda Fixa',
  consorcio: 'Consórcios & Bens',
};

/**
 * Calculates manual click power (R$ per tap)
 */
export function calculateClickPower(state: GameState): number {
  let multiplier = 1.0;
  
  // Origin bonus
  const origin = BUSINESS_ORIGINS.find((o) => o.id === state.origin);
  if (origin) {
    multiplier *= origin.clickBonus;
  }

  // Upgrades
  for (const up of INITIAL_TAP_UPGRADES) {
    const level = state.tapUpgrades[up.id] || 0;
    if (level > 0) {
      multiplier *= Math.pow(up.multiplierPerLevel, level);
    }
  }

  // Skyscraper bonus (+5% per floor)
  multiplier *= 1 + (state.skyscraperFloors - 1) * 0.05;

  // VIP Decoration: Touro de Ouro (+20% em todos os cliques)
  if (state.activeDecorations && state.activeDecorations.includes('golden_bull')) {
    multiplier *= 1.20;
  }

  // Plano VIP Bonus (+20% nos ganhos)
  if (state.plan === 'VIP') {
    multiplier *= 1.20;
  }

  return Math.max(1, Math.round(state.baseClickValue * multiplier));
}

/**
 * Calculates passive revenue per second (R$/s)
 */
export function calculatePassiveIncomePerSec(state: GameState): number {
  let totalPerSec = 0;

  // Origin passive multiplier
  const origin = BUSINESS_ORIGINS.find((o) => o.id === state.origin);
  const originMultiplier = origin ? origin.passiveBonus : 1.0;

  // Check Service Equipment boosts
  const cafeteiraOwned = state.serviceEquipments?.some((e) => e.id === 'cafeteira_automatica' && e.owned);
  const maquinaOwned = state.serviceEquipments?.some((e) => e.id === 'maquina_doacoes' && e.owned);
  const pcsUltraOwned = state.serviceEquipments?.some((e) => e.id === 'computadores_ultra' && e.owned);

  const teamBoost = cafeteiraOwned ? 1.10 : 1.0;
  const expertBoost = pcsUltraOwned ? 1.15 : 1.0;

  // 1. Regular employees productivity
  for (const emp of state.employees) {
    const rankMult = RANK_MULTIPLIERS[emp.rank] || 1.0;
    const moraleMult = Math.max(0.3, emp.morale / 100);
    // Specialists have a 1.5x global multiplier
    const specBonus = emp.specialty !== 'geral' ? 1.5 * expertBoost : 1.0;
    totalPerSec += emp.baseProductivity * rankMult * moraleMult * specBonus * teamBoost;
  }

  // 1.1 Service Equipment: Máquina de Doações (+R$ 50/s)
  if (maquinaOwned) {
    totalPerSec += 50;
  }

  // 1.2 Temporary employees (from Wheel of Fortune, zero salary, 100% morale)
  if (state.temporaryEmployees) {
    for (const temp of state.temporaryEmployees) {
      if (temp.expiresAt > Date.now()) {
        totalPerSec += temp.baseProductivity * 12.0 * 1.5; // Specialist level
      }
    }
  }

  // 2. Physical assets (bens físicos)
  for (const asset of state.physicalAssets) {
    if (asset.level > 0) {
      totalPerSec += asset.monthlyRevenue * asset.level;
    }
  }

  // 3. Competitor Monopolies
  for (const comp of state.competitors) {
    if (comp.acquired) {
      totalPerSec += comp.monopolyRevenue;
    }
  }

  // 4. Contemplated Consortiums
  for (const cons of state.consortiums) {
    if (cons.isContemplated) {
      totalPerSec += cons.passiveBonus;
    }
  }

  // 5. Active Partnerships
  for (const part of state.partnerships) {
    if (part.active) {
      totalPerSec += part.monthlyRevenue;
    }
  }

  // 6. Skyscraper floor prestige (+10% per floor above 1)
  const skyscraperMult = 1 + (state.skyscraperFloors - 1) * 0.1;

  totalPerSec = totalPerSec * originMultiplier * skyscraperMult;

  // VIP Decoration: Mesa Holográfica Quântica (+25% em toda a renda)
  if (state.activeDecorations && state.activeDecorations.includes('quantum_desk')) {
    totalPerSec *= 1.25;
  }

  // Plano VIP Bonus (+20% em todos os ganhos passivos)
  if (state.plan === 'VIP') {
    totalPerSec *= 1.20;
  }

  // Less monthly loans interest deducted proportionally
  let interestPerSec = 0;
  for (const loan of state.loans) {
    interestPerSec += (loan.totalOwed * loan.monthlyInterest) / 30;
  }

  return Math.max(0, Math.round(totalPerSec - interestPerSec));
}

/**
 * Calculates total Net Worth (Patrimônio Líquido Total)
 */
export function calculateNetWorth(state: GameState): number {
  let net = state.cash;

  // Stocks
  for (const st of state.stocks) {
    net += st.owned * st.price;
  }

  // Cryptos
  for (const cr of state.cryptos) {
    net += cr.owned * cr.price;
  }

  // Fixed Income
  for (const fi of state.fixedIncomes) {
    net += fi.investedAmount + fi.accumulatedYield;
  }

  // Consortiums (value of equity paid)
  for (const co of state.consortiums) {
    net += co.paidInstallments * co.installmentValue;
  }

  // Physical Assets
  for (const pa of state.physicalAssets) {
    if (pa.level > 0) {
      net += pa.cost * pa.level;
    }
  }

  // Competitor acquisitions value
  for (const comp of state.competitors) {
    if (comp.acquired) {
      net += comp.cost;
    }
  }

  // Subtract bank loan debts
  for (const loan of state.loans) {
    net -= loan.totalOwed;
  }

  return Math.round(net);
}

/**
 * Cycles the macro economy
 */
export function getNextEconomicCycle(current: EconomicCycle): EconomicCycle {
  switch (current) {
    case 'expansao':
      return 'aquecimento';
    case 'aquecimento':
      return 'recessao';
    case 'recessao':
      return 'recuperacao';
    case 'recuperacao':
      return 'expansao';
  }
}

/**
 * Returns economic cycle metadata
 */
export function getEconomicCycleInfo(cycle: EconomicCycle) {
  switch (cycle) {
    case 'expansao':
      return {
        label: 'Expansão Econômica',
        description: 'Mercado em ascensão! Ações e consumo em alta. Ótimo momento geral.',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-950/60 border-emerald-500/40',
        badge: '📈 EXPANSÃO',
        stockFactor: 1.03,
        cryptoFactor: 1.05,
        fixedIncomeFactor: 1.0,
      };
    case 'aquecimento':
      return {
        label: 'Superaquecimento / Boom',
        description: 'Especulação alta e euforia! Criptos disparam, mas risco de bolha.',
        color: 'text-amber-400',
        bgColor: 'bg-amber-950/60 border-amber-500/40',
        badge: '🔥 AQUECIMENTO',
        stockFactor: 1.05,
        cryptoFactor: 1.15,
        fixedIncomeFactor: 0.98,
      };
    case 'recessao':
      return {
        label: 'Recessão de Mercado',
        description: 'Queda na Bolsa e nas Criptos. Renda Fixa é o refúgio mais seguro!',
        color: 'text-rose-400',
        bgColor: 'bg-rose-950/60 border-rose-500/40',
        badge: '❄️ RECESSÃO',
        stockFactor: 0.94,
        cryptoFactor: 0.85,
        fixedIncomeFactor: 1.08,
      };
    case 'recuperacao':
      return {
        label: 'Recuperação & Oportunidade',
        description: 'Preços em patamares baixos. Excelente hora para comprar ativos baratos.',
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-950/60 border-cyan-500/40',
        badge: '🌱 RECUPERAÇÃO',
        stockFactor: 1.02,
        cryptoFactor: 1.04,
        fixedIncomeFactor: 1.01,
      };
  }
}

/**
 * Calculates Corporate Taxes
 */
export function calculateTaxSeason(earnings: number, reportedPercent: number) {
  const actualLiability = Math.max(0, Math.round(earnings * 0.15));
  const declaredLiability = Math.round(actualLiability * (reportedPercent / 100));
  const taxEvaded = actualLiability - declaredLiability;

  // If reported 100%, 0 audit chance
  let auditChance = 0;
  if (reportedPercent < 100) {
    // Audit chance scales exponentially with evasion
    auditChance = Math.min(0.85, (100 - reportedPercent) / 100 * 0.7 + 0.15);
  }

  const audited = Math.random() < auditChance;
  const fine = audited ? Math.round(taxEvaded * 1.5 + actualLiability * 0.2) : 0;
  const reputationPenalty = audited ? Math.min(100, Math.round((100 - reportedPercent) * 1.2)) : 0;
  const reputationReward = reportedPercent === 100 ? 50 : 0;

  return {
    actualLiability,
    declaredLiability,
    taxEvaded,
    auditChance,
    audited,
    fine,
    reputationPenalty,
    reputationReward,
  };
}

/**
 * Evaluates Hacker Attack Result based on defense rating
 */
export function evaluateHackerAttack(defenseRating: number, currentCash: number) {
  // Defense rating 0 - 100
  const successChance = Math.min(0.96, Math.max(0.15, defenseRating / 100));
  const defended = Math.random() < successChance;

  if (defended) {
    return {
      defended: true,
      cashStolen: 0,
      moraleLoss: 0,
      reputationLoss: 0,
    };
  } else {
    // Stolen 8% to 18% of cash
    const stealRate = 0.08 + Math.random() * 0.10;
    const cashStolen = Math.round(currentCash * stealRate);
    return {
      defended: false,
      cashStolen,
      moraleLoss: 25,
      reputationLoss: 35,
    };
  }
}
