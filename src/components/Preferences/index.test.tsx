import { pullRequestGitHubMockNotFound } from 'src/api/mock';
import { GLOBAL } from 'src/store/constants';
import { mockAxios } from 'src/testing/test-axios-mock';
import { StoreSlice } from 'src/testing/test-utils';
import Preferences from '.';
import useReviewPullRequestNotification from '../../hooks/useReviewPullRequestNotification';
import * as reduxHooks from '../../store/hooks';
import * as httpUtils from '../../utils/httpUtils';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../testing/test-unit-render';

const mockTriggerNotificationUsername = jest.fn();
const mockTriggerNotificationTeam = jest.fn();

jest.mock('../../hooks/useReviewPullRequestNotification', () => {
  return jest.fn(() => ({
    triggerNotificationUsername: mockTriggerNotificationUsername,
    triggerNotificationTeam: mockTriggerNotificationTeam,
  }));
});

describe('Preferences render component', () => {
  const useDispatchMock = jest.spyOn(reduxHooks, 'useAppDispatch');
  const getPartOfUrlRequestMock = jest.spyOn(httpUtils, 'getPartOfUrlRequest');
  const axiosMock = mockAxios();

  let initStatus: StoreSlice;

  beforeEach(() => {
    useDispatchMock.mockClear();
    getPartOfUrlRequestMock.mockClear();
    axiosMock.reset();

    initStatus = {
      name: GLOBAL,
      initialState: {
        preferences: {
          username: 'nbentoneves',
          organization: {
            owner: 'hi-pr-owner',
            token: 'token',
            teamname: 'teamname',
          },
          repositories: ['hi-pr'],
        },
        pullRequestsAlreadyNotified: [] as string[],
        warnings: [] as string[],
      },
    };
  });

  it('failed get pull request and dispatch save preferences and warning message function, using organization', async () => {
    (useDispatchMock as jest.Mock).mockReturnValue(jest.fn());
    (getPartOfUrlRequestMock as jest.Mock).mockReturnValue('REPOSITORY');
    (useReviewPullRequestNotification as jest.Mock).mockReturnValue(jest.fn());

    axiosMock
      .onGet('/repos/hi-pr-owner/hi-pr/pulls')
      .reply(404, pullRequestGitHubMockNotFound)
      .onAny()
      .reply(500);

    render(<Preferences />, initStatus);

    fireEvent.submit(screen.getByTestId('on-save-button'));

    await waitFor(() => {
      // dispatch savePreferences and addWarning
      expect(useDispatchMock).toBeCalledTimes(2);
      expect(getPartOfUrlRequestMock).toHaveBeenCalledWith(
        expect.anything(),
        5,
      );
    });
  });

  it('failed get pull request and dispatch save preferences and warning message function, using username', async () => {
    (useDispatchMock as jest.Mock).mockReturnValue(jest.fn());
    (getPartOfUrlRequestMock as jest.Mock).mockReturnValue('REPOSITORY');
    (useReviewPullRequestNotification as jest.Mock).mockReturnValue(jest.fn());

    axiosMock
      .onGet('/repos/nbentoneves/hi-pr/pulls')
      .reply(404, pullRequestGitHubMockNotFound)
      .onAny()
      .reply(500);

    render(<Preferences />, {
      ...initStatus,
      initialState: {
        ...initStatus.initialState,
        preferences: {
          username: 'nbentoneves',
          repositories: ['hi-pr'],
        },
      },
    });

    fireEvent.submit(screen.getByTestId('on-save-button'));

    await waitFor(() => {
      // dispatch savePreferences and addWarning
      expect(useDispatchMock).toBeCalledTimes(2);
      expect(getPartOfUrlRequestMock).toHaveBeenCalledWith(
        expect.anything(),
        5,
      );
    });
  });

  it('show warning message when they are available', async () => {
    (useDispatchMock as jest.Mock).mockReturnValue(jest.fn());
    (getPartOfUrlRequestMock as jest.Mock).mockReturnValue('REPOSITORY');
    (useReviewPullRequestNotification as jest.Mock).mockReturnValue(jest.fn());

    axiosMock
      .onGet('/repos/nbentoneves/hi-pr/pulls')
      .reply(404, pullRequestGitHubMockNotFound)
      .onGet('/repos/nbentoneves/hi-pr2/pulls')
      .reply(404, pullRequestGitHubMockNotFound)
      .onAny()
      .reply(500);

    render(<Preferences />, {
      ...initStatus,
      initialState: {
        ...initStatus.initialState,
        warnings: ['hi-pr', 'hi-pr2'],
        preferences: {
          username: 'nbentoneves',
          repositories: ['hi-pr', 'hi-pr2'],
        },
      },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('alert-hi-pr')?.textContent).toStrictEqual(
        'Did you type the hi-pr repository name right?',
      );
      expect(screen.queryByTestId('alert-hi-pr2')?.textContent).toStrictEqual(
        'Did you type the hi-pr2 repository name right?',
      );
    });
  });

  // TODO: Write test with providers returning status 200
});
