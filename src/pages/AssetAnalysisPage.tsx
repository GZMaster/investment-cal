import { useState } from 'react';
import {
  Container,
  VStack,
  useColorModeValue,
  Box,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { AssetAnalysisForm } from '../components/AssetAnalysisForm';
import { AssetAnalysis } from '../components/AssetAnalysis';
import { calculateAssetAnalysis } from '../utils/asset-analysis-calculator';
import type { AssetAnalysisScenario, AssetAnalysisResult } from '../types/investment';
import { BackButton } from '../components/BackButton';
import { Header } from '../components/Header';

export function AssetAnalysisPage() {
  const [result, setResult] = useState<AssetAnalysisResult | null>(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleSubmit = (scenario: AssetAnalysisScenario) => {
    const analysisResult = calculateAssetAnalysis(scenario);
    setResult(analysisResult);
  };

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Helmet>
        <title>Vehicle Investment Analysis | Investment Tools Suite</title>
        <meta name="description" content="Analyze your vehicle investment strategy with monthly savings and returns. Get detailed breakdowns, charts, and ROI insights." />
        <meta property="og:title" content="Vehicle Investment Analysis | Investment Tools Suite" />
        <meta property="og:description" content="Analyze your vehicle investment strategy with monthly savings and returns. Get detailed breakdowns, charts, and ROI insights." />
      </Helmet>
      <Container maxW="container.xl">
        <BackButton />
        <VStack spacing={8} align="stretch">
          <Header
            title="Vehicle Investment Analysis"
            description="Analyze your vehicle investment strategy with monthly savings and returns. Get detailed breakdowns, charts, and ROI insights."
          />

          <AssetAnalysisForm onSubmit={handleSubmit} />

          {result && <AssetAnalysis result={result} />}
        </VStack>
      </Container>
    </Box>
  );
} 