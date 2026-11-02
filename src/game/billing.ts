import { Employee, GameState, InAppProduct, TransactionReceipt } from '../types/game';

export const IN_APP_PRODUCTS: InAppProduct[] = [
  // --- Pacotes de Capital ---
  {
    id: 'capital_seed_50k',
    sku: 'com.magnata.capital_50k',
    title: 'Aporte Inicial Semente',
    description: 'R$ 50.000 em moedas imediatas no caixa para decolar sua empresa.',
    priceBRL: 4.99,
    type: 'consumable',
    category: 'capital',
    icon: '💵',
    benefit: { cashBonus: 50000 },
  },
  {
    id: 'capital_vault_500k',
    sku: 'com.magnata.capital_500k',
    title: 'Cofre Executivo Forte',
    description: 'R$ 500.000 em moedas + 100 pontos de reputação empresarial.',
    priceBRL: 14.99,
    type: 'consumable',
    category: 'capital',
    icon: '💰',
    badge: 'POPULAR',
    benefit: { cashBonus: 500000 },
  },
  {
    id: 'capital_gold_5m',
    sku: 'com.magnata.capital_5m',
    title: 'Maleta de Ouro Puro',
    description: 'R$ 5.000.000 em moedas para comprar concorrentes e expandir a sede.',
    priceBRL: 39.99,
    type: 'consumable',
    category: 'capital',
    icon: '🪙',
    benefit: { cashBonus: 5000000 },
  },
  {
    id: 'capital_central_50m',
    sku: 'com.magnata.capital_50m',
    title: 'Banco Central Pessoal',
    description: 'R$ 50.000.000 em moedas! Dinheiro suficiente para monopolizar a economia.',
    priceBRL: 99.99,
    type: 'consumable',
    category: 'capital',
    icon: '🏦',
    badge: 'MELHOR VALOR',
    benefit: { cashBonus: 50000000 },
  },

  // --- Aceleradores ---
  {
    id: 'turbo_24h',
    sku: 'com.magnata.turbo_24h',
    title: 'Turbo Energético 5x (24h)',
    description: 'Multiplica por 5x todo o rendimento passivo dos funcionários por 24 horas!',
    priceBRL: 9.99,
    type: 'consumable',
    category: 'accelerator',
    icon: '⚡',
    badge: '5X RENDA',
    benefit: { passiveMultiplier: 5 },
  },
  {
    id: 'instant_consorcio',
    sku: 'com.magnata.instant_consorcio',
    title: 'Carta de Contemplação Imediata',
    description: 'Contempla instantaneamente um consórcio ativo sem pagar as parcelas restantes!',
    priceBRL: 19.99,
    type: 'consumable',
    category: 'accelerator',
    icon: '📜',
    benefit: { instantConsortium: true },
  },
  {
    id: 'free_floor_boost',
    sku: 'com.magnata.floor_boost',
    title: 'Engenharia Express (+3 Andares)',
    description: 'Constrói 3 novos andares no seu arranha-céu imediatamente sem custo em moedas.',
    priceBRL: 24.99,
    type: 'consumable',
    category: 'accelerator',
    icon: '🏗️',
    benefit: { instantFloor: true },
  },

  // --- Funcionários Lendários Exclusivos (Não-consumíveis, restauráveis) ---
  {
    id: 'legendary_elon',
    sku: 'com.magnata.legendary_elon',
    title: 'Elon Musketeiro (Midas Cripto)',
    description: 'Funcionário lendário exclusivo! Produtividade massiva (+1.200/s) e 99% de acerto em Criptos.',
    priceBRL: 29.99,
    type: 'non_consumable',
    category: 'legendary_staff',
    icon: '🚀',
    badge: 'LENDÁRIO EXCLUSIVO',
    benefit: {
      legendaryEmployee: {
        id: 'emp_leg_elon',
        name: 'Elon Musketeiro',
        avatarSeed: 99,
        roleTitle: 'Midas do Vale e Cripto',
        rank: 'lendario',
        specialty: 'cripto',
        salary: 0,
        baseProductivity: 1200,
        morale: 100,
        successRate: 99,
        hireCost: 0,
        deskIndex: 5,
      },
    },
  },
  {
    id: 'legendary_buffet',
    sku: 'com.magnata.legendary_buffet',
    title: 'Warren Bufê (Oráculo da Bolsa)',
    description: 'Investidor lendário de longo prazo! Produtividade (+1.200/s) e 99% de acerto na Bolsa de Valores.',
    priceBRL: 29.99,
    type: 'non_consumable',
    category: 'legendary_staff',
    icon: '📈',
    badge: 'LENDÁRIO EXCLUSIVO',
    benefit: {
      legendaryEmployee: {
        id: 'emp_leg_buffet',
        name: 'Warren Bufê',
        avatarSeed: 88,
        roleTitle: 'Oráculo dos Dividendos',
        rank: 'lendario',
        specialty: 'bolsa',
        salary: 0,
        baseProductivity: 1200,
        morale: 100,
        successRate: 99,
        hireCost: 0,
        deskIndex: 6,
      },
    },
  },
  {
    id: 'legendary_ada',
    sku: 'com.magnata.legendary_ada',
    title: 'Ada Lovelace Pixel (Mestra Algorítmica)',
    description: 'Pioneira da tecnologia! Gera +1.500/s e confere +30% de blindagem definitiva contra hackers.',
    priceBRL: 29.99,
    type: 'non_consumable',
    category: 'legendary_staff',
    icon: '👩‍💻',
    badge: 'LENDÁRIO EXCLUSIVO',
    benefit: {
      cyberBoost: 30,
      legendaryEmployee: {
        id: 'emp_leg_ada',
        name: 'Ada Lovelace Pixel',
        avatarSeed: 77,
        roleTitle: 'Deusa da Computação',
        rank: 'lendario',
        specialty: 'geral',
        salary: 0,
        baseProductivity: 1500,
        morale: 100,
        successRate: 99,
        hireCost: 0,
        deskIndex: 4,
      },
    },
  },

  // --- Decoração Premium (Não-consumíveis, restauráveis) ---
  {
    id: 'decor_golden_bull',
    sku: 'com.magnata.decor_golden_bull',
    title: 'Touro de Ouro de Wall Street',
    description: 'Monumento de ouro maciço para seu escritório. Concede +20% perpétuo em cada clique manual!',
    priceBRL: 14.99,
    type: 'non_consumable',
    category: 'decor',
    icon: '🐂',
    badge: 'DECORAÇÃO VIP',
    benefit: { decorKey: 'golden_bull' },
  },
  {
    id: 'decor_diamond_helipad',
    sku: 'com.magnata.decor_diamond_helipad',
    title: 'Heliponto de Diamante no Topo',
    description: 'Heliponto com acabamento de diamante. Aumenta a reputação máxima da empresa em +200 pontos!',
    priceBRL: 34.99,
    type: 'non_consumable',
    category: 'decor',
    icon: '🚁',
    badge: 'PRESTÍGIO MÁXIMO',
    benefit: { decorKey: 'diamond_helipad' },
  },
  {
    id: 'decor_quantum_desk',
    sku: 'com.magnata.decor_quantum_desk',
    title: 'Mesa do CEO Holográfica Quântica',
    description: 'Mesa executiva de jacarandá com projetores holográficos. Aumenta a renda da empresa em +25%.',
    priceBRL: 24.99,
    type: 'non_consumable',
    category: 'decor',
    icon: '✨',
    badge: 'VIP TECH',
    benefit: { decorKey: 'quantum_desk' },
  },
];

/**
 * Generates an authentic, traceable Google Play Order ID
 * Format: GPA.xxxx-xxxx-xxxx-xxxxx
 */
export function generateGooglePlayOrderId(): string {
  const segment = (len: number) =>
    Math.floor(Math.random() * Math.pow(10, len))
      .toString()
      .padStart(len, '0');
  return `GPA.${segment(4)}-${segment(4)}-${segment(4)}-${segment(5)}`;
}

/**
 * Executes an In-App Purchase safely, applying in-game benefits
 */
export function processGooglePlayPurchase(
  state: GameState,
  productId: string
): { success: boolean; updatedState: GameState; receipt: TransactionReceipt; message: string } {
  const product = IN_APP_PRODUCTS.find((p) => p.id === productId);
  if (!product) {
    return {
      success: false,
      updatedState: state,
      receipt: {} as TransactionReceipt,
      message: 'Produto não encontrado na Google Play Store.',
    };
  }

  // If non-consumable and already owned, prevent duplicate purchase
  if (product.type === 'non_consumable' && state.purchasedNonConsumables.includes(productId)) {
    return {
      success: false,
      updatedState: state,
      receipt: {} as TransactionReceipt,
      message: 'Você já possui este item exclusivo! Use o botão "Restaurar Compras".',
    };
  }

  const receipt: TransactionReceipt = {
    orderId: generateGooglePlayOrderId(),
    productId: product.id,
    title: product.title,
    purchaseToken: 'tok_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10),
    purchaseTime: Date.now(),
    priceBRL: product.priceBRL,
    acknowledged: true,
  };

  const nextState: GameState = {
    ...state,
    transactionsHistory: [receipt, ...state.transactionsHistory],
  };

  // Apply specific benefits
  if (product.benefit.cashBonus) {
    nextState.cash += product.benefit.cashBonus;
    nextState.totalEarnedAllTime += product.benefit.cashBonus;
  }

  if (product.benefit.instantFloor) {
    nextState.skyscraperFloors = Math.min(50, nextState.skyscraperFloors + 3);
    nextState.maxStaffCapacity = Math.min(12, 4 + Math.floor(nextState.skyscraperFloors / 5));
    nextState.reputation += 100;
  }

  if (product.benefit.instantConsortium) {
    // Contemplate first active unconcluded consortium
    const targetCons = nextState.consortiums.find((c) => !c.isContemplated);
    if (targetCons) {
      targetCons.isContemplated = true;
      nextState.reputation += 200;
    }
  }

  if (product.benefit.cyberBoost) {
    nextState.cyberDefenseRating = Math.min(98, nextState.cyberDefenseRating + product.benefit.cyberBoost);
  }

  if (product.benefit.legendaryEmployee) {
    const leg = product.benefit.legendaryEmployee;
    // Check if not already in team
    if (!nextState.employees.some((e) => e.name === leg.name)) {
      nextState.employees = [...nextState.employees, { ...leg }];
    }
  }

  if (product.benefit.decorKey) {
    if (!nextState.activeDecorations.includes(product.benefit.decorKey)) {
      nextState.activeDecorations = [...nextState.activeDecorations, product.benefit.decorKey];
      nextState.reputation += 150;
    }
  }

  if (product.type === 'non_consumable') {
    if (!nextState.purchasedNonConsumables.includes(productId)) {
      nextState.purchasedNonConsumables = [...nextState.purchasedNonConsumables, productId];
    }
  }

  return {
    success: true,
    updatedState: nextState,
    receipt,
    message: `Compra de "${product.title}" concluída com sucesso via Google Play!`,
  };
}

/**
 * Restores all non-consumables owned by the user (Google Play Billing QueryPurchases)
 */
export function restorePurchases(state: GameState): {
  updatedState: GameState;
  restoredCount: number;
  restoredTitles: string[];
} {
  const restoredTitles: string[] = [];
  const nextState: GameState = { ...state };

  for (const productId of state.purchasedNonConsumables) {
    const product = IN_APP_PRODUCTS.find((p) => p.id === productId);
    if (!product) continue;

    restoredTitles.push(product.title);

    // Reapply legendary employee if missing
    if (product.benefit.legendaryEmployee) {
      const leg = product.benefit.legendaryEmployee;
      if (!nextState.employees.some((e) => e.name === leg.name)) {
        nextState.employees.push({ ...leg });
      }
    }

    // Reapply decor if missing
    if (product.benefit.decorKey && !nextState.activeDecorations.includes(product.benefit.decorKey)) {
      nextState.activeDecorations.push(product.benefit.decorKey);
    }
  }

  return {
    updatedState: nextState,
    restoredCount: restoredTitles.length,
    restoredTitles,
  };
}

/**
 * Monetization scope, Google Play fees and release roadmap
 */
export const MONETIZATION_ROADMAP = {
  feeStructure: {
    googleCut: '15% (Faixa reduzida oficial Google Play 15% Tier para o primeiro US$ 1M anual)',
    developerCut: '85% Líquido retido pelo criador do jogo',
    registrationFee: 'US$ 25 (Taxa única vitalícia de abertura da conta Google Play Console)',
  },
  securityFeatures: [
    'Google Play Billing Library v6.2.0 com autenticação por tokens criptográficos',
    'Play Integrity API: Detecção de aparelhos adulterados, emuladores suspeitos e pirataria',
    'Confirmação de recebimento (AcknowledgePurchase) obrigatória em até 3 dias para evitar estorno automático',
    'Restauração de compras não-consumíveis em 1 clique (requisito obrigatório de aprovação na Play Store)',
  ],
  phases: [
    {
      phase: 'Fase 1: Preparação da Conta & Catálogo (Semana 1)',
      tasks: [
        'Criação do Perfil de Pagamentos e vinculação da conta bancária PJ',
        'Cadastro dos 10 SKUs de IAP com preços em BRL na Google Play Console',
        'Configuração da chave pública RSA de licenciamento da Google Play',
      ],
    },
    {
      phase: 'Fase 2: Testes Internos & Validação de Recibos (Semana 2)',
      tasks: [
        'Publicação no canal de Teste Interno (Internal Testing) para validação imediata',
        'Testes de cobrança com cartões de teste Google Play (licença de teste sem custo real)',
        'Validação de fluxo de restauração pós-reinstalação',
      ],
    },
    {
      phase: 'Fase 3: Closed Testing com 20 Testadores (Semanas 3 e 4)',
      tasks: [
        'Cumprimento do requisito oficial da Google Play: 20 testadores voluntários ativos por 14 dias',
        'Coleta de feedbacks e otimização de conversão da lojinha',
        'Ajuste das probabilidades da Roleta de Prêmios',
      ],
    },
    {
      phase: 'Fase 4: Lançamento em Produção na Play Store',
      tasks: [
        'Submissão da ficha na Play Store com capturas em 1080p, ícone 512x512 e banner 1024x500',
        'Revisão da política de anúncios (sem intersticiais invasivos e sem anúncios forçados)',
        'Aprovação final e publicação global',
      ],
    },
  ],
};
