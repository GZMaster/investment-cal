import {
  Box,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Badge,
  useColorModeValue,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
} from '@chakra-ui/react';
import { useCryptoStore } from '../hooks/useCryptoStore';

export function CryptoAnalysis() {
  const { portfolioAnalysis } = useCryptoStore();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const cardBgColor = useColorModeValue('gray.50', 'gray.700');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'green';
    if (score <= 60) return 'yellow';
    if (score <= 80) return 'orange';
    return 'red';
  };

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
        <Text fontSize="xl" fontWeight="bold">
          Portfolio Analysis
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Risk Metrics */}
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">
              Risk Metrics
            </Text>

            <SimpleGrid columns={2} spacing={4}>
              <Stat>
                <StatLabel color={textColor}>Risk Score</StatLabel>
                <StatNumber fontSize="lg">
                  <Badge colorScheme={getRiskColor(portfolioAnalysis.riskMetrics.riskScore)}>
                    {portfolioAnalysis.riskMetrics.riskScore}/100
                  </Badge>
                </StatNumber>
              </Stat>

              <Stat>
                <StatLabel color={textColor}>Volatility</StatLabel>
                <StatNumber fontSize="lg">
                  {(portfolioAnalysis.riskMetrics.volatility * 100).toFixed(1)}%
                </StatNumber>
              </Stat>

              <Stat>
                <StatLabel color={textColor}>Sharpe Ratio</StatLabel>
                <StatNumber fontSize="lg">
                  {portfolioAnalysis.riskMetrics.sharpeRatio.toFixed(2)}
                </StatNumber>
              </Stat>

              <Stat>
                <StatLabel color={textColor}>Max Drawdown</StatLabel>
                <StatNumber fontSize="lg" color="red.500">
                  {(portfolioAnalysis.riskMetrics.maxDrawdown * 100).toFixed(1)}%
                </StatNumber>
              </Stat>
            </SimpleGrid>
          </VStack>

          {/* Performance Metrics */}
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">
              Performance Metrics
            </Text>

            <SimpleGrid columns={2} spacing={4}>
              <Stat>
                <StatLabel color={textColor}>Total Return</StatLabel>
                <StatNumber fontSize="lg" color={portfolioAnalysis.performanceMetrics.totalReturn >= 0 ? 'green.500' : 'red.500'}>
                  {formatPercentage(portfolioAnalysis.performanceMetrics.totalReturn)}
                </StatNumber>
              </Stat>

              <Stat>
                <StatLabel color={textColor}>Annualized Return</StatLabel>
                <StatNumber fontSize="lg" color={portfolioAnalysis.performanceMetrics.annualizedReturn >= 0 ? 'green.500' : 'red.500'}>
                  {formatPercentage(portfolioAnalysis.performanceMetrics.annualizedReturn)}
                </StatNumber>
              </Stat>

              <Stat>
                <StatLabel color={textColor}>Benchmark</StatLabel>
                <StatNumber fontSize="lg">
                  {portfolioAnalysis.performanceMetrics.benchmarkComparison.benchmark}
                </StatNumber>
                <StatHelpText>
                  {formatPercentage(portfolioAnalysis.performanceMetrics.benchmarkComparison.benchmarkReturn)}
                </StatHelpText>
              </Stat>

              <Stat>
                <StatLabel color={textColor}>Outperformance</StatLabel>
                <StatNumber fontSize="lg" color={portfolioAnalysis.performanceMetrics.benchmarkComparison.outperformance >= 0 ? 'green.500' : 'red.500'}>
                  {formatPercentage(portfolioAnalysis.performanceMetrics.benchmarkComparison.outperformance)}
                </StatNumber>
              </Stat>
            </SimpleGrid>
          </VStack>
        </SimpleGrid>

        <Divider />

        {/* Diversification Analysis */}
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="semibold">
            Diversification Analysis
          </Text>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {/* By Category */}
            <VStack spacing={3} align="stretch">
              <Text fontSize="md" fontWeight="medium" color={textColor}>
                By Category
              </Text>
              {Object.entries(portfolioAnalysis.portfolioDiversification.byCategory).map(([category, percentage]) => (
                <Box key={category}>
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="sm" textTransform="capitalize">
                      {category}
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold">
                      {(percentage as number).toFixed(1)}%
                    </Text>
                  </HStack>
                  <Progress value={percentage as number} size="sm" colorScheme="blue" />
                </Box>
              ))}
            </VStack>

            {/* By Blockchain */}
            <VStack spacing={3} align="stretch">
              <Text fontSize="md" fontWeight="medium" color={textColor}>
                By Blockchain
              </Text>
              {Object.entries(portfolioAnalysis.portfolioDiversification.byBlockchain).map(([blockchain, percentage]) => (
                <Box key={blockchain}>
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="sm">
                      {blockchain}
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold">
                      {(percentage as number).toFixed(1)}%
                    </Text>
                  </HStack>
                  <Progress value={percentage as number} size="sm" colorScheme="purple" />
                </Box>
              ))}
            </VStack>

            {/* By Risk Level */}
            <VStack spacing={3} align="stretch">
              <Text fontSize="md" fontWeight="medium" color={textColor}>
                By Risk Level
              </Text>
              {Object.entries(portfolioAnalysis.portfolioDiversification.byRiskLevel).map(([riskLevel, percentage]) => (
                <Box key={riskLevel}>
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="sm" textTransform="capitalize">
                      {riskLevel}
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold">
                      {(percentage as number).toFixed(1)}%
                    </Text>
                  </HStack>
                  <Progress
                    value={percentage as number}
                    size="sm"
                    colorScheme={getRiskColor(percentage as number)}
                  />
                </Box>
              ))}
            </VStack>
          </SimpleGrid>
        </VStack>

        <Divider />

        {/* Top Holdings */}
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="semibold">
            Top Holdings
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {portfolioAnalysis.portfolioDiversification.topHoldings.map((asset: any, index: number) => {
              const assetValue = asset.quantity * asset.currentPrice;
              const percentage = (assetValue / portfolioAnalysis.totalValue) * 100;

              return (
                <Box
                  key={asset.id}
                  p={4}
                  bg={cardBgColor}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="semibold">
                      #{index + 1} {asset.symbol}
                    </Text>
                    <Badge colorScheme="blue" variant="subtle">
                      {percentage.toFixed(1)}%
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color={textColor} mb={1}>
                    {asset.name}
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold">
                    {formatCurrency(assetValue)}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </VStack>
      </VStack>
    </Box>
  );
} 