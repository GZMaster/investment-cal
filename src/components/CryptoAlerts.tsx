import {
  Box,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useCryptoStore } from '../hooks/useCryptoStore';

export function CryptoAlerts() {
  const { activeAlerts } = useCryptoStore();

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
          Alerts
        </Text>

        {activeAlerts.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text color={textColor} fontSize="lg">
              No active alerts.
            </Text>
            <Text color={textColor} fontSize="sm" mt={2}>
              Set up price alerts and notifications for your portfolio.
            </Text>
          </Box>
        ) : (
          <Text color={textColor}>
            {activeAlerts.length} active alerts
          </Text>
        )}
      </VStack>
    </Box>
  );
} 