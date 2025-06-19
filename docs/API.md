# API Documentation 📚

This document provides comprehensive documentation for the Investment Tools Suite API and internal architecture.

## Table of Contents

- [Store Architecture](#store-architecture)
- [Platform Configuration API](#platform-configuration-api)
- [Shopping List API](#shopping-list-api)
- [Investment Calculator API](#investment-calculator-api)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)

## Store Architecture 🏗️

The application uses a modular store architecture with Easy Peasy for state management.

### Global Store Structure

```typescript
// src/store/global-store.ts
const globalStore = {
  // Platform store
  ...platformStore,
  
  // Shopping store
  ...shoppingStore,
};
```

### Store Modules

#### Platform Store (`src/store/platform-store.ts`)

Manages platform configuration and settings.

**State:**

```typescript
platformSettings: GlobalPlatformSettings
```

**Actions:**

- `updatePlatformSettings(payload: Partial<GlobalPlatformSettings>)`
- `updatePrimarySavingsPlatform(payload: PlatformConfig)`
- `updatePrimaryInvestmentPlatform(payload: PlatformConfig)`
- `setDefaultCurrency(payload: 'NGN' | 'USD')`
- `setExchangeRate(payload: number)`
- `setPlatformConfigured(payload: boolean)`
- `resetPlatformSettings()`

#### Shopping Store (`src/store/shopping-store.ts`)

Manages shopping list data and budget settings.

**State:**

```typescript
items: ShoppingItem[]
totalBudget: number
currency: 'NGN' | 'USD'
categories: string[]
```

**Actions:**

- `addItem(payload: Omit<ShoppingItem, 'id' | 'createdAt' | 'isCompleted'>)`
- `updateItem(payload: { id: string; updates: Partial<ShoppingItem> })`
- `removeItem(payload: string)`
- `toggleItem(payload: string)`
- `clearCompleted()`
- `setTotalBudget(payload: number)`
- `setCurrency(payload: 'NGN' | 'USD')`
- `addCategory(payload: string)`
- `removeCategory(payload: string)`
- `clearAllData()`

## Platform Configuration API ⚙️

### Hook: `usePlatformStore()`

Provides access to platform configuration state and actions.

```typescript
import { usePlatformStore } from '../hooks/usePlatformStore';

const {
  settings,
  updateSettings,
  updatePrimarySavingsPlatform,
  updatePrimaryInvestmentPlatform,
  setDefaultCurrency,
  setExchangeRate,
  setConfigured,
  resetToDefaults,
} = usePlatformStore();
```

### Utility Functions

#### `getSavingsPlatformName(): string`

Returns the configured name of the primary savings platform.

#### `getInvestmentPlatformName(): string`

Returns the configured name of the primary investment platform.

#### `getExchangeRate(): number`

Returns the current exchange rate (NGN/USD).

#### `getDefaultCurrency(): 'NGN' | 'USD'`

Returns the default currency setting.

#### `isPlatformConfigured(): boolean`

Returns whether the platform has been configured.

### Platform Configuration Modal

**Component:** `PlatformConfigModal`

**Props:**

```typescript
interface PlatformConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Features:**

- Configure primary savings platform name and currency
- Configure primary investment platform name and currency
- Set default currency and exchange rate
- Automatic page reload after configuration changes

## Shopping List API 🛒

### Hook: `useShoppingStore()`

Provides access to shopping list state and actions.

```typescript
import { useShoppingStore } from '../hooks/useShoppingStore';

const {
  items,
  totalBudget,
  currency,
  categories,
  addItem,
  updateItem,
  removeItem,
  toggleItem,
  clearCompleted,
  setTotalBudget,
  setCurrency,
  addCategory,
  removeCategory,
  clearAllData,
} = useShoppingStore();
```

### Shopping Item Structure

```typescript
interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  isCompleted: boolean;
  createdAt: Date;
  completedAt?: Date;
}
```

### Local Storage Keys

- `shopping-list-items` - Shopping items array
- `shopping-list-budget` - Total budget amount
- `shopping-list-currency` - Currency preference
- `shopping-list-categories` - Available categories

## Investment Calculator API 📊

### Investment Scenario Structure

```typescript
interface InvestmentScenario {
  timePeriod: number;
  appreciation: number;
  principal: number;
  monthlySavings: number;
  savingsPlatformAnnualRate: number;
  investmentPlatformAnnualRate: number;
  baseExchangeRate: number;
  useRealTimeRate: boolean;
}
```

### Investment Result Structure

```typescript
interface InvestmentResult {
  compoundEarnings: number;
  twoTierEarnings: number;
  currencyGain: number;
  monthlyBreakdown: MonthlyBreakdown[];
}
```

### Calculator Functions

#### `calculateInvestment(scenario: InvestmentScenario): InvestmentResult`

Calculates investment returns for both single-tier and two-tier strategies.

#### `calculateThreeTierStrategy(scenario: ThreeTierStrategyScenario): ThreeTierStrategyResult`

Calculates returns for the 3-tier investment strategy.

### Constants

```typescript
// src/constants/investment.ts
export const DEFAULT_SCENARIO: InvestmentScenario = {
  timePeriod: 1,
  appreciation: 0,
  principal: 10000000,
  monthlySavings: 1000000,
  savingsPlatformAnnualRate: 0.18,
  investmentPlatformAnnualRate: 0.08,
  baseExchangeRate: 1650,
  useRealTimeRate: false,
};

export const INVESTMENT_RANGES = {
  timePeriod: { min: 1, max: 10, step: 1 },
  appreciation: { min: 0, max: 25, step: 5 },
  principal: { min: 1000000, max: 100000000, step: 1000000 },
  monthlySavings: { min: 0, max: 10000000, step: 100000 },
  savingsPlatformAnnualRate: { min: 0.05, max: 0.3, step: 0.01 },
  investmentPlatformAnnualRate: { min: 0.05, max: 0.2, step: 0.01 },
  baseExchangeRate: { min: 1000, max: 2000, step: 50 },
};
```

## Utility Functions 🔧

### Currency Formatting

#### `formatCurrency(amount: number, currency?: 'NGN' | 'USD'): string`

Formats currency amounts with appropriate symbols and formatting.

```typescript
formatCurrency(1000000) // "₦1,000,000"
formatCurrency(1000, 'USD') // "$1,000"
```

#### `formatCurrencyShort(value: number): string`

Formats large currency amounts in abbreviated form.

```typescript
formatCurrencyShort(1000000) // "₦1.0M"
formatCurrencyShort(1500000) // "₦1.5M"
```

### Date and Time

#### `formatMonthNumber(month: number): string`

Converts month number to month name.

```typescript
formatMonthNumber(1) // "Jan"
formatMonthNumber(12) // "Dec"
```

### Exchange Rate Integration

#### Hook: `useExchangeRate()`

Fetches real-time USD/NGN exchange rates.

```typescript
const { data, isLoading, error } = useExchangeRate();
```

**Returns:**

- `data.rate` - Current exchange rate
- `isLoading` - Loading state
- `error` - Error state

## Type Definitions 📝

### Platform Types

```typescript
// src/types/platform.ts
interface PlatformConfig {
  id: string;
  name: string;
  type: 'savings' | 'investment' | 'debt';
  currency: 'NGN' | 'USD';
  description?: string;
  icon?: string;
}

interface GlobalPlatformSettings {
  primarySavingsPlatform: PlatformConfig;
  primaryInvestmentPlatform: PlatformConfig;
  defaultCurrency: 'NGN' | 'USD';
  exchangeRate: number;
  isConfigured: boolean;
}
```

### Investment Types

```typescript
// src/types/investment.ts
interface InvestmentScenario {
  timePeriod: number;
  appreciation: number;
  principal: number;
  monthlySavings: number;
  savingsPlatformAnnualRate: number;
  investmentPlatformAnnualRate: number;
  baseExchangeRate: number;
  useRealTimeRate: boolean;
}

interface ThreeTierStrategyScenario {
  initialSavingsPlatformBalance: number;
  monthlySavingsPlatformSavings: number;
  savingsPlatformInterestRate: number;
  savingsPlatformInterestReinvestPercentage: number;
  initialInvestmentPlatformBalance: number;
  investmentPlatformInterestRate: number;
  usdAppreciationRate: number;
  exchangeRate: number;
  vehicleInvestment: VehicleInvestmentConfig;
  vehiclesPerCycle: number;
  analysisPeriod: number;
}
```

### Shopping Types

```typescript
// src/types/shopping.ts
interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  isCompleted: boolean;
  createdAt: Date;
  completedAt?: Date;
}
```

### Budget Types

```typescript
// src/types/budget.ts
interface PlatformBalance {
  platformId: string;
  platformName: string;
  currentBalance: number;
  expectedBalance: number;
  debtBalance: number;
  currency: 'NGN' | 'USD';
}

interface WeeklyAllocation {
  [platformId: string]: number;
}
```

## Component API 🧩

### Platform Configuration Widget

**Component:** `PlatformConfigWidget`

**Features:**

- Floating widget for quick platform configuration access
- Shows configuration status
- Opens configuration modal
- Responsive design

### Analysis Components

#### `AnalysisSection`

Displays investment analysis results with charts and statistics.

#### `ComparisonCards`

Shows side-by-side comparison of investment strategies.

#### `SummarySection`

Displays summary statistics for investment results.

### Form Components

#### `InvestmentCalculatorForm`

Form for configuring investment calculator parameters.

#### `ThreeTierStrategyForm`

Form for configuring 3-tier investment strategy parameters.

#### `ShoppingListForm`

Form for adding new shopping list items.

### Display Components

#### `ShoppingListDisplay`

Displays shopping list items with filtering and sorting options.

#### `ShoppingListSummary`

Shows shopping list statistics and budget information.

## Error Handling 🚨

### Store Error Handling

All store actions include error handling for localStorage operations:

```typescript
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};
```

### Component Error Boundaries

Components use try-catch blocks and proper error states for:

- API calls
- Data processing
- User input validation

### User Feedback

- Toast notifications for success/error states
- Loading indicators for async operations
- Validation messages for form inputs

## Performance Optimizations ⚡

### React Query Integration

- Automatic caching of exchange rate data
- Background refetching
- Optimistic updates

### Local Storage Optimization

- Efficient serialization/deserialization
- Error handling for storage limits
- Graceful degradation

### Component Optimization

- React.memo for expensive components
- useMemo for complex calculations
- useCallback for event handlers

## Testing Strategy 🧪

### Unit Tests

- Utility functions
- Store actions
- Type definitions

### Integration Tests

- Component interactions
- Store state changes
- API integrations

### E2E Tests

- User workflows
- Cross-browser compatibility
- Performance benchmarks

---

For more detailed information about specific components or features, please refer to the individual component documentation or source code.
