import Preferences from '.';
import { render, screen } from '../../testing/test-unit-render';

jest.mock('../OrganizationPreferences', () => {
  return {
    __esModule: true,
    default: () => <div>OrganizationPreferences component</div>,
  };
});

describe('Preferences render component', () => {
  it('mount component and dependency components', () => {
    render(<Preferences />);

    expect(
      screen.queryByText('OrganizationPreferences component'),
    ).toBeVisible();
  });

  it('tab labels', () => {
    render(<Preferences />);

    expect(screen.queryByText('Public')).toBeVisible();
    expect(screen.queryByText('Organization')).toBeVisible();
  });
});
