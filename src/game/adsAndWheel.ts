import { Employee, GameState, MarketTip, WheelRewardResult, WheelSector } from '../types/game';
import { FIRST_NAMES, LAST_NAMES } from './constants';

export const WHEEL_SECTORS: WheelSector[] = [
  {
    id: 'sec_dinheiro_mega',
    label: 'Dinheiro no Caixa',
    type: 'dinheiro',
    icon: '💵',
    color: '#10b981', // Emerald
    textColor: '#ffffff',
    description: 'Um montante gordo de moedas creditado na hora no caixa da empresa.',
    weight: 25,
  },
  {
    id: 'sec_acelerador',
    label: 'Redução de Tempo',
    type: 'acelerador',
    icon: '⚡',
    color: '#f59e0b', // Amber
    textColor: '#1e293b',
    description: 'Antecipa parcelas de consórcio ou adianta o ciclo de expansão.',
    weight: 18,
  },
  {
    id: 'sec_previsao',
    label: 'Dica de Mercado',
    type: 'dica_mercado',
    icon: '📊',
    color: '#3b82f6', // Blue
    textColor: '#ffffff',
    description: 'Informação privilegiada de qual ação ou cripto vai disparar nas próximas rodadas.',
    weight: 18,
  },
  {
    id: 'sec_seguranca',
    label: 'Blindagem Cyber',
    type: 'seguranca',
    icon: '🛡️',
    color: '#06b6d4', // Cyan
    textColor: '#ffffff',
    description: 'Reforço de segurança que concede +25% de proteção digital contra hackers por 10 minutos.',
    weight: 15,
  },
  {
    id: 'sec_caixa_surpresa',
    label: 'Caixa Surpresa',
    type: 'caixa_surpresa',
    icon: '🎁',
    color: '#a855f7', // Purple
    textColor: '#ffffff',
    description: 'Bônus especial: lote grátis de ações da Uoogle, aporte em Renda Fixa ou lance grátis.',
    weight: 14,
  },
  {
    id: 'sec_funcionario_temp',
    label: 'Especialista 24h',
    type: 'funcionario_temp',
    icon: '👨‍💼',
    color: '#ec4899', // Pink
    textColor: '#ffffff',
    description: 'Um funcionário sênior/especialista que trabalha por 24h sem receber nenhum salário!',
    weight: 10,
  },
];

/**
 * Selects a sector based on defined weights
 */
export function pickRandomWheelSector(): WheelSector {
  const totalWeight = WHEEL_SECTORS.reduce((acc, s) => acc + s.weight, 0);
  let random = Math.random() * totalWeight;

  for (const sector of WHEEL_SECTORS) {
    if (random < sector.weight) {
      return sector;
    }
    random -= sector.weight;
  }
  return WHEEL_SECTORS[0];
}

/**
 * Applies the won reward to GameState and returns formatted message
 */
export function applyWheelReward(
  state: GameState,
  sector: WheelSector
): { updatedState: GameState; result: WheelRewardResult } {
  const next: GameState = {
    ...state,
    wheelSpinCount: state.wheelSpinCount + 1,
    lastWheelSpinTimestamp: Date.now(),
    totalAdsWatched: state.totalAdsWatched + 1,
  };

  let title = '';
  let description = '';

  switch (sector.type) {
    case 'dinheiro': {
      // Scales with total earned so it remains relevant across all game stages
      const baseGain = Math.max(5000, Math.round(state.cash * 0.25 + 5000));
      const variation = Math.round(baseGain * (0.8 + Math.random() * 0.4));
      next.cash += variation;
      next.totalEarnedAllTime += variation;
      title = `+R$ ${variation.toLocaleString('pt-BR')} no Caixa!`;
      description = 'O dinheiro foi transferido diretamente para o saldo da sua empresa.';
      break;
    }

    case 'acelerador': {
      // Reduce consortium installments or advance cycle
      const activeCons = next.consortiums.find((c) => !c.isContemplated);
      if (activeCons) {
        activeCons.paidInstallments = Math.min(activeCons.totalInstallments, activeCons.paidInstallments + 3);
        title = `Aceleração de Consórcio (+3 Parcelas Pagas)!`;
        description = `O consórcio "${activeCons.name}" teve 3 parcelas quitadas gratuitamente!`;
      } else {
        next.cash += 15000;
        next.totalEarnedAllTime += 15000;
        title = `Bônus de Expansão (+R$ 15.000)!`;
        description = 'Seus projetos avançaram no tempo com sucesso.';
      }
      break;
    }

    case 'dica_mercado': {
      // Pick random stock and set a prediction tip
      const randomStock = next.stocks[Math.floor(Math.random() * next.stocks.length)] || next.stocks[0];
      const tip: MarketTip = {
        id: 'tip_' + Date.now(),
        ticker: randomStock.ticker,
        text: `Relatório confidencial: Ações de ${randomStock.name} (${randomStock.ticker}) vão subir forte nas próximas rodadas!`,
        predictedChange: 35,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      };
      next.marketTips = [tip, ...next.marketTips.slice(0, 2)];
      // Also give a 10% price pump directly to reward the player
      randomStock.price = Math.round(randomStock.price * 1.15 * 100) / 100;
      randomStock.priceHistory = [...randomStock.priceHistory.slice(-15), randomStock.price];
      title = `Dica de Ouro: ${randomStock.ticker} em Alta!`;
      description = `Analistas apontam forte valorização de ${randomStock.name}. O preço já começou a reagir!`;
      break;
    }

    case 'seguranca': {
      const boostPercent = 25;
      const durationMs = 10 * 60 * 1000; // 10 min
      next.temporaryDefenseBoost = {
        percent: boostPercent,
        expiresAt: Date.now() + durationMs,
      };
      next.cyberDefenseRating = Math.min(99, next.cyberDefenseRating + boostPercent);
      title = `Blindagem Cibernética Ativada (+25%)!`;
      description = 'Seu sistema corporativo está protegido contra invasores pelos próximos 10 minutos.';
      break;
    }

    case 'caixa_surpresa': {
      // Lottery between: 15 shares of Uoogle, R$ 20.000 in Fixed Income, or +150 Reputation
      const roll = Math.random();
      if (roll < 0.4) {
        const uoog = next.stocks.find((s) => s.ticker === 'UOOG');
        if (uoog) {
          uoog.owned += 10;
          title = 'Caixa Surpresa: 10 Ações da Uoogle!';
          description = 'Você recebeu um lote de 10 ações gratuitas da Uoogle Search Inc. diretamente na sua carteira.';
        }
      } else if (roll < 0.75) {
        const cdb = next.fixedIncomes[0];
        if (cdb) {
          cdb.investedAmount += 10000;
          title = 'Caixa Surpresa: R$ 10.000 em CDB Neon!';
          description = 'Um aporte de R$ 10.000 foi depositado no seu CDB de liquidez com juros garantidos.';
        }
      } else {
        next.reputation += 120;
        title = 'Caixa Surpresa: +120 Pontos de Reputação!';
        description = 'Sua empresa recebeu destaque positivo na capa da revista Exame Retrô.';
      }
      break;
    }

    case 'funcionario_temp': {
      const fName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const tempStaff: Employee & { expiresAt: number } = {
        id: 'emp_temp_' + Date.now(),
        name: `${fName} ${lName} (Consultor)`,
        avatarSeed: Math.floor(Math.random() * 50),
        roleTitle: 'Especialista Convidado 24h',
        rank: 'especialista',
        specialty: 'bolsa',
        salary: 0,
        baseProductivity: 35,
        morale: 100,
        successRate: 85,
        hireCost: 0,
        deskIndex: 3,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      next.temporaryEmployees = [...next.temporaryEmployees, tempStaff];
      title = `Novo Especialista: ${tempStaff.name}!`;
      description = 'Um consultor sênior de alto nível se juntou ao seu escritório para trabalhar sem salário pelas próximas 24h.';
      break;
    }
  }

  const result: WheelRewardResult = {
    sectorId: sector.id,
    type: sector.type,
    title,
    description,
    timestamp: Date.now(),
  };

  return {
    updatedState: next,
    result,
  };
}
