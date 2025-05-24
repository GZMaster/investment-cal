import {
  SimpleGrid,
  Box,
  Text,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import type { InvestmentResult } from '../types/investment';
import { formatCurrency } from '../utils/investment-calculator';

interface ComparisonCardsProps {
  result: InvestmentResult;
}

export function ComparisonCards({ result }: ComparisonCardsProps) {
  const { compoundEarnings, twoTierEarnings } = result;
  const difference = twoTierEarnings - compoundEarnings;
  const isTwoTierWinner = difference > 0;

  const compoundBg = useColorModeValue('green.50', 'green.900');
  const twoTierBg = useColorModeValue('purple.50', 'purple.900');

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      <Box
        p={6}
        borderRadius="lg"
        bg={compoundBg}
        position="relative"
        transform={!isTwoTierWinner ? 'scale(1.05)' : 'scale(1)'}
        transition="transform 0.3s ease"
      >
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Strategy A: Compound in PiggyVest
        </Text>
        <Text fontSize="3xl" fontWeight="bold" mb={2}>
          {formatCurrency(compoundEarnings)}
        </Text>
        <Text fontSize="sm" opacity={0.8}>
          Reinvest all interest at 18% annually
        </Text>
        {!isTwoTierWinner && (
          <Badge
            colorScheme="yellow"
            position="absolute"
            top={4}
            right={4}
            px={3}
            py={1}
            borderRadius="full"
          >
            WINNER! +{formatCurrency(Math.abs(difference))}
          </Badge>
        )}
      </Box>

      <Box
        p={6}
        borderRadius="lg"
        bg={twoTierBg}
        position="relative"
        transform={isTwoTierWinner ? 'scale(1.05)' : 'scale(1)'}
        transition="transform 0.3s ease"
      >
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Strategy B: Two-Tier Investment
        </Text>
        <Text fontSize="3xl" fontWeight="bold" mb={2}>
          {formatCurrency(twoTierEarnings)}
        </Text>
        <Text fontSize="sm" opacity={0.8}>
          Transfer interest to USD + appreciation
        </Text>
        {isTwoTierWinner && (
          <Badge
            colorScheme="yellow"
            position="absolute"
            top={4}
            right={4}
            px={3}
            py={1}
            borderRadius="full"
          >
            WINNER! +{formatCurrency(Math.abs(difference))}
          </Badge>
        )}
      </Box>
    </SimpleGrid>
  );
} 