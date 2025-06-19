import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  useColorModeValue,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useShoppingStore } from '../hooks/useShoppingStore';

export function ShoppingListForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    currency: 'NGN' as 'NGN' | 'USD',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    notes: '',
  });

  const { addItem, categories, addCategory } = useShoppingStore();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Item name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.price <= 0) {
      toast({
        title: 'Error',
        description: 'Price must be greater than 0',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Add new category if it doesn't exist
    if (formData.category && !categories.includes(formData.category)) {
      addCategory(formData.category);
    }

    addItem({
      name: formData.name.trim(),
      price: formData.price,
      currency: formData.currency,
      category: formData.category || undefined,
      priority: formData.priority,
      notes: formData.notes.trim() || undefined,
    });

    // Reset form
    setFormData({
      name: '',
      price: 0,
      currency: 'NGN',
      category: '',
      priority: 'medium',
      notes: '',
    });

    toast({
      title: 'Success',
      description: 'Item added to shopping list',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Item Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter item name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Price</FormLabel>
              <NumberInput
                value={formData.price}
                onChange={(_, value) => handleInputChange('price', value)}
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
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value as 'NGN' | 'USD')}
              >
                <option value="NGN">NGN (₦)</option>
                <option value="USD">USD ($)</option>
              </Select>
            </FormControl>
          </HStack>

          <HStack spacing={4}>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Select category"
              >
                {categories.map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Priority</FormLabel>
              <Select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as 'low' | 'medium' | 'high')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </FormControl>
          </HStack>

          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" size="lg">
            Add Item
          </Button>
        </VStack>
      </form>
    </Box>
  );
} 