import {
  Box,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from '@chakra-ui/react';
import { FaBitcoin, FaChartLine, FaSync, FaArrowUp, FaGlobe } from 'react-icons/fa';
import { useCryptoDataWithStatus, useRefreshCryptoData } from '../hooks/useCryptoData';

// Utility functions for formatting
function formatCurrency(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function formatLargeNumber(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

export function CryptoMarketData() {
  const { topCrypto, globalData, isLoading, isError, error, refetch } = useCryptoDataWithStatus();
  const refreshMutation = useRefreshCryptoData();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const cardBgColor = useColorModeValue('gray.50', 'gray.700');
  const globalStatsBg = useColorModeValue('blue.50', 'blue.900');
  const gainersBg = useColorModeValue('green.50', 'green.900');
  const losersBg = useColorModeValue('red.50', 'red.900');

  const handleRefresh = async () => {
    try {
      console.log('User triggered refresh');
      await refreshMutation.mutateAsync();
      // Also trigger individual refetches for immediate UI update
      refetch();
      toast({
        title: 'Market Data Refreshed',
        description: 'The market data has been successfully refreshed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Refresh failed:', error);
      toast({
        title: 'Refresh Error',
        description: error instanceof Error ? error.message : 'Failed to refresh market data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getGainLossColor = (value: number) => {
    if (value > 0) return 'green.500';
    if (value < 0) return 'red.500';
    return textColor;
  };

  // Show loading state during refresh or initial load
  const isRefreshing = refreshMutation.isPending;
  const showLoading = isLoading || isRefreshing;

  if (isError) {
    return (
      <Box
        bg={bgColor}
        borderRadius="xl"
        p={6}
        boxShadow="xl"
        border="1px solid"
        borderColor={borderColor}
      >
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error loading market data!</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to fetch cryptocurrency data'}
          </AlertDescription>
        </Alert>
        <Button
          mt={4}
          leftIcon={<Icon as={FaSync} />}
          onClick={handleRefresh}
          isLoading={refreshMutation.isPending}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      p={6}
      boxShadow="xl"
      border="1px solid"
      borderColor={borderColor}
    >
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <HStack spacing={3}>
            <Icon as={FaGlobe} color="blue.500" />
            <Text fontSize="xl" fontWeight="bold">
              Market Overview
            </Text>
          </HStack>
          <Button
            leftIcon={<Icon as={FaSync} />}
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            loadingText={isRefreshing ? "Refreshing..." : "Loading..."}
            disabled={isRefreshing}
            colorScheme={isRefreshing ? "blue" : "gray"}
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </HStack>

        {showLoading ? (
          <Box textAlign="center" py={8}>
            <Spinner size="lg" color="blue.500" />
            <Text mt={4} color={textColor}>
              {isRefreshing ? "Refreshing market data..." : "Loading market data..."}
            </Text>
          </Box>
        ) : (
          <>
            {/* Global Market Stats */}
            {globalData && (
              <Box p={4} bg={globalStatsBg} borderRadius="md">
                <Text fontSize="lg" fontWeight="semibold" mb={3} color="blue.600">
                  Global Market Statistics
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Stat>
                    <StatLabel color={textColor}>Total Market Cap</StatLabel>
                    <StatNumber fontSize="lg">
                      {formatCurrency(globalData.data?.total_market_cap?.usd || 0)}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel color={textColor}>24h Volume</StatLabel>
                    <StatNumber fontSize="lg">
                      {formatCurrency(globalData.data?.total_volume?.usd || 0)}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel color={textColor}>Active Cryptocurrencies</StatLabel>
                    <StatNumber fontSize="lg">
                      {globalData.data?.active_cryptocurrencies || 0}
                    </StatNumber>
                  </Stat>
                </SimpleGrid>
              </Box>
            )}

            {/* Top Cryptocurrencies */}
            <VStack spacing={4} align="stretch">
              <HStack spacing={3}>
                <Icon as={FaArrowUp} color="green.500" />
                <Text fontSize="lg" fontWeight="semibold">
                  Top Cryptocurrencies
                </Text>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {topCrypto.slice(0, 6).map((crypto: any) => (
                  <Box
                    key={crypto.id}
                    p={4}
                    bg={cardBgColor}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={borderColor}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                    transition="all 0.2s"
                  >
                    <VStack align="start" spacing={2}>
                      <HStack justify="space-between" width="100%">
                        <HStack spacing={2}>
                          <Text fontWeight="bold" fontSize="lg">
                            {crypto.symbol.toUpperCase()}
                          </Text>
                          <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                            {crypto.chainId || 'DEX'}
                          </Badge>
                        </HStack>
                        <Icon as={FaBitcoin} color="orange.500" />
                      </HStack>

                      <Text fontSize="sm" color={textColor} noOfLines={1}>
                        {crypto.name}
                      </Text>

                      <VStack align="start" spacing={1} width="100%">
                        <Text fontSize="lg" fontWeight="semibold">
                          {formatCurrency(crypto.current_price)}
                        </Text>

                        <HStack spacing={2}>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={getGainLossColor(crypto.price_change_percentage_24h)}
                          >
                            {crypto.price_change_percentage_24h >= 0 ? '↗' : '↘'} {formatPercentage(crypto.price_change_percentage_24h)}
                          </Text>
                        </HStack>
                      </VStack>

                      <VStack align="start" spacing={1} width="100%">
                        <Text fontSize="xs" color={textColor}>
                          Market Cap: {formatLargeNumber(crypto.market_cap)}
                        </Text>
                        <Text fontSize="xs" color={textColor}>
                          Volume: {formatLargeNumber(crypto.total_volume)}
                        </Text>
                        {crypto.liquidity_usd && (
                          <Text fontSize="xs" color={textColor}>
                            Liquidity: {formatLargeNumber(crypto.liquidity_usd)}
                          </Text>
                        )}
                      </VStack>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>

            {/* Market Trends */}
            <VStack spacing={4} align="stretch">
              <HStack spacing={3}>
                <Icon as={FaChartLine} color="purple.500" />
                <Text fontSize="lg" fontWeight="semibold">
                  Market Trends
                </Text>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box p={4} bg={gainersBg} borderRadius="md">
                  <Text fontSize="md" fontWeight="semibold" color="green.600" mb={2}>
                    Top Gainers (24h)
                  </Text>
                  {topCrypto
                    .filter((crypto: any) => crypto.price_change_percentage_24h > 0)
                    .sort((a: any, b: any) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                    .slice(0, 3)
                    .map((crypto: any) => (
                      <HStack key={crypto.id} justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="medium">
                          {crypto.symbol.toUpperCase()}
                        </Text>
                        <Text fontSize="sm" color="green.500" fontWeight="semibold">
                          {formatPercentage(crypto.price_change_percentage_24h)}
                        </Text>
                      </HStack>
                    ))}
                </Box>

                <Box p={4} bg={losersBg} borderRadius="md">
                  <Text fontSize="md" fontWeight="semibold" color="red.600" mb={2}>
                    Top Losers (24h)
                  </Text>
                  {topCrypto
                    .filter((crypto: any) => crypto.price_change_percentage_24h < 0)
                    .sort((a: any, b: any) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                    .slice(0, 3)
                    .map((crypto: any) => (
                      <HStack key={crypto.id} justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="medium">
                          {crypto.symbol.toUpperCase()}
                        </Text>
                        <Text fontSize="sm" color="red.500" fontWeight="semibold">
                          {formatPercentage(crypto.price_change_percentage_24h)}
                        </Text>
                      </HStack>
                    ))}
                </Box>
              </SimpleGrid>
            </VStack>

            {/* Last Updated */}
            <Text fontSize="xs" color={textColor} textAlign="center">
              Last updated: {new Date().toLocaleString()}
            </Text>
          </>
        )}
      </VStack>
    </Box>
  );
} 