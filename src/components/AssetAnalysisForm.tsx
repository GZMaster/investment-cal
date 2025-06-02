import {
  VStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  useColorModeValue,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import type { AssetAnalysisScenario, VehicleInvestment } from '../types/investment';

interface AssetAnalysisFormProps {
  onSubmit: (scenario: AssetAnalysisScenario) => void;
}

export function AssetAnalysisForm({ onSubmit }: AssetAnalysisFormProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [scenario, setScenario] = useState<AssetAnalysisScenario>({
    initialSavings: 3000000,
    monthlySavings: 1000000,
    vehicleInvestment: {
      investmentCost: 3300000,
      returnAmount: 5600000,
      investmentPeriod: 12,
      cyclePeriod: 3,
    },
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
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Initial Savings</FormLabel>
          <NumberInput
            value={scenario.initialSavings}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, initialSavings: value }))
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
            value={scenario.monthlySavings}
            onChange={(_, value) =>
              setScenario((prev) => ({ ...prev, monthlySavings: value }))
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