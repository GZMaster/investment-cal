import type { InvestmentScenario } from '../types/investment'

export const DEFAULT_SCENARIO: InvestmentScenario = {
  timePeriod: 1,
  appreciation: 0,
  principal: 10000000,
  monthlySavings: 1000000,
  piggyVestAnnualRate: 0.18,
  riseVestAnnualRate: 0.08,
  baseExchangeRate: 1650,
  useRealTimeRate: false,
}

export const INVESTMENT_RANGES = {
  timePeriod: {
    min: 1,
    max: 10,
    step: 1,
  },
  appreciation: {
    min: 0,
    max: 25,
    step: 5,
  },
  principal: {
    min: 1000000,
    max: 100000000,
    step: 1000000,
  },
  monthlySavings: {
    min: 0,
    max: 10000000,
    step: 100000,
  },
  piggyVestAnnualRate: {
    min: 0.05,
    max: 0.3,
    step: 0.01,
  },
  riseVestAnnualRate: {
    min: 0.05,
    max: 0.2,
    step: 0.01,
  },
  baseExchangeRate: {
    min: 1000,
    max: 2000,
    step: 50,
  },
}

export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const APPRECIATION_RATES = [0, 5, 10, 15, 20, 25]
export const TIME_PERIODS = [1, 2, 3, 4]
