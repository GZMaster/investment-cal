import {
  Box,
  Container,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { BackButton } from '../components/BackButton';
import { Header } from '../components/Header';
import { SEO } from '../components/SEO';
import { ThreeTierStrategyForm } from '../components/ThreeTierStrategyForm';
import { ThreeTierStrategyAnalysis } from '../components/ThreeTierStrategyAnalysis';
import { useState } from 'react';
import type { ThreeTierStrategyScenario, ThreeTierStrategyResult } from '../types/investment';
import { calculateThreeTierStrategy } from '../utils/three-tier-calculator';

export function ThreeTierStrategyPage() {
  const [result, setResult] = useState<ThreeTierStrategyResult | null>(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleSubmit = (scenario: ThreeTierStrategyScenario) => {
    const calculatedResult = calculateThreeTierStrategy(scenario);
    setResult(calculatedResult);
  };

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Helmet>
        <title>3-Tier Investment Strategy | Investment Tools Suite</title>
        <meta name="description" content="Analyze a 3-tier investment strategy combining PiggyVest savings, RiseVest USD investments, and vehicle investments." />
        <meta property="og:title" content="3-Tier Investment Strategy | Investment Tools Suite" />
        <meta property="og:description" content="Analyze a 3-tier investment strategy combining PiggyVest savings, RiseVest USD investments, and vehicle investments." />
      </Helmet>
      <Container maxW="container.xl">
        <BackButton />
        <SEO
          title="3-Tier Investment Strategy"
          description="Analyze a 3-tier investment strategy combining PiggyVest savings, RiseVest USD investments, and vehicle investments."
          keywords={[
            '3-tier investment strategy',
            'investment analysis',
            'PiggyVest',
            'RiseVest',
            'vehicle investment',
            'USD investment',
            'investment returns',
            'financial planning',
          ]}
        />

        <VStack spacing={8} align="stretch">
          <Header
            title="3-Tier Investment Strategy"
            description="Analyze a 3-tier investment strategy combining PiggyVest savings, RiseVest USD investments, and vehicle investments."
          />

          <ThreeTierStrategyForm onSubmit={handleSubmit} />

          {result && (
            <ThreeTierStrategyAnalysis result={result} />
          )}
        </VStack>
      </Container>
    </Box>
  );
} 