import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
  showCloseButton?: boolean;
  showFooter?: boolean;
  footerActions?: ReactNode;
  onSave?: () => void;
  saveText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  showFooter = false,
  footerActions,
  onSave,
  saveText = 'Save',
  cancelText = 'Cancel',
  isLoading = false,
}: ModalProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const defaultFooter = (
    <HStack spacing={3}>
      <Button variant="ghost" onClick={onClose}>
        {cancelText}
      </Button>
      {onSave && (
        <Button colorScheme="blue" onClick={onSave} isLoading={isLoading}>
          {saveText}
        </Button>
      )}
    </HStack>
  );

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent bg={bgColor} borderColor={borderColor}>
        <ModalHeader>{title}</ModalHeader>
        {showCloseButton && <ModalCloseButton />}
        <ModalBody pb={6}>
          {children}
        </ModalBody>
        {showFooter && (
          <ModalFooter borderTop="1px solid" borderColor={borderColor}>
            {footerActions || defaultFooter}
          </ModalFooter>
        )}
      </ModalContent>
    </ChakraModal>
  );
} 