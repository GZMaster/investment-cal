import { dexscreenerAPI } from './dexscreener-api';

// Simple test function to verify DexScreener API implementation
export async function testDexScreenerAPI() {
  console.log('Testing DexScreener API...');

  try {
    // Test 1: Search for pairs
    console.log('1. Testing pair search...');
    const searchResults = await dexscreenerAPI.searchPairs('BTC');
    console.log(`Found ${searchResults.length} BTC pairs`);

    // Test 2: Get top cryptocurrencies
    console.log('2. Testing top cryptocurrencies...');
    const topCrypto = await dexscreenerAPI.getTopCryptocurrencies(5);
    console.log(`Found ${topCrypto.length} top cryptocurrencies`);
    for (const crypto of topCrypto) {
      console.log(`- ${crypto.symbol}: $${crypto.current_price} (${crypto.price_change_percentage_24h}%)`);
    }

    // Test 3: Get global market data
    console.log('3. Testing global market data...');
    const globalData = await dexscreenerAPI.getGlobalMarketData();
    console.log(`Global market cap: $${globalData.data.total_market_cap.usd.toLocaleString()}`);
    console.log(`Total volume: $${globalData.data.total_volume.usd.toLocaleString()}`);

    // Test 4: Get exchange rates
    console.log('4. Testing exchange rates...');
    const exchangeRates = await dexscreenerAPI.getExchangeRates();
    console.log('Exchange rates:', exchangeRates);

    // Test 5: Test cache clearing
    console.log('5. Testing cache clearing...');
    dexscreenerAPI.clearCache();
    console.log('Cache cleared successfully');

    console.log('✅ All DexScreener API tests passed!');
    return true;
  } catch (error) {
    console.error('❌ DexScreener API test failed:', error);
    return false;
  }
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testDexScreenerAPI();
} 