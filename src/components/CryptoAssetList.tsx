import {
  Box,
  VStack,
  Heading,
  Text,
  Badge,
  useColorModeValue,
  Button,
  HStack,
  IconButton,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useCryptoStore } from '../hooks/useCryptoStore';
import type { CryptoAsset } from '../types/crypto';
import { DataTable } from './ui';
import { CryptoAssetForm } from './CryptoAssetForm';

export function CryptoAssetList() {
  const { portfolio, removeAsset, updateAsset } = useCryptoStore();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleEdit = (asset: CryptoAsset) => {
    // For now, just open the form with the asset data
    onFormOpen();
  };

  const handleDelete = (asset: CryptoAsset) => {
    if (confirm(`Are you sure you want to delete ${asset.name}?`)) {
      removeAsset(asset.id);
    }
  };

  const handleAddAsset = (asset: Omit<CryptoAsset, 'id'>) => {
    // This would need to be implemented in the store
    onFormClose();
  };

  const columns = [
    { key: 'name', label: 'Asset' },
    { key: 'quantity', label: 'Quantity', isNumeric: true },
    { key: 'averageCost', label: 'Avg Cost', isNumeric: true },
    { key: 'currentPrice', label: 'Current Price', isNumeric: true },
    { key: 'value', label: 'Value', isNumeric: true },
    { key: 'pnl', label: 'P&L', isNumeric: true },
    { key: 'stakingRewards', label: 'Staking', isNumeric: true },
    { key: 'defiYield', label: 'DeFi Yield', isNumeric: true },
    { key: 'category', label: 'Category' },
    { key: 'riskLevel', label: 'Risk' },
    { key: 'actions', label: 'Actions' },
  ];

  const data = portfolio.assets.map((asset: CryptoAsset) => {
    const assetValue = asset.quantity * asset.currentPrice;
    const assetCost = asset.quantity * asset.averageCost;
    const gainLoss = assetValue - assetCost;
    const gainLossPercentage = assetCost > 0 ? (gainLoss / assetCost) * 100 : 0;

    return {
      id: asset.id,
      name: asset.name,
      quantity: asset.quantity.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 8,
      }),
      averageCost: `$${asset.averageCost.toFixed(2)}`,
      currentPrice: `$${asset.currentPrice.toFixed(2)}`,
      value: `$${assetValue.toFixed(2)}`,
      pnl: (
        <Badge colorScheme={gainLoss >= 0 ? 'green' : 'red'} variant="subtle">
          {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)} ({gainLossPercentage.toFixed(2)}%)
        </Badge>
      ),
      stakingRewards: asset.stakingRewards > 0 ? `${asset.stakingRewards.toFixed(2)}%` : '-',
      defiYield: asset.defiYield > 0 ? `${asset.defiYield.toFixed(2)}%` : '-',
      category: (
        <Badge colorScheme="blue" variant="subtle">
          {asset.category}
        </Badge>
      ),
      riskLevel: (
        <Badge
          colorScheme={
            asset.riskLevel === 'low' ? 'green' : asset.riskLevel === 'medium' ? 'yellow' : 'red'
          }
          variant="subtle"
        >
          {asset.riskLevel}
        </Badge>
      ),
      actions: (
        <HStack spacing={2}>
          <Tooltip label="Edit Asset">
            <IconButton
              aria-label="Edit asset"
              icon={<FaEdit />}
              size="sm"
              variant="ghost"
              onClick={() => handleEdit(asset)}
            />
          </Tooltip>
          <Tooltip label="Delete Asset">
            <IconButton
              aria-label="Delete asset"
              icon={<FaTrash />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={() => handleDelete(asset)}
            />
          </Tooltip>
        </HStack>
      ),
    };
  });

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <VStack align="start" spacing={1}>
          <Heading size="md">Portfolio Assets</Heading>
          <Text fontSize="sm" color={textColor}>
            {portfolio.assets.length} assets • Total Value: ${portfolio.totalValue.toFixed(2)}
          </Text>
        </VStack>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="blue"
          onClick={onFormOpen}
        >
          Add Asset
        </Button>
      </HStack>

      <DataTable
        data={data}
        columns={columns}
        size="sm"
        hoverEffect={true}
        emptyMessage="No assets in portfolio. Add your first asset to get started!"
      />

      {isFormOpen && (
        <CryptoAssetForm
          onSave={handleAddAsset}
          onCancel={onFormClose}
        />
      )}
    </VStack>
  );
} 