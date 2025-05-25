import {
  Box,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
  Icon,
  Heading,
  Switch,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCog } from 'react-icons/fa';
import { INVESTMENT_RANGES } from '../constants/investment';
import type { InvestmentScenario } from '../types/investment';
import { formatCurrency } from '../utils/investment-calculator';
import { useExchangeRate } from '../hooks/useExchangeRate';

const MotionBox = motion(Box);

interface ScenarioSelectorProps {
  scenario: InvestmentScenario;
  onScenarioChange: (scenario: InvestmentScenario) => void;
}

type NumberField = Exclude<keyof InvestmentScenario, 'useRealTimeRate'>;

export function ScenarioSelector({ scenario, onScenarioChange }: ScenarioSelectorProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('blue.500', 'blue.300');
  const { data, isLoading, error } = useExchangeRate();

  const handleNumberChange = (field: NumberField, value: number) => {
    onScenarioChange({
      ...scenario,
      [field]: value,
    });
  };

  const handleBooleanChange = (field: 'useRealTimeRate', value: boolean) => {
    onScenarioChange({
      ...scenario,
      [field]: value,
      ...(value && data && {
        appreciation: data.expectedAppreciation,
        baseExchangeRate: data.rate,
      }),
    });
  };

  const renderNumberInput = (
    label: string,
    field: NumberField,
    format?: (value: number) => string,
    isDisabled?: boolean
  ) => {
    const range = INVESTMENT_RANGES[field];
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FormControl>
          <FormLabel fontWeight="medium">{label}</FormLabel>
          <NumberInput
            value={scenario[field]}
            min={range.min}
            max={range.max}
            step={range.step}
            onChange={(_, value) => handleNumberChange(field, value)}
            size="lg"
            isDisabled={isDisabled}
          >
            <NumberInputField
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
            />
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
      </MotionBox>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <VStack spacing={6} align="stretch">
        <Box display="flex" alignItems="center" gap={3}>
          <Icon as={FaCog} boxSize={6} color={iconColor} />
          <Heading size="md" fontWeight="bold">
            Investment Parameters
          </Heading>
        </Box>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="use-real-time" mb="0">
            Use Real-Time Exchange Rate
          </FormLabel>
          <Switch
            id="use-real-time"
            isChecked={scenario.useRealTimeRate}
            onChange={(e) => handleBooleanChange('useRealTimeRate', e.target.checked)}
            colorScheme="blue"
          />
        </FormControl>

        {scenario.useRealTimeRate && (
          <Alert status={isLoading ? "info" : error ? "error" : "success"} borderRadius="md">
            <AlertIcon />
            {isLoading ? (
              <Flex align="center" gap={2}>
                <Spinner size="sm" />
                <Text>Fetching current exchange rate...</Text>
              </Flex>
            ) : error ? (
              <Text>Failed to fetch exchange rates. Please try again later.</Text>
            ) : data ? (
              <VStack align="start" spacing={1}>
                <Text>Current USD/NGN Rate: ₦{data.rate.toLocaleString()}</Text>
                <Text>Expected Annual Appreciation: {data.expectedAppreciation}%</Text>
              </VStack>
            ) : null}
          </Alert>
        )}

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {renderNumberInput('Time Period (Years)', 'timePeriod')}
          {renderNumberInput(
            'USD Appreciation (%)',
            'appreciation',
            (value) => `${value}%`,
            scenario.useRealTimeRate
          )}
          {renderNumberInput('Initial Investment', 'principal', formatCurrency)}
          {renderNumberInput('Monthly Savings', 'monthlySavings', formatCurrency)}
          {renderNumberInput('PiggyVest Annual Rate (%)', 'piggyVestAnnualRate', (value) => `${(value * 100).toFixed(1)}%`)}
          {renderNumberInput('RiseVest Annual Rate (%)', 'riseVestAnnualRate', (value) => `${(value * 100).toFixed(1)}%`)}
          {renderNumberInput('Base Exchange Rate', 'baseExchangeRate', (value) => `₦${value.toLocaleString()}`)}
        </SimpleGrid>
      </VStack>
    </MotionBox>
  );
} 