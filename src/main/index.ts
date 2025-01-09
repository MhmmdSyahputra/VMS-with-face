import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const nodeChildProcess = require('child_process')
import path from 'path'

let mainWindow: BrowserWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 1007,
    minHeight: 641,
    show: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      webSecurity: false,
      nodeIntegration: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.on('print-entrance-ticket', (_, data) => {
  const rWin = new BrowserWindow({
    show: true,
    webPreferences: {
      // devTools: false,
      nodeIntegration: true,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js')
    }
  })

  const RESOURCES_PATH_PRINT = app.isPackaged
    ? path.join(process.resourcesPath, `resources/receipt/print.html?code=${data.codeAPI}`)
    : path.join(__dirname, `../../resources/receipt/print.html?code=${data.codeAPI}`)

  // rWin.loadFile(RESOURCES_PATH_PRINT);
  rWin.loadURL(RESOURCES_PATH_PRINT).then(() => {
    rWin.webContents.executeJavaScript(`
    
    document.getElementById('header1').innerText = '${data.header1}';
    document.getElementById('header2').innerText = '${data.header2}';
    document.getElementById('fullname').innerText = '${data.fullName}';
    document.getElementById('idnumber').innerText = '${data.idNumber}';
    document.getElementById('destination').innerText = '${data.destination}';
    document.getElementById('lantai').innerText = '${data.lantai}';
    document.getElementById('footer1').innerText = '${data.footer1}';
    document.getElementById('footer2').innerText = '${data.footer2}';
    `)

    //berikan delay beberapa detik diisin

    setTimeout(() => {
      rWin.webContents.print({
        silent: false,
        margins: {
          marginType: 'printableArea'
        },
        printBackground: false,
        pagesPerSheet: 1,
        landscape: false,
        header: 'Header of the Page',
        footer: 'Footer of the Page',
        collate: false,
        pageSize: {
          height: 454,
          width: 471
        }
      })
    }, 100) // Sesuaikan timeout sesuai kebutuhan Anda
  })
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('get-deviceID', (event) => {
    const script = nodeChildProcess.spawn('cmd.exe', ['/c', 'wmic csproduct get uuid'])

    script.stdout.on('data', (data) => {
      event.sender.send('uuid-response', data.toString().trim())
    })

    script.stderr.on('data', (err) => {
      event.sender.send('uuid-response', `Error: ${err.toString().trim()}`)
    })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Handle window actions
ipcMain.on('window:minimize', () => {
  if (mainWindow) mainWindow.minimize()
})

ipcMain.on('window:maximize', () => {
  if (mainWindow) {
    mainWindow.setFullScreen(false)
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
      mainWindow.setFullScreen(true)
    }
  }
})

ipcMain.on('window:close', () => {
  if (mainWindow) mainWindow.close()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
