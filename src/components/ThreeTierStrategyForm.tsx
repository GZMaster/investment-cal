import {
  Box,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  useColorModeValue,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import type { ThreeTierStrategyScenario } from '../types/investment';
import { getSavingsPlatformName, getInvestmentPlatformName } from '../utils/platform-utils';

interface ThreeTierStrategyFormProps {
  onSubmit: (scenario: ThreeTierStrategyScenario) => void;
}

export function ThreeTierStrategyForm({ onSubmit }: ThreeTierStrategyFormProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const savingsPlatformName = getSavingsPlatformName();
  const investmentPlatformName = getInvestmentPlatformName();

  const [scenario, setScenario] = useState<ThreeTierStrategyScenario>({
    // Savings Platform Tier
    initialSavingsPlatformBalance: 10000000,
    monthlySavingsPlatformSavings: 1000000,
    savingsPlatformInterestRate: 18, // 18% annual interest
    savingsPlatformInterestReinvestPercentage: 100, // Default to 100% reinvestment

    // Investment Platform Tier
    initialInvestmentPlatformBalance: 0,
    investmentPlatformInterestRate: 8, // 8% annual interest
    usdAppreciationRate: 7.2, // 7.2% annual USD appreciation
    exchangeRate: 1650, // Current NGN/USD rate

    // Vehicle Investment Tier
    vehicleInvestment: {
      investmentCost: 3300000,
      returnAmount: 5600000,
      investmentPeriod: 12,
      cyclePeriod: 3,
      investmentCostAppreciationRate: 0, // Default to 0% appreciation
      returnAmountAppreciationRate: 0, // Default to 0% appreciation
    },
    vehiclesPerCycle: 1,

    // Analysis Settings
    analysisPeriod: 24,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(scenario);
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <VStack spacing={6} align="stretch">
        <Heading size="md">{savingsPlatformName} Tier</Heading>
        <FormControl>
          <FormLabel>Initial Balance</FormLabel>
          <NumberInput
            value={scenario.initialSavingsPlatformBalance}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, initialSavingsPlatformBalance: value }))
            }
            min={0}
            step={100000}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Monthly Savings</FormLabel>
          <NumberInput
            value={scenario.monthlySavingsPlatformSavings}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, monthlySavingsPlatformSavings: value }))
            }
            min={0}
            step={100000}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Annual Interest Rate (%)</FormLabel>
          <NumberInput
            value={scenario.savingsPlatformInterestRate}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, savingsPlatformInterestRate: value }))
            }
            min={0}
            max={100}
            step={0.1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Interest Reinvestment to {investmentPlatformName} (%)</FormLabel>
          <NumberInput
            value={scenario.savingsPlatformInterestReinvestPercentage}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, savingsPlatformInterestReinvestPercentage: value }))
            }
            min={0}
            max={100}
            step={1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <Divider />

        <Heading size="md">{investmentPlatformName} Tier</Heading>
        <FormControl>
          <FormLabel>Initial USD Balance</FormLabel>
          <NumberInput
            value={scenario.initialInvestmentPlatformBalance}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, initialInvestmentPlatformBalance: value }))
            }
            min={0}
            step={100}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Annual Interest Rate (%)</FormLabel>
          <NumberInput
            value={scenario.investmentPlatformInterestRate}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, investmentPlatformInterestRate: value }))
            }
            min={0}
            max={100}
            step={0.1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Annual USD Appreciation Rate (%)</FormLabel>
          <NumberInput
            value={scenario.usdAppreciationRate}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, usdAppreciationRate: value }))
            }
            min={0}
            max={100}
            step={0.1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Current Exchange Rate (NGN/USD)</FormLabel>
          <NumberInput
            value={scenario.exchangeRate}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, exchangeRate: value }))
            }
            min={0}
            step={10}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <Divider />

        <Heading size="md">Vehicle Investment Tier</Heading>
        <FormControl>
          <FormLabel>Investment Cost per Vehicle</FormLabel>
          <NumberInput
            value={scenario.vehicleInvestment.investmentCost}
            onChange={(_, value) =>
              setScenario((prev) => ({
                ...prev,
                vehicleInvestment: {
                  ...prev.vehicleInvestment,
                  investmentCost: value,
                },
              }))
            }
            min={0}
            step={100000}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Return Amount per Vehicle</FormLabel>
          <NumberInput
            value={scenario.vehicleInvestment.returnAmount}
            onChange={(_, value) =>
              setScenario((prev) => ({
                ...prev,
                vehicleInvestment: {
                  ...prev.vehicleInvestment,
                  returnAmount: value,
                },
              }))
            }
            min={0}
            step={100000}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Investment Period (months)</FormLabel>
          <NumberInput
            value={scenario.vehicleInvestment.investmentPeriod}
            onChange={(_, value) =>
              setScenario((prev) => ({
                ...prev,
                vehicleInvestment: {
                  ...prev.vehicleInvestment,
                  investmentPeriod: value,
                },
              }))
            }
            min={1}
            max={60}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Investment Cycle (months)</FormLabel>
          <NumberInput
            value={scenario.vehicleInvestment.cyclePeriod}
            onChange={(_, value) =>
              setScenario((prev) => ({
                ...prev,
                vehicleInvestment: {
                  ...prev.vehicleInvestment,
                  cyclePeriod: value,
                },
              }))
            }
            min={1}
            max={12}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Vehicles per Cycle</FormLabel>
          <NumberInput
            value={scenario.vehiclesPerCycle}
            onChange={(_, value) =>
              setScenario((prev) => ({
                ...prev,
                vehiclesPerCycle: value,
              }))
            }
            min={1}
            max={10}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Annual Investment Cost Appreciation Rate (%)</FormLabel>
          <NumberInput
            value={scenario.vehicleInvestment.investmentCostAppreciationRate}
            onChange={(_, value) =>
              setScenario((prev) => ({
                ...prev,
                vehicleInvestment: {
                  ...prev.vehicleInvestment,
                  investmentCostAppreciationRate: value,
                },
              }))
            }
            min={0}
            max={100}
            step={0.1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Annual Return Amount Appreciation Rate (%)</FormLabel>
          <NumberInput
            value={scenario.vehicleInvestment.returnAmountAppreciationRate}
            onChange={(_, value) =>
              setScenario((prev) => ({
                ...prev,
                vehicleInvestment: {
                  ...prev.vehicleInvestment,
                  returnAmountAppreciationRate: value,
                },
              }))
            }
            min={0}
            max={100}
            step={0.1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <Divider />

        <Heading size="md">Analysis Settings</Heading>
        <FormControl>
          <FormLabel>Analysis Period (months)</FormLabel>
          <NumberInput
            value={scenario.analysisPeriod}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, analysisPeriod: value }))
            }
            min={1}
            max={120}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <Button type="submit" colorScheme="blue" size="lg">
          Calculate
        </Button>
      </VStack>
    </Box>
  );
} 