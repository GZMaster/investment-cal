import {
  Box,
  VStack,
  HStack,
  Button,
  Select,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { APPRECIATION_RATES, TIME_PERIODS } from '../constants/investment';
import type { InvestmentScenario } from '../types/investment';

interface ScenarioSelectorProps {
  scenario: InvestmentScenario;
  onScenarioChange: (scenario: InvestmentScenario) => void;
}

export function ScenarioSelector({ scenario, onScenarioChange }: ScenarioSelectorProps) {
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box bg={bgColor} p={6} borderRadius="lg">
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">
          Select Investment Parameters
        </Text>

        <HStack spacing={4}>
          <Text>Time Period:</Text>
          <Select
            value={scenario.timePeriod}
            onChange={(e) =>
              onScenarioChange({
                ...scenario,
                timePeriod: Number(e.target.value),
              })
            }
            w="200px"
          >
            {TIME_PERIODS.map((period) => (
              <option key={period} value={period}>
                {period} Year{period > 1 ? 's' : ''}
              </option>
            ))}
          </Select>
        </HStack>

        <Text>Choose how much USD strengthens against Naira annually:</Text>

        <HStack spacing={2} wrap="wrap">
          {APPRECIATION_RATES.map((rate) => (
            <Button
              key={rate}
              colorScheme={rate === scenario.appreciation ? 'purple' : 'gray'}
              onClick={() =>
                onScenarioChange({
                  ...scenario,
                  appreciation: rate,
                })
              }
            >
              {rate === 0
                ? 'No Change (₦1,650)'
                : `${rate}% Appreciation`}
            </Button>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
} 