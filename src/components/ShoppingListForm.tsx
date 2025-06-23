import {
  Box,
  Button,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useShoppingStore } from '../hooks/useShoppingStore';
import { FormField } from './ui';

export function ShoppingListForm() {
  const { addItem, categories } = useShoppingStore();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    currency: 'NGN' as 'NGN' | 'USD',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    notes: '',
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.price > 0) {
      addItem(formData);
      setFormData({
        name: '',
        price: 0,
        currency: 'NGN',
        category: '',
        priority: 'medium',
        notes: '',
      });
    }
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
            <FormField
              type="text"
              label="Item Name"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              placeholder="Enter item name"
              isRequired
            />

            <FormField
              type="number"
              label="Price"
              value={formData.price}
              onChange={(value) => handleInputChange('price', value)}
              min={0}
              precision={2}
              isRequired
            />

            <FormField
              type="select"
              label="Currency"
              value={formData.currency}
              onChange={(value) => handleInputChange('currency', value)}
              options={[
                { value: 'NGN', label: 'NGN (₦)' },
                { value: 'USD', label: 'USD ($)' },
              ]}
            />
          </HStack>

          <HStack spacing={4}>
            <FormField
              type="select"
              label="Category"
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              options={categories.map((category: string) => ({
                value: category,
                label: category,
              }))}
              placeholder="Select category"
            />

            <FormField
              type="select"
              label="Priority"
              value={formData.priority}
              onChange={(value) => handleInputChange('priority', value)}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
            />
          </HStack>

          <FormField
            type="textarea"
            label="Notes"
            value={formData.notes}
            onChange={(value) => handleInputChange('notes', value)}
            placeholder="Add any additional notes..."
            rows={3}
          />

          <Button type="submit" colorScheme="blue" size="lg">
            Add Item
          </Button>
        </VStack>
      </form>
    </Box>
  );
} 