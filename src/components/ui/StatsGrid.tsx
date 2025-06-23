import {
  SimpleGrid,
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

interface StatItem {
  label: string;
  value: string | number;
  icon?: ReactNode;
  helpText?: string;
  arrowType?: 'increase' | 'decrease';
  arrowValue?: string | number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: number | { base: number; md: number; lg: number };
  spacing?: number | { base: number; md: number };
}

export function StatsGrid({
  stats,
  columns = { base: 1, md: 2, lg: 4 },
  spacing = { base: 4, md: 6 }
}: StatsGridProps) {
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <SimpleGrid columns={columns} spacing={spacing}>
      {stats.map((stat, index) => {
        const getSizeStyles = () => {
          switch (stat.size) {
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
                labelSize: { base: "sm", md: "md" },
                valueSize: { base: 'md', md: 'xl' },
                helpTextSize: { base: "xs", md: "sm" },
              };
          }
        };

        const { labelSize, valueSize, helpTextSize } = getSizeStyles();

        return (
          <Stat key={`stat-${stat.label}-${index}`}>
            <StatLabel>
              <HStack>
                {stat.icon && stat.icon}
                <Text fontSize={labelSize}>{stat.label}</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize={valueSize} color={stat.color}>
              {stat.value}
            </StatNumber>
            {(stat.helpText || stat.arrowType) && (
              <StatHelpText fontSize={helpTextSize} color={textColor}>
                {stat.arrowType && <StatArrow type={stat.arrowType} />}
                {stat.helpText}
                {stat.arrowValue && ` ${stat.arrowValue}`}
              </StatHelpText>
            )}
          </Stat>
        );
      })}
    </SimpleGrid>
  );
} 