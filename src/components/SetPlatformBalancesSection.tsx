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
import { type PlatformBalance } from '../types/budget';
import { PlatformManager } from './PlatformManager';
import { usePlatforms } from '../hooks/usePlatforms';

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
  getPlatformName: (id: string) => string;
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
  getPlatformName,
}: SetPlatformBalancesSectionProps) {
  const { platforms, addPlatform, updatePlatform, deletePlatform } = usePlatforms();

  return (
    <Card>
      <CardBody>
        <Heading size="md" mb={4}>Set Platform Balances (Start of Month)</Heading>

        <PlatformManager
          platforms={platforms}
          onAddPlatform={addPlatform}
          onUpdatePlatform={updatePlatform}
          onDeletePlatform={deletePlatform}
        />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={4}>
          {(isEditing ? (pendingBalances ?? balances) : balances)
            .filter(balance => platforms.some(p => p.id === balance.platformId))
            .map((balance, idx) => {
              const platform = platforms.find(p => p.id === balance.platformId);
              const currency = platform?.currency || 'NGN';
              const isRiseVest = balance.platformId === 'risevest';
              const tooltipLabel = `Current balance for ${getPlatformName(balance.platformId)}: ${currency === 'USD' ? `${balance.currentBalance.toLocaleString(undefined, { maximumFractionDigits: 8 })} USD` : `${balance.currentBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} NGN`}`;
              return (
                <FormControl key={balance.platformId}>
                  <FormLabel>{getPlatformName(balance.platformId)} ({currency})</FormLabel>
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
                          const arr = prev ? [...prev] : balances.map(b => ({ ...b }));
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
                  <Tooltip label={`Debt balance for ${getPlatformName(balance.platformId)}: ${currency === 'USD' ? `${balance.debtBalance.toLocaleString(undefined, { maximumFractionDigits: 8 })} USD` : `${balance.debtBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} NGN`}`} placement="top" hasArrow>
                    <NumberInput
                      value={balance.debtBalance}
                      min={0}
                      precision={currency === 'USD' ? 2 : 0}
                      step={currency === 'USD' ? 0.01 : 1000}
                      isDisabled={!isEditing}
                      onChange={(_, value) => {
                        if (!isEditing) return;
                        setPendingBalances(prev => {
                          const arr = prev ? [...prev] : balances.map(b => ({ ...b }));
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
                  {isRiseVest && !isEditing && (
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
              setPendingBalances(balances.map(b => ({ ...b })));
            }}>
              Edit Balances
            </Button>
          )}
        </HStack>
      </CardBody>
    </Card>
  );
} 