import { GLOBAL } from '../store/constants';
import { addPullRequestAlreadyNotified } from '../store/feature/globalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const NOTIFICATION_USERNAME_REQUESTED_REVIEW =
  'You have an user pull request to review';
const NOTIFICATION_TEAM_REQUESTED_REVIEW =
  'You have a team pull request to review';

const useReviewPullRequestNotification = () => {
  const dispatch = useAppDispatch();
  const pullRequestsAlreadyNotified = useAppSelector(
    (state) => state[GLOBAL].pullRequestsAlreadyNotified,
  );

  const triggerNotificationUsername = (id: number, url: string) => {
    // TODO: Customize notification when is an user pull request
    if (!pullRequestsAlreadyNotified.includes(`${id}`)) {
      window.api.notificationReviewPullRequest(
        `${NOTIFICATION_USERNAME_REQUESTED_REVIEW}: ${url}`,
        url,
      );
      dispatch(addPullRequestAlreadyNotified(`${id}`));
    }
  };

  const triggerNotificationTeam = (id: number, url: string) => {
    // TODO: Customize notification when is a team pull request
    if (!pullRequestsAlreadyNotified.includes(`${id}`)) {
      window.api.notificationReviewPullRequest(
        `${NOTIFICATION_TEAM_REQUESTED_REVIEW}: ${url}`,
        url,
      );
      dispatch(addPullRequestAlreadyNotified(`${id}`));
    }
  };

  return { triggerNotificationUsername, triggerNotificationTeam };
};

export default useReviewPullRequestNotification;
