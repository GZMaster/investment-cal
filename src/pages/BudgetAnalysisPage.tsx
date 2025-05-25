import {
  Box,
  Container,
  VStack,
  Heading,
  SimpleGrid,
  useColorModeValue,
  Card,
  CardBody,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Input,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useState, useCallback } from 'react';
import { PLATFORMS, type PlatformBalance } from '../types/budget';
import { SEO } from '../components/SEO';

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
  const toast = useToast();

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
                {balances.map((balance) => {
                  const platform = PLATFORMS.find(p => p.id === balance.platformId);
                  const currency = platform?.currency || 'NGN';
                  const progress = balance.expectedBalance > 0
                    ? (balance.currentBalance / balance.expectedBalance) * 100
                    : 0;

                  return (
                    <Tr key={balance.platformId}>
                      <Td>
                        <Text fontWeight="medium">{getPlatformName(balance.platformId)}</Text>
                        <Badge colorScheme={platform?.type === 'debt' ? 'red' : 'green'}>
                          {platform?.type}
                        </Badge>
                      </Td>
                      <Td isNumeric>{formatAmount(balance.currentBalance, currency)}</Td>
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
          </CardBody>
        </Card>

        {/* Monthly Allocation Plan */}
        <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>Monthly Allocation Plan</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Income</Th>
                  <Th>PiggyVest</Th>
                  <Th>FairMoney Savings</Th>
                  <Th>RiseVest</Th>
                  <Th>Grey Card</Th>
                  <Th>FairMoney</Th>
                </Tr>
              </Thead>
              <Tbody>
                {[7, 14, 21, 28].map((date) => (
                  <Tr key={date}>
                    <Td>{date}th</Td>
                    <Td isNumeric>{formatAmount(weeklyIncome, 'NGN')}</Td>
                    <Td isNumeric>{formatAmount(weeklyAllocation.piggyvest, 'NGN')}</Td>
                    <Td isNumeric>{formatAmount(weeklyAllocation.fairmoneySavings, 'NGN')}</Td>
                    <Td isNumeric>{formatAmount(weeklyAllocation.risevest, 'USD')}</Td>
                    <Td isNumeric>{formatAmount(weeklyAllocation.greyCard, 'NGN')}</Td>
                    <Td isNumeric>{formatAmount(weeklyAllocation.fairmoney, 'NGN')}</Td>
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