import { INVESTMENT_CONSTANTS, MONTH_NAMES } from "../constants/investment";
import type {
	InvestmentResult,
	MonthlyData,
	InvestmentScenario,
} from "../types/investment";

export function calculateCompoundEarnings(years: number): number {
	const { principal, annualCompoundRate, monthlySavings } =
		INVESTMENT_CONSTANTS;
	const monthlyRate = annualCompoundRate / 12;
	const totalMonths = years * 12;

	let currentPrincipal = principal;
	let totalInterest = 0;

	// Calculate month by month to handle growing principal
	for (let month = 1; month <= totalMonths; month++) {
		// Add monthly savings to principal
		currentPrincipal += monthlySavings;

		// Calculate interest for this month
		const monthlyInterest = currentPrincipal * monthlyRate;
		totalInterest += monthlyInterest;

		// Add interest to principal for next month
		currentPrincipal += monthlyInterest;
	}

	// Return total interest earned
	return totalInterest;
}

export function calculateMonthlyData(
	month: number,
	totalMonths: number,
	monthlyAppreciationRate: number,
): MonthlyData {
	const {
		baseExchangeRate,
		monthlyUSDRate,
		monthlySavings,
		principal,
		annualCompoundRate,
	} = INVESTMENT_CONSTANTS;

	const currentRate = baseExchangeRate * (1 + monthlyAppreciationRate) ** month;
	const monthlyRate = annualCompoundRate / 12;

	// Calculate current PiggyVest balance including monthly additions
	const piggyVestBalance = principal + monthlySavings * (month - 1); // Subtract 1 because we add at the start of the month
	// Calculate current month's PiggyVest interest
	const piggyVestInterest = piggyVestBalance * monthlyRate;

	// Convert PiggyVest interest to USD for RiseVest
	const monthlyUSDConversion = piggyVestInterest / baseExchangeRate;
	const cumulativeUSD = monthlyUSDConversion * month;
	const usdInterest = cumulativeUSD * monthlyUSDRate;
	const usdValue = cumulativeUSD * currentRate;

	// Total earnings = PiggyVest interest + RiseVest USD interest converted to Naira
	const totalEarnings = piggyVestInterest + usdInterest * currentRate;

	return {
		month: `${MONTH_NAMES[(month - 1) % 12]}${totalMonths > 12 ? ` Y${Math.ceil(month / 12)}` : ""}`,
		piggyVestBalance,
		nairaInterest: piggyVestInterest,
		usdAdded: monthlyUSDConversion,
		cumulativeUSD,
		usdInterest,
		exchangeRate: currentRate,
		usdValue,
		totalEarnings,
	};
}

export function calculateInvestmentResult(
	scenario: InvestmentScenario,
): InvestmentResult {
	const { appreciation, timePeriod } = scenario;
	const {
		baseExchangeRate,
		monthlyUSDRate,
		monthlySavings,
		principal,
		annualCompoundRate,
	} = INVESTMENT_CONSTANTS;

	const totalMonths = timePeriod * 12;
	const finalExchangeRate =
		baseExchangeRate * (1 + appreciation / 100) ** timePeriod;
	const monthlyAppreciationRate = (1 + appreciation / 100) ** (1 / 12) - 1;
	const monthlyRate = annualCompoundRate / 12;

	let currentPrincipal = principal;
	let totalPiggyVestInterest = 0;
	let cumulativeUSD = 0;
	let totalUSDInterest = 0;

	// Calculate month by month
	for (let month = 1; month <= totalMonths; month++) {
		// Add monthly savings to PiggyVest at the start of the month
		if (month > 1) {
			// Skip first month as we start with 10M
			currentPrincipal += monthlySavings;
		}

		// Calculate PiggyVest interest for this month
		const piggyVestInterest = currentPrincipal * monthlyRate;
		totalPiggyVestInterest += piggyVestInterest;

		// Convert PiggyVest interest to USD for RiseVest
		const monthlyUSDConversion = piggyVestInterest / baseExchangeRate;
		cumulativeUSD += monthlyUSDConversion;

		// Calculate RiseVest USD interest
		const usdInterest = cumulativeUSD * monthlyUSDRate;
		totalUSDInterest += usdInterest;
	}

	const finalUSDValue = (cumulativeUSD + totalUSDInterest) * finalExchangeRate;
	const currencyAppreciationGain =
		cumulativeUSD * (finalExchangeRate - baseExchangeRate);

	// For comparison, calculate what would happen if we kept everything in PiggyVest
	const compoundEarnings = calculateCompoundEarnings(timePeriod);

	// Total earnings = PiggyVest interest + RiseVest USD interest converted to Naira
	const totalTwoTierEarnings =
		totalPiggyVestInterest +
		totalUSDInterest * finalExchangeRate +
		currencyAppreciationGain;

	return {
		compoundEarnings,
		twoTierEarnings: totalTwoTierEarnings,
		finalExchangeRate,
		usdValue: finalUSDValue,
		totalUSD: cumulativeUSD,
		currencyGain: currencyAppreciationGain,
	};
}

export function formatCurrency(amount: number): string {
	return `₦${Math.round(amount).toLocaleString()}`;
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
	);
}
