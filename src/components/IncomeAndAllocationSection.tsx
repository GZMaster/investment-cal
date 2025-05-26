import type React from 'react';
import {
  Card,
  CardBody,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  Button,
  HStack,
  Box,
} from '@chakra-ui/react';
import { PLATFORMS, type WeeklyAllocation } from '../types/budget';

interface IncomeAndAllocationSectionProps {
  weeklyIncome: number;
  setWeeklyIncome: (value: number) => void;
  weeklyAllocation: WeeklyAllocation;
  setWeeklyAllocation: React.Dispatch<React.SetStateAction<WeeklyAllocation>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => void;
}

export function IncomeAndAllocationSection({
  weeklyIncome,
  setWeeklyIncome,
  weeklyAllocation,
  setWeeklyAllocation,
  isEditing,
  setIsEditing,
  handleSave,
}: IncomeAndAllocationSectionProps) {
  return (
    <Card>
      <CardBody>
        <VStack spacing={6}>
          <FormControl>
            <FormLabel>Weekly Income (₦)</FormLabel>
            <NumberInput
              value={weeklyIncome}
              onChange={(_, value) => setWeeklyIncome(value)}
              min={0}
              isDisabled={!isEditing}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <Heading size="md">Weekly Allocations</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
            {PLATFORMS.map((platform) => (
              <FormControl key={platform.id}>
                <FormLabel>
                  {platform.name} {platform.id === 'risevest' ? '(NGN input, converts to USD)' : `(${platform.currency})`}
                </FormLabel>
                <NumberInput
                  value={weeklyAllocation[platform.id as keyof WeeklyAllocation] || 0}
                  onChange={(_, value) => setWeeklyAllocation(prev => ({
                    ...prev,
                    [platform.id]: value
                  }))}
                  min={0}
                  isDisabled={!isEditing}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {platform.id === 'risevest' && (
                  <Box fontSize="sm" color="gray.500" mt={1}>
                    Enter amount in NGN. Conversion to USD will be shown in the table.
                  </Box>
                )}
              </FormControl>
            ))}
          </SimpleGrid>

          <HStack spacing={4}>
            {isEditing ? (
              <>
                <Button colorScheme="blue" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
                Edit Allocations
              </Button>
            )}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
} 