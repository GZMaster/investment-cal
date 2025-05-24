import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import type { InvestmentScenario, InvestmentResult } from '../types/investment';
import { formatCurrency } from '../utils/investment-calculator';
import { INVESTMENT_CONSTANTS } from '../constants/investment';

interface SummarySectionProps {
  scenario: InvestmentScenario;
  result: InvestmentResult;
}

export function SummarySection({ scenario, result }: SummarySectionProps) {
  const { timePeriod } = scenario;
  const { compoundEarnings, twoTierEarnings, totalUSD } = result;
  const { principal } = INVESTMENT_CONSTANTS;

  const compoundRate = ((compoundEarnings / principal) / timePeriod * 100).toFixed(2);
  const twoTierRate = ((twoTierEarnings / principal) / timePeriod * 100).toFixed(2);

  const bgColor = useColorModeValue('orange.50', 'orange.900');
  const textColor = useColorModeValue('orange.900', 'orange.50');

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" color={textColor}>
      <VStack align="stretch" spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          {timePeriod} Year{timePeriod > 1 ? 's' : ''} Summary
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          <Box>
            <Text fontSize="lg" fontWeight="bold" color="green.600">
              Strategy A: Compound Interest
            </Text>
            <VStack align="stretch" mt={2} spacing={2}>
              <Text>
                <strong>Total Earnings:</strong>{' '}
                <Text as="span" fontFamily="mono">
                  {formatCurrency(compoundEarnings)}
                </Text>
              </Text>
              <Text>
                <strong>Final Balance:</strong>{' '}
                <Text as="span" fontFamily="mono">
                  {formatCurrency(principal + compoundEarnings)}
                </Text>
              </Text>
              <Text>
                <strong>Average Annual Rate:</strong>{' '}
                <Text as="span" fontFamily="mono">
                  {compoundRate}%
                </Text>
              </Text>
            </VStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" color="purple.600">
              Strategy B: Two-Tier + Appreciation
            </Text>
            <VStack align="stretch" mt={2} spacing={2}>
              <Text>
                <strong>Total Earnings:</strong>{' '}
                <Text as="span" fontFamily="mono">
                  {formatCurrency(twoTierEarnings)}
                </Text>
              </Text>
              <Text>
                <strong>USD Portfolio:</strong>{' '}
                <Text as="span" fontFamily="mono">
                  {totalUSD.toFixed(2)}
                </Text>
              </Text>
              <Text>
                <strong>Average Annual Rate:</strong>{' '}
                <Text as="span" fontFamily="mono">
                  {twoTierRate}%
                </Text>
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
} 