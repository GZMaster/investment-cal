import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
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

interface PlatformConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlatformConfigModal({ isOpen, onClose }: PlatformConfigModalProps) {
  const toast = useToast();
  const { settings, updateSettings, setConfigured } = usePlatformStore();

  const [formData, setFormData] = useState({
    primarySavingsPlatform: {
      id: '',
      name: '',
      type: 'savings' as const,
      currency: 'NGN' as const,
      description: '',
    },
    primaryInvestmentPlatform: {
      id: '',
      name: '',
      type: 'investment' as const,
      currency: 'USD' as const,
      description: '',
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
    // Validate form data
    if (!formData.primarySavingsPlatform.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a name for your primary savings platform',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.primaryInvestmentPlatform.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a name for your primary investment platform',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.exchangeRate <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Exchange rate must be greater than 0',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Generate IDs if not provided
    const updatedData = {
      ...formData,
      primarySavingsPlatform: {
        ...formData.primarySavingsPlatform,
        id: formData.primarySavingsPlatform.id || formData.primarySavingsPlatform.name.toLowerCase().replace(/\s+/g, '-'),
      },
      primaryInvestmentPlatform: {
        ...formData.primaryInvestmentPlatform,
        id: formData.primaryInvestmentPlatform.id || formData.primaryInvestmentPlatform.name.toLowerCase().replace(/\s+/g, '-'),
      },
    };

    updateSettings(updatedData);
    setConfigured(true);

    toast({
      title: 'Settings Saved',
      description: 'Your platform configuration has been updated. The page will reload to apply changes.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    onClose();

    // Reload the page after a short delay to ensure all components refresh with new platform names
    setTimeout(() => {
      window.location.reload();
    }, 1500);
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Configure Your Platforms</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Text color="gray.600">
              Customize your platform names and settings to match your investment strategy.
            </Text>

            <Box>
              <Heading size="md" mb={4}>Primary Savings Platform</Heading>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Platform Name</FormLabel>
                  <Input
                    value={formData.primarySavingsPlatform.name}
                    onChange={(e) => updatePlatform('primarySavingsPlatform', 'name', e.target.value)}
                    placeholder="e.g., PiggyVest, Cowrywise"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    value={formData.primarySavingsPlatform.currency}
                    onChange={(e) => updatePlatform('primarySavingsPlatform', 'currency', e.target.value)}
                  >
                    <option value="NGN">Nigerian Naira (NGN)</option>
                    <option value="USD">US Dollar (USD)</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Description (Optional)</FormLabel>
                  <Input
                    value={formData.primarySavingsPlatform.description}
                    onChange={(e) => updatePlatform('primarySavingsPlatform', 'description', e.target.value)}
                    placeholder="Brief description of the platform"
                  />
                </FormControl>
              </VStack>
            </Box>

            <Divider />

            <Box>
              <Heading size="md" mb={4}>Primary Investment Platform</Heading>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Platform Name</FormLabel>
                  <Input
                    value={formData.primaryInvestmentPlatform.name}
                    onChange={(e) => updatePlatform('primaryInvestmentPlatform', 'name', e.target.value)}
                    placeholder="e.g., RiseVest, Bamboo"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    value={formData.primaryInvestmentPlatform.currency}
                    onChange={(e) => updatePlatform('primaryInvestmentPlatform', 'currency', e.target.value)}
                  >
                    <option value="NGN">Nigerian Naira (NGN)</option>
                    <option value="USD">US Dollar (USD)</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Description (Optional)</FormLabel>
                  <Input
                    value={formData.primaryInvestmentPlatform.description}
                    onChange={(e) => updatePlatform('primaryInvestmentPlatform', 'description', e.target.value)}
                    placeholder="Brief description of the platform"
                  />
                </FormControl>
              </VStack>
            </Box>

            <Divider />

            <Box>
              <Heading size="md" mb={4}>Global Settings</Heading>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Default Currency</FormLabel>
                  <Select
                    value={formData.defaultCurrency}
                    onChange={(e) => setFormData(prev => ({ ...prev, defaultCurrency: e.target.value as 'NGN' }))}
                  >
                    <option value="NGN">Nigerian Naira (NGN)</option>
                    <option value="USD">US Dollar (USD)</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Exchange Rate (NGN/USD)</FormLabel>
                  <Input
                    type="number"
                    value={formData.exchangeRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, exchangeRate: Number.parseFloat(e.target.value) || 0 }))}
                    placeholder="1650"
                  />
                </FormControl>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Save Configuration
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 