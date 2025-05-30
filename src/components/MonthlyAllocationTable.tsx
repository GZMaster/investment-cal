import {
  Card,
  CardBody,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  HStack,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { type WeeklyAllocation } from '../types/budget';
import { usePlatforms } from '../hooks/usePlatforms';

interface MonthlyAllocationTableProps {
  lastFridays: Date[];
  weeklyIncome: number;
  weeklyAllocation: WeeklyAllocation;
  formatAmount: (amount: number, currency: string) => string;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  monthNames: string[];
  yearOptions: number[];
  exchangeRateData?: { rate: number };
}

export function MonthlyAllocationTable({
  lastFridays,
  weeklyIncome,
  weeklyAllocation,
  formatAmount,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  monthNames,
  yearOptions,
  exchangeRateData,
}: MonthlyAllocationTableProps) {
  const { platforms } = usePlatforms();
  const numWeeks = lastFridays.length;
  return (
    <Card>
      <CardBody>
        <Heading size="md" mb={4}>Monthly Allocation Plan</Heading>
        <HStack mb={4} gap={4}>
          <FormControl maxW="200px">
            <FormLabel>Month</FormLabel>
            <Select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
              {monthNames.map((name, idx) => (
                <option key={name} value={idx}>{name}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl maxW="120px">
            <FormLabel>Year</FormLabel>
            <Select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Select>
          </FormControl>
        </HStack>
        <Table variant="simple" sx={{ tableLayout: 'fixed' }}>
          <Thead>
            <Tr>
              <Th minW="140px" maxW="180px">Date</Th>
              <Th isNumeric minW="110px">Income</Th>
              {platforms.map(platform => (
                <Th key={platform.id} isNumeric minW="110px">{platform.name} ({platform.currency})</Th>
              ))}
              <Th isNumeric minW="110px">Balance Left</Th>
            </Tr>
          </Thead>
          <Tbody>
            {lastFridays.map((date) => {
              const totalAllocated = platforms.reduce((sum, platform) => sum + (weeklyAllocation[platform.id] || 0), 0);
              const balanceLeft = weeklyIncome - totalAllocated;
              return (
                <Tr key={date.toISOString()}>
                  <Td minW="140px" maxW="180px">{date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</Td>
                  <Td isNumeric minW="110px"><Box as="span" fontFamily="mono">{formatAmount(weeklyIncome, 'NGN')}</Box></Td>
                  {platforms.map(platform => {
                    const allocation = weeklyAllocation[platform.id] || 0;
                    const amount = platform.currency === 'USD' && exchangeRateData?.rate
                      ? allocation / exchangeRateData.rate
                      : allocation;
                    return (
                      <Td key={platform.id} isNumeric minW="110px">{formatAmount(amount, platform.currency)}</Td>
                    );
                  })}
                  <Td isNumeric minW="110px"><Box as="span" fontFamily="mono">{formatAmount(balanceLeft, 'NGN')}</Box></Td>
                </Tr>
              );
            })}
            {/* Total Row */}
            {(() => {
              const totalAllocated = platforms.reduce((sum, platform) => sum + (weeklyAllocation[platform.id] || 0), 0);
              const balanceLeft = weeklyIncome - totalAllocated;
              const totalBalanceLeft = balanceLeft * numWeeks;
              return (
                <Tr fontWeight="bold">
                  <Td minW="140px" maxW="180px">Total</Td>
                  <Td isNumeric minW="110px"><Box as="span" fontFamily="mono">{formatAmount(weeklyIncome * numWeeks, 'NGN')}</Box></Td>
                  {platforms.map(platform => {
                    const allocation = (weeklyAllocation[platform.id] || 0) * numWeeks;
                    const amount = platform.currency === 'USD' && exchangeRateData?.rate
                      ? allocation / exchangeRateData.rate
                      : allocation;
                    return (
                      <Td key={platform.id} isNumeric minW="110px">{formatAmount(amount, platform.currency)}</Td>
                    );
                  })}
                  <Td isNumeric minW="110px"><Box as="span" fontFamily="mono">{formatAmount(totalBalanceLeft, 'NGN')}</Box></Td>
                </Tr>
              );
            })()}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
} 