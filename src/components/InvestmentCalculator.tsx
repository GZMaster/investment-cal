import {
  Box,
  VStack,
  useColorModeValue,
  ScaleFade,
  Fade,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
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
import { VisualizationSection } from './VisualizationSection';
import { useExchangeRate } from '../hooks/useExchangeRate';

const MotionBox = motion(Box);

export function InvestmentCalculator() {
  const [scenario, setScenario] = useState<InvestmentScenario>(DEFAULT_SCENARIO);
  const { data, updateScenarioWithRates } = useExchangeRate();

  // Update scenario with real-time rates when enabled
  useEffect(() => {
    if (scenario.useRealTimeRate && data) {
      setScenario(prev => updateScenarioWithRates(prev));
    }
  }, [scenario.useRealTimeRate, data, updateScenarioWithRates]);

  console.log(data)

  const result = calculateInvestmentResult({
    ...scenario,
    baseExchangeRate: data?.rate ?? scenario.baseExchangeRate,
    appreciation: data?.expectedAppreciation ?? scenario.appreciation,
  });
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <VStack spacing={0} align="stretch">
      <Fade in={true}>
        <Header />
      </Fade>

      <ScaleFade initialScale={0.9} in={true}>
        <MotionBox
          w="full"
          bg={bgColor}
          borderRadius="xl"
          p={8}
          boxShadow="xl"
          mx="auto"
          maxW="container.xl"
          border="1px solid"
          borderColor={borderColor}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={8} align="stretch">
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ScenarioSelector
                scenario={scenario}
                onScenarioChange={setScenario}
              />
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CurrencyInfo scenario={scenario} result={result} />
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ComparisonCards result={result} />
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <BreakevenInfo scenario={scenario} result={result} />
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <InvestmentTable scenario={scenario} />
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <SummarySection result={result} />
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <AnalysisSection scenario={scenario} result={result} />
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <VisualizationSection scenario={scenario} result={result} />
            </MotionBox>
          </VStack>
        </MotionBox>
      </ScaleFade>
    </VStack>
  );
} 