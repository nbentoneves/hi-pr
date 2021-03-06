import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { ORGANIZATION_PREFERENCES } from './constants';

import { organizationPreferencesReducer } from './feature/organizationPreferencesSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const makeRootReducer = combineReducers({
  [ORGANIZATION_PREFERENCES]: organizationPreferencesReducer,
});

const persistedReducer = persistReducer(persistConfig, makeRootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
