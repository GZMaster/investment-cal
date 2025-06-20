import { action, computed } from 'easy-peasy';
import type {
  CryptoAsset,
  CryptoPortfolio,
  CryptoAnalysis,
  CryptoTransaction,
  CryptoPortfolioSettings,
  CryptoAlert,
} from '../types/crypto';
import { SAMPLE_CRYPTO_ASSETS, DEFAULT_CRYPTO_SETTINGS } from '../types/crypto';
import { dexscreenerAPI } from '../utils/dexscreener-api';

// Local storage keys
const CRYPTO_PORTFOLIO_KEY = 'crypto-portfolio';
const CRYPTO_TRANSACTIONS_KEY = 'crypto-transactions';
const CRYPTO_SETTINGS_KEY = 'crypto-settings';
const CRYPTO_ALERTS_KEY = 'crypto-alerts';

// Helper functions for localStorage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Load initial data from localStorage
const loadInitialPortfolio = (): CryptoPortfolio => {
  const stored = loadFromStorage(CRYPTO_PORTFOLIO_KEY, null);
  if (stored) {
    return {
      ...stored,
      assets: stored.assets.map((asset: any) => ({
        ...asset,
        purchaseDate: new Date(asset.purchaseDate),
        lastUpdated: new Date(asset.lastUpdated),
      })),
      createdAt: new Date(stored.createdAt),
      lastUpdated: new Date(stored.lastUpdated),
    };
  }

  // Return default portfolio with sample data
  return {
    id: 'default-portfolio',
    name: 'My Crypto Portfolio',
    assets: SAMPLE_CRYPTO_ASSETS,
    totalValue: 0,
    totalCost: 0,
    unrealizedGains: 0,
    totalStakingRewards: 0,
    totalDefiYield: 0,
    createdAt: new Date(),
    lastUpdated: new Date(),
  };
};

const loadInitialTransactions = (): CryptoTransaction[] => {
  const stored = loadFromStorage(CRYPTO_TRANSACTIONS_KEY, []);
  return stored.map((transaction: any) => ({
    ...transaction,
    date: new Date(transaction.date),
  }));
};

const loadInitialSettings = (): CryptoPortfolioSettings => {
  return loadFromStorage(CRYPTO_SETTINGS_KEY, DEFAULT_CRYPTO_SETTINGS);
};

const loadInitialAlerts = (): CryptoAlert[] => {
  const stored = loadFromStorage(CRYPTO_ALERTS_KEY, []);
  return stored.map((alert: any) => ({
    ...alert,
    createdAt: new Date(alert.createdAt),
    triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined,
  }));
};

export const cryptoStore = {
  // State
  portfolio: loadInitialPortfolio(),
  transactions: loadInitialTransactions(),
  settings: loadInitialSettings(),
  alerts: loadInitialAlerts(),
  isLoading: false,
  error: null,
  lastPriceUpdate: new Date(),

  // Portfolio Actions
  updatePortfolio: action((state: any, updates: Partial<CryptoPortfolio>) => {
    state.portfolio = { ...state.portfolio, ...updates, lastUpdated: new Date() };
    saveToStorage(CRYPTO_PORTFOLIO_KEY, state.portfolio);
  }),

  addAsset: action((state: any, asset: CryptoAsset) => {
    const newAsset = { ...asset, id: `${asset.symbol}-${Date.now()}` };
    state.portfolio.assets.push(newAsset);
    state.portfolio.lastUpdated = new Date();
    saveToStorage(CRYPTO_PORTFOLIO_KEY, state.portfolio);
  }),

  updateAsset: action((state: any, { id, updates }: { id: string; updates: Partial<CryptoAsset> }) => {
    const assetIndex = state.portfolio.assets.findIndex((asset: CryptoAsset) => asset.id === id);
    if (assetIndex !== -1) {
      state.portfolio.assets[assetIndex] = {
        ...state.portfolio.assets[assetIndex],
        ...updates,
        lastUpdated: new Date(),
      };
      state.portfolio.lastUpdated = new Date();
      saveToStorage(CRYPTO_PORTFOLIO_KEY, state.portfolio);
    }
  }),

  removeAsset: action((state: any, assetId: string) => {
    state.portfolio.assets = state.portfolio.assets.filter((asset: CryptoAsset) => asset.id !== assetId);
    state.portfolio.lastUpdated = new Date();
    saveToStorage(CRYPTO_PORTFOLIO_KEY, state.portfolio);
  }),

  refreshPortfolio: action(async (state: any) => {
    state.isLoading = true;
    state.error = null;

    try {
      // Ensure portfolio exists
      if (!state.portfolio || !state.portfolio.assets) {
        console.warn('Portfolio not initialized, skipping refresh');
        return;
      }

      // Get top cryptocurrencies to update prices
      const topCrypto = await dexscreenerAPI.getTopCryptocurrencies(100);

      // Update prices for all assets in portfolio
      for (const asset of state.portfolio.assets) {
        const marketData = topCrypto.find((crypto: any) =>
          crypto.symbol.toLowerCase() === asset.symbol.toLowerCase() ||
          crypto.id.toLowerCase() === asset.symbol.toLowerCase()
        );

        if (marketData) {
          asset.currentPrice = marketData.current_price;
          asset.lastUpdated = new Date();
        }
      }

      state.lastPriceUpdate = new Date();
      state.portfolio.lastUpdated = new Date();
      saveToStorage(CRYPTO_PORTFOLIO_KEY, state.portfolio);
    } catch (error) {
      state.error = `Failed to refresh portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error('Portfolio refresh error:', error);
    } finally {
      state.isLoading = false;
    }
  }),

  // Auto-update prices for specific asset
  updateAssetPrice: action(async (state: any, { symbol, price }: { symbol: string; price: number }) => {
    if (!state.portfolio || !state.portfolio.assets) {
      console.warn('Portfolio not initialized, skipping asset price update');
      return;
    }

    const assetIndex = state.portfolio.assets.findIndex((asset: CryptoAsset) =>
      asset.symbol.toLowerCase() === symbol.toLowerCase()
    );

    if (assetIndex !== -1) {
      state.portfolio.assets[assetIndex].currentPrice = price;
      state.portfolio.assets[assetIndex].lastUpdated = new Date();
      state.portfolio.lastUpdated = new Date();
      saveToStorage(CRYPTO_PORTFOLIO_KEY, state.portfolio);
    }
  }),

  // Transaction Actions
  addTransaction: action((state: any, transaction: Omit<CryptoTransaction, 'id'>) => {
    if (!state.transactions) {
      state.transactions = [];
    }
    const newTransaction = { ...transaction, id: `tx-${Date.now()}` };
    state.transactions.push(newTransaction);
    saveToStorage(CRYPTO_TRANSACTIONS_KEY, state.transactions);
  }),

  updateTransaction: action((state: any, { id, updates }: { id: string; updates: Partial<CryptoTransaction> }) => {
    if (!state.transactions) {
      console.warn('Transactions not initialized, skipping update');
      return;
    }
    const transactionIndex = state.transactions.findIndex((tx: CryptoTransaction) => tx.id === id);
    if (transactionIndex !== -1) {
      state.transactions[transactionIndex] = {
        ...state.transactions[transactionIndex],
        ...updates,
      };
      saveToStorage(CRYPTO_TRANSACTIONS_KEY, state.transactions);
    }
  }),

  removeTransaction: action((state: any, transactionId: string) => {
    if (!state.transactions) {
      console.warn('Transactions not initialized, skipping removal');
      return;
    }
    state.transactions = state.transactions.filter((tx: CryptoTransaction) => tx.id !== transactionId);
    saveToStorage(CRYPTO_TRANSACTIONS_KEY, state.transactions);
  }),

  // Settings Actions
  updateSettings: action((state: any, updates: Partial<CryptoPortfolioSettings>) => {
    if (!state.settings) {
      state.settings = DEFAULT_CRYPTO_SETTINGS;
    }
    state.settings = { ...state.settings, ...updates };
    saveToStorage(CRYPTO_SETTINGS_KEY, state.settings);
  }),

  resetSettings: action((state: any) => {
    state.settings = DEFAULT_CRYPTO_SETTINGS;
    saveToStorage(CRYPTO_SETTINGS_KEY, state.settings);
  }),

  // Alert Actions
  addAlert: action((state: any, alert: Omit<CryptoAlert, 'id'>) => {
    if (!state.alerts) {
      state.alerts = [];
    }
    const newAlert = { ...alert, id: `alert-${Date.now()}` };
    state.alerts.push(newAlert);
    saveToStorage(CRYPTO_ALERTS_KEY, state.alerts);
  }),

  updateAlert: action((state: any, { id, updates }: { id: string; updates: Partial<CryptoAlert> }) => {
    if (!state.alerts) {
      console.warn('Alerts not initialized, skipping update');
      return;
    }
    const alertIndex = state.alerts.findIndex((alert: CryptoAlert) => alert.id === id);
    if (alertIndex !== -1) {
      state.alerts[alertIndex] = {
        ...state.alerts[alertIndex],
        ...updates,
      };
      saveToStorage(CRYPTO_ALERTS_KEY, state.alerts);
    }
  }),

  removeAlert: action((state: any, alertId: string) => {
    if (!state.alerts) {
      console.warn('Alerts not initialized, skipping removal');
      return;
    }
    state.alerts = state.alerts.filter((alert: CryptoAlert) => alert.id !== alertId);
    saveToStorage(CRYPTO_ALERTS_KEY, state.alerts);
  }),

  triggerAlert: action((state: any, alertId: string) => {
    if (!state.alerts) {
      console.warn('Alerts not initialized, skipping trigger');
      return;
    }
    const alertIndex = state.alerts.findIndex((alert: CryptoAlert) => alert.id === alertId);
    if (alertIndex !== -1) {
      state.alerts[alertIndex].triggeredAt = new Date();
      saveToStorage(CRYPTO_ALERTS_KEY, state.alerts);
    }
  }),

  // Utility Actions
  setLoading: action((state: any, isLoading: boolean) => {
    state.isLoading = isLoading;
  }),

  setError: action((state: any, error: string | null) => {
    state.error = error;
  }),

  clearError: action((state: any) => {
    state.error = null;
  }),

  // Computed Values
  totalValue: computed((state: any) => {
    if (!state.portfolio?.assets) return 0;
    return state.portfolio.assets.reduce((total: number, asset: CryptoAsset) => {
      return total + (asset.quantity * asset.currentPrice);
    }, 0);
  }),

  totalCost: computed((state: any) => {
    if (!state.portfolio?.assets) return 0;
    return state.portfolio.assets.reduce((total: number, asset: CryptoAsset) => {
      return total + (asset.quantity * asset.averageCost);
    }, 0);
  }),

  unrealizedGains: computed((state: any) => {
    return state.totalValue - state.totalCost;
  }),

  totalStakingRewards: computed((state: any) => {
    if (!state.portfolio?.assets) return 0;
    return state.portfolio.assets.reduce((total: number, asset: CryptoAsset) => {
      return total + asset.stakingRewards;
    }, 0);
  }),

  totalDefiYield: computed((state: any) => {
    if (!state.portfolio?.assets) return 0;
    return state.portfolio.assets.reduce((total: number, asset: CryptoAsset) => {
      return total + asset.defiYield;
    }, 0);
  }),

  portfolioAnalysis: computed((state: any): CryptoAnalysis => {
    const totalValue = state.totalValue;
    const totalCost = state.totalCost;
    const unrealizedGains = state.unrealizedGains;
    const totalStakingRewards = state.totalStakingRewards;
    const totalDefiYield = state.totalDefiYield;

    // Calculate diversification metrics
    const byCategory: Record<string, number> = {};
    const byBlockchain: Record<string, number> = {};
    const byRiskLevel: Record<string, number> = {};

    for (const asset of state.portfolio?.assets || []) {
      const assetValue = asset.quantity * asset.currentPrice;
      const percentage = totalValue > 0 ? (assetValue / totalValue) * 100 : 0;

      byCategory[asset.category] = (byCategory[asset.category] || 0) + percentage;
      byBlockchain[asset.blockchain] = (byBlockchain[asset.blockchain] || 0) + percentage;
      byRiskLevel[asset.riskLevel] = (byRiskLevel[asset.riskLevel] || 0) + percentage;
    }

    // Calculate concentration risk (Herfindahl-Hirschman Index)
    const concentrationRisk = Object.values(byCategory).reduce((sum, percentage) => {
      return sum + (percentage / 100) ** 2;
    }, 0);

    // Get top holdings
    const topHoldings = [...(state.portfolio?.assets || [])]
      .sort((a, b) => (b.quantity * b.currentPrice) - (a.quantity * a.currentPrice))
      .slice(0, 5);

    return {
      totalValue,
      totalCost,
      unrealizedGains,
      totalStakingRewards,
      totalDefiYield,
      portfolioDiversification: {
        byCategory,
        byBlockchain,
        byRiskLevel,
        concentrationRisk,
        topHoldings,
      },
      riskMetrics: {
        volatility: 0.25, // Placeholder - would calculate from historical data
        beta: 1.2, // Placeholder
        sharpeRatio: 0.8, // Placeholder
        maxDrawdown: -0.15, // Placeholder
        valueAtRisk: totalValue * 0.1, // Placeholder
        correlationMatrix: {}, // Placeholder
        riskScore: 65, // Placeholder
      },
      taxImplications: {
        shortTermGains: unrealizedGains * 0.3, // Placeholder
        longTermGains: unrealizedGains * 0.7, // Placeholder
        stakingRewardsTaxable: totalStakingRewards,
        defiYieldTaxable: totalDefiYield,
        totalTaxLiability: 0, // Placeholder
        taxOptimizationSuggestions: [], // Placeholder
      },
      performanceMetrics: {
        totalReturn: totalValue > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
        annualizedReturn: 12.5, // Placeholder
        monthlyReturns: [], // Placeholder
        benchmarkComparison: {
          benchmark: 'BTC',
          benchmarkReturn: 15.2,
          outperformance: -2.7,
          correlation: 0.85,
        },
        riskAdjustedReturn: 0.8, // Placeholder
      },
    };
  }),

  assetsByCategory: computed((state: any) => {
    const grouped: Record<string, CryptoAsset[]> = {};
    for (const asset of state.portfolio?.assets || []) {
      if (!grouped[asset.category]) {
        grouped[asset.category] = [];
      }
      grouped[asset.category].push(asset);
    }
    return grouped;
  }),

  assetsByBlockchain: computed((state: any) => {
    const grouped: Record<string, CryptoAsset[]> = {};
    for (const asset of state.portfolio?.assets || []) {
      if (!grouped[asset.blockchain]) {
        grouped[asset.blockchain] = [];
      }
      grouped[asset.blockchain].push(asset);
    }
    return grouped;
  }),

  assetsByRiskLevel: computed((state: any) => {
    const grouped: Record<string, CryptoAsset[]> = {};
    for (const asset of state.portfolio?.assets || []) {
      if (!grouped[asset.riskLevel]) {
        grouped[asset.riskLevel] = [];
      }
      grouped[asset.riskLevel].push(asset);
    }
    return grouped;
  }),

  activeAlerts: computed((state: any) => {
    if (!state.alerts) return [];
    return state.alerts.filter((alert: CryptoAlert) => alert.isActive);
  }),
}; 