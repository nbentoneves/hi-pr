import { ReactNode } from 'react';
import { QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import '../assets/css/index.css';
import { buildStoreWithPersist, queryClient, StoreSlice } from './test-utils';

export const mount = (children: ReactNode, storeSlice?: StoreSlice) => {
  const builtStore = buildStoreWithPersist(storeSlice);

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
