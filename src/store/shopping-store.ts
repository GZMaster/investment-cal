import { action } from 'easy-peasy';
import type { ShoppingItem } from '../types/shopping';

// Local storage keys for shopping list
const SHOPPING_STORAGE_KEYS = {
  ITEMS: 'shopping-list-items',
  BUDGET: 'shopping-list-budget',
  CURRENCY: 'shopping-list-currency',
  CATEGORIES: 'shopping-list-categories',
};

// Helper functions for localStorage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

const clearShoppingStorage = () => {
  try {
    for (const key of Object.values(SHOPPING_STORAGE_KEYS)) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

// Load initial data from localStorage
const loadItems = (): ShoppingItem[] => {
  const storedItems = loadFromStorage(SHOPPING_STORAGE_KEYS.ITEMS, []);
  return storedItems.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
  }));
};

const loadBudget = (): number => loadFromStorage(SHOPPING_STORAGE_KEYS.BUDGET, 1000000);
const loadCurrency = (): 'NGN' | 'USD' => loadFromStorage(SHOPPING_STORAGE_KEYS.CURRENCY, 'NGN');
const loadCategories = (): string[] => loadFromStorage(SHOPPING_STORAGE_KEYS.CATEGORIES, [
  'Electronics', 'Clothing', 'Food', 'Home', 'Transport', 'Entertainment'
]);

export const shoppingStore = {
  // State - Load from localStorage or use defaults
  items: loadItems(),
  totalBudget: loadBudget(),
  currency: loadCurrency(),
  categories: loadCategories(),

  // Shopping List Actions
  addItem: action((state: any, payload: Omit<ShoppingItem, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newItem: ShoppingItem = {
      ...payload,
      id: Date.now().toString(),
      createdAt: new Date(),
      isCompleted: false,
    };
    state.items.push(newItem);
    saveToStorage(SHOPPING_STORAGE_KEYS.ITEMS, state.items);
  }),

  updateItem: action((state: any, payload: { id: string; updates: Partial<ShoppingItem> }) => {
    const { id, updates } = payload;
    const itemIndex = state.items.findIndex((item: ShoppingItem) => item.id === id);
    if (itemIndex !== -1) {
      state.items[itemIndex] = { ...state.items[itemIndex], ...updates };
      saveToStorage(SHOPPING_STORAGE_KEYS.ITEMS, state.items);
    }
  }),

  removeItem: action((state: any, payload: string) => {
    state.items = state.items.filter((item: ShoppingItem) => item.id !== payload);
    saveToStorage(SHOPPING_STORAGE_KEYS.ITEMS, state.items);
  }),

  toggleItem: action((state: any, payload: string) => {
    const item = state.items.find((item: ShoppingItem) => item.id === payload);
    if (item) {
      item.isCompleted = !item.isCompleted;
      item.completedAt = item.isCompleted ? new Date() : undefined;
      saveToStorage(SHOPPING_STORAGE_KEYS.ITEMS, state.items);
    }
  }),

  clearCompleted: action((state: any) => {
    state.items = state.items.filter((item: ShoppingItem) => !item.isCompleted);
    saveToStorage(SHOPPING_STORAGE_KEYS.ITEMS, state.items);
  }),

  setTotalBudget: action((state: any, payload: number) => {
    state.totalBudget = payload;
    saveToStorage(SHOPPING_STORAGE_KEYS.BUDGET, payload);
  }),

  setCurrency: action((state: any, payload: 'NGN' | 'USD') => {
    state.currency = payload;
    saveToStorage(SHOPPING_STORAGE_KEYS.CURRENCY, payload);
  }),

  addCategory: action((state: any, payload: string) => {
    if (!state.categories.includes(payload)) {
      state.categories.push(payload);
      saveToStorage(SHOPPING_STORAGE_KEYS.CATEGORIES, state.categories);
    }
  }),

  removeCategory: action((state: any, payload: string) => {
    state.categories = state.categories.filter((category: string) => category !== payload);
    saveToStorage(SHOPPING_STORAGE_KEYS.CATEGORIES, state.categories);
  }),

  clearAllData: action((state: any) => {
    state.items = [];
    state.totalBudget = 1000000;
    state.currency = 'NGN';
    state.categories = ['Electronics', 'Clothing', 'Food', 'Home', 'Transport', 'Entertainment'];
    clearShoppingStorage();
  }),
}; 