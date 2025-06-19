import { useStoreState, useStoreActions } from 'easy-peasy';
import type { GlobalPlatformSettings, PlatformConfig } from '../types/platform';

export function usePlatformStore() {
  const platformSettings = useStoreState((state: any) => state.platformSettings);
  const updatePlatformSettings = useStoreActions((actions: any) => actions.updatePlatformSettings);
  const updatePrimarySavingsPlatform = useStoreActions((actions: any) => actions.updatePrimarySavingsPlatform);
  const updatePrimaryInvestmentPlatform = useStoreActions((actions: any) => actions.updatePrimaryInvestmentPlatform);
  const setDefaultCurrency = useStoreActions((actions: any) => actions.setDefaultCurrency);
  const setExchangeRate = useStoreActions((actions: any) => actions.setExchangeRate);
  const setPlatformConfigured = useStoreActions((actions: any) => actions.setPlatformConfigured);
  const resetPlatformSettings = useStoreActions((actions: any) => actions.resetPlatformSettings);

  return {
    settings: platformSettings,
    updateSettings: updatePlatformSettings,
    updatePrimarySavingsPlatform,
    updatePrimaryInvestmentPlatform,
    setDefaultCurrency,
    setExchangeRate,
    setConfigured: setPlatformConfigured,
    resetToDefaults: resetPlatformSettings,
  };
} 