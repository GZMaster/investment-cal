import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Switch,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import type { CryptoAlert, CryptoAsset } from '../types/crypto';

interface CryptoAlertFormProps {
  onSave: (alert: Omit<CryptoAlert, 'id'>) => void;
  onCancel: () => void;
  initialData?: Partial<CryptoAlert>;
  assets: CryptoAsset[];
}

export function CryptoAlertForm({ onSave, onCancel, initialData, assets }: CryptoAlertFormProps) {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'price',
    assetId: initialData?.assetId || '',
    condition: initialData?.condition || 'above',
    value: initialData?.value || 0,
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const alertSummaryBg = useColorModeValue('blue.50', 'blue.900');
  const portfolioAlertBg = useColorModeValue('purple.50', 'purple.900');

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.type === 'price' && !formData.assetId) {
      newErrors.assetId = 'Asset is required for price alerts';
    }

    if (formData.value <= 0) {
      newErrors.value = 'Value must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const alert: Omit<CryptoAlert, 'id'> = {
      type: formData.type as any,
      assetId: formData.assetId || undefined,
      condition: formData.condition as any,
      value: formData.value,
      isActive: formData.isActive,
      createdAt: new Date(),
    };

    onSave(alert);
  };

  const getAlertTypeDescription = (type: string) => {
    switch (type) {
      case 'price':
        return 'Get notified when an asset reaches a specific price';
      case 'rebalancing':
        return 'Get notified when portfolio allocation changes significantly';
      case 'staking':
        return 'Get notified about staking rewards and opportunities';
      case 'risk':
        return 'Get notified when portfolio risk level changes';
      default:
        return '';
    }
  };

  const getConditionDescription = (condition: string) => {
    switch (condition) {
      case 'above':
        return 'Trigger when value goes above the specified amount';
      case 'below':
        return 'Trigger when value goes below the specified amount';
      case 'change':
        return 'Trigger when value changes by the specified percentage';
      default:
        return '';
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
          {initialData ? 'Edit Alert' : 'Add New Alert'}
        </Text>

        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Alert Type</FormLabel>
            <Select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              <option value="price">Price Alert</option>
              <option value="rebalancing">Rebalancing Alert</option>
              <option value="staking">Staking Alert</option>
              <option value="risk">Risk Alert</option>
            </Select>
            <Text fontSize="sm" color={textColor} mt={1}>
              {getAlertTypeDescription(formData.type)}
            </Text>
          </FormControl>

          <FormControl isInvalid={!!errors.assetId}>
            <FormLabel>Asset (Optional)</FormLabel>
            <Select
              value={formData.assetId}
              onChange={(e) => handleInputChange('assetId', e.target.value)}
              placeholder="Select an asset (optional for portfolio alerts)"
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.symbol} - {asset.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.assetId}</FormErrorMessage>
          </FormControl>
        </HStack>

        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Condition</FormLabel>
            <Select
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
              <option value="change">Change by</option>
            </Select>
            <Text fontSize="sm" color={textColor} mt={1}>
              {getConditionDescription(formData.condition)}
            </Text>
          </FormControl>

          <FormControl isInvalid={!!errors.value}>
            <FormLabel>
              {formData.type === 'price' ? 'Price (USD)' :
                formData.type === 'rebalancing' ? 'Change (%)' :
                  formData.type === 'staking' ? 'Rewards (USD)' :
                    'Risk Score'}
            </FormLabel>
            <NumberInput
              value={formData.value}
              onChange={(value) => handleInputChange('value', Number.parseFloat(value) || 0)}
              min={0}
              precision={formData.type === 'price' ? 2 : 1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.value}</FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="is-active" mb="0">
            Active Alert
          </FormLabel>
          <Switch
            id="is-active"
            isChecked={formData.isActive}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
            colorScheme="green"
          />
        </FormControl>

        {selectedAsset && formData.type === 'price' && (
          <Box p={4} bg={alertSummaryBg} borderRadius="md">
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="blue.600">
              Alert Summary
            </Text>
            <VStack align="start" spacing={1}>
              <Text fontSize="sm">
                Asset: {selectedAsset.symbol} - {selectedAsset.name}
              </Text>
              <Text fontSize="sm">
                Current Price: ${selectedAsset.currentPrice.toFixed(2)}
              </Text>
              <Text fontSize="sm">
                Alert: {formData.condition === 'above' ? 'Above' : 'Below'} ${formData.value.toFixed(2)}
              </Text>
              <Text fontSize="sm">
                Status: {formData.isActive ? 'Active' : 'Inactive'}
              </Text>
            </VStack>
          </Box>
        )}

        {formData.type !== 'price' && (
          <Box p={4} bg={portfolioAlertBg} borderRadius="md">
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="purple.600">
              Portfolio Alert
            </Text>
            <VStack align="start" spacing={1}>
              <Text fontSize="sm">
                Type: {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Alert
              </Text>
              <Text fontSize="sm">
                Condition: {formData.condition === 'above' ? 'Above' : formData.condition === 'below' ? 'Below' : 'Change by'} {formData.value}
                {formData.type === 'rebalancing' ? '%' : formData.type === 'staking' ? ' USD' : ''}
              </Text>
              <Text fontSize="sm">
                Status: {formData.isActive ? 'Active' : 'Inactive'}
              </Text>
            </VStack>
          </Box>
        )}

        <HStack justify="flex-end" spacing={4}>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit} colorScheme="blue" leftIcon={<FaBell />}>
            {initialData ? 'Update Alert' : 'Add Alert'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
} 