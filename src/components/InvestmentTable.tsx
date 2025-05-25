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
import type { InvestmentScenario } from '../types/investment';
import { calculateMonthlyData } from '../utils/investment-calculator';
import { formatCurrency } from '../utils/investment-calculator';

interface InvestmentTableProps {
  scenario: InvestmentScenario;
}

export function InvestmentTable({ scenario }: InvestmentTableProps) {
  const { timePeriod } = scenario;
  const totalMonths = timePeriod * 12;
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const monthlyData = Array.from({ length: totalMonths }, (_, i) =>
    calculateMonthlyData(i + 1, totalMonths, scenario)
  );

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      overflowX="auto"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Monthly Breakdown
      </Text>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Month</Th>
            <Th isNumeric>PiggyVest Balance</Th>
            <Th isNumeric>Naira Interest</Th>
            <Th isNumeric>USD Added</Th>
            <Th isNumeric>Cumulative USD</Th>
            <Th isNumeric>USD Interest</Th>
            <Th isNumeric>Exchange Rate</Th>
            <Th isNumeric>USD Value</Th>
            <Th isNumeric>Total Earnings</Th>
          </Tr>
        </Thead>
        <Tbody>
          {monthlyData.map((data) => (
            <Tr key={data.month}>
              <Td>{data.month}</Td>
              <Td isNumeric>{formatCurrency(data.piggyVestBalance)}</Td>
              <Td isNumeric>{formatCurrency(data.nairaInterest)}</Td>
              <Td isNumeric>${data.usdAdded.toFixed(2)}</Td>
              <Td isNumeric>${data.cumulativeUSD.toFixed(2)}</Td>
              <Td isNumeric>${data.usdInterest.toFixed(2)}</Td>
              <Td isNumeric>₦{data.exchangeRate.toLocaleString()}</Td>
              <Td isNumeric>{formatCurrency(data.usdValue)}</Td>
              <Td isNumeric>{formatCurrency(data.totalEarnings)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
} 