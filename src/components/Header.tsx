import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface HeaderProps {
  title: string;
  description: string;
  showLogo?: boolean;
}

export function Header({ title, description, showLogo = true }: HeaderProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      w="full"
      bg={bgColor}
      borderBottom="1px solid"
      borderColor={borderColor}
      py={8}
      mb={8}
    >
      <Container maxW="container.xl">
        <VStack spacing={4} align="center">
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Flex align="center" gap={3}>
              {showLogo && (
                <Image
                  src="/favicon.svg"
                  alt="Investment Strategy Logo"
                  boxSize={8}
                  objectFit="contain"
                />
              )}
              <Heading
                size="2xl"
                fontWeight="bold"
                letterSpacing="tight"
                bgGradient="linear(to-r, blue.500, purple.500)"
                bgClip="text"
              >
                {title}
              </Heading>
            </Flex>
          </MotionBox>
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Text
              fontSize="xl"
              color={useColorModeValue('gray.600', 'gray.400')}
              textAlign="center"
              maxW="2xl"
            >
              {description}
            </Text>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
} 