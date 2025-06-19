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
    savingsPlatformAnnualRate,
    investmentPlatformAnnualRate,
    monthlySavings,
    principal,
    appreciation,
    useRealTimeRate,
  } = scenario

  const monthlyAppreciationRate = useRealTimeRate ? (1 + appreciation / 100) ** (1 / 12) - 1 : (1 + appreciation / 100) ** (1 / 12) - 1
  const effectiveRate = useRealTimeRate
    ? (realTimeRate ?? baseExchangeRate) * (1 + monthlyAppreciationRate) ** month
    : baseExchangeRate * (1 + monthlyAppreciationRate) ** month
  const monthlySavingsPlatformRate = savingsPlatformAnnualRate / 12
  const monthlyInvestmentPlatformRate = investmentPlatformAnnualRate / 12

  // Calculate current savings platform balance including monthly additions
  const savingsPlatformBalance = principal + monthlySavings * (month - 1)
  // Calculate current month's savings platform interest
  const savingsPlatformInterest = savingsPlatformBalance * monthlySavingsPlatformRate

  // Convert savings platform interest to USD for investment platform
  const monthlyUSDConversion = savingsPlatformInterest / baseExchangeRate
  const cumulativeUSD = monthlyUSDConversion * month
  const usdInterest = cumulativeUSD * monthlyInvestmentPlatformRate
  const usdValue = cumulativeUSD * effectiveRate

  // Total earnings = savings platform interest + investment platform USD interest converted to Naira
  const totalEarnings = savingsPlatformInterest + usdInterest * effectiveRate

  return {
    month: `${MONTH_NAMES[(month - 1) % 12]}${totalMonths > 12 ? ` Y${Math.ceil(month / 12)}` : ''}`,
    savingsPlatformBalance,
    nairaInterest: savingsPlatformInterest,
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
    investmentPlatformAnnualRate,
    monthlySavings,
    principal,
    savingsPlatformAnnualRate,
    useRealTimeRate,
  } = scenario

  const totalMonths = timePeriod * 12
  const finalExchangeRate = useRealTimeRate
    ? (realTimeRate ?? baseExchangeRate) * (1 + appreciation / 100) ** timePeriod
    : baseExchangeRate * (1 + appreciation / 100) ** timePeriod
  const monthlySavingsPlatformRate = savingsPlatformAnnualRate / 12
  const monthlyInvestmentPlatformRate = investmentPlatformAnnualRate / 12

  let currentPrincipal = principal
  let totalSavingsPlatformInterest = 0
  let cumulativeUSD = 0
  let totalUSDInterest = 0

  // Calculate month by month
  for (let month = 1; month <= totalMonths; month++) {
    // Add monthly savings to savings platform at the start of the month
    if (month > 1) {
      currentPrincipal += monthlySavings
    }

    // Calculate savings platform interest for this month
    const savingsPlatformInterest = currentPrincipal * monthlySavingsPlatformRate
    totalSavingsPlatformInterest += savingsPlatformInterest

    // Convert savings platform interest to USD for investment platform
    const monthlyUSDConversion = savingsPlatformInterest / baseExchangeRate
    cumulativeUSD += monthlyUSDConversion

    // Calculate investment platform USD interest
    const usdInterest = cumulativeUSD * monthlyInvestmentPlatformRate
    totalUSDInterest += usdInterest
  }

  const finalUSDValue = (cumulativeUSD + totalUSDInterest) * finalExchangeRate
  const currencyAppreciationGain = cumulativeUSD * (finalExchangeRate - baseExchangeRate)

  // For comparison, calculate what would happen if we kept everything in savings platform
  const compoundEarnings = calculateCompoundEarnings(
    timePeriod,
    principal,
    savingsPlatformAnnualRate,
    monthlySavings,
  )

  // Total earnings = savings platform interest + investment platform USD interest converted to Naira
  const totalTwoTierEarnings =
    totalSavingsPlatformInterest + totalUSDInterest * finalExchangeRate + currencyAppreciationGain

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
