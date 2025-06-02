import type { AssetAnalysisScenario, AssetAnalysisResult } from '../types/investment';

export function calculateAssetAnalysis(scenario: AssetAnalysisScenario): AssetAnalysisResult {
  const {
    initialSavings,
    monthlySavings,
    vehicleInvestment,
    analysisPeriod,
  } = scenario;

  const {
    investmentCost,
    returnAmount,
    investmentPeriod,
    cyclePeriod,
  } = vehicleInvestment;

  let currentSavings = initialSavings;
  let totalInvestment = 0;
  let totalReturns = 0;
  const monthlyBreakdown: AssetAnalysisResult['monthlyBreakdown'] = [];

  // Track active investments and their monthly returns
  const activeInvestments: Array<{
    startMonth: number;
    monthlyReturn: number;
    totalReturned: number;
    totalExpected: number;
  }> = [];

  for (let month = 1; month <= analysisPeriod; month++) {
    // Add monthly savings
    currentSavings += monthlySavings;

    // Check for investment opportunities (every cyclePeriod months)
    if (month % cyclePeriod === 0 && currentSavings >= investmentCost) {
      const investmentsThisMonth = Math.floor(currentSavings / investmentCost);
      const investmentAmount = investmentsThisMonth * investmentCost;

      currentSavings -= investmentAmount;
      totalInvestment += investmentAmount;

      // Add new investments to active investments
      for (let i = 0; i < investmentsThisMonth; i++) {
        activeInvestments.push({
          startMonth: month,
          monthlyReturn: returnAmount / investmentPeriod, // Monthly return amount
          totalReturned: 0,
          totalExpected: returnAmount,
        });
      }
    }

    // Process returns from active investments
    const returnsThisMonth = activeInvestments.reduce((sum, investment) => {
      // Check if investment is still within its 12-month return period
      const monthsSinceStart = month - investment.startMonth;
      if (monthsSinceStart > 0 && monthsSinceStart <= 12 && investment.totalReturned < investment.totalExpected) {
        const returnAmount = investment.monthlyReturn;
        investment.totalReturned += returnAmount;
        return sum + returnAmount;
      }
      return sum;
    }, 0);

    currentSavings += returnsThisMonth;
    totalReturns += returnsThisMonth;

    // Remove completed investments (those that have reached their 12-month period or total return)
    const completedInvestments = activeInvestments.filter(
      inv => (month - inv.startMonth) > 12 || inv.totalReturned >= inv.totalExpected
    );
    activeInvestments.splice(0, completedInvestments.length);

    // Record monthly breakdown
    monthlyBreakdown.push({
      month,
      savings: monthlySavings,
      investments: month % cyclePeriod === 0 ? totalInvestment : 0,
      returns: returnsThisMonth,
      totalBalance: currentSavings,
    });
  }

  return {
    totalSavings: initialSavings + (monthlySavings * analysisPeriod),
    totalInvestment,
    totalReturns,
    monthlyBreakdown,
  };
} 