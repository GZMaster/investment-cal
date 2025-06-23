import {
  Box,
  Button,
  VStack,
  useColorModeValue,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import type { ThreeTierStrategyScenario } from '../types/investment';
import { getSavingsPlatformName, getInvestmentPlatformName } from '../utils/platform-utils';
import { FormField, Card } from './ui';

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

        <FormField
          type="number"
          label="Initial Balance"
          value={scenario.initialSavingsPlatformBalance}
          onChange={(value) => setScenario((prev) => ({ ...prev, initialSavingsPlatformBalance: value }))}
          min={0}
          step={100000}
        />

        <FormField
          type="number"
          label="Monthly Savings"
          value={scenario.monthlySavingsPlatformSavings}
          onChange={(value) => setScenario((prev) => ({ ...prev, monthlySavingsPlatformSavings: value }))}
          min={0}
          step={100000}
        />

        <FormField
          type="number"
          label="Annual Interest Rate (%)"
          value={scenario.savingsPlatformInterestRate}
          onChange={(value) => setScenario((prev) => ({ ...prev, savingsPlatformInterestRate: value }))}
          min={0}
          max={100}
          step={0.1}
        />

        <FormField
          type="number"
          label={`Interest Reinvestment to ${investmentPlatformName} (%)`}
          value={scenario.savingsPlatformInterestReinvestPercentage}
          onChange={(value) => setScenario((prev) => ({ ...prev, savingsPlatformInterestReinvestPercentage: value }))}
          min={0}
          max={100}
          step={1}
        />

        <Divider />

        <Heading size="md">{investmentPlatformName} Tier</Heading>

        <FormField
          type="number"
          label="Initial USD Balance"
          value={scenario.initialInvestmentPlatformBalance}
          onChange={(value) => setScenario((prev) => ({ ...prev, initialInvestmentPlatformBalance: value }))}
          min={0}
          step={100}
        />

        <FormField
          type="number"
          label="Annual Interest Rate (%)"
          value={scenario.investmentPlatformInterestRate}
          onChange={(value) => setScenario((prev) => ({ ...prev, investmentPlatformInterestRate: value }))}
          min={0}
          max={100}
          step={0.1}
        />

        <FormField
          type="number"
          label="Annual USD Appreciation Rate (%)"
          value={scenario.usdAppreciationRate}
          onChange={(value) => setScenario((prev) => ({ ...prev, usdAppreciationRate: value }))}
          min={0}
          max={100}
          step={0.1}
        />

        <FormField
          type="number"
          label="Current Exchange Rate (NGN/USD)"
          value={scenario.exchangeRate}
          onChange={(value) => setScenario((prev) => ({ ...prev, exchangeRate: value }))}
          min={0}
          step={10}
        />

        <Divider />

        <Heading size="md">Vehicle Investment Tier</Heading>

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
          label="Annual Investment Cost Appreciation Rate (%)"
          value={scenario.vehicleInvestment.investmentCostAppreciationRate}
          onChange={(value) => setScenario((prev) => ({
            ...prev,
            vehicleInvestment: {
              ...prev.vehicleInvestment,
              investmentCostAppreciationRate: value,
            },
          }))}
          min={0}
          max={100}
          step={0.1}
        />

        <FormField
          type="number"
          label="Annual Return Amount Appreciation Rate (%)"
          value={scenario.vehicleInvestment.returnAmountAppreciationRate}
          onChange={(value) => setScenario((prev) => ({
            ...prev,
            vehicleInvestment: {
              ...prev.vehicleInvestment,
              returnAmountAppreciationRate: value,
            },
          }))}
          min={0}
          max={100}
          step={0.1}
        />

        <Divider />

        <Heading size="md">Analysis Settings</Heading>

        <FormField
          type="number"
          label="Analysis Period (months)"
          value={scenario.analysisPeriod}
          onChange={(value) => setScenario((prev) => ({ ...prev, analysisPeriod: value }))}
          min={1}
          max={120}
        />

        <Button type="submit" colorScheme="blue" size="lg">
          Calculate
        </Button>
      </VStack>
    </Box>
  );
} 