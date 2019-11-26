## H5 API

✅ support

☑️ todo

🤔 let me think

❌ unsupport

### 网络

#### 发起请求

✅ wx.request 

#### 上传、下载

☑️ wx.uploadFile

☑️ wx.downloadFile

#### WebSocket

✅ wx.connectSocket

❌ wx.onSocketOpen

❌ wx.onSocketError

❌ wx.sendSocketMessage

❌ wx.onSocketMessage

❌ wx.closeSocket

❌ wx.onSocketClose

✅ SocketTask

### 媒体

#### 图片

☑️ wx.chooseImage

☑️ wx.previewImage

☑️ wx.getImageInfo

🤔 wx.saveImageToPhotosAlbum
        
#### 录音

🤔 wx.startRecord

🤔 wx.stopRecord

#### 录音管理

🤔 wx.getRecorderManager
    
#### 音频播放控制

☑️ wx.playVoice

☑️ wx.pauseVoice

☑️ wx.stopVoice

#### 音乐播放控制

🤔 wx.getBackgroundAudioPlayerState

🤔 wx.playBackgroundAudio

🤔 wx.pauseBackgroundAudio

🤔 wx.seekBackgroundAudio

🤔 wx.stopBackgroundAudio

🤔 wx.onBackgroundAudioPlay

🤔 wx.onBackgroundAudioPause

🤔 wx.onBackgroundAudioStop
        
#### 背景音频播放管理

🤔 wx.getBackgroundAudioManager
        
#### 音频组件控制

☑️ wx.createAudioContext

☑️ wx.createInnerAudioContext
        
#### 视频

☑️ wx.chooseVideo

🤔 wx.saveVideoToPhotosAlbum
        
#### 视频组件控制

☑️ wx.createVideoContext
        
#### 相机组件控制

🤔 wx.createCameraContext
        
#### 实时音视频

🤔 wx.createLivePlayerContext

🤔 wx.createLivePusherContext
        
#### 文件

🤔 wx.saveFile

☑️ wx.getFileInfo

🤔 wx.getSavedFileList

🤔 wx.getSavedFileInfo

❌ wx.removeSavedFile

❌ wx.openDocument

#### 数据缓存

✅ wx.setStorage

✅ wx.setStorageSync

✅ wx.getStorage

✅ wx.getStorageSync

✅ wx.getStorageInfo

✅ wx.getStorageInfoSync

✅ wx.removeStorage

✅ wx.removeStorageSync

✅ wx.clearStorage

✅ wx.clearStorageSync

### 位置

#### 获取位置

🤔 wx.getLocation

❌ wx.chooseLocation

#### 查看位置

❌ wx.openLocation

#### 地图组件控制

❌ wx.createMapContext

### 设备

#### 系统信息

✅ wx.getSystemInfo

✅️ wx.getSystemInfoSync

☑️ wx.canIUse

#### 网络状态

✅ wx.getNetworkType

✅ wx.onNetworkStatusChange

#### 加速度计

☑️ wx.onAccelerometerChange

☑️ wx.startAccelerometer

☑️ wx.stopAccelerometer

#### 罗盘

☑️ wx.onCompassChange

☑️ wx.startCompass

☑️ wx.stopCompass

#### 拨打电话

✅ wx.makePhoneCall

#### 扫码

❌ wx.scanCode

#### 剪贴板

❌ wx.setClipboardData

❌ wx.getClipboardData

#### 蓝牙

❌ wx.openBluetoothAdapter

❌ wx.closeBluetoothAdapter

❌ wx.getBluetoothAdapterState

❌ wx.onBluetoothAdapterStateChange

❌ wx.startBluetoothDevicesDiscovery

❌ wx.stopBluetoothDevicesDiscovery

❌ wx.getBluetoothDevices

❌ wx.getConnectedBluetoothDevices

❌ wx.onBluetoothDeviceFound

❌ wx.createBLEConnection

❌ wx.closeBLEConnection

❌ wx.getBLEDeviceServices

❌ wx.getBLEDeviceCharacteristics

❌ wx.readBLECharacteristicValue

❌ wx.writeBLECharacteristicValue

❌ wx.notifyBLECharacteristicValueChange

❌ wx.onBLEConnectionStateChange

❌ wx.onBLECharacteristicValueChange

#### iBeacon

❌ wx.startBeaconDiscovery

❌ wx.stopBeaconDiscovery

❌ wx.getBeacons

❌ wx.onBeaconUpdate

❌ wx.onBeaconServiceChange

#### 屏幕亮度

❌ wx.setScreenBrightness

❌ wx.getScreenBrightness

❌ wx.setKeepScreenOn

#### 用户截屏事件

❌ wx.onUserCaptureScreen

#### 振动

☑️ wx.vibrateLong

☑️ wx.vibrateShort

#### 手机联系人

❌ wx.addPhoneContact

#### NFC

❌ wx.getHCEState

❌ wx.startHCE

❌ wx.stopHCE

❌ wx.onHCEMessage

❌ wx.sendHCEMessage

#### Wi-Fi

❌ wx.startWifi

❌ wx.stopWifi

❌ wx.connectWifi

❌ wx.getWifiList

❌ wx.onGetWifiList

❌ wx.setWifiList

❌ wx.onWifiConnected

❌ wx.getConnectedWifi

❌ wx.offWifiConnected

❌ wx.offGetWifiList

### 界面

#### 交互反馈

✅ wx.showToast

✅ wx.showLoading

✅ wx.hideToast

✅ wx.hideLoading

✅ wx.showModal

✅ wx.showActionSheet

#### 设置导航条

❌ wx.setNavigationBarTitle

❌ wx.showNavigationBarLoading

❌ wx.hideNavigationBarLoading

❌ wx.setNavigationBarColor

#### 设置tabBar

🤔 wx.setTabBarBadge

🤔 wx.removeTabBarBadge

🤔 wx.showTabBarRedDot

🤔 wx.hideTabBarRedDot

🤔 wx.setTabBarStyle

🤔 wx.setTabBarItem

🤔 wx.showTabBar

🤔 wx.hideTabBar

#### 设置置顶信息

❌ wx.setTopBarText

#### 导航

✅ wx.navigateTo

✅ wx.redirectTo

🤔 wx.switchTab

✅ wx.navigateBack

🤔 wx.reLaunch

#### 动画

✅ wx.createAnimation

#### 位置

☑️ wx.pageScrollTo

#### 绘图

☑️  wx.createCanvasContext

☑️  wx.createContext

☑️  wx.drawCanvas

☑️  wx.canvasToTempFilePath

☑️  wx.canvasGetImageData

☑️  wx.canvasPutImageData

☑️  setFillStyle

☑️  setStrokeStyle

☑️  setShadow

☑️  createLinearGradient

☑️  createCircularGradient

☑️  addColorStop

☑️  setLineWidth

☑️  setLineCap

☑️  setLineJoin

☑️  setLineDash

☑️  setMiterLimit

☑️  rect

☑️  fillRect

☑️  strokeRect

☑️  clearRect

☑️  fill

☑️  stroke

☑️  beginPath

☑️  closePath

☑️  moveTo

☑️  lineTo

☑️  arc

☑️  bezierCurveTo

☑️  quadraticCurveTo

☑️  scale

☑️  rotate

☑️  translate

☑️  clip

☑️  setFontSize

☑️  fillText

☑️  setTextAlign

☑️  setTextBaseline

☑️  drawImage

☑️  setGlobalAlpha

☑️  save

☑️  restore

☑️  draw

☑️  getActions

☑️  clearActions

☑️  measureText

☑️  globalCompositeOperation

☑️  arcTo

☑️  strokeText

☑️  lineDashOffset

☑️  createPattern

☑️  shadowBlur

☑️  shadowColor

☑️  shadowOffsetX

☑️  shadowOffsetY

☑️  font

☑️  transform

☑️  setTransform

#### 下拉刷新

🤔 Page.onPullDownRefresh

🤔 wx.startPullDownRefresh

🤔 wx.stopPullDownRefresh

#### WXML节点信息

✅ wx.createSelectorQuery

✅ selectorQuery.in

✅ selectorQuery.select

✅ selectorQuery.selectAll

✅ selectorQuery.selectViewport

✅ nodesRef.boundingClientRect

✅ nodesRef.scrollOffset

✅ nodesRef.fields

✅ selectorQuery.exec

#### WXML节点布局相交状态

🤔 wx.createIntersectionObserver

🤔 intersectionObserver.relativeTo

🤔 intersectionObserver.relativeToViewport

🤔 intersectionObserver.observe

🤔 intersectionObserver.disconnect

### 第三方平台

❌ wx.getExtConfig
    
❌ wx.getExtConfigSync
    
### 开放接口

#### 登录

❌ wx.login

❌ wx.checkSession

#### 授权

❌ wx.authorize

#### 用户信息

❌ wx.getUserInfo

❌ getPhoneNumber
        
#### 微信支付

❌ wx.requestPayment

#### 模板消息

❌

#### 客服消息

❌

#### 转发

❌
    
#### 获取二维码

❌

#### 收货地址

❌ wx.chooseAddress
    
#### 卡券

❌ wx.addCard

❌ wx.openCard

❌ 会员卡组件

#### 设置

❌ wx.openSetting

❌ wx.getSetting

#### 微信运动

❌ wx.getWeRunData

#### 打开小程序

❌ wx.navigateToMiniProgram

❌ wx.navigateBackMiniProgram

#### 打开APP

☑️ launchApp

#### 获取发票抬头

❌ wx.chooseInvoiceTitle

#### 生物认证

❌ wx.checkIsSupportSoterAuthentication

❌ wx.startSoterAuthentication

❌ wx.checkIsSoterEnrolledInDevice

#### 附近

❌

#### 插件管理

❌

### 数据

❌

#### 更新

❌ wx.getUpdateManager

#### 多线程

🤔 wx.createWorker

#### 调试接口

❌ 打开/关闭调试
