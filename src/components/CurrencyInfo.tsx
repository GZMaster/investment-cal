import {
  Box,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import type { InvestmentScenario, InvestmentResult } from '../types/investment';
import { formatCurrency } from '../utils/investment-calculator';

interface CurrencyInfoProps {
  scenario: InvestmentScenario;
  result: InvestmentResult;
}

export function CurrencyInfo({ scenario, result }: CurrencyInfoProps) {
  const { appreciation, timePeriod } = scenario;
  const { finalExchangeRate, totalUSD, currencyGain } = result;
  const bgColor = useColorModeValue('pink.50', 'pink.900');
  const textColor = useColorModeValue('pink.900', 'pink.50');

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" color={textColor}>
      <VStack align="stretch" spacing={3}>
        <Text fontSize="lg" fontWeight="bold">
          Current Scenario: {appreciation}% Annual USD Appreciation over {timePeriod} Year{timePeriod > 1 ? 's' : ''}
        </Text>
        <Text>
          <strong>Exchange Rate:</strong> ₦1,650 → {formatCurrency(finalExchangeRate)} (+{((finalExchangeRate / 1650 - 1) * 100).toFixed(1)}% total)
        </Text>
        <Text>
          <strong>USD Portfolio:</strong> {totalUSD.toFixed(2)} + Currency Gain: {formatCurrency(currencyGain)}
        </Text>
      </VStack>
    </Box>
  );
} 