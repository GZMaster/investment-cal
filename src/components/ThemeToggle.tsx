import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

export function ThemeToggle() {
  const { toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const iconColor = useColorModeValue('gray.700', 'white');

  return (
    <IconButton
      aria-label="Toggle color mode"
      icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
      onClick={toggleColorMode}
      position="fixed"
      top={4}
      right={4}
      zIndex={10}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      color={iconColor}
      _hover={{
        bg: hoverBg,
        transform: 'scale(1.1)',
      }}
      _active={{
        bg: hoverBg,
        transform: 'scale(0.95)',
      }}
      boxShadow="md"
      size="lg"
      transition="all 0.2s"
    />
  );
} 