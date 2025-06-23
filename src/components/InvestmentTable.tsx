import {
  Box,
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
import { getSavingsPlatformName } from '../utils/platform-utils';
import { DataTable } from './ui';

const MotionBox = motion(Box);

interface InvestmentTableProps {
  scenario: InvestmentScenario;
}

export function InvestmentTable({ scenario }: InvestmentTableProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('blue.500', 'blue.300');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

  const { timePeriod } = scenario;
  const totalMonths = timePeriod * 12;
  const monthlyData = Array.from({ length: totalMonths }, (_, i) =>
    calculateMonthlyData(i + 1, totalMonths, scenario)
  );
  const savingsPlatformName = getSavingsPlatformName();

  const columnLabels: Record<string, string> = {
    month: 'Month',
    savings: savingsPlatformName,
    investment: 'Investment',
    returns: 'Returns',
    total: 'Total',
  };

  const visibleColumns = useBreakpointValue({
    base: ['month', 'savings', 'total'],
    md: ['month', 'savings', 'investment', 'returns', 'total'],
  });

  const formatValue = (column: string, value: number) => {
    if (column === 'month') {
      return `Month ${value}`;
    }
    return formatCurrency(value);
  };

  const columns = visibleColumns?.map((column) => ({
    key: column,
    label: columnLabels[column],
    isNumeric: column !== 'month',
    render: (value: any) => formatValue(column, value),
  })) || [];

  const data = monthlyData.map((data) => ({
    month: data.month,
    savings: data.savingsPlatformBalance,
    investment: data.usdAdded,
    returns: data.totalEarnings,
    total: data.totalEarnings,
  }));

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

      <DataTable
        data={data}
        columns={columns}
        variant="simple"
        size="sm"
        hoverEffect={true}
      />
    </MotionBox>
  );
} 