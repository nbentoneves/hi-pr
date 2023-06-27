import useReviewPullRequestNotification from '../useReviewPullRequestNotification';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

jest.mock('../../store/hooks', () => {
  return {
    __esModule: true,
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn(),
  };
});

describe('useReviewPullRequestNotification hook test', () => {
  it('do not trigger notification when is already in the notified list, using username', async () => {
    const mockNotification = jest.fn();
    const mockDispatch = jest.fn();

    Object.defineProperty(global, 'window', {
      value: {
        api: {
          notificationReviewPullRequest: mockNotification,
        },
      },
      writable: true,
    });

    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockReturnValue(['200', '300', '400']);

    await useReviewPullRequestNotification().triggerNotificationUsername(
      200,
      'htt://domain.com',
    );

    expect(mockNotification).not.toBeCalled();
    expect(mockDispatch).not.toBeCalled();
  });

  it('do not trigger notification when is already in the notified list, using team', async () => {
    const mockNotification = jest.fn();
    const mockDispatch = jest.fn();

    Object.defineProperty(global, 'window', {
      value: {
        api: {
          notificationReviewPullRequest: mockNotification,
        },
      },
      writable: true,
    });

    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockReturnValue(['200', '300', '400']);

    await useReviewPullRequestNotification().triggerNotificationTeam(
      200,
      'htt://domain.com',
    );

    expect(mockNotification).not.toBeCalled();
    expect(mockDispatch).not.toBeCalled();
  });

  it('trigger notification when is not in the notified list, using username', async () => {
    const mockNotification = jest.fn();
    const mockDispatch = jest.fn();

    Object.defineProperty(global, 'window', {
      value: {
        api: {
          notificationReviewPullRequest: mockNotification,
        },
      },
      writable: true,
    });

    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockReturnValue(['200', '300', '400']);

    await useReviewPullRequestNotification().triggerNotificationUsername(
      500,
      'htt://domain.com',
    );

    expect(mockNotification).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);
  });

  it('trigger notification when is not in the notified list, using team', async () => {
    const mockNotification = jest.fn();
    const mockDispatch = jest.fn();

    Object.defineProperty(global, 'window', {
      value: {
        api: {
          notificationReviewPullRequest: mockNotification,
        },
      },
      writable: true,
    });

    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockReturnValue(['200', '300', '400']);

    await useReviewPullRequestNotification().triggerNotificationTeam(
      500,
      'htt://domain.com',
    );

    expect(mockNotification).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);
  });
});
