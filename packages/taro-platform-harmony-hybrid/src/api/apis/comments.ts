/**
 * 关闭当前页面，返回上一页面或多级页面。
 *
 * @canUse navigateBack
 * @__object [delta]
 */

/**
 * 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
 *
 * @canUse redirectTo
 * @__object [url]
 */

/**
 * 关闭所有页面，打开到应用内的某个页面。
 *
 * @canUse reLaunch
 * @__object [url]
 */

/**
 * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
 *
 * @canUse switchTab
 * @__object [url]
 */

/**
 * 向系统日历添加事件
 *
 * @canNotUse addPhoneCalendar
 */

/**
 * 向系统日历添加重复事件
 *
 * @canNotUse addPhoneRepeatCalendar
 */

/**
 * 将Base64字符串转成ArrayBuffer数据
 *
 * @canUse arrayBufferToBase64
 */

/**
 * 将ArrayBuffer数据转成Base64字符串
 *
 * @canUse base64ToArrayBuffer
 */

/**
 * 创建一个 WebSocket 连接
 *
 * @canUse connectSocket
 * @__object [url, header, protocols, tcpNoDelay]
 */

/**
 * 创建一个动画实例 animation
 *
 * @canUse createAnimation
 * @__object [duration, timingFunction[linear, ease, ease-in, ease-in-out, ease-out, step-start, step-end], delay, transformOrigin, unit]
 */

/**
 * 创建并返回一个 MediaQueryObserver 对象实例
 *
 * @canUse createMediaQueryObserver
 */

/**
 * 判断能否使用WebP格式
 *
 * @canUse canIUseWebp
 */

/**
 * 跳转预加载 API
 *
 * @canUse preload
 */

/**
 * 创建 video 上下文 VideoContext 对象。
 *
 * @canUse createVideoContext
 */

/**
 * 获取全局唯一的背景音频管理器
 *
 * @canUse getBackgroundAudioManager
 */

/**
 * 获取设备电量
 *
 * @canUse getBatteryInfo
 * @__success [isCharging, level]
 */

/**
 * 获取系统剪贴板的内容
 *
 * @canUse getClipboardData
 * @__success [data]
 */

/**
 * 获取本次程序启动时的参数
 *
 * @canNotUse getEnterOptionsSync
 */

/**
 * 获取网络类型
 *
 * @canUse getNetworkType
 * @__success [networkType[wifi, 2g, 3g, 4g, 5g, unknown, none]]
 */

/**
 * 隐藏 loading 提示框
 *
 * @canUse hideLoading
 * @__object [noConflict]
 */

/**
 * 隐藏 tabBar
 *
 * @canUse hideTabBar
 * @__object [animation]
 */

/**
 * 隐藏 tabBar 某一项的右上角的红点
 *
 * @canUse hideTabBarRedDot
 * @__object [index]
 */

/**
 * 隐藏消息提示框
 *
 * @canUse hideToast
 * @__object [noConflict]
 */

/**
 * 动态加载网络字体
 *
 * @canUse loadFontFace
 * @__object [global, family, source, desc[style, variant, weight]]
 * @__success [status]
 */

/**
 * 取消监听设备方向变化事件，参数为空，则取消所有的事件监听。
 *
 * @canNotUse offDeviceMotionChange
 */

/**
 * 取消监听音频播放错误事件
 *
 * @canUse offError
 */

/**
 * 取消监听网络状态变化事件，参数为空，则取消所有的事件监听
 *
 * @canUse offNetworkStatusChange
 */

/**
 * 取消监听小程序要打开的页面不存在事件
 *
 * @canUse offPageNotFound
 */

/**
 * 取消监听系统主题改变事件
 *
 * @canNotUse offThemeChange
 */

/**
 * 取消监听未处理的 Promise 拒绝事件
 *
 * @canUse offUnhandledRejection
 */

/**
 * 监听小程序切前台事件
 *
 * @canUse onAppShow
 * @__callback [path, query, scene, shareTicket, referrerInfo]
 */

/**
 * 监听小程序切后台事件
 *
 * @canUse onAppHide
 */

/**
 * 取消监听小程序切前台事件
 *
 * @canUse offAppShow
 */

/**
 * 取消监听小程序切后台事件
 *
 * @canUse offAppHide
 */

/**
 * 取消监听窗口尺寸变化事件
 *
 * @canUse offWindowResize
 */

/**
 * 监听设备方向变化事件。
 *
 * @canNotUse onDeviceMotionChange
 */

/**
 * 监听小程序错误事件
 *
 * @canUse onError
 */

/**
 * 监听网络状态变化
 *
 * @canUse onNetworkStatusChange
 * @__success [isConnected, networkType[wifi, 2g, 3g, 4g, 5g, unknown, none]]
 */

/**
 * 监听程序要打开的页面不存在事件
 *
 * @canUse onPageNotFound
 * @__callback [isEntryPage, path, query]
 */

/**
 * 监听系统主题改变事件
 *
 * @canNotUse onThemeChange
 */

/**
 * 监听未处理的Promise拒绝事件
 *
 * @canUse onUnhandledRejection
 * @__callback [reason, promise]
 */

/**
 * 监听窗口尺寸变化事件
 *
 * @canUse onWindowResize
 */

/**
 * 将页面滚动到目标位置
 *
 * @canUse pageScrollTo
 * @__object [duration, scrollTop, selector, offsetTop]
 */

/**
 * 移除 tabBar 某一项右上角的文本
 *
 * @canUse removeTabBarBadge
 * @__object [index]
 */

/**
 * 设置系统剪贴板的内容
 *
 * @canUse setClipboardData
 * @__object [data]
 */

/**
 * 为 tabBar 某一项的右上角添加文本
 *
 * @canUse setTabBarBadge
 * @__object [index, text]
 */

/**
 * 动态设置 tabBar 某一项的内容
 *
 * @canUse setTabBarItem
 * @__object [index, iconPath, selectedIconPath, text]
 */

/**
 * 动态设置 tabBar 的整体样式
 *
 * @canUse setTabBarStyle
 * @__object [backgroundColor, borderStyle, color, selectedColor]
 */

/**
 * 显示操作菜单
 *
 * @canUse showActionSheet
 * @__object [alertText, itemList, itemColor]
 * @__success [tapIndex]
 */

/**
 * 显示 loading 提示框
 *
 * @canUse showLoading
 * @__object [title, mask]
 */

/**
 * 显示模态对话框
 *
 * @canUse showModal
 * @__object [cancelColor, cancelText, confirmColor, confirmText, content, showCancel, title]
 * @__success [cancel, confirm]
 */

/**
 * 显示 tabBar
 *
 * @canUse showTabBar
 * @__object [animation]
 */

/**
 * 显示 tabBar 某一项的右上角的红点
 *
 * @canUse showTabBarRedDot
 * @__object [index]
 */

/**
 * 显示消息提示框
 *
 * @canUse showToast
 * @__object [title, duration, icon[success, error, loading, none], image, mask]
 */

/**
 * 开始监听设备方向的变化。
 *
 * @canNotUse startDeviceMotionListening
 */

/**
 * 开始下拉刷新。调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
 *
 * @canUse startPullDownRefresh
 */

/**
 * 停止监听设备方向的变化。
 *
 * @canNotUse stopDeviceMotionListening
 */

/**
 * 停止当前页面下拉刷新。
 *
 * @canUse stopPullDownRefresh
 */

/**
 * 批量添加卡券
 *
 * @canNotUse addCard
 */

/**
 * 收藏文件
 *
 * @canNotUse addFileToFavorites
 */

/**
 * 收藏视频
 *
 * @canNotUse addVideoToFavorites
 */

/**
 * 验证私密消息
 *
 * @canNotUse authPrivateMessage
 */

/**
 * 提前向用户发起授权请求
 *
 * @canNotUse authorize
 */

/**
 * 从本地缓存中异步批量获取指定 key 的内容
 *
 * @canNotUse batchGetStorage
 */

/**
 * 从本地缓存中同步批量获取指定 key 的内容
 *
 * @canNotUse batchGetStorageSync
 */

/**
 * 将数据批量存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容。
 *
 * @canNotUse batchSetStorage
 */

/**
 * 将数据批量存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容。
 *
 * @canNotUse batchSetStorageSync
 */

/**
 * 检查小程序是否被添加至 「我的小程序」
 *
 * @canNotUse checkIsAddedToMyMiniProgram
 */

/**
 * 检测是否开启视觉无障碍功能
 *
 * @canNotUse checkIsOpenAccessibility
 */

/**
 * 返回当前是否存在小窗播放
 *
 * @canNotUse checkIsPictureInPictureActive
 */

/**
 * 检查是否支持面部识别
 *
 * @canNotUse checkIsSupportFacialRecognition
 */

/**
 * 检查登录态是否过期
 *
 * @canNotUse checkSession
 */

/**
 * 收货地址
 *
 * @canNotUse chooseAddress
 */

/**
 * 添加手机通讯录联系人
 *
 * @canNotUse chooseContact
 */

/**
 * 选择用户已有的发票。
 *
 * @canNotUse chooseInvoice
 */

/**
 * 选择用户的发票抬头
 *
 * @canNotUse chooseInvoiceTitle
 */

/**
 * 选择车牌号。
 *
 * @canNotUse chooseLicensePlate
 */

/**
 * 从客户端会话选择文件
 *
 * @canNotUse chooseMessageFile
 */

/**
 * 打开POI列表选择位置
 *
 * @canNotUse choosePoi
 */

/**
 * 关闭 WebSocket 连接
 *
 * @canNotUse closeSocket
 */

/**
 * 建立本地作为蓝牙低功耗外围设备的服务端，可创建多个
 *
 * @canNotUse createBLEPeripheralServer
 */

/**
 * 创建 AI 推理 Session
 *
 * @canNotUse createInferenceSession
 */

/**
 * 创建 live-pusher 上下文 LivePusherContext 对象
 *
 * @canNotUse createLivePusherContext
 */

/**
 * 创建媒体音频播放器对象 MediaAudioPlayer 对象
 *
 * @canNotUse createMediaAudioPlayer
 */

/**
 * 创建音视频处理容器
 *
 * @canNotUse createMediaContainer
 */

/**
 * 创建 WebGL 画面录制器
 *
 * @canNotUse createMediaRecorder
 */

/**
 * 创建离屏 canvas 实例
 *
 * @canNotUse createOffscreenCanvas
 */

/**
 * 创建激励视频广告组件
 *
 * @canNotUse createRewardedVideoAd
 */

/**
 * 创建一个 TCP Socket 实例
 *
 * @canNotUse createTCPSocket
 */

/**
 * 创建一个 UDP Socket 实例
 *
 * @canNotUse createUDPSocket
 */

/**
 * 创建 vision kit 会话对象
 *
 * @canNotUse createVKSession
 */

/**
 * 创建视频解码器
 *
 * @canNotUse createVideoDecoder
 */

/**
 * 创建 WebAudio 上下文
 *
 * @canNotUse createWebAudioContext
 */

/**
 * 创建一个 Worker 线程
 *
 * @canNotUse createWorker
 */

/**
 * 裁剪图片接口
 *
 * @canNotUse cropImage
 */

/**
 * 编辑图片接口
 *
 * @canNotUse editImage
 */

/**
 * 退出当前小程序
 *
 * @canNotUse exitMiniProgram
 */

/**
 * 退出（销毁）实时语音通话
 *
 * @canNotUse exitVoIPChat
 */

/**
 * 人脸识别
 *
 * @canNotUse faceDetect
 */

/**
 * 支付各个安全场景验证人脸
 *
 * @canNotUse faceVerifyForPay
 */

/**
 * 获取当前支持的音频输入源
 *
 * @canNotUse getAvailableAudioSources
 */

/**
 * 获取蓝牙低功耗的最大传输单元
 *
 * @canNotUse getBLEMTU
 */

/**
 * 获取后台音乐播放状态
 *
 * @canNotUse getBackgroundAudioPlayerState
 */

/**
 * 获取设置过的自定义登录态
 *
 * @canNotUse getBackgroundFetchToken
 */

/**
 * Taro.getBatteryInfo 的同步版本 Note: 浏览器标准下不支持，其他实现方案不准确，不建议开发者使用
 *
 * @canNotUse getBatteryInfoSync
 */

/**
 * 获取所有已搜索到的 iBeacon 设备
 *
 * @canNotUse getBeacons
 */

/**
 * 获取视频号直播信息
 *
 * @canNotUse getChannelsLiveInfo
 */

/**
 * 获取视频号直播预告信息
 *
 * @canNotUse getChannelsLiveNoticeInfo
 */

/**
 * 获取视频号直播卡片/视频卡片的分享来源
 *
 * @canNotUse getChannelsShareKey
 */

/**
 * 查询当前用户授权的音视频通话设备（组）信息
 *
 * @canNotUse getDeviceVoIPList
 */

/**
 * 获取第三方平台自定义的数据字段
 *
 * @canNotUse getExtConfig
 */

/**
 * Taro.getExtConfig 的同步版本
 *
 * @canNotUse getExtConfigSync
 */

/**
 * 获取微信群聊场景下的小程序启动信息
 *
 * @canNotUse getGroupEnterInfo
 */

/**
 * 判断当前设备是否支持 HCE 能力
 *
 * @canNotUse getHCEState
 */

/**
 * 获取通用AI推理引擎版本
 *
 * @canNotUse getInferenceEnvInfo
 */

/**
 * 获取局域网IP地址
 *
 * @canNotUse getLocalIPAddress
 */

/**
 * 获取 NFC 实例
 *
 * @canNotUse getNFCAdapter
 */

/**
 * 获取支付宝会员的基础信息
 *
 * @canNotUse getOpenUserInfo
 */

/**
 * 查询隐私授权情况。
 *
 * @canNotUse getPrivacySetting
 */

/**
 * 获取密码学安全随机数
 *
 * @canNotUse getRandomValues
 */

/**
 * 获取程序的 UserAgent
 *
 * @canNotUse getRendererUserAgent
 */

/**
 *
 * 查询用户是否在录屏
 *
 * @canNotUse getScreenRecordingState
 */

/**
 * 在input、textarea等focus之后，获取输入框的光标位置
 *
 * @canNotUse getSelectedTextRange
 */

/**
 * 获取当前运行环境对于 Skyline 渲染引擎 的支持情况
 *
 * @canNotUse getSkylineInfo
 */

/**
 * 获取当前运行环境对于 Skyline 渲染引擎 的支持情况
 *
 * @canNotUse getSkylineInfoSync
 */

/**
 * 获取用户加密模块
 *
 * @canNotUse getUserCryptoManager
 */

/**
 * 获取用户信息
 *
 * @canNotUse getUserProfile
 */

/**
 * 获取用户过去三十天微信运动步数。
 *
 * @canNotUse getWeRunData
 */

/**
 * 初始化人脸识别
 *
 * @canNotUse initFaceDetect
 */

/**
 * 查询蓝牙设备是否配对
 *
 * @canNotUse isBluetoothDevicePaired
 */

/**
 * 判断支持版本
 *
 * @canNotUse isVKSupport
 */

/**
 * 加入（创建）双人通话
 *
 * @canNotUse join1v1Chat
 */

/**
 * 加入 (创建) 实时语音通话
 *
 * @canNotUse joinVoIPChat
 */

/**
 * 蓝牙配对接口
 *
 * @canNotUse makeBluetoothPair
 */

/**
 * 返回到上一个小程序
 *
 * @canNotUse navigateBackMiniProgram
 */

/**
 * 取消监听音频因为受到系统占用而被中断开始事件
 *
 * @canNotUse offAudioInterruptionBegin
 */

/**
 * 取消监听音频中断结束事件
 *
 * @canNotUse offAudioInterruptionEnd
 */

/**
 * 取消监听蓝牙低功耗设备的特征值变化事件
 *
 * @canNotUse offBLECharacteristicValueChange
 */

/**
 * 取消监听蓝牙低功耗连接状态的改变事件
 *
 * @canNotUse offBLEConnectionStateChange
 */

/**
 * 取消监听蓝牙低功耗的最大传输单元变化事件
 *
 * @canNotUse offBLEMTUChange
 */

/**
 * 取消监听当前外围设备被连接或断开连接事件
 *
 * @canNotUse offBLEPeripheralConnectionStateChanged
 */

/**
 * 取消监听 iBeacon 服务状态变化事件
 *
 * @canNotUse offBeaconServiceChange
 */

/**
 * 取消监听 iBeacon 设备更新事件
 *
 * @canNotUse offBeaconUpdate
 */

/**
 * 移除用户点击右上角菜单的「复制链接」按钮时触发的事件的监听函数
 *
 * @canNotUse offCopyUrl
 */

/**
 * 取消监听陀螺仪数据变化事件。
 *
 * @canNotUse offGyroscopeChange
 */

/**
 * 接收 NFC 设备消息事件，取消事件监听
 *
 * @canNotUse offHCEMessage
 */

/**
 * 取消监听 mDNS 服务停止搜索的事件
 *
 * @canNotUse offLocalServiceDiscoveryStop
 */

/**
 * 取消监听 mDNS 服务发现的事件
 *
 * @canNotUse offLocalServiceFound
 */

/**
 * 取消监听 mDNS 服务离开的事件
 *
 * @canNotUse offLocalServiceLost
 */

/**
 * 取消监听 mDNS 服务解析失败的事件
 *
 * @canNotUse offLocalServiceResolveFail
 */

/**
 * 取消监听弱网状态变化事件
 *
 * @canNotUse offNetworkWeakChange
 */

/**
 * 取消用户录屏事件的监听函数
 *
 * @canNotUse offScreenRecordingStateChanged
 */

/**
 * 取消监听被动断开实时语音通话事件
 *
 * @canNotUse offVoIPChatInterrupted
 */

/**
 * 取消监听实时语音通话成员在线状态变化事件
 *
 * @canNotUse offVoIPChatMembersChanged
 */

/**
 * 取消监听实时语音通话成员通话状态变化事件
 *
 * @canNotUse offVoIPChatSpeakersChanged
 */

/**
 * 取消监听房间状态变化事件
 *
 * @canNotUse offVoIPChatStateChanged
 */

/**
 * 取消监听实时语音通话成员视频状态变化事件
 *
 * @canNotUse offVoIPVideoMembersChanged
 */

/**
 * 监听音频因为受到系统占用而被中断开始事件
 *
 * @canNotUse onAudioInterruptionBegin
 */

/**
 * 监听音频中断结束事件
 *
 * @canNotUse onAudioInterruptionEnd
 */

/**
 * 监听蓝牙低功耗的最大传输单元变化事件
 *
 * @canNotUse onBLEMTUChange
 */

/**
 * 监听当前外围设备被连接或断开连接事件
 *
 * @canNotUse onBLEPeripheralConnectionStateChanged
 */

/**
 * 监听音乐暂停
 *
 * @canNotUse onBackgroundAudioPause
 */

/**
 * 监听音乐播放
 *
 * @canNotUse onBackgroundAudioPlay
 */

/**
 * 监听音乐停止
 *
 * @canNotUse onBackgroundAudioStop
 */

/**
 * 收到 backgroundFetch 数据时的回调
 *
 * @canNotUse onBackgroundFetchData
 */

/**
 * 监听 iBeacon 服务状态变化事件，仅能注册一个监听
 *
 * @canNotUse onBeaconServiceChange
 */

/**
 * 监听 iBeacon 设备更新事件，仅能注册一个监听
 *
 * @canNotUse onBeaconUpdate
 */

/**
 * 监听用户点击右上角菜单的「复制链接」按钮时触发的事件
 *
 * @canNotUse onCopyUrl
 */

/**
 * 监听接收 NFC 设备消息事件，仅能注册一个监听
 *
 * @canNotUse onHCEMessage
 */

/**
 * 监听 mDNS 服务停止搜索的事件
 *
 * @canNotUse onLocalServiceDiscoveryStop
 */

/**
 * 监听 mDNS 服务发现的事件
 *
 * @canNotUse onLocalServiceFound
 */

/**
 * 监听 mDNS 服务离开的事件
 *
 * @canNotUse onLocalServiceLost
 */

/**
 * 监听 mDNS 服务解析失败的事件
 *
 * @canNotUse onLocalServiceResolveFail
 */

/**
 * 在最近的八次网络请求中, 出现下列三个现象之一则判定弱网。
 * - 出现三次以上连接超时
 * - 出现三次 rtt 超过 400
 * - 出现三次以上的丢包
 * > 弱网事件通知规则是: 弱网状态变化时立即通知, 状态不变时 30s 内最多通知一次。
 *
 * @canNotUse onNetworkWeakChange
 */

/**
 * 监听用户录屏事件
 *
 * @canNotUse onScreenRecordingStateChanged
 */

/**
 * 监听 WebSocket 连接关闭事件
 *
 * @canNotUse onSocketClose
 */

/**
 * 监听 WebSocket 错误事件
 *
 * @canNotUse onSocketError
 */

/**
 * 监听 WebSocket 接受到服务器的消息事件
 *
 * @canNotUse onSocketMessage
 */

/**
 * 监听 WebSocket 连接打开事件
 *
 * @canNotUse onSocketOpen
 */

/**
 * 监听被动断开实时语音通话事件
 *
 * @canNotUse onVoIPChatInterrupted
 */

/**
 * 监听实时语音通话成员在线状态变化事件
 *
 * @canNotUse onVoIPChatMembersChanged
 */

/**
 * 监听实时语音通话成员通话状态变化事件
 *
 * @canNotUse onVoIPChatSpeakersChanged
 */

/**
 * 监听房间状态变化事件
 *
 * @canNotUse onVoIPChatStateChanged
 */

/**
 * 监听实时语音通话成员视频状态变化事件
 *
 * @canNotUse onVoIPVideoMembersChanged
 */

/**
 * 打开微信支付分小程序，引导用户查看订单详情
 *
 * @canNotUse openBusinessView
 */

/**
 * 查看微信卡包中的卡券
 *
 * @canNotUse openCard
 */

/**
 * 打开视频号视频
 *
 * @canNotUse openChannelsActivity
 */

/**
 * 打开视频号活动页
 *
 * @canNotUse openChannelsEvent
 */

/**
 * 打开视频号直播
 *
 * @canNotUse openChannelsLive
 */

/**
 * 微信客服
 *
 * @canNotUse openCustomerServiceChat
 */

/**
 * 打开半屏小程序
 *
 * @canNotUse openEmbeddedMiniProgram
 */

/**
 * 跳转至隐私协议页面
 *
 * @canNotUse openPrivacyContract
 */

/**
 * 打开手Q说说发表界面
 *
 * @canNotUse openQzonePublish
 */

/**
 * 跳转系统蓝牙设置页
 *
 * @canNotUse openSystemBluetoothSetting
 */

/**
 * 暂停播放音乐
 *
 * @canNotUse pauseBackgroundAudio
 */

/**
 * 暂停正在播放的语音
 *
 * @canNotUse pauseVoice
 */

/**
 * 使用后台播放器播放音乐
 *
 * @canNotUse playBackgroundAudio
 */

/**
 * 开始播放语音
 *
 * @canNotUse playVoice
 */

/**
 * 该接口仅在小程序插件中可调用，调用接口获得插件用户标志凭证（code）
 *
 * @canNotUse pluginLogin
 */

/**
 * 为视图层预加载媒体资源文件
 *
 * @canNotUse preloadAssets
 */

/**
 * 预加载下个页面所需要的 Skyline 运行环境
 *
 * @canNotUse preloadSkylineView
 */

/**
 * 预加载下个页面的 WebView
 *
 * @canNotUse preloadWebview
 */

/**
 * 事件上报
 *
 * @canNotUse reportEvent
 */

/**
 * 自定义业务数据监控上报接口
 *
 * @canNotUse reportMonitor
 */

/**
 * 程序测速上报
 *
 * @canNotUse reportPerformance
 */

/**
 * 请求用户授权与设备（组）间进行音视频通话
 *
 * @canNotUse requestDeviceVoIP
 */

/**
 * 创建自定义版交易组件订单，并发起支付
 *
 * @canNotUse requestOrderPayment
 */

/**
 * 订阅设备消息接口，调用后弹出授权框，用户同意后会允许开发者给用户发送订阅模版消息
 *
 * @canNotUse requestSubscribeDeviceMessage
 */

/**
 * 模拟隐私接口调用，并触发隐私弹窗逻辑
 *
 * @canNotUse requirePrivacyAuthorize
 */

/**
 * 预约视频号直播
 *
 * @canNotUse reserveChannelsLive
 */

/**
 * 保存文件系统的文件到用户磁盘，仅在 PC 端支持
 *
 * @canNotUse saveFileToDisk
 */

/**
 * 控制音乐播放进度
 *
 * @canNotUse seekBackgroundAudio
 */

/**
 * 发送 NFC 消息
 *
 * @canNotUse sendHCEMessage
 */

/**
 * 拉起手机发送短信界面
 *
 * @canNotUse sendSms
 */

/**
 * 通过 WebSocket 连接发送数据
 *
 * @canNotUse sendSocketMessage
 */

/**
 * 动态设置窗口的背景色
 *
 * @canNotUse setBackgroundColor
 */

/**
 * 动态设置下拉背景字体、loading 图的样式
 *
 * @canNotUse setBackgroundTextStyle
 */

/**
 * 开启双人通话
 *
 * @canNotUse setEnable1v1Chat
 */

/**
 * 设置 InnerAudioContext项
 *
 * @canNotUse setInnerAudioOption
 */

/**
 * 百度智能小程序可接入百度搜索和百度 App，setPageInfo 负责为小程序设置各类页面基础信息，包括标题、关键字、页面描述以及图片信息、视频信息等。
 *
 * @canNotUse setPageInfo
 */

/**
 * 设置截屏/录屏时屏幕表现
 *
 * @canNotUse setVisualEffectOnCapture
 */

/**
 * 设置 wifiList 中 AP 的相关信息
 *
 * @canNotUse setWifiList
 */

/**
 * 设置窗口大小，该接口仅适用于 PC 平台，使用细则请参见指南
 *
 * @canNotUse setWindowSize
 */

/**
 * 转发文件到聊天
 *
 * @canNotUse shareFileMessage
 */

/**
 * 分享数据到微信运动
 *
 * @canNotUse shareToWeRun
 */

/**
 * 转发视频到聊天
 *
 * @canNotUse shareVideoMessage
 */

/**
 * 拉取h5领取红包封面页。
 *
 * @canNotUse showRedPackage
 */

/**
 * 打开分享图片弹窗，可以将图片发送给朋友、收藏或下载
 *
 * @canNotUse showShareImageMenu
 */

/**
 * 开始搜索附近的 iBeacon 设备
 *
 * @canNotUse startBeaconDiscovery
 */

/**
 * 开始人脸识别认证
 *
 * @canNotUse startFacialRecognitionVerify
 */

/**
 * 开始人脸识别认证并上传认证视频
 *
 * @canNotUse startFacialRecognitionVerifyAndUploadVideo
 */

/**
 * 初始化 NFC 模块
 *
 * @canNotUse startHCE
 */

/**
 * 停止搜索 mDNS 服务
 *
 * @canNotUse startLocalServiceDiscovery
 */

/**
 * 开始录音
 *
 * @canNotUse startRecord
 */

/**
 * 停止播放音乐
 *
 * @canNotUse stopBackgroundAudio
 */

/**
 * 停止搜索附近的 iBeacon 设备
 *
 * @canNotUse stopBeaconDiscovery
 */

/**
 * 停止人脸识别
 *
 * @canNotUse stopFaceDetect
 */

/**
 * 关闭 NFC 模块
 *
 * @canNotUse stopHCE
 */

/**
 * 停止搜索 mDNS 服务
 *
 * @canNotUse stopLocalServiceDiscovery
 */

/**
 * 停止录音
 *
 * @canNotUse stopRecord
 */

/**
 * 结束播放语音
 *
 * @canNotUse stopVoice
 */

/**
 * 订阅视频画面成员
 *
 * @canNotUse subscribeVoIPVideoMembers
 */

/**
 * 此接口是用于发起支付的 API
 *
 * @canNotUse tradePay
 */

/**
 * 更新转发属性
 *
 * @canNotUse updateShareMenu
 */

/**
 * 更新实时语音静音设置
 *
 * @canNotUse updateVoIPChatMuteConfig
 */

/**
 * 更新客户端版本
 *
 * @canNotUse updateWeChatApp
 */

/**
 * 程序测速上报
 *
 * @canNotUse getPerformance
 */

/**
 * 插屏广告组件类
 *
 * @canNotUse InterstitialAd
 */

/**
 * 日志管理器
 *
 * @canNotUse LogManager
 */

/**
 * 获取性能数据及创建性能监听器
 *
 * @canNotUse Performance
 */

/**
 * 实时日志管理器
 *
 * @canNotUse RealtimeLogManager
 */

/**
 * 给定标签的实时日志管理器
 *
 * @canNotUse RealtimeTagLogManager
 */

/**
 * UpdateManager更新管理类
 *
 * @canNotUse UpdateManager
 */

/**
 * 动画对象
 *
 * @canUse Animation
 * @__class
 * [export, step, matrix, matrix3d, rotate, rotate3d, rotateX, rotateY, rotateZ, scale,\
 * scale3d, scaleX, scaleY, scaleZ, skew, skewX, skewY, translate, translate3d, translateX,\
 * translateY, translateZ, opacity, backgroundColor, width, height, left, right, top, bottom]
 */

/**
 * 用户授权设置信息
 *
 * @canUse AuthSetting
 * @__class [scope[userInfo, userLocation, address, invoiceTitle, invoice,\
 * werun, record, writePhotosAlbum, camera, bluetoothBackground]]
 */

/**
 * BackgroundAudioManager 实例
 *
 * @canUse BackgroundAudioManager
 * @__class
 * [play, pause, seek, stop, onCanplay, onWaiting, onError, onPlay, onPause, onSeeking,\
 * onSeeked, onEnded, onStop, onTimeUpdate]
 */

/**
 * CameraContext 实例
 *
 * @canNotUse CameraContext
 */

/**
 * CanvasGradient对象
 *
 * @canUse CanvasGradient
 * @__class [addColorStop]
 */

/**
 * EditorContext 实例
 *
 * @canNotUse EditorContext
 */

/**
 * 文件管理器
 *
 * @canUse FileSystemManager
 * @__class
 * [access, accessSync, appendFile, appendFileSync, close, closeSync, copyFile, copyFileSync, fstat,\
 * ftruncate, ftruncateSync, getFileInfo, mkdir, mkdirSync, open, openSync, read, readdir, readdirSync,\
 * readFile, readFileSync, readSync, rename, renameSync, rmdir, rmdirSync, truncate, truncateSync]
 */

/**
 * Image实例
 *
 * @canUse Image
 * @__class [src, height, width, referrerPolicy, onerror, onload]
 */

/**
 * ImageData对象
 *
 * @canUse ImageData
 * @__class [width, height, data]
 */

/**
 * IntersectionObserver 对象，用于推断某些节点是否可以被用户看见、有多大比例可以被用户看见
 *
 * @canUse IntersectionObserver
 * @__class [disconnect, observe, relativeTo, relativeToViewport]
 */

/**
 * LivePlayerContext 实例
 *
 * @canNotUse LivePlayerContext
 */

/**
 * MapContext 实例
 *
 * @canNotUse MapContext
 */

/**
 * MediaQueryObserver 对象，用于监听页面 media query 状态的变化，如界面的长宽是不是在某个指定的范围内
 *
 * @canUse MediaQueryObserver
 * @__class [observe, disconnect]
 */

/**
 * NodesRef 对象，用于获取 WXML 节点信息的对象
 *
 * @canUse NodesRef
 * @__class [boundingClientRect, context, node, fields, scrollOffset]
 */

/**
 * Path2D
 *
 * @canUse Path2D
 */

/**
 * 文件读取结果。 通过 FileSystemManager.readSync 接口返回
 *
 * @canNotUse ReadResult
 */

/**
 * 全局唯一的录音管理器
 *
 * @canNotUse RecorderManager
 */

/**
 * RenderingContext
 *
 * @canUse RenderingContext
 */

/**
 * 增强 ScrollView 实例
 *
 * @canNotUse ScrollViewContext
 */

/**
 * WebSocket 任务
 *
 * @canUse SocketTask
 * @__class [send, close, onOpen, onClose, onError, onMessage]
 */

/**
 * 订阅消息设置
 *
 * @canNotUse SubscriptionsSetting
 */

/**
 * 用户信息
 *
 * @canUse UserInfo
 * @__class [nickName, avatarUrl]
 */

/**
 * VideoContext 实例
 *
 * @canUse VideoContext
 * @__class [pause, play, requestFullScreen, seek, stop]
 */

/**
 * Wifi 信息(native 返回)
 *
 * @canNotUse WifiInfo
 */

/**
 * AudioBuffer 接口表示存在内存里的一段短小的音频资源
 *
 * @canNotUse AudioBuffer
 */

/**
 * 外围设备的服务端
 *
 * @canNotUse BLEPeripheralServer
 */

/**
 * CacheManager实例
 *
 * @canNotUse CacheManager
 */

/**
 * CameraContext.onCameraFrame() 返回的监听器
 *
 * @canNotUse CameraFrameListener
 */

/**
 * Color实例
 *
 * @canNotUse Color
 */

/**
 * 云开发 SDK 数据库实例 Taro.cloud.database()
 *
 * @canNotUse DB
 */

/**
 * EntryList 对象
 *
 * @canNotUse EntryList
 */

/**
 * 页面间事件通信通道
 *
 * @canNotUse EventChannel
 */

/**
 * @canNotUse IBeaconInfo
 */

/**
 * InferenceSession类
 *
 * @canNotUse InferenceSession
 */

/**
 * IsoDep 标签
 *
 * @canNotUse IsoDep
 */

/**
 * LivePusherContext 实例
 *
 * @canNotUse LivePusherContext
 */

/**
 * MediaAudioPlayer 实例
 *
 * @canNotUse MediaAudioPlayer
 */

/**
 * 创建音视频处理容器，最终可将容器中的轨道合成一个视频
 *
 * @canNotUse MediaContainer
 */

/**
 * 画面录制器
 *
 * @canNotUse MediaRecorder
 */

/**
 *  MediaTrack 音频或视频轨道
 *
 * @canNotUse MediaTrack
 */

/**
 * MifareClassic 标签
 *
 * @canNotUse MifareClassic
 */

/**
 * MifareUltralight 标签
 *
 * @canNotUse MifareUltralight
 */

/**
 * NFCAdapter 实例
 *
 * @canNotUse NFCAdapter
 */

/**
 * Ndef 标签
 *
 * @canNotUse Ndef
 */

/**
 * NfcA 标签
 *
 * @canNotUse NfcA
 */

/**
 * NfcB 标签
 *
 * @canNotUse NfcB
 */

/**
 * NfcF 标签
 *
 * @canNotUse NfcF
 */

/**
 * NfcV 标签
 *
 * @canNotUse NfcV
 */

/**
 * 离屏 canvas 实例，可通过 Taro.createOffscreenCanvas 创建
 *
 * @canNotUse OffscreenCanvas
 */

/**
 * 单条性能数据
 *
 * @canNotUse PerformanceEntry
 */

/**
 * PerformanceObserver 对象，用于监听性能相关事件
 *
 * @canNotUse PerformanceObserver
 */

/**
 * 激励视频广告组件类
 * -
 * @canNotUse RewardedVideoAd
 */

/**
 * 描述文件状态的对象
 *
 * @canNotUse Stats
 */

/**
 * 一个 TCP Socket 实例，默认使用 IPv4 协议
 *
 * @canNotUse TCPSocket
 */

/**
 * 一个 UDP Socket 实例，默认使用 IPv4 协议
 *
 * @canNotUse UDPSocket
 */

/**
 * 用户加密模块类
 *
 * @canNotUse UserCryptoManager
 */

/**
 * @canNotUse VKBodyAnchor
 */

/**
 * @canNotUse VKCamera
 */

/**
 * @canNotUse VKDepthAnchor
 */

/**
 * @canNotUse VKFaceAnchor
 */

/**
 * @canNotUse VKFrame
 */

/**
 * @canNotUse VKHandAnchor
 */

/**
 * @canNotUse VKMarkerAnchor
 */

/**
 * @canNotUse VKOCRAnchor
 */

/**
 * @canNotUse VKOSDAnchor
 */

/**
 * @canNotUse VKPlaneAnchor
 */

/**
 * @canNotUse VKSession
 */

/**
 * 视频解码器
 *
 * @canNotUse VideoDecoder
 */

/**
 * WebAudioContext 实例
 *
 * @canNotUse WebAudioContext
 */

/**
 * 一类音频处理模块
 *
 * @canNotUse WebAudioContextNode
 */

/**
 * Worker类
 *
 * @canNotUse Worker
 */

/**
 * 文件写入结果。 通过 FileSystemManager.writeSync 接口返回
 *
 * @canNotUse WriteResult
 */
