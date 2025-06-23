import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Badge,
  useColorModeValue,
  type TableProps,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface Column {
  key: string;
  label: string;
  isNumeric?: boolean;
  render?: (value: any, row: any, index: number) => ReactNode;
  width?: string;
  whiteSpace?: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  variant?: TableProps['variant'];
  size?: TableProps['size'];
  overflowX?: boolean;
  maxW?: string;
  emptyMessage?: string;
  onRowClick?: (row: any, index: number) => void;
  hoverEffect?: boolean;
}

export function DataTable({
  data,
  columns,
  variant = 'simple',
  size = 'md',
  overflowX = true,
  maxW = '100%',
  emptyMessage = 'No data available',
  onRowClick,
  hoverEffect = true,
}: DataTableProps) {
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const renderCell = (column: Column, row: any, index: number) => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row, index);
    }

    if (value === null || value === undefined) {
      return '-';
    }

    if (typeof value === 'boolean') {
      return (
        <Badge colorScheme={value ? 'green' : 'red'} variant="subtle">
          {value ? 'Yes' : 'No'}
        </Badge>
      );
    }

    if (typeof value === 'number') {
      return value.toLocaleString();
    }

    if (typeof value === 'string') {
      return value;
    }

    return String(value);
  };

  if (data.length === 0) {
    return (
      <Box
        p={8}
        textAlign="center"
        color={textColor}
        border="1px dashed"
        borderColor={textColor}
        borderRadius="md"
      >
        <Text>{emptyMessage}</Text>
      </Box>
    );
  }

  const tableContent = (
    <Table variant={variant} size={size}>
      <Thead>
        <Tr>
          {columns.map((column) => (
            <Th
              key={column.key}
              isNumeric={column.isNumeric}
              width={column.width}
              whiteSpace={column.whiteSpace}
            >
              {column.label}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((row, index) => (
          <Tr
            key={`row-${row.id || index}`}
            onClick={() => onRowClick?.(row, index)}
            cursor={onRowClick ? 'pointer' : 'default'}
            _hover={hoverEffect ? { bg: hoverBgColor } : undefined}
            transition="background-color 0.2s"
          >
            {columns.map((column) => (
              <Td
                key={column.key}
                isNumeric={column.isNumeric}
                whiteSpace={column.whiteSpace}
              >
                {renderCell(column, row, index)}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  if (overflowX) {
    return (
      <TableContainer overflowX="auto" maxW={maxW}>
        {tableContent}
      </TableContainer>
    );
  }

  return tableContent;
} 