import update from 'immutability-helper';
import Main from '..';
import { GITHUB_CONFIGURATIONS } from '../../../store/constants';
import {
  Configuration as ConfigSlice,
  State,
} from '../../../store/feature/githubSlice';
import * as reduxHooks from '../../../store/hooks';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../testing/test-unit-render';
import { StoreSlice, buildStore } from '../../../testing/test-utils';

const mockUseNavigate = jest.fn();

jest.mock('../../../hooks/useReviewPullRequestNotification', () => {
  return jest.fn(() => ({
    triggerNotificationUsername: jest.fn(),
    triggerNotificationTeam: jest.fn(),
  }));
});

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: () => mockUseNavigate,
  useHref: jest.fn(),
}));

describe('Main render component', () => {
  const useDispatchMock = jest.spyOn(reduxHooks, 'useAppDispatch');

  let initStatus: StoreSlice;

  beforeEach(() => {
    initStatus = {
      name: GITHUB_CONFIGURATIONS,
      initialState: {
        type: 'GITHUB',
        pullRequestsAlreadyNotified: [],
        warnings: [],
        configurations: [
          {
            identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
            enabled: false,
            isOrganizationOwner: true,
            name: 'github-1',
            username: 'new-nbentoneves',
            owner: 'hi-pr-org',
            type: 'TEAM',
            token: 'token',
          } as ConfigSlice,
        ],
      } as State,
    };
  });

  afterEach(() => {
    useDispatchMock.mockClear();
  });

  it('new configuration button is working', async () => {
    render(<Main />, buildStore(initStatus));

    fireEvent.click(screen.getByTestId('on-new-configuration'));

    expect(screen.queryByText('New configuration')).toBeVisible();

    await waitFor(() => {
      expect(mockUseNavigate).toBeCalledTimes(1);
      expect(mockUseNavigate).toBeCalledWith('/configuration');
    });
  });

  it('enable/disable switcher button is working', async () => {
    const switchEnable = jest.fn();
    useDispatchMock.mockReturnValue(switchEnable);

    const store = buildStore(initStatus);

    render(<Main />, store);

    fireEvent.click(
      screen.getByTestId('switch-config-b205e4ba-1d8e-4e25-89ad-00dbc35959f7'),
    );

    await waitFor(() => {
      expect(switchEnable).toBeCalledTimes(1);
      expect(switchEnable.mock.calls[0][0].type).toEqual(
        'store:gitlabConfigurations/switchEnabled',
      );
      expect(switchEnable.mock.calls[0][0].payload).toEqual(
        'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
      );
    });
  });

  it('update button is working', async () => {
    render(<Main />, buildStore(initStatus));

    fireEvent.click(
      screen.getByTestId('update-config-b205e4ba-1d8e-4e25-89ad-00dbc35959f7'),
    );

    expect(screen.queryByText('Update')).toBeVisible();

    await waitFor(() => {
      expect(mockUseNavigate).toBeCalledTimes(1);
    });
  });

  it('delete button is working', async () => {
    const deleteConfig = jest.fn();
    useDispatchMock.mockReturnValue(deleteConfig);

    render(<Main />, buildStore(initStatus));

    fireEvent.click(
      screen.getByTestId('delete-config-b205e4ba-1d8e-4e25-89ad-00dbc35959f7'),
    );

    expect(screen.queryByText('Delete')).toBeVisible();

    await waitFor(() => {
      expect(deleteConfig).toBeCalledTimes(1);
      expect(deleteConfig.mock.calls[0][0].type).toEqual(
        'store:gitlabConfigurations/deleteConfiguration',
      );
      expect(deleteConfig.mock.calls[0][0].payload).toEqual(
        'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
      );
    });
  });

  describe('Warning messages', () => {
    it('warning icon is not visible when no warnings', () => {
      render(<Main />, buildStore(initStatus));

      expect(
        screen.queryByTestId(
          'warning-config-b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
        ),
      ).toBeNull();
    });

    it('warning icon is visible when exists warnings', async () => {
      const localInitStatus = update(initStatus, {
        initialState: {
          warnings: {
            $push: [
              {
                identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
                repositories: ['github-1'],
              },
            ],
          },
        },
      });

      render(<Main />, buildStore(localInitStatus));

      fireEvent.click(
        screen.getByTestId(
          'warning-config-b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
        ),
      );

      expect(
        screen.queryByTestId(
          'warning-config-b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
        ),
      ).toBeVisible();
    });
  });
});
