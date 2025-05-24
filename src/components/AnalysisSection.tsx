import {
  Box,
  Text,
  VStack,
  List,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';
import type { InvestmentScenario, InvestmentResult } from '../types/investment';
import { formatCurrency } from '../utils/investment-calculator';

interface AnalysisSectionProps {
  scenario: InvestmentScenario;
  result: InvestmentResult;
}

export function AnalysisSection({ scenario, result }: AnalysisSectionProps) {
  const { timePeriod, appreciation } = scenario;
  const { compoundEarnings, twoTierEarnings, totalUSD, currencyGain } = result;
  const difference = twoTierEarnings - compoundEarnings;
  const isTwoTierWinner = difference > 0;

  const bgColor = useColorModeValue('yellow.50', 'yellow.900');
  const textColor = useColorModeValue('yellow.900', 'yellow.50');

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" color={textColor}>
      <VStack align="stretch" spacing={4}>
        <Text fontSize="lg" fontWeight="bold">
          Key Insights:
        </Text>

        <List spacing={2}>
          <ListItem>
            <strong>
              {isTwoTierWinner ? 'Two-tier strategy wins' : 'Compound strategy wins'} by {formatCurrency(Math.abs(difference))}
            </strong>{' '}
            over {timePeriod} year{timePeriod > 1 ? 's' : ''}
          </ListItem>
          <ListItem>
            Current scenario: {appreciation}% annual USD appreciation
          </ListItem>
          <ListItem>
            Currency gain component: {formatCurrency(currencyGain)} from USD appreciation
          </ListItem>
          <ListItem>
            {timePeriod > 1
              ? 'Longer time periods amplify the impact of currency appreciation'
              : 'Single year analysis - consider longer periods for currency strategies'}
          </ListItem>
          <ListItem>
            Two-tier strategy provides {totalUSD.toFixed(2)} USD in foreign currency reserves
          </ListItem>
          <ListItem>
            Nigeria's historical USD/NGN appreciation has often exceeded 10% annually
          </ListItem>
        </List>
      </VStack>
    </Box>
  );
} 