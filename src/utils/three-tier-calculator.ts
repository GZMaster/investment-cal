import type { ThreeTierStrategyScenario, ThreeTierStrategyResult } from '../types/investment';

export function calculateThreeTierStrategy(scenario: ThreeTierStrategyScenario): ThreeTierStrategyResult {
  const {
    initialSavingsPlatformBalance,
    monthlySavingsPlatformSavings,
    savingsPlatformInterestRate,
    initialInvestmentPlatformBalance,
    investmentPlatformInterestRate,
    usdAppreciationRate,
    exchangeRate,
    vehicleInvestment,
    vehiclesPerCycle,
    analysisPeriod,
    savingsPlatformInterestReinvestPercentage,
  } = scenario;

  // Initialize results
  let savingsPlatformBalance = initialSavingsPlatformBalance;
  let investmentPlatformBalance = initialInvestmentPlatformBalance;
  let vehicleBalance = 0;
  let totalInvestment = initialSavingsPlatformBalance + (initialInvestmentPlatformBalance * exchangeRate);
  let totalReturns = 0;

  // Track active vehicle investments
  const activeVehicleInvestments: Array<{
    startMonth: number;
    investmentAmount: number;
    monthlyReturn: number;
    totalReturned: number;
    totalExpected: number;
  }> = [];

  // Monthly breakdown
  const monthlyBreakdown: ThreeTierStrategyResult['monthlyBreakdown'] = [];

  // Calculate monthly rates
  const monthlySavingsPlatformRate = savingsPlatformInterestRate / 100 / 12;
  const monthlyInvestmentPlatformRate = investmentPlatformInterestRate / 100 / 12;
  const monthlyUsdAppreciationRate = usdAppreciationRate / 100 / 12;
  const monthlyInvestmentCostAppreciationRate = vehicleInvestment.investmentCostAppreciationRate / 100 / 12;
  const monthlyReturnAmountAppreciationRate = vehicleInvestment.returnAmountAppreciationRate / 100 / 12;

  for (let month = 1; month <= analysisPeriod; month++) {
    // Calculate current exchange rate with appreciation
    const currentExchangeRate = exchangeRate * (1 + monthlyUsdAppreciationRate) ** month;

    // Calculate current vehicle investment cost and return amount with appreciation
    const currentInvestmentCost = vehicleInvestment.investmentCost * (1 + monthlyInvestmentCostAppreciationRate) ** month;
    const currentReturnAmount = vehicleInvestment.returnAmount * (1 + monthlyReturnAmountAppreciationRate) ** month;
    const currentMonthlyReturn = currentReturnAmount / vehicleInvestment.investmentPeriod;

    // Calculate savings platform interest
    const savingsPlatformInterest = savingsPlatformBalance * monthlySavingsPlatformRate;

    // Calculate how much interest to reinvest in investment platform
    const interestToReinvest = savingsPlatformInterest * (savingsPlatformInterestReinvestPercentage / 100);
    const interestToKeep = savingsPlatformInterest - interestToReinvest;

    // Convert reinvested interest to USD and add to investment platform balance
    const savingsPlatformInterestInUsd = interestToReinvest / currentExchangeRate;
    investmentPlatformBalance += savingsPlatformInterestInUsd;

    // Calculate investment platform interest on the new balance
    const investmentPlatformInterest = investmentPlatformBalance * monthlyInvestmentPlatformRate;
    investmentPlatformBalance += investmentPlatformInterest;

    // Add monthly savings and remaining interest to savings platform
    savingsPlatformBalance += monthlySavingsPlatformSavings + interestToKeep;

    // Process vehicle investments
    let vehicleReturns = 0;
    if (month % vehicleInvestment.cyclePeriod === 0 && savingsPlatformBalance >= currentInvestmentCost * vehiclesPerCycle) {
      const investmentAmount = currentInvestmentCost * vehiclesPerCycle;
      savingsPlatformBalance -= investmentAmount;
      totalInvestment += investmentAmount;

      // Add new investments
      for (let i = 0; i < vehiclesPerCycle; i++) {
        activeVehicleInvestments.push({
          startMonth: month,
          investmentAmount,
          monthlyReturn: currentMonthlyReturn,
          totalReturned: 0,
          totalExpected: currentReturnAmount,
        });
      }
    }

    // Process returns from active vehicle investments
    for (const investment of activeVehicleInvestments) {
      const monthsSinceStart = month - investment.startMonth;
      if (monthsSinceStart > 0 && monthsSinceStart <= vehicleInvestment.investmentPeriod && investment.totalReturned < investment.totalExpected) {
        const returnAmount = investment.monthlyReturn;
        investment.totalReturned += returnAmount;
        vehicleReturns += returnAmount;
        vehicleBalance += returnAmount;

        // Add vehicle returns back to savings platform balance
        savingsPlatformBalance += returnAmount;
      }
    }

    // Remove completed investments
    const completedInvestments = activeVehicleInvestments.filter(
      inv => (month - inv.startMonth) > vehicleInvestment.investmentPeriod || inv.totalReturned >= inv.totalExpected
    );
    activeVehicleInvestments.splice(0, completedInvestments.length);

    // Calculate total returns for the month
    const monthlyReturns = (investmentPlatformInterest * currentExchangeRate) + vehicleReturns;
    totalReturns += monthlyReturns;

    // Record monthly breakdown
    const isInvestmentMonth = month % vehicleInvestment.cyclePeriod === 0 && savingsPlatformBalance >= currentInvestmentCost * vehiclesPerCycle;
    monthlyBreakdown.push({
      month,
      savingsPlatformBalance,
      investmentPlatformBalance: investmentPlatformBalance * currentExchangeRate,
      vehicleBalance,
      totalBalance: savingsPlatformBalance + (investmentPlatformBalance * currentExchangeRate) + vehicleBalance,
      savingsPlatformInterest,
      investmentPlatformInterest: investmentPlatformInterest * currentExchangeRate,
      vehicleReturns,
      currencyGain: (investmentPlatformBalance * currentExchangeRate) - (investmentPlatformBalance * exchangeRate),
      monthlySavingsPlatformSavings,
      exchangeRate: currentExchangeRate,
      vehicleInvestment: isInvestmentMonth ? currentInvestmentCost * vehiclesPerCycle : 0,
    });
  }

  // Calculate final results
  const finalExchangeRate = exchangeRate * (1 + monthlyUsdAppreciationRate) ** analysisPeriod;
  const finalInvestmentPlatformBalance = investmentPlatformBalance * finalExchangeRate;
  const currencyGain = finalInvestmentPlatformBalance - (initialInvestmentPlatformBalance * exchangeRate);

  return {
    totalInvestment,
    totalReturns,
    totalROI: (totalReturns / totalInvestment) * 100,

    savingsPlatformResults: {
      totalInvestment: initialSavingsPlatformBalance + (monthlySavingsPlatformSavings * analysisPeriod),
      totalReturns: savingsPlatformBalance - (initialSavingsPlatformBalance + (monthlySavingsPlatformSavings * analysisPeriod)),
      finalBalance: savingsPlatformBalance,
      roi: ((savingsPlatformBalance - (initialSavingsPlatformBalance + (monthlySavingsPlatformSavings * analysisPeriod))) /
        (initialSavingsPlatformBalance + (monthlySavingsPlatformSavings * analysisPeriod))) * 100,
    },

    investmentPlatformResults: {
      totalInvestment: initialInvestmentPlatformBalance * exchangeRate,
      totalReturns: finalInvestmentPlatformBalance - (initialInvestmentPlatformBalance * exchangeRate),
      finalBalance: finalInvestmentPlatformBalance,
      roi: ((finalInvestmentPlatformBalance - (initialInvestmentPlatformBalance * exchangeRate)) / (initialInvestmentPlatformBalance * exchangeRate)) * 100,
      finalUsdBalance: investmentPlatformBalance,
      currencyGain,
    },

    vehicleResults: {
      totalInvestment: activeVehicleInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0),
      totalReturns: vehicleBalance,
      finalBalance: vehicleBalance,
      roi: (vehicleBalance / activeVehicleInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0)) * 100,
      completedCycles: Math.floor(analysisPeriod / vehicleInvestment.cyclePeriod),
    },

    monthlyBreakdown,
  };
}