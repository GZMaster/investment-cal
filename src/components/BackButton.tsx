import { IconButton, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@chakra-ui/icons';

export function BackButton() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const iconColor = useColorModeValue('gray.700', 'white');

  return (
    <IconButton
      aria-label="Go back"
      icon={<ChevronLeftIcon boxSize={6} />}
      onClick={() => navigate(-1)}
      position="fixed"
      top={4}
      left={4}
      zIndex={10}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      color={iconColor}
      _hover={{
        bg: hoverBg,
        transform: 'translateX(-2px)',
      }}
      _active={{
        bg: hoverBg,
        transform: 'translateX(-4px)',
      }}
      boxShadow="md"
      size="lg"
      transition="all 0.2s"
    />
  );
} 