import { store } from '../store/shopping-store';

export function getPlatformNames() {
  const state = store.getState();
  const settings = state.platformSettings;

  return {
    savingsPlatform: settings.primarySavingsPlatform.name,
    investmentPlatform: settings.primaryInvestmentPlatform.name,
    defaultCurrency: settings.defaultCurrency,
    exchangeRate: settings.exchangeRate,
  };
}

export function getSavingsPlatformName(): string {
  const state = store.getState();
  return state.platformSettings.primarySavingsPlatform.name;
}

export function getInvestmentPlatformName(): string {
  const state = store.getState();
  return state.platformSettings.primaryInvestmentPlatform.name;
}

export function getExchangeRate(): number {
  const state = store.getState();
  return state.platformSettings.exchangeRate;
}

export function getDefaultCurrency(): 'NGN' | 'USD' {
  const state = store.getState();
  return state.platformSettings.defaultCurrency;
}

export function isPlatformConfigured(): boolean {
  const state = store.getState();
  return state.platformSettings.isConfigured;
} 