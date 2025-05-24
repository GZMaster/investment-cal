import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import type { InvestmentScenario, MonthlyData } from '../types/investment';
import { calculateMonthlyData } from '../utils/investment-calculator';
import { formatCurrency } from '../utils/investment-calculator';

interface InvestmentTableProps {
  scenario: InvestmentScenario;
}

export function InvestmentTable({ scenario }: InvestmentTableProps) {
  const { appreciation, timePeriod } = scenario;
  const totalMonths = timePeriod * 12;
  const monthlyAppreciationRate = (1 + appreciation / 100) ** (1 / 12) - 1;

  const bgColor = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('blue.500', 'blue.900');
  const headerColor = useColorModeValue('white', 'gray.100');

  const monthData: MonthlyData[] = Array.from(
    { length: Math.min(12, totalMonths) },
    (_, i) => calculateMonthlyData(i + 1, totalMonths, monthlyAppreciationRate)
  );

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
    >
      <Box bg={headerBg} p={4}>
        <Text color={headerColor} fontWeight="bold" textAlign="center">
          Two-Tier Strategy with Currency Appreciation
        </Text>
      </Box>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Month</Th>
              <Th isNumeric>PiggyVest Balance</Th>
              <Th isNumeric>Naira Interest</Th>
              <Th isNumeric>USD Added</Th>
              <Th isNumeric>Cumulative USD</Th>
              <Th isNumeric>USD Interest</Th>
              <Th isNumeric>Exchange Rate</Th>
              <Th isNumeric>USD Value (₦)</Th>
              <Th isNumeric>Total Earnings</Th>
            </Tr>
          </Thead>
          <Tbody>
            {monthData.map((data) => (
              <Tr key={data.month}>
                <Td>{data.month}</Td>
                <Td isNumeric>{formatCurrency(data.piggyVestBalance)}</Td>
                <Td isNumeric>{formatCurrency(data.nairaInterest)}</Td>
                <Td isNumeric>{data.usdAdded.toFixed(2)}</Td>
                <Td isNumeric>{data.cumulativeUSD.toFixed(2)}</Td>
                <Td isNumeric>{data.usdInterest.toFixed(2)}</Td>
                <Td isNumeric>{formatCurrency(data.exchangeRate)}</Td>
                <Td isNumeric>{formatCurrency(data.usdValue)}</Td>
                <Td isNumeric>{formatCurrency(data.totalEarnings)}</Td>
              </Tr>
            ))}
            {totalMonths > 12 && (
              <Tr bg="blue.50">
                <Td colSpan={9} textAlign="center" fontStyle="italic" color="gray.600">
                  <strong>... {totalMonths - 12} additional months calculated ...</strong>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
} 