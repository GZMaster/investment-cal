import {
  Box,
  VStack,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';
import { FaMoneyBillWave, FaChartLine, FaCar, FaDollarSign } from 'react-icons/fa';
import type { ThreeTierStrategyResult } from '../types/investment';
import { formatCurrency } from '../utils/investment-calculator';
import { getSavingsPlatformName, getInvestmentPlatformName } from '../utils/platform-utils';
import { ThreeTierStrategyCharts } from './ThreeTierStrategyCharts';
import { StatsGrid, TabsContainer, TabPanel, DataTable } from './ui';

interface ThreeTierStrategyAnalysisProps {
  result: ThreeTierStrategyResult;
}

export function ThreeTierStrategyAnalysis({ result }: ThreeTierStrategyAnalysisProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const savingsPlatformName = getSavingsPlatformName();
  const investmentPlatformName = getInvestmentPlatformName();

  const overallStats = [
    {
      label: 'Total Investment',
      value: formatCurrency(result.totalInvestment),
      icon: <FaMoneyBillWave color="blue.500" />,
      helpText: 'Combined across all tiers',
      arrowType: 'increase' as const,
    },
    {
      label: 'Total Returns',
      value: formatCurrency(result.totalReturns),
      icon: <FaChartLine color="green.500" />,
      helpText: `${result.totalROI.toFixed(2)}% ROI`,
      arrowType: 'increase' as const,
    },
    {
      label: 'USD Portfolio',
      value: `$${result.investmentPlatformResults.finalUsdBalance.toFixed(2)}`,
      icon: <FaDollarSign color="purple.500" />,
      helpText: `${formatCurrency(result.investmentPlatformResults.currencyGain)} currency gain`,
      arrowType: 'increase' as const,
    },
    {
      label: 'Vehicle Investments',
      value: `${result.vehicleResults.completedCycles} cycles`,
      icon: <FaCar color="orange.500" />,
      helpText: `${result.vehicleResults.roi.toFixed(2)}% ROI`,
      arrowType: 'increase' as const,
    },
  ];

  const savingsPlatformStats = [
    { label: 'Total Investment', value: formatCurrency(result.savingsPlatformResults.totalInvestment) },
    { label: 'Total Returns', value: formatCurrency(result.savingsPlatformResults.totalReturns) },
    { label: 'ROI', value: `${result.savingsPlatformResults.roi.toFixed(2)}%` },
  ];

  const investmentPlatformStats = [
    { label: 'Total Investment', value: formatCurrency(result.investmentPlatformResults.totalInvestment) },
    { label: 'Total Returns', value: formatCurrency(result.investmentPlatformResults.totalReturns) },
    { label: 'Currency Gain', value: formatCurrency(result.investmentPlatformResults.currencyGain) },
  ];

  const vehicleStats = [
    { label: 'Total Investment', value: formatCurrency(result.vehicleResults.totalInvestment) },
    { label: 'Total Returns', value: formatCurrency(result.vehicleResults.totalReturns) },
    { label: 'Completed Cycles', value: result.vehicleResults.completedCycles },
  ];

  const savingsPlatformColumns = [
    { key: 'month', label: 'Month' },
    { key: 'balance', label: 'Balance', isNumeric: true },
    { key: 'interest', label: 'Interest', isNumeric: true },
    { key: 'savings', label: 'Savings', isNumeric: true },
    { key: 'total', label: 'Total', isNumeric: true },
  ];

  const investmentPlatformColumns = [
    { key: 'month', label: 'Month' },
    { key: 'usdBalance', label: 'USD Balance', isNumeric: true },
    { key: 'ngnValue', label: 'NGN Value', isNumeric: true },
    { key: 'interest', label: 'Interest', isNumeric: true },
    { key: 'currencyGain', label: 'Currency Gain', isNumeric: true },
    { key: 'total', label: 'Total', isNumeric: true },
  ];

  const vehicleColumns = [
    { key: 'month', label: 'Month' },
    { key: 'balance', label: 'Balance', isNumeric: true },
    { key: 'returns', label: 'Returns', isNumeric: true },
    { key: 'investment', label: 'Investment', isNumeric: true },
    { key: 'status', label: 'Status' },
  ];

  const monthlyBreakdownColumns = [
    { key: 'month', label: 'Month', whiteSpace: 'nowrap' },
    { key: 'savings', label: savingsPlatformName, isNumeric: true, whiteSpace: 'nowrap' },
    { key: 'investment', label: investmentPlatformName, isNumeric: true, whiteSpace: 'nowrap' },
    { key: 'vehicle', label: 'Vehicle', isNumeric: true, whiteSpace: 'nowrap' },
    { key: 'total', label: 'Total', isNumeric: true, whiteSpace: 'nowrap' },
    { key: 'currencyGain', label: 'Currency Gain', isNumeric: true, whiteSpace: 'nowrap' },
    { key: 'vehicleStatus', label: 'Vehicle Status', whiteSpace: 'nowrap' },
  ];

  const savingsPlatformData = result.monthlyBreakdown.map((month) => ({
    month: month.month,
    balance: month.savingsPlatformBalance,
    interest: month.savingsPlatformInterest,
    savings: month.monthlySavingsPlatformSavings || 0,
    total: month.savingsPlatformBalance + month.savingsPlatformInterest,
  }));

  const investmentPlatformData = result.monthlyBreakdown.map((month) => ({
    month: month.month,
    usdBalance: month.exchangeRate ? (month.investmentPlatformBalance / month.exchangeRate).toFixed(2) : '-',
    ngnValue: month.investmentPlatformBalance,
    interest: month.investmentPlatformInterest,
    currencyGain: month.currencyGain,
    total: month.investmentPlatformBalance + month.investmentPlatformInterest + month.currencyGain,
  }));

  const vehicleData = result.monthlyBreakdown.map((month) => {
    const isInvestmentMonth = month.month % result.cyclePeriod === 0;
    const monthsSinceLastInvestment = month.month % result.cyclePeriod;
    const isReturningMonth = monthsSinceLastInvestment > 0 && monthsSinceLastInvestment <= result.investmentPeriod;

    let vehicleStatus = '';
    if (isInvestmentMonth) {
      vehicleStatus = 'New Investment';
    } else if (isReturningMonth) {
      vehicleStatus = 'Returning';
    }

    return {
      month: month.month,
      balance: month.vehicleBalance,
      returns: month.vehicleReturns,
      investment: month.vehicleInvestment,
      status: vehicleStatus,
    };
  });

  const monthlyBreakdownData = result.monthlyBreakdown.map((month) => {
    const isInvestmentMonth = month.month % result.cyclePeriod === 0;
    const monthsSinceLastInvestment = month.month % result.cyclePeriod;
    const isReturningMonth = monthsSinceLastInvestment > 0 && monthsSinceLastInvestment <= result.investmentPeriod;

    let vehicleStatus = '';
    if (isInvestmentMonth) {
      vehicleStatus = 'New Investment';
    } else if (isReturningMonth) {
      vehicleStatus = 'Returning';
    }

    return {
      month: month.month,
      savings: month.savingsPlatformBalance + month.savingsPlatformInterest,
      investment: month.investmentPlatformBalance + month.investmentPlatformInterest + month.currencyGain,
      vehicle: month.vehicleBalance + month.vehicleReturns,
      total: month.savingsPlatformBalance + month.savingsPlatformInterest + month.investmentPlatformBalance + month.investmentPlatformInterest + month.currencyGain + month.vehicleBalance + month.vehicleReturns,
      currencyGain: month.currencyGain,
      vehicleStatus,
    };
  });

  const tabs = [
    {
      label: `${savingsPlatformName} Tier`,
      content: (
        <TabPanel title={`${savingsPlatformName} Performance`} stats={savingsPlatformStats}>
          <DataTable
            data={savingsPlatformData}
            columns={savingsPlatformColumns}
            size="sm"
          />
        </TabPanel>
      ),
    },
    {
      label: `${investmentPlatformName} Tier`,
      content: (
        <TabPanel title={`${investmentPlatformName} Performance`} stats={investmentPlatformStats}>
          <DataTable
            data={investmentPlatformData}
            columns={investmentPlatformColumns}
            size="sm"
          />
        </TabPanel>
      ),
    },
    {
      label: 'Vehicle Tier',
      content: (
        <TabPanel title="Vehicle Investment Performance" stats={vehicleStats}>
          <DataTable
            data={vehicleData}
            columns={vehicleColumns}
            size="sm"
          />
        </TabPanel>
      ),
    },
    {
      label: 'Monthly Breakdown',
      content: (
        <DataTable
          data={monthlyBreakdownData}
          columns={monthlyBreakdownColumns}
          size={{ base: "sm", md: "md" }}
          maxW="100vw"
        />
      ),
    },
  ];

  return (
    <VStack spacing={8} align="stretch">
      <Box bg={bgColor} p={{ base: 4, md: 6 }} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          <Heading size={{ base: "sm", md: "md" }}>Overall Strategy Summary</Heading>
          <StatsGrid stats={overallStats} />
          <ThreeTierStrategyCharts result={result} />
        </VStack>
      </Box>

      <Box bg={bgColor} p={{ base: 4, md: 6 }} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <TabsContainer tabs={tabs} size={{ base: "sm", md: "md" }} />
      </Box>
    </VStack>
  );
} 