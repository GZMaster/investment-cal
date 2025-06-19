import { useStoreState, useStoreActions } from 'easy-peasy';

export function useShoppingStore() {
  // Shopping list state
  const items = useStoreState((state: any) => state.items);
  const totalBudget = useStoreState((state: any) => state.totalBudget);
  const currency = useStoreState((state: any) => state.currency);
  const categories = useStoreState((state: any) => state.categories);

  // Shopping list actions
  const addItem = useStoreActions((actions: any) => actions.addItem);
  const updateItem = useStoreActions((actions: any) => actions.updateItem);
  const removeItem = useStoreActions((actions: any) => actions.removeItem);
  const toggleItem = useStoreActions((actions: any) => actions.toggleItem);
  const clearCompleted = useStoreActions((actions: any) => actions.clearCompleted);
  const setTotalBudget = useStoreActions((actions: any) => actions.setTotalBudget);
  const setCurrency = useStoreActions((actions: any) => actions.setCurrency);
  const addCategory = useStoreActions((actions: any) => actions.addCategory);
  const removeCategory = useStoreActions((actions: any) => actions.removeCategory);
  const clearAllData = useStoreActions((actions: any) => actions.clearAllData);

  return {
    // State
    items,
    totalBudget,
    currency,
    categories,

    // Actions
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
  };
} 