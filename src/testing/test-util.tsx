import { render } from '@testing-library/react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const AllTheProviders = ({ children }: Props) => {
  return <div>{children}</div>;
};

const customRender = (ui: any, options?: any) => {
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
