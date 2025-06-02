import { useState } from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Box,
} from '@chakra-ui/react';
import { AssetAnalysisForm } from '../components/AssetAnalysisForm';
import { AssetAnalysis } from '../components/AssetAnalysis';
import { calculateAssetAnalysis } from '../utils/asset-analysis-calculator';
import type { AssetAnalysisScenario, AssetAnalysisResult } from '../types/investment';

export function AssetAnalysisPage() {
  const [result, setResult] = useState<AssetAnalysisResult | null>(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleSubmit = (scenario: AssetAnalysisScenario) => {
    const analysisResult = calculateAssetAnalysis(scenario);
    setResult(analysisResult);
  };

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={4}>Vehicle Investment Analysis</Heading>
            <Text fontSize="lg" color="gray.600">
              Analyze your vehicle investment strategy with monthly savings and returns
            </Text>
          </Box>

          <AssetAnalysisForm onSubmit={handleSubmit} />

          {result && <AssetAnalysis result={result} />}
        </VStack>
      </Container>
    </Box>
  );
} 