import {
  Box,
  Container,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { FaBitcoin } from 'react-icons/fa';
import { BackButton } from '../components/BackButton';
import { CryptoAlerts } from '../components/CryptoAlerts';
import { CryptoAnalysis } from '../components/CryptoAnalysis';
import { CryptoAssetList } from '../components/CryptoAssetList';
import { CryptoMarketData } from '../components/CryptoMarketData';
import { CryptoPortfolioOverview } from '../components/CryptoPortfolioOverview';
import { CryptoTransactions } from '../components/CryptoTransactions';
import { Header } from '../components/Header';
import { SEO } from '../components/SEO';
import { useCryptoStore } from '../hooks/useCryptoStore';

export function CryptoPortfolioPage() {
  const { error } = useCryptoStore();

  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Helmet>
        <title>Cryptocurrency Portfolio Tracker | Investment Tools Suite</title>
        <meta name="description" content="Track and analyze your cryptocurrency investments with multi-chain support, staking rewards, DeFi yield farming, and comprehensive portfolio management tools." />
        <meta property="og:title" content="Cryptocurrency Portfolio Tracker | Investment Tools Suite" />
        <meta property="og:description" content="Track and analyze your cryptocurrency investments with multi-chain support, staking rewards, DeFi yield farming, and comprehensive portfolio management tools." />
      </Helmet>
      <Container maxW="container.xl">
        <BackButton />
        <SEO
          title="Cryptocurrency Portfolio Tracker"
          description="Track and analyze your cryptocurrency investments with multi-chain support, staking rewards, DeFi yield farming, and comprehensive portfolio management tools."
          keywords={[
            'cryptocurrency portfolio',
            'crypto tracker',
            'blockchain investments',
            'staking rewards',
            'defi yield',
            'crypto analysis',
            'portfolio management',
            'multi-chain',
          ]}
        />

        <VStack spacing={8} align="stretch">
          <Header
            title="Cryptocurrency Portfolio Tracker"
            description="Track and analyze your cryptocurrency investments with multi-chain support, staking rewards, DeFi yield farming, and comprehensive portfolio management tools."
          />

          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Icon as={FaBitcoin} color="orange.500" boxSize={6} />
              <Text fontSize="3xl" fontWeight="bold">
                Crypto Portfolio Tracker
              </Text>
            </HStack>

          </HStack>

          <CryptoMarketData />

          <CryptoPortfolioOverview />

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            <VStack spacing={6} align="stretch">
              <CryptoAssetList />
              <CryptoTransactions />
            </VStack>

            <VStack spacing={6} align="stretch">
              <CryptoAnalysis />
              <CryptoAlerts />
            </VStack>
          </SimpleGrid>



          {error && (
            <Box
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              borderRadius="md"
              p={4}
            >
              <Text color="red.600" fontWeight="medium">
                Error: {error}
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
} 