import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from 'electron';
import path from 'path';
import {
  basicNotificationWithActionLink,
  NOTIFICATION_REVIEW_PULL_REQUEST,
} from './notification';

const assetsPath = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : './src/assets';

// My app's tray disappeared after a few minutes
// https://www.electronjs.org/docs/latest/faq#my-apps-tray-disappeared-after-a-few-minutes
let tray: Tray;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
// if (require('electron-squirrel-startup')) {
// eslint-disable-line global-require
// app.quit();
// }

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // and load the index.html of the app.
  if (app.isPackaged) {
    mainWindow.loadURL(`file://${__dirname}/../index.html`);
  } else {
    mainWindow.loadURL('http://localhost:3000/index.html');

    mainWindow.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    /*
    require('electron-reload')(__dirname, {
      electron: path.join(
        __dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        `electron${process.platform === 'win32' ? '.cmd' : ''}`,
      ),
      forceHardReset: true,
      hardResetMethod: 'exit',
    });
    */
  }
};

const createTray = (): void => {
  // Create tray
  const icon = path.join(assetsPath, '/images/tray.png');
  const trayIcon = nativeImage.createFromPath(icon);
  tray = new Tray(trayIcon.resize({ width: 16 }));

  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Preferences',
      click: () => {
        createWindow();
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(trayMenu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app
  .whenReady()
  .then(() => {
    ipcMain.on(NOTIFICATION_REVIEW_PULL_REQUEST, (_, message, link) => {
      basicNotificationWithActionLink(
        'Pull Request to review',
        message,
        link,
      ).show();
    });
  })
  .then(createTray)
  .then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    app.dock.hide();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
