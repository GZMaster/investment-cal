import {
  Badge,
  Box,
  Card,
  CardBody,
  Heading,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { getDefaultPlatforms, type PlatformBalance, type WeeklyAllocation } from '../types/budget';

interface PlatformBalancesTableProps {
  balances: PlatformBalance[];
  getPlatformName: (id: string) => string;
  getPlatformCurrency: (id: string) => string;
  formatAmount: (amount: number, currency: string) => string;
  isRateLoading: boolean;
  rateError: unknown;
  exchangeRateData?: { rate: number };
  numWeeks: number;
  weeklyAllocation: WeeklyAllocation;
}

export function PlatformBalancesTable({
  balances,
  getPlatformName,
  formatAmount,
  isRateLoading,
  rateError,
  exchangeRateData,
  numWeeks,
  weeklyAllocation,
}: PlatformBalancesTableProps) {
  return (
    <Card>
      <CardBody>
        <Heading size="md" mb={4}>Platform Balances</Heading>
        <Table variant="simple">
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
            {balances.map((balance) => {
              const platform = getDefaultPlatforms().find(p => p.id === balance.platformId);
              const currency = platform?.currency || 'NGN';
              const progress = balance.expectedBalance > 0
                ? ((balance.currentBalance === 0 ? 1 : balance.currentBalance) / balance.expectedBalance) * 100
                : 0;
              const isRiseVest = balance.platformId === 'risevest';
              const usdToNgn = exchangeRateData?.rate;
              // Calculate expectedBalance based on allocation and numWeeks
              let expectedBalance = balance.currentBalance;
              const allocation = weeklyAllocation[balance.platformId as keyof WeeklyAllocation] || 0;
              if (isRiseVest && usdToNgn) {
                expectedBalance += (allocation / usdToNgn) * numWeeks;
              } else {
                expectedBalance += allocation * numWeeks;
              }
              return (
                <Tr key={balance.platformId}>
                  <Td>
                    <Text fontWeight="medium">{getPlatformName(balance.platformId)}</Text>
                    <Badge colorScheme={platform?.type === 'debt' ? 'red' : 'green'}>
                      {platform?.type}
                    </Badge>
                  </Td>
                  <Td isNumeric>
                    {formatAmount(balance.currentBalance, currency)}
                    {isRiseVest && (
                      <Box fontSize="sm" color="gray.500">
                        {isRateLoading && ' (Loading NGN...)'}
                        {(rateError as string) && ' (Rate error)'}
                        {usdToNgn &&
                          ` ≈ ₦${(balance.currentBalance * usdToNgn).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                        }
                      </Box>
                    )}
                  </Td>
                  <Td isNumeric>{formatAmount(expectedBalance, currency)}</Td>
                  <Td isNumeric>{formatAmount(balance.debtBalance, currency)}</Td>
                  <Td isNumeric>{formatAmount(Math.max(0, balance.debtBalance - expectedBalance), currency)}</Td>
                  <Td>
                    <Progress
                      value={progress}
                      colorScheme={platform?.type === 'debt' ? 'red' : 'green'}
                      size="sm"
                      borderRadius="full"
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        {/* Show exchange rate info if RiseVest is present */}
        {balances.some(b => b.platformId === 'risevest') && (
          <Box mt={2} fontSize="sm" color="gray.500">
            {isRateLoading && 'Fetching USD/NGN rate...'}
            {(rateError as string) && 'Failed to fetch USD/NGN rate.'}
            {exchangeRateData && `Current USD/NGN rate: ₦${exchangeRateData.rate.toLocaleString()}`}
          </Box>
        )}
      </CardBody>
    </Card>
  );
} 