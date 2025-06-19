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
import { getSavingsPlatformName, getInvestmentPlatformName } from '../utils/platform-utils';

export function ThreeTierStrategyPage() {
  const [result, setResult] = useState<ThreeTierStrategyResult | null>(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const savingsPlatformName = getSavingsPlatformName();
  const investmentPlatformName = getInvestmentPlatformName();

  const handleSubmit = (scenario: ThreeTierStrategyScenario) => {
    const calculatedResult = calculateThreeTierStrategy(scenario);
    setResult(calculatedResult);
  };

  const description = `Analyze a 3-tier investment strategy combining ${savingsPlatformName} savings, ${investmentPlatformName} USD investments, and vehicle investments.`;

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Helmet>
        <title>3-Tier Investment Strategy | Investment Tools Suite</title>
        <meta name="description" content={description} />
        <meta property="og:title" content="3-Tier Investment Strategy | Investment Tools Suite" />
        <meta property="og:description" content={description} />
      </Helmet>
      <Container maxW="container.xl">
        <BackButton />
        <SEO
          title="3-Tier Investment Strategy"
          description={description}
          keywords={[
            '3-tier investment strategy',
            'investment analysis',
            savingsPlatformName,
            investmentPlatformName,
            'vehicle investment',
            'USD investment',
            'investment returns',
            'financial planning',
          ]}
        />

        <VStack spacing={8} align="stretch">
          <Header
            title="3-Tier Investment Strategy"
            description={description}
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