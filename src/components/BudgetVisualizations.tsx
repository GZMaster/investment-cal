import type React from 'react';
import {
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  Box,
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { type PlatformBalance, type WeeklyAllocation } from '../types/budget';
import { usePlatforms } from '../hooks/usePlatforms';

interface BudgetVisualizationsProps {
  balances: PlatformBalance[];
  weeklyAllocation: WeeklyAllocation;
  getPlatformName: (id: string) => string;
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
            {entry.name}: {entry.value}
          </Box>
        ))}
      </Box>
    );
  }
  return null;
}

export function BudgetVisualizations({
  balances,
  weeklyAllocation,
  getPlatformName,
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

  // Pie chart data: monthly allocation
  const totalAllocations = platforms.reduce((sum, p) => sum + ((weeklyAllocation[p.id] || 0) * numWeeks), 0);
  const balanceLeft = Math.max(0, (numWeeks * (Object.values(weeklyAllocation).reduce((sum, v) => sum + v, 0))) - totalAllocations);
  const pieData = [
    ...platforms.map(p => ({
      name: p.name,
      value: (weeklyAllocation[p.id] || 0) * numWeeks,
    })),
    { name: 'Balance Left', value: balanceLeft }
  ];

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
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatCurrencyShort} />
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
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={entry.name === 'Balance Left' ? '#A0AEC0' : ["#3182ce", "#38a169", "#d69e2e", "#e53e3e", "#805ad5"][i % 5]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
} 