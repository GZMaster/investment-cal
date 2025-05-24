import {
  Box,
  Heading,
  VStack,
  useColorModeValue
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

export function InvestmentCalculator() {
  const [scenario, setScenario] = useState<InvestmentScenario>({
    appreciation: 0,
    timePeriod: 1,
  });

  const result = calculateInvestmentResult(scenario);
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      w="full"
      bg={bgColor}
      borderRadius="xl"
      p={8}
      boxShadow="xl"
    >
      <VStack spacing={8} align="stretch">
        <Heading
          textAlign="center"
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
          fontSize="3xl"
        >
          Investment Strategy with USD Appreciation
        </Heading>

        <ScenarioSelector
          scenario={scenario}
          onScenarioChange={setScenario}
        />

        <CurrencyInfo scenario={scenario} result={result} />

        <ComparisonCards result={result} />

        <BreakevenInfo scenario={scenario} result={result} />

        <InvestmentTable scenario={scenario} />

        <SummarySection scenario={scenario} result={result} />

        <AnalysisSection scenario={scenario} result={result} />
      </VStack>
    </Box>
  );
} 