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

  // Prepare PiggyVest data
  const piggyVestData = result.monthlyBreakdown.map((month) => ({
    month: formatMonthNumber(month.month),
    Balance: month.piggyVestBalance,
    Interest: month.piggyVestInterest,
    Savings: month.monthlyPiggyVestSavings,
    Total: month.piggyVestBalance + month.piggyVestInterest,
  }));

  // Prepare RiseVest data
  const riseVestData = result.monthlyBreakdown.map((month) => ({
    month: formatMonthNumber(month.month),
    Balance: month.riseVestBalance,
    Interest: month.riseVestInterest,
    CurrencyGain: month.currencyGain,
    USDValue: month.riseVestBalance / month.exchangeRate,
  }));

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

      {/* PiggyVest Chart */}
      <Box w="full" h={chartHeight} mt={8}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={piggyVestData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize }}
              interval={Math.floor(piggyVestData.length / tickCount)}
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
            <Bar dataKey="Balance" fill="#3182ce" name="Balance" />
            <Bar dataKey="Interest" fill="#805ad5" name="Interest" />
            <Bar dataKey="Savings" fill="#38a169" name="Monthly Savings" />
            <Bar dataKey="Total" fill="#ed8936" name="Total (Balance + Interest)" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* RiseVest Chart */}
      <Box w="full" h={chartHeight} mt={8}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={riseVestData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize }}
              interval={Math.floor(riseVestData.length / tickCount)}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize }}
              tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
              label={{ value: 'NGN Value', angle: -90, position: 'insideLeft', style: { fontSize } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}K`}
              label={{ value: 'USD Value', angle: -90, position: 'insideRight', style: { fontSize } }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'USDValue') {
                  return [`$${value.toLocaleString()}`, name];
                }
                return [`₦${value.toLocaleString()}`, name];
              }}
              labelStyle={{ fontSize }}
              contentStyle={{ fontSize }}
            />
            <Legend wrapperStyle={{ fontSize }} />
            <Bar yAxisId="left" dataKey="Balance" fill="#3182ce" name="NGN Balance" />
            <Bar yAxisId="left" dataKey="Interest" fill="#805ad5" name="Interest" />
            <Bar yAxisId="left" dataKey="CurrencyGain" fill="#38a169" name="Currency Gain" />
            <Bar yAxisId="right" dataKey="USDValue" fill="#ed8936" name="USD Value" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
} 