import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Heading,
  Text,
  VStack,
  Badge,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaChartLine, FaMoneyBillWave, FaCar, FaCalendarAlt } from 'react-icons/fa';
import type { AssetAnalysisResult } from '../types/investment';
import { formatCurrency } from '../utils/investment-calculator';

interface AssetAnalysisSummaryProps {
  result: AssetAnalysisResult;
}

export function AssetAnalysisSummary({ result }: AssetAnalysisSummaryProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  // Calculate ROI
  const totalROI = ((result.totalReturns - result.totalInvestment) / result.totalInvestment) * 100;
  const monthlyROI = totalROI / (result.monthlyBreakdown.length / 12);

  // Calculate number of investment cycles
  const investmentCycles = result.monthlyBreakdown.filter(month => month.investments > 0).length;

  // Calculate average monthly return
  const averageMonthlyReturn = result.totalReturns / result.monthlyBreakdown.length;

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      mb={8}
    >
      <VStack spacing={6} align="stretch">
        <Heading size="md">Investment Summary</Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Stat>
            <StatLabel>
              <HStack>
                <Icon as={FaMoneyBillWave} color="blue.500" />
                <Text>Total Investment</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize={{ base: 'lg', md: 'xl' }}>
              {formatCurrency(result.totalInvestment)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {investmentCycles} investment cycles
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>
              <HStack>
                <Icon as={FaChartLine} color="green.500" />
                <Text>Total Returns</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize={{ base: 'lg', md: 'xl' }}>
              {formatCurrency(result.totalReturns)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {formatCurrency(averageMonthlyReturn)} avg. monthly
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>
              <HStack>
                <Icon as={FaCar} color="purple.500" />
                <Text>ROI</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize={{ base: 'lg', md: 'xl' }}>
              {totalROI.toFixed(2)}%
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {monthlyROI.toFixed(2)}% monthly
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>
              <HStack>
                <Icon as={FaCalendarAlt} color="orange.500" />
                <Text>Analysis Period</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize={{ base: 'lg', md: 'xl' }}>
              {result.monthlyBreakdown.length} months
            </StatNumber>
            <StatHelpText>
              <Badge colorScheme="blue">
                {Math.floor(result.monthlyBreakdown.length / 12)} years
              </Badge>
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        <Box pt={4}>
          <Text color={textColor} fontSize="sm">
            This analysis shows that your investment strategy has generated a {totalROI.toFixed(2)}% return over {result.monthlyBreakdown.length} months,
            with an average monthly return of {formatCurrency(averageMonthlyReturn)}. The strategy involved {investmentCycles} investment cycles,
            with a total investment of {formatCurrency(result.totalInvestment)} and total returns of {formatCurrency(result.totalReturns)}.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
} 