# Development Guide 🛠️

This guide is for developers who want to contribute to the Investment Tools Suite project.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Getting Started 🚀

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended (with extensions below)

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/investment-cal.git
   cd investment-cal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

### Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm start` | Start production server |

## Project Architecture 🏗️

### Directory Structure

```
src/
├── assets/              # Static assets (images, icons)
├── components/          # Reusable UI components
│   ├── AnalysisSection.tsx
│   ├── PlatformConfigModal.tsx
│   ├── PlatformConfigWidget.tsx
│   └── ...
├── hooks/               # Custom React hooks
│   ├── usePlatformStore.ts
│   ├── useShoppingStore.ts
│   └── useExchangeRate.ts
├── pages/               # Page components (routes)
│   ├── LandingPage.tsx
│   ├── CalculatorPage.tsx
│   ├── BudgetAnalysisPage.tsx
│   └── ...
├── store/               # State management
│   ├── global-store.ts
│   ├── platform-store.ts
│   └── shopping-store.ts
├── types/               # TypeScript type definitions
│   ├── investment.ts
│   ├── platform.ts
│   ├── shopping.ts
│   └── budget.ts
├── utils/               # Utility functions
│   ├── investment-calculator.ts
│   ├── platform-utils.ts
│   └── three-tier-calculator.ts
├── constants/           # Application constants
│   └── investment.ts
├── theme.ts             # Chakra UI theme configuration
└── main.tsx             # Application entry point
```

### State Management Architecture

The application uses a modular store architecture with Easy Peasy:

```typescript
// Global store combines multiple domain stores
const globalStore = {
  ...platformStore,    // Platform configuration
  ...shoppingStore,    // Shopping list management
};
```

### Component Architecture

#### Component Structure Pattern

```typescript
// 1. Imports
import { ... } from '@chakra-ui/react';
import { ... } from 'react';
import type { ComponentProps } from '../types/component';

// 2. Interface definition
interface ComponentProps {
  // Props definition
}

// 3. Main component
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}

// 4. Sub-components (if any)
function SubComponent() {
  // Sub-component logic
}

// 5. Helper functions
function helperFunction() {
  // Helper logic
}
```

#### Hook Pattern

```typescript
// Custom hooks for state management
export function useCustomHook() {
  const state = useStoreState((state: any) => state.someState);
  const actions = useStoreActions((actions: any) => actions.someAction);
  
  return {
    state,
    actions,
  };
}
```

## Development Workflow 🔄

### Feature Development

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow Naming Conventions**
   - Branches: `feature/`, `bugfix/`, `hotfix/`
   - Commits: Use conventional commit format
   - Files: kebab-case for files, PascalCase for components

3. **Development Process**
   - Write code following standards
   - Test functionality thoroughly
   - Update documentation if needed
   - Commit frequently with clear messages

4. **Testing**
   - Test in multiple browsers
   - Verify responsive design
   - Check accessibility
   - Validate calculations

5. **Pull Request**
   - Create detailed PR description
   - Include screenshots if UI changes
   - Reference related issues
   - Request code review

### Commit Message Format

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:

```
feat(platform): add floating configuration widget
fix(calculator): resolve exchange rate calculation error
docs(readme): update installation instructions
refactor(store): separate platform and shopping stores
```

### Code Review Process

1. **Self Review**
   - Check code against standards
   - Test all functionality
   - Verify no console errors
   - Ensure responsive design

2. **Peer Review**
   - Request review from team members
   - Address feedback promptly
   - Update code as needed
   - Resolve conflicts if any

3. **Merge**
   - Squash commits if needed
   - Update version if required
   - Deploy to staging for testing

## Code Standards 📋

### TypeScript Standards

#### Type Definitions

```typescript
// Use interfaces for object shapes
interface UserConfig {
  name: string;
  email: string;
  preferences: UserPreferences;
}

// Use types for unions and complex types
type Currency = 'NGN' | 'USD';
type InvestmentStrategy = 'single-tier' | 'two-tier' | 'three-tier';

// Use enums sparingly, prefer const objects
const INVESTMENT_TYPES = {
  SAVINGS: 'savings',
  INVESTMENT: 'investment',
  DEBT: 'debt',
} as const;
```

#### Component Props

```typescript
// Define props interface
interface ComponentProps {
  title: string;
  description?: string;
  onAction: (data: ActionData) => void;
  isDisabled?: boolean;
}

// Use destructuring with defaults
export function Component({ 
  title, 
  description = '', 
  onAction, 
  isDisabled = false 
}: ComponentProps) {
  // Component logic
}
```

### React Standards

#### Functional Components

```typescript
// Use functional components with hooks
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  const [state, setState] = useState(initialState);
  const { data, isLoading } = useCustomHook();
  
  const handleClick = useCallback(() => {
    // Handle click logic
  }, [dependencies]);
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <Box>
      {/* JSX content */}
    </Box>
  );
}
```

#### Hook Usage

```typescript
// Custom hooks for complex logic
export function useInvestmentCalculator(scenario: InvestmentScenario) {
  const [result, setResult] = useState<InvestmentResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const calculate = useCallback(async () => {
    setIsCalculating(true);
    try {
      const calculatedResult = await calculateInvestment(scenario);
      setResult(calculatedResult);
    } catch (error) {
      console.error('Calculation failed:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [scenario]);
  
  return { result, isCalculating, calculate };
}
```

### Styling Standards

#### Chakra UI Usage

```typescript
// Use Chakra UI components consistently
import { Box, VStack, HStack, Text, Button } from '@chakra-ui/react';

// Use responsive values
<Box p={{ base: 4, md: 6, lg: 8 }}>
  <VStack spacing={4} align="stretch">
    <Text fontSize={{ base: "sm", md: "md" }}>
      Content
    </Text>
  </VStack>
</Box>

// Use theme colors
<Button colorScheme="blue" variant="solid">
  Action
</Button>
```

#### Responsive Design

```typescript
// Use responsive arrays and objects
const responsiveProps = {
  columns: { base: 1, md: 2, lg: 3 },
  spacing: { base: 4, md: 6 },
  fontSize: { base: "sm", md: "md", lg: "lg" },
};

// Use useBreakpointValue for complex responsive logic
const chartHeight = useBreakpointValue({ base: '250px', md: '350px' });
```

### Error Handling

#### Try-Catch Blocks

```typescript
// Handle errors gracefully
const handleAction = async () => {
  try {
    setIsLoading(true);
    const result = await performAction();
    setData(result);
  } catch (error) {
    console.error('Action failed:', error);
    toast({
      title: 'Error',
      description: 'Failed to perform action',
      status: 'error',
    });
  } finally {
    setIsLoading(false);
  }
};
```

#### Error Boundaries

```typescript
// Create error boundaries for components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Testing 🧪

### Testing Strategy

#### Unit Tests

```typescript
// Test utility functions
describe('formatCurrency', () => {
  it('formats NGN currency correctly', () => {
    expect(formatCurrency(1000000)).toBe('₦1,000,000');
  });
  
  it('formats USD currency correctly', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000');
  });
});
```

#### Component Tests

```typescript
// Test component rendering and interactions
describe('InvestmentCalculator', () => {
  it('renders calculator form', () => {
    render(<InvestmentCalculator />);
    expect(screen.getByLabelText(/principal/i)).toBeInTheDocument();
  });
  
  it('calculates investment correctly', async () => {
    render(<InvestmentCalculator />);
    // Test calculation logic
  });
});
```

#### Integration Tests

```typescript
// Test component interactions
describe('Platform Configuration', () => {
  it('saves platform settings', async () => {
    render(<PlatformConfigModal isOpen={true} onClose={jest.fn()} />);
    
    fireEvent.change(screen.getByLabelText(/platform name/i), {
      target: { value: 'MyPlatform' },
    });
    
    fireEvent.click(screen.getByText(/save configuration/i));
    
    // Verify settings are saved
  });
});
```

### Manual Testing Checklist

- [ ] **Cross-browser Testing**
  - Chrome, Firefox, Safari, Edge
  - Mobile browsers (iOS Safari, Chrome Mobile)

- [ ] **Responsive Design**
  - Desktop (1920x1080, 1366x768)
  - Tablet (768x1024, 1024x768)
  - Mobile (375x667, 414x896)

- [ ] **Accessibility**
  - Keyboard navigation
  - Screen reader compatibility
  - Color contrast ratios
  - ARIA labels

- [ ] **Performance**
  - Page load times
  - Component rendering
  - Memory usage
  - Network requests

## Deployment 🚀

### Build Process

1. **Production Build**

   ```bash
   npm run build
   ```

2. **Preview Build**

   ```bash
   npm run preview
   ```

3. **Deploy to Vercel**

   ```bash
   vercel --prod
   ```

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.local (development)
VITE_API_URL=http://localhost:3000
VITE_EXCHANGE_RATE_API=https://api.exchangerate-api.com

# .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_EXCHANGE_RATE_API=https://api.exchangerate-api.com
```

### Deployment Checklist

- [ ] **Build Verification**
  - No build errors
  - All assets included
  - Correct environment variables

- [ ] **Functionality Testing**
  - All features work correctly
  - No console errors
  - Proper error handling

- [ ] **Performance Testing**
  - Page load times acceptable
  - Bundle size optimized
  - Images optimized

- [ ] **SEO Verification**
  - Meta tags correct
  - Open Graph tags set
  - Sitemap generated

## Troubleshooting 🔧

### Common Development Issues

#### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check

# Fix linting issues
npm run lint --fix
```

#### Runtime Errors

```bash
# Check browser console for errors
# Verify all imports are correct
# Check for missing dependencies
```

#### Performance Issues

```bash
# Analyze bundle size
npm run build -- --analyze

# Check for memory leaks
# Optimize component re-renders
```

### Debugging Tips

1. **Use React DevTools**
   - Install React Developer Tools extension
   - Monitor component state and props
   - Profile component performance

2. **Use Browser DevTools**
   - Network tab for API calls
   - Console for errors and logs
   - Performance tab for bottlenecks

3. **Use VS Code Debugger**
   - Set breakpoints in TypeScript code
   - Debug React components
   - Step through calculations

### Getting Help

1. **Check Documentation**
   - README.md
   - API.md
   - User Guide

2. **Search Issues**
   - GitHub issues
   - Stack Overflow
   - Community forums

3. **Ask for Help**
   - Create detailed issue reports
   - Include error messages and steps
   - Provide code examples

---

**Happy coding!** 🎉 For more information, check out our [API Documentation](API.md) and [User Guide](USER_GUIDE.md).
