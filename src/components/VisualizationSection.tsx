import {
  Box,
  SimpleGrid,
  Heading,
  useColorModeValue,
  Text,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import type { InvestmentScenario, InvestmentResult } from '../types/investment';
import { calculateMonthlyData } from '../utils/investment-calculator';
import { formatCurrency } from '../utils/investment-calculator';
import { getSavingsPlatformName, getInvestmentPlatformName } from '../utils/platform-utils';

const MotionBox = motion(Box);

interface VisualizationSectionProps {
  scenario: InvestmentScenario;
  result: InvestmentResult;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const formatCurrencyTooltip = (value: number) => formatCurrency(value);
const formatExchangeRateTooltip = (value: number) => `₦${value.toLocaleString()}`;

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  const tooltipBg = useColorModeValue('white', 'gray.800');
  const tooltipBorder = useColorModeValue('gray.200', 'gray.700');

  if (active && payload && payload.length) {
    return (
      <Box
        bg={tooltipBg}
        p={3}
        borderWidth="1px"
        borderColor={tooltipBorder}
        borderRadius="md"
        boxShadow="lg"
      >
        <Text fontWeight="bold">Month {label}</Text>
        {payload.map((entry) => (
          <Text key={`${entry.name}-${entry.value}`} color={entry.color}>
            {entry.name}: {entry.name.includes('Rate') ? `₦${entry.value.toLocaleString()}` : formatCurrency(entry.value)}
          </Text>
        ))}
      </Box>
    );
  }
  return null;
};

export function VisualizationSection({ scenario, result }: VisualizationSectionProps) {
  const { timePeriod } = scenario;
  const totalMonths = timePeriod * 12;
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const chartHeight = useBreakpointValue({ base: '300px', md: '400px' });
  const pieRadius = useBreakpointValue({ base: 100, md: 150 });
  const gridColumns = useBreakpointValue({ base: 1, md: 2 });

  const savingsPlatformName = getSavingsPlatformName();
  const investmentPlatformName = getInvestmentPlatformName();

  // Prepare data for charts
  const monthlyData = Array.from({ length: totalMonths }, (_, i) =>
    calculateMonthlyData(i + 1, totalMonths, scenario)
  );

  const lineChartData = monthlyData.map((data) => ({
    month: data.month,
    [savingsPlatformName]: data.savingsPlatformBalance,
    'USD Value': data.usdValue,
    'Total Earnings': data.totalEarnings,
  }));

  const barChartData = monthlyData.map((data) => ({
    month: data.month,
    'Naira Interest': data.nairaInterest,
    'USD Interest': data.usdInterest * data.exchangeRate,
  }));

  const exchangeRateData = monthlyData.map((data) => ({
    month: data.month,
    exchangeRate: data.exchangeRate,
    baseRate: scenario.baseExchangeRate,
  }));

  const pieChartData = [
    {
      name: `${savingsPlatformName} Interest`,
      value: result.compoundEarnings,
      color: '#8884d8',
    },
    {
      name: `${investmentPlatformName} USD Interest`,
      value: result.twoTierEarnings - result.compoundEarnings,
      color: '#82ca9d',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <VStack spacing={8} align="stretch">
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading size="lg" textAlign="center" mb={4}>
          Investment Visualizations
        </Heading>
      </MotionBox>

      <SimpleGrid columns={gridColumns} spacing={6}>
        {/* Growth Over Time Chart */}
        <MotionBox
          p={6}
          bg={bgColor}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Heading size="md" mb={4}>Investment Growth Over Time</Heading>
          <Box height={chartHeight}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrencyTooltip} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={savingsPlatformName}
                  stroke="#8884d8"
                  name={`${savingsPlatformName} Balance`}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="USD Value"
                  stroke="#82ca9d"
                  name="USD Value"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Total Earnings"
                  stroke="#ffc658"
                  name="Total Earnings"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </MotionBox>

        {/* Monthly Interest Comparison */}
        <MotionBox
          p={6}
          bg={bgColor}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Heading size="md" mb={4}>Monthly Interest Comparison</Heading>
          <Box height={chartHeight}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrencyTooltip} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Naira Interest" fill="#8884d8" />
                <Bar dataKey="USD Interest" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </MotionBox>

        {/* USD Exchange Rate Trend */}
        <MotionBox
          p={6}
          bg={bgColor}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Heading size="md" mb={4}>USD Exchange Rate Trend</Heading>
          <Box height={chartHeight}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exchangeRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatExchangeRateTooltip} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="exchangeRate"
                  stroke="#ff7300"
                  name="Exchange Rate"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="baseRate"
                  stroke="#8884d8"
                  name="Base Rate"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </MotionBox>

        {/* Investment Composition */}
        <MotionBox
          p={6}
          bg={bgColor}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.8 }}
          gridColumn={gridColumns === 1 ? '1' : 'span 2'}
        >
          <Heading size="md" mb={4}>Investment Composition</Heading>
          <Box height={chartHeight}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={pieRadius}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={formatCurrencyTooltip} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </MotionBox>

        {/* Summary Statistics */}
        <MotionBox
          p={6}
          bg={bgColor}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Heading size="md" mb={4}>Summary Statistics</Heading>
          <VStack spacing={3} align="stretch">
            <Box>
              <Text fontWeight="bold" color="gray.600">Compound Strategy Earnings:</Text>
              <Text fontSize="lg" fontWeight="bold">{formatCurrency(result.compoundEarnings)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="gray.600">Two-Tier Strategy Earnings:</Text>
              <Text fontSize="lg" fontWeight="bold">{formatCurrency(result.twoTierEarnings)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="gray.600">Additional Earnings:</Text>
              <Text fontSize="lg" fontWeight="bold" color="green.500">
                {formatCurrency(result.twoTierEarnings - result.compoundEarnings)}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="gray.600">Currency Gain:</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.500">
                {formatCurrency(result.currencyGain)}
              </Text>
            </Box>
          </VStack>
        </MotionBox>
      </SimpleGrid>
    </VStack>
  );
} 