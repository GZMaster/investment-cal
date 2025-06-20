export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  stakingRewards: number;
  defiYield: number;
  blockchain: string;
  walletAddress?: string;
  purchaseDate: Date;
  lastUpdated: Date;
  category: 'defi' | 'layer1' | 'layer2' | 'meme' | 'stablecoin' | 'governance' | 'other';
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
}

export interface CryptoPortfolio {
  id: string;
  name: string;
  assets: CryptoAsset[];
  totalValue: number;
  totalCost: number;
  unrealizedGains: number;
  totalStakingRewards: number;
  totalDefiYield: number;
  createdAt: Date;
  lastUpdated: Date;
}

export interface CryptoAnalysis {
  totalValue: number;
  totalCost: number;
  unrealizedGains: number;
  totalStakingRewards: number;
  totalDefiYield: number;
  portfolioDiversification: DiversificationMetrics;
  riskMetrics: CryptoRiskMetrics;
  taxImplications: CryptoTaxImplications;
  performanceMetrics: CryptoPerformanceMetrics;
}

export interface DiversificationMetrics {
  byCategory: Record<string, number>;
  byBlockchain: Record<string, number>;
  byRiskLevel: Record<string, number>;
  concentrationRisk: number;
  topHoldings: CryptoAsset[];
}

export interface CryptoRiskMetrics {
  volatility: number;
  beta: number;
  sharpeRatio: number;
  maxDrawdown: number;
  valueAtRisk: number;
  correlationMatrix: Record<string, Record<string, number>>;
  riskScore: number;
}

export interface CryptoTaxImplications {
  shortTermGains: number;
  longTermGains: number;
  stakingRewardsTaxable: number;
  defiYieldTaxable: number;
  totalTaxLiability: number;
  taxOptimizationSuggestions: TaxSuggestion[];
}

export interface CryptoPerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  monthlyReturns: MonthlyReturn[];
  benchmarkComparison: BenchmarkComparison;
  riskAdjustedReturn: number;
}

export interface MonthlyReturn {
  month: string;
  return: number;
  cumulativeReturn: number;
}

export interface BenchmarkComparison {
  benchmark: string;
  benchmarkReturn: number;
  outperformance: number;
  correlation: number;
}

export interface TaxSuggestion {
  type: 'harvest-losses' | 'optimize-holdings' | 'staking-strategy' | 'defi-optimization';
  description: string;
  potentialSavings: number;
  priority: 'high' | 'medium' | 'low';
}

export interface CryptoMarketData {
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  priceChange7d: number;
  circulatingSupply: number;
  maxSupply?: number;
  lastUpdated: Date;
}

export interface StakingInfo {
  assetId: string;
  stakingRate: number;
  minimumStake: number;
  lockPeriod: number;
  rewards: number;
  lastRewardDate: Date;
}

export interface DefiPosition {
  id: string;
  protocol: string;
  asset: string;
  deposited: number;
  borrowed?: number;
  apy: number;
  rewards: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: Date;
}

export interface CryptoTransaction {
  id: string;
  assetId: string;
  type: 'buy' | 'sell' | 'stake' | 'unstake' | 'defi-deposit' | 'defi-withdraw' | 'transfer';
  quantity: number;
  price: number;
  fee: number;
  date: Date;
  exchange?: string;
  walletAddress?: string;
  notes?: string;
}

export interface CryptoPortfolioSettings {
  defaultCurrency: 'USD' | 'NGN' | 'EUR';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  rebalancingFrequency: 'weekly' | 'monthly' | 'quarterly' | 'never';
  enableStaking: boolean;
  enableDefi: boolean;
  taxOptimization: boolean;
  alerts: {
    priceAlerts: boolean;
    rebalancingAlerts: boolean;
    stakingRewardsAlerts: boolean;
    riskAlerts: boolean;
  };
}

export interface CryptoAlert {
  id: string;
  type: 'price' | 'rebalancing' | 'staking' | 'risk';
  assetId?: string;
  condition: 'above' | 'below' | 'change';
  value: number;
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

// Default portfolio settings
export const DEFAULT_CRYPTO_SETTINGS: CryptoPortfolioSettings = {
  defaultCurrency: 'USD',
  riskTolerance: 'moderate',
  rebalancingFrequency: 'monthly',
  enableStaking: true,
  enableDefi: true,
  taxOptimization: true,
  alerts: {
    priceAlerts: true,
    rebalancingAlerts: true,
    stakingRewardsAlerts: true,
    riskAlerts: true,
  },
};

// Sample crypto assets for testing
export const SAMPLE_CRYPTO_ASSETS: CryptoAsset[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    quantity: 0.5,
    averageCost: 45000,
    currentPrice: 52000,
    stakingRewards: 0,
    defiYield: 0,
    blockchain: 'Bitcoin',
    purchaseDate: new Date('2023-01-15'),
    lastUpdated: new Date(),
    category: 'layer1',
    riskLevel: 'medium',
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    quantity: 2.5,
    averageCost: 2800,
    currentPrice: 3200,
    stakingRewards: 0.05,
    defiYield: 0.12,
    blockchain: 'Ethereum',
    purchaseDate: new Date('2023-03-20'),
    lastUpdated: new Date(),
    category: 'layer1',
    riskLevel: 'medium',
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    quantity: 5000,
    averageCost: 0.45,
    currentPrice: 0.52,
    stakingRewards: 25,
    defiYield: 0,
    blockchain: 'Cardano',
    purchaseDate: new Date('2023-02-10'),
    lastUpdated: new Date(),
    category: 'layer1',
    riskLevel: 'high',
  },
];

// Sample transactions for testing
export const SAMPLE_CRYPTO_TRANSACTIONS: CryptoTransaction[] = [
  {
    id: 'tx-1',
    assetId: 'bitcoin',
    type: 'buy',
    quantity: 0.3,
    price: 44000,
    fee: 15,
    date: new Date('2023-01-15'),
    exchange: 'Coinbase',
    notes: 'Initial Bitcoin purchase',
  },
  {
    id: 'tx-2',
    assetId: 'bitcoin',
    type: 'buy',
    quantity: 0.2,
    price: 46000,
    fee: 12,
    date: new Date('2023-02-20'),
    exchange: 'Binance',
    notes: 'DCA Bitcoin purchase',
  },
  {
    id: 'tx-3',
    assetId: 'ethereum',
    type: 'buy',
    quantity: 1.5,
    price: 2700,
    fee: 8,
    date: new Date('2023-03-20'),
    exchange: 'Coinbase',
    notes: 'Initial Ethereum purchase',
  },
  {
    id: 'tx-4',
    assetId: 'ethereum',
    type: 'stake',
    quantity: 1.0,
    price: 2800,
    fee: 5,
    date: new Date('2023-04-15'),
    exchange: 'Lido',
    notes: 'Staked ETH for rewards',
  },
  {
    id: 'tx-5',
    assetId: 'ethereum',
    type: 'defi-deposit',
    quantity: 0.5,
    price: 2900,
    fee: 3,
    date: new Date('2023-05-10'),
    exchange: 'Aave',
    notes: 'Deposited ETH for DeFi yield',
  },
  {
    id: 'tx-6',
    assetId: 'cardano',
    type: 'buy',
    quantity: 3000,
    price: 0.42,
    fee: 2,
    date: new Date('2023-02-10'),
    exchange: 'Binance',
    notes: 'Initial Cardano purchase',
  },
  {
    id: 'tx-7',
    assetId: 'cardano',
    type: 'buy',
    quantity: 2000,
    price: 0.48,
    fee: 1.5,
    date: new Date('2023-03-15'),
    exchange: 'Coinbase',
    notes: 'Additional Cardano purchase',
  },
  {
    id: 'tx-8',
    assetId: 'cardano',
    type: 'stake',
    quantity: 5000,
    price: 0.45,
    fee: 0,
    date: new Date('2023-04-01'),
    exchange: 'Daedalus Wallet',
    notes: 'Staked all ADA for rewards',
  },
];

// Sample alerts for testing
export const SAMPLE_CRYPTO_ALERTS: CryptoAlert[] = [
  {
    id: 'alert-1',
    type: 'price',
    assetId: 'bitcoin',
    condition: 'above',
    value: 55000,
    isActive: true,
    createdAt: new Date('2023-01-20'),
  },
  {
    id: 'alert-2',
    type: 'price',
    assetId: 'ethereum',
    condition: 'below',
    value: 2500,
    isActive: true,
    createdAt: new Date('2023-03-25'),
  },
  {
    id: 'alert-3',
    type: 'rebalancing',
    assetId: undefined,
    condition: 'change',
    value: 10,
    isActive: true,
    createdAt: new Date('2023-02-01'),
  },
  {
    id: 'alert-4',
    type: 'staking',
    assetId: 'cardano',
    condition: 'above',
    value: 100,
    isActive: true,
    createdAt: new Date('2023-04-05'),
  },
  {
    id: 'alert-5',
    type: 'risk',
    assetId: undefined,
    condition: 'above',
    value: 80,
    isActive: false,
    createdAt: new Date('2023-01-10'),
    triggeredAt: new Date('2023-01-15'),
  },
]; 