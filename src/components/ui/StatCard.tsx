import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  helpText?: string;
  arrowType?: 'increase' | 'decrease';
  arrowValue?: string | number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatCard({
  label,
  value,
  icon,
  helpText,
  arrowType,
  arrowValue,
  color,
  size = 'md',
}: StatCardProps) {
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          labelSize: 'sm',
          valueSize: 'lg',
          helpTextSize: 'xs',
        };
      case 'lg':
        return {
          labelSize: 'md',
          valueSize: '2xl',
          helpTextSize: 'sm',
        };
      default:
        return {
          labelSize: 'md',
          valueSize: 'xl',
          helpTextSize: 'sm',
        };
    }
  };

  const { labelSize, valueSize, helpTextSize } = getSizeStyles();

  return (
    <Stat>
      <StatLabel>
        <HStack spacing={2}>
          {icon && icon}
          <Text fontSize={labelSize}>{label}</Text>
        </HStack>
      </StatLabel>
      <StatNumber fontSize={valueSize} color={color}>
        {value}
      </StatNumber>
      {(helpText || arrowType) && (
        <StatHelpText fontSize={helpTextSize} color={textColor}>
          {arrowType && <StatArrow type={arrowType} />}
          {helpText}
          {arrowValue && ` ${arrowValue}`}
        </StatHelpText>
      )}
    </Stat>
  );
} 