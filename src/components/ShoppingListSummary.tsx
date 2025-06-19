import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Badge,
  HStack,
  VStack,
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useShoppingStore } from '../hooks/useShoppingStore';
import { FaTrash } from 'react-icons/fa';

export function ShoppingListSummary() {
  const { items, totalBudget, currency, clearAllData } = useShoppingStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const pendingBgColor = useColorModeValue('blue.50', 'blue.900');

  const totalItems = items.length;
  const completedItems = items.filter((item: any) => item.isCompleted).length;
  const pendingItems = totalItems - completedItems;
  const totalSpent = items
    .filter((item: any) => item.isCompleted)
    .reduce((sum: number, item: any) => sum + item.price, 0);
  const totalPending = items
    .filter((item: any) => !item.isCompleted)
    .reduce((sum: number, item: any) => sum + item.price, 0);
  const budgetRemaining = totalBudget - totalSpent;
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'USD' ? '$' : '₦';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const handleClearAllData = () => {
    clearAllData();
    onClose();
    toast({
      title: 'Data Cleared',
      description: 'All shopping list data has been reset',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Box
        bg={bgColor}
        p={6}
        borderRadius="xl"
        boxShadow="xl"
        border="1px solid"
        borderColor={borderColor}
      >
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold">
              Shopping List Summary
            </Text>
            {totalItems > 0 && (
              <Button
                leftIcon={<FaTrash />}
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={onOpen}
              >
                Clear All Data
              </Button>
            )}
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Stat>
              <StatLabel>Total Items</StatLabel>
              <StatNumber>{totalItems}</StatNumber>
              <StatHelpText>
                <HStack spacing={2}>
                  <Badge colorScheme="green">{completedItems} completed</Badge>
                  <Badge colorScheme="orange">{pendingItems} pending</Badge>
                </HStack>
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Total Budget</StatLabel>
              <StatNumber>{formatCurrency(totalBudget)}</StatNumber>
              <StatHelpText>Set budget limit</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Total Spent</StatLabel>
              <StatNumber color="green.500">{formatCurrency(totalSpent)}</StatNumber>
              <StatHelpText>
                {budgetUtilization.toFixed(1)}% of budget used
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Remaining Budget</StatLabel>
              <StatNumber color={budgetRemaining >= 0 ? 'blue.500' : 'red.500'}>
                {formatCurrency(Math.abs(budgetRemaining))}
              </StatNumber>
              <StatHelpText>
                {budgetRemaining >= 0 ? 'Available' : 'Over budget'}
              </StatHelpText>
            </Stat>
          </SimpleGrid>

          {totalPending > 0 && (
            <Box p={4} bg={pendingBgColor} borderRadius="md">
              <VStack align="start" spacing={2}>
                <Badge colorScheme="blue" fontSize="sm">
                  Pending Purchases
                </Badge>
                <Box fontSize="lg" fontWeight="semibold">
                  {formatCurrency(totalPending)} worth of items to buy
                </Box>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Clear All Data
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to clear all shopping list data? This action cannot be undone.
              All items, budget settings, and categories will be reset to default values.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleClearAllData} ml={3}>
                Clear All Data
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
} 