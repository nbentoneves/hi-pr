import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import persistReducer from 'redux-persist/lib/persistReducer';
import storage from 'redux-persist/lib/storage';
import '../assets/css/index.css';
import { GLOBAL } from '../store/constants';
import { globalReducer } from '../store/feature/globalSlice';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export interface StoreSlice {
  name: string;
  initialState: any;
}

const buildStoreWithProvidedSlice = (storeSlice?: StoreSlice) => {
  const persistConfig = {
    key: 'root',
    storage,
  };

  const makeRootReducer = combineReducers({
    [GLOBAL]: globalReducer,
  });

  const persistedReducer = persistReducer(persistConfig, makeRootReducer);

  return configureStore({
    reducer: persistedReducer,
    preloadedState: storeSlice && {
      [storeSlice.name]: storeSlice.initialState,
    },
  });
};

export const mount = (children: ReactNode, storeSlice?: StoreSlice) => {
  const builtStore = buildStoreWithProvidedSlice(storeSlice);

  const persistor = persistStore(builtStore);

  cy.mount(
    <Provider store={builtStore}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </PersistGate>
    </Provider>,
  );
};
