import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { FaChartLine, FaMoneyBillWave } from 'react-icons/fa';

export function Header() {
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.200, purple.300)'
  );
  const textColor = useColorModeValue('white', 'gray.800');
  const iconColor = useColorModeValue('white', 'gray.100');

  return (
    <Box
      as="header"
      bgGradient={bgGradient}
      color={textColor}
      py={8}
      mb={8}
      boxShadow="lg"
    >
      <Container maxW="container.xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap={4}
        >
          <VStack align={{ base: 'center', md: 'start' }} spacing={2}>
            <Flex align="center" gap={3}>
              <Icon as={FaChartLine} boxSize={8} color={iconColor} />
              <Heading
                size="2xl"
                fontWeight="bold"
                letterSpacing="tight"
                textAlign={{ base: 'center', md: 'left' }}
              >
                Investment Strategy
              </Heading>
            </Flex>
            <Text
              fontSize="xl"
              opacity={0.9}
              textAlign={{ base: 'center', md: 'left' }}
            >
              Compare Single-Tier vs Two-Tier Investment Strategies
            </Text>
          </VStack>

          <Box
            as="div"
            w={{ base: '120px', md: '150px' }}
            h={{ base: '120px', md: '150px' }}
            position="relative"
            borderRadius="full"
            overflow="hidden"
            boxShadow="2xl"
            bg="white"
            p={2}
          >
            <Box
              as="div"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="90%"
              h="90%"
              borderRadius="full"
              bgGradient="linear(to-br, blue.400, purple.500)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
            >
              <Icon as={FaMoneyBillWave} boxSize={8} color="white" />
              <Text
                fontSize={{ base: '3xl', md: '4xl' }}
                fontWeight="bold"
                color="white"
              >
                ₦$
              </Text>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
} 