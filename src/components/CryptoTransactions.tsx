import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
} from '@chakra-ui/react';
import { FaPlus, FaEllipsisV, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useCryptoStore } from '../hooks/useCryptoStore';
import { CryptoTransactionForm } from './CryptoTransactionForm';
import { useState } from 'react';
import type { CryptoTransaction } from '../types/crypto';

export function CryptoTransactions() {
  const { transactions, addTransaction, updateTransaction, removeTransaction, portfolio } = useCryptoStore();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const [selectedTransaction, setSelectedTransaction] = useState<CryptoTransaction | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
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

  const getAssetName = (assetId: string) => {
    const asset = portfolio.assets.find((a: any) => a.id === assetId);
    return asset ? `${asset.symbol} - ${asset.name}` : 'Unknown Asset';
  };

  const handleAddTransaction = (transaction: Omit<CryptoTransaction, 'id'>) => {
    addTransaction(transaction);
    onFormClose();
  };

  const handleEditTransaction = (transaction: CryptoTransaction) => {
    setSelectedTransaction(transaction);
    onEditOpen();
  };

  const handleUpdateTransaction = (updates: Omit<CryptoTransaction, 'id'>) => {
    if (selectedTransaction) {
      updateTransaction({ id: selectedTransaction.id, updates });
      onEditClose();
      setSelectedTransaction(null);
    }
  };

  const handleViewDetails = (transaction: CryptoTransaction) => {
    setSelectedTransaction(transaction);
    onDetailsOpen();
  };

  const handleRemoveTransaction = (transactionId: string) => {
    if (confirm('Are you sure you want to remove this transaction?')) {
      removeTransaction(transactionId);
    }
  };

  const sortedTransactions = [...transactions].sort((a: CryptoTransaction, b: CryptoTransaction) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
            Transaction History ({transactions.length})
          </Text>
          <Button
            leftIcon={<Icon as={FaPlus} />}
            colorScheme="blue"
            size="sm"
            onClick={onFormOpen}
          >
            Add Transaction
          </Button>
        </HStack>

        {transactions.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text color={textColor} fontSize="lg">
              No transactions recorded yet.
            </Text>
            <Text color={textColor} fontSize="sm" mt={2}>
              Add your first transaction to get started.
            </Text>
          </Box>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Asset</Th>
                  <Th>Type</Th>
                  <Th isNumeric>Quantity</Th>
                  <Th isNumeric>Price</Th>
                  <Th isNumeric>Total</Th>
                  <Th isNumeric>Fee</Th>
                  <Th>Exchange</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedTransactions.map((transaction) => {
                  const total = transaction.quantity * transaction.price;
                  return (
                    <Tr key={transaction.id}>
                      <Td>
                        <Text fontSize="sm">{formatDate(transaction.date)}</Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" fontWeight="medium">
                          {getAssetName(transaction.assetId)}
                        </Text>
                      </Td>
                      <Td>
                        <Badge colorScheme={getTransactionTypeColor(transaction.type)} variant="subtle">
                          {transaction.type.toUpperCase()}
                        </Badge>
                      </Td>
                      <Td isNumeric>
                        <Text fontSize="sm">
                          {transaction.quantity.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 8,
                          })}
                        </Text>
                      </Td>
                      <Td isNumeric>
                        <Text fontSize="sm" color={textColor}>
                          {formatCurrency(transaction.price)}
                        </Text>
                      </Td>
                      <Td isNumeric>
                        <Text fontSize="sm" fontWeight="semibold">
                          {formatCurrency(total)}
                        </Text>
                      </Td>
                      <Td isNumeric>
                        <Text fontSize="sm" color={textColor}>
                          {transaction.fee > 0 ? formatCurrency(transaction.fee) : '-'}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color={textColor}>
                          {transaction.exchange || '-'}
                        </Text>
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
                            <MenuItem icon={<Icon as={FaEye} />} onClick={() => handleViewDetails(transaction)}>
                              View Details
                            </MenuItem>
                            <MenuItem icon={<Icon as={FaEdit} />} onClick={() => handleEditTransaction(transaction)}>
                              Edit Transaction
                            </MenuItem>
                            <MenuItem
                              icon={<Icon as={FaTrash} />}
                              color="red.500"
                              onClick={() => handleRemoveTransaction(transaction.id)}
                            >
                              Remove Transaction
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
        )}
      </VStack>

      {/* Add Transaction Modal */}
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <CryptoTransactionForm
              onSave={handleAddTransaction}
              onCancel={onFormClose}
              assets={portfolio.assets}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedTransaction && (
              <CryptoTransactionForm
                onSave={handleUpdateTransaction}
                onCancel={onEditClose}
                initialData={selectedTransaction}
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
          <ModalHeader>Transaction Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedTransaction && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    {getAssetName(selectedTransaction.assetId)}
                  </Text>
                  <Badge colorScheme={getTransactionTypeColor(selectedTransaction.type)} variant="subtle">
                    {selectedTransaction.type.toUpperCase()}
                  </Badge>
                </Box>

                <VStack align="start" spacing={2}>
                  <Text><strong>Date:</strong> {formatDate(selectedTransaction.date)}</Text>
                  <Text><strong>Quantity:</strong> {selectedTransaction.quantity.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 8,
                  })}</Text>
                  <Text><strong>Price:</strong> {formatCurrency(selectedTransaction.price)}</Text>
                  <Text><strong>Total:</strong> {formatCurrency(selectedTransaction.quantity * selectedTransaction.price)}</Text>
                  {selectedTransaction.fee > 0 && (
                    <Text><strong>Fee:</strong> {formatCurrency(selectedTransaction.fee)}</Text>
                  )}
                  {selectedTransaction.exchange && (
                    <Text><strong>Exchange:</strong> {selectedTransaction.exchange}</Text>
                  )}
                  {selectedTransaction.walletAddress && (
                    <Text><strong>Wallet:</strong> {selectedTransaction.walletAddress}</Text>
                  )}
                  {selectedTransaction.notes && (
                    <Text><strong>Notes:</strong> {selectedTransaction.notes}</Text>
                  )}
                </VStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 