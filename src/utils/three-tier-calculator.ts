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

  for (let month = 1; month <= analysisPeriod; month++) {
    // Calculate PiggyVest interest
    const piggyVestInterest = piggyVestBalance * monthlyPiggyVestRate;
    piggyVestBalance += piggyVestInterest + monthlyPiggyVestSavings;

    // Calculate RiseVest interest and USD appreciation
    const riseVestInterest = riseVestBalance * monthlyRiseVestRate;
    const usdAppreciation = riseVestBalance * monthlyUsdAppreciationRate;
    riseVestBalance += riseVestInterest;

    // Calculate current exchange rate with appreciation
    const currentExchangeRate = exchangeRate * Math.pow(1 + monthlyUsdAppreciationRate, month);

    // Process vehicle investments
    let vehicleReturns = 0;
    if (month % vehicleInvestment.cyclePeriod === 0 && piggyVestBalance >= vehicleInvestment.investmentCost * vehiclesPerCycle) {
      const investmentAmount = vehicleInvestment.investmentCost * vehiclesPerCycle;
      piggyVestBalance -= investmentAmount;
      totalInvestment += investmentAmount;

      // Add new investments
      for (let i = 0; i < vehiclesPerCycle; i++) {
        activeVehicleInvestments.push({
          startMonth: month,
          investmentAmount,
          monthlyReturn: vehicleInvestment.returnAmount / vehicleInvestment.investmentPeriod,
          totalReturned: 0,
          totalExpected: vehicleInvestment.returnAmount,
        });
      }
    }

    // Process returns from active vehicle investments
    activeVehicleInvestments.forEach((investment) => {
      const monthsSinceStart = month - investment.startMonth;
      if (monthsSinceStart > 0 && monthsSinceStart <= vehicleInvestment.investmentPeriod && investment.totalReturned < investment.totalExpected) {
        const returnAmount = investment.monthlyReturn;
        investment.totalReturned += returnAmount;
        vehicleReturns += returnAmount;
        vehicleBalance += returnAmount;
      }
    });

    // Remove completed investments
    const completedInvestments = activeVehicleInvestments.filter(
      inv => (month - inv.startMonth) > vehicleInvestment.investmentPeriod || inv.totalReturned >= inv.totalExpected
    );
    activeVehicleInvestments.splice(0, completedInvestments.length);

    // Calculate total returns for the month
    const monthlyReturns = piggyVestInterest + (riseVestInterest * currentExchangeRate) + vehicleReturns;
    totalReturns += monthlyReturns;

    // Record monthly breakdown
    const isInvestmentMonth = month % vehicleInvestment.cyclePeriod === 0 && piggyVestBalance >= vehicleInvestment.investmentCost * vehiclesPerCycle;
    monthlyBreakdown.push({
      month,
      piggyVestBalance,
      riseVestBalance: riseVestBalance * currentExchangeRate,
      vehicleBalance,
      totalBalance: piggyVestBalance + (riseVestBalance * currentExchangeRate) + vehicleBalance,
      piggyVestInterest,
      riseVestInterest: riseVestInterest * currentExchangeRate,
      vehicleReturns,
      currencyGain: usdAppreciation * currentExchangeRate,
      monthlyPiggyVestSavings,
      exchangeRate: currentExchangeRate,
      vehicleInvestment: isInvestmentMonth ? vehicleInvestment.investmentCost * vehiclesPerCycle : 0,
    });
  }

  // Calculate final results
  const finalExchangeRate = exchangeRate * Math.pow(1 + monthlyUsdAppreciationRate, analysisPeriod);
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