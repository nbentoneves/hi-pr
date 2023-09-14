import { ReactNode } from 'react';
import { QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { Store } from 'redux';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import '../assets/css/index.css';
import { buildStoreWithPersist, queryClient } from './test-utils';

const mount = (
  children: ReactNode,
  builtStore: Store = buildStoreWithPersist(),
) => {
  const persistor = persistStore(builtStore);

  cy.mount(
    <Provider store={builtStore}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <HashRouter>{children}</HashRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>,
  );
};

export const ComponentTest = {
  mount,
};
