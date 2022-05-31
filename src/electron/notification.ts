import { Notification } from "electron";

export const basicNotification = (
  title: string,
  message: string
): Notification => {
  return new Notification({ title, body: message });
};
