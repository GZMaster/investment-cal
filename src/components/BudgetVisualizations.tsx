import type React from 'react';
import {
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  Box,
  Text,
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { type PlatformBalance, type WeeklyAllocation } from '../types/budget';
import { usePlatforms } from '../hooks/usePlatforms';

interface BudgetVisualizationsProps {
  balances: PlatformBalance[];
  weeklyAllocation: WeeklyAllocation;
  formatCurrencyShort: (value: number) => string;
  numWeeks: number;
  exchangeRateData?: { rate: number };
}

function BarChartTooltip({ active, payload }: any): React.ReactNode {
  if (active && payload && payload.length) {
    return (
      <Box bg="white" p={3} borderWidth="1px" borderRadius="md" boxShadow="md">
        {payload.map((entry: any) => (
          <Box as="span" key={entry.dataKey} color={entry.color} fontWeight="bold" display="block">
            {entry.name}: {entry.value.toLocaleString(undefined, {
              style: 'currency',
              currency: entry.payload.currency === 'USD' ? 'USD' : 'NGN',
              maximumFractionDigits: entry.payload.currency === 'USD' ? 2 : 0
            })}
          </Box>
        ))}
      </Box>
    );
  }
  return null;
}

function PieChartTooltip({ active, payload }: any): React.ReactNode {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box bg="white" p={3} borderWidth="1px" borderRadius="md" boxShadow="md">
        <Text fontWeight="bold">{data.name}</Text>
        <Text>
          {data.value.toLocaleString(undefined, {
            style: 'currency',
            currency: data.currency === 'USD' ? 'USD' : 'NGN',
            maximumFractionDigits: data.currency === 'USD' ? 2 : 0
          })}
        </Text>
        <Text color="gray.500">
          {((data.percent || 0) * 100).toFixed(1)}%
        </Text>
      </Box>
    );
  }
  return null;
}

export function BudgetVisualizations({
  balances,
  weeklyAllocation,
  formatCurrencyShort,
  numWeeks,
  exchangeRateData,
}: BudgetVisualizationsProps) {
  const { platforms } = usePlatforms();

  const chartData = platforms.map(platform => {
    const balance = balances.find(b => b.platformId === platform.id);
    const allocation = weeklyAllocation[platform.id] || 0;
    const totalAllocation = platform.currency === 'USD' && exchangeRateData?.rate
      ? (allocation * numWeeks) / exchangeRateData.rate
      : allocation * numWeeks;

    return {
      name: platform.name,
      'Current Balance': balance?.currentBalance || 0,
      'Expected Balance': (balance?.currentBalance || 0) + totalAllocation,
      'Debt Balance': balance?.debtBalance || 0,
      'Expected Debt': Math.max(0, (balance?.debtBalance || 0) - ((balance?.currentBalance || 0) + totalAllocation)),
      type: platform.type,
      currency: platform.currency,
    };
  });

  // Calculate total weekly income from allocations
  const totalWeeklyIncome = Object.values(weeklyAllocation).reduce((sum, v) => sum + v, 0);
  const totalMonthlyIncome = totalWeeklyIncome * numWeeks;

  // Calculate total allocations for the month
  const totalAllocations = platforms.reduce((sum, p) => {
    const allocation = weeklyAllocation[p.id] || 0;
    if (p.currency === 'USD' && exchangeRateData?.rate) {
      return sum + ((allocation * numWeeks) / exchangeRateData.rate);
    }
    return sum + (allocation * numWeeks);
  }, 0);

  // Calculate balance left
  const balanceLeft = Math.max(0, totalMonthlyIncome - totalAllocations);

  // Pie chart data: monthly allocation
  const pieData = [
    ...platforms.map(p => {
      const allocation = weeklyAllocation[p.id] || 0;
      const monthlyAllocation = p.currency === 'USD' && exchangeRateData?.rate
        ? (allocation * numWeeks) / exchangeRateData.rate
        : allocation * numWeeks;

      return {
        name: p.name,
        value: monthlyAllocation,
        currency: p.currency,
      };
    }),
    { name: 'Balance Left', value: balanceLeft, currency: 'NGN' }
  ];

  const COLORS = ['#3182ce', '#38a169', '#d69e2e', '#e53e3e', '#805ad5', '#dd6b20', '#6b46c1', '#2c5282'];

  return (
    <Card mt={8}>
      <CardBody>
        <Heading size="lg" mb={6} textAlign="center">Budget Visualizations</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* Bar Chart: Current, Expected, Debt, Expected Debt Balances per Platform */}
          <Box>
            <Heading size="md" mb={4}>Balances by Platform</Heading>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={formatCurrencyShort}
                  width={80}
                />
                <RechartsTooltip content={BarChartTooltip} />
                <Legend />
                <Bar dataKey="Current Balance" fill="#3182ce" />
                <Bar dataKey="Expected Balance" fill="#38a169" />
                <Bar dataKey="Debt Balance" fill="#e53e3e" />
                <Bar dataKey="Expected Debt" fill="#d69e2e" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          {/* Pie Chart: Allocation Distribution */}
          <Box>
            <Heading size="md" mb={4}>Monthly Allocation Distribution</Heading>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                  }
                >
                  {pieData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={entry.name === 'Balance Left' ? '#A0AEC0' : COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip content={PieChartTooltip} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
} 