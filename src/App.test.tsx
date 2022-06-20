import App from './App';
import Preferences from './components/Preferences';
import { render, screen } from './testing/test-unit-render';

const today = new Date();

jest.mock('./components/Preferences');

describe('App render component', () => {
  it('check content section', async () => {
    render(<App />);

    expect(
      screen.queryByText(`Designed by © Hi-PR! ${today.getFullYear()}`),
    ).toBeVisible();
  });

  it('check footer section', async () => {
    (Preferences as jest.MockedFunction<typeof Preferences>).mockImplementation(
      () => <div>hello-content</div>,
    );

    render(<App />);

    expect(screen.queryByText('hello-content')).toBeVisible();
  });
});
