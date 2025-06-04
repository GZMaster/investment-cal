import {
  Box,
  VStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Heading,
  Text,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
} from '@chakra-ui/react';
import { FaMoneyBillWave, FaChartLine, FaCar, FaDollarSign } from 'react-icons/fa';
import type { ThreeTierStrategyResult } from '../types/investment';
import { formatCurrency, formatMonthNumber } from '../utils/investment-calculator';
import { ThreeTierStrategyCharts } from './ThreeTierStrategyCharts';

interface ThreeTierStrategyAnalysisProps {
  result: ThreeTierStrategyResult;
}

export function ThreeTierStrategyAnalysis({ result }: ThreeTierStrategyAnalysisProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <VStack spacing={8} align="stretch">
      <Box bg={bgColor} p={{ base: 4, md: 6 }} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          <Heading size={{ base: "sm", md: "md" }}>Overall Strategy Summary</Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={{ base: 4, md: 6 }}>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FaMoneyBillWave} color="blue.500" />
                  <Text fontSize={{ base: "sm", md: "md" }}>Total Investment</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize={{ base: 'md', md: 'xl' }}>
                {formatCurrency(result.totalInvestment)}
              </StatNumber>
              <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                <StatArrow type="increase" />
                Combined across all tiers
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FaChartLine} color="green.500" />
                  <Text fontSize={{ base: "sm", md: "md" }}>Total Returns</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize={{ base: 'md', md: 'xl' }}>
                {formatCurrency(result.totalReturns)}
              </StatNumber>
              <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                <StatArrow type="increase" />
                {result.totalROI.toFixed(2)}% ROI
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FaDollarSign} color="purple.500" />
                  <Text fontSize={{ base: "sm", md: "md" }}>USD Portfolio</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize={{ base: 'md', md: 'xl' }}>
                ${result.riseVestResults.finalUsdBalance.toFixed(2)}
              </StatNumber>
              <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                <StatArrow type="increase" />
                {formatCurrency(result.riseVestResults.currencyGain)} currency gain
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FaCar} color="orange.500" />
                  <Text fontSize={{ base: "sm", md: "md" }}>Vehicle Investments</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize={{ base: 'md', md: 'xl' }}>
                {result.vehicleResults.completedCycles} cycles
              </StatNumber>
              <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                <StatArrow type="increase" />
                {result.vehicleResults.roi.toFixed(2)}% ROI
              </StatHelpText>
            </Stat>
          </SimpleGrid>

          <ThreeTierStrategyCharts result={result} />
        </VStack>
      </Box>

      <Box bg={bgColor} p={{ base: 4, md: 6 }} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <Tabs variant="enclosed" size={{ base: "sm", md: "md" }}>
          <TabList overflowX="auto" css={{
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': {
              display: 'none'
            }
          }}>
            <Tab whiteSpace="nowrap">PiggyVest Tier</Tab>
            <Tab whiteSpace="nowrap">RiseVest Tier</Tab>
            <Tab whiteSpace="nowrap">Vehicle Tier</Tab>
            <Tab whiteSpace="nowrap">Monthly Breakdown</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Heading size="sm">PiggyVest Performance</Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Stat>
                    <StatLabel>Total Investment</StatLabel>
                    <StatNumber>{formatCurrency(result.piggyVestResults.totalInvestment)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Total Returns</StatLabel>
                    <StatNumber>{formatCurrency(result.piggyVestResults.totalReturns)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>ROI</StatLabel>
                    <StatNumber>{result.piggyVestResults.roi.toFixed(2)}%</StatNumber>
                  </Stat>
                </SimpleGrid>

                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Month</Th>
                        <Th isNumeric>Balance</Th>
                        <Th isNumeric>Interest</Th>
                        <Th isNumeric>Savings</Th>
                        <Th isNumeric>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {result.monthlyBreakdown.map((month) => (
                        <Tr key={month.month}>
                          <Td>{formatMonthNumber(month.month)}</Td>
                          <Td isNumeric>{formatCurrency(month.piggyVestBalance)}</Td>
                          <Td isNumeric>{formatCurrency(month.piggyVestInterest)}</Td>
                          <Td isNumeric>{formatCurrency(month.monthlyPiggyVestSavings || 0)}</Td>
                          <Td isNumeric>{formatCurrency(month.piggyVestBalance + month.piggyVestInterest)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Heading size="sm">RiseVest Performance</Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Stat>
                    <StatLabel>Total Investment</StatLabel>
                    <StatNumber>{formatCurrency(result.riseVestResults.totalInvestment)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Total Returns</StatLabel>
                    <StatNumber>{formatCurrency(result.riseVestResults.totalReturns)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Currency Gain</StatLabel>
                    <StatNumber>{formatCurrency(result.riseVestResults.currencyGain)}</StatNumber>
                  </Stat>
                </SimpleGrid>

                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Month</Th>
                        <Th isNumeric>USD Balance</Th>
                        <Th isNumeric>NGN Value</Th>
                        <Th isNumeric>Interest</Th>
                        <Th isNumeric>Currency Gain</Th>
                        <Th isNumeric>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {result.monthlyBreakdown.map((month) => (
                        <Tr key={month.month}>
                          <Td>{formatMonthNumber(month.month)}</Td>
                          <Td isNumeric>
                            {month.exchangeRate
                              ? `$${(month.riseVestBalance / month.exchangeRate).toFixed(2)}`
                              : '-'}
                          </Td>
                          <Td isNumeric>{formatCurrency(month.riseVestBalance)}</Td>
                          <Td isNumeric>{formatCurrency(month.riseVestInterest)}</Td>
                          <Td isNumeric>{formatCurrency(month.currencyGain)}</Td>
                          <Td isNumeric>{formatCurrency(month.riseVestBalance + month.riseVestInterest + month.currencyGain)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Heading size="sm">Vehicle Investment Performance</Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Stat>
                    <StatLabel>Total Investment</StatLabel>
                    <StatNumber>{formatCurrency(result.vehicleResults.totalInvestment)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Total Returns</StatLabel>
                    <StatNumber>{formatCurrency(result.vehicleResults.totalReturns)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Completed Cycles</StatLabel>
                    <StatNumber>{result.vehicleResults.completedCycles}</StatNumber>
                  </Stat>
                </SimpleGrid>

                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Month</Th>
                        <Th isNumeric>Balance</Th>
                        <Th isNumeric>Returns</Th>
                        <Th isNumeric>Investment</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {result.monthlyBreakdown.map((month) => {
                        const isInvestmentMonth = month.month % 3 === 0;
                        const monthsSinceLastInvestment = month.month % 3;
                        const isReturningMonth = monthsSinceLastInvestment > 0 && monthsSinceLastInvestment <= 12;

                        let vehicleStatus = '';
                        if (isInvestmentMonth) {
                          vehicleStatus = 'New Investment';
                        } else if (isReturningMonth) {
                          vehicleStatus = 'Returning';
                        }

                        return (
                          <Tr key={month.month}>
                            <Td>{formatMonthNumber(month.month)}</Td>
                            <Td isNumeric>{formatCurrency(month.vehicleBalance)}</Td>
                            <Td isNumeric>{formatCurrency(month.vehicleReturns)}</Td>
                            <Td isNumeric>
                              {isInvestmentMonth ? formatCurrency(month.vehicleInvestment || 0) : '-'}
                            </Td>
                            <Td>
                              {vehicleStatus && (
                                <Badge
                                  colorScheme={
                                    isInvestmentMonth
                                      ? 'blue'
                                      : isReturningMonth
                                        ? 'green'
                                        : 'gray'
                                  }
                                >
                                  {vehicleStatus}
                                </Badge>
                              )}
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </VStack>
            </TabPanel>

            <TabPanel>
              <TableContainer overflowX="auto" maxW="100vw">
                <Table variant="simple" size={{ base: "sm", md: "md" }}>
                  <Thead>
                    <Tr>
                      <Th whiteSpace="nowrap">Month</Th>
                      <Th isNumeric whiteSpace="nowrap">PiggyVest</Th>
                      <Th isNumeric whiteSpace="nowrap">RiseVest</Th>
                      <Th isNumeric whiteSpace="nowrap">Vehicle</Th>
                      <Th isNumeric whiteSpace="nowrap">Total</Th>
                      <Th isNumeric whiteSpace="nowrap">Currency Gain</Th>
                      <Th whiteSpace="nowrap">Vehicle Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {result.monthlyBreakdown.map((month) => {
                      // Calculate vehicle investment status
                      const isInvestmentMonth = month.month % 3 === 0;
                      const monthsSinceLastInvestment = month.month % 3;
                      const isReturningMonth = monthsSinceLastInvestment > 0 && monthsSinceLastInvestment <= 12;

                      let vehicleStatus = '';
                      if (isInvestmentMonth) {
                        vehicleStatus = 'New Investment';
                      } else if (isReturningMonth) {
                        vehicleStatus = 'Returning';
                      }

                      return (
                        <Tr key={month.month}>
                          <Td>{formatMonthNumber(month.month)}</Td>
                          <Td isNumeric>{formatCurrency(month.piggyVestBalance)}</Td>
                          <Td isNumeric>{formatCurrency(month.riseVestBalance)}</Td>
                          <Td isNumeric>{formatCurrency(month.vehicleBalance)}</Td>
                          <Td isNumeric>{formatCurrency(month.totalBalance)}</Td>
                          <Td isNumeric>{formatCurrency(month.currencyGain)}</Td>
                          <Td>
                            {vehicleStatus && (
                              <Badge
                                colorScheme={
                                  isInvestmentMonth
                                    ? 'blue'
                                    : isReturningMonth
                                      ? 'green'
                                      : 'gray'
                                }
                              >
                                {vehicleStatus}
                              </Badge>
                            )}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <VStack spacing={4} align="stretch">
          <Heading size="md">Strategy Insights</Heading>
          <Text color={textColor}>
            This 3-tier strategy combines the benefits of high-yield savings (PiggyVest), USD exposure (RiseVest),
            and vehicle investments. The strategy has generated a total ROI of {result.totalROI.toFixed(2)}% over
            the analysis period, with {result.vehicleResults.completedCycles} completed vehicle investment cycles
            and a USD portfolio value of ${result.riseVestResults.finalUsdBalance.toFixed(2)}.
          </Text>
          <Text color={textColor}>
            The currency gain from USD appreciation contributed {formatCurrency(result.riseVestResults.currencyGain)}
            to your total returns, while vehicle investments generated {formatCurrency(result.vehicleResults.totalReturns)}
            in returns. Your PiggyVest savings grew to {formatCurrency(result.piggyVestResults.finalBalance)}.
          </Text>
        </VStack>
      </Box>
    </VStack >
  );
} 