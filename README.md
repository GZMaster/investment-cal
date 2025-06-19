# Investment Tools Suite 🚀

A comprehensive collection of financial tools designed to help you make better investment decisions, manage your portfolio effectively, and achieve your financial goals.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)](https://investment-cal-beta.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)

## ✨ Features

### 🎯 Core Investment Tools

#### 1. **Investment Calculator** 📊

- **Single-Tier vs Two-Tier Strategy Comparison**: Analyze different investment approaches with detailed side-by-side comparisons
- **Real-time Exchange Rates**: Live USD/NGN rates integration with automatic updates
- **Dynamic Platform Configuration**: Customize platform names and settings to match your actual platforms
- **Detailed Analysis**: ROI calculations, currency gains, and comprehensive performance metrics
- **Interactive Visualizations**: Charts, graphs, and comparison cards for better insights
- **Monthly Breakdowns**: Track performance month by month with detailed tables

#### 2. **3-Tier Investment Strategy** 🏗️

- **Multi-Platform Strategy**: Combine savings platform, USD investment platform, and vehicle investments
- **Comprehensive Analysis**: 24-month detailed breakdown with monthly performance tracking
- **Dynamic Platform Names**: Personalized platform configuration throughout the analysis
- **Advanced Calculations**: Interest reinvestment strategies, currency appreciation, and investment cycle management
- **Visual Reports**: Multiple chart types including line charts, bar charts, and detailed tables
- **Strategy Insights**: Detailed explanations of each tier's contribution to overall returns

#### 3. **Asset Analysis Tool** 📈

- **Vehicle Investment Analysis**: Calculate returns on vehicle investments with detailed ROI breakdowns
- **Monthly Breakdown**: Track savings, returns, and investment cycles over time
- **ROI Calculations**: Detailed return on investment analysis with performance metrics
- **Investment Planning**: Optimize your investment strategy with customizable parameters
- **Visual Charts**: Interactive charts showing investment growth and returns
- **Cycle Management**: Track investment cycles and completion rates

### 💰 Financial Management Tools

#### 4. **Budget Analysis Tool** 💳

- **Multi-Platform Tracking**: Monitor balances across different platforms with real-time updates
- **Debt Management**: Track and manage your debt effectively with allocation planning
- **Allocation Planning**: Plan your weekly and monthly allocations with detailed breakdowns
- **Visual Progress Tracking**: Charts, progress indicators, and visual representations of your financial status
- **Exchange Rate Integration**: Handle USD and NGN currencies with automatic conversions
- **Monthly Planning**: Plan allocations for specific months with detailed tables and charts

#### 5. **Shopping List Manager** 🛒

- **Smart Budget Management**: Track spending against budgets with real-time updates
- **Category Organization**: Organize items by categories (Electronics, Clothing, Food, etc.)
- **Price Tracking**: Monitor item prices and total costs with detailed breakdowns
- **Completion Tracking**: Mark items as purchased with timestamps and progress tracking
- **Currency Support**: Multiple currency support (NGN/USD) with automatic formatting
- **Statistics Dashboard**: View spending summaries, budget utilization, and purchase patterns
- **Priority Management**: Set priority levels (Low, Medium, High) for better organization

### 🔧 Platform Features

#### **Global Platform Configuration** ⚙️

- **Customizable Platform Names**: Set your own platform names (PiggyVest, RiseVest, Cowrywise, etc.)
- **Persistent Settings**: Settings saved in localStorage with automatic page reload on changes
- **Floating Configuration Widget**: Easy access to platform settings from any page
- **Dynamic UI Updates**: All components update with your platform names throughout the application
- **Currency Configuration**: Set default currency and exchange rates for calculations
- **Platform Types**: Configure savings, investment, and debt platforms with different currencies

## 🛠️ Available Tools Summary

The Investment Tools Suite includes **5 comprehensive tools** designed to help you manage your investments and finances:

| Tool | Purpose | Key Features |
|------|---------|--------------|
| **Investment Calculator** | Compare investment strategies | Single vs Two-tier analysis, Real-time rates |
| **3-Tier Strategy** | Multi-platform investment planning | Savings + USD + Vehicle investments |
| **Asset Analysis** | Vehicle investment tracking | ROI calculations, Cycle management |
| **Budget Analysis** | Multi-platform financial tracking | Debt management, Allocation planning |
| **Shopping List** | Budget and purchase management | Category organization, Priority tracking |

All tools feature **dynamic platform configuration**, **real-time data integration**, and **comprehensive visualizations** to help you make informed financial decisions.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Installation

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

4. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

### Frontend

- **React 18.2** - Modern React with hooks and concurrent features
- **TypeScript 5.2** - Type-safe development
- **Chakra UI 2.8** - Modern, accessible component library
- **React Router 7.6** - Client-side routing
- **Framer Motion 11.0** - Smooth animations

### State Management & Data

- **Easy Peasy 6.1** - Simple state management
- **React Query 5.77** - Server state management and caching
- **LocalStorage** - Persistent data storage

### Visualization & Charts

- **Recharts 2.15** - Composable charting library
- **Chart.js 4.4** - Flexible charting library
- **React Chart.js 2 5.3** - React wrapper for Chart.js

### Development Tools

- **Vite 5.1** - Fast build tool and dev server
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Biome** - Code formatting

## 📁 Project Structure

```
investment-cal/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, and static files
│   │   ├── AnalysisSection.tsx
│   │   ├── PlatformConfigModal.tsx
│   │   ├── PlatformConfigWidget.tsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── usePlatformStore.ts
│   │   ├── useShoppingStore.ts
│   │   └── useExchangeRate.ts
│   ├── pages/             # Page components
│   │   ├── LandingPage.tsx
│   │   ├── CalculatorPage.tsx
│   │   ├── BudgetAnalysisPage.tsx
│   │   └── ...
│   ├── store/             # State management
│   │   ├── global-store.ts
│   │   ├── platform-store.ts
│   │   └── shopping-store.ts
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── theme.ts           # Chakra UI theme
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── package.json
```

## 🔧 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm start` | Start production server |

### Code Style & Standards

- **TypeScript**: Strict type checking enabled
- **Functional Components**: Use hooks and functional patterns
- **Component Structure**: Exported component, subcomponents, helpers, types
- **Naming Conventions**:
  - PascalCase for components
  - camelCase for variables and functions
  - kebab-case for files and directories
- **Error Handling**: Proper error boundaries and user feedback
- **Accessibility**: ARIA labels and semantic HTML

## 🌟 Key Features Explained

### Platform Configuration System

The app includes a sophisticated platform configuration system that allows users to:

- **Customize Platform Names**: Change default names like "PiggyVest" to your preferred platform
- **Persistent Settings**: All settings are saved in localStorage
- **Global Integration**: Platform names update throughout the entire application
- **Floating Widget**: Easy access to configuration from any page

### Investment Analysis Tools

#### Investment Calculator

- Compare single-tier (compound interest) vs two-tier (USD investment) strategies
- Real-time exchange rate integration
- Detailed ROI and currency gain calculations
- Interactive charts and visualizations

#### 3-Tier Strategy

- Combines savings platform, USD investment platform, and vehicle investments
- 24-month detailed analysis with monthly breakdowns
- Interest reinvestment strategies
- Currency appreciation calculations

### Budget Management

- Multi-platform balance tracking
- Weekly and monthly allocation planning
- Debt management and tracking
- Visual progress indicators and charts

## 📈 Version History

### v1.2.0 (Current)

- ✨ Global platform configuration system
- 🎨 Improved UI/UX with floating configuration widget
- 🔧 Refactored store architecture for better maintainability
- 📊 Enhanced 3-tier strategy analysis
- 🛒 Shopping list manager with budget tracking
- 📱 Improved responsive design

### v1.1.0

- 📊 Added 3-tier investment strategy analysis
- 🚗 Vehicle investment analysis tool
- 📈 Enhanced charts and visualizations
- 🔄 Real-time exchange rate integration

### v1.0.0

- 🎯 Initial release with investment calculator
- 💰 Budget analysis tool
- 📱 Responsive design
- 🔍 SEO optimization

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes following the code style guidelines
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Code of Conduct

- Be respectful and inclusive
- Follow TypeScript best practices
- Write clear, documented code
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Chakra UI](https://chakra-ui.com/) - Beautiful, accessible component library
- [React Query](https://tanstack.com/query) - Powerful data fetching
- [Vite](https://vitejs.dev/) - Lightning fast build tool
- [Recharts](https://recharts.org/) - Composable charting library
- [Easy Peasy](https://easy-peasy.vercel.app/) - Simple state management

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/investment-cal/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/investment-cal/discussions)
- **Email**: <your-email@example.com>

---

**Made with ❤️ for better financial decisions**
