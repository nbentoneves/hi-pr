import OrganizationPreferences from '.';
import { pullRequestGitHubMockNotFound } from '../../api/mock';
import useReviewPullRequestNotification from '../../hooks/useReviewPullRequestNotification';
import { ORGANIZATION_PREFERENCES } from '../../store/constants';
import { State } from '../../store/feature/organizationPreferencesSlice';
import * as reduxHooks from '../../store/hooks';
import { mockAxios } from '../../testing/test-axios-mock';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../testing/test-unit-render';
import { StoreSlice } from '../../testing/test-utils';
import * as httpUtils from '../../utils/httpUtils';

const mockTriggerNotificationUsername = jest.fn();
const mockTriggerNotificationTeam = jest.fn();

jest.mock('../../hooks/useReviewPullRequestNotification', () => {
  return jest.fn(() => ({
    triggerNotificationUsername: mockTriggerNotificationUsername,
    triggerNotificationTeam: mockTriggerNotificationTeam,
  }));
});

describe('OrganizationPreferences render component', () => {
  const useDispatchMock = jest.spyOn(reduxHooks, 'useAppDispatch');
  const getPartOfUrlRequestMock = jest.spyOn(httpUtils, 'getPartOfUrlRequest');
  const axiosMock = mockAxios();

  let initStatus: StoreSlice;

  beforeEach(() => {
    useDispatchMock.mockClear();
    getPartOfUrlRequestMock.mockClear();
    axiosMock.reset();

    initStatus = {
      name: ORGANIZATION_PREFERENCES,
      initialState: {
        preferences: {
          username: 'nbentoneves',
          teamname: 'teamname',
          organization: {
            name: 'hi-pr-owner',
            token: 'token',
          },
          repositories: ['hi-pr'],
        },
        enabled: true,
        pullRequestsAlreadyNotified: [] as string[],
        warnings: [] as string[],
      } as State,
    };
  });

  it('failed get pull request, dispatch save preferences and warning message', async () => {
    (useDispatchMock as jest.Mock).mockReturnValue(jest.fn());
    (getPartOfUrlRequestMock as jest.Mock).mockReturnValue('REPOSITORY');
    (useReviewPullRequestNotification as jest.Mock).mockReturnValue(jest.fn());

    axiosMock
      .onGet('/repos/hi-pr-owner/hi-pr/pulls')
      .reply(404, pullRequestGitHubMockNotFound)
      .onAny()
      .reply(500);

    render(<OrganizationPreferences />, initStatus);

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
      .onGet('/repos/hi-pr-owner/hi-pr/pulls')
      .reply(404, pullRequestGitHubMockNotFound)
      .onGet('/repos/hi-pr-owner/hi-pr2/pulls')
      .reply(404, pullRequestGitHubMockNotFound)
      .onAny()
      .reply(500);

    render(<OrganizationPreferences />, {
      ...initStatus,
      initialState: {
        ...initStatus.initialState,
        warnings: ['hi-pr', 'hi-pr2'],
        preferences: {
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
