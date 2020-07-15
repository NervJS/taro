module.exports = {
  docs: {
    关于Taro: ['README', 'team', 'CONTRIBUTING'],
    快速开始: ['GETTING-STARTED', 'composition', 'before-dev-remind'],
    基础教程: [
      'react',
      'vue',
      'vue3',
      'nerv',
      'tutorial',
      'project-config',
      'router',
      'size',
      'static-reference',
      {
        label: '多端开发',
        type: 'category',
        items: ['envs', 'envs-debug', 'wxcloudbase', 'miniprogram-plugin'],
      },
    ],
    进阶指南: [
      'config',
      'config-detail',
      'plugin',
      'debug-config',
      'hooks',
      'jquery-like',
      'html',
      'css-in-js',
      'prerender',
      'virtual-list',
      'mini-third-party',
      'hybrid',
    ],
    迁移指南: ['migration'],
    社区生态: ['redux', 'css-modules', 'template', 'youshu', 'report', 'join-in', 'CONTRIBUTING'],
  },
  "components": {
    "关于组件库": [
      "components-desc"
    ],
    "视图容器": [
      "components/viewContainer/view",
      "components/viewContainer/scroll-view",
      "components/viewContainer/swiper",
      "components/viewContainer/movable-view",
      "components/viewContainer/cover-view"
    ],
    "基础内容": [
      "components/base/icon",
      "components/base/text",
      "components/base/progress",
      "components/base/rich-text"
    ],
    "表单组件": [
      "components/forms/button",
      "components/forms/checkbox",
      "components/forms/form",
      "components/forms/input",
      "components/forms/label",
      "components/forms/picker",
      "components/forms/picker-view",
      "components/forms/radio",
      "components/forms/slider",
      "components/forms/switch",
      "components/forms/textarea"
    ],
    "导航": [
      "components/navig/navigator"
    ],
    "媒体组件": [
      "components/media/audio",
      "components/media/image",
      "components/media/video",
      "components/media/camera"
    ],
    "地图": [
      "components/maps/map"
    ],
    "画布": [
      "components/canvas/canvas"
    ],
    "开放能力": [
      "components/open/ad",
      "components/open/official-account",
      "components/open/open-data",
      "components/open/web-view",
      "components/open/others"
    ]
  },
  "API": {
    "关于API": [
      "apis/about/desc",
      "apis/about/env",
      "apis/about/events",
      "apis/General"
    ],
    "基础": [
      "apis/base/canIUse",
      "apis/base/base64ToArrayBuffer",
      "apis/base/arrayBufferToBase64",
      {
        "label": "系统",
        "type": "category",
        "items": [
          "apis/base/system/getSystemInfo",
          "apis/base/system/getSystemInfoSync"
        ]
      },
      {
        "label": "更新",
        "type": "category",
        "items": [
          "apis/base/update/getUpdateManager",
          "apis/base/update/UpdateManager"
        ]
      },
      {
        "label": "小程序",
        "type": "category",
        "items": [
          {
            "label": "生命周期",
            "type": "category",
            "items": [
              "apis/base/weapp/life-cycle/getLaunchOptionsSync"
            ]
          },
          {
            "label": "应用级事件",
            "type": "category",
            "items": [
              "apis/base/weapp/app-event/onPageNotFound",
              "apis/base/weapp/app-event/onError",
              "apis/base/weapp/app-event/onAudioInterruptionEnd",
              "apis/base/weapp/app-event/onAudioInterruptionBegin",
              "apis/base/weapp/app-event/onAppShow",
              "apis/base/weapp/app-event/onAppHide",
              "apis/base/weapp/app-event/offPageNotFound",
              "apis/base/weapp/app-event/offError",
              "apis/base/weapp/app-event/offAudioInterruptionEnd",
              "apis/base/weapp/app-event/offAudioInterruptionBegin",
              "apis/base/weapp/app-event/offAppShow",
              "apis/base/weapp/app-event/offAppHide"
            ]
          }
        ]
      },
      {
        "label": "调试",
        "type": "category",
        "items": [
          "apis/base/debug/setEnableDebug",
          "apis/base/debug/getRealtimeLogManager",
          "apis/base/debug/getLogManager",
          "apis/base/debug/LogManager",
          "apis/base/debug/RealtimeLogManager"
        ]
      },
      "apis/base/env/env"
    ],
    "路由": [
      "apis/route/switchTab",
      "apis/route/reLaunch",
      "apis/route/redirectTo",
      "apis/route/navigateTo",
      "apis/route/navigateBack",
      "apis/route/EventChannel"
    ],
    "框架": [
      "apis/framework/App",
      "apis/framework/getApp",
      "apis/framework/getCurrentPages",
      "apis/framework/Page"
    ],
    "界面": [
      {
        "label": "交互",
        "type": "category",
        "items": [
          "apis/ui/interaction/showToast",
          "apis/ui/interaction/showModal",
          "apis/ui/interaction/showLoading",
          "apis/ui/interaction/showActionSheet",
          "apis/ui/interaction/hideToast",
          "apis/ui/interaction/hideLoading"
        ]
      },
      {
        "label": "导航栏",
        "type": "category",
        "items": [
          "apis/ui/navigation-bar/showNavigationBarLoading",
          "apis/ui/navigation-bar/setNavigationBarTitle",
          "apis/ui/navigation-bar/setNavigationBarColor",
          "apis/ui/navigation-bar/hideNavigationBarLoading",
          "apis/ui/navigation-bar/hideHomeButton"
        ]
      },
      {
        "label": "背景",
        "type": "category",
        "items": [
          "apis/ui/background/setBackgroundTextStyle",
          "apis/ui/background/setBackgroundColor"
        ]
      },
      {
        "label": "Tab Bar",
        "type": "category",
        "items": [
          "apis/ui/tab-bar/showTabBarRedDot",
          "apis/ui/tab-bar/showTabBar",
          "apis/ui/tab-bar/setTabBarStyle",
          "apis/ui/tab-bar/setTabBarItem",
          "apis/ui/tab-bar/setTabBarBadge",
          "apis/ui/tab-bar/removeTabBarBadge",
          "apis/ui/tab-bar/hideTabBarRedDot",
          "apis/ui/tab-bar/hideTabBar"
        ]
      },
      {
        "label": "字体",
        "type": "category",
        "items": [
          "apis/ui/fonts/loadFontFace"
        ]
      },
      {
        "label": "下拉刷新",
        "type": "category",
        "items": [
          "apis/ui/pull-down-refresh/stopPullDownRefresh",
          "apis/ui/pull-down-refresh/startPullDownRefresh"
        ]
      },
      {
        "label": "滚动",
        "type": "category",
        "items": [
          "apis/ui/scroll/pageScrollTo"
        ]
      },
      {
        "label": "动画",
        "type": "category",
        "items": [
          "apis/ui/animation/createAnimation",
          "apis/ui/animation/Animation"
        ]
      },
      {
        "label": "置顶",
        "type": "category",
        "items": [
          "apis/ui/sticky/setTopBarText"
        ]
      },
      {
        "label": "自定义组件",
        "type": "category",
        "items": [
          "apis/ui/custom-component/nextTick"
        ]
      },
      {
        "label": "菜单",
        "type": "category",
        "items": [
          "apis/ui/menu/getMenuButtonBoundingClientRect"
        ]
      },
      {
        "label": "窗口",
        "type": "category",
        "items": [
          "apis/ui/window/onWindowResize",
          "apis/ui/window/offWindowResize"
        ]
      },
      {
        "label": "键盘",
        "type": "category",
        "items": [
          "apis/ui/keyboard/onKeyboardHeightChange",
          "apis/ui/keyboard/hideKeyboard",
          "apis/ui/keyboard/getSelectedTextRange"
        ]
      }
    ],
    "网络": [
      {
        "label": "发起请求",
        "type": "category",
        "items": [
          "apis/network/request/request",
          "apis/network/request/RequestTask",
          "apis/network/request/addInterceptor"
        ]
      },
      {
        "label": "下载",
        "type": "category",
        "items": [
          "apis/network/download/downloadFile",
          "apis/network/download/DownloadTask"
        ]
      },
      {
        "label": "上传",
        "type": "category",
        "items": [
          "apis/network/upload/uploadFile",
          "apis/network/upload/UploadTask"
        ]
      },
      {
        "label": "WebSocket",
        "type": "category",
        "items": [
          "apis/network/webSocket/sendSocketMessage",
          "apis/network/webSocket/onSocketOpen",
          "apis/network/webSocket/onSocketMessage",
          "apis/network/webSocket/onSocketError",
          "apis/network/webSocket/onSocketClose",
          "apis/network/webSocket/connectSocket",
          "apis/network/webSocket/closeSocket",
          "apis/network/webSocket/SocketTask"
        ]
      },
      {
        "label": "mDNS",
        "type": "category",
        "items": [
          "apis/network/mdns/stopLocalServiceDiscovery",
          "apis/network/mdns/startLocalServiceDiscovery",
          "apis/network/mdns/onLocalServiceResolveFail",
          "apis/network/mdns/onLocalServiceLost",
          "apis/network/mdns/onLocalServiceFound",
          "apis/network/mdns/onLocalServiceDiscoveryStop",
          "apis/network/mdns/offLocalServiceResolveFail",
          "apis/network/mdns/offLocalServiceLost",
          "apis/network/mdns/offLocalServiceFound",
          "apis/network/mdns/offLocalServiceDiscoveryStop"
        ]
      },
      {
        "label": "UDP 通信",
        "type": "category",
        "items": [
          "apis/network/udp/createUDPSocket",
          "apis/network/udp/UDPSocket"
        ]
      }
    ],
    "数据缓存": [
      "apis/storage/setStorageSync",
      "apis/storage/setStorage",
      "apis/storage/removeStorageSync",
      "apis/storage/removeStorage",
      "apis/storage/getStorageSync",
      "apis/storage/getStorageInfoSync",
      "apis/storage/getStorageInfo",
      "apis/storage/getStorage",
      "apis/storage/clearStorageSync",
      "apis/storage/clearStorage",
      {
        "label": "周期性更新",
        "type": "category",
        "items": [
          "apis/storage/background-fetch/setBackgroundFetchToken",
          "apis/storage/background-fetch/onBackgroundFetchData",
          "apis/storage/background-fetch/getBackgroundFetchToken",
          "apis/storage/background-fetch/getBackgroundFetchData"
        ]
      }
    ],
    "媒体": [
      {
        "label": "地图",
        "type": "category",
        "items": [
          "apis/media/map/createMapContext",
          "apis/media/map/MapContext"
        ]
      },
      {
        "label": "图片",
        "type": "category",
        "items": [
          "apis/media/image/saveImageToPhotosAlbum",
          "apis/media/image/previewImage",
          "apis/media/image/getImageInfo",
          "apis/media/image/compressImage",
          "apis/media/image/chooseMessageFile",
          "apis/media/image/chooseImage"
        ]
      },
      {
        "label": "视频",
        "type": "category",
        "items": [
          "apis/media/video/saveVideoToPhotosAlbum",
          "apis/media/video/createVideoContext",
          "apis/media/video/chooseVideo",
          "apis/media/video/VideoContext"
        ]
      },
      {
        "label": "音频",
        "type": "category",
        "items": [
          "apis/media/audio/stopVoice",
          "apis/media/audio/setInnerAudioOption",
          "apis/media/audio/playVoice",
          "apis/media/audio/pauseVoice",
          "apis/media/audio/getAvailableAudioSources",
          "apis/media/audio/createInnerAudioContext",
          "apis/media/audio/createAudioContext",
          "apis/media/audio/AudioContext",
          "apis/media/audio/InnerAudioContext"
        ]
      },
      {
        "label": "背景音频",
        "type": "category",
        "items": [
          "apis/media/background-audio/stopBackgroundAudio",
          "apis/media/background-audio/seekBackgroundAudio",
          "apis/media/background-audio/playBackgroundAudio",
          "apis/media/background-audio/pauseBackgroundAudio",
          "apis/media/background-audio/onBackgroundAudioStop",
          "apis/media/background-audio/onBackgroundAudioPlay",
          "apis/media/background-audio/onBackgroundAudioPause",
          "apis/media/background-audio/getBackgroundAudioPlayerState",
          "apis/media/background-audio/getBackgroundAudioManager",
          "apis/media/background-audio/BackgroundAudioManager"
        ]
      },
      {
        "label": "实时音视频",
        "type": "category",
        "items": [
          "apis/media/live/createLivePusherContext",
          "apis/media/live/createLivePlayerContext",
          "apis/media/live/LivePlayerContext",
          "apis/media/live/LivePusherContext"
        ]
      },
      {
        "label": "录音",
        "type": "category",
        "items": [
          "apis/media/recorder/stopRecord",
          "apis/media/recorder/startRecord",
          "apis/media/recorder/getRecorderManager",
          "apis/media/recorder/RecorderManager"
        ]
      },
      {
        "label": "相机",
        "type": "category",
        "items": [
          "apis/media/camera/createCameraContext",
          "apis/media/camera/CameraContext"
        ]
      },
      {
        "label": "富文本",
        "type": "category",
        "items": [
          "apis/media/editor/EditorContext"
        ]
      },
      {
        "label": "音视频合成",
        "type": "category",
        "items": [
          "apis/media/video-processing/createMediaContainer",
          "apis/media/video-processing/MediaContainer",
          "apis/media/video-processing/MediaTrack"
        ]
      }
    ],
    "位置": [
      "apis/location/stopLocationUpdate",
      "apis/location/startLocationUpdateBackground",
      "apis/location/startLocationUpdate",
      "apis/location/openLocation",
      "apis/location/onLocationChange",
      "apis/location/offLocationChange",
      "apis/location/getLocation",
      "apis/location/chooseLocation"
    ],
    "转发": [
      "apis/share/updateShareMenu",
      "apis/share/showShareMenu",
      "apis/share/hideShareMenu",
      "apis/share/getShareInfo"
    ],
    "画布": [
      "apis/canvas/createOffscreenCanvas",
      "apis/canvas/createCanvasContext",
      "apis/canvas/canvasToTempFilePath",
      "apis/canvas/canvasPutImageData",
      "apis/canvas/canvasGetImageData",
      "apis/canvas/Canvas",
      "apis/canvas/CanvasContext",
      "apis/canvas/CanvasGradient",
      "apis/canvas/Color",
      "apis/canvas/Image",
      "apis/canvas/ImageData",
      "apis/canvas/OffscreenCanvas",
      "apis/canvas/RenderingContext"
    ],
    "文件": [
      "apis/files/saveFile",
      "apis/files/removeSavedFile",
      "apis/files/openDocument",
      "apis/files/getSavedFileList",
      "apis/files/getSavedFileInfo",
      "apis/files/getFileSystemManager",
      "apis/files/getFileInfo",
      "apis/files/FileSystemManager",
      "apis/files/Stats"
    ],
    "开放接口": [
      {
        "label": "登录",
        "type": "category",
        "items": [
          "apis/open-api/login/login",
          "apis/open-api/login/checkSession"
        ]
      },
      {
        "label": "小程序跳转",
        "type": "category",
        "items": [
          "apis/open-api/navigate/navigateToMiniProgram",
          "apis/open-api/navigate/navigateBackMiniProgram"
        ]
      },
      {
        "label": "账户信息",
        "type": "category",
        "items": [
          "apis/open-api/account/getAccountInfoSync"
        ]
      },
      {
        "label": "用户信息",
        "type": "category",
        "items": [
          "apis/open-api/user-info/getUserInfo",
          "apis/open-api/user-info/UserInfo"
        ]
      },
      {
        "label": "数据上报",
        "type": "category",
        "items": [
          "apis/open-api/report/reportMonitor"
        ]
      },
      {
        "label": "数据分析",
        "type": "category",
        "items": [
          "apis/open-api/data-analysis/reportAnalytics"
        ]
      },
      {
        "label": "支付",
        "type": "category",
        "items": [
          "apis/open-api/payment/requestPayment",
          "apis/open-api/payment/faceVerifyForPay"
        ]
      },
      {
        "label": "授权",
        "type": "category",
        "items": [
          "apis/open-api/authorize/authorize"
        ]
      },
      {
        "label": "设置",
        "type": "category",
        "items": [
          "apis/open-api/settings/openSetting",
          "apis/open-api/settings/getSetting",
          "apis/open-api/settings/AuthSetting"
        ]
      },
      {
        "label": "收货地址",
        "type": "category",
        "items": [
          "apis/open-api/address/chooseAddress"
        ]
      },
      {
        "label": "卡券",
        "type": "category",
        "items": [
          "apis/open-api/card/openCard",
          "apis/open-api/card/addCard"
        ]
      },
      {
        "label": "发票",
        "type": "category",
        "items": [
          "apis/open-api/invoice/chooseInvoiceTitle",
          "apis/open-api/invoice/chooseInvoice"
        ]
      },
      {
        "label": "生物认证",
        "type": "category",
        "items": [
          "apis/open-api/soter/startSoterAuthentication",
          "apis/open-api/soter/checkIsSupportSoterAuthentication",
          "apis/open-api/soter/checkIsSoterEnrolledInDevice",
          "apis/open-api/facial/checkIsSupportFacialRecognition",
          "apis/open-api/facial/startFacialRecognitionVerify",
          "apis/open-api/facial/startFacialRecognitionVerifyAndUploadVideo"
        ]
      },
      {
        "label": "微信运动",
        "type": "category",
        "items": [
          "apis/open-api/werun/getWeRunData"
        ]
      },
      {
        "label": "订阅消息",
        "type": "category",
        "items": [
          "apis/open-api/subscribe-message/requestSubscribeMessage"
        ]
      }
    ],
    "设备": [
      {
        "label": "IBeacon",
        "type": "category",
        "items": [
          "apis/device/ibeacon/stopBeaconDiscovery",
          "apis/device/ibeacon/startBeaconDiscovery",
          "apis/device/ibeacon/onBeaconUpdate",
          "apis/device/ibeacon/onBeaconServiceChange",
          "apis/device/ibeacon/offBeaconUpdate",
          "apis/device/ibeacon/offBeaconServiceChange",
          "apis/device/ibeacon/getBeacons",
          "apis/device/ibeacon/IBeaconInfo"
        ]
      },
      {
        "label": "Wi-Fi",
        "type": "category",
        "items": [
          "apis/device/wifi/stopWifi",
          "apis/device/wifi/startWifi",
          "apis/device/wifi/setWifiList",
          "apis/device/wifi/onWifiConnected",
          "apis/device/wifi/onGetWifiList",
          "apis/device/wifi/offWifiConnected",
          "apis/device/wifi/offGetWifiList",
          "apis/device/wifi/getWifiList",
          "apis/device/wifi/getConnectedWifi",
          "apis/device/wifi/connectWifi",
          "apis/device/wifi/WifiInfo"
        ]
      },
      {
        "label": "联系人",
        "type": "category",
        "items": [
          "apis/device/contact/addPhoneContact"
        ]
      },
      {
        "label": "低功耗蓝牙",
        "type": "category",
        "items": [
          "apis/device/ble/writeBLECharacteristicValue",
          "apis/device/ble/readBLECharacteristicValue",
          "apis/device/ble/onBLEConnectionStateChange",
          "apis/device/ble/onBLECharacteristicValueChange",
          "apis/device/ble/notifyBLECharacteristicValueChange",
          "apis/device/ble/getBLEDeviceServices",
          "apis/device/ble/getBLEDeviceCharacteristics",
          "apis/device/ble/createBLEConnection",
          "apis/device/ble/closeBLEConnection"
        ]
      },
      {
        "label": "蓝牙",
        "type": "category",
        "items": [
          "apis/device/bluetooth/stopBluetoothDevicesDiscovery",
          "apis/device/bluetooth/startBluetoothDevicesDiscovery",
          "apis/device/bluetooth/openBluetoothAdapter",
          "apis/device/bluetooth/onBluetoothDeviceFound",
          "apis/device/bluetooth/onBluetoothAdapterStateChange",
          "apis/device/bluetooth/getConnectedBluetoothDevices",
          "apis/device/bluetooth/getBluetoothDevices",
          "apis/device/bluetooth/getBluetoothAdapterState",
          "apis/device/bluetooth/closeBluetoothAdapter"
        ]
      },
      {
        "label": "电量",
        "type": "category",
        "items": [
          "apis/device/battery/getBatteryInfoSync",
          "apis/device/battery/getBatteryInfo"
        ]
      },
      {
        "label": "剪贴板",
        "type": "category",
        "items": [
          "apis/device/clipboard/setClipboardData",
          "apis/device/clipboard/getClipboardData"
        ]
      },
      {
        "label": "NFC",
        "type": "category",
        "items": [
          "apis/device/nfc/stopHCE",
          "apis/device/nfc/startHCE",
          "apis/device/nfc/sendHCEMessage",
          "apis/device/nfc/onHCEMessage",
          "apis/device/nfc/offHCEMessage",
          "apis/device/nfc/getHCEState"
        ]
      },
      {
        "label": "网络",
        "type": "category",
        "items": [
          "apis/device/network/onNetworkStatusChange",
          "apis/device/network/offNetworkStatusChange",
          "apis/device/network/getNetworkType"
        ]
      },
      {
        "label": "屏幕",
        "type": "category",
        "items": [
          "apis/device/screen/setScreenBrightness",
          "apis/device/screen/setKeepScreenOn",
          "apis/device/screen/onUserCaptureScreen",
          "apis/device/screen/offUserCaptureScreen",
          "apis/device/screen/getScreenBrightness"
        ]
      },
      {
        "label": "电话",
        "type": "category",
        "items": [
          "apis/device/phone/makePhoneCall"
        ]
      },
      {
        "label": "加速计",
        "type": "category",
        "items": [
          "apis/device/accelerometer/stopAccelerometer",
          "apis/device/accelerometer/startAccelerometer",
          "apis/device/accelerometer/onAccelerometerChange",
          "apis/device/accelerometer/offAccelerometerChange"
        ]
      },
      {
        "label": "罗盘",
        "type": "category",
        "items": [
          "apis/device/compass/stopCompass",
          "apis/device/compass/startCompass",
          "apis/device/compass/onCompassChange",
          "apis/device/compass/offCompassChange"
        ]
      },
      {
        "label": "设备方向",
        "type": "category",
        "items": [
          "apis/device/motion/stopDeviceMotionListening",
          "apis/device/motion/startDeviceMotionListening",
          "apis/device/motion/onDeviceMotionChange",
          "apis/device/motion/offDeviceMotionChange"
        ]
      },
      {
        "label": "陀螺仪",
        "type": "category",
        "items": [
          "apis/device/gyroscope/stopGyroscope",
          "apis/device/gyroscope/startGyroscope",
          "apis/device/gyroscope/onGyroscopeChange",
          "apis/device/gyroscope/offGyroscopeChange"
        ]
      },
      {
        "label": "性能",
        "type": "category",
        "items": [
          "apis/device/performance/onMemoryWarning"
        ]
      },
      {
        "label": "扫码",
        "type": "category",
        "items": [
          "apis/device/scan/scancode"
        ]
      },
      {
        "label": "震动",
        "type": "category",
        "items": [
          "apis/device/vibrate/vibrateShort",
          "apis/device/vibrate/vibrateLong"
        ]
      }
    ],
    "Worker": [
      "apis/worker/createWorker",
      "apis/worker/Worker"
    ],
    "第三方平台": [
      "apis/ext/getExtConfigSync",
      "apis/ext/getExtConfig"
    ],
    "云开发": [
      "apis/cloud/cloud",
      "apis/cloud/DB"
    ],
    "WXML": [
      "apis/wxml/createSelectorQuery",
      "apis/wxml/createIntersectionObserver",
      "apis/wxml/IntersectionObserver",
      "apis/wxml/NodesRef",
      "apis/wxml/SelectorQuery"
    ],
    "广告": [
      "apis/ad/createRewardedVideoAd",
      "apis/ad/createInterstitialAd",
      "apis/ad/InterstitialAd",
      "apis/ad/RewardedVideoAd"
    ],
    "Alipay": [
      "apis/alipay/getOpenUserInfo"
    ],
    "Swan": [
      "apis/swan/setPageInfo"
    ]
  }
}
