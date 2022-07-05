import { configureStore } from '@reduxjs/toolkit';
import { QueryClient } from 'react-query';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/lib/persistReducer';
import { ORGANIZATION_PREFERENCES } from '../store/constants';
import { organizationPreferencesReducer } from '../store/feature/organizationPreferencesSlice';

export const queryClient = new QueryClient({
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

export const buildStoreWithPersist = (storeSlice?: StoreSlice) => {
  const persistConfig = {
    key: 'root',
    storage,
  };

  const makeRootReducer = combineReducers({
    [ORGANIZATION_PREFERENCES]: organizationPreferencesReducer,
  });

  const persistedReducer = persistReducer(persistConfig, makeRootReducer);

  return configureStore({
    reducer: persistedReducer,
    preloadedState: storeSlice && {
      [storeSlice.name]: storeSlice.initialState,
    },
  });
};

export const buildStore = (storeSlice?: StoreSlice) => {
  const makeRootReducer = combineReducers({
    [ORGANIZATION_PREFERENCES]: organizationPreferencesReducer,
  });

  return configureStore({
    reducer: makeRootReducer,
    preloadedState: storeSlice && {
      [storeSlice.name]: storeSlice.initialState,
    },
  });
};
