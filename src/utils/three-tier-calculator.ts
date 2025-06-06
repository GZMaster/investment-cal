import type { ThreeTierStrategyScenario, ThreeTierStrategyResult } from '../types/investment';

export function calculateThreeTierStrategy(scenario: ThreeTierStrategyScenario): ThreeTierStrategyResult {
  const {
    initialPiggyVestBalance,
    monthlyPiggyVestSavings,
    piggyVestInterestRate,
    initialRiseVestBalance,
    riseVestInterestRate,
    usdAppreciationRate,
    exchangeRate,
    vehicleInvestment,
    vehiclesPerCycle,
    analysisPeriod,
    piggyVestInterestReinvestPercentage,
  } = scenario;

  // Initialize results
  let piggyVestBalance = initialPiggyVestBalance;
  let riseVestBalance = initialRiseVestBalance;
  let vehicleBalance = 0;
  let totalInvestment = initialPiggyVestBalance + (initialRiseVestBalance * exchangeRate);
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
  const monthlyPiggyVestRate = piggyVestInterestRate / 100 / 12;
  const monthlyRiseVestRate = riseVestInterestRate / 100 / 12;
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

    // Calculate PiggyVest interest
    const piggyVestInterest = piggyVestBalance * monthlyPiggyVestRate;

    // Calculate how much interest to reinvest in RiseVest
    const interestToReinvest = piggyVestInterest * (piggyVestInterestReinvestPercentage / 100);
    const interestToKeep = piggyVestInterest - interestToReinvest;

    // Convert reinvested interest to USD and add to RiseVest balance
    const piggyVestInterestInUsd = interestToReinvest / currentExchangeRate;
    riseVestBalance += piggyVestInterestInUsd;

    // Calculate RiseVest interest on the new balance
    const riseVestInterest = riseVestBalance * monthlyRiseVestRate;
    riseVestBalance += riseVestInterest;

    // Add monthly savings and remaining interest to PiggyVest
    piggyVestBalance += monthlyPiggyVestSavings + interestToKeep;

    // Process vehicle investments
    let vehicleReturns = 0;
    if (month % vehicleInvestment.cyclePeriod === 0 && piggyVestBalance >= currentInvestmentCost * vehiclesPerCycle) {
      const investmentAmount = currentInvestmentCost * vehiclesPerCycle;
      piggyVestBalance -= investmentAmount;
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

        // Add vehicle returns back to PiggyVest balance
        piggyVestBalance += returnAmount;
      }
    }

    // Remove completed investments
    const completedInvestments = activeVehicleInvestments.filter(
      inv => (month - inv.startMonth) > vehicleInvestment.investmentPeriod || inv.totalReturned >= inv.totalExpected
    );
    activeVehicleInvestments.splice(0, completedInvestments.length);

    // Calculate total returns for the month
    const monthlyReturns = (riseVestInterest * currentExchangeRate) + vehicleReturns;
    totalReturns += monthlyReturns;

    // Record monthly breakdown
    const isInvestmentMonth = month % vehicleInvestment.cyclePeriod === 0 && piggyVestBalance >= currentInvestmentCost * vehiclesPerCycle;
    monthlyBreakdown.push({
      month,
      piggyVestBalance,
      riseVestBalance: riseVestBalance * currentExchangeRate,
      vehicleBalance,
      totalBalance: piggyVestBalance + (riseVestBalance * currentExchangeRate) + vehicleBalance,
      piggyVestInterest,
      riseVestInterest: riseVestInterest * currentExchangeRate,
      vehicleReturns,
      currencyGain: (riseVestBalance * currentExchangeRate) - (riseVestBalance * exchangeRate),
      monthlyPiggyVestSavings,
      exchangeRate: currentExchangeRate,
      vehicleInvestment: isInvestmentMonth ? currentInvestmentCost * vehiclesPerCycle : 0,
    });
  }

  // Calculate final results
  const finalExchangeRate = exchangeRate * (1 + monthlyUsdAppreciationRate) ** analysisPeriod;
  const finalRiseVestBalance = riseVestBalance * finalExchangeRate;
  const currencyGain = finalRiseVestBalance - (initialRiseVestBalance * exchangeRate);

  return {
    totalInvestment,
    totalReturns,
    totalROI: (totalReturns / totalInvestment) * 100,

    piggyVestResults: {
      totalInvestment: initialPiggyVestBalance + (monthlyPiggyVestSavings * analysisPeriod),
      totalReturns: piggyVestBalance - (initialPiggyVestBalance + (monthlyPiggyVestSavings * analysisPeriod)),
      finalBalance: piggyVestBalance,
      roi: ((piggyVestBalance - (initialPiggyVestBalance + (monthlyPiggyVestSavings * analysisPeriod))) /
        (initialPiggyVestBalance + (monthlyPiggyVestSavings * analysisPeriod))) * 100,
    },

    riseVestResults: {
      totalInvestment: initialRiseVestBalance * exchangeRate,
      totalReturns: finalRiseVestBalance - (initialRiseVestBalance * exchangeRate),
      finalBalance: finalRiseVestBalance,
      roi: ((finalRiseVestBalance - (initialRiseVestBalance * exchangeRate)) / (initialRiseVestBalance * exchangeRate)) * 100,
      finalUsdBalance: riseVestBalance,
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