import {
  Box,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import type { InvestmentScenario } from '../types/investment';
import { calculateInvestmentResult } from '../utils/investment-calculator';
import { AnalysisSection } from './AnalysisSection';
import { BreakevenInfo } from './BreakevenInfo';
import { ComparisonCards } from './ComparisonCards';
import { CurrencyInfo } from './CurrencyInfo';
import { InvestmentTable } from './InvestmentTable';
import { ScenarioSelector } from './ScenarioSelector';
import { SummarySection } from './SummarySection';
import { DEFAULT_SCENARIO } from '../constants/investment';
import { Header } from './Header';

export function InvestmentCalculator() {
  const [scenario, setScenario] = useState<InvestmentScenario>(DEFAULT_SCENARIO);
  const result = calculateInvestmentResult(scenario);
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <VStack spacing={0} align="stretch">
      <Header />

      <Box
        w="full"
        bg={bgColor}
        borderRadius="xl"
        p={8}
        boxShadow="xl"
        mx="auto"
        maxW="container.xl"
      >
        <VStack spacing={8} align="stretch">
          <ScenarioSelector
            scenario={scenario}
            onScenarioChange={setScenario}
          />

          <CurrencyInfo scenario={scenario} result={result} />

          <ComparisonCards result={result} />

          <BreakevenInfo scenario={scenario} result={result} />

          <InvestmentTable scenario={scenario} />

          <SummarySection result={result} />

          <AnalysisSection scenario={scenario} result={result} />
        </VStack>
      </Box>
    </VStack>
  );
} 