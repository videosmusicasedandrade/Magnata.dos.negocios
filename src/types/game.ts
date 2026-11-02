export type BusinessOriginId = 'lojinha' | 'garagem' | 'fabrica';

export interface BusinessOrigin {
  id: BusinessOriginId;
  name: string;
  tagline: string;
  description: string;
  initialBonus: string;
  clickBonus: number; // multiplier
  passiveBonus: number;
  startingCash: number;
  icon: string;
}

export type StaffRank = 'estagiario' | 'junior' | 'senior' | 'especialista' | 'lendario';

export type StaffSpecialty = 'geral' | 'bolsa' | 'cripto' | 'renda_fixa' | 'consorcio';

export interface Employee {
  id: string;
  name: string;
  avatarSeed: number; // pixel look
  roleTitle: string;
  rank: StaffRank;
  specialty: StaffSpecialty;
  salary: number; // monthly / periodic cost
  baseProductivity: number; // R$/s
  morale: number; // 0 - 100
  successRate: number; // 0 - 100% bonus in investments
  hireCost: number;
  deskIndex: number;
}

export type AssetCategory = 'bolsa' | 'cripto' | 'renda_fixa' | 'consorcio';

export interface StockAsset {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  price: number;
  initialPrice: number;
  priceHistory: number[];
  dividendYield: number; // annual % paid periodically
  volatility: number;
  owned: number;
  avgBuyPrice: number;
  description: string;
}

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  initialPrice: number;
  priceHistory: number[];
  volatility: number; // high swings
  owned: number;
  avgBuyPrice: number;
  description: string;
}

export interface FixedIncomeAsset {
  id: string;
  name: string;
  category: 'CDB' | 'Tesouro' | 'LCI' | 'LCA' | 'Debênture';
  annualRate: number; // e.g. 0.12 = 12% a.a.
  minimumInvestment: number;
  investedAmount: number;
  accumulatedYield: number;
  maturityMonths: number;
  description: string;
}

export interface ConsortiumAsset {
  id: string;
  name: string;
  category: 'imovel' | 'filial' | 'computadores' | 'veiculos' | 'jatinho';
  totalValue: number;
  totalInstallments: number;
  paidInstallments: number;
  installmentValue: number;
  isContemplated: boolean;
  minBidPercent: number; // % to place bid
  benefitDescription: string;
  passiveBonus: number; // added to income once contemplated
}

export interface PhysicalAsset {
  id: string;
  name: string;
  type: 'imovel' | 'agro' | 'frota' | 'tech' | 'luxo';
  cost: number;
  monthlyRevenue: number;
  level: number;
  maxLevel: number;
  upgradeCost: number;
  description: string;
  icon: string;
}

export interface CompetitorCompany {
  id: string;
  name: string;
  sector: string;
  cost: number;
  acquired: boolean;
  monopolyRevenue: number; // R$/s
  description: string;
}

export interface CyberUpgrade {
  id: string;
  name: string;
  cost: number;
  level: number;
  maxLevel: number;
  defenseBoost: number; // +% defense
  description: string;
  icon: string;
}

export interface BankLoan {
  id: string;
  name: string;
  amount: number;
  monthlyInterest: number; // e.g. 0.03 = 3% per month
  totalOwed: number;
  remainingMonths: number;
  minReputation: number;
}

export type EconomicCycle = 'expansao' | 'aquecimento' | 'recessao' | 'recuperacao';

export interface NewsItem {
  id: string;
  title: string;
  impactText: string;
  targetCategory: AssetCategory | 'macro' | 'geral';
  targetAssetId?: string;
  priceMultiplier: number;
  timestamp: number;
}

export interface StrategicDilemma {
  id: string;
  title: string;
  description: string;
  situation: string;
  optionA: {
    label: string;
    description: string;
    effect: {
      cash?: number;
      reputation?: number;
      morale?: number;
      passiveMultiplier?: number;
    };
  };
  optionB: {
    label: string;
    description: string;
    effect: {
      cash?: number;
      reputation?: number;
      morale?: number;
      passiveMultiplier?: number;
    };
  };
}

export interface PartnerContract {
  id: string;
  name: string;
  partnerName: string;
  minReputation: number;
  durationMonths: number;
  remainingMonths: number;
  monthlyRevenue: number;
  active: boolean;
  missionDescription: string;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'dinheiro' | 'investimentos' | 'equipe' | 'arranha_ceu' | 'reputacao';
  rewardCash: number;
  rewardPrestige: number;
  unlocked: boolean;
  icon: string;
  progress: number;
  maxProgress: number;
}

export interface TapUpgrade {
  id: string;
  name: string;
  cost: number;
  level: number;
  multiplierPerLevel: number;
  description: string;
  icon: string;
}

export type InAppProductType = 'consumable' | 'non_consumable';
export type InAppProductCategory = 'capital' | 'accelerator' | 'legendary_staff' | 'decor';

export interface InAppProduct {
  id: string;
  sku: string;
  title: string;
  description: string;
  priceBRL: number; // Preço na Play Store (R$)
  type: InAppProductType;
  category: InAppProductCategory;
  icon: string;
  badge?: string;
  benefit: {
    cashBonus?: number;
    passiveMultiplier?: number;
    instantFloor?: boolean;
    instantConsortium?: boolean;
    legendaryEmployee?: Employee;
    decorKey?: string;
    cyberBoost?: number;
  };
}

export interface TransactionReceipt {
  orderId: string;
  productId: string;
  title: string;
  purchaseToken: string;
  purchaseTime: number;
  priceBRL: number;
  acknowledged: boolean;
}

export type WheelRewardType =
  | 'dinheiro'
  | 'acelerador'
  | 'dica_mercado'
  | 'seguranca'
  | 'caixa_surpresa'
  | 'funcionario_temp';

export interface WheelSector {
  id: string;
  label: string;
  type: WheelRewardType;
  icon: string;
  color: string;
  textColor: string;
  description: string;
  weight: number;
}

export interface WheelRewardResult {
  sectorId: string;
  type: WheelRewardType;
  title: string;
  description: string;
  timestamp: number;
  data?: any;
}

export interface PendingOfflineReward {
  id: string;
  reward: WheelRewardResult;
  claimed: boolean;
}

export interface MarketTip {
  id: string;
  ticker: string;
  text: string;
  predictedChange: number; // e.g. +35%
  expiresAt: number;
}

export type PlanType = 'VIP' | 'COMUM';

export type ServiceEquipmentId =
  | 'cafeteira_automatica'
  | 'maquina_doacoes'
  | 'computadores_ultra'
  | 'cadeiras_ergonomicas'
  | 'laboratorio_treino';

export interface ServiceEquipment {
  id: ServiceEquipmentId;
  name: string;
  category: 'servico';
  cost: number;
  owned: boolean;
  icon: string;
  description: string;
  benefitText: string;
  teamProductivityBoost?: number; // e.g. 0.10 (+10%)
  passiveCashPerSec?: number; // e.g. 50 (R$/s)
  expertBonusMultiplier?: number; // e.g. 0.15 (+15%)
  moraleRecoveryMultiplier?: number; // e.g. 2.0 (2x)
  trainingCostDiscount?: number; // e.g. 0.25 (25% off)
}

export interface FloorConstructionState {
  targetFloor: number;
  realSecondsRemaining: number;
  totalRealSeconds: number;
  cost: number;
  startedAtTimestamp: number;
}

export interface GameState {
  version: number;
  companyName: string;
  ceoName?: string;
  origin: BusinessOriginId;
  cash: number;
  totalEarnedAllTime: number;
  reputation: number; // 0 to 1000
  skyscraperFloors: number; // 1 to 50

  // Plan Management (Gear Settings)
  plan: PlanType; // 'VIP' | 'COMUM' (defaults to 'VIP')

  // Real-Time ↔ Game-Time System
  gameTimeSeconds: number; // Accumulated in-game time in seconds (starts Day 1 08:00 AM)

  // Skyscraper Construction Timers & Rewarded Ad Speedup
  floorUnderConstruction?: FloorConstructionState | null;

  // Consórcio de Serviços Equipment
  serviceEquipments: ServiceEquipment[];
  
  // Economic cycle
  economicCycle: EconomicCycle;
  cycleTimer: number; // seconds left in current cycle
  
  // Clicker & Upgrades
  baseClickValue: number;
  tapUpgrades: Record<string, number>; // id -> level
  
  // Employees
  employees: Employee[];
  maxStaffCapacity: number;
  temporaryEmployees: (Employee & { expiresAt: number })[];
  
  // Investments
  stocks: StockAsset[];
  cryptos: CryptoAsset[];
  fixedIncomes: FixedIncomeAsset[];
  consortiums: ConsortiumAsset[];
  
  // Physical & Monopolies
  physicalAssets: PhysicalAsset[];
  competitors: CompetitorCompany[];
  
  // Cyber Security
  cyberUpgrades: Record<string, number>;
  cyberDefenseRating: number; // 0 - 100%
  lastHackerAttackTimestamp: number;
  hackerAttackUnderway: boolean;
  hackerTimerRemaining: number;
  temporaryDefenseBoost: { percent: number; expiresAt: number } | null;
  
  // Banking & Taxes
  loans: BankLoan[];
  currentQuarterEarnings: number;
  taxSeasonActive: boolean;
  taxesPending: number;
  
  // Partnerships & Missions
  partnerships: PartnerContract[];
  
  // Achievements
  achievements: Achievement[];
  
  // Tickers & News
  newsFeed: NewsItem[];
  
  // Monetization & In-App Purchases (Google Play Billing)
  purchasedNonConsumables: string[]; // Owned product IDs (decorations, legendaries)
  transactionsHistory: TransactionReceipt[];
  
  // Rewarded Ad Wheel of Fortune
  wheelSpinCount: number;
  lastWheelSpinTimestamp: number;
  marketTips: MarketTip[];
  pendingOfflineRewards: PendingOfflineReward[];
  activeDecorations: string[];
  
  // Statistics
  totalClicks: number;
  successfulDefenses: number;
  breachesSuffered: number;
  totalAdsWatched: number;
  lastSaveTimestamp: number;
  
  // Guided Tutorial State
  tutorialStep?: number;
  tutorialActive?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  ceoName: string; // Fictional Brazilian full name (First + Last name)
  companyName: string;
  netWorth: number; // Patrimônio Líquido in BRL (R$)
  sector: string;
  city: string;
  state: string; // e.g. 'SP', 'RJ', 'MG', 'MT', 'PR', 'SC', 'GO', 'BA', 'RS', 'CE'
  avatar: string;
  avatarBg: string;
  isPlayer: boolean;
  biography: string;
  updatedAt: number;
}

export interface FirebaseRealtimeLeaderboardNode {
  ref: string; // e.g. "/leaderboards/top100_ceos"
  syncedOffline: boolean;
  updatedAt: number;
  entries: Record<string, LeaderboardEntry>;
}

