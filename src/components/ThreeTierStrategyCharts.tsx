import { Box, useBreakpointValue } from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import type { ThreeTierStrategyResult } from '../types/investment';
import { formatMonthNumber } from '../utils/investment-calculator';

interface Props {
  result: ThreeTierStrategyResult;
}

export function ThreeTierStrategyCharts({ result }: Props) {
  const chartHeight = useBreakpointValue({ base: '250px', md: '350px' });
  const fontSize = useBreakpointValue({ base: 12, md: 14 });
  const tickCount = useBreakpointValue({ base: 5, md: 10 }) ?? 5;

  const data = result.monthlyBreakdown.map((month) => ({
    month: formatMonthNumber(month.month),
    PiggyVest: month.piggyVestBalance,
    RiseVest: month.riseVestBalance,
    Vehicle: month.vehicleBalance,
    Total: month.totalBalance,
  }));

  // Prepare vehicle status data
  const vehicleStatusData = result.monthlyBreakdown.map((month, idx, arr) => {
    // Count active vehicles: for each investment in the last 12 months, sum up
    let activeVehicles = 0;
    let newVehicles = 0;
    for (let i = Math.max(0, idx - 11); i <= idx; i++) {
      if (arr[i].vehicleInvestment && arr[i].vehicleInvestment > 0) {
        // Number of vehicles bought this month
        const vehiclesBought = arr[i].vehicleInvestment / (result.vehicleResults.totalInvestment / result.vehicleResults.completedCycles || 1);
        activeVehicles += vehiclesBought;
        if (i === idx) newVehicles = vehiclesBought;
      }
    }
    return {
      month: formatMonthNumber(month.month),
      activeVehicles,
      vehicleReturns: month.vehicleReturns,
      newVehicles,
    };
  });

  return (
    <>
      <Box w="full" h={chartHeight}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis
              dataKey="month"
              tick={{ fontSize }}
              interval={Math.floor(data.length / tickCount)}
            />
            <YAxis
              tick={{ fontSize }}
              tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
              labelStyle={{ fontSize }}
              contentStyle={{ fontSize }}
            />
            <Legend wrapperStyle={{ fontSize }} />
            <Line type="monotone" dataKey="PiggyVest" stroke="#3182ce" />
            <Line type="monotone" dataKey="RiseVest" stroke="#805ad5" />
            <Line type="monotone" dataKey="Vehicle" stroke="#ed8936" />
            <Line type="monotone" dataKey="Total" stroke="#38a169" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box w="full" h={chartHeight} mt={8}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={vehicleStatusData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize }}
              interval={Math.floor(vehicleStatusData.length / tickCount)}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize }}
              label={{ value: 'Vehicles', angle: -90, position: 'insideLeft', style: { fontSize } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize }}
              tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
              label={{ value: 'Returns', angle: -90, position: 'insideRight', style: { fontSize } }}
            />
            <Tooltip
              formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
              labelStyle={{ fontSize }}
              contentStyle={{ fontSize }}
            />
            <Legend wrapperStyle={{ fontSize }} />
            <Bar yAxisId="left" dataKey="activeVehicles" fill="#3182ce" name="Active Vehicles" />
            <Bar yAxisId="left" dataKey="newVehicles" fill="#805ad5" name="New Vehicles" />
            <Bar yAxisId="right" dataKey="vehicleReturns" fill="#38a169" name="Monthly Returns" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
} 