import {
  Box,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import type { InvestmentScenario } from '../types/investment';
import { DEFAULT_SCENARIO, INVESTMENT_RANGES } from '../constants/investment';
import { formatCurrency } from '../utils/investment-calculator';

interface ScenarioSelectorProps {
  scenario: InvestmentScenario;
  onScenarioChange: (scenario: InvestmentScenario) => void;
}

export function ScenarioSelector({ scenario, onScenarioChange }: ScenarioSelectorProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleChange = (field: keyof InvestmentScenario, value: number) => {
    onScenarioChange({
      ...scenario,
      [field]: value,
    });
  };

  const renderNumberInput = (
    label: string,
    field: keyof InvestmentScenario,
    format?: (value: number) => string
  ) => {
    const range = INVESTMENT_RANGES[field];
    return (
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <NumberInput
          value={scenario[field]}
          min={range.min}
          max={range.max}
          step={range.step}
          onChange={(_, value) => handleChange(field, value)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {format && (
          <Text fontSize="sm" color="gray.500" mt={1}>
            {format(scenario[field])}
          </Text>
        )}
      </FormControl>
    );
  };

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack spacing={6} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Investment Parameters
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {renderNumberInput('Time Period (Years)', 'timePeriod')}
          {renderNumberInput('USD Appreciation (%)', 'appreciation')}
          {renderNumberInput('Initial Investment', 'principal', formatCurrency)}
          {renderNumberInput('Monthly Savings', 'monthlySavings', formatCurrency)}
          {renderNumberInput('PiggyVest Annual Rate (%)', 'piggyVestAnnualRate', (value) => `${(value * 100).toFixed(1)}%`)}
          {renderNumberInput('RiseVest Annual Rate (%)', 'riseVestAnnualRate', (value) => `${(value * 100).toFixed(1)}%`)}
          {renderNumberInput('Base Exchange Rate', 'baseExchangeRate', (value) => `₦${value.toLocaleString()}`)}
        </SimpleGrid>
      </VStack>
    </Box>
  );
} 