import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dexscreenerAPI, type CryptoMarketData } from '../utils/dexscreener-api';

// Query keys for React Query
export const cryptoQueryKeys = {
  all: ['crypto'] as const,
  top: (limit: number) => [...cryptoQueryKeys.all, 'top', limit] as const,
  byId: (id: string) => [...cryptoQueryKeys.all, 'byId', id] as const,
  search: (query: string) => [...cryptoQueryKeys.all, 'search', query] as const,
  trending: () => [...cryptoQueryKeys.all, 'trending'] as const,
  global: () => [...cryptoQueryKeys.all, 'global'] as const,
  exchangeRates: () => [...cryptoQueryKeys.all, 'exchangeRates'] as const,
  historical: (id: string, days: number) => [...cryptoQueryKeys.all, 'historical', id, days] as const,
  staking: (symbol: string) => [...cryptoQueryKeys.all, 'staking', symbol] as const,
  defiYield: (symbol: string) => [...cryptoQueryKeys.all, 'defiYield', symbol] as const,
};

// Hook to get top cryptocurrencies
export function useTopCryptocurrencies(limit = 100) {
  return useQuery({
    queryKey: cryptoQueryKeys.top(limit),
    queryFn: () => dexscreenerAPI.getTopCryptocurrencies(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook to get specific cryptocurrency by ID
export function useCryptocurrencyById(id: string) {
  return useQuery({
    queryKey: cryptoQueryKeys.byId(id),
    queryFn: () => dexscreenerAPI.getCryptocurrencyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook to search cryptocurrencies
export function useSearchCryptocurrencies(query: string) {
  return useQuery({
    queryKey: cryptoQueryKeys.search(query),
    queryFn: () => dexscreenerAPI.searchCryptocurrencies(query),
    enabled: !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook to get trending cryptocurrencies
export function useTrendingCryptocurrencies() {
  return useQuery({
    queryKey: cryptoQueryKeys.trending(),
    queryFn: () => dexscreenerAPI.getTrendingCryptocurrencies(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook to get global market data
export function useGlobalMarketData() {
  return useQuery({
    queryKey: cryptoQueryKeys.global(),
    queryFn: () => dexscreenerAPI.getGlobalMarketData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook to get exchange rates
export function useExchangeRates() {
  return useQuery({
    queryKey: cryptoQueryKeys.exchangeRates(),
    queryFn: () => dexscreenerAPI.getExchangeRates(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook to get historical data
export function useHistoricalData(id: string, days = 30) {
  return useQuery({
    queryKey: cryptoQueryKeys.historical(id, days),
    queryFn: () => dexscreenerAPI.getHistoricalData(id, days),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook to get staking information
export function useStakingInfo(symbol: string) {
  return useQuery({
    queryKey: cryptoQueryKeys.staking(symbol),
    queryFn: () => dexscreenerAPI.getStakingInfo(symbol),
    enabled: !!symbol,
    staleTime: 10 * 60 * 1000, // 10 minutes (staking rates don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}

// Hook to get DeFi yield rates
export function useDefiYieldRates(symbol: string) {
  return useQuery({
    queryKey: cryptoQueryKeys.defiYield(symbol),
    queryFn: () => dexscreenerAPI.getDefiYieldRates(symbol),
    enabled: !!symbol,
    staleTime: 10 * 60 * 1000, // 10 minutes (yield rates don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}

// Hook to refresh crypto data
export function useRefreshCryptoData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('Starting crypto data refresh...');

      try {
        // Clear the DexScreener API cache first
        dexscreenerAPI.clearCache();
        console.log('DexScreener API cache cleared');

        // Invalidate all crypto-related queries
        await queryClient.invalidateQueries({ queryKey: cryptoQueryKeys.all });
        console.log('React Query cache invalidated');

        // Force refetch of critical data
        await Promise.all([
          queryClient.refetchQueries({ queryKey: cryptoQueryKeys.top(100) }),
          queryClient.refetchQueries({ queryKey: cryptoQueryKeys.global() }),
          queryClient.refetchQueries({ queryKey: cryptoQueryKeys.exchangeRates() }),
        ]);
        console.log('Critical queries refetched');
      } catch (error) {
        console.error('Error during refresh:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('✅ Crypto data refreshed successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to refresh crypto data:', error);
    },
  });
}

// Hook to refresh portfolio data (separate from crypto data refresh)
export function useRefreshPortfolioData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('Starting portfolio data refresh...');

      try {
        // Get fresh crypto data for portfolio updates
        const topCrypto = await dexscreenerAPI.getTopCryptocurrencies(100);
        console.log('Fresh crypto data fetched for portfolio update');

        // Return the fresh data so components can update their portfolio
        return topCrypto;
      } catch (error) {
        console.error('Error during portfolio refresh:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('✅ Portfolio data refreshed successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to refresh portfolio data:', error);
    },
  });
}

// Hook to get multiple cryptocurrencies by IDs
export function useMultipleCryptocurrencies(ids: string[]) {
  return useQuery({
    queryKey: [...cryptoQueryKeys.all, 'multiple', ids],
    queryFn: async () => {
      const promises = ids.map(id => dexscreenerAPI.getCryptocurrencyById(id));
      return Promise.all(promises);
    },
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook to get crypto data with error handling and loading states
export function useCryptoDataWithStatus() {
  const topCrypto = useTopCryptocurrencies();
  const globalData = useGlobalMarketData();
  const exchangeRates = useExchangeRates();

  const isLoading = topCrypto.isLoading || globalData.isLoading || exchangeRates.isLoading;
  const isError = topCrypto.isError || globalData.isError || exchangeRates.isError;
  const error = topCrypto.error || globalData.error || exchangeRates.error;

  return {
    topCrypto: topCrypto.data || [],
    globalData: globalData.data,
    exchangeRates: exchangeRates.data,
    isLoading,
    isError,
    error,
    refetch: () => {
      topCrypto.refetch();
      globalData.refetch();
      exchangeRates.refetch();
    },
  };
}

// Utility function to find crypto by symbol
export function findCryptoBySymbol(cryptoList: CryptoMarketData[], symbol: string): CryptoMarketData | undefined {
  return cryptoList.find(crypto =>
    crypto.symbol.toLowerCase() === symbol.toLowerCase() ||
    crypto.id.toLowerCase() === symbol.toLowerCase()
  );
}

// Utility function to get crypto price by symbol
export function getCryptoPrice(cryptoList: CryptoMarketData[], symbol: string): number | null {
  const crypto = findCryptoBySymbol(cryptoList, symbol);
  return crypto?.current_price || null;
}

// Utility function to get crypto price change by symbol
export function getCryptoPriceChange(cryptoList: CryptoMarketData[], symbol: string): number | null {
  const crypto = findCryptoBySymbol(cryptoList, symbol);
  return crypto?.price_change_percentage_24h || null;
} 