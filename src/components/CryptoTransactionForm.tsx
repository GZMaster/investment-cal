import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Textarea,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import type { CryptoTransaction, CryptoAsset } from '../types/crypto';

interface CryptoTransactionFormProps {
  onSave: (transaction: Omit<CryptoTransaction, 'id'>) => void;
  onCancel: () => void;
  initialData?: Partial<CryptoTransaction>;
  assets: CryptoAsset[];
}

export function CryptoTransactionForm({ onSave, onCancel, initialData, assets }: CryptoTransactionFormProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const summaryBgColor = useColorModeValue('gray.50', 'gray.700');

  const [formData, setFormData] = useState({
    assetId: initialData?.assetId || '',
    type: initialData?.type || 'buy',
    quantity: initialData?.quantity || 0,
    price: initialData?.price || 0,
    fee: initialData?.fee || 0,
    exchange: initialData?.exchange || '',
    walletAddress: initialData?.walletAddress || '',
    notes: initialData?.notes || '',
    date: initialData?.date ? initialData.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.assetId) {
      newErrors.assetId = 'Asset is required';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.fee < 0) {
      newErrors.fee = 'Fee cannot be negative';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const transaction: Omit<CryptoTransaction, 'id'> = {
      assetId: formData.assetId,
      type: formData.type as any,
      quantity: formData.quantity,
      price: formData.price,
      fee: formData.fee,
      date: new Date(formData.date),
      exchange: formData.exchange || undefined,
      walletAddress: formData.walletAddress || undefined,
      notes: formData.notes || undefined,
    };

    onSave(transaction);
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'buy': return 'green';
      case 'sell': return 'red';
      case 'stake': return 'blue';
      case 'unstake': return 'orange';
      case 'defi-deposit': return 'purple';
      case 'defi-withdraw': return 'pink';
      case 'transfer': return 'gray';
      default: return 'gray';
    }
  };

  const selectedAsset = assets.find(asset => asset.id === formData.assetId);

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      p={6}
      boxShadow="xl"
      border="1px solid"
      borderColor={borderColor}
    >
      <VStack spacing={6} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          {initialData ? 'Edit Transaction' : 'Add New Transaction'}
        </Text>

        <HStack spacing={4}>
          <FormControl isInvalid={!!errors.assetId}>
            <FormLabel>Asset</FormLabel>
            <Select
              value={formData.assetId}
              onChange={(e) => handleInputChange('assetId', e.target.value)}
              placeholder="Select an asset"
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.symbol} - {asset.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.assetId}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Transaction Type</FormLabel>
            <Select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="stake">Stake</option>
              <option value="unstake">Unstake</option>
              <option value="defi-deposit">DeFi Deposit</option>
              <option value="defi-withdraw">DeFi Withdraw</option>
              <option value="transfer">Transfer</option>
            </Select>
          </FormControl>
        </HStack>

        <HStack spacing={4}>
          <FormControl isInvalid={!!errors.quantity}>
            <FormLabel>Quantity</FormLabel>
            <NumberInput
              value={formData.quantity}
              onChange={(value) => handleInputChange('quantity', Number.parseFloat(value) || 0)}
              min={0}
              precision={8}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.quantity}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.price}>
            <FormLabel>Price (USD)</FormLabel>
            <NumberInput
              value={formData.price}
              onChange={(value) => handleInputChange('price', Number.parseFloat(value) || 0)}
              min={0}
              precision={2}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.price}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.fee}>
            <FormLabel>Fee (USD)</FormLabel>
            <NumberInput
              value={formData.fee}
              onChange={(value) => handleInputChange('fee', Number.parseFloat(value) || 0)}
              min={0}
              precision={2}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.fee}</FormErrorMessage>
          </FormControl>
        </HStack>

        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Exchange/Platform</FormLabel>
            <Input
              value={formData.exchange}
              onChange={(e) => handleInputChange('exchange', e.target.value)}
              placeholder="e.g., Coinbase, Binance, Lido"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Wallet Address</FormLabel>
            <Input
              value={formData.walletAddress}
              onChange={(e) => handleInputChange('walletAddress', e.target.value)}
              placeholder="Optional wallet address"
            />
          </FormControl>

          <FormControl isInvalid={!!errors.date}>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
            <FormErrorMessage>{errors.date}</FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel>Notes</FormLabel>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Optional notes about this transaction"
            rows={3}
          />
        </FormControl>

        {selectedAsset && (
          <Box p={4} bg={summaryBgColor} borderRadius="md">
            <Text fontSize="sm" fontWeight="semibold" mb={2}>
              Transaction Summary
            </Text>
            <VStack align="start" spacing={1}>
              <Text fontSize="sm">
                Asset: {selectedAsset.symbol} - {selectedAsset.name}
              </Text>
              <Text fontSize="sm">
                Type: <span style={{ color: `var(--chakra-colors-${getTransactionTypeColor(formData.type)}-500)` }}>
                  {formData.type.toUpperCase()}
                </span>
              </Text>
              <Text fontSize="sm">
                Total Value: ${(formData.quantity * formData.price).toFixed(2)}
              </Text>
              {formData.fee > 0 && (
                <Text fontSize="sm">
                  Total with Fee: ${(formData.quantity * formData.price + formData.fee).toFixed(2)}
                </Text>
              )}
            </VStack>
          </Box>
        )}

        <HStack justify="flex-end" spacing={4}>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit} colorScheme="blue" leftIcon={<FaPlus />}>
            {initialData ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
} 