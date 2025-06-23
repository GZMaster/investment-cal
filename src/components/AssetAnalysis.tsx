import {
  Box,
  VStack,
  Text,
  useColorModeValue,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  SimpleGrid,
  Badge,
  Divider,
} from '@chakra-ui/react';
import type { AssetAnalysisResult } from '../types/investment';
import { formatCurrency, formatMonthNumber } from '../utils/investment-calculator';
import { AssetAnalysisCharts } from './AssetAnalysisCharts';
import { StatsGrid, TabsContainer, TabPanel, DataTable } from './ui';

interface AssetAnalysisProps {
  result: AssetAnalysisResult;
}

export function AssetAnalysis({ result }: AssetAnalysisProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const totalROI = ((result.totalReturns - result.totalInvestment) / result.totalInvestment) * 100;
  const monthlyROI = totalROI / result.monthlyBreakdown.length;

  const overallStats = [
    { label: 'Total Savings', value: formatCurrency(result.totalSavings) },
    { label: 'Total Investment', value: formatCurrency(result.totalInvestment) },
    { label: 'Total Returns', value: formatCurrency(result.totalReturns) },
    {
      label: 'Total ROI',
      value: `${totalROI.toFixed(2)}%`,
      helpText: `${monthlyROI.toFixed(2)}% monthly`,
    },
  ];

  const monthlyOverviewColumns = [
    { key: 'month', label: 'Month' },
    { key: 'savings', label: 'Savings', isNumeric: true },
    { key: 'investments', label: 'Investments', isNumeric: true },
    { key: 'returns', label: 'Returns', isNumeric: true },
    { key: 'totalBalance', label: 'Total Balance', isNumeric: true },
  ];

  const returnsAnalysisColumns = [
    { key: 'period', label: 'Period' },
    { key: 'totalInvestment', label: 'Total Investment', isNumeric: true },
    { key: 'totalReturns', label: 'Total Returns', isNumeric: true },
    { key: 'netProfit', label: 'Net Profit', isNumeric: true },
    { key: 'roi', label: 'ROI', isNumeric: true },
  ];

  const monthlyOverviewData = result.monthlyBreakdown.map((month) => ({
    month: formatMonthNumber(month.month),
    savings: month.savings,
    investments: month.investments,
    returns: month.returns,
    totalBalance: month.totalBalance,
  }));

  const returnsAnalysisData = [
    {
      period: 'Year 1',
      totalInvestment: formatCurrency(
        result.monthlyBreakdown
          .filter((m) => m.month <= 12)
          .reduce((sum, m) => sum + m.investments, 0)
      ),
      totalReturns: formatCurrency(
        result.monthlyBreakdown
          .filter((m) => m.month <= 12)
          .reduce((sum, m) => sum + m.returns, 0)
      ),
      netProfit: formatCurrency(
        result.monthlyBreakdown
          .filter((m) => m.month <= 12)
          .reduce((sum, m) => sum + m.returns - m.investments, 0)
      ),
      roi: `${(
        (result.monthlyBreakdown
          .filter((m) => m.month <= 12)
          .reduce((sum, m) => sum + m.returns - m.investments, 0) /
          result.monthlyBreakdown
            .filter((m) => m.month <= 12)
            .reduce((sum, m) => sum + m.investments, 0)) *
        100
      ).toFixed(2)}%`,
    },
    {
      period: 'Year 2',
      totalInvestment: formatCurrency(
        result.monthlyBreakdown
          .filter((m) => m.month > 12 && m.month <= 24)
          .reduce((sum, m) => sum + m.investments, 0)
      ),
      totalReturns: formatCurrency(
        result.monthlyBreakdown
          .filter((m) => m.month > 12 && m.month <= 24)
          .reduce((sum, m) => sum + m.returns, 0)
      ),
      netProfit: formatCurrency(
        result.monthlyBreakdown
          .filter((m) => m.month > 12 && m.month <= 24)
          .reduce((sum, m) => sum + m.returns - m.investments, 0)
      ),
      roi: `${(
        (result.monthlyBreakdown
          .filter((m) => m.month > 12 && m.month <= 24)
          .reduce((sum, m) => sum + m.returns - m.investments, 0) /
          result.monthlyBreakdown
            .filter((m) => m.month > 12 && m.month <= 24)
            .reduce((sum, m) => sum + m.investments, 0)) *
        100
      ).toFixed(2)}%`,
    },
    {
      period: 'Total',
      totalInvestment: formatCurrency(result.totalInvestment),
      totalReturns: formatCurrency(result.totalReturns),
      netProfit: formatCurrency(result.totalReturns - result.totalInvestment),
      roi: `${totalROI.toFixed(2)}%`,
    },
  ];

  const tabs = [
    {
      label: 'Monthly Overview',
      content: (
        <TabPanel title="Monthly Breakdown">
          <DataTable
            data={monthlyOverviewData}
            columns={monthlyOverviewColumns}
            size={{ base: 'sm', md: 'md' }}
          />
        </TabPanel>
      ),
    },
    {
      label: 'Returns Analysis',
      content: (
        <TabPanel title="Returns Analysis">
          <DataTable
            data={returnsAnalysisData}
            columns={returnsAnalysisColumns}
            size={{ base: 'sm', md: 'md' }}
          />
        </TabPanel>
      ),
    },
  ];

  return (
    <VStack spacing={6} align="stretch" w="full">
      <StatsGrid stats={overallStats} />

      <Divider />

      <AssetAnalysisCharts result={result} />

      <Divider />

      <TabsContainer tabs={tabs} colorScheme="blue" />
    </VStack>
  );
} 