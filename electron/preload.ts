// `contextBridge` expose an API to the renderer process.
// `ipcRenderer` is used for IPC (inter-process communication) with main process.
// We use it in the preload instead of renderer in order to expose only
// whitelisted wrappers to increase the security of our aplication.
import { contextBridge, ipcRenderer } from 'electron';
import { NOTIFICATION_REVIEW_PULL_REQUEST } from './notification';

// Create a type that should contain all the data we need to expose in the
// renderer process using `contextBridge`.
export type ContextBridgeApi = {
  notificationReviewPullRequest: (message: string, link: string) => void;
};

const exposedApi: ContextBridgeApi = {
  notificationReviewPullRequest: (message: string, link: string) => {
    ipcRenderer.send(NOTIFICATION_REVIEW_PULL_REQUEST, message, link);
  },
};

// Expose our functions in the `api` namespace of the renderer `Window`.
//
// If I want to call `notificationReviewPullRequest` from the renderer process, I can do it by
// calling the function `window.api.notificationReviewPullRequest()`.
contextBridge.exposeInMainWorld('api', exposedApi);
