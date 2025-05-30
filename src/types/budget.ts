export interface Platform {
  id: string
  name: string
  type: 'savings' | 'debt' | 'investment'
  currency: 'NGN' | 'USD'
}

export interface Transaction {
  id: string
  date: string
  amount: number
  platformId: string
  type: 'income' | 'expense' | 'transfer'
  category?: string
  description?: string
}

export interface BudgetPlan {
  id: string
  startDate: string
  endDate: string
  totalIncome: number
  allocations: {
    platformId: string
    amount: number
    percentage: number
  }[]
}

export interface PlatformBalance {
  platformId: string
  currentBalance: number
  expectedBalance: number
  debtBalance: number
  expectedDebtBalance: number
}

export interface WeeklyAllocation {
  [platformId: string]: number;
}

export function getDefaultPlatforms(): Platform[] {
  return [
    {
      id: 'piggyvest',
      name: 'PiggyVest',
      type: 'savings',
      currency: 'NGN',
    },
    {
      id: 'risevest',
      name: 'RiseVest',
      type: 'investment',
      currency: 'USD',
    },
    {
      id: 'fairmoney-savings',
      name: 'FairMoney Savings',
      type: 'savings',
      currency: 'NGN',
    },
    {
      id: 'fairmoney',
      name: 'FairMoney',
      type: 'debt',
      currency: 'NGN',
    },
    {
      id: 'grey-card',
      name: 'Grey Card',
      type: 'savings',
      currency: 'NGN',
    },
  ];
}

export interface PlatformManagement {
  platforms: Platform[];
  addPlatform: (platform: Platform) => void;
  updatePlatform: (platform: Platform) => void;
  deletePlatform: (platformId: string) => void;
}

export const INITIAL_BALANCES: PlatformBalance[] = [
  {
    platformId: 'piggyvest',
    currentBalance: 6000000,
    expectedBalance: 7000000,
    debtBalance: 0,
    expectedDebtBalance: 0,
  },
  {
    platformId: 'risevest',
    currentBalance: 130,
    expectedBalance: 130,
    debtBalance: 0,
    expectedDebtBalance: 0,
  },
  {
    platformId: 'fairmoney-savings',
    currentBalance: 0,
    expectedBalance: 200000,
    debtBalance: 0,
    expectedDebtBalance: 0,
  },
  {
    platformId: 'fairmoney',
    currentBalance: 0,
    expectedBalance: 0,
    debtBalance: 0,
    expectedDebtBalance: 0,
  },
  {
    platformId: 'grey-card',
    currentBalance: 0,
    expectedBalance: 20000,
    debtBalance: 0,
    expectedDebtBalance: 0,
  },
]

export function getInitialWeeklyAllocation(platforms: Platform[]): WeeklyAllocation {
  return platforms.reduce((acc, platform) => ({
    ...acc,
    [platform.id]: 0
  }), {});
}
