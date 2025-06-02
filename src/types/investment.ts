export interface InvestmentScenario {
  timePeriod: number
  appreciation: number
  principal: number
  monthlySavings: number
  piggyVestAnnualRate: number
  riseVestAnnualRate: number
  baseExchangeRate: number
  useRealTimeRate: boolean
}

export interface InvestmentResult {
  compoundEarnings: number
  twoTierEarnings: number
  finalExchangeRate: number
  usdValue: number
  totalUSD: number
  currencyGain: number
}

export interface MonthlyData {
  month: string
  piggyVestBalance: number
  nairaInterest: number
  usdAdded: number
  cumulativeUSD: number
  usdInterest: number
  exchangeRate: number
  usdValue: number
  totalEarnings: number
}

export interface InvestmentConstants {
  baseExchangeRate: number
  monthlyNairaInterest: number
  monthlyUSDRate: number
  annualCompoundRate: number
  principal: number
  monthlySavings: number
}

export interface VehicleInvestment {
  investmentCost: number;
  returnAmount: number;
  investmentPeriod: number; // in months
  cyclePeriod: number; // in months
}

export interface AssetAnalysisScenario {
  initialSavings: number;
  monthlySavings: number;
  vehicleInvestment: VehicleInvestment;
  analysisPeriod: number; // in months
  vehiclesPerCycle: number; // number of vehicles to buy per cycle
}

export interface AssetAnalysisResult {
  totalSavings: number;
  totalInvestment: number;
  totalReturns: number;
  monthlyBreakdown: {
    month: number;
    savings: number;
    investments: number;
    returns: number;
    totalBalance: number;
  }[];
}
