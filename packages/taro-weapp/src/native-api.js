const RequestQueue = {
  MAX_REQUEST: 5,
  queue: [],
  request (options) {
    this.push(options)
    this.run()
  },

  push (options) {
    this.queue.push(options)
  },

  run () {
    if (!this.queue.length) {
      return
    }
    if (this.queue.length <= this.MAX_REQUEST) {
      let options = this.queue.shift()
      let completeFn = options.complete
      options.complete = () => {
        completeFn && completeFn.apply(options, [...arguments])
        this.run()
      }
      wx.request(options)
    }
  }
}

function request (options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  const originSuccess = options['success']
  const originFail = options['fail']
  const originComplete = options['complete']
  const p = new Promise((resolve, reject) => {
    options['success'] = res => {
      originSuccess && originSuccess(res)
      resolve(res)
    }
    options['fail'] = res => {
      originFail && originFail(res)
      reject(res)
    }

    options['complete'] = res => {
      originComplete && originComplete(res)
    }

    RequestQueue.request(options)
  })
  return p
}

function processApis (taro) {
  const onAndSyncApis = {
    onSocketOpen: true,
    onSocketError: true,
    onSocketMessage: true,
    onSocketClose: true,
    onBackgroundAudioPlay: true,
    onBackgroundAudioPause: true,
    onBackgroundAudioStop: true,
    onNetworkStatusChange: true,
    onAccelerometerChange: true,
    onCompassChange: true,
    onBluetoothAdapterStateChange: true,
    onBluetoothDeviceFound: true,
    onBLEConnectionStateChange: true,
    onBLECharacteristicValueChange: true,
    onBeaconUpdate: true,
    onBeaconServiceChange: true,
    onUserCaptureScreen: true,
    onHCEMessage: true,
    onGetWifiList: true,
    onWifiConnected: true,
    setStorageSync: true,
    getStorageSync: true,
    getStorageInfoSync: true,
    removeStorageSync: true,
    clearStorageSync: true,
    getSystemInfoSync: true,
    getExtConfigSync: true,
    getLogManager: true
  }
  const noPromiseApis = {
    // 媒体
    stopRecord: true,
    getRecorderManager: true,
    pauseVoice: true,
    stopVoice: true,
    pauseBackgroundAudio: true,
    stopBackgroundAudio: true,
    getBackgroundAudioManager: true,
    createAudioContext: true,
    createInnerAudioContext: true,
    createVideoContext: true,
    createCameraContext: true,

    navigateBack: true,

    // 位置
    createMapContext: true,

    // 设备
    canIUse: true,
    startAccelerometer: true,
    stopAccelerometer: true,
    startCompass: true,
    stopCompass: true,

    // 界面
    hideToast: true,
    hideLoading: true,
    showNavigationBarLoading: true,
    hideNavigationBarLoading: true,
    createAnimation: true,
    pageScrollTo: true,
    createSelectorQuery: true,
    createCanvasContext: true,
    createContext: true,
    drawCanvas: true,
    hideKeyboard: true,
    stopPullDownRefresh: true,

    // 拓展接口
    arrayBufferToBase64: true,
    base64ToArrayBuffer: true,

    getUpdateManager: true,
    createWorker: true
  }
  const otherApis = {
    // 网络
    uploadFile: true,
    downloadFile: true,
    connectSocket: true,
    sendSocketMessage: true,
    closeSocket: true,

    // 媒体
    chooseImage: true,
    previewImage: true,
    getImageInfo: true,
    saveImageToPhotosAlbum: true,
    startRecord: true,
    playVoice: true,
    getBackgroundAudioPlayerState: true,
    playBackgroundAudio: true,
    seekBackgroundAudio: true,
    chooseVideo: true,
    saveVideoToPhotosAlbum: true,
    loadFontFace: true,

    // 文件
    saveFile: true,
    getFileInfo: true,
    getSavedFileList: true,
    getSavedFileInfo: true,
    removeSavedFile: true,
    openDocument: true,

    // 数据缓存
    setStorage: true,
    getStorage: true,
    getStorageInfo: true,
    removeStorage: true,
    clearStorage: true,

    // 导航
    navigateTo: true,
    redirectTo: true,
    switchTab: true,
    reLaunch: true,

    // 位置
    getLocation: true,
    chooseLocation: true,
    openLocation: true,

    // 设备
    getSystemInfo: true,
    getNetworkType: true,
    makePhoneCall: true,
    scanCode: true,
    setClipboardData: true,
    getClipboardData: true,
    openBluetoothAdapter: true,
    closeBluetoothAdapter: true,
    getBluetoothAdapterState: true,
    startBluetoothDevicesDiscovery: true,
    stopBluetoothDevicesDiscovery: true,
    getBluetoothDevices: true,
    getConnectedBluetoothDevices: true,
    createBLEConnection: true,
    closeBLEConnection: true,
    getBLEDeviceServices: true,
    getBLEDeviceCharacteristics: true,
    readBLECharacteristicValue: true,
    writeBLECharacteristicValue: true,
    notifyBLECharacteristicValueChange: true,
    startBeaconDiscovery: true,
    stopBeaconDiscovery: true,
    getBeacons: true,
    setScreenBrightness: true,
    getScreenBrightness: true,
    setKeepScreenOn: true,
    vibrateLong: true,
    vibrateShort: true,
    addPhoneContact: true,
    getHCEState: true,
    startHCE: true,
    stopHCE: true,
    sendHCEMessage: true,
    startWifi: true,
    stopWifi: true,
    connectWifi: true,
    getWifiList: true,
    setWifiList: true,
    getConnectedWifi: true,

    // 界面
    showToast: true,
    showLoading: true,
    showModal: true,
    showActionSheet: true,
    setNavigationBarTitle: true,
    setNavigationBarColor: true,
    setTabBarBadge: true,
    removeTabBarBadge: true,
    showTabBarRedDot: true,
    hideTabBarRedDot: true,
    setTabBarStyle: true,
    setTabBarItem: true,
    showTabBar: true,
    hideTabBar: true,
    setTopBarText: true,
    startPullDownRefresh: true,
    canvasToTempFilePath: true,
    canvasGetImageData: true,
    canvasPutImageData: true,

    // 第三方平台
    getExtConfig: true,

    // 开放接口
    login: true,
    authorize: true,
    getUserInfo: true,
    requestPayment: true,
    showShareMenu: true,
    hideShareMenu: true,
    updateShareMenu: true,
    getShareInfo: true,
    chooseAddress: true,
    addCard: true,
    openCard: true,
    openSetting: true,
    getSetting: true,
    getWeRunData: true,
    navigateToMiniProgram: true,
    navigateBackMiniProgram: true,
    chooseInvoiceTitle: true,
    checkIsSupportSoterAuthentication: true,
    startSoterAuthentication: true,
    checkIsSoterEnrolledInDevice: true
    //
  }
  const weApis = Object.assign({ }, onAndSyncApis, noPromiseApis, otherApis)
  Object.keys(weApis).forEach(key => {
    if (!onAndSyncApis[key] && !noPromiseApis[key]) {
      taro[key] = options => {
        options = options || {}
        let task = null
        let obj = Object.assign({}, options)
        if (typeof options === 'string') {
          return wx[key](options)
        }
        const p = new Promise((resolve, reject) => {
          ['fail', 'success', 'complete'].forEach((k) => {
            obj[k] = (res) => {
              options[k] && options[k](res)
              if (k === 'success') {
                if (key === 'connectSocket') {
                  resolve(task)
                } else {
                  resolve(res)
                }
              } else if (k === 'fail') {
                reject(res)
              }
            }
          })
          task = wx[key](obj)
        })
        if (key === 'uploadFile' || key === 'downloadFile') {
          p.progress = cb => {
            task.onProgressUpdate(cb)
            return p
          }
          p.abort = cb => {
            cb && cb()
            task.abort()
            return p
          }
        }
        return p
      }
    } else {
      taro[key] = (...args) => {
        return wx[key].apply(wx, args)
      }
    }
  })
}

export default function initNativeApi (taro) {
  processApis(taro)
  taro.request = request
  taro.getCurrentPages = getCurrentPages
  taro.getApp = getApp
}
