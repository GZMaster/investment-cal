import { useStoreState, useStoreActions } from 'easy-peasy';

export function useCryptoStore() {
  // State
  const portfolio = useStoreState((state: any) => state.portfolio);
  const transactions = useStoreState((state: any) => state.transactions);
  const settings = useStoreState((state: any) => state.settings);
  const alerts = useStoreState((state: any) => state.alerts);
  const isLoading = useStoreState((state: any) => state.isLoading);
  const error = useStoreState((state: any) => state.error);

  // Computed values
  const totalValue = useStoreState((state: any) => state.totalValue);
  const totalCost = useStoreState((state: any) => state.totalCost);
  const unrealizedGains = useStoreState((state: any) => state.unrealizedGains);
  const totalStakingRewards = useStoreState((state: any) => state.totalStakingRewards);
  const totalDefiYield = useStoreState((state: any) => state.totalDefiYield);
  const portfolioAnalysis = useStoreState((state: any) => state.portfolioAnalysis);
  const assetsByCategory = useStoreState((state: any) => state.assetsByCategory);
  const assetsByBlockchain = useStoreState((state: any) => state.assetsByBlockchain);
  const assetsByRiskLevel = useStoreState((state: any) => state.assetsByRiskLevel);
  const activeAlerts = useStoreState((state: any) => state.activeAlerts);

  // Portfolio actions
  const updatePortfolio = useStoreActions((actions: any) => actions.updatePortfolio);
  const addAsset = useStoreActions((actions: any) => actions.addAsset);
  const updateAsset = useStoreActions((actions: any) => actions.updateAsset);
  const removeAsset = useStoreActions((actions: any) => actions.removeAsset);
  const refreshPortfolio = useStoreActions((actions: any) => actions.refreshPortfolio);

  // Transaction actions
  const addTransaction = useStoreActions((actions: any) => actions.addTransaction);
  const updateTransaction = useStoreActions((actions: any) => actions.updateTransaction);
  const removeTransaction = useStoreActions((actions: any) => actions.removeTransaction);

  // Settings actions
  const updateSettings = useStoreActions((actions: any) => actions.updateSettings);
  const resetSettings = useStoreActions((actions: any) => actions.resetSettings);

  // Alert actions
  const addAlert = useStoreActions((actions: any) => actions.addAlert);
  const updateAlert = useStoreActions((actions: any) => actions.updateAlert);
  const removeAlert = useStoreActions((actions: any) => actions.removeAlert);
  const triggerAlert = useStoreActions((actions: any) => actions.triggerAlert);

  // Utility actions
  const setLoading = useStoreActions((actions: any) => actions.setLoading);
  const setError = useStoreActions((actions: any) => actions.setError);
  const clearError = useStoreActions((actions: any) => actions.clearError);

  return {
    // State
    portfolio,
    transactions,
    settings,
    alerts,
    isLoading,
    error,

    // Portfolio actions
    updatePortfolio,
    addAsset,
    updateAsset,
    removeAsset,
    refreshPortfolio,

    // Transaction actions
    addTransaction,
    updateTransaction,
    removeTransaction,

    // Settings actions
    updateSettings,
    resetSettings,

    // Alert actions
    addAlert,
    updateAlert,
    removeAlert,
    triggerAlert,

    // Utility actions
    setLoading,
    setError,
    clearError,

    // Computed values
    totalValue,
    totalCost,
    unrealizedGains,
    totalStakingRewards,
    totalDefiYield,
    portfolioAnalysis,
    assetsByCategory,
    assetsByBlockchain,
    assetsByRiskLevel,
    activeAlerts,
  };
} 