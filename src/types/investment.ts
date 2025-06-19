export interface InvestmentScenario {
  timePeriod: number
  appreciation: number
  principal: number
  monthlySavings: number
  savingsPlatformAnnualRate: number
  investmentPlatformAnnualRate: number
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
  savingsPlatformBalance: number
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

export interface ThreeTierStrategyScenario {
  // Savings Platform Tier
  initialSavingsPlatformBalance: number;
  monthlySavingsPlatformSavings: number;
  savingsPlatformInterestRate: number;
  savingsPlatformInterestReinvestPercentage: number;

  // Investment Platform Tier
  initialInvestmentPlatformBalance: number;
  investmentPlatformInterestRate: number;
  usdAppreciationRate: number;
  exchangeRate: number;

  // Vehicle Investment Tier
  vehicleInvestment: {
    investmentCost: number;
    returnAmount: number;
    investmentPeriod: number;
    cyclePeriod: number;
    investmentCostAppreciationRate: number; // Annual appreciation rate for investment cost
    returnAmountAppreciationRate: number; // Annual appreciation rate for return amount
  };
  vehiclesPerCycle: number;

  // Analysis Settings
  analysisPeriod: number;
}

export interface ThreeTierStrategyResult {
  // Overall Results
  totalInvestment: number;
  totalReturns: number;
  totalROI: number;

  // Tier-specific Results
  savingsPlatformResults: {
    totalInvestment: number;
    totalReturns: number;
    finalBalance: number;
    roi: number;
  };
  investmentPlatformResults: {
    totalInvestment: number;
    totalReturns: number;
    finalBalance: number;
    roi: number;
    finalUsdBalance: number;
    currencyGain: number;
  };
  vehicleResults: {
    totalInvestment: number;
    totalReturns: number;
    finalBalance: number;
    roi: number;
    completedCycles: number;
  };

  // Monthly Breakdown
  monthlyBreakdown: {
    month: number;
    savingsPlatformBalance: number;
    investmentPlatformBalance: number;
    vehicleBalance: number;
    totalBalance: number;
    savingsPlatformInterest: number;
    investmentPlatformInterest: number;
    vehicleReturns: number;
    currencyGain: number;
    monthlySavingsPlatformSavings: number;
    exchangeRate: number;
    vehicleInvestment: number;
  }[];
}
