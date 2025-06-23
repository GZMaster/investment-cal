import {
  Box,
  VStack,
  Heading,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface TabPanelProps {
  title?: string;
  children: ReactNode;
  stats?: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
  columns?: number;
  spacing?: number;
}

export function TabPanel({
  title,
  children,
  stats,
  columns = 3,
  spacing = 4
}: TabPanelProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      p={{ base: 4, md: 6 }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <VStack spacing={4} align="stretch">
        {title && <Heading size="sm">{title}</Heading>}

        {stats && (
          <SimpleGrid columns={{ base: 1, md: columns }} spacing={spacing}>
            {stats.map((stat, index) => (
              <Box key={`stat-${stat.label}-${index}`} textAlign="center">
                <Box fontSize="sm" color="gray.500" mb={1}>
                  {stat.label}
                </Box>
                <Box fontSize="lg" fontWeight="bold" color={stat.color}>
                  {stat.value}
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}

        {children}
      </VStack>
    </Box>
  );
} 