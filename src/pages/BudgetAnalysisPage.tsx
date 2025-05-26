import { Container, VStack, Heading, useToast } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { SEO } from '../components/SEO';
import { PLATFORMS, type PlatformBalance } from '../types/budget';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { SetPlatformBalancesSection } from '../components/SetPlatformBalancesSection';
import { IncomeAndAllocationSection } from '../components/IncomeAndAllocationSection';
import { SummaryCardsSection } from '../components/SummaryCardsSection';
import { PlatformBalancesTable } from '../components/PlatformBalancesTable';
import { MonthlyAllocationTable } from '../components/MonthlyAllocationTable';
import { BudgetVisualizations } from '../components/BudgetVisualizations';

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
  piggyvest: 200000,
  fairmoneySavings: 50000,
  risevest: 10,
  greyCard: 10000,
  fairmoney: 50000,
};

// Helper: Format currency for charts (₦1.2M, ₦350.0k, ₦500)
function formatCurrencyShort(value: number): string {
  if (value >= 1e6) return `₦${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `₦${(value / 1e3).toFixed(1)}k`;
  return `₦${value.toLocaleString()}`;
}

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
    // Calculate total allocation in NGN (all allocations are in NGN)
    const totalAllocation = Object.values(weeklyAllocation).reduce((sum, amount) => sum + amount, 0);

    // if (totalAllocation > weeklyIncome) {
    //   toast({
    //     title: 'Invalid Allocation',
    //     description: 'Total allocation cannot exceed weekly income',
    //     status: 'error',
    //     duration: 3000,
    //     isClosable: true,
    //   });
    //   return;
    // }

    // Update balances with new allocations
    const updatedBalances = balances.map(balance => {
      const allocation = weeklyAllocation[balance.platformId as keyof WeeklyAllocation] || 0;
      if (balance.platformId === 'risevest' && exchangeRateData?.rate) {
        // Convert NGN allocation to USD for RiseVest
        const usdAllocation = allocation / exchangeRateData.rate;
        return {
          ...balance,
          expectedBalance: balance.currentBalance + usdAllocation * 4, // 4 weeks
        };
      }
      // All other platforms: add NGN allocation
      return {
        ...balance,
        expectedBalance: balance.currentBalance + allocation * 4,
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
  }, [weeklyAllocation, weeklyIncome, balances, toast, exchangeRateData]);

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

        <SetPlatformBalancesSection
          balances={balances}
          isEditing={isEditingBalances}
          pendingBalances={pendingBalances}
          setPendingBalances={setPendingBalances}
          setIsEditing={setIsEditingBalances}
          onSave={pending => {
            if (pending) setBalances(pending);
            setIsEditingBalances(false);
            setPendingBalances(null);
            toast({ title: 'Balances Updated', status: 'success', duration: 2000, isClosable: true });
          }}
          isRateLoading={isRateLoading}
          rateError={rateError}
          usdToNgn={exchangeRateData?.rate}
          getPlatformName={getPlatformName}
        />

        <IncomeAndAllocationSection
          weeklyIncome={weeklyIncome}
          setWeeklyIncome={setWeeklyIncome}
          weeklyAllocation={weeklyAllocation}
          setWeeklyAllocation={setWeeklyAllocation}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSave={handleSave}
        />

        <SummaryCardsSection
          totalSavings={totalSavings}
          totalDebt={totalDebt}
          monthlyIncome={monthlyIncome}
          weeklyIncome={weeklyIncome}
          formatAmount={formatAmount}
        />

        <PlatformBalancesTable
          balances={balances}
          getPlatformName={getPlatformName}
          getPlatformCurrency={getPlatformCurrency}
          formatAmount={formatAmount}
          isRateLoading={isRateLoading}
          rateError={rateError}
          exchangeRateData={exchangeRateData}
        />

        <MonthlyAllocationTable
          lastFridays={lastFridays}
          weeklyIncome={weeklyIncome}
          weeklyAllocation={weeklyAllocation}
          formatAmount={formatAmount}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          monthNames={monthNames}
          yearOptions={yearOptions}
          exchangeRateData={exchangeRateData}
        />

        <BudgetVisualizations
          balances={balances}
          weeklyAllocation={weeklyAllocation}
          getPlatformName={getPlatformName}
          formatCurrencyShort={formatCurrencyShort}
        />
      </VStack>
    </Container>
  );
} 