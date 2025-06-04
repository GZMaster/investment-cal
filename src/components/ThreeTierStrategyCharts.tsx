import { Box } from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ThreeTierStrategyResult } from '../types/investment';
import { formatMonthNumber } from '../utils/investment-calculator';

interface Props {
  result: ThreeTierStrategyResult;
}

export function ThreeTierStrategyCharts({ result }: Props) {
  const data = result.monthlyBreakdown.map((month) => ({
    month: formatMonthNumber(month.month),
    PiggyVest: month.piggyVestBalance,
    RiseVest: month.riseVestBalance,
    Vehicle: month.vehicleBalance,
    Total: month.totalBalance,
  }));

  return (
    <Box w="full" h="350px">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="PiggyVest" stroke="#3182ce" />
          <Line type="monotone" dataKey="RiseVest" stroke="#805ad5" />
          <Line type="monotone" dataKey="Vehicle" stroke="#ed8936" />
          <Line type="monotone" dataKey="Total" stroke="#38a169" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
} 