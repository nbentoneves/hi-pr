import ConfigurationForm, { FormValues } from '..';
import {
  fireEvent,
  render,
  waitFor,
} from '../../../../testing/test-unit-render';

type ComponentProps = React.ComponentProps<typeof ConfigurationForm>;

const INITIAL_VALUES = {
  isEnabled: true,
  isOrganizationOwner: false,
  name: 'config 0',
  username: 'test_username',
  owner: 'my_company',
  type: 'NONE',
  token: 'github_token',
  repository: 'my_repository',
} as FormValues;

describe('ConfigurationForm render component', () => {
  const renderComponent = (partial?: Partial<ComponentProps>) => {
    const onSaveMock = jest.fn();

    const props = {
      onSave: onSaveMock,
      initValues: INITIAL_VALUES,
      ...partial,
    };

    const component = render(<ConfigurationForm {...props} />);

    return {
      ...component,
      rerender: (newProps?: Partial<ComponentProps>) =>
        component.rerender(<ConfigurationForm {...newProps} {...props} />),
      props,
    };
  };

  /**
   * TODO: This test needs to be improved.
   * Find a way to check the repository select component
   * */
  it('default initial values', async () => {
    const { getByTestId, getByRole } = renderComponent({
      initValues: undefined,
    });

    expect(getByTestId('isEnable-switch')).toHaveAttribute('value', 'true');
    expect(getByTestId('isOrganizationOwner-switch')).toHaveAttribute(
      'value',
      'false',
    );
    expect(getByTestId('token-input')).toHaveAttribute('disabled');
    expect(getByTestId('name-input')).toHaveAttribute('value', '');
    expect(getByTestId('username-input')).toHaveAttribute('value', '');
    expect(getByTestId('owner-input')).toHaveAttribute('value', '');
    // TODO: Validate followby selection
    // expect(getByRole('option', { name: 'NONE' })).toBeInTheDocument();
    expect(getByTestId('followBy-input')).toHaveStyle({ visibility: 'hidden' });
  });

  it('save from using initial values', async () => {
    const { getByTestId, queryByText, queryByDisplayValue, props } =
      renderComponent({
        initValues: {
          ...INITIAL_VALUES,
          isOrganizationOwner: true,
          token: 'github_token',
          type: 'TEAM',
          followBy: 'test_teamname',
        },
      });

    fireEvent.submit(getByTestId('on-save-button'));

    await waitFor(() => {
      expect(props.onSave).toBeCalledTimes(1);
      expect(queryByText('Save')).toBeVisible();
      expect(queryByDisplayValue('config 0')).toBeVisible();
      expect(queryByDisplayValue('test_username')).toBeVisible();
      expect(queryByDisplayValue('my_company')).toBeVisible();
      expect(queryByDisplayValue('github_token')).toBeVisible();
      expect(queryByDisplayValue('test_teamname')).toBeVisible();
      expect(queryByDisplayValue('my_repository')).toBeVisible();
    });
  });

  // FIXME: Check why this is failing
  it.skip('show error messages when save form without mandatory fields', async () => {
    const VALUES = {
      ...INITIAL_VALUES,
      isEnabled: true,
      isOrganizationOwner: true,
      type: 'TEAM',
      followBy: 'test_teamname',
    } as FormValues;

    const { debug, queryByText, getByTestId, rerender } = renderComponent({
      initValues: VALUES,
    });

    fireEvent.submit(getByTestId('on-save-button'));

    rerender({
      initValues: VALUES,
    });

    await waitFor(() => {
      // expect(queryByText('Token is required!')).toBeVisible();
      // expect(queryByText('Configutation Name is required!')).toBeVisible();
      expect(queryByText('Username is required!')).toBeVisible();
      expect(queryByText('Owner is required!')).toBeVisible();
      expect(queryByText('Team is required!')).toBeVisible();
      expect(queryByText('Repository is required!')).toBeVisible();
    });
  });

  describe('reset form fields', () => {
    it('not reset when click at enabled button and initial values are fill', async () => {
      const VALUES = {
        ...INITIAL_VALUES,
        isEnabled: true,
        isOrganizationOwner: true,
        type: 'TEAM',
        followBy: 'test_teamname',
      } as FormValues;

      const { getByTestId, queryByDisplayValue } = renderComponent({
        initValues: VALUES,
      });

      fireEvent.click(getByTestId('isEnable-switch'));

      await waitFor(() => {
        expect(queryByDisplayValue('config 0')).toBeVisible();
        expect(queryByDisplayValue('test_username')).toBeVisible();
        expect(queryByDisplayValue('my_company')).toBeVisible();
        expect(queryByDisplayValue('github_token')).toBeVisible();
        expect(queryByDisplayValue('test_teamname')).toBeVisible();
        expect(queryByDisplayValue('my_repository')).toBeVisible();
      });
    });
  });
});
