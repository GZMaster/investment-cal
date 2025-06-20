import {
  Box,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useCryptoStore } from '../hooks/useCryptoStore';

export function CryptoTransactions() {
  const { transactions } = useCryptoStore();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      p={6}
      boxShadow="xl"
      border="1px solid"
      borderColor={borderColor}
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Transaction History
        </Text>

        {transactions.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text color={textColor} fontSize="lg">
              No transactions recorded yet.
            </Text>
            <Text color={textColor} fontSize="sm" mt={2}>
              Your transaction history will appear here.
            </Text>
          </Box>
        ) : (
          <Text color={textColor}>
            {transactions.length} transactions found
          </Text>
        )}
      </VStack>
    </Box>
  );
} 