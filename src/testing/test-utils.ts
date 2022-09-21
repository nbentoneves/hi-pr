import { configureStore } from '@reduxjs/toolkit';
import { QueryClient } from 'react-query';
import { combineReducers } from 'redux';
import persistReducer from 'redux-persist/lib/persistReducer';
import storage from 'redux-persist/lib/storage';
import { githubReducer } from '../store/feature/githubSlice';
import { GITHUB_CONFIGURATIONS } from '../store/constants';

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
    [GITHUB_CONFIGURATIONS]: githubReducer,
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
    [GITHUB_CONFIGURATIONS]: githubReducer,
  });

  return configureStore({
    reducer: makeRootReducer,
    preloadedState: storeSlice && {
      [storeSlice.name]: storeSlice.initialState,
    },
  });
};
