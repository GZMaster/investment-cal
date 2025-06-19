import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  VStack,
  useColorModeValue,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useShoppingStore } from '../hooks/useShoppingStore';

export function BudgetSettings() {
  const { totalBudget, currency, setTotalBudget, setCurrency } = useShoppingStore();

  const [budget, setBudget] = useState(totalBudget);
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [isEditing, setIsEditing] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();

  const handleSave = () => {
    setTotalBudget(budget);
    setCurrency(selectedCurrency);
    setIsEditing(false);
    toast({
      title: 'Budget Updated',
      description: 'Your budget settings have been saved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCancel = () => {
    setBudget(totalBudget);
    setSelectedCurrency(currency);
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    const symbol = selectedCurrency === 'USD' ? '$' : '₦';
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="xl"
      boxShadow="xl"
      border="1px solid"
      borderColor={borderColor}
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">
          Budget Settings
        </Text>

        {isEditing ? (
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Total Budget</FormLabel>
                <NumberInput
                  value={budget}
                  onChange={(_, value) => setBudget(value)}
                  min={0}
                  precision={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Currency</FormLabel>
                <Select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as 'NGN' | 'USD')}
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                </Select>
              </FormControl>
            </HStack>

            <HStack spacing={3}>
              <Button colorScheme="blue" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text>Total Budget: {formatCurrency(totalBudget)}</Text>
              <Text>Currency: {currency}</Text>
            </HStack>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Budget
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );
} 