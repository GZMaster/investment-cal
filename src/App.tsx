import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AssetAnalysisPage } from './pages/AssetAnalysisPage';
import { BudgetAnalysisPage } from './pages/BudgetAnalysisPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { LandingPage } from './pages/LandingPage';
import theme from './theme';
import { ThemeToggle } from './components/ThemeToggle';

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
          <ThemeToggle />

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
