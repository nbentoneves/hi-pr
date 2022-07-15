import FormOrganizationPreferences from '.';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../testing/test-unit-render';

describe('Form->OrganizationPreferences render component', () => {
  /**
   * TODO: This test needs to be improved.
   * Find a way to check the repository select
   * */
  it('default initial values', async () => {
    const onSaveMock = jest.fn(() => Promise.resolve());

    render(<FormOrganizationPreferences onSave={onSaveMock} />);

    expect(screen.getByTestId('isEnable-switch')).toHaveAttribute(
      'value',
      'false',
    );
    expect(screen.getByTestId('username-input')).toHaveAttribute('value', '');
    expect(screen.getByTestId('teamname-input')).toHaveAttribute('value', '');
    expect(screen.getByTestId('token-input')).toHaveAttribute('value', '');
    expect(screen.getByTestId('organization-input')).toHaveAttribute(
      'value',
      '',
    );
  });

  it('save from using initial values', async () => {
    const onSaveMock = jest.fn(() => Promise.resolve());

    render(
      <FormOrganizationPreferences
        onSave={onSaveMock}
        initValues={{
          isEnabled: true,
          username: 'test_username',
          organization: 'my_company',
          token: 'github_token',
          teamname: 'test_teamname',
          repositories: ['my_repository', 'my_repository_2'],
        }}
      />,
    );

    fireEvent.submit(screen.getByTestId('on-save-button'));

    await waitFor(() => {
      expect(onSaveMock).toBeCalledTimes(1);
      expect(screen.queryByText('Save')).toBeVisible();
      expect(screen.queryByDisplayValue('test_username')).toBeVisible();
      expect(screen.queryByDisplayValue('my_company')).toBeVisible();
      expect(screen.queryByDisplayValue('github_token')).toBeVisible();
      expect(screen.queryByDisplayValue('test_teamname')).toBeVisible();
      expect(screen.queryByText('my_repository')).toBeVisible();
      expect(screen.queryByText('my_repository_2')).toBeVisible();
    });
  });

  it('show error messages when save form without mandatory fields', async () => {
    const onSaveMock = jest.fn(() => Promise.resolve());

    render(
      <FormOrganizationPreferences
        onSave={onSaveMock}
        initValues={{
          isEnabled: true,
          username: '',
          token: '',
          organization: '',
          repositories: [],
        }}
      />,
    );

    fireEvent.submit(screen.getByTestId('on-save-button'));

    await waitFor(() => {
      expect(screen.queryByText('Token is required!')).toBeVisible();
      expect(screen.queryByText('Username is required!')).toBeVisible();
      expect(screen.queryByText('Organization is required!')).toBeVisible();
      expect(screen.queryByText('Repositories is required!')).toBeVisible();
    });
  });

  describe('reset form fields', () => {
    /**
     * TODO: This test needs to be improved.
     * Find a way to check the repository select
     */
    it('reset when click at enabled button and initial values are empty', async () => {
      const onSaveMock = jest.fn(() => Promise.resolve());

      render(<FormOrganizationPreferences onSave={onSaveMock} />);

      fireEvent.click(screen.getByTestId('isEnable-switch'));

      fireEvent.change(screen.getByTestId('username-input'), {
        target: {
          value: 'test_username',
        },
      });
      fireEvent.change(screen.getByTestId('teamname-input'), {
        target: {
          value: 'test_teamname',
        },
      });
      fireEvent.change(screen.getByTestId('token-input'), {
        target: {
          value: 'github_token',
        },
      });
      fireEvent.change(screen.getByTestId('organization-input'), {
        target: {
          value: 'my_company',
        },
      });

      await waitFor(() => {
        expect(screen.queryByDisplayValue('test_username')).toBeVisible();
        expect(screen.queryByDisplayValue('my_company')).toBeVisible();
        expect(screen.queryByDisplayValue('github_token')).toBeVisible();
        expect(screen.queryByDisplayValue('test_teamname')).toBeVisible();
      });

      fireEvent.click(screen.getByTestId('isEnable-switch'));

      await waitFor(() => {
        expect(
          screen.queryByDisplayValue('test_username'),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByDisplayValue('my_company'),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByDisplayValue('github_token'),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByDisplayValue('test_teamname'),
        ).not.toBeInTheDocument();
      });
    });

    it('not reset when click at enabled button and initial values are fill', async () => {
      const onSaveMock = jest.fn(() => Promise.resolve());

      render(
        <FormOrganizationPreferences
          onSave={onSaveMock}
          initValues={{
            isEnabled: true,
            username: 'test_username',
            organization: 'my_company',
            token: 'github_token',
            teamname: 'test_teamname',
            repositories: ['my_repository'],
          }}
        />,
      );

      fireEvent.click(screen.getByTestId('isEnable-switch'));

      await waitFor(() => {
        expect(screen.queryByDisplayValue('test_username')).toBeVisible();
        expect(screen.queryByDisplayValue('my_company')).toBeVisible();
        expect(screen.queryByDisplayValue('github_token')).toBeVisible();
        expect(screen.queryByDisplayValue('test_teamname')).toBeVisible();
        expect(screen.queryByText('my_repository')).toBeVisible();
      });
    });
  });
});
