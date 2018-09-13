import request from './api/request'
import storage from './api/storage'
import system from './api/system'
import network from './api/network'
import clipboard from './api/clipboard'
import phone from './api/phone'
import vibrate from './api/vibrate'
import media from './api/media'
import webSocket from './api/webSocket'
import geolocation from './api/geolocation'
import { showToast, showLoading, hideToast, hideLoading } from './api/WxToast'
import showModal from './api/WxModal'
import showActionSheet from './api/WxActionSheet'
import previewImage from './api/WxPreviewImage'

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
    getExtConfigSync: true
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
  const weApis = Object.assign({}, onAndSyncApis, noPromiseApis, otherApis)
  Object.keys(weApis).forEach(key => {
    taro[key] = () => {
      console.log(`暂时不支持 ${key}`)
    }
  })
}

export default function initNativeApi (taro) {
  processApis(taro)
  Object.assign(
    taro,
    request,
    storage,
    system,
    network,
    clipboard,
    phone,
    vibrate,
    media,
    webSocket,
    geolocation,
    showToast,
    showLoading,
    hideToast,
    hideLoading,
    showModal,
    showActionSheet,
    previewImage
  )
}
