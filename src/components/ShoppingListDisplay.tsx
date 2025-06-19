import {
  Badge,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  HStack,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { FaCheck, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import type { ShoppingItem } from '../types/shopping';

export function ShoppingListDisplay() {
  const items = useStoreState((state: any) => state.items);
  const removeItem = useStoreActions((actions: any) => actions.removeItem);
  const toggleItem = useStoreActions((actions: any) => actions.toggleItem);
  const clearCompleted = useStoreActions((actions: any) => actions.clearCompleted);
  const currency = useStoreState((state: any) => state.currency);

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { isOpen: showCompleted, onToggle: toggleShowCompleted } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const completedBgColor = useColorModeValue('gray.50', 'gray.700');

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'USD' ? '$' : '₦';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleToggleItem = (itemId: string) => {
    toggleItem(itemId);
  };

  const handleClearCompleted = () => {
    clearCompleted();
  };

  const pendingItems = items.filter((item: ShoppingItem) => !item.isCompleted);
  const completedItems = items.filter((item: ShoppingItem) => item.isCompleted);

  const totalPending = pendingItems.reduce((sum: number, item: ShoppingItem) => sum + item.price, 0);
  const totalCompleted = completedItems.reduce((sum: number, item: ShoppingItem) => sum + item.price, 0);

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
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold">
            Shopping List ({items.length} items)
          </Text>
          {completedItems.length > 0 && (
            <Button size="sm" colorScheme="red" variant="outline" onClick={handleClearCompleted}>
              Clear Completed
            </Button>
          )}
        </HStack>

        {/* Pending Items */}
        <VStack spacing={3} align="stretch">
          <Text fontSize="lg" fontWeight="semibold" color="blue.500">
            Pending ({pendingItems.length}) - {formatCurrency(totalPending)}
          </Text>
          {pendingItems.map((item: ShoppingItem) => (
            <Box
              key={item.id}
              p={4}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="md"
              bg={bgColor}
            >
              <HStack justify="space-between" align="start">
                <HStack spacing={3} align="start" flex={1}>
                  <Checkbox
                    isChecked={item.isCompleted}
                    onChange={() => handleToggleItem(item.id)}
                    colorScheme="green"
                  />
                  <VStack align="start" spacing={1} flex={1}>
                    <HStack spacing={2}>
                      <Text fontWeight="semibold" textDecoration={item.isCompleted ? 'line-through' : 'none'}>
                        {item.name}
                      </Text>
                      <Badge colorScheme={getPriorityColor(item.priority)} size="sm">
                        {item.priority}
                      </Badge>
                      {item.category && (
                        <Badge colorScheme="blue" size="sm">
                          {item.category}
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="lg" fontWeight="bold" color="green.500">
                      {formatCurrency(item.price)}
                    </Text>
                    {item.notes && (
                      <Collapse in={expandedItems.has(item.id)}>
                        <Text fontSize="sm" color="gray.600" mt={2}>
                          {item.notes}
                        </Text>
                      </Collapse>
                    )}
                  </VStack>
                </HStack>
                <HStack spacing={1}>
                  {item.notes && (
                    <IconButton
                      size="sm"
                      icon={<Icon as={expandedItems.has(item.id) ? FaChevronUp : FaChevronDown} />}
                      onClick={() => toggleExpanded(item.id)}
                      aria-label="Toggle notes"
                      variant="ghost"
                    />
                  )}
                  <IconButton
                    size="sm"
                    icon={<Icon as={FaCheck} />}
                    onClick={() => handleToggleItem(item.id)}
                    aria-label="Mark as completed"
                    colorScheme="green"
                    variant="ghost"
                  />
                  <IconButton
                    size="sm"
                    icon={<Icon as={FaTrash} />}
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label="Remove item"
                    colorScheme="red"
                    variant="ghost"
                  />
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <>
            <Divider />
            <VStack spacing={3} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="semibold" color="green.500">
                  Completed ({completedItems.length}) - {formatCurrency(totalCompleted)}
                </Text>
                <Button size="sm" variant="ghost" onClick={toggleShowCompleted}>
                  {showCompleted ? 'Hide' : 'Show'} Completed
                </Button>
              </HStack>
              <Collapse in={showCompleted}>
                <VStack spacing={3} align="stretch">
                  {completedItems.map((item: ShoppingItem) => (
                    <Box
                      key={item.id}
                      p={4}
                      border="1px solid"
                      borderColor={borderColor}
                      borderRadius="md"
                      bg={completedBgColor}
                      opacity={0.7}
                    >
                      <HStack justify="space-between" align="start">
                        <HStack spacing={3} align="start" flex={1}>
                          <Checkbox
                            isChecked={item.isCompleted}
                            onChange={() => handleToggleItem(item.id)}
                            colorScheme="green"
                          />
                          <VStack align="start" spacing={1} flex={1}>
                            <HStack spacing={2}>
                              <Text fontWeight="semibold" textDecoration="line-through">
                                {item.name}
                              </Text>
                              <Badge colorScheme={getPriorityColor(item.priority)} size="sm">
                                {item.priority}
                              </Badge>
                              {item.category && (
                                <Badge colorScheme="blue" size="sm">
                                  {item.category}
                                </Badge>
                              )}
                            </HStack>
                            <Text fontSize="lg" fontWeight="bold" color="green.500">
                              {formatCurrency(item.price)}
                            </Text>
                            {item.completedAt && (
                              <Text fontSize="xs" color="gray.500">
                                Completed: {new Date(item.completedAt).toLocaleDateString()}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                        <IconButton
                          size="sm"
                          icon={<Icon as={FaTrash} />}
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="Remove item"
                          colorScheme="red"
                          variant="ghost"
                        />
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Collapse>
            </VStack>
          </>
        )}

        {items.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text fontSize="lg" color="gray.500">
              No items in your shopping list yet. Add some items to get started!
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
} 