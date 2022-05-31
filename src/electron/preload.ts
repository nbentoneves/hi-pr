// `contextBridge` expose an API to the renderer process.
// `ipcRenderer` is used for IPC (inter-process communication) with main process.
// We use it in the preload instead of renderer in order to expose only
// whitelisted wrappers to increase the security of our aplication.
import { contextBridge, ipcRenderer } from "electron";

// Create a type that should contain all the data we need to expose in the
// renderer process using `contextBridge`.
export type ContextBridgeApi = {
  // Declare a `readFile` function that will return a promise. This promise
  // will contain the data of the file read from the main process.
  readFile: () => void;
  notification: (message: String) => void;
  message: string;
};

const exposedApi: ContextBridgeApi = {
  readFile: () => {
    console.log("ehy");
  },
  notification: (message: String) => {
    ipcRenderer.send("notification", message);
  },
  message: "hello",
};

// Expose our functions in the `api` namespace of the renderer `Window`.
//
// If I want to call `readFile` from the renderer process, I can do it by
// calling the function `window.api.readFile()`.
contextBridge.exposeInMainWorld("api", exposedApi);
