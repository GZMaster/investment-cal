import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Badge,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { FaPlus, FaEllipsisV, FaEdit, FaTrash, FaBell, FaEye } from 'react-icons/fa';
import { useCryptoStore } from '../hooks/useCryptoStore';
import { CryptoAlertForm } from './CryptoAlertForm';
import { useState } from 'react';
import type { CryptoAlert } from '../types/crypto';

export function CryptoAlerts() {
  const { alerts, addAlert, updateAlert, removeAlert, portfolio } = useCryptoStore();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const [selectedAlert, setSelectedAlert] = useState<CryptoAlert | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const alertItemBg = useColorModeValue('gray.50', 'gray.700');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'price': return 'blue';
      case 'rebalancing': return 'purple';
      case 'staking': return 'green';
      case 'risk': return 'red';
      default: return 'gray';
    }
  };

  const getConditionText = (condition: string, value: number, type: string) => {
    const unit = type === 'price' ? 'USD' : type === 'rebalancing' ? '%' : type === 'staking' ? 'USD' : '';
    switch (condition) {
      case 'above': return `Above ${value}${unit}`;
      case 'below': return `Below ${value}${unit}`;
      case 'change': return `Change by ${value}%`;
      default: return `${value}${unit}`;
    }
  };

  const getAssetName = (assetId?: string) => {
    if (!assetId) return 'Portfolio';
    const asset = portfolio.assets.find((a: any) => a.id === assetId);
    return asset ? `${asset.symbol} - ${asset.name}` : 'Unknown Asset';
  };

  const handleAddAlert = (alert: Omit<CryptoAlert, 'id'>) => {
    addAlert(alert);
    onFormClose();
  };

  const handleEditAlert = (alert: CryptoAlert) => {
    setSelectedAlert(alert);
    onEditOpen();
  };

  const handleUpdateAlert = (updates: Omit<CryptoAlert, 'id'>) => {
    if (selectedAlert) {
      updateAlert({ id: selectedAlert.id, updates });
      onEditClose();
      setSelectedAlert(null);
    }
  };

  const handleViewDetails = (alert: CryptoAlert) => {
    setSelectedAlert(alert);
    onDetailsOpen();
  };

  const handleRemoveAlert = (alertId: string) => {
    if (confirm('Are you sure you want to remove this alert?')) {
      removeAlert(alertId);
    }
  };

  const handleToggleAlert = (alert: CryptoAlert) => {
    updateAlert({ id: alert.id, updates: { isActive: !alert.isActive } });
  };

  const activeAlerts = alerts.filter((alert: CryptoAlert) => alert.isActive);
  const triggeredAlerts = alerts.filter((alert: CryptoAlert) => alert.triggeredAt);

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
        <HStack justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold">
            Alerts ({alerts.length})
          </Text>
          <Button
            leftIcon={<Icon as={FaPlus} />}
            colorScheme="blue"
            size="sm"
            onClick={onFormOpen}
          >
            Add Alert
          </Button>
        </HStack>

        {/* Alert Statistics */}
        <SimpleGrid columns={2} spacing={4}>
          <Stat>
            <StatLabel>Active Alerts</StatLabel>
            <StatNumber color="green.500">{activeAlerts.length}</StatNumber>
            <StatHelpText>Currently monitoring</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Triggered Alerts</StatLabel>
            <StatNumber color="orange.500">{triggeredAlerts.length}</StatNumber>
            <StatHelpText>Recently triggered</StatHelpText>
          </Stat>
        </SimpleGrid>

        {alerts.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text color={textColor} fontSize="lg">
              No alerts set up yet.
            </Text>
            <Text color={textColor} fontSize="sm" mt={2}>
              Set up price alerts and notifications for your portfolio.
            </Text>
          </Box>
        ) : (
          <VStack spacing={3} align="stretch">
            {alerts.map((alert: CryptoAlert) => (
              <Box
                key={alert.id}
                p={4}
                bg={alertItemBg}
                borderRadius="md"
                border="1px solid"
                borderColor={borderColor}
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={2} flex={1}>
                    <HStack spacing={2}>
                      <Badge colorScheme={getAlertTypeColor(alert.type)} variant="subtle">
                        {alert.type.toUpperCase()}
                      </Badge>
                      <Badge colorScheme={alert.isActive ? 'green' : 'gray'} variant="subtle">
                        {alert.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      {alert.triggeredAt && (
                        <Badge colorScheme="orange" variant="subtle">
                          Triggered
                        </Badge>
                      )}
                    </HStack>

                    <Text fontWeight="semibold">
                      {getAssetName(alert.assetId)}
                    </Text>

                    <Text fontSize="sm" color={textColor}>
                      {getConditionText(alert.condition, alert.value, alert.type)}
                    </Text>

                    <Text fontSize="xs" color={textColor}>
                      Created: {formatDate(alert.createdAt)}
                      {alert.triggeredAt && ` • Triggered: ${formatDate(alert.triggeredAt)}`}
                    </Text>
                  </VStack>

                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<Icon as={FaEllipsisV} />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem icon={<Icon as={FaEye} />} onClick={() => handleViewDetails(alert)}>
                        View Details
                      </MenuItem>
                      <MenuItem icon={<Icon as={FaEdit} />} onClick={() => handleEditAlert(alert)}>
                        Edit Alert
                      </MenuItem>
                      <MenuItem
                        icon={<Icon as={FaBell} />}
                        onClick={() => handleToggleAlert(alert)}
                      >
                        {alert.isActive ? 'Deactivate' : 'Activate'}
                      </MenuItem>
                      <MenuItem
                        icon={<Icon as={FaTrash} />}
                        color="red.500"
                        onClick={() => handleRemoveAlert(alert.id)}
                      >
                        Remove Alert
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>

      {/* Add Alert Modal */}
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Alert</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <CryptoAlertForm
              onSave={handleAddAlert}
              onCancel={onFormClose}
              assets={portfolio.assets}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Alert Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Alert</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedAlert && (
              <CryptoAlertForm
                onSave={handleUpdateAlert}
                onCancel={onEditClose}
                initialData={selectedAlert}
                assets={portfolio.assets}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alert Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedAlert && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    {getAssetName(selectedAlert.assetId)}
                  </Text>
                  <HStack spacing={2}>
                    <Badge colorScheme={getAlertTypeColor(selectedAlert.type)} variant="subtle">
                      {selectedAlert.type.toUpperCase()}
                    </Badge>
                    <Badge colorScheme={selectedAlert.isActive ? 'green' : 'gray'} variant="subtle">
                      {selectedAlert.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {selectedAlert.triggeredAt && (
                      <Badge colorScheme="orange" variant="subtle">
                        Triggered
                      </Badge>
                    )}
                  </HStack>
                </Box>

                <VStack align="start" spacing={2}>
                  <Text><strong>Condition:</strong> {getConditionText(selectedAlert.condition, selectedAlert.value, selectedAlert.type)}</Text>
                  <Text><strong>Created:</strong> {formatDate(selectedAlert.createdAt)}</Text>
                  {selectedAlert.triggeredAt && (
                    <Text><strong>Triggered:</strong> {formatDate(selectedAlert.triggeredAt)}</Text>
                  )}
                  <Text><strong>Status:</strong> {selectedAlert.isActive ? 'Active' : 'Inactive'}</Text>
                </VStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 