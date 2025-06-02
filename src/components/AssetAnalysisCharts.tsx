import {
  Box,
  VStack,
  Heading,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import type { AssetAnalysisResult } from '../types/investment';
import { formatCurrency } from '../utils/investment-calculator';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AssetAnalysisChartsProps {
  result: AssetAnalysisResult;
}

export function AssetAnalysisCharts({ result }: AssetAnalysisChartsProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  // Prepare data for balance over time chart
  const balanceData = {
    labels: result.monthlyBreakdown.map(m => `Month ${m.month}`),
    datasets: [
      {
        label: 'Total Balance',
        data: result.monthlyBreakdown.map(m => m.totalBalance),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  // Prepare data for monthly returns and investments chart
  const monthlyData = {
    labels: result.monthlyBreakdown.map(m => `Month ${m.month}`),
    datasets: [
      {
        label: 'Monthly Returns',
        data: result.monthlyBreakdown.map(m => m.returns),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
      {
        label: 'Monthly Investments',
        data: result.monthlyBreakdown.map(m => m.investments),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for portfolio composition chart
  const portfolioData = {
    labels: ['Total Investment', 'Total Returns', 'Remaining Savings'],
    datasets: [
      {
        data: [
          result.totalInvestment,
          result.totalReturns,
          result.totalSavings - result.totalInvestment,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(54, 162, 235, 0.5)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
  };

  return (
    <VStack spacing={6} align="stretch" w="full">
      <Heading size="md">Investment Analysis Charts</Heading>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 4, md: 6 }}>
        <Box
          bg={bgColor}
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          height={{ base: '300px', md: '400px' }}
        >
          <Heading size="sm" mb={4} color={textColor}>Balance Over Time</Heading>
          <Line data={balanceData} options={chartOptions} />
        </Box>

        <Box
          bg={bgColor}
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          height={{ base: '300px', md: '400px' }}
        >
          <Heading size="sm" mb={4} color={textColor}>Monthly Returns vs Investments</Heading>
          <Bar data={monthlyData} options={chartOptions} />
        </Box>

        <Box
          bg={bgColor}
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          gridColumn={{ lg: 'span 2' }}
          height={{ base: '300px', md: '400px' }}
        >
          <Heading size="sm" mb={4} color={textColor}>Portfolio Composition</Heading>
          <Box maxW="500px" mx="auto" height="100%">
            <Doughnut
              data={portfolioData}
              options={{
                ...chartOptions,
                maintainAspectRatio: false,
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    callbacks: {
                      label: (context: any) => {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </Box>
        </Box>
      </SimpleGrid>
    </VStack>
  );
} 