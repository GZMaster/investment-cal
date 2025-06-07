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

export interface ThreeTierStrategyScenario {
  // PiggyVest Tier
  initialPiggyVestBalance: number;
  monthlyPiggyVestSavings: number;
  piggyVestInterestRate: number;
  piggyVestInterestReinvestPercentage: number;

  // RiseVest Tier
  initialRiseVestBalance: number;
  riseVestInterestRate: number;
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
  piggyVestResults: {
    totalInvestment: number;
    totalReturns: number;
    finalBalance: number;
    roi: number;
  };
  riseVestResults: {
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
    piggyVestBalance: number;
    riseVestBalance: number;
    vehicleBalance: number;
    totalBalance: number;
    piggyVestInterest: number;
    riseVestInterest: number;
    vehicleReturns: number;
    currencyGain: number;
    monthlyPiggyVestSavings: number;
    exchangeRate: number;
    vehicleInvestment: number;
  }[];
}
