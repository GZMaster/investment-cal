import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  HStack,
  VStack,
  Text,
  Badge,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FaBitcoin, FaChartLine, FaCoins, FaPercentage } from 'react-icons/fa';
import { useCryptoStore } from '../hooks/useCryptoStore';

export function CryptoPortfolioOverview() {
  const {
    totalValue,
    totalCost,
    unrealizedGains,
    totalStakingRewards,
    totalDefiYield,
    portfolioAnalysis,
  } = useCryptoStore();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

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

  const getGainLossColor = (value: number) => {
    if (value > 0) return 'green.500';
    if (value < 0) return 'red.500';
    return textColor;
  };

  const totalReturnPercentage = totalCost > 0 ? ((unrealizedGains / totalCost) * 100) : 0;
  const totalYield = totalStakingRewards + totalDefiYield;
  const totalYieldPercentage = totalValue > 0 ? ((totalYield / totalValue) * 100) : 0;

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
          <Text fontSize="xl" fontWeight="bold">
            Portfolio Overview
          </Text>
          <Badge colorScheme="blue" variant="subtle" fontSize="sm">
            {portfolioAnalysis?.portfolio?.assets.length} Assets
          </Badge>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {/* Total Portfolio Value */}
          <Stat>
            <StatLabel color={textColor}>
              <HStack spacing={2}>
                <Icon as={FaBitcoin} />
                <Text>Total Value</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="2xl" color={getGainLossColor(totalValue)}>
              {formatCurrency(totalValue)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type={totalValue > 0 ? 'increase' : 'decrease'} />
              {formatPercentage(totalReturnPercentage)}
            </StatHelpText>
          </Stat>

          {/* Unrealized Gains/Losses */}
          <Stat>
            <StatLabel color={textColor}>
              <HStack spacing={2}>
                <Icon as={FaChartLine} />
                <Text>Unrealized P&L</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="2xl" color={getGainLossColor(unrealizedGains)}>
              {formatCurrency(unrealizedGains)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type={unrealizedGains > 0 ? 'increase' : 'decrease'} />
              {formatPercentage(totalReturnPercentage)}
            </StatHelpText>
          </Stat>

          {/* Staking Rewards */}
          <Stat>
            <StatLabel color={textColor}>
              <HStack spacing={2}>
                <Icon as={FaCoins} />
                <Text>Staking Rewards</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="2xl" color="green.500">
              {formatCurrency(totalStakingRewards)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {formatPercentage(totalYieldPercentage)}
            </StatHelpText>
          </Stat>

          {/* DeFi Yield */}
          <Stat>
            <StatLabel color={textColor}>
              <HStack spacing={2}>
                <Icon as={FaPercentage} />
                <Text>DeFi Yield</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="2xl" color="purple.500">
              {formatCurrency(totalDefiYield)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {formatPercentage(totalYieldPercentage)}
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Additional Metrics */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
            <Text fontSize="sm" color={textColor} mb={1}>
              Total Cost Basis
            </Text>
            <Text fontSize="lg" fontWeight="semibold">
              {formatCurrency(totalCost)}
            </Text>
          </Box>

          <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
            <Text fontSize="sm" color={textColor} mb={1}>
              Risk Score
            </Text>
            <Tooltip label="Portfolio risk assessment based on asset allocation and volatility">
              <Text fontSize="lg" fontWeight="semibold" cursor="help">
                {portfolioAnalysis.riskMetrics.riskScore}/100
              </Text>
            </Tooltip>
          </Box>

          <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
            <Text fontSize="sm" color={textColor} mb={1}>
              Concentration Risk
            </Text>
            <Tooltip label="Herfindahl-Hirschman Index - higher values indicate more concentration">
              <Text fontSize="lg" fontWeight="semibold" cursor="help">
                {(portfolioAnalysis.portfolioDiversification.concentrationRisk * 100).toFixed(1)}%
              </Text>
            </Tooltip>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
} 