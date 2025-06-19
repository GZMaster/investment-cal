import type { Action } from 'easy-peasy';

export interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  currency: 'NGN' | 'USD';
  category?: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface ShoppingListState {
  items: ShoppingItem[];
  totalBudget: number;
  currency: 'NGN' | 'USD';
  categories: string[];
}

export interface ShoppingListActions {
  addItem: Action<ShoppingListState, Omit<ShoppingItem, 'id' | 'createdAt' | 'isCompleted'>>;
  updateItem: Action<ShoppingListState, { id: string; updates: Partial<ShoppingItem> }>;
  removeItem: Action<ShoppingListState, string>;
  toggleItem: Action<ShoppingListState, string>;
  clearCompleted: Action<ShoppingListState>;
  setTotalBudget: Action<ShoppingListState, number>;
  setCurrency: Action<ShoppingListState, 'NGN' | 'USD'>;
  addCategory: Action<ShoppingListState, string>;
  removeCategory: Action<ShoppingListState, string>;
}

export interface ShoppingListStore extends ShoppingListState, ShoppingListActions { } 