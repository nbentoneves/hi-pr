import { configureStore } from '@reduxjs/toolkit';
import { QueryClient } from 'react-query';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/lib/persistReducer';
import { GLOBAL } from 'src/store/constants';
import { globalReducer } from '../store/feature/globalSlice';

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

export const buildStore = (storeSlice?: StoreSlice) => {
  const makeRootReducer = combineReducers({
    [GLOBAL]: globalReducer,
  });

  return configureStore({
    reducer: makeRootReducer,
    preloadedState: storeSlice && {
      [storeSlice.name]: storeSlice.initialState,
    },
  });
};
