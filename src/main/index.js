const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const dataHandlers = require('./handlers/dataHandlers');
const storyHandlers = require('./handlers/storyHandlers');
const translationHandlers = require('./handlers/translationHandlers');
const chineseHandlers = require('./handlers/chineseHandlers');
const statsHandlers = require('./handlers/statsHandlers');
const skillHandlers = require('./handlers/skillHandlers');

const isDev = process.argv.includes('--dev');
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
  });

  if (isDev) {
    mainWindow.loadFile(path.join(__dirname, '../renderer/public/index.html'));
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function registerIPCHandlers() {
  Object.entries(dataHandlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, handler);
  });

  Object.entries(storyHandlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, handler);
  });

  Object.entries(translationHandlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, handler);
  });

  Object.entries(chineseHandlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, handler);
  });

  Object.entries(statsHandlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, handler);
  });

  Object.entries(skillHandlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, handler);
  });

  ipcMain.on('switch-profile', (event, profile) => {
    if (mainWindow) {
      mainWindow.webContents.send('switch-profile', profile);
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  registerIPCHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
