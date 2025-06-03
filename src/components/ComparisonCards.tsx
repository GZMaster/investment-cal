import {
  SimpleGrid,
  Box,
  Text,
  Badge,
  useColorModeValue,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaTrophy, FaChartLine } from 'react-icons/fa';
import type { InvestmentResult } from '../types/investment';
import { formatCurrency } from '../utils/investment-calculator';

const MotionBox = motion(Box);

interface ComparisonCardsProps {
  result: InvestmentResult;
}

export function ComparisonCards({ result }: ComparisonCardsProps) {
  const { compoundEarnings, twoTierEarnings } = result;
  const difference = twoTierEarnings - compoundEarnings;
  const isTwoTierWinner = difference > 0;

  const compoundBg = useColorModeValue('green.50', 'green.900');
  const twoTierBg = useColorModeValue('purple.50', 'purple.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      <MotionBox
        p={6}
        borderRadius="xl"
        bg={compoundBg}
        position="relative"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="lg"
        whileHover={{ scale: 1.04 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tooltip label="Compound Strategy" hasArrow>
          <Icon
            as={FaChartLine}
            w={6}
            h={6}
            color="green.500"
            position="absolute"
            top={4}
            left={4}
          />
        </Tooltip>
        <Text fontSize="xl" fontWeight="bold" mb={4} ml={8}>
          Strategy A: Compound in PiggyVest
        </Text>
        <Text fontSize="3xl" fontWeight="bold" mb={2} color="green.600">
          {formatCurrency(compoundEarnings)}
        </Text>
        <Text fontSize="sm" opacity={0.8}>
          Reinvest all interest at 18% annually
        </Text>
        {!isTwoTierWinner && (
          <Tooltip label="Best result for this scenario" hasArrow>
            <Badge
              colorScheme="yellow"
              position="absolute"
              top={4}
              right={4}
              px={3}
              py={1}
              borderRadius="full"
              display="flex"
              alignItems="center"
              gap={2}
              fontSize="md"
              boxShadow="md"
            >
              <Icon as={FaTrophy} />
              WINNER! +{formatCurrency(Math.abs(difference))}
            </Badge>
          </Tooltip>
        )}
      </MotionBox>

      <MotionBox
        p={6}
        borderRadius="xl"
        bg={twoTierBg}
        position="relative"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="lg"
        whileHover={{ scale: 1.04 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Tooltip label="Two-Tier Strategy" hasArrow>
          <Icon
            as={FaChartLine}
            w={6}
            h={6}
            color="purple.500"
            position="absolute"
            top={4}
            left={4}
          />
        </Tooltip>
        <Text fontSize="xl" fontWeight="bold" mb={4} ml={8}>
          Strategy B: Two-Tier Investment
        </Text>
        <Text fontSize="3xl" fontWeight="bold" mb={2} color="purple.600">
          {formatCurrency(twoTierEarnings)}
        </Text>
        <Text fontSize="sm" opacity={0.8}>
          Transfer interest to USD + appreciation
        </Text>
        {isTwoTierWinner && (
          <Tooltip label="Best result for this scenario" hasArrow>
            <Badge
              colorScheme="yellow"
              position="absolute"
              top={4}
              right={4}
              px={3}
              py={1}
              borderRadius="full"
              display="flex"
              alignItems="center"
              gap={2}
              fontSize="md"
              boxShadow="md"
            >
              <Icon as={FaTrophy} />
              WINNER! +{formatCurrency(Math.abs(difference))}
            </Badge>
          </Tooltip>
        )}
      </MotionBox>
    </SimpleGrid>
  );
} 