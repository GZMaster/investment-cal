import { createStore } from 'easy-peasy';
import { platformStore } from './platform-store';
import { shoppingStore } from './shopping-store';

// Combine both stores into a global store
const globalStore = {
  // Platform store
  ...platformStore,

  // Shopping store
  ...shoppingStore,
};

export const store = createStore(globalStore); 