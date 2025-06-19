import {
  Box,
  Container,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { BackButton } from '../components/BackButton';
import { Header } from '../components/Header';
import { SEO } from '../components/SEO';
import { ShoppingListForm } from '../components/ShoppingListForm';
import { ShoppingListDisplay } from '../components/ShoppingListDisplay';
import { ShoppingListSummary } from '../components/ShoppingListSummary';
import { BudgetSettings } from '../components/BudgetSettings';

export function ShoppingListPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Helmet>
        <title>Shopping List Manager | Investment Tools Suite</title>
        <meta name="description" content="Manage your shopping list with price tracking, categories, and budget management. Keep track of items you want to buy and their costs." />
        <meta property="og:title" content="Shopping List Manager | Investment Tools Suite" />
        <meta property="og:description" content="Manage your shopping list with price tracking, categories, and budget management. Keep track of items you want to buy and their costs." />
      </Helmet>
      <Container maxW="container.xl">
        <BackButton />
        <SEO
          title="Shopping List Manager"
          description="Manage your shopping list with price tracking, categories, and budget management. Keep track of items you want to buy and their costs."
          keywords={[
            'shopping list',
            'budget management',
            'price tracking',
            'shopping planner',
            'expense tracking',
            'financial planning',
          ]}
        />

        <VStack spacing={8} align="stretch">
          <Header
            title="Shopping List Manager"
            description="Manage your shopping list with price tracking, categories, and budget management. Keep track of items you want to buy and their costs."
          />

          <ShoppingListSummary />
          <BudgetSettings />
          <ShoppingListForm />
          <ShoppingListDisplay />
        </VStack>
      </Container>
    </Box>
  );
} 