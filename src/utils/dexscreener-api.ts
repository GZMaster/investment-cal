import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

// DexScreener API base URL
const DEXSCREENER_BASE_URL = 'https://api.dexscreener.com';

// Rate limits from DexScreener API docs
const RATE_LIMITS = {
  tokenProfiles: 60, // requests per minute
  pairs: 300, // requests per minute
};

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels: string[];
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: Record<string, {
    buys: number;
    sells: number;
  }>;
  volume: Record<string, number>;
  priceChange: Record<string, number>;
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info?: {
    imageUrl?: string;
    websites?: Array<{ url: string }>;
    socials?: Array<{ platform: string; handle: string }>;
  };
  boosts?: {
    active: number;
  };
}

export interface DexScreenerTokenProfile {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon?: string;
  header?: string;
  description?: string;
  links?: Array<{
    type: string;
    label: string;
    url: string;
  }>;
}

export interface DexScreenerBoostedToken {
  url: string;
  chainId: string;
  tokenAddress: string;
  amount: number;
  totalAmount: number;
  icon?: string;
  header?: string;
  description?: string;
  links?: Array<{
    type: string;
    label: string;
    url: string;
  }>;
}

export interface DexScreenerOrder {
  type: string;
  status: string;
  paymentTimestamp: number;
}

// Transformed data interfaces for compatibility with existing components
export interface CryptoMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
  chainId?: string;
  dexId?: string;
  pairAddress?: string;
  liquidity_usd?: number;
  fdv?: number;
}

export interface GlobalMarketData {
  data: {
    active_cryptocurrencies: number;
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
  };
}

export interface StakingInfo {
  assetId: string;
  stakingRate: number;
  minimumStake: number;
  lockPeriod: number;
  rewards: number;
  lastRewardDate: Date;
}

class DexScreenerAPIService {
  private axiosInstance: AxiosInstance;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: DEXSCREENER_BASE_URL,
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Investment-Calculator/1.0',
      },
    });

    // Add response interceptor for rate limiting
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 429) {
          console.warn('Rate limit exceeded, using cached data if available');
        }
        return Promise.reject(error);
      }
    );
  }

  private isCacheValid(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_DURATION;
  }

  private checkRateLimit(endpoint: string, limit: number): boolean {
    const now = Date.now();
    const key = `${endpoint}_${Math.floor(now / 60000)}`; // Group by minute
    const current = this.requestCounts.get(key) || { count: 0, resetTime: now + 60000 };

    if (now > current.resetTime) {
      this.requestCounts.set(key, { count: 1, resetTime: now + 60000 });
      return true;
    }

    if (current.count >= limit) {
      return false;
    }

    current.count++;
    this.requestCounts.set(key, current);
    return true;
  }

  private async makeRequest(url: string, cacheKey?: string, rateLimitKey?: string, rateLimit?: number): Promise<any> {
    // Check cache first
    if (cacheKey && this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log(`Using cached data for: ${cacheKey}`);
        return cached.data;
      }
    }

    // Check rate limit
    if (rateLimitKey && rateLimit && !this.checkRateLimit(rateLimitKey, rateLimit)) {
      console.warn(`Rate limit exceeded for ${rateLimitKey}, using cached data if available`);
      const cached = this.cache.get(cacheKey || '');
      if (cached) {
        return cached.data;
      }
      throw new Error('Rate limit exceeded and no cached data available');
    }

    try {
      console.log(`Making request to: ${url}`);
      const response = await this.axiosInstance.get(url);
      const data = response.data;

      if (cacheKey) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
      }

      return data;
    } catch (error) {
      console.error(`Request failed for ${url}:`, error);

      // Try to return cached data as fallback
      if (cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (cached) {
          console.log(`Returning cached data as fallback for: ${cacheKey}`);
          return cached.data;
        }
      }

      throw error;
    }
  }

  private transformPairToCryptoMarketData(pair: DexScreenerPair): CryptoMarketData {
    const priceUsd = Number.parseFloat(pair.priceUsd) || 0;
    const volume24h = pair.volume['24h'] || 0;
    const priceChange24h = pair.priceChange['24h'] || 0;
    const priceChange7d = pair.priceChange['7d'] || 0;
    const priceChange30d = pair.priceChange['30d'] || 0;

    return {
      id: `${pair.chainId}-${pair.baseToken.address}`,
      symbol: pair.baseToken.symbol,
      name: pair.baseToken.name,
      current_price: priceUsd,
      market_cap: pair.marketCap || 0,
      market_cap_rank: 0, // DexScreener doesn't provide rank
      total_volume: volume24h,
      high_24h: 0, // Not provided by DexScreener
      low_24h: 0, // Not provided by DexScreener
      price_change_24h: priceUsd * (priceChange24h / 100),
      price_change_percentage_24h: priceChange24h,
      price_change_percentage_7d: priceChange7d,
      price_change_percentage_30d: priceChange30d,
      circulating_supply: 0, // Not provided by DexScreener
      total_supply: 0, // Not provided by DexScreener
      max_supply: null, // Not provided by DexScreener
      ath: 0, // Not provided by DexScreener
      ath_change_percentage: 0, // Not provided by DexScreener
      ath_date: '', // Not provided by DexScreener
      atl: 0, // Not provided by DexScreener
      atl_change_percentage: 0, // Not provided by DexScreener
      atl_date: '', // Not provided by DexScreener
      last_updated: new Date().toISOString(),
      chainId: pair.chainId,
      dexId: pair.dexId,
      pairAddress: pair.pairAddress,
      liquidity_usd: pair.liquidity.usd,
      fdv: pair.fdv,
    };
  }

  // Get pairs by chain and pair address
  async getPairsByAddress(chainId: string, pairId: string): Promise<DexScreenerPair[]> {
    const url = `/latest/dex/pairs/${chainId}/${pairId}`;
    const cacheKey = `pairs_${chainId}_${pairId}`;

    const data = await this.makeRequest(url, cacheKey, 'pairs', RATE_LIMITS.pairs);
    return data.pairs || [];
  }

  // Search for pairs matching query
  async searchPairs(query: string): Promise<DexScreenerPair[]> {
    const url = `/latest/dex/search?q=${encodeURIComponent(query)}`;
    const cacheKey = `search_${query}`;

    const data = await this.makeRequest(url, cacheKey, 'pairs', RATE_LIMITS.pairs);
    return data.pairs || [];
  }

  // Get pools of a given token address
  async getTokenPairs(chainId: string, tokenAddress: string): Promise<DexScreenerPair[]> {
    const url = `/token-pairs/v1/${chainId}/${tokenAddress}`;
    const cacheKey = `token_pairs_${chainId}_${tokenAddress}`;

    return this.makeRequest(url, cacheKey, 'pairs', RATE_LIMITS.pairs);
  }

  // Get pairs by token address
  async getPairsByTokenAddress(chainId: string, tokenAddresses: string): Promise<DexScreenerPair[]> {
    const url = `/tokens/v1/${chainId}/${tokenAddresses}`;
    const cacheKey = `token_pairs_${chainId}_${tokenAddresses}`;

    return this.makeRequest(url, cacheKey, 'pairs', RATE_LIMITS.pairs);
  }

  // Get latest token profiles
  async getLatestTokenProfiles(): Promise<DexScreenerTokenProfile[]> {
    const url = '/token-profiles/latest/v1';
    const cacheKey = 'latest_token_profiles';

    const data = await this.makeRequest(url, cacheKey, 'tokenProfiles', RATE_LIMITS.tokenProfiles);
    return Array.isArray(data) ? data : [];
  }

  // Get latest boosted tokens
  async getLatestBoostedTokens(): Promise<DexScreenerBoostedToken[]> {
    const url = '/token-boosts/latest/v1';
    const cacheKey = 'latest_boosted_tokens';

    const data = await this.makeRequest(url, cacheKey, 'tokenProfiles', RATE_LIMITS.tokenProfiles);
    return Array.isArray(data) ? data : [];
  }

  // Get top boosted tokens
  async getTopBoostedTokens(): Promise<DexScreenerBoostedToken[]> {
    const url = '/token-boosts/top/v1';
    const cacheKey = 'top_boosted_tokens';

    const data = await this.makeRequest(url, cacheKey, 'tokenProfiles', RATE_LIMITS.tokenProfiles);
    return Array.isArray(data) ? data : [];
  }

  // Check orders for a token
  async getTokenOrders(chainId: string, tokenAddress: string): Promise<DexScreenerOrder[]> {
    const url = `/orders/v1/${chainId}/${tokenAddress}`;
    const cacheKey = `orders_${chainId}_${tokenAddress}`;

    return this.makeRequest(url, cacheKey, 'tokenProfiles', RATE_LIMITS.tokenProfiles);
  }

  // Get top cryptocurrencies (transformed for compatibility)
  async getTopCryptocurrencies(limit = 100): Promise<CryptoMarketData[]> {
    // Search for major tokens across different chains
    const majorTokens = ['BTC', 'ETH', 'USDC', 'USDT', 'SOL', 'ADA', 'DOT', 'MATIC', 'AVAX', 'LINK'];
    const allPairs: DexScreenerPair[] = [];

    // Search for each major token
    for (const token of majorTokens.slice(0, Math.min(limit, majorTokens.length))) {
      try {
        const pairs = await this.searchPairs(token);
        // Get the pair with highest liquidity for each token
        const bestPair = pairs
          .filter(p => p.baseToken.symbol.toUpperCase() === token)
          .sort((a, b) => (b.liquidity.usd || 0) - (a.liquidity.usd || 0))[0];

        if (bestPair) {
          allPairs.push(bestPair);
        }
      } catch (error) {
        console.warn(`Failed to fetch data for ${token}:`, error);
      }
    }

    // Transform and sort by market cap
    const transformed = allPairs
      .map(pair => this.transformPairToCryptoMarketData(pair))
      .sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0))
      .slice(0, limit);

    return transformed;
  }

  // Get specific cryptocurrency by ID (symbol)
  async getCryptocurrencyById(id: string): Promise<CryptoMarketData> {
    const pairs = await this.searchPairs(id);
    const pair = pairs.find(p =>
      p.baseToken.symbol.toLowerCase() === id.toLowerCase() ||
      p.baseToken.address.toLowerCase() === id.toLowerCase()
    );

    if (!pair) {
      throw new Error(`Cryptocurrency with ID ${id} not found`);
    }

    return this.transformPairToCryptoMarketData(pair);
  }

  // Search cryptocurrencies
  async searchCryptocurrencies(query: string): Promise<CryptoMarketData[]> {
    const pairs = await this.searchPairs(query);
    return pairs
      .slice(0, 10) // Limit results
      .map(pair => this.transformPairToCryptoMarketData(pair));
  }

  // Get trending cryptocurrencies (using boosted tokens)
  async getTrendingCryptocurrencies(): Promise<CryptoMarketData[]> {
    const boostedTokens = await this.getLatestBoostedTokens();
    const trending: CryptoMarketData[] = [];

    for (const boosted of boostedTokens.slice(0, 10)) {
      try {
        const pairs = await this.getTokenPairs(boosted.chainId, boosted.tokenAddress);
        if (pairs.length > 0) {
          const bestPair = pairs.sort((a, b) => (b.liquidity.usd || 0) - (a.liquidity.usd || 0))[0];
          trending.push(this.transformPairToCryptoMarketData(bestPair));
        }
      } catch (error) {
        console.warn(`Failed to fetch trending data for ${boosted.tokenAddress}:`, error);
      }
    }

    return trending;
  }

  // Get global market data (estimated from available pairs)
  async getGlobalMarketData(): Promise<GlobalMarketData> {
    const topCrypto = await this.getTopCryptocurrencies(100);

    const totalMarketCap = topCrypto.reduce((sum, crypto) => sum + (crypto.market_cap || 0), 0);
    const totalVolume = topCrypto.reduce((sum, crypto) => sum + (crypto.total_volume || 0), 0);

    // Calculate market cap percentages
    const marketCapPercentages: Record<string, number> = {};
    for (const crypto of topCrypto.slice(0, 10)) {
      if (crypto.market_cap && totalMarketCap > 0) {
        marketCapPercentages[crypto.symbol.toLowerCase()] = (crypto.market_cap / totalMarketCap) * 100;
      }
    }

    return {
      data: {
        active_cryptocurrencies: topCrypto.length,
        total_market_cap: { usd: totalMarketCap },
        total_volume: { usd: totalVolume },
        market_cap_percentage: marketCapPercentages,
        market_cap_change_percentage_24h_usd: 0, // Not available from DexScreener
      }
    };
  }

  // Get exchange rates (simplified - using USDC pairs)
  async getExchangeRates(): Promise<Record<string, number>> {
    const rates: Record<string, number> = { usd: 1 };

    try {
      // Get USDC pairs to calculate rates
      const usdcPairs = await this.searchPairs('USDC');
      const stablecoinPairs = usdcPairs.filter(p =>
        ['USDT', 'DAI', 'BUSD', 'FRAX'].includes(p.baseToken.symbol.toUpperCase())
      );

      for (const pair of stablecoinPairs) {
        const symbol = pair.baseToken.symbol.toLowerCase();
        const price = Number.parseFloat(pair.priceUsd) || 1;
        rates[symbol] = price;
      }
    } catch (error) {
      console.warn('Failed to fetch exchange rates:', error);
    }

    return rates;
  }

  // Get historical data (not available from DexScreener, return empty)
  async getHistoricalData(id: string, days = 30): Promise<any> {
    console.warn('Historical data not available from DexScreener API');
    return {
      prices: [],
      market_caps: [],
      total_volumes: [],
    };
  }

  // Get staking information (not available from DexScreener, return estimated)
  async getStakingInfo(symbol: string): Promise<StakingInfo | null> {
    // Return estimated staking rates for common tokens
    const stakingRates: Record<string, StakingInfo> = {
      'ETH': {
        assetId: 'ethereum',
        stakingRate: 4.5,
        minimumStake: 32,
        lockPeriod: 0,
        rewards: 0,
        lastRewardDate: new Date(),
      },
      'ADA': {
        assetId: 'cardano',
        stakingRate: 4.8,
        minimumStake: 0,
        lockPeriod: 0,
        rewards: 0,
        lastRewardDate: new Date(),
      },
      'DOT': {
        assetId: 'polkadot',
        stakingRate: 12.0,
        minimumStake: 0,
        lockPeriod: 28,
        rewards: 0,
        lastRewardDate: new Date(),
      },
      'SOL': {
        assetId: 'solana',
        stakingRate: 6.5,
        minimumStake: 0,
        lockPeriod: 0,
        rewards: 0,
        lastRewardDate: new Date(),
      },
    };

    return stakingRates[symbol.toUpperCase()] || null;
  }

  // Get DeFi yield rates (not available from DexScreener, return estimated)
  async getDefiYieldRates(symbol: string): Promise<number> {
    const defiRates: Record<string, number> = {
      'ETH': 8.5,
      'USDC': 4.2,
      'USDT': 4.0,
      'DAI': 4.5,
      'WBTC': 6.0,
    };

    return defiRates[symbol.toUpperCase()] || 0;
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    this.requestCounts.clear();
  }
}

// Export singleton instance
export const dexscreenerAPI = new DexScreenerAPIService();
