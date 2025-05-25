import { ChakraProvider } from '@chakra-ui/react';
import { Container, VStack } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InvestmentCalculator } from './components/InvestmentCalculator';
import theme from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 3600000, // Refetch every hour
      staleTime: 3600000, // Consider data stale after an hour
      retry: 3, // Retry failed requests 3 times
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Container maxW="container.xl" py={8}>
          <VStack gap={8}>
            <InvestmentCalculator />
          </VStack>
        </Container>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
