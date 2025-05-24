import { ChakraProvider } from '@chakra-ui/react';
import { Container, VStack } from '@chakra-ui/react';
import { InvestmentCalculator } from './components/InvestmentCalculator';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.xl" py={8}>
        <VStack gap={8}>
          <InvestmentCalculator />
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App;
