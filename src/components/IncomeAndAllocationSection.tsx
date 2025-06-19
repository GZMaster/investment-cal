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
} from '@chakra-ui/react';
import type { WeeklyAllocation } from '../types/budget';
import { usePlatforms } from '../hooks/usePlatforms';
import { useEffect } from 'react';

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
  const { platforms } = usePlatforms();

  // Update allocation when platforms change
  useEffect(() => {
    setWeeklyAllocation(prev => {
      const newAllocation = { ...prev };
      // Remove allocations for deleted platforms
      for (const key of Object.keys(newAllocation)) {
        if (!platforms.some(p => p.id === key)) {
          delete newAllocation[key];
        }
      }
      // Add allocations for new platforms
      for (const p of platforms) {
        if (!(p.id in newAllocation)) {
          newAllocation[p.id] = 0;
        }
      }
      return newAllocation;
    });
  }, [platforms, setWeeklyAllocation]);

  return (
    <Card>
      <CardBody>
        <Heading size="md" mb={4}>Income and Allocation</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel>Weekly Income (NGN)</FormLabel>
            <NumberInput
              value={weeklyIncome}
              onChange={(_, value) => setWeeklyIncome(value)}
              isDisabled={!isEditing}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <VStack align="stretch" spacing={4}>
            {platforms.map(platform => (
              <FormControl key={platform.id}>
                <FormLabel>
                  {platform.name} ({platform.currency})
                </FormLabel>
                <NumberInput
                  value={weeklyAllocation[platform.id] || 0}
                  onChange={(_, value) => {
                    setWeeklyAllocation(prev => ({
                      ...prev,
                      [platform.id]: value
                    }));
                  }}
                  isDisabled={!isEditing}
                  min={0}
                  step={platform.currency === 'USD' ? 0.01 : 1000}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            ))}
          </VStack>
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
      </CardBody>
    </Card>
  );
} 