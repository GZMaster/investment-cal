import {
  Box,
  SimpleGrid,
  Heading,
  useColorModeValue,
  Text,
  VStack,
} from '@chakra-ui/react';
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

interface VisualizationSectionProps {
  scenario: InvestmentScenario;
  result: InvestmentResult;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const formatCurrencyTooltip = (value: number) => formatCurrency(value);
const formatPercentageTooltip = (value: number) => `${(value * 100).toFixed(1)}%`;

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

  if (active && payload && payload.length) {
    return (
      <Box
        bg={tooltipBg}
        p={3}
        borderWidth="1px"
        borderRadius="md"
        boxShadow="lg"
      >
        <Text fontWeight="bold">Month {label}</Text>
        {payload.map((entry) => (
          <Text key={`${entry.name}-${entry.value}`} color={entry.color}>
            {entry.name}: {entry.value.toLocaleString()}
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

  // Prepare data for charts
  const monthlyData = Array.from({ length: totalMonths }, (_, i) =>
    calculateMonthlyData(i + 1, totalMonths, scenario)
  );

  const lineChartData = monthlyData.map((data) => ({
    month: data.month,
    piggyVestBalance: data.piggyVestBalance,
    usdValue: data.usdValue,
    totalEarnings: data.totalEarnings,
  }));

  const barChartData = monthlyData.map((data) => ({
    month: data.month,
    nairaInterest: data.nairaInterest,
    usdInterest: data.usdInterest * data.exchangeRate,
  }));

  const pieChartData = [
    { name: 'PiggyVest Interest', value: result.compoundEarnings },
    { name: 'RiseVest Interest', value: result.twoTierEarnings - result.compoundEarnings },
    { name: 'Currency Gain', value: result.currencyGain },
  ];

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg" textAlign="center" mb={4}>
        Investment Visualizations
      </Heading>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Growth Over Time Chart */}
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <Heading size="md" mb={4}>Investment Growth Over Time</Heading>
          <Box height="400px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrencyTooltip} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="piggyVestBalance"
                  stroke="#8884d8"
                  name="PiggyVest Balance"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="usdValue"
                  stroke="#82ca9d"
                  name="USD Value"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="totalEarnings"
                  stroke="#ffc658"
                  name="Total Earnings"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Monthly Interest Comparison */}
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <Heading size="md" mb={4}>Monthly Interest Comparison</Heading>
          <Box height="400px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrencyTooltip} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="nairaInterest" fill="#8884d8" name="Naira Interest" />
                <Bar dataKey="usdInterest" fill="#82ca9d" name="USD Interest (in Naira)" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Investment Composition */}
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <Heading size="md" mb={4}>Investment Composition</Heading>
          <Box height="400px">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry) => (
                    <Cell key={`${entry.name}-${entry.value}`} fill={COLORS[pieChartData.indexOf(entry) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatCurrencyTooltip} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Exchange Rate Trend */}
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <Heading size="md" mb={4}>Exchange Rate Trend</Heading>
          <Box height="400px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value: number) => `₦${value.toLocaleString()}`} />
                <Tooltip
                  formatter={(value: number) => `₦${value.toLocaleString()}`}
                  labelFormatter={(label: string) => `Month ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="exchangeRate"
                  stroke="#ff7300"
                  name="Exchange Rate"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </SimpleGrid>
    </VStack>
  );
} 