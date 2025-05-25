import { Container, VStack } from '@chakra-ui/react';
import { InvestmentCalculator } from '../components/InvestmentCalculator';
import { SEO } from '../components/SEO';

export function CalculatorPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <SEO
        title="Investment Calculator"
        description="Compare Single-Tier vs Two-Tier Investment Strategies with real-time exchange rates and market data. Make informed investment decisions with our advanced calculator."
        keywords={[
          'investment calculator',
          'investment strategies',
          'exchange rates',
          'investment comparison',
          'financial calculator',
          'investment analysis',
        ]}
      />
      <VStack gap={8}>
        <InvestmentCalculator />
      </VStack>
    </Container>
  );
} 