import {
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const MotionBox = motion(Box);

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  hoverEffect?: boolean;
  p?: number;
  w?: string;
  h?: string;
  maxW?: string;
  borderRadius?: string;
  bg?: string;
  borderColor?: string;
  boxShadow?: string;
  onClick?: () => void;
}

export function Card({
  children,
  variant = 'default',
  hoverEffect = false,
  p = 6,
  ...props
}: CardProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const shadowColor = useColorModeValue('lg', 'dark-lg');

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          boxShadow: 'xl',
          border: 'none',
        };
      case 'outlined':
        return {
          boxShadow: 'none',
          border: '1px solid',
          borderColor,
        };
      default:
        return {
          boxShadow: shadowColor,
          border: '1px solid',
          borderColor,
        };
    }
  };

  const baseStyles = {
    bg: bgColor,
    borderRadius: 'lg',
    p,
    ...getVariantStyles(),
  };

  const hoverStyles = hoverEffect ? {
    _hover: {
      transform: 'translateY(-2px)',
      boxShadow: '2xl',
      borderColor: 'blue.400',
    },
    transition: 'all 0.2s',
  } : {};

  return (
    <MotionBox
      {...baseStyles}
      {...hoverStyles}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </MotionBox>
  );
} 