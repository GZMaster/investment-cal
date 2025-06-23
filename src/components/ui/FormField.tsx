import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  Select,
  Textarea,
  Switch,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface BaseFormFieldProps {
  label: string;
  error?: string;
  isRequired?: boolean;
  helperText?: string;
  isDisabled?: boolean;
}

interface NumberFormFieldProps extends BaseFormFieldProps {
  type: 'number';
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  placeholder?: string;
}

interface TextFormFieldProps extends BaseFormFieldProps {
  type: 'text' | 'email' | 'password' | 'date';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  leftIcon?: ReactNode;
}

interface SelectFormFieldProps extends BaseFormFieldProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface TextareaFormFieldProps extends BaseFormFieldProps {
  type: 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SwitchFormFieldProps extends BaseFormFieldProps {
  type: 'switch';
  value: boolean;
  onChange: (value: boolean) => void;
}

type FormFieldProps =
  | NumberFormFieldProps
  | TextFormFieldProps
  | SelectFormFieldProps
  | TextareaFormFieldProps
  | SwitchFormFieldProps;

export function FormField(props: FormFieldProps) {
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const renderInput = () => {
    switch (props.type) {
      case 'number':
        return (
          <NumberInput
            value={props.value}
            onChange={(_, value) => props.onChange(value)}
            min={props.min}
            max={props.max}
            step={props.step}
            precision={props.precision}
            isDisabled={props.isDisabled}
          >
            <NumberInputField placeholder={props.placeholder} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        );

      case 'text':
      case 'email':
      case 'password':
      case 'date':
        return (
          <InputGroup>
            {props.leftIcon && (
              <InputLeftElement>
                {props.leftIcon}
              </InputLeftElement>
            )}
            <Input
              type={props.type}
              value={props.value}
              onChange={(e) => props.onChange(e.target.value)}
              placeholder={props.placeholder}
              isDisabled={props.isDisabled}
            />
          </InputGroup>
        );

      case 'select':
        return (
          <Select
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            isDisabled={props.isDisabled}
          >
            {props.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );

      case 'textarea':
        return (
          <Textarea
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            rows={props.rows}
            isDisabled={props.isDisabled}
          />
        );

      case 'switch':
        return (
          <Switch
            isChecked={props.value}
            onChange={(e) => props.onChange(e.target.checked)}
            isDisabled={props.isDisabled}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FormControl isInvalid={!!props.error} isRequired={props.isRequired}>
      <FormLabel>{props.label}</FormLabel>
      {renderInput()}
      {props.error && <FormErrorMessage>{props.error}</FormErrorMessage>}
      {props.helperText && (
        <Text fontSize="sm" color={textColor} mt={1}>
          {props.helperText}
        </Text>
      )}
    </FormControl>
  );
} 