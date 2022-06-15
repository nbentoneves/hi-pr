import { GLOBAL } from 'src/store/constants';
import { addPullRequestAlreadyNotified } from '../store/feature/globalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const useNotification = () => {
  const dispatch = useAppDispatch();
  const pullRequestsAlreadyNotified = useAppSelector(
    (state) => state[GLOBAL].pullRequestsAlreadyNotified,
  );

  const triggerNotification = (id: number, url: string) => {
    if (!pullRequestsAlreadyNotified.includes(`${id}`)) {
      window.api.notificationReviewPullRequest(
        `Please review the following pull request ${url}`,
        url,
      );
      dispatch(addPullRequestAlreadyNotified(`${id}`));
    }
  };

  return { triggerNotification };
};

export default useNotification;
