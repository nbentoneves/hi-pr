import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { Store } from 'redux';
import { buildStore, queryClient } from './test-utils';

type Props = {
  children: ReactNode;
};

const customRender = (
  ui: ReactElement,
  builtStore: Store = buildStore(),
  options?: Omit<RenderOptions, 'queries'>,
) => {
  const AllTheProviders = ({ children }: Props) => {
    return (
      <Provider store={builtStore}>
        <QueryClientProvider client={queryClient}>
          <HashRouter>{children}</HashRouter>
        </QueryClientProvider>
      </Provider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

/*
const customHookRender = (ui: any, options: any) => {
  return renderHook(ui, { wrapper: AllTheProviders, ...options });
};
*/

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
