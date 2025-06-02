import {
  Box,
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Divider,
  TableContainer,
} from '@chakra-ui/react';
import type { AssetAnalysisResult } from '../types/investment';
import { formatCurrency, formatMonthNumber } from '../utils/investment-calculator';
import { AssetAnalysisCharts } from './AssetAnalysisCharts';

interface AssetAnalysisProps {
  result: AssetAnalysisResult;
}

export function AssetAnalysis({ result }: AssetAnalysisProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Calculate investment cycles
  const investmentCycles = result.monthlyBreakdown.reduce((cycles, month) => {
    if (month.investments > 0) {
      const startMonth = month.month;
      cycles.push({
        month: startMonth,
        investmentAmount: month.investments,
        numberOfVehicles: Math.round(month.investments / 3300000),
        monthlyReturn: (Math.round(month.investments / 3300000) * 5600000) / 12,
        totalExpectedReturn: Math.round(month.investments / 3300000) * 5600000,
        returnPeriod: `${startMonth + 1} - ${startMonth + 12}`,
      });
    }
    return cycles;
  }, [] as Array<{
    month: number;
    investmentAmount: number;
    numberOfVehicles: number;
    monthlyReturn: number;
    totalExpectedReturn: number;
    returnPeriod: string;
  }>);

  // Calculate ROI
  const totalROI = ((result.totalReturns - result.totalInvestment) / result.totalInvestment) * 100;
  const monthlyROI = totalROI / (result.monthlyBreakdown.length / 12);

  return (
    <VStack spacing={6} align="stretch" w="full">
      <StatGroup>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 6 }} w="full">
          <Stat>
            <StatLabel>Total Savings</StatLabel>
            <StatNumber fontSize={{ base: 'lg', md: 'xl' }}>{formatCurrency(result.totalSavings)}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total Investment</StatLabel>
            <StatNumber fontSize={{ base: 'lg', md: 'xl' }}>{formatCurrency(result.totalInvestment)}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total Returns</StatLabel>
            <StatNumber fontSize={{ base: 'lg', md: 'xl' }}>{formatCurrency(result.totalReturns)}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total ROI</StatLabel>
            <StatNumber fontSize={{ base: 'lg', md: 'xl' }}>{totalROI.toFixed(2)}%</StatNumber>
            <Text fontSize="sm" color="gray.500">
              {monthlyROI.toFixed(2)}% monthly
            </Text>
          </Stat>
        </SimpleGrid>
      </StatGroup>

      <Divider />

      <AssetAnalysisCharts result={result} />

      <Divider />

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList overflowX="auto" whiteSpace="nowrap">
          <Tab>Monthly Overview</Tab>
          <Tab>Investment Cycles</Tab>
          <Tab>Returns Analysis</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={{ base: 0, md: 4 }}>
            <Box
              bg={bgColor}
              p={{ base: 4, md: 6 }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Heading size="md" mb={4}>Monthly Breakdown</Heading>
              <TableContainer overflowX="auto">
                <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
                  <Thead>
                    <Tr>
                      <Th>Month</Th>
                      <Th isNumeric>Savings</Th>
                      <Th isNumeric>Investments</Th>
                      <Th isNumeric>Returns</Th>
                      <Th isNumeric>Total Balance</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {result.monthlyBreakdown.map((month) => (
                      <Tr key={month.month}>
                        <Td>{formatMonthNumber(month.month)}</Td>
                        <Td isNumeric>{formatCurrency(month.savings)}</Td>
                        <Td isNumeric>{formatCurrency(month.investments)}</Td>
                        <Td isNumeric>{formatCurrency(month.returns)}</Td>
                        <Td isNumeric>{formatCurrency(month.totalBalance)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>

          <TabPanel px={{ base: 0, md: 4 }}>
            <Box
              bg={bgColor}
              p={{ base: 4, md: 6 }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Heading size="md" mb={4}>Investment Cycles</Heading>
              <TableContainer overflowX="auto">
                <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
                  <Thead>
                    <Tr>
                      <Th>Investment Month</Th>
                      <Th isNumeric>Amount</Th>
                      <Th isNumeric>Vehicles</Th>
                      <Th isNumeric>Monthly Return</Th>
                      <Th isNumeric>Total Expected Return</Th>
                      <Th>Return Period</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {investmentCycles.map((cycle) => {
                      const monthsElapsed = result.monthlyBreakdown.length - cycle.month;
                      const totalReturned = cycle.monthlyReturn * Math.min(monthsElapsed, 12);
                      const status = monthsElapsed > 12
                        ? 'Completed (12 months)'
                        : totalReturned >= cycle.totalExpectedReturn
                          ? 'Completed (Full Return)'
                          : 'Active';

                      return (
                        <Tr key={cycle.month}>
                          <Td>{formatMonthNumber(cycle.month)}</Td>
                          <Td isNumeric>{formatCurrency(cycle.investmentAmount)}</Td>
                          <Td isNumeric>{cycle.numberOfVehicles}</Td>
                          <Td isNumeric>{formatCurrency(cycle.monthlyReturn)}</Td>
                          <Td isNumeric>{formatCurrency(cycle.totalExpectedReturn)}</Td>
                          <Td>{cycle.returnPeriod}</Td>
                          <Td>
                            <Badge
                              colorScheme={
                                monthsElapsed > 12
                                  ? 'green'
                                  : totalReturned >= cycle.totalExpectedReturn
                                    ? 'blue'
                                    : 'yellow'
                              }
                            >
                              {status}
                            </Badge>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>

          <TabPanel px={{ base: 0, md: 4 }}>
            <Box
              bg={bgColor}
              p={{ base: 4, md: 6 }}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Heading size="md" mb={4}>Returns Analysis</Heading>
              <TableContainer overflowX="auto">
                <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
                  <Thead>
                    <Tr>
                      <Th>Period</Th>
                      <Th isNumeric>Total Investment</Th>
                      <Th isNumeric>Total Returns</Th>
                      <Th isNumeric>Net Profit</Th>
                      <Th isNumeric>ROI</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Year 1</Td>
                      <Td isNumeric>
                        {formatCurrency(
                          result.monthlyBreakdown
                            .filter((m) => m.month <= 12)
                            .reduce((sum, m) => sum + m.investments, 0)
                        )}
                      </Td>
                      <Td isNumeric>
                        {formatCurrency(
                          result.monthlyBreakdown
                            .filter((m) => m.month <= 12)
                            .reduce((sum, m) => sum + m.returns, 0)
                        )}
                      </Td>
                      <Td isNumeric>
                        {formatCurrency(
                          result.monthlyBreakdown
                            .filter((m) => m.month <= 12)
                            .reduce((sum, m) => sum + m.returns - m.investments, 0)
                        )}
                      </Td>
                      <Td isNumeric>
                        {(
                          (result.monthlyBreakdown
                            .filter((m) => m.month <= 12)
                            .reduce((sum, m) => sum + m.returns - m.investments, 0) /
                            result.monthlyBreakdown
                              .filter((m) => m.month <= 12)
                              .reduce((sum, m) => sum + m.investments, 0)) *
                          100
                        ).toFixed(2)}
                        %
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Year 2</Td>
                      <Td isNumeric>
                        {formatCurrency(
                          result.monthlyBreakdown
                            .filter((m) => m.month > 12)
                            .reduce((sum, m) => sum + m.investments, 0)
                        )}
                      </Td>
                      <Td isNumeric>
                        {formatCurrency(
                          result.monthlyBreakdown
                            .filter((m) => m.month > 12)
                            .reduce((sum, m) => sum + m.returns, 0)
                        )}
                      </Td>
                      <Td isNumeric>
                        {formatCurrency(
                          result.monthlyBreakdown
                            .filter((m) => m.month > 12)
                            .reduce((sum, m) => sum + m.returns - m.investments, 0)
                        )}
                      </Td>
                      <Td isNumeric>
                        {(
                          (result.monthlyBreakdown
                            .filter((m) => m.month > 12)
                            .reduce((sum, m) => sum + m.returns - m.investments, 0) /
                            result.monthlyBreakdown
                              .filter((m) => m.month > 12)
                              .reduce((sum, m) => sum + m.investments, 0)) *
                          100
                        ).toFixed(2)}
                        %
                      </Td>
                    </Tr>
                    <Tr fontWeight="bold">
                      <Td>Total</Td>
                      <Td isNumeric>{formatCurrency(result.totalInvestment)}</Td>
                      <Td isNumeric>{formatCurrency(result.totalReturns)}</Td>
                      <Td isNumeric>
                        {formatCurrency(result.totalReturns - result.totalInvestment)}
                      </Td>
                      <Td isNumeric>{totalROI.toFixed(2)}%</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
} 