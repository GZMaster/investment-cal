import { useQuery } from '@tanstack/react-query'
import type { InvestmentScenario } from '../types/investment'

interface ExchangeRateData {
  rate: number
  expectedAppreciation: number
}

async function fetchExchangeRates(): Promise<ExchangeRateData> {
  try {
    // Using ExchangeRate-API (free tier)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
    const data = await response.json()

    if (!data.rates || !data.rates.NGN) {
      throw new Error('Failed to fetch exchange rate')
    }

    const currentRate = data.rates.NGN

    // For now, we'll use a fixed expected appreciation rate since historical data
    // requires a paid API subscription. This can be updated later with a more
    // sophisticated calculation or a different API.
    const expectedAppreciation = 10 // 10% annual appreciation as a default estimate

    return {
      rate: currentRate,
      expectedAppreciation,
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    throw new Error('Failed to fetch exchange rates. Please try again later.')
  }
}

export function useExchangeRate() {
  const query = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: fetchExchangeRates,
    retry: 3, // Retry failed requests 3 times
  })

  const updateScenarioWithRates = (scenario: InvestmentScenario): InvestmentScenario => {
    if (query.data) {
      return {
        ...scenario,
        baseExchangeRate: query.data.rate,
        appreciation: query.data.expectedAppreciation,
      }
    }
    return scenario
  }

  return {
    ...query,
    updateScenarioWithRates,
  }
}
