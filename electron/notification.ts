import { Notification, shell } from 'electron';

export const NOTIFICATION_REVIEW_PULL_REQUEST = 'notificationReviewPullRequest';

export const basicNotification = (
  title: string,
  message: string,
): Notification => {
  return new Notification({ title, body: message });
};

export const basicNotificationWithActionLink = (
  title: string,
  message: string,
  link: string,
): Notification => {
  const notification = new Notification({ title, body: message });

  notification.on('click', () => {
    shell.openExternal(link);
  });

  return notification;
};
