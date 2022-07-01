import App from './App';
import { render, screen } from './testing/test-unit-render';

const today = new Date();

jest.mock('./components/Preferences', () => {
  return {
    __esModule: true,
    default: () => <div>hello-content</div>,
  };
});
jest.mock('./assets/images/logo.png');

describe('App render component', () => {
  it('check content section', async () => {
    render(<App />);

    expect(
      screen.queryByText(`Designed by © Hi-PR! ${today.getFullYear()}`),
    ).toBeVisible();
  });

  it('check footer section', async () => {
    render(<App />);

    expect(screen.queryByText('hello-content')).toBeVisible();
  });
});
