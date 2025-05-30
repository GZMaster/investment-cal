import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  HStack,
  Text,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import type { Platform } from '../types/budget';

interface PlatformManagerProps {
  platforms: Platform[];
  onAddPlatform: (platform: Platform) => void;
  onUpdatePlatform: (platform: Platform) => void;
  onDeletePlatform: (platformId: string) => void;
}

export function PlatformManager({
  platforms,
  onAddPlatform,
  onUpdatePlatform,
  onDeletePlatform,
}: PlatformManagerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const platform: Platform = {
      id: editingPlatform?.id || formData.get('name')?.toString().toLowerCase().replace(/\s+/g, '-') || '',
      name: formData.get('name')?.toString() || '',
      type: formData.get('type') as Platform['type'],
      currency: formData.get('currency') as Platform['currency'],
    };

    if (editingPlatform) {
      onUpdatePlatform(platform);
      toast({
        title: 'Platform updated',
        status: 'success',
        duration: 3000,
      });
    } else {
      onAddPlatform(platform);
      toast({
        title: 'Platform added',
        status: 'success',
        duration: 3000,
      });
    }

    onClose();
    setEditingPlatform(null);
  };

  const handleEdit = (platform: Platform) => {
    setEditingPlatform(platform);
    onOpen();
  };

  return (
    <Box mb={6}>
      <HStack justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="medium">Manage Platforms</Text>
        <Button colorScheme="blue" onClick={onOpen}>
          Add New Platform
        </Button>
      </HStack>

      <VStack spacing={2} align="stretch">
        {platforms.map((platform) => (
          <HStack
            key={platform.id}
            p={3}
            bg="white"
            borderRadius="md"
            shadow="sm"
            justify="space-between"
          >
            <Box>
              <Text fontWeight="medium">{platform.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {platform.type} • {platform.currency}
              </Text>
            </Box>
            <HStack>
              <IconButton
                aria-label="Edit platform"
                icon={<EditIcon />}
                size="sm"
                onClick={() => handleEdit(platform)}
              />
              <IconButton
                aria-label="Delete platform"
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                onClick={() => onDeletePlatform(platform.id)}
              />
            </HStack>
          </HStack>
        ))}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingPlatform ? 'Edit Platform' : 'Add New Platform'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Platform Name</FormLabel>
                  <Input
                    name="name"
                    defaultValue={editingPlatform?.name}
                    placeholder="Enter platform name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name="type"
                    defaultValue={editingPlatform?.type}
                  >
                    <option value="savings">Savings</option>
                    <option value="investment">Investment</option>
                    <option value="debt">Debt</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    name="currency"
                    defaultValue={editingPlatform?.currency}
                  >
                    <option value="NGN">Nigerian Naira (NGN)</option>
                    <option value="USD">US Dollar (USD)</option>
                  </Select>
                </FormControl>

                <Button type="submit" colorScheme="blue" width="full">
                  {editingPlatform ? 'Update Platform' : 'Add Platform'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 