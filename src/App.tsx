import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LandingPage } from './pages/LandingPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { BudgetAnalysisPage } from './pages/BudgetAnalysisPage';
import theme from './theme';
import { AssetAnalysisPage } from './pages/AssetAnalysisPage';

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
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Router basename="/">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/budget" element={<BudgetAnalysisPage />} />
              <Route path="/asset-analysis" element={<AssetAnalysisPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ChakraProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
