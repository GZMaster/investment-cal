import {
  Badge,
  Button,
  Card,
  CardBody,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  SimpleGrid,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
  useToast,
  Box,
  Tooltip,
  Select
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { SEO } from '../components/SEO';
import { PLATFORMS, type PlatformBalance } from '../types/budget';
import { useExchangeRate } from '../hooks/useExchangeRate';

const INITIAL_BALANCES: PlatformBalance[] = [
  {
    platformId: 'piggyvest',
    currentBalance: 4000000,
    expectedBalance: 5000000,
    debtBalance: 1000000,
    expectedDebtBalance: 0,
  },
  {
    platformId: 'risevest',
    currentBalance: 79.85,
    expectedBalance: 99.85,
    debtBalance: 0,
    expectedDebtBalance: 0,
  },
  {
    platformId: 'fairmoney-savings',
    currentBalance: 0,
    expectedBalance: 200000,
    debtBalance: 0,
    expectedDebtBalance: 0,
  },
  {
    platformId: 'fairmoney',
    currentBalance: 0,
    expectedBalance: 0,
    debtBalance: 0,
    expectedDebtBalance: 0,
  },
  {
    platformId: 'grey-card',
    currentBalance: 0,
    expectedBalance: 20000,
    debtBalance: 0,
    expectedDebtBalance: 0,
  },
];

interface WeeklyAllocation {
  piggyvest: number;
  fairmoneySavings: number;
  risevest: number;
  greyCard: number;
  fairmoney: number;
}

const INITIAL_WEEKLY_ALLOCATION: WeeklyAllocation = {
  piggyvest: 250000,
  fairmoneySavings: 50000,
  risevest: 10,
  greyCard: 5000,
  fairmoney: 5000,
};

export function BudgetAnalysisPage() {
  const [balances, setBalances] = useState<PlatformBalance[]>(INITIAL_BALANCES);
  const [weeklyIncome, setWeeklyIncome] = useState(350000);
  const [weeklyAllocation, setWeeklyAllocation] = useState<WeeklyAllocation>(INITIAL_WEEKLY_ALLOCATION);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingBalances, setIsEditingBalances] = useState(false);
  const [pendingBalances, setPendingBalances] = useState<PlatformBalance[] | null>(null);
  const toast = useToast();
  const { data: exchangeRateData, isLoading: isRateLoading, error: rateError } = useExchangeRate();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getPlatformName = (platformId: string) => {
    return PLATFORMS.find(p => p.id === platformId)?.name || platformId;
  };

  const getPlatformCurrency = (platformId: string) => {
    return PLATFORMS.find(p => p.id === platformId)?.currency || 'NGN';
  };

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return `$${amount.toFixed(2)}`;
    }
    return `₦${(amount / 1000).toFixed(1)}k`;
  };

  const handleSave = useCallback(() => {
    // Calculate total allocation
    const totalAllocation = Object.values(weeklyAllocation).reduce((sum, amount) => sum + amount, 0);

    if (totalAllocation > weeklyIncome) {
      toast({
        title: 'Invalid Allocation',
        description: 'Total allocation cannot exceed weekly income',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Update balances with new allocations
    const updatedBalances = balances.map(balance => {
      const allocation = weeklyAllocation[balance.platformId as keyof WeeklyAllocation] || 0;
      const currency = getPlatformCurrency(balance.platformId);
      const monthlyAllocation = allocation * 4; // 4 weeks in a month

      return {
        ...balance,
        expectedBalance: balance.currentBalance + (currency === 'USD' ? monthlyAllocation : monthlyAllocation),
      };
    });

    setBalances(updatedBalances);
    setIsEditing(false);
    toast({
      title: 'Changes Saved',
      description: 'Your budget allocations have been updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }, [weeklyAllocation, weeklyIncome, balances, toast]);

  const totalSavings = balances.reduce((sum, balance) => sum + balance.currentBalance, 0);
  const totalDebt = balances.reduce((sum, balance) => sum + balance.debtBalance, 0);
  const monthlyIncome = weeklyIncome * 4;

  // Helper: Get all last Fridays for each week in the selected month/year
  function getLastFridaysOfWeeks(year: number, month: number): Date[] {
    const dates: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const weekStart = new Date(firstDay);
    while (weekStart <= lastDay) {
      // Find the last Friday in this week
      let lastFriday: Date | null = null;
      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        if (d > lastDay) break;
        if (d.getDay() === 5) lastFriday = d;
      }
      // If no Friday, use last day of week (or last day of month)
      if (!lastFriday) {
        const endOfWeek = new Date(weekStart);
        endOfWeek.setDate(weekStart.getDate() + 6);
        lastFriday = endOfWeek > lastDay ? lastDay : endOfWeek;
      }
      dates.push(lastFriday);
      // Move to next week
      weekStart.setDate(weekStart.getDate() + 7);
    }
    return dates;
  }

  const lastFridays = getLastFridaysOfWeeks(selectedYear, selectedMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const yearOptions = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <Container maxW="container.xl" py={8}>
      <SEO
        title="Budget Analysis"
        description="Track your spending, savings, and debt management across different platforms. Get detailed allocation plans and financial insights with our comprehensive budget analysis tool."
        keywords={[
          'budget analysis',
          'financial planning',
          'debt management',
          'savings tracker',
          'budget allocation',
          'financial management',
        ]}
      />
      <VStack spacing={8} align="stretch">
        <Heading>Budget Analysis</Heading>

        {/* Set Platform Balances Section */}
        <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>Set Platform Balances (Start of Month)</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={4}>
              {(isEditingBalances ? (pendingBalances ?? balances) : balances).map((balance, idx) => {
                const platform = PLATFORMS.find(p => p.id === balance.platformId);
                const currency = platform?.currency || 'NGN';
                const isRiseVest = balance.platformId === 'risevest';
                const usdToNgn = exchangeRateData?.rate;
                const tooltipLabel = `Current balance for ${getPlatformName(balance.platformId)}: ${currency === 'USD' ? `${balance.currentBalance.toLocaleString(undefined, { maximumFractionDigits: 8 })} USD` : `${balance.currentBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} NGN`}`;
                return (
                  <FormControl key={balance.platformId}>
                    <FormLabel>{getPlatformName(balance.platformId)} ({currency})</FormLabel>
                    <Tooltip label={tooltipLabel} placement="top" hasArrow>
                      <NumberInput
                        value={balance.currentBalance}
                        min={0}
                        precision={currency === 'USD' ? 2 : 0}
                        step={currency === 'USD' ? 0.01 : 1000}
                        isDisabled={!isEditingBalances}
                        onChange={(_, value) => {
                          if (!isEditingBalances) return;
                          setPendingBalances(prev => {
                            const arr = prev ? [...prev] : balances.map(b => ({ ...b }));
                            arr[idx].currentBalance = value;
                            return arr;
                          });
                        }}
                        size="sm"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Tooltip>
                    {isRiseVest && !isEditingBalances && (
                      <Box fontSize="sm" color="gray.500">
                        {isRateLoading && ' (Loading NGN...)'}
                        {rateError && ' (Rate error)'}
                        {usdToNgn &&
                          ` ≈ ₦${(balance.currentBalance * usdToNgn).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                        }
                      </Box>
                    )}
                  </FormControl>
                );
              })}
            </SimpleGrid>
            <HStack spacing={4}>
              {isEditingBalances ? (
                <>
                  <Button colorScheme="blue" onClick={() => {
                    if (pendingBalances) setBalances(pendingBalances);
                    setIsEditingBalances(false);
                    setPendingBalances(null);
                    toast({ title: 'Balances Updated', status: 'success', duration: 2000, isClosable: true });
                  }}>
                    Save Balances
                  </Button>
                  <Button variant="ghost" onClick={() => {
                    setIsEditingBalances(false);
                    setPendingBalances(null);
                  }}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button colorScheme="blue" onClick={() => {
                  setIsEditingBalances(true);
                  setPendingBalances(balances.map(b => ({ ...b })));
                }}>
                  Edit Balances
                </Button>
              )}
            </HStack>
          </CardBody>
        </Card>

        {/* Income and Allocation Controls */}
        <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
          <CardBody>
            <VStack spacing={6}>
              <FormControl>
                <FormLabel>Weekly Income (₦)</FormLabel>
                <NumberInput
                  value={weeklyIncome}
                  onChange={(_, value) => setWeeklyIncome(value)}
                  min={0}
                  isDisabled={!isEditing}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <Heading size="md">Weekly Allocations</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                {PLATFORMS.map((platform) => (
                  <FormControl key={platform.id}>
                    <FormLabel>{platform.name} ({platform.currency})</FormLabel>
                    <NumberInput
                      value={weeklyAllocation[platform.id as keyof WeeklyAllocation] || 0}
                      onChange={(_, value) => setWeeklyAllocation(prev => ({
                        ...prev,
                        [platform.id]: value
                      }))}
                      min={0}
                      isDisabled={!isEditing}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                ))}
              </SimpleGrid>

              <HStack spacing={4}>
                {isEditing ? (
                  <>
                    <Button colorScheme="blue" onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
                    Edit Allocations
                  </Button>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Summary Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Savings</StatLabel>
                <StatNumber>{formatAmount(totalSavings, 'NGN')}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {formatAmount(monthlyIncome, 'NGN')} monthly
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Debt</StatLabel>
                <StatNumber>{formatAmount(totalDebt, 'NGN')}</StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  {formatAmount(weeklyIncome * 4, 'NGN')} monthly income
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Monthly Income</StatLabel>
                <StatNumber>{formatAmount(monthlyIncome, 'NGN')}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {formatAmount(weeklyIncome, 'NGN')} weekly
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Platform Balances */}
        <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
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
                {balances.map((balance, idx) => {
                  const platform = PLATFORMS.find(p => p.id === balance.platformId);
                  const currency = platform?.currency || 'NGN';
                  const progress = balance.expectedBalance > 0
                    ? (balance.currentBalance / balance.expectedBalance) * 100
                    : 0;
                  const isRiseVest = balance.platformId === 'risevest';
                  const usdToNgn = exchangeRateData?.rate;
                  return (
                    <Tr key={balance.platformId}>
                      <Td>
                        <Text fontWeight="medium">{getPlatformName(balance.platformId)}</Text>
                        <Badge colorScheme={platform?.type === 'debt' ? 'red' : 'green'}>
                          {platform?.type}
                        </Badge>
                      </Td>
                      <Td isNumeric>
                        {isEditing ? (
                          <NumberInput
                            value={balance.currentBalance}
                            min={0}
                            precision={currency === 'USD' ? 2 : 0}
                            step={currency === 'USD' ? 0.01 : 1000}
                            onChange={(_, value) => {
                              setBalances(prev => prev.map((b, i) =>
                                i === idx ? { ...b, currentBalance: value } : b
                              ));
                            }}
                            size="sm"
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        ) : (
                          <>
                            {formatAmount(balance.currentBalance, currency)}
                            {isRiseVest && (
                              <Box fontSize="sm" color="gray.500">
                                {isRateLoading && ' (Loading NGN...)'}
                                {rateError && ' (Rate error)'}
                                {usdToNgn &&
                                  ` ≈ ₦${(balance.currentBalance * usdToNgn).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                                }
                              </Box>
                            )}
                          </>
                        )}
                      </Td>
                      <Td isNumeric>{formatAmount(balance.expectedBalance, currency)}</Td>
                      <Td isNumeric>{formatAmount(balance.debtBalance, currency)}</Td>
                      <Td isNumeric>{formatAmount(balance.expectedDebtBalance, currency)}</Td>
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
                {rateError && 'Failed to fetch USD/NGN rate.'}
                {exchangeRateData && `Current USD/NGN rate: ₦${exchangeRateData.rate.toLocaleString()}`}
              </Box>
            )}
          </CardBody>
        </Card>

        {/* Monthly Allocation Plan */}
        <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
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
                  <Th isNumeric minW="110px">PiggyVest</Th>
                  <Th isNumeric minW="140px">FairMoney Savings</Th>
                  <Th isNumeric minW="110px">RiseVest</Th>
                  <Th isNumeric minW="110px">Grey Card</Th>
                  <Th isNumeric minW="110px">FairMoney</Th>
                </Tr>
              </Thead>
              <Tbody>
                {lastFridays.map((date) => (
                  <Tr key={date.toISOString()}>
                    <Td minW="140px" maxW="180px">{date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</Td>
                    <Td isNumeric minW="110px"><Box as="span" fontFamily="mono">{formatAmount(weeklyIncome, 'NGN')}</Box></Td>
                    <Td isNumeric minW="110px"><Box as="span" fontFamily="mono">{formatAmount(weeklyAllocation.piggyvest, 'NGN')}</Box></Td>
                    <Td isNumeric minW="140px"><Box as="span" fontFamily="mono">{formatAmount(weeklyAllocation.fairmoneySavings, 'NGN')}</Box></Td>
                    <Td isNumeric minW="110px"><Box as="span" fontFamily="mono">{formatAmount(weeklyAllocation.risevest, 'USD')}</Box></Td>
                    <Td isNumeric minW="110px"><Box as="span" fontFamily="mono">{formatAmount(weeklyAllocation.greyCard, 'NGN')}</Box></Td>
                    <Td isNumeric minW="110px"><Box as="span" fontFamily="mono">{formatAmount(weeklyAllocation.fairmoney, 'NGN')}</Box></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
} 