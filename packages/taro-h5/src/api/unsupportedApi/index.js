import { temporarilyNotSupport } from '../utils'

// onAndSyncApis
// export const onSocketOpen = temporarilyNotSupport('onSocketOpen')
// export const onSocketError = temporarilyNotSupport('onSocketError')
// export const onSocketMessage = temporarilyNotSupport('onSocketMessage')
// export const onSocketClose = temporarilyNotSupport('onSocketClose')
export const onBackgroundAudioPlay = temporarilyNotSupport('onBackgroundAudioPlay')
export const onBackgroundAudioPause = temporarilyNotSupport('onBackgroundAudioPause')
export const onBackgroundAudioStop = temporarilyNotSupport('onBackgroundAudioStop')
// export const onNetworkStatusChange = temporarilyNotSupport('onNetworkStatusChange')
// export const onAccelerometerChange = temporarilyNotSupport('onAccelerometerChange')
// export const onCompassChange = temporarilyNotSupport('onCompassChange')
// export const onDeviceMotionChange = temporarilyNotSupport('onDeviceMotionChange')
export const onBluetoothAdapterStateChange = temporarilyNotSupport('onBluetoothAdapterStateChange')
export const onBluetoothDeviceFound = temporarilyNotSupport('onBluetoothDeviceFound')
export const onBLEConnectionStateChange = temporarilyNotSupport('onBLEConnectionStateChange')
export const onBLECharacteristicValueChange = temporarilyNotSupport('onBLECharacteristicValueChange')
export const onBeaconUpdate = temporarilyNotSupport('onBeaconUpdate')
export const onBeaconServiceChange = temporarilyNotSupport('onBeaconServiceChange')
export const onUserCaptureScreen = temporarilyNotSupport('onUserCaptureScreen')
export const onHCEMessage = temporarilyNotSupport('onHCEMessage')
export const onGetWifiList = temporarilyNotSupport('onGetWifiList')
export const onWifiConnected = temporarilyNotSupport('onWifiConnected')
export const offWifiConnected = temporarilyNotSupport('offWifiConnected')
export const offGetWifiList = temporarilyNotSupport('offGetWifiList')
// export const setStorageSync = temporarilyNotSupport('setStorageSync')
// export const getStorageSync = temporarilyNotSupport('getStorageSync')
// export const getStorageInfoSync = temporarilyNotSupport('getStorageInfoSync')
// export const removeStorageSync = temporarilyNotSupport('removeStorageSync')
// export const clearStorageSync = temporarilyNotSupport('clearStorageSync')
// export const getSystemInfoSync = temporarilyNotSupport('getSystemInfoSync')
export const getExtConfigSync = temporarilyNotSupport('getExtConfigSync')
export const getLogManager = temporarilyNotSupport('getLogManager')
export const onMemoryWarning = temporarilyNotSupport('onMemoryWarning')
export const reportAnalytics = temporarilyNotSupport('reportAnalytics')
export const navigateToSmartGameProgram = temporarilyNotSupport('navigateToSmartGameProgram')

// 文件
export const getFileSystemManager = temporarilyNotSupport('getFileSystemManager')

// noPromiseApis
// 媒体
export const stopRecord = temporarilyNotSupport('stopRecord')
export const getRecorderManager = temporarilyNotSupport('getRecorderManager')
export const pauseVoice = temporarilyNotSupport('pauseVoice')
export const stopVoice = temporarilyNotSupport('stopVoice')
export const pauseBackgroundAudio = temporarilyNotSupport('pauseBackgroundAudio')
export const stopBackgroundAudio = temporarilyNotSupport('stopBackgroundAudio')
export const getBackgroundAudioManager = temporarilyNotSupport('getBackgroundAudioManager')
export const createAudioContext = temporarilyNotSupport('createAudioContext')
// export const createInnerAudioContext = temporarilyNotSupport('createInnerAudioContext')
// export const createVideoContext = temporarilyNotSupport('createVideoContext')
export const createCameraContext = temporarilyNotSupport('createCameraContext')
export const createLivePlayerContext = temporarilyNotSupport('createLivePlayerContext')
export const createLivePusherContext = temporarilyNotSupport('createLivePusherContext')

// 位置
export const createMapContext = temporarilyNotSupport('createMapContext')

// 设备
export const canIUse = temporarilyNotSupport('canIUse')
// export const startAccelerometer = temporarilyNotSupport('startAccelerometer')
// export const stopAccelerometer = temporarilyNotSupport('stopAccelerometer')
// export const startCompass = temporarilyNotSupport('startCompass')
// export const stopCompass = temporarilyNotSupport('stopCompass')
// export const startDeviceMotionListening = temporarilyNotSupport('startDeviceMotionListening')
// export const stopDeviceMotionListening = temporarilyNotSupport('stopDeviceMotionListening')

// 界面
// export const hideToast = temporarilyNotSupport('hideToast')
// export const hideLoading = temporarilyNotSupport('hideLoading')
export const showNavigationBarLoading = temporarilyNotSupport('showNavigationBarLoading')
export const hideNavigationBarLoading = temporarilyNotSupport('hideNavigationBarLoading')
// export const createAnimation = temporarilyNotSupport('createAnimation')
// export const pageScrollTo = temporarilyNotSupport('pageScrollTo')
// export const createSelectorQuery = temporarilyNotSupport('createSelectorQuery')
// export const createCanvasContext = temporarilyNotSupport('createCanvasContext')
// export const createContext = temporarilyNotSupport('createContext')
export const drawCanvas = temporarilyNotSupport('drawCanvas')
export const hideKeyboard = temporarilyNotSupport('hideKeyboard')
// export const stopPullDownRefresh = temporarilyNotSupport('stopPullDownRefresh')
export const createIntersectionObserver = temporarilyNotSupport('createIntersectionObserver')

// 自定义组件
// export const nextTick = temporarilyNotSupport('nextTick')

// 菜单
export const getMenuButtonBoundingClientRect = temporarilyNotSupport('getMenuButtonBoundingClientRect')

// 窗口
// export const onWindowResize = temporarilyNotSupport('onWindowResize')
// export const offWindowResize = temporarilyNotSupport('offWindowResize')

// 拓展接口
// export const arrayBufferToBase64 = temporarilyNotSupport('arrayBufferToBase64')
// export const base64ToArrayBuffer = temporarilyNotSupport('base64ToArrayBuffer')

export const getAccountInfoSync = temporarilyNotSupport('getAccountInfoSync')
export const getUpdateManager = temporarilyNotSupport('getUpdateManager')
export const createWorker = temporarilyNotSupport('createWorker')

// otherApis
// 网络
// export const uploadFile = temporarilyNotSupport('uploadFile')
// export const downloadFile = temporarilyNotSupport('downloadFile')
// export const connectSocket = temporarilyNotSupport('connectSocket')
// export const sendSocketMessage = temporarilyNotSupport('sendSocketMessage')
// export const closeSocket = temporarilyNotSupport('closeSocket')

// 媒体
// export const chooseImage = temporarilyNotSupport('chooseImage')
// export const previewImage = temporarilyNotSupport('previewImage')
// export const getImageInfo = temporarilyNotSupport('getImageInfo')
export const saveImageToPhotosAlbum = temporarilyNotSupport('saveImageToPhotosAlbum')
export const startRecord = temporarilyNotSupport('startRecord')
export const playVoice = temporarilyNotSupport('playVoice')
export const setInnerAudioOption = temporarilyNotSupport('setInnerAudioOption')
export const getAvailableAudioSources = temporarilyNotSupport('getAvailableAudioSources')
export const getBackgroundAudioPlayerState = temporarilyNotSupport('getBackgroundAudioPlayerState')
export const playBackgroundAudio = temporarilyNotSupport('playBackgroundAudio')
export const seekBackgroundAudio = temporarilyNotSupport('seekBackgroundAudio')
// export const chooseVideo = temporarilyNotSupport('chooseVideo')
export const saveVideoToPhotosAlbum = temporarilyNotSupport('saveVideoToPhotosAlbum')
export const loadFontFace = temporarilyNotSupport('loadFontFace')

// 文件
export const saveFile = temporarilyNotSupport('saveFile')
export const getFileInfo = temporarilyNotSupport('getFileInfo')
export const getSavedFileList = temporarilyNotSupport('getSavedFileList')
export const getSavedFileInfo = temporarilyNotSupport('getSavedFileInfo')
export const removeSavedFile = temporarilyNotSupport('removeSavedFile')
export const openDocument = temporarilyNotSupport('openDocument')

// 数据缓存
// export const setStorage = temporarilyNotSupport('setStorage')
// export const getStorage = temporarilyNotSupport('getStorage')
// export const getStorageInfo = temporarilyNotSupport('getStorageInfo')
// export const removeStorage = temporarilyNotSupport('removeStorage')
// export const clearStorage = temporarilyNotSupport('clearStorage')

// 导航
// export const navigateBack = temporarilyNotSupport('navigateBack')
// export const navigateTo = temporarilyNotSupport('navigateTo')
// export const redirectTo = temporarilyNotSupport('redirectTo')
// export const switchTab = temporarilyNotSupport('switchTab')
// export const reLaunch = temporarilyNotSupport('reLaunch')

// 位置
// export const getLocation = temporarilyNotSupport('getLocation')
// export const chooseLocation = temporarilyNotSupport('chooseLocation')
// export const openLocation = temporarilyNotSupport('openLocation')

// 设备
// export const getSystemInfo = temporarilyNotSupport('getSystemInfo')
// export const getNetworkType = temporarilyNotSupport('getNetworkType')
// export const makePhoneCall = temporarilyNotSupport('makePhoneCall')
// export const scanCode = temporarilyNotSupport('scanCode')
// export const setClipboardData = temporarilyNotSupport('setClipboardData')
// export const getClipboardData = temporarilyNotSupport('getClipboardData')
export const openBluetoothAdapter = temporarilyNotSupport('openBluetoothAdapter')
export const closeBluetoothAdapter = temporarilyNotSupport('closeBluetoothAdapter')
export const getBluetoothAdapterState = temporarilyNotSupport('getBluetoothAdapterState')
export const startBluetoothDevicesDiscovery = temporarilyNotSupport('startBluetoothDevicesDiscovery')
export const stopBluetoothDevicesDiscovery = temporarilyNotSupport('stopBluetoothDevicesDiscovery')
export const getBluetoothDevices = temporarilyNotSupport('getBluetoothDevices')
export const getConnectedBluetoothDevices = temporarilyNotSupport('getConnectedBluetoothDevices')
export const createBLEConnection = temporarilyNotSupport('createBLEConnection')
export const closeBLEConnection = temporarilyNotSupport('closeBLEConnection')
export const getBLEDeviceServices = temporarilyNotSupport('getBLEDeviceServices')
export const getBLEDeviceCharacteristics = temporarilyNotSupport('getBLEDeviceCharacteristics')
export const readBLECharacteristicValue = temporarilyNotSupport('readBLECharacteristicValue')
export const writeBLECharacteristicValue = temporarilyNotSupport('writeBLECharacteristicValue')
export const notifyBLECharacteristicValueChange = temporarilyNotSupport('notifyBLECharacteristicValueChange')
export const startBeaconDiscovery = temporarilyNotSupport('startBeaconDiscovery')
export const stopBeaconDiscovery = temporarilyNotSupport('stopBeaconDiscovery')
export const getBeacons = temporarilyNotSupport('getBeacons')
export const setScreenBrightness = temporarilyNotSupport('setScreenBrightness')
export const getScreenBrightness = temporarilyNotSupport('getScreenBrightness')
export const setKeepScreenOn = temporarilyNotSupport('setKeepScreenOn')
// export const vibrateLong = temporarilyNotSupport('vibrateLong')
// export const vibrateShort = temporarilyNotSupport('vibrateShort')
export const addPhoneContact = temporarilyNotSupport('addPhoneContact')
export const getHCEState = temporarilyNotSupport('getHCEState')
export const startHCE = temporarilyNotSupport('startHCE')
export const stopHCE = temporarilyNotSupport('stopHCE')
export const sendHCEMessage = temporarilyNotSupport('sendHCEMessage')
export const startWifi = temporarilyNotSupport('startWifi')
export const stopWifi = temporarilyNotSupport('stopWifi')
export const connectWifi = temporarilyNotSupport('connectWifi')
export const getWifiList = temporarilyNotSupport('getWifiList')
export const setWifiList = temporarilyNotSupport('setWifiList')
export const getConnectedWifi = temporarilyNotSupport('getConnectedWifi')

// 界面
// export const showToast = temporarilyNotSupport('showToast')
// export const showLoading = temporarilyNotSupport('showLoading')
// export const showModal = temporarilyNotSupport('showModal')
// export const showActionSheet = temporarilyNotSupport('showActionSheet')
// export const setNavigationBarTitle = temporarilyNotSupport('setNavigationBarTitle')
// export const setNavigationBarColor = temporarilyNotSupport('setNavigationBarColor')
// export const setTabBarBadge = temporarilyNotSupport('setTabBarBadge')
// export const removeTabBarBadge = temporarilyNotSupport('removeTabBarBadge')
// export const showTabBarRedDot = temporarilyNotSupport('showTabBarRedDot')
// export const hideTabBarRedDot = temporarilyNotSupport('hideTabBarRedDot')
// export const setTabBarStyle = temporarilyNotSupport('setTabBarStyle')
// export const setTabBarItem = temporarilyNotSupport('setTabBarItem')
// export const showTabBar = temporarilyNotSupport('showTabBar')
// export const hideTabBar = temporarilyNotSupport('hideTabBar')
export const setTopBarText = temporarilyNotSupport('setTopBarText')
// export const startPullDownRefresh = temporarilyNotSupport('startPullDownRefresh')
// export const canvasToTempFilePath = temporarilyNotSupport('canvasToTempFilePath')
// export const canvasGetImageData = temporarilyNotSupport('canvasGetImageData')
// export const canvasPutImageData = temporarilyNotSupport('canvasPutImageData')

export const setBackgroundColor = temporarilyNotSupport('setBackgroundColor')
export const setBackgroundTextStyle = temporarilyNotSupport('setBackgroundTextStyle')

// 第三方平台
export const getExtConfig = temporarilyNotSupport('getExtConfig')

// 开放接口
export const login = temporarilyNotSupport('login')
export const checkSession = temporarilyNotSupport('checkSession')
export const authorize = temporarilyNotSupport('authorize')
export const getUserInfo = temporarilyNotSupport('getUserInfo')
export const checkIsSupportFacialRecognition = temporarilyNotSupport('checkIsSupportFacialRecognition')
export const startFacialRecognitionVerify = temporarilyNotSupport('startFacialRecognitionVerify')
export const startFacialRecognitionVerifyAndUploadVideo = temporarilyNotSupport('startFacialRecognitionVerifyAndUploadVideo')
export const faceVerifyForPay = temporarilyNotSupport('faceVerifyForPay')
// export const requestPayment = temporarilyNotSupport('requestPayment')
export const showShareMenu = temporarilyNotSupport('showShareMenu')
export const hideShareMenu = temporarilyNotSupport('hideShareMenu')
export const updateShareMenu = temporarilyNotSupport('updateShareMenu')
export const getShareInfo = temporarilyNotSupport('getShareInfo')
export const chooseAddress = temporarilyNotSupport('chooseAddress')
export const addCard = temporarilyNotSupport('addCard')
export const openCard = temporarilyNotSupport('openCard')
export const openSetting = temporarilyNotSupport('openSetting')
export const getSetting = temporarilyNotSupport('getSetting')
export const getWeRunData = temporarilyNotSupport('getWeRunData')
export const navigateToMiniProgram = temporarilyNotSupport('navigateToMiniProgram')
export const navigateBackMiniProgram = temporarilyNotSupport('navigateBackMiniProgram')
export const chooseInvoice = temporarilyNotSupport('chooseInvoice')
export const chooseInvoiceTitle = temporarilyNotSupport('chooseInvoiceTitle')
export const checkIsSupportSoterAuthentication = temporarilyNotSupport('checkIsSupportSoterAuthentication')
export const startSoterAuthentication = temporarilyNotSupport('startSoterAuthentication')
export const checkIsSoterEnrolledInDevice = temporarilyNotSupport('checkIsSoterEnrolledInDevice')

export const setEnableDebug = temporarilyNotSupport('setEnableDebug')

// 百度小程序专有 API
// 百度小程序 AI 相关
export const ocrIdCard = temporarilyNotSupport('ocrIdCard')
export const ocrBankCard = temporarilyNotSupport('ocrBankCard')
export const ocrDrivingLicense = temporarilyNotSupport('ocrDrivingLicense')
export const ocrVehicleLicense = temporarilyNotSupport('ocrVehicleLicense')
export const textReview = temporarilyNotSupport('textReview')
export const textToAudio = temporarilyNotSupport('textToAudio')
export const imageAudit = temporarilyNotSupport('imageAudit')
export const advancedGeneralIdentify = temporarilyNotSupport('advancedGeneralIdentify')
export const objectDetectIdentify = temporarilyNotSupport('objectDetectIdentify')
export const carClassify = temporarilyNotSupport('carClassify')
export const dishClassify = temporarilyNotSupport('dishClassify')
export const logoClassify = temporarilyNotSupport('logoClassify')
export const animalClassify = temporarilyNotSupport('animalClassify')
export const plantClassify = temporarilyNotSupport('plantClassify')

// 用户信息
export const getSwanId = temporarilyNotSupport('getSwanId')

// 百度收银台支付
export const requestPolymerPayment = temporarilyNotSupport('requestPolymerPayment')

// 打开小程序
export const navigateToSmartProgram = temporarilyNotSupport('navigateToSmartProgram')
export const navigateBackSmartProgram = temporarilyNotSupport('navigateBackSmartProgram')
export const preloadSubPackage = temporarilyNotSupport('preloadSubPackage')
