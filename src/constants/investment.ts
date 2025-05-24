import type { InvestmentConstants } from "../types/investment";

export const INVESTMENT_CONSTANTS: InvestmentConstants = {
	baseExchangeRate: 1650,
	monthlyNairaInterest: 150000, // Initial interest on 10M at 18% per annum (10M * 0.18 / 12)
	monthlyUSDRate: 0.08 / 12, // 8% per annum converted to monthly rate
	annualCompoundRate: 0.18, // 18% per annum
	principal: 10000000, // Initial 10M in PiggyVest
	monthlySavings: 1000000, // 1M monthly addition to PiggyVest
};

export const MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export const APPRECIATION_RATES = [0, 5, 10, 15, 20, 25];
export const TIME_PERIODS = [1, 2, 3, 4];
