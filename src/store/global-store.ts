import { createStore } from 'easy-peasy';
import { platformStore } from './platform-store';
import { shoppingStore } from './shopping-store';
import { cryptoStore } from './crypto-store';

// Combine all stores into a global store
const globalStore = {
  // Platform store
  ...platformStore,

  // Shopping store
  ...shoppingStore,

  // Crypto store
  ...cryptoStore,
};

export const store = createStore(globalStore); 