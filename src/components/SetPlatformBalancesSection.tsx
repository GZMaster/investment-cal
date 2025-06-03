import type React from 'react';
import {
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  FormControl,
  FormLabel,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Button,
  Box,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { type PlatformBalance } from '../types/budget';
import { PlatformManager } from './PlatformManager';
import { usePlatforms } from '../hooks/usePlatforms';

const MotionCard = motion(Card);

interface SetPlatformBalancesSectionProps {
  balances: PlatformBalance[];
  isEditing: boolean;
  pendingBalances: PlatformBalance[] | null;
  setPendingBalances: React.Dispatch<React.SetStateAction<PlatformBalance[] | null>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (pending: PlatformBalance[] | null) => void;
  isRateLoading: boolean;
  rateError: unknown;
  usdToNgn?: number;
}

export function SetPlatformBalancesSection({
  balances,
  isEditing,
  pendingBalances,
  setPendingBalances,
  setIsEditing,
  onSave,
  isRateLoading,
  rateError,
  usdToNgn,
}: SetPlatformBalancesSectionProps) {
  const { platforms, addPlatform, updatePlatform, deletePlatform } = usePlatforms();

  // Ensure balances exist for all platforms
  const currentBalances = platforms.map(platform => {
    const existingBalance = balances.find(b => b.platformId === platform.id);
    return existingBalance || {
      platformId: platform.id,
      currentBalance: 0,
      expectedBalance: 0,
      debtBalance: 0,
      expectedDebtBalance: 0,
    };
  });

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      mb={6}
    >
      <CardBody>
        <Heading size="md" mb={4}>Set Platform Balances (Start of Month)</Heading>
        <PlatformManager
          platforms={platforms}
          onAddPlatform={addPlatform}
          onUpdatePlatform={updatePlatform}
          onDeletePlatform={deletePlatform}
        />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={4}>
          {(isEditing ? (pendingBalances ?? currentBalances) : currentBalances).map((balance, idx) => {
            const platform = platforms.find(p => p.id === balance.platformId);
            if (!platform) return null;

            const currency = platform.currency;
            const isUsdPlatform = currency === 'USD';
            const tooltipLabel = `Current balance for ${platform.name}: ${currency === 'USD' ? `${balance.currentBalance.toLocaleString(undefined, { maximumFractionDigits: 8 })} USD` : `${balance.currentBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} NGN`}`;

            return (
              <FormControl key={balance.platformId}>
                <FormLabel>{platform.name} ({currency})</FormLabel>
                <FormLabel fontSize="sm">Current Balance</FormLabel>
                <Tooltip label={tooltipLabel} placement="top" hasArrow>
                  <NumberInput
                    value={balance.currentBalance}
                    min={0}
                    precision={currency === 'USD' ? 2 : 0}
                    step={currency === 'USD' ? 0.01 : 1000}
                    isDisabled={!isEditing}
                    onChange={(_, value) => {
                      if (!isEditing) return;
                      setPendingBalances(prev => {
                        const arr = prev ? [...prev] : currentBalances.map(b => ({ ...b }));
                        arr[idx].currentBalance = value;
                        return arr;
                      });
                    }}
                    size="sm"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Tooltip>
                <FormLabel fontSize="sm" mt={2}>Debt Balance (if any)</FormLabel>
                <Tooltip label={`Debt balance for ${platform.name}: ${currency === 'USD' ? `${balance.debtBalance.toLocaleString(undefined, { maximumFractionDigits: 8 })} USD` : `${balance.debtBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} NGN`}`} placement="top" hasArrow>
                  <NumberInput
                    value={balance.debtBalance}
                    min={0}
                    precision={currency === 'USD' ? 2 : 0}
                    step={currency === 'USD' ? 0.01 : 1000}
                    isDisabled={!isEditing}
                    onChange={(_, value) => {
                      if (!isEditing) return;
                      setPendingBalances(prev => {
                        const arr = prev ? [...prev] : currentBalances.map(b => ({ ...b }));
                        arr[idx].debtBalance = value;
                        return arr;
                      });
                    }}
                    size="sm"
                    mt={2}
                  >
                    <NumberInputField placeholder="Debt Balance (if any)" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Tooltip>
                {isUsdPlatform && !isEditing && (
                  <Box fontSize="sm" color="gray.500">
                    {isRateLoading && ' (Loading NGN...)'}
                    {(rateError as string) && ' (Rate error)'}
                    {usdToNgn &&
                      ` ≈ ₦${(balance.currentBalance * usdToNgn).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    }
                  </Box>
                )}
              </FormControl>
            );
          })}
        </SimpleGrid>
        <HStack spacing={4}>
          {isEditing ? (
            <>
              <Button colorScheme="blue" onClick={() => onSave(pendingBalances)}>
                Save Balances
              </Button>
              <Button variant="ghost" onClick={() => {
                setIsEditing(false);
                setPendingBalances(null);
              }}>
                Cancel
              </Button>
            </>
          ) : (
            <Button colorScheme="blue" onClick={() => {
              setIsEditing(true);
              setPendingBalances(currentBalances.map(b => ({ ...b })));
            }}>
              Edit Balances
            </Button>
          )}
        </HStack>
      </CardBody>
    </MotionCard>
  );
} 