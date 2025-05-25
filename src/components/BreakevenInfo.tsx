import {
  Box,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import type { InvestmentScenario, InvestmentResult } from '../types/investment';
import { calculateBreakevenPoint } from '../utils/investment-calculator';
import { formatCurrency } from '../utils/investment-calculator';

interface BreakevenInfoProps {
  scenario: InvestmentScenario;
  result: InvestmentResult;
}

export function BreakevenInfo({ scenario, result }: BreakevenInfoProps) {
  const { compoundEarnings, twoTierEarnings, finalExchangeRate, usdValue, totalUSD, currencyGain } = result;
  const { baseExchangeRate } = scenario;

  const breakevenPoint = calculateBreakevenPoint(
    compoundEarnings,
    twoTierEarnings - currencyGain,
    usdValue - (totalUSD * baseExchangeRate),
    totalUSD,
    baseExchangeRate
  );

  const bgColor = useColorModeValue('green.50', 'green.900');
  const textColor = useColorModeValue('green.900', 'green.50');

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" color={textColor}>
      <VStack align="stretch" spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          Breakeven Analysis
        </Text>

        <Text>
          The two-tier strategy becomes more profitable than the single-tier strategy when USD appreciates by{' '}
          <Text as="span" fontWeight="bold">
            {breakevenPoint.toFixed(1)}%
          </Text>
          {' '}against Naira.
        </Text>

        <Text>
          Current USD appreciation rate: {' '}
          <Text as="span" fontWeight="bold">
            {((finalExchangeRate / baseExchangeRate - 1) * 100).toFixed(1)}%
          </Text>
        </Text>

        <Text>
          Currency gain from USD appreciation: {' '}
          <Text as="span" fontWeight="bold">
            {formatCurrency(currencyGain)}
          </Text>
        </Text>
      </VStack>
    </Box>
  );
} 