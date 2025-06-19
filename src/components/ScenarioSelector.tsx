import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  Switch,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { DEFAULT_SCENARIO, INVESTMENT_RANGES } from '../constants/investment';
import type { InvestmentScenario } from '../types/investment';
import { formatCurrency } from '../utils/investment-calculator';
import { getSavingsPlatformName, getInvestmentPlatformName } from '../utils/platform-utils';

const MotionBox = motion(Box);

interface ScenarioSelectorProps {
  scenario: InvestmentScenario;
  onScenarioChange: (scenario: InvestmentScenario) => void;
}

export function ScenarioSelector({ scenario, onScenarioChange }: ScenarioSelectorProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const [localScenario, setLocalScenario] = useState<InvestmentScenario>(scenario);

  const savingsPlatformName = getSavingsPlatformName();
  const investmentPlatformName = getInvestmentPlatformName();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScenarioChange(localScenario);
  };

  const handleReset = () => {
    setLocalScenario(DEFAULT_SCENARIO);
    onScenarioChange(DEFAULT_SCENARIO);
  };

  const renderNumberInput = (
    label: string,
    field: keyof InvestmentScenario,
    formatter?: (value: number) => string,
    disabled?: boolean,
  ) => {
    const range = INVESTMENT_RANGES[field as keyof typeof INVESTMENT_RANGES];
    const value = localScenario[field] as number;

    return (
      <FormControl>
        <FormLabel>
          {label}
          {formatter && (
            <Text as="span" color={textColor} fontSize="sm" ml={2}>
              ({formatter(value)})
            </Text>
          )}
        </FormLabel>
        <NumberInput
          value={value}
          onChange={(_, newValue) =>
            setLocalScenario((prev) => ({ ...prev, [field]: newValue }))
          }
          min={range?.min}
          max={range?.max}
          step={range?.step}
          isDisabled={disabled}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
    );
  };

  return (
    <MotionBox
      p={6}
      bg={bgColor}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="md">Investment Scenario</Heading>
            <HStack spacing={3}>
              <Button type="button" variant="outline" onClick={handleReset} size="sm">
                Reset
              </Button>
              <Button type="submit" colorScheme="blue" size="sm">
                Apply
              </Button>
            </HStack>
          </HStack>

          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="use-real-time-rate" mb="0">
              Use Real-Time Exchange Rate
            </FormLabel>
            <Switch
              id="use-real-time-rate"
              isChecked={localScenario.useRealTimeRate}
              onChange={(e) =>
                setLocalScenario((prev) => ({ ...prev, useRealTimeRate: e.target.checked }))
              }
            />
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {renderNumberInput('Time Period (Years)', 'timePeriod')}
            {renderNumberInput(
              'USD Appreciation (%)',
              'appreciation',
              (value) => `${value}%`,
              localScenario.useRealTimeRate
            )}
            {renderNumberInput('Initial Investment', 'principal', formatCurrency)}
            {renderNumberInput('Monthly Savings', 'monthlySavings', formatCurrency)}
            {renderNumberInput(`${savingsPlatformName} Annual Rate (%)`, 'savingsPlatformAnnualRate', (value) => `${(value * 100).toFixed(1)}%`)}
            {renderNumberInput(`${investmentPlatformName} Annual Rate (%)`, 'investmentPlatformAnnualRate', (value) => `${(value * 100).toFixed(1)}%`)}
            {renderNumberInput('Base Exchange Rate', 'baseExchangeRate', (value) => `₦${value.toLocaleString()}`)}
          </SimpleGrid>
        </VStack>
      </form>
    </MotionBox>
  );
} 