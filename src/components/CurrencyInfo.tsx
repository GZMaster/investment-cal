import {
  Box,
  Text,
  VStack,
  useColorModeValue,
  HStack,
  Badge,
} from '@chakra-ui/react';
import type { InvestmentScenario, InvestmentResult } from '../types/investment';
import { formatCurrency } from '../utils/investment-calculator';

interface CurrencyInfoProps {
  scenario: InvestmentScenario;
  result: InvestmentResult;
}

export function CurrencyInfo({ scenario, result }: CurrencyInfoProps) {
  const { appreciation, timePeriod, baseExchangeRate, useRealTimeRate } = scenario;
  const { finalExchangeRate, totalUSD, currencyGain } = result;

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  const totalAppreciation = ((finalExchangeRate / baseExchangeRate - 1) * 100).toFixed(1);
  const annualAppreciation = ((Number(totalAppreciation)) / timePeriod).toFixed(1);

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="bold">
            Currency Scenario
          </Text>
          {useRealTimeRate && (
            <Badge colorScheme="green" fontSize="sm">
              Real-Time Rate
            </Badge>
          )}
        </HStack>

        <VStack align="stretch" spacing={3}>
          <Box>
            <Text fontSize="sm" color="gray.500">Current Exchange Rate</Text>
            <Text fontSize="xl" fontWeight="bold" color={accentColor}>
              ₦{baseExchangeRate.toLocaleString()}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500">Projected Exchange Rate (After {timePeriod} Year{timePeriod > 1 ? 's' : ''})</Text>
            <Text fontSize="xl" fontWeight="bold" color={accentColor}>
              ₦{finalExchangeRate.toLocaleString()}
            </Text>
            <Text fontSize="sm" color={Number(totalAppreciation) >= 0 ? 'green.500' : 'red.500'}>
              {Number(totalAppreciation) >= 0 ? '+' : ''}{totalAppreciation}% total ({annualAppreciation}% annually)
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500">USD Portfolio Value</Text>
            <Text fontSize="xl" fontWeight="bold" color={accentColor}>
              ${totalUSD.toFixed(2)}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Naira Value: {formatCurrency(totalUSD * finalExchangeRate)}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500">Currency Appreciation Gain</Text>
            <Text fontSize="xl" fontWeight="bold" color={accentColor}>
              {formatCurrency(currencyGain)}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {((currencyGain / (totalUSD * baseExchangeRate)) * 100).toFixed(1)}% of initial USD value
            </Text>
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
} 