import FormPreferences from '.';
import { fireEvent, render, screen, waitFor } from '../../testing/test-util';

describe('FormPreferences render component', () => {
  it('save form preferences using initial values', async () => {
    const onSaveMock = jest.fn(() => Promise.resolve());

    render(
      <FormPreferences
        onSave={onSaveMock}
        initValues={{
          user: {
            username: 'test_username',
            teamname: 'test_teamname',
          },
          organization: {
            isOrganization: true,
            owner: 'my_company',
            token: 'github_token',
          },
          preferences: {
            repositories: ['my_repository', 'my_repository_2'],
          },
        }}
      />,
    );

    fireEvent.submit(screen.getByTestId('on-save-button'));

    expect(screen.queryByText('Save')).toBeVisible();
    expect(screen.queryByDisplayValue('test_username')).toBeVisible();
    expect(screen.queryByDisplayValue('test_teamname')).toBeVisible();
    expect(screen.queryByDisplayValue('my_company')).toBeVisible();
    expect(screen.queryByDisplayValue('github_token')).toBeVisible();
    expect(screen.queryByText('my_repository')).toBeVisible();
    expect(screen.queryByText('my_repository_2')).toBeVisible();

    await waitFor(() => {
      expect(onSaveMock).toBeCalledTimes(1);
    });
  });

  it('show error messages when save form preferences without mandatory fields, isOrganization enable', async () => {
    const onSaveMock = jest.fn(() => Promise.resolve());

    render(
      <FormPreferences
        onSave={onSaveMock}
        initValues={{
          user: {},
          organization: {
            isOrganization: true,
          },
          preferences: {},
        }}
      />,
    );

    fireEvent.submit(screen.getByTestId('on-save-button'));

    await waitFor(() => {
      expect(screen.queryByText('Username is required!')).toBeVisible();
      expect(screen.queryByText('Token is required!')).toBeVisible();
      expect(screen.queryByText('Owner is required!')).toBeVisible();
      expect(screen.queryByText('Repositories is required!')).toBeVisible();
    });
  });

  it('show error messages when save form preferences without mandatory fields, isOrganization disable', async () => {
    const onSaveMock = jest.fn(() => Promise.resolve());

    render(
      <FormPreferences
        onSave={onSaveMock}
        initValues={{
          user: {},
          organization: {
            isOrganization: false,
          },
          preferences: {},
        }}
      />,
    );

    fireEvent.submit(screen.getByTestId('on-save-button'));

    await waitFor(() => {
      expect(screen.queryByText('Username is required!')).toBeVisible();
      expect(screen.queryByText('Token is required!')).toBeNull();
      expect(screen.queryByText('Owner is required!')).toBeNull();
      expect(screen.queryByText('Repositories is required!')).toBeVisible();
    });
  });
});
