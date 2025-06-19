import { action } from 'easy-peasy';
import type { GlobalPlatformSettings, PlatformConfig } from '../types/platform';
import { DEFAULT_PLATFORM_CONFIG } from '../types/platform';

// Local storage key for platform settings
const PLATFORM_STORAGE_KEY = 'platform-settings';

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

// Load initial platform settings from localStorage
const loadPlatformSettings = (): GlobalPlatformSettings => {
  return loadFromStorage(PLATFORM_STORAGE_KEY, DEFAULT_PLATFORM_CONFIG);
};

export const platformStore = {
  // State - Load from localStorage or use defaults
  platformSettings: loadPlatformSettings(),

  // Platform Settings Actions
  updatePlatformSettings: action((state: any, payload: Partial<GlobalPlatformSettings>) => {
    state.platformSettings = { ...state.platformSettings, ...payload };
    saveToStorage(PLATFORM_STORAGE_KEY, state.platformSettings);
  }),

  updatePrimarySavingsPlatform: action((state: any, payload: PlatformConfig) => {
    state.platformSettings.primarySavingsPlatform = payload;
    saveToStorage(PLATFORM_STORAGE_KEY, state.platformSettings);
  }),

  updatePrimaryInvestmentPlatform: action((state: any, payload: PlatformConfig) => {
    state.platformSettings.primaryInvestmentPlatform = payload;
    saveToStorage(PLATFORM_STORAGE_KEY, state.platformSettings);
  }),

  setDefaultCurrency: action((state: any, payload: 'NGN' | 'USD') => {
    state.platformSettings.defaultCurrency = payload;
    saveToStorage(PLATFORM_STORAGE_KEY, state.platformSettings);
  }),

  setExchangeRate: action((state: any, payload: number) => {
    state.platformSettings.exchangeRate = payload;
    saveToStorage(PLATFORM_STORAGE_KEY, state.platformSettings);
  }),

  setPlatformConfigured: action((state: any, payload: boolean) => {
    state.platformSettings.isConfigured = payload;
    saveToStorage(PLATFORM_STORAGE_KEY, state.platformSettings);
  }),

  resetPlatformSettings: action((state: any) => {
    state.platformSettings = DEFAULT_PLATFORM_CONFIG;
    saveToStorage(PLATFORM_STORAGE_KEY, state.platformSettings);
  }),
}; 