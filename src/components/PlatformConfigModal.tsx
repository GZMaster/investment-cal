import {
  Button,
  VStack,
  HStack,
  Text,
  useToast,
  Divider,
  Heading,
  Box,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { usePlatformStore } from '../hooks/usePlatformStore';
import type { PlatformConfig } from '../types/platform';
import { Modal, FormField } from './ui';

interface PlatformConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlatformConfigModal({ isOpen, onClose }: PlatformConfigModalProps) {
  const { settings, updateSettings, setConfigured } = usePlatformStore();
  const toast = useToast();

  const [formData, setFormData] = useState({
    primarySavingsPlatform: {
      id: 'piggyvest',
      name: 'PiggyVest',
      type: 'savings' as const,
      currency: 'NGN' as const,
      description: 'Primary savings platform',
    },
    primaryInvestmentPlatform: {
      id: 'risevest',
      name: 'RiseVest',
      type: 'investment' as const,
      currency: 'USD' as const,
      description: 'Primary investment platform',
    },
    defaultCurrency: 'NGN' as const,
    exchangeRate: 1650,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        primarySavingsPlatform: settings.primarySavingsPlatform,
        primaryInvestmentPlatform: settings.primaryInvestmentPlatform,
        defaultCurrency: settings.defaultCurrency,
        exchangeRate: settings.exchangeRate,
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings(formData);
    setConfigured(true);

    toast({
      title: 'Configuration Saved',
      description: 'Your platform settings have been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    onClose();
  };

  const updatePlatform = (platformType: 'primarySavingsPlatform' | 'primaryInvestmentPlatform', field: keyof PlatformConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      [platformType]: {
        ...prev[platformType],
        [field]: value,
      },
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Your Platforms"
      size="lg"
      showFooter
      onSave={handleSave}
      saveText="Save Configuration"
      cancelText="Cancel"
    >
      <VStack spacing={6} align="stretch">
        <Text color="gray.600">
          Customize your platform names and settings to match your investment strategy.
        </Text>

        <Box>
          <Heading size="md" mb={4}>Primary Savings Platform</Heading>
          <VStack spacing={4}>
            <FormField
              type="text"
              label="Platform Name"
              value={formData.primarySavingsPlatform.name}
              onChange={(value) => updatePlatform('primarySavingsPlatform', 'name', value)}
              placeholder="e.g., PiggyVest, Cowrywise"
            />
            <FormField
              type="select"
              label="Currency"
              value={formData.primarySavingsPlatform.currency}
              onChange={(value) => updatePlatform('primarySavingsPlatform', 'currency', value)}
              options={[
                { value: 'NGN', label: 'Nigerian Naira (NGN)' },
                { value: 'USD', label: 'US Dollar (USD)' },
              ]}
            />
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>Primary Investment Platform</Heading>
          <VStack spacing={4}>
            <FormField
              type="text"
              label="Platform Name"
              value={formData.primaryInvestmentPlatform.name}
              onChange={(value) => updatePlatform('primaryInvestmentPlatform', 'name', value)}
              placeholder="e.g., RiseVest, Bamboo"
            />
            <FormField
              type="select"
              label="Currency"
              value={formData.primaryInvestmentPlatform.currency}
              onChange={(value) => updatePlatform('primaryInvestmentPlatform', 'currency', value)}
              options={[
                { value: 'NGN', label: 'Nigerian Naira (NGN)' },
                { value: 'USD', label: 'US Dollar (USD)' },
              ]}
            />
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>Global Settings</Heading>
          <VStack spacing={4}>
            <FormField
              type="select"
              label="Default Currency"
              value={formData.defaultCurrency}
              onChange={(value) => setFormData(prev => ({ ...prev, defaultCurrency: value as 'NGN' }))}
              options={[
                { value: 'NGN', label: 'Nigerian Naira (NGN)' },
                { value: 'USD', label: 'US Dollar (USD)' },
              ]}
            />
            <FormField
              type="number"
              label="Exchange Rate (NGN/USD)"
              value={formData.exchangeRate}
              onChange={(value) => setFormData(prev => ({ ...prev, exchangeRate: value }))}
              placeholder="1650"
              min={0}
              step={10}
            />
          </VStack>
        </Box>
      </VStack>
    </Modal>
  );
} 