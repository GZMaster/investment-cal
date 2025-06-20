import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { StoreProvider } from 'easy-peasy';
import { AssetAnalysisPage } from './pages/AssetAnalysisPage';
import { BudgetAnalysisPage } from './pages/BudgetAnalysisPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { LandingPage } from './pages/LandingPage';
import { ThreeTierStrategyPage } from './pages/ThreeTierStrategyPage';
import { ShoppingListPage } from './pages/ShoppingListPage';
import { CryptoPortfolioPage } from './pages/CryptoPortfolioPage';
import theme from './theme';
import { ThemeToggle } from './components/ThemeToggle';
import { PlatformConfigWidget } from './components/PlatformConfigWidget';
import { store } from './store/global-store';

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
        <StoreProvider store={store}>
          <ChakraProvider theme={theme}>
            <ThemeToggle />
            <PlatformConfigWidget />

            <Router basename="/">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/budget" element={<BudgetAnalysisPage />} />
                <Route path="/vehicle-analysis" element={<AssetAnalysisPage />} />
                <Route path="/three-tier-strategy" element={<ThreeTierStrategyPage />} />
                <Route path="/shopping-list" element={<ShoppingListPage />} />
                <Route path="/crypto-portfolio" element={<CryptoPortfolioPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </ChakraProvider>
        </StoreProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
