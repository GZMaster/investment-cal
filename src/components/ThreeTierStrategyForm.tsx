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

interface ThreeTierStrategyFormProps {
  onSubmit: (scenario: ThreeTierStrategyScenario) => void;
}

export function ThreeTierStrategyForm({ onSubmit }: ThreeTierStrategyFormProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [scenario, setScenario] = useState<ThreeTierStrategyScenario>({
    // PiggyVest Tier
    initialPiggyVestBalance: 10000000,
    monthlyPiggyVestSavings: 1000000,
    piggyVestInterestRate: 18, // 18% annual interest

    // RiseVest Tier
    initialRiseVestBalance: 0,
    riseVestInterestRate: 8, // 8% annual interest
    usdAppreciationRate: 7.2, // 7.2% annual USD appreciation
    exchangeRate: 1650, // Current NGN/USD rate

    // Vehicle Investment Tier
    vehicleInvestment: {
      investmentCost: 3300000,
      returnAmount: 5600000,
      investmentPeriod: 12,
      cyclePeriod: 3,
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
        <Heading size="md">PiggyVest Tier</Heading>
        <FormControl>
          <FormLabel>Initial Balance</FormLabel>
          <NumberInput
            value={scenario.initialPiggyVestBalance}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, initialPiggyVestBalance: value }))
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
            value={scenario.monthlyPiggyVestSavings}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, monthlyPiggyVestSavings: value }))
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
            value={scenario.piggyVestInterestRate}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, piggyVestInterestRate: value }))
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

        <Heading size="md">RiseVest Tier</Heading>
        <FormControl>
          <FormLabel>Initial USD Balance</FormLabel>
          <NumberInput
            value={scenario.initialRiseVestBalance}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, initialRiseVestBalance: value }))
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
            value={scenario.riseVestInterestRate}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, riseVestInterestRate: value }))
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
            max={60}
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