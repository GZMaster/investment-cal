import { Container, VStack, useToast, Box, useColorModeValue } from '@chakra-ui/react';
import { useCallback, useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { type PlatformBalance, INITIAL_BALANCES, type WeeklyAllocation, getInitialWeeklyAllocation } from '../types/budget';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { SetPlatformBalancesSection } from '../components/SetPlatformBalancesSection';
import { IncomeAndAllocationSection } from '../components/IncomeAndAllocationSection';
import { SummaryCardsSection } from '../components/SummaryCardsSection';
import { PlatformBalancesTable } from '../components/PlatformBalancesTable';
import { MonthlyAllocationTable } from '../components/MonthlyAllocationTable';
import { BudgetVisualizations } from '../components/BudgetVisualizations';
import { usePlatforms } from '../hooks/usePlatforms';
import { BackButton } from '../components/BackButton';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';

// Helper: Format currency for charts (₦1.2M, ₦350.0k, ₦500)
function formatCurrencyShort(value: number): string {
  if (value >= 1e6) return `₦${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `₦${(value / 1e3).toFixed(1)}k`;
  return `₦${value.toLocaleString()}`;
}

export function BudgetAnalysisPage() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const { platforms } = usePlatforms();
  const [balances, setBalances] = useState<PlatformBalance[]>(INITIAL_BALANCES);
  const [weeklyIncome, setWeeklyIncome] = useState(350000);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingBalances, setIsEditingBalances] = useState(false);
  const [pendingBalances, setPendingBalances] = useState<PlatformBalance[] | null>(null);
  const toast = useToast();
  const { data: exchangeRateData, isLoading: isRateLoading, error: rateError } = useExchangeRate();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [weeklyAllocation, setWeeklyAllocation] = useState<WeeklyAllocation>(
    getInitialWeeklyAllocation(platforms)
  );

  // Update weeklyAllocation when platforms change
  useEffect(() => {
    setWeeklyAllocation(getInitialWeeklyAllocation(platforms));
  }, [platforms]);

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return `$${amount.toFixed(2)}`;
    }
    return `₦${(amount / 1000).toFixed(1)}k`;
  };

  const handleSave = useCallback(() => {

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
  }, [weeklyIncome, toast, exchangeRateData, balances, weeklyAllocation]);

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
  const numWeeks = lastFridays.length;
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const yearOptions = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Helmet>
        <title>Budget Analysis Tool | Investment Tools Suite</title>
        <meta name="description" content="Track your spending, savings, and debt management across different platforms. Get detailed allocation plans and financial insights with our comprehensive budget analysis tool." />
        <meta property="og:title" content="Budget Analysis Tool | Investment Tools Suite" />
        <meta property="og:description" content="Track your spending, savings, and debt management across different platforms. Get detailed allocation plans and financial insights with our comprehensive budget analysis tool." />
      </Helmet>
      <Container maxW="container.xl">
        <BackButton />
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
          <Header
            title="Budget Analysis"
            description="Track your spending, savings, and debt management across different platforms. Get detailed allocation plans and financial insights."
          />

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
            formatAmount={formatAmount}
            isRateLoading={isRateLoading}
            rateError={rateError}
            exchangeRateData={exchangeRateData}
            numWeeks={numWeeks}
            weeklyAllocation={weeklyAllocation}
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
            formatCurrencyShort={formatCurrencyShort}
            numWeeks={numWeeks}
            exchangeRateData={exchangeRateData}
          />
        </VStack>
      </Container>
    </Box>
  );
} 