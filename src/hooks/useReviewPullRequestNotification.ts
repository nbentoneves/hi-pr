import { GITHUB_CONFIGURATIONS } from '../store/constants';
import { addPullRequestAlreadyNotified } from '../store/feature/githubSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const NOTIFICATION_USERNAME_REQUESTED_REVIEW =
  'You have an user pull request to review';
const NOTIFICATION_TEAM_REQUESTED_REVIEW =
  'You have a team pull request to review';
const NOTIFICATION_USER_FOLLOW_REVIEWS =
  'You have a team pull request to review';

const useReviewPullRequestNotification = () => {
  const dispatch = useAppDispatch();
  const pullRequestsAlreadyNotified = useAppSelector(
    (state) => state[GITHUB_CONFIGURATIONS].pullRequestsAlreadyNotified,
  );

  const triggerNotification = (id: number, url: string, message: string) => {
    // TODO: Customize notification
    if (!pullRequestsAlreadyNotified.includes(`${id}`)) {
      window.api.notificationReviewPullRequest(`${message}: ${url}`, url);
      dispatch(addPullRequestAlreadyNotified(`${id}`));
    }
  };

  const triggerNotificationUsername = (id: number, url: string) =>
    triggerNotification(id, url, NOTIFICATION_USERNAME_REQUESTED_REVIEW);

  const triggerNotificationTeam = (id: number, url: string) =>
    triggerNotification(id, url, NOTIFICATION_TEAM_REQUESTED_REVIEW);

  const triggerNotificationFollowByUser = (id: number, url: string) =>
    triggerNotification(id, url, NOTIFICATION_USER_FOLLOW_REVIEWS);

  return {
    triggerNotificationUsername,
    triggerNotificationTeam,
    triggerNotificationFollowByUser,
  };
};

export default useReviewPullRequestNotification;
