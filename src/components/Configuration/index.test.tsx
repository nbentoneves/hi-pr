import { useParams } from 'react-router-dom';
import Configuration from '.';
import { GITHUB_CONFIGURATIONS } from '../../store/constants';
import {
  Configuration as ConfigSlice,
  State,
} from '../../store/feature/githubSlice';
import * as reduxHooks from '../../store/hooks';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../testing/test-unit-render';
import { buildStore, StoreSlice } from '../../testing/test-utils';

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn(),
    useNavigate: () => jest.fn(),
  };
});

describe('Configuration render component', () => {
  const useDispatchMock = jest.spyOn(reduxHooks, 'useAppDispatch');

  let initStatus: StoreSlice;

  beforeEach(() => {
    useDispatchMock.mockClear();

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
            name: 'github-1',
            username: 'new-nbentoneves',
            teamname: 'my-team',
            organization: {
              name: 'hi-pr-org',
              token: 'token',
            },
          } as ConfigSlice,
        ],
      } as State,
    };
  });

  it('mount component and dependency components', () => {
    (useParams as jest.Mock).mockReturnValue({
      identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
    });

    render(<Configuration />, buildStore(initStatus));

    expect(screen.queryByText('Back')).toBeVisible();
    expect(screen.queryByText('Save')).toBeVisible();
  });

  it('edit and update configuration', async () => {
    (useDispatchMock as jest.Mock).mockReturnValue(jest.fn());
    (useParams as jest.Mock).mockReturnValue({
      identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
    });

    render(<Configuration />, buildStore(initStatus));

    fireEvent.submit(screen.getByTestId('on-save-button'));

    await waitFor(() => {
      // dispatch editConfiguration and cleanWarning
      expect(useDispatchMock).toBeCalledTimes(1);
    });
  });

  it('save new configuration', async () => {
    (useDispatchMock as jest.Mock).mockReturnValue(jest.fn());
    (useParams as jest.Mock).mockReturnValue({
      identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
    });

    const newInitStatus = {
      name: GITHUB_CONFIGURATIONS,
      initialState: {
        type: 'GITHUB',
        pullRequestsAlreadyNotified: [],
        warnings: [],
        configurations: [],
      } as State,
    };

    render(<Configuration />, buildStore(newInitStatus));

    fireEvent.submit(screen.getByTestId('on-save-button'));

    await waitFor(() => {
      // dispatch saveConfiguration
      expect(useDispatchMock).toBeCalledTimes(1);
    });
  });
});
