import {
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
  Tooltip,
} from '@chakra-ui/react';
import { FaCalculator, FaChartLine, FaCar, FaLock } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import favicon from '../assets/favicon.svg';
import { SEO } from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const tools = [
  {
    id: 'compare-strategies',
    title: 'Compare Single-Tier vs Two-Tier Investment Strategies',
    description: 'Analyze and compare different investment approaches with real-time exchange rates and market data.',
    icon: FaCalculator,
    path: '/calculator',
    status: 'active',
  },
  {
    id: 'budget-analysis',
    title: 'Budget Analysis Tool',
    description: 'Track your spending, savings, and debt management across different platforms with detailed allocation plans.',
    icon: FaChartLine,
    path: '/budget',
    status: 'active',
  },
  {
    id: 'vehicle-analysis',
    title: 'Vehicle Investment Analysis Tool',
    description: 'Analyze your vehicle investment strategy with monthly savings and returns. Get detailed breakdowns, charts, and ROI insights.',
    icon: FaCar,
    path: '/vehicle-analysis',
    status: 'active',
  },
];

export function LandingPage() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const heroBgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Helmet>
        <title>Investment Tools Suite | Analyze, Compare, and Optimize Investments</title>
        <meta name="description" content="A comprehensive collection of tools to help you make better investment decisions and manage your portfolio effectively. Analyze, compare, and optimize your investments with ease." />
        <meta property="og:title" content="Investment Tools Suite | Analyze, Compare, and Optimize Investments" />
        <meta property="og:description" content="A comprehensive collection of tools to help you make better investment decisions and manage your portfolio effectively. Analyze, compare, and optimize your investments with ease." />
      </Helmet>

      {/* Hero Section */}
      <Box
        bg={heroBgColor}
        py={20}
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        <Container maxW="container.xl">
          <VStack spacing={6} align="center" textAlign="center">
            <Image
              src={favicon}
              alt="Investment Tools Logo"
              boxSize="100px"
              mb={4}
            />
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, blue.400, teal.400)"
              bgClip="text"
            >
              Investment Tools Suite
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="2xl">
              A comprehensive collection of tools to help you make better investment decisions and manage your portfolio effectively.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Tools Section */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={12}>
          <Heading textAlign="center">Investment Tools</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            {tools.map((tool) => {
              const cardContent = (
                <Tooltip label={tool.status === 'active' ? `Open ${tool.title}` : 'Coming soon!'} hasArrow>
                  <Box
                    key={tool.id}
                    p={6}
                    bg={bgColor}
                    borderRadius="xl"
                    boxShadow="xl"
                    border="1px solid"
                    borderColor={borderColor}
                    transition="all 0.2s"
                    _hover={tool.status === 'active' ? {
                      transform: 'translateY(-4px)',
                      boxShadow: '2xl',
                      borderColor: 'blue.400',
                    } : {}}
                    position="relative"
                    opacity={tool.status === 'coming-soon' ? 0.7 : 1}
                    cursor={tool.status === 'active' ? 'pointer' : 'default'}
                  >
                    <VStack align="start" spacing={4}>
                      <HStack spacing={4} width="100%" justify="space-between">
                        <Icon as={tool.icon} w={10} h={10} color="blue.500" />
                        {tool.status === 'coming-soon' && (
                          <Badge colorScheme="purple" fontSize="sm">Coming Soon</Badge>
                        )}
                      </HStack>
                      <Heading size="md">{tool.title}</Heading>
                      <Text color={textColor}>
                        {tool.description}
                      </Text>
                      <HStack spacing={2} color={tool.status === 'active' ? 'blue.500' : 'purple.500'}>
                        <Icon as={tool.status === 'active' ? FaCalculator : FaLock} />
                        <Text fontSize="sm" fontWeight="medium">
                          {tool.status === 'active' ? 'Try Tool →' : 'Coming Soon'}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                </Tooltip>
              );

              return tool.status === 'active' ? (
                <RouterLink key={tool.id} to={tool.path}>
                  {cardContent}
                </RouterLink>
              ) : (
                <Box key={tool.id}>
                  {cardContent}
                </Box>
              );
            })}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
} 