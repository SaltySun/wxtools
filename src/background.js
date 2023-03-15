'use strict'

import { app, protocol, BrowserWindow, webContents } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import axios from 'axios'
const { execFile } = require('child_process')
const path = require('path');
const isDevelopment = process.env.NODE_ENV !== 'production'
const electron = require('electron')
const ipc = electron.ipcMain

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let win = null;
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1080,
    height: 720,
    frame: false,
    webPreferences: {
      devTools: false,
      nodeIntegration: true,
      //出现这个问题是因为官方为了安全性，将 electron v12.0.0 的 contextIsolation 的默认值改了。
      //所以今后要在渲染进程里调用 require 的话，还需要加上 contextIsolation: false 。
      contextIsolation: false,
      enableRemoteModule: true,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
      webSecurity: false,
      webviewTag: true,
      // partition: String(+new Date())
    }
  })
  win.webContents.openDevTools()
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', (event) => {
  console.log(2)
  event.preventDefault();

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    axios({
      url: "http://localhost:5001/api/logout",
      method: "post",
    }).then((res) => {
      console.log(res.data)
      if (res.data.code == 200) {
        stopServer()
        app.quit()
      }
      if (res.data.code == 201) alert(res.data.msg);
    })
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
var pyProc;
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  let xurl = path.resolve(__dirname, '..')
  let xurl2 = path.resolve(xurl, '..')
  var script_url = path.join(xurl2, 'resources', 'app', 'app.exe')
  pyProc = execFile(process.env.NODE_ENV === 'development' ? 'E:/Electron/electron-vue/new2-14/wxtools/backendist/app/app.exe' : script_url, (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
  })

  createWindow()
})

// 停止flask server 函数
function stopServer() {
  pyProc.kill()
  console.log('kill flask server  success')
  pyProc = null
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

//登录窗口最小化
ipc.on('window-min', function () {
  win.minimize();
})
//登录窗口最大化
ipc.on('window-max', function () {
  if (win.isMaximized()) {
    win.restore();
  } else {
    win.maximize();
  }
})
ipc.on('window-close', function () {
  win = null // 主窗口设置为null防止内存溢出
  console.log(1)
  axios({
    url: "http://localhost:5001/api/logout",
    method: "post",
  }).then((res) => {
    console.log(res.data)
    if (res.data.code == 200) {
      stopServer()
      app.exit()
    }
    if (res.data.code == 201) alert(res.data.msg);
  })
})

const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:8080` : `file://${__dirname}/index.html`
// 第二窗口、邀请用
ipc.on('open', function () {
  //调用 BrowserWindow打开新窗口
  let win2 = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      devTools: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      webviewTag: true,
      partition: String(+new Date())
    },
  })
  //test页面路由
  win2.loadURL('https://mp.weixin.qq.com/');

  // win2.webContents.openDevTools();

  win2.webContents.addListener('did-stop-loading', () => {
    win2.webContents.session.cookies.get({}).then((cookies) => {
      console.log('------------')
      let url = win2.webContents.getURL()
      const urlObj = new URL(url);
      // new URL().searchParams 得到的是一个 URLSearchParams 对象
      const urlSearchParams = urlObj.searchParams;
      // 配合 Object.fromEntries 将查询参数转换为对象
      const paramObj = Object.fromEntries(urlSearchParams);
      win.webContents.send('wx_cookies', {
        cookies,
        token: paramObj.token
      })
    })
  })

  win2.on('closed', () => {
    win2 = null;
  })

})

// 第三窗口、重新邀请
ipc.on('reopen', function (e, data) {
  //调用 BrowserWindow打开新窗口
  let win3 = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      devTools: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      webviewTag: true
    },
  })
  //test页面路由
  win3.loadURL(winURL + '#/mpwx');

  win3.webContents.openDevTools();
  win3.webContents.addListener('did-stop-loading', () => {
    setTimeout(() => {
      win3.webContents.send("wxdata", data)
    }, 1000)
  })
  win3.on('closed', () => {
    win3 = null;
  })

})