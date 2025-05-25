import { Container, VStack } from '@chakra-ui/react';
import { InvestmentCalculator } from '../components/InvestmentCalculator';

export function CalculatorPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8}>
        <InvestmentCalculator />
      </VStack>
    </Container>
  );
} 