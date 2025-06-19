import {
  Box,
  Button,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  VStack,
  HStack,
  Text,
  Badge,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { FaCog, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { usePlatformStore } from '../hooks/usePlatformStore';
import { PlatformConfigModal } from './PlatformConfigModal';

export function PlatformConfigWidget() {
  const { settings } = usePlatformStore();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { isOpen: isPopoverOpen, onToggle: onPopoverToggle, onClose: onPopoverClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const shadowColor = useColorModeValue('lg', 'dark-lg');

  const isConfigured = settings?.isConfigured || false;
  const hasCustomPlatforms = settings?.primarySavingsPlatform?.name !== 'PiggyVest' ||
    settings?.primaryInvestmentPlatform?.name !== 'RiseVest';

  const getStatusColor = () => {
    if (!isConfigured) return 'red';
    if (hasCustomPlatforms) return 'green';
    return 'yellow';
  };

  const getStatusText = () => {
    if (!isConfigured) return 'Not Configured';
    if (hasCustomPlatforms) return 'Customized';
    return 'Default';
  };

  const getStatusIcon = () => {
    if (!isConfigured) return FaExclamationTriangle;
    if (hasCustomPlatforms) return FaCheckCircle;
    return FaCog;
  };

  return (
    <>
      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        zIndex={1000}
      >
        <Popover
          isOpen={isPopoverOpen}
          onClose={onPopoverClose}
          placement="top"
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Button
              onClick={onPopoverToggle}
              size="lg"
              colorScheme={getStatusColor()}
              borderRadius="full"
              boxShadow={shadowColor}
              border="2px solid"
              borderColor={borderColor}
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: 'xl',
              }}
              transition="all 0.2s"
            >
              <HStack spacing={1} align="center">
                <Icon as={getStatusIcon()} boxSize={5} />
                <Text fontSize="xs" fontWeight="bold">
                  {getStatusText()}
                </Text>
              </HStack>
            </Button>
          </PopoverTrigger>

          <PopoverContent bg={bgColor} borderColor={borderColor} maxW="300px">
            <PopoverHeader fontWeight="bold" borderBottom="1px solid" borderColor={borderColor}>
              Platform Configuration
            </PopoverHeader>

            <PopoverBody>
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="sm" fontWeight="medium">Status:</Text>
                  <Badge colorScheme={getStatusColor()} variant="subtle">
                    {getStatusText()}
                  </Badge>
                </HStack>

                {isConfigured && (
                  <>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={1}>
                        Savings Platform:
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {settings.primarySavingsPlatform.name}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={1}>
                        Investment Platform:
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {settings.primaryInvestmentPlatform.name}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={1}>
                        Exchange Rate:
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        ₦{settings.exchangeRate.toLocaleString()}/USD
                      </Text>
                    </Box>
                  </>
                )}

                {!isConfigured && (
                  <Text fontSize="sm" color="gray.600">
                    Configure your platform names and settings to personalize the investment tools.
                  </Text>
                )}
              </VStack>
            </PopoverBody>

            <PopoverFooter borderTop="1px solid" borderColor={borderColor}>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => {
                  onPopoverClose();
                  onModalOpen();
                }}
                width="100%"
              >
                {isConfigured ? 'Update Configuration' : 'Configure Platforms'}
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </Box>

      <PlatformConfigModal isOpen={isModalOpen} onClose={onModalClose} />
    </>
  );
} 