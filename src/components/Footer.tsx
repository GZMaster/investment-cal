import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
  Link,
  Icon,
  HStack,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export function Footer() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      bg={bgColor}
      borderTop="1px solid"
      borderColor={borderColor}
      py={8}
      mt={20}
    >
      <Container maxW="container.xl">
        <Stack spacing={8} align="center">
          <VStack spacing={4}>
            <Text fontSize="lg" fontWeight="bold">
              Created by Daniel Ohiosumua
            </Text>
            <Text color={textColor} textAlign="center">
              Full Stack Developer | Open Source Enthusiast | Problem Solver
            </Text>
          </VStack>

          <HStack spacing={6}>
            <Link href="https://github.com/GZMaster" isExternal>
              <Icon as={FaGithub} w={6} h={6} color={textColor} _hover={{ color: 'blue.500' }} />
            </Link>
            <Link href="https://linkedin.com/in/daniel-ohiosumua" isExternal>
              <Icon as={FaLinkedin} w={6} h={6} color={textColor} _hover={{ color: 'blue.500' }} />
            </Link>
            <Link href="https://twitter.com/GZMaster" isExternal>
              <Icon as={FaTwitter} w={6} h={6} color={textColor} _hover={{ color: 'blue.500' }} />
            </Link>
          </HStack>

          <Divider />

          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align="center">
            <Text color={textColor} fontSize="sm">
              Pro Developer
            </Text>
            <Text color={textColor} fontSize="sm">•</Text>
            <Text color={textColor} fontSize="sm">
              Pair Extraordinaire
            </Text>
            <Text color={textColor} fontSize="sm">•</Text>
            <Text color={textColor} fontSize="sm">
              Pull Shark x3
            </Text>
            <Text color={textColor} fontSize="sm">•</Text>
            <Text color={textColor} fontSize="sm">
              Quickdraw
            </Text>
          </Stack>

          <Text color={textColor} fontSize="sm">
            © {new Date().getFullYear()} Investment Tools Suite. All rights reserved.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
} 