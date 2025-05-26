import {
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';

interface SummaryCardsSectionProps {
  totalSavings: number;
  totalDebt: number;
  monthlyIncome: number;
  weeklyIncome: number;
  formatAmount: (amount: number, currency: string) => string;
}

export function SummaryCardsSection({
  totalSavings,
  totalDebt,
  monthlyIncome,
  weeklyIncome,
  formatAmount,
}: SummaryCardsSectionProps) {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      <Card>
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
      <Card>
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
      <Card>
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
  );
} 