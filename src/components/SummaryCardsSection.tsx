import {
  SimpleGrid,
  Card,
  CardBody,
  Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { StatCard } from './ui';

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
          <StatCard
            label="Total Savings"
            value={formatAmount(totalSavings, 'NGN')}
            helpText={`${formatAmount(monthlyIncome, 'NGN')} monthly`}
            arrowType="increase"
            size="lg"
          />
        </CardBody>
      </MotionCard>

      <MotionCard
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <CardBody>
          <StatCard
            label="Total Debt"
            value={formatAmount(totalDebt, 'NGN')}
            helpText={`${formatAmount(weeklyIncome * 4, 'NGN')} monthly income`}
            arrowType="decrease"
            size="lg"
          />
        </CardBody>
      </MotionCard>

      <MotionCard
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <CardBody>
          <StatCard
            label="Monthly Income"
            value={formatAmount(monthlyIncome, 'NGN')}
            helpText={`${formatAmount(weeklyIncome, 'NGN')} weekly`}
            arrowType="increase"
            size="lg"
          />
        </CardBody>
      </MotionCard>
    </SimpleGrid>
  );
} 