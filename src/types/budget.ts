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
  piggyvest: number
  fairmoneySavings: number
  risevest: number
  greyCard: number
  fairmoney: number
}

export const PLATFORMS: Platform[] = [
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
]
