import App from '../App';
import { render, screen } from '../testing/test-unit-render';

const today = new Date();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    Routes: () => <div>routes</div>,
  };
});
jest.mock('src/assets/images/logo.png');

describe('App render component', () => {
  it('check content section', () => {
    render(<App />);

    expect(
      screen.queryByText(`Designed by © Hi-PR! ${today.getFullYear()}`),
    ).toBeVisible();
  });

  it('check footer section', () => {
    render(<App />);

    expect(screen.queryByText('routes')).toBeVisible();
  });
});
