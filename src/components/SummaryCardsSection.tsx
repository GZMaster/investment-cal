import {
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

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
      <MotionCard
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <CardBody>
          <Stat>
            <StatLabel>Total Savings</StatLabel>
            <StatNumber>{formatAmount(totalSavings, 'NGN')}</StatNumber>
            <StatHelpText>
              <Tooltip label="Monthly increase" hasArrow>
                <StatArrow type="increase" aria-label="increase" />
              </Tooltip>
              {formatAmount(monthlyIncome, 'NGN')} monthly
            </StatHelpText>
          </Stat>
        </CardBody>
      </MotionCard>
      <MotionCard
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <CardBody>
          <Stat>
            <StatLabel>Total Debt</StatLabel>
            <StatNumber>{formatAmount(totalDebt, 'NGN')}</StatNumber>
            <StatHelpText>
              <Tooltip label="Monthly income" hasArrow>
                <StatArrow type="decrease" aria-label="decrease" />
              </Tooltip>
              {formatAmount(weeklyIncome * 4, 'NGN')} monthly income
            </StatHelpText>
          </Stat>
        </CardBody>
      </MotionCard>
      <MotionCard
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <CardBody>
          <Stat>
            <StatLabel>Monthly Income</StatLabel>
            <StatNumber>{formatAmount(monthlyIncome, 'NGN')}</StatNumber>
            <StatHelpText>
              <Tooltip label="Weekly income" hasArrow>
                <StatArrow type="increase" aria-label="increase" />
              </Tooltip>
              {formatAmount(weeklyIncome, 'NGN')} weekly
            </StatHelpText>
          </Stat>
        </CardBody>
      </MotionCard>
    </SimpleGrid>
  );
} 