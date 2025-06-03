import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import { InvestmentCalculator } from '../components/InvestmentCalculator';
import { BackButton } from '../components/BackButton';
import { SEO } from '../components/SEO';
import { Helmet } from 'react-helmet-async';

export function CalculatorPage() {
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Helmet>
        <title>Investment Calculator | Investment Tools Suite</title>
        <meta name="description" content="Calculate your investment returns and analyze different investment scenarios with our comprehensive calculator." />
        <meta property="og:title" content="Investment Calculator | Investment Tools Suite" />
        <meta property="og:description" content="Calculate your investment returns and analyze different investment scenarios with our comprehensive calculator." />
      </Helmet>
      <Container maxW="container.xl">
        <BackButton />
        <SEO
          title="Investment Calculator"
          description="Calculate your investment returns and analyze different investment scenarios with our comprehensive calculator."
          keywords={[
            'investment calculator',
            'investment returns',
            'financial planning',
            'investment analysis',
            'return on investment',
            'investment strategy',
          ]}
        />
        <Box pt={12}>
          <InvestmentCalculator />
        </Box>
      </Container>
    </Box>
  );
} 