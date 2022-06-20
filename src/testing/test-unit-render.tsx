import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { buildStore, queryClient, StoreSlice } from './test-utils';

type Props = {
  children: ReactNode;
};

const customRender = (
  ui: ReactElement,
  storeSlice?: StoreSlice,
  options?: Omit<RenderOptions, 'queries'>,
) => {
  const AllTheProviders = ({ children }: Props) => {
    const builtStore = buildStore(storeSlice);

    return (
      <Provider store={builtStore}>
        <QueryClientProvider client={queryClient}>
          {children}
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
