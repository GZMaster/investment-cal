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
  VStack,
  HStack,
  Text,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaBitcoin, FaPlus } from 'react-icons/fa';
import { useSearchCryptocurrencies, useStakingInfo, useDefiYieldRates, useTrendingCryptocurrencies } from '../hooks/useCryptoData';
import type { CryptoAsset } from '../types/crypto';

// Utility function for formatting currency
function formatCurrency(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

interface CryptoAssetFormProps {
  onSave: (asset: Omit<CryptoAsset, 'id'>) => void;
  onCancel: () => void;
  initialData?: Partial<CryptoAsset>;
}

export function CryptoAssetForm({ onSave, onCancel, initialData }: CryptoAssetFormProps) {
  const [formData, setFormData] = useState({
    symbol: initialData?.symbol || '',
    name: initialData?.name || '',
    quantity: initialData?.quantity || 0,
    averageCost: initialData?.averageCost || 0,
    currentPrice: initialData?.currentPrice || 0,
    blockchain: initialData?.blockchain || 'Ethereum',
    category: initialData?.category || 'defi',
    riskLevel: initialData?.riskLevel || 'medium',
    stakingRewards: initialData?.stakingRewards || 0,
    defiYield: initialData?.defiYield || 0,
    purchaseDate: initialData?.purchaseDate ? initialData.purchaseDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const listItemBg = useColorModeValue('gray.50', 'gray.700');
  const listItemHoverBg = useColorModeValue('gray.100', 'gray.600');

  // Search for cryptocurrencies - only when activeSearchQuery changes
  const { data: searchResults, isLoading: isSearching, error: searchError } = useSearchCryptocurrencies(activeSearchQuery);

  // Get staking info for selected crypto
  const { data: stakingInfo } = useStakingInfo(formData.symbol);

  // Get DeFi yield rates for selected crypto
  const { data: defiYieldRate } = useDefiYieldRates(formData.symbol);

  // Get trending cryptocurrencies
  const { data: trendingResults } = useTrendingCryptocurrencies();

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (query.trim().length >= 2) {
            setActiveSearchQuery(query.trim());
          } else {
            setActiveSearchQuery('');
          }
        }, 500); // 500ms delay
      };
    })(),
    []
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle Enter key press
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim().length >= 2) {
        setActiveSearchQuery(searchQuery.trim());
      }
    }
  };

  // Debug logging
  useEffect(() => {
    console.log('Active search query changed:', activeSearchQuery);
    console.log('Search results:', searchResults);
    console.log('Search error:', searchError);
  }, [activeSearchQuery, searchResults, searchError]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCryptoSelect = (crypto: any) => {
    console.log('Selected crypto:', crypto);
    setSelectedCrypto(crypto);
    setFormData(prev => ({
      ...prev,
      symbol: crypto.symbol.toUpperCase(),
      name: crypto.name,
      currentPrice: crypto.current_price,
    }));
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (formData.averageCost <= 0) {
      newErrors.averageCost = 'Average cost must be greater than 0';
    }

    if (formData.currentPrice <= 0) {
      newErrors.currentPrice = 'Current price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const asset: Omit<CryptoAsset, 'id'> = {
      symbol: formData.symbol.toUpperCase(),
      name: formData.name,
      quantity: formData.quantity,
      averageCost: formData.averageCost,
      currentPrice: formData.currentPrice,
      blockchain: formData.blockchain,
      category: formData.category,
      riskLevel: formData.riskLevel,
      stakingRewards: formData.stakingRewards,
      defiYield: formData.defiYield,
      purchaseDate: new Date(formData.purchaseDate),
      lastUpdated: new Date(),
    };

    onSave(asset);
  };

  // Update staking rewards and DeFi yield when crypto is selected
  useEffect(() => {
    if (stakingInfo) {
      setFormData(prev => ({ ...prev, stakingRewards: stakingInfo.stakingRate }));
    }
  }, [stakingInfo]);

  useEffect(() => {
    if (defiYieldRate) {
      setFormData(prev => ({ ...prev, defiYield: defiYieldRate }));
    }
  }, [defiYieldRate]);

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
          {initialData ? 'Edit Crypto Asset' : 'Add New Crypto Asset'}
        </Text>

        {/* Crypto Search */}
        <FormControl>
          <FormLabel>Search Cryptocurrency</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={FaSearch} color={textColor} />
            </InputLeftElement>
            <Input
              placeholder="Search for a cryptocurrency (e.g., Bitcoin, ETH, Cardano)"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onClick={onOpen}
              readOnly
            />
          </InputGroup>
          {selectedCrypto && (
            <HStack mt={2} spacing={2}>
              <Icon as={FaBitcoin} color="orange.500" />
              <Text fontSize="sm" fontWeight="medium">
                {selectedCrypto.symbol.toUpperCase()} - {selectedCrypto.name}
              </Text>
              <Badge colorScheme="blue" variant="subtle">
                {formatCurrency(selectedCrypto.current_price)}
              </Badge>
            </HStack>
          )}
        </FormControl>

        <HStack spacing={4}>
          <FormControl isInvalid={!!errors.symbol}>
            <FormLabel>Symbol</FormLabel>
            <Input
              value={formData.symbol}
              onChange={(e) => handleInputChange('symbol', e.target.value)}
              placeholder="BTC"
            />
            <FormErrorMessage>{errors.symbol}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Bitcoin"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
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

          <FormControl isInvalid={!!errors.averageCost}>
            <FormLabel>Average Cost (USD)</FormLabel>
            <NumberInput
              value={formData.averageCost}
              onChange={(value) => handleInputChange('averageCost', Number.parseFloat(value) || 0)}
              min={0}
              precision={2}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.averageCost}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.currentPrice}>
            <FormLabel>Current Price (USD)</FormLabel>
            <NumberInput
              value={formData.currentPrice}
              onChange={(value) => handleInputChange('currentPrice', Number.parseFloat(value) || 0)}
              min={0}
              precision={2}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.currentPrice}</FormErrorMessage>
          </FormControl>
        </HStack>

        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Blockchain</FormLabel>
            <Select
              value={formData.blockchain}
              onChange={(e) => handleInputChange('blockchain', e.target.value)}
            >
              <option value="Bitcoin">Bitcoin</option>
              <option value="Ethereum">Ethereum</option>
              <option value="Cardano">Cardano</option>
              <option value="Polkadot">Polkadot</option>
              <option value="Solana">Solana</option>
              <option value="Cosmos">Cosmos</option>
              <option value="Binance Smart Chain">Binance Smart Chain</option>
              <option value="Polygon">Polygon</option>
              <option value="Avalanche">Avalanche</option>
              <option value="Other">Other</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="defi">DeFi</option>
              <option value="layer1">Layer 1</option>
              <option value="layer2">Layer 2</option>
              <option value="stablecoin">Stablecoin</option>
              <option value="meme">Meme</option>
              <option value="governance">Governance</option>
              <option value="other">Other</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Risk Level</FormLabel>
            <Select
              value={formData.riskLevel}
              onChange={(e) => handleInputChange('riskLevel', e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="very-high">Very High</option>
            </Select>
          </FormControl>
        </HStack>

        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Staking Rewards (%)</FormLabel>
            <NumberInput
              value={formData.stakingRewards}
              onChange={(value) => handleInputChange('stakingRewards', Number.parseFloat(value) || 0)}
              min={0}
              max={100}
              precision={2}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>DeFi Yield (%)</FormLabel>
            <NumberInput
              value={formData.defiYield}
              onChange={(value) => handleInputChange('defiYield', Number.parseFloat(value) || 0)}
              min={0}
              max={100}
              precision={2}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Purchase Date</FormLabel>
            <Input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
            />
          </FormControl>
        </HStack>

        <HStack justify="flex-end" spacing={4}>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit} colorScheme="blue" leftIcon={<Icon as={FaPlus} />}>
            {initialData ? 'Update Asset' : 'Add Asset'}
          </Button>
        </HStack>
      </VStack>

      {/* Crypto Search Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search Cryptocurrencies</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaSearch} color={textColor} />
                </InputLeftElement>
                <Input
                  placeholder="Search for a cryptocurrency... (Press Enter to search)"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                />
              </InputGroup>

              {isSearching && (
                <Box textAlign="center" py={4}>
                  <Spinner size="md" color="blue.500" />
                  <Text mt={2} fontSize="sm" color={textColor}>
                    Searching...
                  </Text>
                </Box>
              )}

              {searchError && (
                <Alert status="error">
                  <AlertIcon />
                  Failed to search cryptocurrencies: {searchError.message}
                </Alert>
              )}

              {activeSearchQuery && searchResults && searchResults.length > 0 && (
                <List spacing={2}>
                  {searchResults.map((crypto: any) => (
                    <ListItem
                      key={crypto.id}
                      p={3}
                      bg={listItemBg}
                      borderRadius="md"
                      cursor="pointer"
                      _hover={{ bg: listItemHoverBg }}
                      onClick={() => handleCryptoSelect(crypto)}
                    >
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <HStack spacing={2}>
                            <Text fontWeight="bold">{crypto.symbol.toUpperCase()}</Text>
                            <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                              {crypto.chainId || 'DEX'}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color={textColor}>
                            {crypto.name}
                          </Text>
                        </VStack>
                        <VStack align="end" spacing={1}>
                          <Text fontWeight="semibold">
                            {formatCurrency(crypto.current_price)}
                          </Text>
                          <Text fontSize="xs" color={textColor}>
                            {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                            {crypto.price_change_percentage_24h.toFixed(2)}%
                          </Text>
                        </VStack>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              )}

              {!activeSearchQuery && trendingResults && trendingResults.length > 0 && (
                <>
                  <Text fontSize="md" fontWeight="semibold" color="blue.600">
                    Trending Cryptocurrencies
                  </Text>
                  <List spacing={2}>
                    {trendingResults.slice(0, 10).map((crypto: any) => (
                      <ListItem
                        key={crypto.id}
                        p={3}
                        bg={listItemBg}
                        borderRadius="md"
                        cursor="pointer"
                        _hover={{ bg: listItemHoverBg }}
                        onClick={() => handleCryptoSelect(crypto)}
                      >
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <HStack spacing={2}>
                              <Text fontWeight="bold">{crypto.symbol.toUpperCase()}</Text>
                              <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                                {crypto.chainId || 'DEX'}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color={textColor}>
                              {crypto.name}
                            </Text>
                          </VStack>
                          <VStack align="end" spacing={1}>
                            <Text fontWeight="semibold">
                              {formatCurrency(crypto.current_price)}
                            </Text>
                            <Text fontSize="xs" color={textColor}>
                              {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                              {crypto.price_change_percentage_24h.toFixed(2)}%
                            </Text>
                          </VStack>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {activeSearchQuery && !isSearching && searchResults && searchResults.length === 0 && (
                <Text textAlign="center" color={textColor}>
                  No cryptocurrencies found for "{activeSearchQuery}"
                </Text>
              )}

              {!activeSearchQuery && !trendingResults && (
                <Text textAlign="center" color={textColor}>
                  Start typing to search for cryptocurrencies...
                </Text>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 