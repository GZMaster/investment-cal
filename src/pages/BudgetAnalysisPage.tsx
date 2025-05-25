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
} from '@chakra-ui/react';
import { useState } from 'react';
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

export function BudgetAnalysisPage() {
  const [balances] = useState<PlatformBalance[]>(INITIAL_BALANCES);
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

        {/* Summary Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Savings</StatLabel>
                <StatNumber>₦4.0M</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  25% increase expected
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Debt</StatLabel>
                <StatNumber>₦1.0M</StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  100% decrease expected
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Monthly Income</StatLabel>
                <StatNumber>₦1.4M</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  $1,000 monthly
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
                <Tr>
                  <Td>7th</Td>
                  <Td isNumeric>₦350k</Td>
                  <Td isNumeric>₦250k</Td>
                  <Td isNumeric>₦50k</Td>
                  <Td isNumeric>$10</Td>
                  <Td isNumeric>₦5k</Td>
                  <Td isNumeric>₦5k</Td>
                </Tr>
                <Tr>
                  <Td>14th</Td>
                  <Td isNumeric>₦350k</Td>
                  <Td isNumeric>₦250k</Td>
                  <Td isNumeric>₦50k</Td>
                  <Td isNumeric>$10</Td>
                  <Td isNumeric>₦5k</Td>
                  <Td isNumeric>₦5k</Td>
                </Tr>
                <Tr>
                  <Td>21st</Td>
                  <Td isNumeric>₦350k</Td>
                  <Td isNumeric>₦250k</Td>
                  <Td isNumeric>₦50k</Td>
                  <Td isNumeric>$10</Td>
                  <Td isNumeric>₦5k</Td>
                  <Td isNumeric>₦5k</Td>
                </Tr>
                <Tr>
                  <Td>28th</Td>
                  <Td isNumeric>₦350k</Td>
                  <Td isNumeric>₦250k</Td>
                  <Td isNumeric>₦50k</Td>
                  <Td isNumeric>$10</Td>
                  <Td isNumeric>₦5k</Td>
                  <Td isNumeric>₦5k</Td>
                </Tr>
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
} 