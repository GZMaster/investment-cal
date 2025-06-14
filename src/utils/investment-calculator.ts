import { MONTH_NAMES } from '../constants/investment'
import type { InvestmentResult, MonthlyData, InvestmentScenario } from '../types/investment'

export function calculateCompoundEarnings(
  years: number,
  principal: number,
  annualRate: number,
  monthlySavings: number,
): number {
  const monthlyRate = annualRate / 12
  const totalMonths = years * 12

  let currentPrincipal = principal
  let totalInterest = 0

  // Calculate month by month to handle growing principal
  for (let month = 1; month <= totalMonths; month++) {
    // Add monthly savings to principal
    currentPrincipal += monthlySavings

    // Calculate interest for this month
    const monthlyInterest = currentPrincipal * monthlyRate
    totalInterest += monthlyInterest

    // Add interest to principal for next month
    currentPrincipal += monthlyInterest
  }

  return totalInterest
}

export function calculateMonthlyData(
  month: number,
  totalMonths: number,
  scenario: InvestmentScenario,
  realTimeRate?: number,
): MonthlyData {
  const {
    baseExchangeRate,
    piggyVestAnnualRate,
    riseVestAnnualRate,
    monthlySavings,
    principal,
    appreciation,
    useRealTimeRate,
  } = scenario

  const monthlyAppreciationRate = useRealTimeRate ? (1 + appreciation / 100) ** (1 / 12) - 1 : (1 + appreciation / 100) ** (1 / 12) - 1
  const effectiveRate = useRealTimeRate
    ? (realTimeRate ?? baseExchangeRate) * (1 + monthlyAppreciationRate) ** month
    : baseExchangeRate * (1 + monthlyAppreciationRate) ** month
  const monthlyPiggyVestRate = piggyVestAnnualRate / 12
  const monthlyRiseVestRate = riseVestAnnualRate / 12

  // Calculate current PiggyVest balance including monthly additions
  const piggyVestBalance = principal + monthlySavings * (month - 1)
  // Calculate current month's PiggyVest interest
  const piggyVestInterest = piggyVestBalance * monthlyPiggyVestRate

  // Convert PiggyVest interest to USD for RiseVest
  const monthlyUSDConversion = piggyVestInterest / baseExchangeRate
  const cumulativeUSD = monthlyUSDConversion * month
  const usdInterest = cumulativeUSD * monthlyRiseVestRate
  const usdValue = cumulativeUSD * effectiveRate

  // Total earnings = PiggyVest interest + RiseVest USD interest converted to Naira
  const totalEarnings = piggyVestInterest + usdInterest * effectiveRate

  return {
    month: `${MONTH_NAMES[(month - 1) % 12]}${totalMonths > 12 ? ` Y${Math.ceil(month / 12)}` : ''}`,
    piggyVestBalance,
    nairaInterest: piggyVestInterest,
    usdAdded: monthlyUSDConversion,
    cumulativeUSD,
    usdInterest,
    exchangeRate: effectiveRate,
    usdValue,
    totalEarnings,
  }
}

export function calculateInvestmentResult(
  scenario: InvestmentScenario,
  realTimeRate?: number,
): InvestmentResult {
  const {
    appreciation,
    timePeriod,
    baseExchangeRate,
    riseVestAnnualRate,
    monthlySavings,
    principal,
    piggyVestAnnualRate,
    useRealTimeRate,
  } = scenario

  const totalMonths = timePeriod * 12
  const finalExchangeRate = useRealTimeRate
    ? (realTimeRate ?? baseExchangeRate) * (1 + appreciation / 100) ** timePeriod
    : baseExchangeRate * (1 + appreciation / 100) ** timePeriod
  const monthlyPiggyVestRate = piggyVestAnnualRate / 12
  const monthlyRiseVestRate = riseVestAnnualRate / 12

  let currentPrincipal = principal
  let totalPiggyVestInterest = 0
  let cumulativeUSD = 0
  let totalUSDInterest = 0

  // Calculate month by month
  for (let month = 1; month <= totalMonths; month++) {
    // Add monthly savings to PiggyVest at the start of the month
    if (month > 1) {
      currentPrincipal += monthlySavings
    }

    // Calculate PiggyVest interest for this month
    const piggyVestInterest = currentPrincipal * monthlyPiggyVestRate
    totalPiggyVestInterest += piggyVestInterest

    // Convert PiggyVest interest to USD for RiseVest
    const monthlyUSDConversion = piggyVestInterest / baseExchangeRate
    cumulativeUSD += monthlyUSDConversion

    // Calculate RiseVest USD interest
    const usdInterest = cumulativeUSD * monthlyRiseVestRate
    totalUSDInterest += usdInterest
  }

  const finalUSDValue = (cumulativeUSD + totalUSDInterest) * finalExchangeRate
  const currencyAppreciationGain = cumulativeUSD * (finalExchangeRate - baseExchangeRate)

  // For comparison, calculate what would happen if we kept everything in PiggyVest
  const compoundEarnings = calculateCompoundEarnings(
    timePeriod,
    principal,
    piggyVestAnnualRate,
    monthlySavings,
  )

  // Total earnings = PiggyVest interest + RiseVest USD interest converted to Naira
  const totalTwoTierEarnings =
    totalPiggyVestInterest + totalUSDInterest * finalExchangeRate + currencyAppreciationGain

  return {
    compoundEarnings,
    twoTierEarnings: totalTwoTierEarnings,
    finalExchangeRate,
    usdValue: finalUSDValue,
    totalUSD: cumulativeUSD,
    currencyGain: currencyAppreciationGain,
  }
}

export function formatCurrency(amount: number): string {
  return `₦${Math.round(amount).toLocaleString()}`
}

export function calculateBreakevenPoint(
  compoundEarnings: number,
  totalNairaFromInterest: number,
  baseUSDInterest: number,
  totalUSD: number,
  baseExchangeRate: number,
): number {
  return (
    ((compoundEarnings - totalNairaFromInterest - baseUSDInterest) /
      (totalUSD * baseExchangeRate)) *
    100
  )
}

export function formatMonthNumber(monthNumber: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = Math.floor((monthNumber - 1) / 12) + 1;
  const monthIndex = (monthNumber - 1) % 12;
  return `${months[monthIndex]} Y${year}`;
}
