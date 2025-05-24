export interface InvestmentScenario {
	appreciation: number;
	timePeriod: number;
}

export interface InvestmentResult {
	compoundEarnings: number;
	twoTierEarnings: number;
	finalExchangeRate: number;
	usdValue: number;
	totalUSD: number;
	currencyGain: number;
}

export interface MonthlyData {
	month: string;
	piggyVestBalance: number;
	nairaInterest: number;
	usdAdded: number;
	cumulativeUSD: number;
	usdInterest: number;
	exchangeRate: number;
	usdValue: number;
	totalEarnings: number;
}

export interface InvestmentConstants {
	baseExchangeRate: number;
	monthlyNairaInterest: number;
	monthlyUSDRate: number;
	annualCompoundRate: number;
	principal: number;
	monthlySavings: number;
}
