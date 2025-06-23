import {
  VStack,
  Button,
  useColorModeValue,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import type { AssetAnalysisScenario } from '../types/investment';
import { FormField } from './ui';

interface AssetAnalysisFormProps {
  onSubmit: (scenario: AssetAnalysisScenario) => void;
}

export function AssetAnalysisForm({ onSubmit }: AssetAnalysisFormProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [scenario, setScenario] = useState<AssetAnalysisScenario>({
    initialSavings: 10000000,
    monthlySavings: 1000000,
    vehicleInvestment: {
      investmentCost: 3300000,
      returnAmount: 5600000,
      investmentPeriod: 12,
      cyclePeriod: 3,
    },
    analysisPeriod: 24,
    vehiclesPerCycle: 1,
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
        <FormField
          type="number"
          label="Initial Savings"
          value={scenario.initialSavings}
          onChange={(value) => setScenario((prev) => ({ ...prev, initialSavings: value }))}
          min={0}
          step={100000}
        />

        <FormField
          type="number"
          label="Monthly Savings"
          value={scenario.monthlySavings}
          onChange={(value) => setScenario((prev) => ({ ...prev, monthlySavings: value }))}
          min={0}
          step={100000}
        />

        <FormField
          type="number"
          label="Investment Cost per Vehicle"
          value={scenario.vehicleInvestment.investmentCost}
          onChange={(value) => setScenario((prev) => ({
            ...prev,
            vehicleInvestment: {
              ...prev.vehicleInvestment,
              investmentCost: value,
            },
          }))}
          min={0}
          step={100000}
        />

        <FormField
          type="number"
          label="Return Amount per Vehicle"
          value={scenario.vehicleInvestment.returnAmount}
          onChange={(value) => setScenario((prev) => ({
            ...prev,
            vehicleInvestment: {
              ...prev.vehicleInvestment,
              returnAmount: value,
            },
          }))}
          min={0}
          step={100000}
        />

        <FormField
          type="number"
          label="Investment Period (months)"
          value={scenario.vehicleInvestment.investmentPeriod}
          onChange={(value) => setScenario((prev) => ({
            ...prev,
            vehicleInvestment: {
              ...prev.vehicleInvestment,
              investmentPeriod: value,
            },
          }))}
          min={1}
          max={60}
        />

        <FormField
          type="number"
          label="Investment Cycle (months)"
          value={scenario.vehicleInvestment.cyclePeriod}
          onChange={(value) => setScenario((prev) => ({
            ...prev,
            vehicleInvestment: {
              ...prev.vehicleInvestment,
              cyclePeriod: value,
            },
          }))}
          min={1}
          max={12}
        />

        <FormField
          type="number"
          label="Vehicles per Cycle"
          value={scenario.vehiclesPerCycle}
          onChange={(value) => setScenario((prev) => ({
            ...prev,
            vehiclesPerCycle: value,
          }))}
          min={1}
          max={10}
        />

        <FormField
          type="number"
          label="Analysis Period (months)"
          value={scenario.analysisPeriod}
          onChange={(value) => setScenario((prev) => ({ ...prev, analysisPeriod: value }))}
          min={1}
          max={60}
        />

        <Button type="submit" colorScheme="blue" size="lg">
          Calculate
        </Button>
      </VStack>
    </Box>
  );
} 