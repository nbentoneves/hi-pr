import App from './App';
import { render, screen } from './testing/test-unit-render';

const today = new Date();

jest.mock('./components/Preferences', () => ({
  _esModule: true,
  Preferences: () => <div>hello-content</div>,
}));

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
