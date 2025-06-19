export interface PlatformConfig {
  id: string;
  name: string;
  type: 'savings' | 'investment' | 'debt';
  currency: 'NGN' | 'USD';
  description?: string;
  icon?: string;
}

export interface GlobalPlatformSettings {
  primarySavingsPlatform: PlatformConfig;
  primaryInvestmentPlatform: PlatformConfig;
  defaultCurrency: 'NGN' | 'USD';
  exchangeRate: number;
  isConfigured: boolean;
}

export const DEFAULT_PLATFORM_CONFIG: GlobalPlatformSettings = {
  primarySavingsPlatform: {
    id: 'piggyvest',
    name: 'PiggyVest',
    type: 'savings',
    currency: 'NGN',
    description: 'Primary savings platform',
  },
  primaryInvestmentPlatform: {
    id: 'risevest',
    name: 'RiseVest',
    type: 'investment',
    currency: 'USD',
    description: 'Primary investment platform',
  },
  defaultCurrency: 'NGN',
  exchangeRate: 1650,
  isConfigured: false,
}; 