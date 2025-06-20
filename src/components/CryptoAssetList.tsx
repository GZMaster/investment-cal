import {
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
} from '@chakra-ui/react';
import { FaEdit, FaEllipsisV, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { useCryptoStore } from '../hooks/useCryptoStore';
import type { CryptoAsset } from '../types/crypto';
import { CryptoAssetForm } from './CryptoAssetForm';
import { useState } from 'react';

export function CryptoAssetList() {
  const { portfolio, removeAsset, addAsset, updateAsset } = useCryptoStore();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const modalBg = useColorModeValue('white', 'gray.800');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getGainLossColor = (value: number) => {
    if (value > 0) return 'green.500';
    if (value < 0) return 'red.500';
    return textColor;
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
      case 'very-high': return 'red';
      default: return 'gray';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'layer1': return 'blue';
      case 'layer2': return 'purple';
      case 'defi': return 'green';
      case 'stablecoin': return 'gray';
      case 'meme': return 'pink';
      case 'governance': return 'teal';
      default: return 'gray';
    }
  };

  const handleRemoveAsset = (assetId: string) => {
    if (confirm('Are you sure you want to remove this asset?')) {
      removeAsset(assetId);
    }
  };

  const handleAddAsset = (asset: Omit<CryptoAsset, 'id'>) => {
    addAsset(asset);
    onFormClose();
  };

  const handleEditAsset = (asset: CryptoAsset) => {
    setSelectedAsset(asset);
    onEditOpen();
  };

  const handleUpdateAsset = (updates: Omit<CryptoAsset, 'id'>) => {
    if (selectedAsset) {
      updateAsset({
        id: selectedAsset.id,
        updates: {
          ...updates,
          lastUpdated: new Date(),
        }
      });
      onEditClose();
      setSelectedAsset(null);
    }
  };

  const handleViewDetails = (asset: CryptoAsset) => {
    setSelectedAsset(asset);
    onDetailsOpen();
  };

  const calculateAssetStats = (asset: CryptoAsset) => {
    const assetValue = asset.quantity * asset.currentPrice;
    const assetCost = asset.quantity * asset.averageCost;
    const gainLoss = assetValue - assetCost;
    const gainLossPercentage = assetCost > 0 ? (gainLoss / assetCost) * 100 : 0;
    const stakingRewards = asset.stakingRewards > 0 ? (assetValue * asset.stakingRewards) / 100 : 0;
    const defiYield = asset.defiYield > 0 ? (assetValue * asset.defiYield) / 100 : 0;

    return {
      assetValue,
      assetCost,
      gainLoss,
      gainLossPercentage,
      stakingRewards,
      defiYield,
    };
  };

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
            Assets ({portfolio.assets.length})
          </Text>
          <Button
            leftIcon={<Icon as={FaPlus} />}
            colorScheme="blue"
            size="sm"
            onClick={onFormOpen}
          >
            Add Asset
          </Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Asset</Th>
                <Th isNumeric>Quantity</Th>
                <Th isNumeric>Avg Cost</Th>
                <Th isNumeric>Current Price</Th>
                <Th isNumeric>Value</Th>
                <Th isNumeric>P&L</Th>
                <Th isNumeric>Staking</Th>
                <Th isNumeric>DeFi Yield</Th>
                <Th>Category</Th>
                <Th>Risk</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {portfolio.assets.map((asset: CryptoAsset) => {
                const assetValue = asset.quantity * asset.currentPrice;
                const assetCost = asset.quantity * asset.averageCost;
                const gainLoss = assetValue - assetCost;
                const gainLossPercentage = assetCost > 0 ? (gainLoss / assetCost) * 100 : 0;

                return (
                  <Tr key={asset.id}>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">{asset.name}</Text>
                        <Text fontSize="sm" color={textColor}>
                          {asset.symbol} • {asset.blockchain}
                        </Text>
                      </VStack>
                    </Td>
                    <Td isNumeric>
                      <Text fontWeight="semibold">
                        {asset.quantity.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 8,
                        })}
                      </Text>
                    </Td>
                    <Td isNumeric>
                      <Text color={textColor}>
                        {formatCurrency(asset.averageCost)}
                      </Text>
                    </Td>
                    <Td isNumeric>
                      <Text fontWeight="semibold">
                        {formatCurrency(asset.currentPrice)}
                      </Text>
                    </Td>
                    <Td isNumeric>
                      <Text fontWeight="semibold">
                        {formatCurrency(assetValue)}
                      </Text>
                    </Td>
                    <Td isNumeric>
                      <VStack align="end" spacing={0}>
                        <Text
                          fontWeight="semibold"
                          color={getGainLossColor(gainLoss)}
                        >
                          {formatCurrency(gainLoss)}
                        </Text>
                        <Text
                          fontSize="sm"
                          color={getGainLossColor(gainLossPercentage)}
                        >
                          {formatPercentage(gainLossPercentage)}
                        </Text>
                      </VStack>
                    </Td>
                    <Td isNumeric>
                      {asset.stakingRewards > 0 ? (
                        <Text color="green.500" fontWeight="semibold">
                          {formatCurrency(asset.stakingRewards)}
                        </Text>
                      ) : (
                        <Text color={textColor}>-</Text>
                      )}
                    </Td>
                    <Td isNumeric>
                      {asset.defiYield > 0 ? (
                        <Text color="purple.500" fontWeight="semibold">
                          {formatCurrency(asset.defiYield)}
                        </Text>
                      ) : (
                        <Text color={textColor}>-</Text>
                      )}
                    </Td>
                    <Td>
                      <Badge colorScheme={getCategoryColor(asset.category)} variant="subtle">
                        {asset.category}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={getRiskColor(asset.riskLevel)} variant="subtle">
                        {asset.riskLevel}
                      </Badge>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<Icon as={FaEllipsisV} />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<Icon as={FaEye} />}
                            onClick={() => handleViewDetails(asset)}
                          >
                            View Details
                          </MenuItem>
                          <MenuItem
                            icon={<Icon as={FaEdit} />}
                            onClick={() => handleEditAsset(asset)}
                          >
                            Edit Asset
                          </MenuItem>
                          <MenuItem
                            icon={<Icon as={FaTrash} />}
                            color="red.500"
                            onClick={() => handleRemoveAsset(asset.id)}
                          >
                            Remove Asset
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>

        {portfolio.assets.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text color={textColor} fontSize="lg">
              No assets in your portfolio yet.
            </Text>
            <Text color={textColor} fontSize="sm" mt={2}>
              Add your first cryptocurrency asset to get started.
            </Text>
          </Box>
        )}
      </VStack>

      {isFormOpen && (
        <CryptoAssetForm
          onSave={handleAddAsset}
          onCancel={onFormClose}
        />
      )}

      {/* View Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>Asset Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedAsset && (
              <VStack spacing={6} align="stretch">
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    {selectedAsset.name} ({selectedAsset.symbol})
                  </Text>
                  <Text color={textColor} fontSize="sm">
                    {selectedAsset.blockchain} • {selectedAsset.category}
                  </Text>
                </Box>

                <SimpleGrid columns={2} spacing={4}>
                  <Stat>
                    <StatLabel>Current Value</StatLabel>
                    <StatNumber>{formatCurrency(calculateAssetStats(selectedAsset).assetValue)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Total Cost</StatLabel>
                    <StatNumber>{formatCurrency(calculateAssetStats(selectedAsset).assetCost)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>P&L</StatLabel>
                    <StatNumber color={getGainLossColor(calculateAssetStats(selectedAsset).gainLoss)}>
                      {formatCurrency(calculateAssetStats(selectedAsset).gainLoss)}
                    </StatNumber>
                    <StatHelpText color={getGainLossColor(calculateAssetStats(selectedAsset).gainLossPercentage)}>
                      {formatPercentage(calculateAssetStats(selectedAsset).gainLossPercentage)}
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Quantity</StatLabel>
                    <StatNumber>
                      {selectedAsset.quantity.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 8,
                      })}
                    </StatNumber>
                  </Stat>
                </SimpleGrid>

                <Divider />

                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontWeight="semibold" mb={2}>Price Information</Text>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm">Current Price: {formatCurrency(selectedAsset.currentPrice)}</Text>
                      <Text fontSize="sm">Average Cost: {formatCurrency(selectedAsset.averageCost)}</Text>
                      <Text fontSize="sm">Purchase Date: {selectedAsset.purchaseDate.toLocaleDateString()}</Text>
                    </VStack>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" mb={2}>Yield Information</Text>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm">Staking Rewards: {selectedAsset.stakingRewards > 0 ? `${selectedAsset.stakingRewards}%` : 'N/A'}</Text>
                      <Text fontSize="sm">DeFi Yield: {selectedAsset.defiYield > 0 ? `${selectedAsset.defiYield}%` : 'N/A'}</Text>
                      <Text fontSize="sm">Risk Level:
                        <Badge ml={2} colorScheme={getRiskColor(selectedAsset.riskLevel)} variant="subtle">
                          {selectedAsset.riskLevel}
                        </Badge>
                      </Text>
                    </VStack>
                  </Box>
                </SimpleGrid>

                {selectedAsset.stakingRewards > 0 && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>Staking Rewards</Text>
                    <Text color="green.500" fontSize="lg">
                      {formatCurrency(calculateAssetStats(selectedAsset).stakingRewards)} annually
                    </Text>
                  </Box>
                )}

                {selectedAsset.defiYield > 0 && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>DeFi Yield</Text>
                    <Text color="purple.500" fontSize="lg">
                      {formatCurrency(calculateAssetStats(selectedAsset).defiYield)} annually
                    </Text>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Asset Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>Edit Asset</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedAsset && (
              <CryptoAssetForm
                onSave={handleUpdateAsset}
                onCancel={onEditClose}
                initialData={selectedAsset}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 