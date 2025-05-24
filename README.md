# Investment Strategy Calculator

A modern web application that helps users compare different investment strategies, specifically focusing on Naira and USD investments with currency appreciation considerations.

## Features

- **Two-Tier Investment Strategy Comparison**
  - Strategy A: Compound interest in PiggyVest (18% p.a.)
  - Strategy B: Two-tier approach with PiggyVest and RiseVest (8% p.a. USD)
  - Monthly savings of 1M Naira
  - Initial investment of 10M Naira

- **Interactive Parameters**
  - Time period selection (1-4 years)
  - USD appreciation rate scenarios (0-25%)
  - Real-time calculations and updates

- **Detailed Analysis**
  - Monthly breakdown of investments
  - PiggyVest balance tracking
  - USD portfolio growth
  - Currency appreciation impact
  - Breakeven analysis
  - Comparative performance metrics

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **UI Library**: Chakra UI
- **Build Tool**: Vite
- **Development Tools**:
  - ESLint for code quality
  - TypeScript for type safety
  - Prettier for code formatting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/investment-cal.git
   cd investment-cal
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
investment-cal/
├── src/
│   ├── components/          # React components
│   │   ├── AnalysisSection.tsx
│   │   ├── BreakevenInfo.tsx
│   │   ├── ComparisonCards.tsx
│   │   ├── CurrencyInfo.tsx
│   │   ├── InvestmentCalculator.tsx
│   │   ├── InvestmentTable.tsx
│   │   ├── ScenarioSelector.tsx
│   │   └── SummarySection.tsx
│   ├── constants/          # Application constants
│   │   └── investment.ts
│   ├── types/             # TypeScript type definitions
│   │   └── investment.ts
│   ├── utils/             # Utility functions
│   │   └── investment-calculator.ts
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── theme.ts           # Chakra UI theme configuration
├── public/                # Static assets
├── index.html            # HTML entry point
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Investment Calculations

### PiggyVest Strategy

- Initial investment: 10M Naira
- Annual interest rate: 18%
- Monthly savings: 1M Naira
- Interest compounds monthly

### RiseVest Strategy

- Converts PiggyVest interest to USD
- USD interest rate: 8% p.a.
- Exchange rate: 1650 Naira/USD
- Considers USD appreciation scenarios

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Style

- Follows TypeScript best practices
- Uses functional components
- Implements proper type safety
- Follows Chakra UI design patterns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Chakra UI for the component library
- Vite for the build tool
- React team for the amazing framework
