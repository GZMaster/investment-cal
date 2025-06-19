import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import type { InvestmentResult } from '../types/investment';
import { getSavingsPlatformName, getInvestmentPlatformName } from '../utils/platform-utils';

interface SummarySectionProps {
  result: InvestmentResult;
}

export function SummarySection({ result }: SummarySectionProps) {
  const { compoundEarnings, twoTierEarnings, currencyGain } = result;

  const savingsPlatformName = getSavingsPlatformName();
  const investmentPlatformName = getInvestmentPlatformName();

  return (
    <Box mt={8}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat>
          <StatLabel>Single-Tier Strategy</StatLabel>
          <StatNumber>₦{compoundEarnings.toLocaleString()}</StatNumber>
          <StatHelpText>Total Interest ({savingsPlatformName} Only)</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Two-Tier Strategy</StatLabel>
          <StatNumber>₦{twoTierEarnings.toLocaleString()}</StatNumber>
          <StatHelpText>Total Interest ({savingsPlatformName} + {investmentPlatformName})</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Currency Gain</StatLabel>
          <StatNumber>₦{currencyGain.toLocaleString()}</StatNumber>
          <StatHelpText>From USD Appreciation</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
} 