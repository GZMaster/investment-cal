import {
  Box,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import type { InvestmentScenario, InvestmentResult } from '../types/investment';
import { calculateBreakevenPoint } from '../utils/investment-calculator';
import { INVESTMENT_CONSTANTS } from '../constants/investment';

interface BreakevenInfoProps {
  scenario: InvestmentScenario;
  result: InvestmentResult;
}

export function BreakevenInfo({ scenario, result }: BreakevenInfoProps) {
  const { timePeriod } = scenario;
  const { compoundEarnings, totalUSD } = result;
  const { baseExchangeRate, monthlyNairaInterest, monthlyUSDRate } = INVESTMENT_CONSTANTS;

  const totalNairaFromInterest = monthlyNairaInterest * timePeriod * 12;
  const baseUSDInterest = (totalUSD * monthlyUSDRate * timePeriod * 12) * baseExchangeRate;
  const breakevenAppreciation = calculateBreakevenPoint(
    compoundEarnings,
    totalNairaFromInterest,
    baseUSDInterest,
    totalUSD,
    baseExchangeRate
  );

  const bgColor = useColorModeValue('green.50', 'green.900');
  const textColor = useColorModeValue('green.900', 'green.50');

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" color={textColor}>
      <VStack align="stretch" spacing={3}>
        <Text fontSize="lg" fontWeight="bold">
          💡 Breakeven Analysis
        </Text>
        <Text>
          <strong>
            The two-tier strategy becomes more profitable when USD appreciates by approximately {breakevenAppreciation.toFixed(1)}% annually or more over {timePeriod} year{timePeriod > 1 ? 's' : ''}.
          </strong>
        </Text>
        <Text>
          At {breakevenAppreciation.toFixed(1)}% annual appreciation, both strategies yield similar returns.
        </Text>
      </VStack>
    </Box>
  );
} 