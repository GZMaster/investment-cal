import {
  Box,
  Card,
  CardBody,
  Heading,
  Progress,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { usePlatforms } from '../hooks/usePlatforms';
import { type PlatformBalance, type WeeklyAllocation } from '../types/budget';

const MotionTr = motion(Tr);

interface PlatformBalancesTableProps {
  balances: PlatformBalance[];
  formatAmount: (amount: number, currency: string) => string;
  isRateLoading: boolean;
  rateError: unknown;
  exchangeRateData?: { rate: number };
  numWeeks: number;
  weeklyAllocation: WeeklyAllocation;
}

export function PlatformBalancesTable({
  balances,
  formatAmount,
  exchangeRateData,
  numWeeks,
  weeklyAllocation,
}: PlatformBalancesTableProps) {
  const { platforms } = usePlatforms();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Ensure balances exist for all platforms
  const currentBalances = platforms.map(platform => {
    const existingBalance = balances.find(b => b.platformId === platform.id);
    return existingBalance || {
      platformId: platform.id,
      currentBalance: 0,
      expectedBalance: 0,
      debtBalance: 0,
      expectedDebtBalance: 0,
    };
  });

  if (isMobile) {
    return (
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Platform Balances</Heading>
          <Stack spacing={4}>
            {currentBalances.map((balance) => {
              const platform = platforms.find(p => p.id === balance.platformId);
              if (!platform) return null;
              const currency = platform.currency;
              const progress = balance.expectedBalance > 0
                ? ((balance.currentBalance === 0 ? 1 : balance.currentBalance) / balance.expectedBalance) * 100
                : 0;
              const isUsdPlatform = currency === 'USD';
              const usdToNgn = exchangeRateData?.rate;
              let expectedBalance = balance.currentBalance;
              const allocation = weeklyAllocation[balance.platformId] || 0;
              if (isUsdPlatform && usdToNgn) {
                expectedBalance += (allocation / usdToNgn) * numWeeks;
              } else {
                expectedBalance += allocation * numWeeks;
              }
              return (
                <Box key={platform.id} p={4} borderRadius="lg" boxShadow="md" bg="gray.50" _dark={{ bg: 'gray.800' }}>
                  <Text fontWeight="bold">{platform.name}</Text>
                  <Text>Current: {formatAmount(balance.currentBalance, currency)}</Text>
                  <Text>Expected: {formatAmount(expectedBalance, currency)}</Text>
                  <Tooltip label={`Progress toward expected balance`} hasArrow>
                    <Progress value={progress} size="sm" colorScheme="brand" borderRadius="md" mt={2} aria-label="progress" />
                  </Tooltip>
                </Box>
              );
            })}
          </Stack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <Heading size="md" mb={4}>Platform Balances</Heading>
        <TableContainer>
          <Table variant="striped" colorScheme="brand" borderRadius="lg" overflow="hidden">
            <Thead>
              <Tr>
                <Th>Platform</Th>
                <Th isNumeric>Current Balance</Th>
                <Th isNumeric>Expected Balance</Th>
                <Th isNumeric>Current Debt</Th>
                <Th isNumeric>Expected Debt</Th>
                <Th>Progress</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentBalances.map((balance, i) => {
                const platform = platforms.find(p => p.id === balance.platformId);
                if (!platform) return null;
                const currency = platform.currency;
                const progress = balance.expectedBalance > 0
                  ? ((balance.currentBalance === 0 ? 1 : balance.currentBalance) / balance.expectedBalance) * 100
                  : 0;
                const isUsdPlatform = currency === 'USD';
                const usdToNgn = exchangeRateData?.rate;
                let expectedBalance = balance.currentBalance;
                const allocation = weeklyAllocation[balance.platformId] || 0;
                if (isUsdPlatform && usdToNgn) {
                  expectedBalance += (allocation / usdToNgn) * numWeeks;
                } else {
                  expectedBalance += allocation * numWeeks;
                }
                return (
                  <MotionTr
                    key={platform.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Td>{platform.name}</Td>
                    <Td isNumeric>{formatAmount(balance.currentBalance, currency)}</Td>
                    <Td isNumeric>{formatAmount(expectedBalance, currency)}</Td>
                    <Td isNumeric>{formatAmount(balance.debtBalance, currency)}</Td>
                    <Td isNumeric>{formatAmount(balance.expectedDebtBalance, currency)}</Td>
                    <Td>
                      <Tooltip label={`Progress toward expected balance`} hasArrow>
                        <Progress value={progress} size="sm" colorScheme="brand" borderRadius="md" aria-label="progress" />
                      </Tooltip>
                    </Td>
                  </MotionTr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
} 