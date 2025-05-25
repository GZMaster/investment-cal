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
  useBreakpointValue,
  Icon,
  Heading,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaTable } from 'react-icons/fa';
import type { InvestmentScenario } from '../types/investment';
import { calculateMonthlyData } from '../utils/investment-calculator';
import { formatCurrency } from '../utils/investment-calculator';

const MotionBox = motion(Box);

interface InvestmentTableProps {
  scenario: InvestmentScenario;
}

export function InvestmentTable({ scenario }: InvestmentTableProps) {
  const { timePeriod } = scenario;
  const totalMonths = timePeriod * 12;
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('blue.500', 'blue.300');

  const monthlyData = Array.from({ length: totalMonths }, (_, i) =>
    calculateMonthlyData(i + 1, totalMonths, scenario)
  );

  const visibleColumns = useBreakpointValue({
    base: ['month', 'piggyVestBalance', 'totalEarnings'],
    sm: ['month', 'piggyVestBalance', 'nairaInterest', 'totalEarnings'],
    md: ['month', 'piggyVestBalance', 'nairaInterest', 'usdValue', 'totalEarnings'],
    lg: ['month', 'piggyVestBalance', 'nairaInterest', 'usdAdded', 'cumulativeUSD', 'usdInterest', 'exchangeRate', 'usdValue', 'totalEarnings'],
  });

  const columnLabels: Record<string, string> = {
    month: 'Month',
    piggyVestBalance: 'PiggyVest Balance',
    nairaInterest: 'Naira Interest',
    usdAdded: 'USD Added',
    cumulativeUSD: 'Cumulative USD',
    usdInterest: 'USD Interest',
    exchangeRate: 'Exchange Rate',
    usdValue: 'USD Value',
    totalEarnings: 'Total Earnings',
  };

  const formatValue = (key: string, value: number) => {
    switch (key) {
      case 'usdAdded':
      case 'cumulativeUSD':
      case 'usdInterest':
        return `$${value.toFixed(2)}`;
      case 'exchangeRate':
        return `₦${value.toLocaleString()}`;
      default:
        return formatCurrency(value);
    }
  };

  return (
    <MotionBox
      p={6}
      bg={bgColor}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="lg"
      overflowX="auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex align="center" gap={3} mb={4}>
        <Icon as={FaTable} boxSize={6} color={iconColor} />
        <Heading size="md">Monthly Breakdown</Heading>
      </Flex>

      <Box overflowX="auto" css={{
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: useColorModeValue('gray.100', 'gray.700'),
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: useColorModeValue('gray.300', 'gray.600'),
          borderRadius: '4px',
          '&:hover': {
            background: useColorModeValue('gray.400', 'gray.500'),
          },
        },
      }}>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              {visibleColumns?.map((column) => (
                <Th key={column} isNumeric={column !== 'month'}>
                  {columnLabels[column]}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {monthlyData.map((data) => (
              <Tr key={data.month}>
                {visibleColumns?.map((column) => (
                  <Td key={`${data.month}-${column}`} isNumeric={column !== 'month'}>
                    {column === 'month' ? data.month : formatValue(column, data[column as keyof typeof data] as number)}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </MotionBox>
  );
} 