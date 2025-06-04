import {
  Box,
  Container,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  Heading,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import {
  FaChartLine,
  FaCalculator,
  FaCar,
  FaExchangeAlt,
  FaChartPie,
  FaShieldAlt,
} from 'react-icons/fa';

interface FeatureProps {
  title: string;
  text: string;
  icon: React.ElementType;
}

function Feature({ title, text, icon }: FeatureProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Stack
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
        borderColor: 'blue.400',
      }}
    >
      <Icon as={icon} w={10} h={10} color="blue.500" />
      <Text fontWeight="bold" fontSize="lg">{title}</Text>
      <Text color={textColor}>{text}</Text>
    </Stack>
  );
}

export function FeaturesSection() {
  const features = [
    {
      title: 'Real-time Analysis',
      text: 'Get instant insights into your investment performance with real-time data and calculations.',
      icon: FaChartLine,
    },
    {
      title: 'Multi-Strategy Comparison',
      text: 'Compare different investment strategies side by side to make informed decisions.',
      icon: FaCalculator,
    },
    {
      title: 'Vehicle Investment Analysis',
      text: 'Detailed analysis of vehicle investments with ROI calculations and performance tracking.',
      icon: FaCar,
    },
    {
      title: 'Currency Exchange Integration',
      text: 'Track investments across different currencies with real-time exchange rates.',
      icon: FaExchangeAlt,
    },
    {
      title: 'Portfolio Visualization',
      text: 'Visualize your investment portfolio with interactive charts and graphs.',
      icon: FaChartPie,
    },
    {
      title: 'Secure & Private',
      text: 'Your data is secure and private. All calculations are done locally in your browser.',
      icon: FaShieldAlt,
    },
  ];

  return (
    <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          <Stack spacing={4} textAlign="center">
            <Heading size="xl">Platform Features</Heading>
            <Text color={useColorModeValue('gray.600', 'gray.400')} maxW="2xl">
              Our comprehensive suite of investment tools helps you make better financial decisions
              with powerful analysis and visualization capabilities.
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {features.map((feature, index) => (
              <Feature
                key={index}
                title={feature.title}
                text={feature.text}
                icon={feature.icon}
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
} 