import type React from 'react';
import {
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  Box,
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { PLATFORMS, type PlatformBalance, type WeeklyAllocation } from '../types/budget';

interface BudgetVisualizationsProps {
  balances: PlatformBalance[];
  weeklyAllocation: WeeklyAllocation;
  getPlatformName: (id: string) => string;
  formatCurrencyShort: (value: number) => string;
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
}: BudgetVisualizationsProps) {
  return (
    <Card mt={8}>
      <CardBody>
        <Heading size="lg" mb={6} textAlign="center">Budget Visualizations</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* Bar Chart: Current & Debt Balances per Platform */}
          <Box>
            <Heading size="md" mb={4}>Balances by Platform</Heading>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={balances.map(b => ({
                name: getPlatformName(b.platformId),
                'Current Balance': b.currentBalance,
                'Debt Balance': b.debtBalance,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatCurrencyShort} />
                <RechartsTooltip content={BarChartTooltip} />
                <Legend />
                <Bar dataKey="Current Balance" fill="#3182ce" />
                <Bar dataKey="Debt Balance" fill="#e53e3e" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          {/* Pie Chart: Allocation Distribution */}
          <Box>
            <Heading size="md" mb={4}>Weekly Allocation Distribution</Heading>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={PLATFORMS.map(p => ({
                    name: p.name,
                    value: weeklyAllocation[p.id as keyof WeeklyAllocation] || 0
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {PLATFORMS.map((p, i) => (
                    <Cell key={p.id} fill={["#3182ce", "#38a169", "#d69e2e", "#e53e3e", "#805ad5"][i % 5]} />
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