# 小程序 API 列表

## 基础

Taro.env 环境变量
Taro.canIUse 判断小程序的API，回调，参数，组件等是否在当前版本可用
Taro.base64ToArrayBuffer 将 Base64 字符串转成 ArrayBuffer 对象
Taro.arrayBufferToBase64 将 ArrayBuffer 对象转成 Base64 字符串

### 系统

Taro.openSystemBluetoothSetting 跳转系统蓝牙设置页
Taro.openAppAuthorizeSetting 跳转系统微信授权管理页
Taro.getWindowInfo 获取窗口信息
Taro.getSystemSetting 获取设备设置
Taro.getSystemInfoSync Taro.getSystemInfo 的同步版本
Taro.getSystemInfoAsync 异步获取系统信息
Taro.getSystemInfo 获取系统信息
Taro.getDeviceInfo 获取设备基础信息
Taro.getAppBaseInfo 获取微信APP基础信息
Taro.getAppAuthorizeSetting 获取微信APP授权设置

### 更新

Taro.updateWeChatApp 更新客户端版本
Taro.getUpdateManager 获取全局唯一的版本更新管理器，用于管理小程序更新

#### UpdateManager

UpdateManager.applyUpdate 强制小程序重启并使用新版本
UpdateManager.onCheckForUpdate 监听向微信后台请求检查更新结果事件
UpdateManager.onUpdateFailed 监听小程序更新失败事件
UpdateManager.onUpdateReady 监听小程序有版本更新事件

### 小程序

#### 生命周期

Taro.getLaunchOptionsSync 获取小程序启动时的参数
Taro.getEnterOptionsSync 获取本次小程序启动时的参数

#### 应用级事件

Taro.onUnhandledRejection 监听未处理的 Promise 拒绝事件
Taro.onThemeChange 监听系统主题改变事件
Taro.onPageNotFound 监听小程序要打开的页面不存在事件
Taro.onError 监听小程序错误事件
Taro.onAudioInterruptionEnd 监听音频中断结束事件
Taro.onAudioInterruptionBegin 监听音频因为受到系统占用而被中断开始事件
Taro.onAppShow 小程序切前台事件
Taro.onAppHide 监听小程序切后台事件
Taro.offUnhandledRejection 取消监听未处理的 Promise 拒绝事件
Taro.offThemeChange 取消监听系统主题改变事件
Taro.offPageNotFound 取消监听小程序要打开的页面不存在事件
Taro.offError 取消监听小程序错误事件
Taro.offAudioInterruptionEnd 取消监听音频中断结束事件
Taro.offAudioInterruptionBegin 取消监听音频因为受到系统占用而被中断开始事件
Taro.offAppShow 取消监听小程序切前台事件
Taro.offAppHide 取消监听小程序切后台事件

### 调试

Taro.setEnableDebug 设置是否打开调试开关
Taro.getRealtimeLogManager 获取实时日志管理器对象
Taro.getLogManager 获取日志管理器对象

#### console

console.debug 向调试面板中打印 debug 日志
console.error 向调试面板中打印 error 日志
console.group 在调试面板中创建一个新的分组
console.groupEnd 结束由 console.group 创建的分组
console.info 向调试面板中打印 info 日志
console.log 向调试面板中打印 log 日志
console.warn 向调试面板中打印 warn 日志

#### LogManager

LogManager.debug 写 debug 日志
LogManager.info 写 info 日志
LogManager.log 写 log 日志
LogManager.warn 写 warn 日志

#### RealtimeLogManager

RealtimeLogManager.addFilterMsg 添加过滤关键字，暂不支持在插件使用
RealtimeLogManager.error 写 error 日志，暂不支持在插件使用
RealtimeLogManager.getCurrentState 实时日志会将一定时间间隔内缓存的日志聚合上报，如果该时间内缓存的内容超出限制，则会被丢弃
RealtimeLogManager.in 设置实时日志page参数所在的页面，暂不支持在插件使用
RealtimeLogManager.info 写 info 日志，暂不支持在插件使用
RealtimeLogManager.setFilterMsg 设置过滤关键字，暂不支持在插件使用
RealtimeLogManager.tag 获取给定标签的日志管理器实例，目前只支持在插件使用
RealtimeLogManager.warn 写 warn 日志，暂不支持在插件使用

#### RealtimeTagLogManager

RealtimeTagLogManager.addFilterMsg 添加过滤关键字
RealtimeTagLogManager.error 写 error 日志
RealtimeTagLogManager.info 写 info 日志
RealtimeTagLogManager.setFilterMsg 设置过滤关键字
RealtimeTagLogManager.warn 写 warn 日志

### 性能

Taro.reportPerformance 小程序测速上报
Taro.getPerformance 获取当前小程序性能相关的信息

### EntryList

EntryList.getEntries 该方法返回当前列表中的所有性能数据
EntryList.getEntriesByName 获取当前列表中所有名称为 [name] 且类型为 [entryType] 的性能数据
EntryList.getEntriesByType 获取当前列表中所有类型为 [entryType] 的性能数据

### Performance

Performance.createObserver 创建全局性能事件监听器
Performance.getEntries 该方法返回当前缓冲区中的所有性能数据
Performance.getEntriesByName 获取当前缓冲区中所有名称为 [name] 且类型为 [entryType] 的性能数据
Performance.getEntriesByType 获取当前缓冲区中所有类型为 [entryType] 的性能数据
Performance.setBufferSize 设置缓冲区大小，默认缓冲 30 条性能数据
PerformanceEntry 单条性能数据

### PerformanceObserver

PerformanceObserver.disconnect 停止监听
PerformanceObserver.observe 开始监听

### 加密

Taro.getUserCryptoManager 获取用户加密模块

#### UserCryptoManager

UserCryptoManager.getLatestUserKey 获取最新的用户加密密钥
UserCryptoManager.getRandomValues 获取密码学安全随机数

## 路由

Taro.switchTab 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
Taro.reLaunch 关闭所有页面，打开到应用内的某个页面
Taro.redirectTo 关闭当前页面，跳转到应用内的某个页面
Taro.navigateTo 保留当前页面，跳转到应用内的某个页面
Taro.navigateBack 关闭当前页面，返回上一页面或多级页面

### EventChannel

EventChannel.emit 触发一个事件
EventChannel.off 取消监听一个事件
EventChannel.on 持续监听一个事件
EventChannel.once 监听一个事件一次，触发后失效

## 跳转

Taro.openEmbeddedMiniProgram 打开半屏小程序
Taro.navigateToMiniProgram 打开另一个小程序
Taro.navigateBackMiniProgram 返回到上一个小程序
Taro.exitMiniProgram 退出当前小程序

## 转发

Taro.updateShareMenu 更新转发属性
Taro.showShareMenu 显示当前页面的转发按钮
Taro.showShareImageMenu 打开分享图片弹窗，可以将图片发送给朋友、收藏或下载
Taro.shareVideoMessage 转发视频到聊天
Taro.shareFileMessage 转发文件到聊天
Taro.onCopyUrl 监听用户点击右上角菜单的「复制链接」按钮时触发的事件
Taro.offCopyUrl 取消监听用户点击右上角菜单的「复制链接」按钮时触发的事件
Taro.hideShareMenu 隐藏当前页面的转发按钮
Taro.getShareInfo 获取转发详细信息
Taro.authPrivateMessage 验证私密消息

## 界面

### 交互

Taro.showToast 显示消息提示框
Taro.showModal 显示模态对话框
Taro.showLoading 显示 loading 提示框
Taro.showActionSheet 显示操作菜单
Taro.hideToast 隐藏消息提示框
Taro.hideLoading 隐藏 loading 提示框
Taro.enableAlertBeforeUnload 开启小程序页面返回询问对话框
Taro.disableAlertBeforeUnload 关闭小程序页面返回询问对话框

### 导航栏

Taro.showNavigationBarLoading 在当前页面显示导航条加载动画
Taro.setNavigationBarTitle 动态设置当前页面的标题
Taro.setNavigationBarColor 设置页面导航条颜色
Taro.hideNavigationBarLoading 在当前页面隐藏导航条加载动画
Taro.hideHomeButton 隐藏返回首页按钮

### 背景

Taro.setBackgroundTextStyle 动态设置下拉背景字体、loading 图的样式
Taro.setBackgroundColor 动态设置窗口的背景色

### Tab Bar

Taro.showTabBarRedDot 显示 tabBar 某一项的右上角的红点
Taro.showTabBar 显示 tabBar
Taro.setTabBarStyle 动态设置 tabBar 的整体样式
Taro.setTabBarItem 动态设置 tabBar 某一项的内容，2.7.0 起图片支持临时文件和网络文件
Taro.setTabBarBadge 为 tabBar 某一项的右上角添加文本
Taro.removeTabBarBadge 移除 tabBar 某一项右上角的文本
Taro.hideTabBarRedDot 隐藏 tabBar 某一项的右上角的红点
Taro.hideTabBar 隐藏 tabBar

### 字体

Taro.loadFontFace 动态加载网络字体，文件地址需为下载类型

### 下拉刷新

Taro.stopPullDownRefresh 停止当前页面下拉刷新
Taro.startPullDownRefresh 开始下拉刷新

### 滚动

Taro.pageScrollTo 将页面滚动到目标位置，支持选择器和滚动距离两种方式定位

#### ScrollViewContext

ScrollViewContext.scrollIntoView 滚动至指定位置
ScrollViewContext.scrollTo 滚动至指定位置

### 动画

Taro.createAnimation 创建一个动画实例 animation

#### Animation

Animation.backgroundColor 设置背景色
Animation.bottom 设置 bottom 值
Animation.export 导出动画队列
Animation.height 设置高度
Animation.left 设置 left 值
Animation.matrix 同 transform-function matrix
Animation.matrix3d 同 transform-function matrix3d
Animation.opacity 设置透明度
Animation.right 设置 right 值
Animation.rotate 从原点顺时针旋转一个角度
Animation.rotate3d 从 固定 轴顺时针旋转一个角度
Animation.rotateX 从 X 轴顺时针旋转一个角度
Animation.rotateY 从 Y 轴顺时针旋转一个角度
Animation.rotateZ 从 Z 轴顺时针旋转一个角度
Animation.scale 缩放
Animation.scale3d 缩放
Animation.scaleX 缩放 X 轴
Animation.scaleY 缩放 Y 轴
Animation.scaleZ 缩放 Z 轴
Animation.skew 对 X、Y 轴坐标进行倾斜
Animation.skewX 对 X 轴坐标进行倾斜
Animation.skewY 对 Y 轴坐标进行倾斜
Animation.step 表示一组动画完成
Animation.top 设置 top 值
Animation.translate 平移变换
Animation.translate3d 对 xyz 坐标进行平移变换
Animation.translateX 对 X 轴平移
Animation.translateY 对 Y 轴平移
Animation.translateZ 对 Z 轴平移
Animation.width 设置宽度

### 置顶

Taro.setTopBarText 动态设置置顶栏文字内容

### 自定义组件

Taro.nextTick 延迟一部分操作到下一个时间片再执行

### 菜单

Taro.getMenuButtonBoundingClientRect 获取菜单按钮（右上角胶囊按钮）的布局位置信息

### 窗口

Taro.setWindowSize 设置窗口大小，该接口仅适用于 PC 平台，使用细则请参见指南
Taro.onWindowResize 监听窗口尺寸变化事件
Taro.offWindowResize 取消监听窗口尺寸变化事件

## 网络

### 发起请求

Taro.request 发起 HTTPS 网络请求

#### RequestTask

RequestTask.abort 中断请求任务
RequestTask.offChunkReceived 取消监听 Transfer-Encoding Chunk Received 事件
RequestTask.offHeadersReceived 取消监听 HTTP Response Header 事件
RequestTask.onChunkReceived 监听 Transfer-Encoding Chunk Received 事件
RequestTask.onHeadersReceived 监听 HTTP Response Header 事件

### 下载

Taro.downloadFile 下载文件资源到本地

#### DownloadTask

DownloadTask.abort 中断下载任务
DownloadTask.offHeadersReceived 取消监听 HTTP Response Header 事件
DownloadTask.offProgressUpdate 取消监听下载进度变化事件
DownloadTask.onHeadersReceived 监听 HTTP Response Header 事件
DownloadTask.onProgressUpdate 监听下载进度变化事件

### 上传

Taro.uploadFile 将本地资源上传到服务器

#### UploadTask

UploadTask.abort 中断上传任务
UploadTask.offHeadersReceived 取消监听 HTTP Response Header 事件
UploadTask.offProgressUpdate 取消监听上传进度变化事件
UploadTask.onHeadersReceived 监听 HTTP Response Header 事件
UploadTask.onProgressUpdate 监听上传进度变化事件

### WebSocket

Taro.sendSocketMessage 通过 WebSocket 连接发送数据
Taro.onSocketOpen 监听 WebSocket 连接打开事件
Taro.onSocketMessage 监听 WebSocket 接受到服务器的消息事件
Taro.onSocketError 监听 WebSocket 错误事件
Taro.onSocketClose 监听 WebSocket 连接关闭事件
Taro.connectSocket 创建一个 WebSocket 连接
Taro.closeSocket 关闭 WebSocket 连接

#### SocketTask

SocketTask.close 关闭 WebSocket 连接
SocketTask.onClose 监听 WebSocket 连接关闭事件
SocketTask.onError 监听 WebSocket 错误事件
SocketTask.onMessage 监听 WebSocket 接受到服务器的消息事件
SocketTask.onOpen 监听 WebSocket 连接打开事件
SocketTask.send 通过 WebSocket 连接发送数据

### mDNS

Taro.stopLocalServiceDiscovery 停止搜索 mDNS 服务
Taro.startLocalServiceDiscovery 开始搜索局域网下的 mDNS 服务
Taro.onLocalServiceResolveFail 监听 mDNS 服务解析失败的事件
Taro.onLocalServiceLost 监听 mDNS 服务离开的事件
Taro.onLocalServiceFound 监听 mDNS 服务发现的事件
Taro.onLocalServiceDiscoveryStop 监听 mDNS 服务停止搜索的事件
Taro.offLocalServiceResolveFail 取消监听 mDNS 服务解析失败的事件
Taro.offLocalServiceLost 取消监听 mDNS 服务离开的事件
Taro.offLocalServiceFound 取消监听 mDNS 服务发现的事件
Taro.offLocalServiceDiscoveryStop 取消监听 mDNS 服务停止搜索的事件

### TCP 通信

Taro.createTCPSocket 创建一个 TCP Socket 实例

#### TCPSocket

TCPSocket.close 关闭连接
TCPSocket.connect 在给定的套接字上启动连接
TCPSocket.offClose 取消监听一旦 socket 完全关闭就发出该事件
TCPSocket.offConnect 取消监听当一个 socket 连接成功建立的时候触发该事件
TCPSocket.offError 取消监听当错误发生时触发
TCPSocket.offMessage 取消监听当接收到数据的时触发该事件
TCPSocket.onClose 监听一旦 socket 完全关闭就发出该事件
TCPSocket.onConnect 监听当一个 socket 连接成功建立的时候触发该事件
TCPSocket.onError 监听当错误发生时触发
TCPSocket.onMessage 监听当接收到数据的时触发该事件
TCPSocket.write 在 socket 上发送数据

### UDP 通信

Taro.createUDPSocket 创建一个 UDP Socket 实例

#### UDPSocket

UDPSocket.bind 绑定一个系统随机分配的可用端口，或绑定一个指定的端口号
UDPSocket.close 关闭 UDP Socket 实例，相当于销毁
UDPSocket.connect 预先连接到指定的 IP 和 port，需要配合 write 方法一起使用
UDPSocket.offClose 取消监听关闭事件
UDPSocket.offError 取消监听错误事件
UDPSocket.offListening 取消监听开始监听数据包消息的事件
UDPSocket.offMessage 取消监听收到消息的事件
UDPSocket.onClose 监听关闭事件
UDPSocket.onError 监听错误事件
UDPSocket.onListening 监听开始监听数据包消息的事件
UDPSocket.onMessage 监听收到消息的事件
UDPSocket.send 向指定的 IP 和 port 发送消息
UDPSocket.setTTL 设置 IP_TTL 套接字选项，用于设置一个 IP 数据包传输时允许的最大跳步数
UDPSocket.write 用法与 send 方法相同，如果没有预先调用 connect 则与 send 无差异（注意即使调用了 connect 也需要在本接口填入地址和端口参数）

## 支付

Taro.requestPayment 发起微信支付
Taro.requestOrderPayment 创建自定义版交易组件订单，并发起支付

## 数据缓存

Taro.setStorageSync 将数据存储在本地缓存中指定的 key 中
Taro.setStorage 将数据存储在本地缓存中指定的 key 中
Taro.revokeBufferURL 根据 URL 销毁存在内存中的数据
Taro.removeStorageSync Taro.removeStorage 的同步版本
Taro.removeStorage 从本地缓存中移除指定 key
Taro.getStorageSync 从本地缓存中同步获取指定 key 的内容
Taro.getStorageInfoSync Taro.getStorageInfo 的同步版本
Taro.getStorageInfo 异步获取当前storage的相关信息
Taro.getStorage 从本地缓存中异步获取指定 key 的内容
Taro.createBufferURL 根据传入的 buffer 创建一个唯一的 URL 存在内存中
Taro.clearStorageSync Taro.clearStorage 的同步版本
Taro.clearStorage 清理本地数据缓存

### 周期性更新

Taro.setBackgroundFetchToken 设置自定义登录态，在周期性拉取数据时带上，便于第三方服务器验证请求合法性
Taro.onBackgroundFetchData 监听收到 backgroundFetch 数据事件
Taro.getBackgroundFetchToken 获取设置过的自定义登录态
Taro.getBackgroundFetchData 拉取 backgroundFetch 客户端缓存数据

## 数据分析

Taro.reportMonitor 自定义业务数据监控上报接口
Taro.reportEvent 事件上报
Taro.reportAnalytics 自定义分析数据上报接口
Taro.getExptInfoSync 给定实验参数数组，获取对应的实验参数值

## 画布

Taro.createOffscreenCanvas 创建离屏 canvas 实例
Taro.createCanvasContext 创建 canvas 的绘图上下文 CanvasContext 对象
Taro.canvasToTempFilePath 把当前画布指定区域的内容导出生成指定大小的图片
Taro.canvasPutImageData 将像素数据绘制到画布
Taro.canvasGetImageData 获取 canvas 区域隐含的像素数据

### Canvas

Canvas.cancelAnimationFrame 取消由 requestAnimationFrame 添加到计划中的动画帧请求
Canvas.createImage 创建一个图片对象
Canvas.createImageData 创建一个 ImageData 对象
Canvas.createPath2D 创建 Path2D 对象
Canvas.getContext 该方法返回 Canvas 的绘图上下文
Canvas.requestAnimationFrame 在下次进行重绘时执行
Canvas.toDataURL 返回一个包含图片展示的 data URI

### CanvasContext

CanvasContext.arc 创建一条弧线
CanvasContext.arcTo 根据控制点和半径绘制圆弧路径
CanvasContext.beginPath 开始创建一个路径
CanvasContext.bezierCurveTo 创建三次方贝塞尔曲线路径
CanvasContext.clearRect 清除画布上在该矩形区域内的内容
CanvasContext.clip 从原始画布中剪切任意形状和尺寸
CanvasContext.closePath 关闭一个路径
CanvasContext.createCircularGradient 创建一个圆形的渐变颜色
CanvasContext.createLinearGradient 创建一个线性的渐变颜色
CanvasContext.createPattern 对指定的图像创建模式的方法，可在指定的方向上重复元图像
CanvasContext.draw 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中
CanvasContext.drawImage 绘制图像到画布
CanvasContext.fill 对当前路径中的内容进行填充
CanvasContext.fillRect 填充一个矩形
CanvasContext.fillText 在画布上绘制被填充的文本
CanvasContext.lineTo 增加一个新点，然后创建一条从上次指定点到目标点的线
CanvasContext.measureText 测量文本尺寸信息
CanvasContext.moveTo 把路径移动到画布中的指定点，不创建线条
CanvasContext.quadraticCurveTo 创建二次贝塞尔曲线路径
CanvasContext.rect 创建一个矩形路径
CanvasContext.restore 恢复之前保存的绘图上下文
CanvasContext.rotate 以原点为中心顺时针旋转当前坐标轴
CanvasContext.save 保存绘图上下文
CanvasContext.scale 在调用后，之后创建的路径其横纵坐标会被缩放
CanvasContext.setFillStyle 设置填充色
CanvasContext.setFontSize 设置字体的字号
CanvasContext.setGlobalAlpha 设置全局画笔透明度
CanvasContext.setLineCap 设置线条的端点样式
CanvasContext.setLineDash 设置虚线样式
CanvasContext.setLineJoin 设置线条的交点样式
CanvasContext.setLineWidth 设置线条的宽度
CanvasContext.setMiterLimit 设置最大斜接长度
CanvasContext.setShadow 设定阴影样式
CanvasContext.setStrokeStyle 设置描边颜色
CanvasContext.setTextAlign 设置文字的对齐
CanvasContext.setTextBaseline 设置文字的竖直对齐
CanvasContext.setTransform 使用矩阵重新设置（覆盖）当前变换的方法
CanvasContext.stroke 画出当前路径的边框
CanvasContext.strokeRect 画一个矩形(非填充)
CanvasContext.strokeText 给定的 (x, y) 位置绘制文本描边的方法
CanvasContext.transform 使用矩阵多次叠加当前变换的方法
CanvasContext.translate 对当前坐标系的原点 (0, 0) 进行变换

### CanvasGradient

CanvasGradient.addColorStop 添加颜色的渐变点
Color 颜色
Image 图片对象
ImageData ImageData 对象

### OffscreenCanvas

OffscreenCanvas.createImage 创建一个图片对象
OffscreenCanvas.getContext 该方法返回 OffscreenCanvas 的绘图上下文

### Path2D Canvas 2D API 的接口 Path2D 用来声明路径，此路径稍后会被CanvasRenderingContext2D 对象使用

### RenderingContext Canvas 绘图上下文

## 媒体

### 地图

Taro.createMapContext 创建 map 上下文 MapContext 对象

#### MapContext

MapContext.addArc 添加弧线，途经点与夹角必须设置一个
MapContext.addCustomLayer 添加个性化图层
MapContext.addGroundOverlay 创建自定义图片图层，图片会随着地图缩放而缩放
MapContext.addMarkers 添加 marker
MapContext.addVisualLayer 添加可视化图层
MapContext.fromScreenLocation 获取屏幕上的点对应的经纬度，坐标原点为地图左上角
MapContext.getCenterLocation 获取当前地图中心的经纬度
MapContext.getRegion 获取当前地图的视野范围
MapContext.getRotate 获取当前地图的旋转角
MapContext.getScale 获取当前地图的缩放级别
MapContext.getSkew 获取当前地图的倾斜角
MapContext.includePoints 缩放视野展示所有经纬度
MapContext.initMarkerCluster 初始化点聚合的配置，未调用时采用默认配置
MapContext.moveAlong 沿指定路径移动 marker，用于轨迹回放等场景
MapContext.moveToLocation 将地图中心移置当前定位点，此时需设置地图组件 show-location 为true
MapContext.on 监听地图事件
MapContext.openMapApp 拉起地图APP选择导航
MapContext.removeArc 删除弧线
MapContext.removeCustomLayer 移除个性化图层
MapContext.removeGroundOverlay 移除自定义图片图层
MapContext.removeMarkers 移除 marker
MapContext.removeVisualLayer 移除可视化图层
MapContext.setBoundary 限制地图的显示范围
MapContext.setCenterOffset 设置地图中心点偏移，向后向下为增长，屏幕比例范围(0.25~0.75)，默认偏移为[0.5, 0.5]
MapContext.setLocMarkerIcon 设置定位点图标，支持网络路径、本地路径、代码包路径
MapContext.toScreenLocation 获取经纬度对应的屏幕坐标，坐标原点为地图左上角
MapContext.translateMarker 平移marker，带动画
MapContext.updateGroundOverlay 更新自定义图片图层

### 图片

Taro.saveImageToPhotosAlbum 保存图片到系统相册
Taro.previewMedia 预览图片和视频
Taro.previewImage 在新页面中全屏预览图片
Taro.getImageInfo 获取图片信息
Taro.editImage 编辑图片接口
Taro.compressImage 压缩图片接口，可选压缩质量
Taro.chooseMessageFile 从客户端会话选择文件
Taro.chooseImage 从本地相册选择图片或使用相机拍照

### 视频

Taro.saveVideoToPhotosAlbum 保存视频到系统相册
Taro.openVideoEditor 打开视频编辑器
Taro.getVideoInfo 获取视频详细信息
Taro.createVideoContext 创建 video 上下文 VideoContext 对象
Taro.compressVideo 压缩视频接口
Taro.chooseVideo 拍摄视频或从手机相册中选视频
Taro.chooseMedia 拍摄或从手机相册中选择图片或视频

#### VideoContext

VideoContext.exitBackgroundPlayback 退出后台音频播放模式
VideoContext.exitFullScreen 退出全屏
VideoContext.exitPictureInPicture 退出小窗，该方法可在任意页面调用
VideoContext.hideStatusBar 隐藏状态栏，仅在iOS全屏下有效
VideoContext.pause 暂停视频
VideoContext.play 播放视频
VideoContext.playbackRate 设置倍速播放
VideoContext.requestBackgroundPlayback 进入后台音频播放模式
VideoContext.requestFullScreen 进入全屏
VideoContext.seek 跳转到指定位置
VideoContext.sendDanmu 发送弹幕
VideoContext.showStatusBar 显示状态栏，仅在iOS全屏下有效
VideoContext.stop 停止视频

### 音频

Taro.stopVoice 结束播放语音
Taro.setInnerAudioOption 设置 InnerAudioContext 的播放选项
Taro.playVoice 开始播放语音
Taro.pauseVoice 暂停正在播放的语音
Taro.getAvailableAudioSources 获取当前支持的音频输入源
Taro.createWebAudioContext 创建 WebAudio 上下文
Taro.createMediaAudioPlayer 创建媒体音频播放器对象 MediaAudioPlayer 对象，可用于播放视频解码器 VideoDecoder 输出的音频
Taro.createInnerAudioContext 创建内部 audio 上下文 InnerAudioContext 对象
Taro.createAudioContext 创建 audio 上下文 AudioContext 对象

#### AudioBuffer

AudioBuffer.copyFromChannel 从AudioBuffer的指定频道复制到数组终端
AudioBuffer.copyToChannel 从指定数组复制样本到audioBuffer的特定通道
AudioBuffer.getChannelData 返回一个 Float32Array，包含了带有频道的PCM数据，由频道参数定义（有0代表第一个频道）

#### AudioContext

AudioContext.pause 暂停音频
AudioContext.play 播放音频
AudioContext.seek 跳转到指定位置
AudioContext.setSrc 设置音频地址

#### InnerAudioContext

InnerAudioContext.destroy 销毁当前实例
InnerAudioContext.offCanplay 取消监听音频进入可以播放状态的事件
InnerAudioContext.offEnded 取消监听音频自然播放至结束的事件
InnerAudioContext.offError 取消监听音频播放错误事件
InnerAudioContext.offPause 取消监听音频暂停事件
InnerAudioContext.offPlay 取消监听音频播放事件
InnerAudioContext.offSeeked 取消监听音频完成跳转操作的事件
InnerAudioContext.offSeeking 取消监听音频进行跳转操作的事件
InnerAudioContext.offStop 取消监听音频停止事件
InnerAudioContext.offTimeUpdate 取消监听音频播放进度更新事件
InnerAudioContext.offWaiting 取消监听音频加载中事件
InnerAudioContext.onCanplay 监听音频进入可以播放状态的事件
InnerAudioContext.onEnded 监听音频自然播放至结束的事件
InnerAudioContext.onError 监听音频播放错误事件
InnerAudioContext.onPause 监听音频暂停事件
InnerAudioContext.onPlay 监听音频播放事件
InnerAudioContext.onSeeked 监听音频完成跳转操作的事件
InnerAudioContext.onSeeking 监听音频进行跳转操作的事件
InnerAudioContext.onStop 监听音频停止事件
InnerAudioContext.onTimeUpdate 监听音频播放进度更新事件
InnerAudioContext.onWaiting 监听音频加载中事件
InnerAudioContext.pause 暂停
InnerAudioContext.play 播放
InnerAudioContext.seek 跳转到指定位置
InnerAudioContext.stop 停止

#### MediaAudioPlayer

MediaAudioPlayer.addAudioSource 添加音频源
MediaAudioPlayer.destroy 销毁播放器
MediaAudioPlayer.removeAudioSource 移除音频源
MediaAudioPlayer.start 启动播放器
MediaAudioPlayer.stop 停止播放器

#### WebAudioContext

WebAudioContext.close 关闭WebAudioContext
WebAudioContext.createBiquadFilter 创建一个BiquadFilterNode
WebAudioContext.createBuffer 创建一个AudioBuffer，代表着一段驻留在内存中的短音频
WebAudioContext.createBufferSource 创建一个BufferSourceNode实例，通过AudioBuffer对象来播放音频数据
WebAudioContext.createChannelMerger 创建一个ChannelMergerNode
WebAudioContext.createChannelSplitter 创建一个ChannelSplitterNode
WebAudioContext.createConstantSource 创建一个ConstantSourceNode
WebAudioContext.createDelay 创建一个DelayNode
WebAudioContext.createDynamicsCompressor 创建一个DynamicsCompressorNode
WebAudioContext.createGain 创建一个GainNode
WebAudioContext.createIIRFilter 创建一个IIRFilterNode
WebAudioContext.createOscillator 创建一个OscillatorNode
WebAudioContext.createPanner 创建一个PannerNode
WebAudioContext.createPeriodicWave 创建一个PeriodicWaveNode
WebAudioContext.createScriptProcessor 创建一个ScriptProcessorNode
WebAudioContext.createWaveShaper 创建一个WaveShaperNode
WebAudioContext.decodeAudioData 异步解码一段资源为AudioBuffer
WebAudioContext.resume 同步恢复已经被暂停的WebAudioContext上下文
WebAudioContext.suspend 同步暂停WebAudioContext上下文
WebAudioContextNode 一类音频处理模块，不同的Node具备不同的功能，如GainNode(音量调整)等

### 背景音频

Taro.stopBackgroundAudio 停止播放音乐
Taro.seekBackgroundAudio 控制音乐播放进度
Taro.playBackgroundAudio 使用后台播放器播放音乐
Taro.pauseBackgroundAudio 暂停播放音乐
Taro.onBackgroundAudioStop 监听音乐停止事件
Taro.onBackgroundAudioPlay 监听音乐播放事件
Taro.onBackgroundAudioPause 监听音乐暂停事件
Taro.getBackgroundAudioPlayerState 获取后台音乐播放状态
Taro.getBackgroundAudioManager 获取全局唯一的背景音频管理器

#### BackgroundAudioManager

BackgroundAudioManager.onCanplay 监听背景音频进入可播放状态事件
BackgroundAudioManager.onEnded 监听背景音频自然播放结束事件
BackgroundAudioManager.onError 监听背景音频播放错误事件
BackgroundAudioManager.onNext 监听用户在系统音乐播放面板点击下一曲事件（仅iOS）
BackgroundAudioManager.onPause 监听背景音频暂停事件
BackgroundAudioManager.onPlay 监听背景音频播放事件
BackgroundAudioManager.onPrev 监听用户在系统音乐播放面板点击上一曲事件（仅iOS）
BackgroundAudioManager.onSeeked 监听背景音频完成跳转操作事件
BackgroundAudioManager.onSeeking 监听背景音频开始跳转操作事件
BackgroundAudioManager.onStop 监听背景音频停止事件
BackgroundAudioManager.onTimeUpdate 监听背景音频播放进度更新事件，只有小程序在前台时会回调
BackgroundAudioManager.onWaiting 监听音频加载中事件
BackgroundAudioManager.pause 暂停音乐
BackgroundAudioManager.play 播放音乐
BackgroundAudioManager.seek 跳转到指定位置
BackgroundAudioManager.stop 停止音乐

### 实时音视频

Taro.createLivePusherContext 创建 live-pusher 上下文 LivePusherContext 对象
Taro.createLivePlayerContext 创建 live-player 上下文 LivePlayerContext 对象

#### LivePlayerContext

LivePlayerContext.exitFullScreen 退出全屏
LivePlayerContext.exitPictureInPicture 退出小窗，该方法可在任意页面调用
LivePlayerContext.mute 静音
LivePlayerContext.pause 暂停
LivePlayerContext.play 播放
LivePlayerContext.requestFullScreen 进入全屏
LivePlayerContext.requestPictureInPicture 进入小窗
LivePlayerContext.resume 恢复
LivePlayerContext.snapshot 截图
LivePlayerContext.stop 停止

#### LivePusherContext

LivePusherContext.pause 暂停推流
LivePusherContext.pauseBGM 暂停背景音
LivePusherContext.playBGM 播放背景音
LivePusherContext.resume 恢复推流
LivePusherContext.resumeBGM 恢复背景音
LivePusherContext.sendMessage 发送SEI消息
LivePusherContext.setBGMVolume 设置背景音音量
LivePusherContext.setMICVolume 设置麦克风音量
LivePusherContext.snapshot 快照
LivePusherContext.start 开始推流，同时开启摄像头预览
LivePusherContext.startPreview 开启摄像头预览
LivePusherContext.stop 停止推流，同时停止摄像头预览
LivePusherContext.stopBGM 停止背景音
LivePusherContext.stopPreview 关闭摄像头预览
LivePusherContext.switchCamera 切换前后摄像头
LivePusherContext.toggleTorch 切换手电筒

### 录音

Taro.stopRecord 停止录音
Taro.startRecord 开始录音
Taro.getRecorderManager 获取全局唯一的录音管理器 RecorderManager

#### RecorderManager

RecorderManager.onError 监听录音错误事件
RecorderManager.onFrameRecorded 监听已录制完指定帧大小的文件事件
RecorderManager.onInterruptionBegin 监听录音因为受到系统占用而被中断开始事件
RecorderManager.onInterruptionEnd 监听录音中断结束事件
RecorderManager.onPause 监听录音暂停事件
RecorderManager.onResume 监听录音继续事件
RecorderManager.onStart 监听录音开始事件
RecorderManager.onStop 监听录音结束事件
RecorderManager.pause 暂停录音
RecorderManager.resume 继续录音
RecorderManager.start 开始录音
RecorderManager.stop 停止录音

### 相机

Taro.createCameraContext 创建 camera 上下文 CameraContext 对象

#### CameraContext

CameraContext.onCameraFrame 获取 Camera 实时帧数据
CameraContext.setZoom 设置缩放级别
CameraContext.startRecord 开始录像
CameraContext.stopRecord 结束录像
CameraContext.takePhoto 拍摄照片

#### CameraFrameListener

CameraFrameListener.start 开始监听帧数据
CameraFrameListener.stop 停止监听帧数据

### 富文本

#### EditorContext

EditorContext.blur 编辑器失焦，同时收起键盘
EditorContext.clear 清空编辑器内容
EditorContext.format 修改样式
EditorContext.getContents 获取编辑器内容
EditorContext.getSelectionText 获取编辑器已选区域内的纯文本内容
EditorContext.insertDivider 插入分割线
EditorContext.insertImage 插入图片
EditorContext.insertText 覆盖当前选区，设置一段文本
EditorContext.redo 恢复
EditorContext.removeFormat 清除当前选区的样式
EditorContext.scrollIntoView 使得编辑器光标处滚动到窗口可视区域内
EditorContext.setContents 初始化编辑器内容，html和delta同时存在时仅delta生效
EditorContext.undo 撤销

### 音视频合成

Taro.createMediaContainer 创建音视频处理容器，最终可将容器中的轨道合成一个视频

#### MediaContainer

MediaContainer.addTrack 将音频或视频轨道添加到容器
MediaContainer.destroy 将容器销毁，释放资源
MediaContainer.export 将容器内的轨道合并并导出视频文件
MediaContainer.extractDataSource 将传入的视频源分离轨道
MediaContainer.removeTrack 将音频或视频轨道从容器中移除
MediaTrack 可通过 MediaContainer.extractDataSource 返回

### 实时语音

Taro.updateVoIPChatMuteConfig 更新实时语音静音设置
Taro.subscribeVoIPVideoMembers 订阅视频画面成员
Taro.setEnable1v1Chat 开启双人通话
Taro.onVoIPVideoMembersChanged 监听实时语音通话成员视频状态变化事件
Taro.onVoIPChatStateChanged 监听房间状态变化事件
Taro.onVoIPChatSpeakersChanged 监听实时语音通话成员通话状态变化事件
Taro.onVoIPChatMembersChanged 监听实时语音通话成员在线状态变化事件
Taro.onVoIPChatInterrupted 监听被动断开实时语音通话事件
Taro.offVoIPVideoMembersChanged 取消监听实时语音通话成员视频状态变化事件
Taro.offVoIPChatStateChanged 取消监听房间状态变化事件
Taro.offVoIPChatMembersChanged 取消监听实时语音通话成员在线状态变化事件
Taro.offVoIPChatInterrupted 取消监听被动断开实时语音通话事件
Taro.joinVoIPChat 加入 (创建) 实时语音通话，更多信息可见 实时语音指南
Taro.exitVoIPChat 退出（销毁）实时语音通话

### 画面录制器

Taro.createMediaRecorder 创建 WebGL 画面录制器，可逐帧录制在 WebGL 上渲染的画面并导出视频文件

#### MediaRecorder

MediaRecorder.destroy 销毁录制器
MediaRecorder.off 取消监听录制事件
MediaRecorder.on 注册监听录制事件的回调函数
MediaRecorder.pause 暂停录制
MediaRecorder.requestFrame 请求下一帧录制，在 callback 里完成一帧渲染后开始录制当前帧
MediaRecorder.resume 恢复录制
MediaRecorder.start 开始录制
MediaRecorder.stop 结束录制

### 视频解码器

Taro.createVideoDecoder 创建视频解码器，可逐帧获取解码后的数据

#### VideoDecoder

VideoDecoder.getFrameData 获取下一帧的解码数据
VideoDecoder.off 取消监听录制事件
VideoDecoder.on 注册监听录制事件的回调函数
VideoDecoder.remove 移除解码器
VideoDecoder.seek 跳到某个时间点解码
VideoDecoder.start 开始解码
VideoDecoder.stop 停止解码

## 位置

Taro.stopLocationUpdate 关闭监听实时位置变化，前后台都停止消息接收
Taro.startLocationUpdateBackground 开启小程序进入前后台时均接收位置消息，需引导用户开启授权
Taro.startLocationUpdate 开启小程序进入前台时接收位置消息
Taro.openLocation 使用微信内置地图查看位置
Taro.onLocationChangeError 监听持续定位接口返回失败时触发
Taro.onLocationChange 监听实时地理位置变化事件，需结合 Taro.startLocationUpdateBackground、wx.startLocationUpdate使用
Taro.offLocationChangeError 取消监听持续定位接口返回失败时触发
Taro.offLocationChange 取消监听实时地理位置变化事件
Taro.getLocation 获取当前的地理位置、速度
Taro.choosePoi 打开POI列表选择位置，支持模糊定位（精确到市）和精确定位混选
Taro.chooseLocation 打开地图选择位置

## 文件

Taro.saveFileToDisk 保存文件系统的文件到用户磁盘，仅在 PC 端支持
Taro.saveFile 保存文件到本地
Taro.removeSavedFile 删除本地缓存文件
Taro.openDocument 新开页面打开文档
Taro.getSavedFileList 获取该小程序下已保存的本地缓存文件列表
Taro.getSavedFileInfo 获取本地文件的文件信息
Taro.getFileSystemManager 获取全局唯一的文件管理器
Taro.getFileInfo 获取文件信息

### FileSystemManager

FileSystemManager.access 判断文件/目录是否存在
FileSystemManager.accessSync FileSystemManager.access 的同步版本
FileSystemManager.appendFile 在文件结尾追加内容
FileSystemManager.appendFileSync FileSystemManager.appendFile 的同步版本
FileSystemManager.close 关闭文件
FileSystemManager.closeSync 同步关闭文件
FileSystemManager.copyFile 复制文件
FileSystemManager.copyFileSync FileSystemManager.copyFile 的同步版本
FileSystemManager.fstat 获取文件的状态信息
FileSystemManager.fstatSync 同步获取文件的状态信息
FileSystemManager.ftruncate 对文件内容进行截断操作
FileSystemManager.ftruncateSync 对文件内容进行截断操作
FileSystemManager.getFileInfo 获取该小程序下的 本地临时文件 或 本地缓存文件 信息
FileSystemManager.getSavedFileList 获取该小程序下已保存的本地缓存文件列表
FileSystemManager.mkdir 创建目录
FileSystemManager.mkdirSync FileSystemManager.mkdir 的同步版本
FileSystemManager.open 打开文件，返回文件描述符
FileSystemManager.openSync 同步打开文件，返回文件描述符
FileSystemManager.read 读文件
FileSystemManager.readCompressedFile 读取指定压缩类型的本地文件内容
FileSystemManager.readCompressedFileSync 同步读取指定压缩类型的本地文件内容
FileSystemManager.readdir 读取目录内文件列表
FileSystemManager.readdirSync FileSystemManager.readdir 的同步版本
FileSystemManager.readFile 读取本地文件内容
FileSystemManager.readFileSync FileSystemManager.readFile 的同步版本
FileSystemManager.readSync 读文件
FileSystemManager.readZipEntry 读取压缩包内的文件
FileSystemManager.removeSavedFile 删除该小程序下已保存的本地缓存文件
FileSystemManager.rename 重命名文件
FileSystemManager.renameSync FileSystemManager.rename 的同步版本
FileSystemManager.rmdir 删除目录
FileSystemManager.rmdirSync FileSystemManager.rmdir 的同步版本
FileSystemManager.saveFile 保存临时文件到本地
FileSystemManager.saveFileSync FileSystemManager.saveFile 的同步版本
FileSystemManager.stat 获取文件 Stats 对象
FileSystemManager.statSync FileSystemManager.stat 的同步版本
FileSystemManager.truncate 对文件内容进行截断操作
FileSystemManager.truncateSync 对文件内容进行截断操作 (truncate 的同步版本)
FileSystemManager.unlink 删除文件
FileSystemManager.unlinkSync FileSystemManager.unlink 的同步版本
FileSystemManager.unzip 解压文件
FileSystemManager.write 写入文件
FileSystemManager.writeFile 写文件
FileSystemManager.writeFileSync FileSystemManager.writeFile 的同步版本
FileSystemManager.writeSync 同步写入文件
ReadResult 文件读取结果

### Stats

Stats.isDirectory 判断当前文件是否一个目录
Stats.isFile 判断当前文件是否一个普通文件
WriteResult 文件写入结果

## 开放接口

### 登录

Taro.pluginLogin 该接口仅在小程序插件中可调用，调用接口获得插件用户标志凭证（code）
Taro.login 调用接口获取登录凭证（code）
Taro.checkSession 检查登录态是否过期

### 帐号信息

Taro.getAccountInfoSync 获取当前帐号信息

### 用户信息

Taro.getUserProfile 获取用户信息
Taro.getUserInfo 获取用户信息
UserInfo 用户信息

### 授权

Taro.authorizeForMiniProgram 仅小程序插件中能调用该接口，用法同 Taro.authorize
Taro.authorize 提前向用户发起授权请求

### 设置

Taro.openSetting 调起客户端小程序设置界面，返回用户设置的操作结果
Taro.getSetting 获取用户的当前设置
AuthSetting 用户授权设置信息，详情参考权限
SubscriptionsSetting 订阅消息设置

### 收货地址

Taro.chooseAddress 获取用户收货地址

### 卡券

Taro.openCard 查看微信卡包中的卡券
Taro.addCard 批量添加卡券

### 发票

Taro.chooseInvoiceTitle 选择用户的发票抬头
Taro.chooseInvoice 选择用户已有的发票

### 生物认证

Taro.startSoterAuthentication 开始 SOTER 生物认证
Taro.checkIsSupportSoterAuthentication 获取本机支持的 SOTER 生物认证方式
Taro.checkIsSoterEnrolledInDevice 获取设备内是否录入如指纹等生物信息的接口

### 微信运动

Taro.shareToWeRun 分享数据到微信运动
Taro.getWeRunData 获取用户过去三十天微信运动步数

### 订阅消息

Taro.requestSubscribeMessage 调起客户端小程序订阅消息界面，返回用户订阅消息的操作结果
Taro.requestSubscribeDeviceMessage 订阅设备消息接口，调用后弹出授权框，用户同意后会允许开发者给用户发送订阅模版消息

### 微信红包

Taro.showRedPackage 拉取h5领取红包封面页

### 收藏

Taro.addVideoToFavorites 收藏视频
Taro.addFileToFavorites 收藏文件

### 车牌

Taro.chooseLicensePlate 选择车牌号

### 视频号

Taro.reserveChannelsLive 预约视频号直播
Taro.openChannelsUserProfile 打开视频号主页
Taro.openChannelsLive 打开视频号直播
Taro.openChannelsEvent 打开视频号活动页
Taro.openChannelsActivity 打开视频号视频
Taro.getChannelsLiveNoticeInfo 获取视频号直播预告信息
Taro.getChannelsLiveInfo 获取视频号直播信息

### 微信群

Taro.getGroupEnterInfo 获取微信群聊场景下的小程序启动信息

### 微信客服

Taro.openCustomerServiceChat 打开微信客服

## 设备

### 蓝牙-通用

Taro.stopBluetoothDevicesDiscovery 停止搜寻附近的蓝牙外围设备
Taro.startBluetoothDevicesDiscovery 开始搜寻附近的蓝牙外围设备
Taro.openBluetoothAdapter 初始化蓝牙模块
Taro.onBluetoothDeviceFound 监听搜索到新设备的事件
Taro.onBluetoothAdapterStateChange 监听蓝牙适配器状态变化事件
Taro.offBluetoothDeviceFound 取消监听寻找到新设备的事件
Taro.offBluetoothAdapterStateChange 取消监听蓝牙适配器状态变化事件
Taro.makeBluetoothPair 蓝牙配对接口，仅安卓支持
Taro.isBluetoothDevicePaired 查询蓝牙设备是否配对，仅安卓支持
Taro.getConnectedBluetoothDevices 根据主服务 UUID 获取已连接的蓝牙设备
Taro.getBluetoothDevices 获取在蓝牙模块生效期间所有搜索到的蓝牙设备
Taro.getBluetoothAdapterState 获取本机蓝牙适配器状态
Taro.closeBluetoothAdapter 关闭蓝牙模块

### 蓝牙-低功耗中心设备

Taro.writeBLECharacteristicValue 向蓝牙低功耗设备特征值中写入二进制数据
Taro.setBLEMTU 协商设置蓝牙低功耗的最大传输单元 (Maximum Transmission Unit, MTU)
Taro.readBLECharacteristicValue 读取蓝牙低功耗设备特征值的二进制数据
Taro.onBLEMTUChange 监听蓝牙低功耗的最大传输单元变化事件（仅安卓触发）
Taro.onBLEConnectionStateChange 监听蓝牙低功耗连接状态的改变事件
Taro.onBLECharacteristicValueChange 监听蓝牙低功耗设备的特征值变化事件
Taro.offBLEMTUChange 取消监听蓝牙低功耗的最大传输单元变化事件
Taro.offBLEConnectionStateChange 取消监听蓝牙低功耗连接状态的改变事件
Taro.offBLECharacteristicValueChange 取消监听蓝牙低功耗设备的特征值变化事件
Taro.notifyBLECharacteristicValueChange 启用蓝牙低功耗设备特征值变化时的 notify 功能，订阅特征
Taro.getBLEMTU 获取蓝牙低功耗的最大传输单元
Taro.getBLEDeviceServices 获取蓝牙低功耗设备所有服务 (service)
Taro.getBLEDeviceRSSI 获取蓝牙低功耗设备的信号强度 (Received Signal Strength Indication, RSSI)
Taro.getBLEDeviceCharacteristics 获取蓝牙低功耗设备某个服务中所有特征 (characteristic)
Taro.createBLEConnection 连接蓝牙低功耗设备
Taro.closeBLEConnection 断开与蓝牙低功耗设备的连接

### 蓝牙-低功耗外围设备

Taro.onBLEPeripheralConnectionStateChanged 监听当前外围设备被连接或断开连接事件
Taro.offBLEPeripheralConnectionStateChanged 取消监听当前外围设备被连接或断开连接事件
Taro.createBLEPeripheralServer 建立本地作为蓝牙低功耗外围设备的服务端，可创建多个

#### BLEPeripheralServer

BLEPeripheralServer.addService 添加服务
BLEPeripheralServer.close 关闭当前服务端
BLEPeripheralServer.offCharacteristicReadRequest 取消监听已连接的设备请求读当前外围设备的特征值事件
BLEPeripheralServer.offCharacteristicSubscribed 取消监听特征订阅事件
BLEPeripheralServer.offCharacteristicUnsubscribed 取消监听取消特征订阅事件
BLEPeripheralServer.offCharacteristicWriteRequest 取消监听已连接的设备请求写当前外围设备的特征值事件
BLEPeripheralServer.onCharacteristicReadRequest 监听已连接的设备请求读当前外围设备的特征值事件
BLEPeripheralServer.onCharacteristicSubscribed 监听特征订阅事件，仅 iOS 支持
BLEPeripheralServer.onCharacteristicUnsubscribed 监听取消特征订阅事件，仅 iOS 支持
BLEPeripheralServer.onCharacteristicWriteRequest 监听已连接的设备请求写当前外围设备的特征值事件
BLEPeripheralServer.removeService 移除服务
BLEPeripheralServer.startAdvertising 开始广播本地创建的外围设备
BLEPeripheralServer.stopAdvertising 停止广播
BLEPeripheralServer.writeCharacteristicValue 往指定特征写入二进制数据值，并通知已连接的主机，从机的特征值已发生变化，该接口会处理是走回包还是走订阅

### 蓝牙-信标(Beacon)

Taro.stopBeaconDiscovery 停止搜索附近的 Beacon 设备
Taro.startBeaconDiscovery 开始搜索附近的 Beacon 设备
Taro.onBeaconUpdate 监听 Beacon 设备更新事件，仅能注册一个监听
Taro.onBeaconServiceChange 监听 Beacon 服务状态变化事件，仅能注册一个监听
Taro.offBeaconUpdate 取消监听 Beacon 设备更新事件
Taro.offBeaconServiceChange 取消监听 Beacon 服务状态变化事件
Taro.getBeacons 获取所有已搜索到的 Beacon 设备
BeaconInfo Beacon 设备

### NFC

Taro.stopHCE 关闭 NFC 模块
Taro.startHCE 初始化 NFC 模块
Taro.sendHCEMessage 发送 NFC 消息
Taro.onHCEMessage 监听接收 NFC 设备消息事件，仅能注册一个监听
Taro.offHCEMessage 接收 NFC 设备消息事件，取消事件监听
Taro.getNFCAdapter 获取 NFC 实例
Taro.getHCEState 判断当前设备是否支持 HCE 能力

#### IsoDep

IsoDep.close 断开连接
IsoDep.connect 连接 NFC 标签
IsoDep.getHistoricalBytes 获取复位信息
IsoDep.getMaxTransceiveLength 获取最大传输长度
IsoDep.isConnected 检查是否已连接
IsoDep.setTimeout 设置超时时间
IsoDep.transceive 发送数据

#### MifareClassic

MifareClassic.close 断开连接
MifareClassic.connect 连接 NFC 标签
MifareClassic.getMaxTransceiveLength 获取最大传输长度
MifareClassic.isConnected 检查是否已连接
MifareClassic.setTimeout 设置超时时间
MifareClassic.transceive 发送数据

#### MifareUltralight

MifareUltralight.close 断开连接
MifareUltralight.connect 连接 NFC 标签
MifareUltralight.getMaxTransceiveLength 获取最大传输长度
MifareUltralight.isConnected 检查是否已连接
MifareUltralight.setTimeout 设置超时时间
MifareUltralight.transceive 发送数据

#### Ndef

Ndef.close 断开连接
Ndef.connect 连接 NFC 标签
Ndef.isConnected 检查是否已连接
Ndef.offNdefMessage 取消监听 Ndef 消息
Ndef.onNdefMessage 监听 Ndef 消息
Ndef.setTimeout 设置超时时间
Ndef.writeNdefMessage 重写 Ndef 标签内容

#### NfcA

NfcA.close 断开连接
NfcA.connect 连接 NFC 标签
NfcA.getAtqa 获取ATQA信息
NfcA.getMaxTransceiveLength 获取最大传输长度
NfcA.getSak 获取SAK信息
NfcA.isConnected 检查是否已连接
NfcA.setTimeout 设置超时时间
NfcA.transceive 发送数据

#### NFCAdapter

NFCAdapter.getIsoDep 获取IsoDep实例，实例支持ISO-DEP (ISO 14443-4)标准的读写
NFCAdapter.getMifareClassic 获取MifareClassic实例，实例支持MIFARE Classic标签的读写
NFCAdapter.getMifareUltralight 获取MifareUltralight实例，实例支持MIFARE Ultralight标签的读写
NFCAdapter.getNdef 获取Ndef实例，实例支持对NDEF格式的NFC标签上的NDEF数据的读写
NFCAdapter.getNfcA 获取NfcA实例，实例支持NFC-A (ISO 14443-3A)标准的读写
NFCAdapter.getNfcB 获取NfcB实例，实例支持NFC-B (ISO 14443-3B)标准的读写
NFCAdapter.getNfcF 获取NfcF实例，实例支持NFC-F (JIS 6319-4)标准的读写
NFCAdapter.getNfcV 获取NfcV实例，实例支持NFC-V (ISO 15693)标准的读写
NFCAdapter.offDiscovered 取消监听 NFC Tag
NFCAdapter.onDiscovered 监听 NFC Tag
NFCAdapter.startDiscovery
NFCAdapter.stopDiscovery

#### NfcB

NfcB.close 断开连接
NfcB.connect 连接 NFC 标签
NfcB.getMaxTransceiveLength 获取最大传输长度
NfcB.isConnected 检查是否已连接
NfcB.setTimeout 设置超时时间
NfcB.transceive 发送数据

#### NfcF

NfcF.close 断开连接
NfcF.connect 连接 NFC 标签
NfcF.getMaxTransceiveLength 获取最大传输长度
NfcF.isConnected 检查是否已连接
NfcF.setTimeout 设置超时时间
NfcF.transceive 发送数据

#### NfcV

NfcV.close 断开连接
NfcV.connect 连接 NFC 标签
NfcV.getMaxTransceiveLength 获取最大传输长度
NfcV.isConnected 检查是否已连接
NfcV.setTimeout 设置超时时间
NfcV.transceive 发送数据

### Wi-Fi

Taro.stopWifi 关闭 Wi-Fi 模块
Taro.startWifi 初始化 Wi-Fi 模块
Taro.setWifiList 设置 wifiList 中 AP 的相关信息
Taro.onWifiConnectedWithPartialInfo 监听连接上 Wi-Fi 的事件
Taro.onWifiConnected 监听连接上 Wi-Fi 的事件
Taro.onGetWifiList 监听获取到 Wi-Fi 列表数据事件
Taro.offWifiConnectedWithPartialInfo 取消监听连接上 Wi-Fi 的事件
Taro.offWifiConnected 取消监听连接上 Wi-Fi 的事件
Taro.offGetWifiList 取消监听获取到 Wi-Fi 列表数据事件
Taro.getWifiList 请求获取 Wi-Fi 列表
Taro.getConnectedWifi 获取已连接中的 Wi-Fi 信息
Taro.connectWifi 连接 Wi-Fi
WifiInfo Wifi 信息

### 日历

Taro.addPhoneRepeatCalendar 向系统日历添加重复事件
Taro.addPhoneCalendar 向系统日历添加事件

### 联系人

Taro.chooseContact 拉起手机通讯录，选择联系人
Taro.addPhoneContact 添加手机通讯录联系人

### 无障碍

Taro.checkIsOpenAccessibility 检测是否开启视觉无障碍功能

### 电量

Taro.getBatteryInfoSync Taro.getBatteryInfo 的同步版本
Taro.getBatteryInfo 获取设备电量

### 剪贴板

Taro.setClipboardData 设置系统剪贴板的内容
Taro.getClipboardData 获取系统剪贴板的内容

### 网络

Taro.onNetworkWeakChange 监听弱网状态变化事件
Taro.onNetworkStatusChange 监听网络状态变化事件
Taro.offNetworkWeakChange 取消监听弱网状态变化事件
Taro.offNetworkStatusChange 取消监听网络状态变化事件，参数为空，则取消所有的事件监听
Taro.getNetworkType 获取网络类型
Taro.getLocalIPAddress 获取局域网IP地址

### 加密

Taro.getRandomValues 获取密码学安全随机数

### 屏幕

Taro.setVisualEffectOnCapture 设置截屏/录屏时屏幕表现，仅支持在 Android 端调用
Taro.setScreenBrightness 设置屏幕亮度
Taro.setKeepScreenOn 设置是否保持常亮状态
Taro.onUserCaptureScreen 监听用户主动截屏事件
Taro.offUserCaptureScreen 用户主动截屏事件
Taro.getScreenBrightness 获取屏幕亮度

### 键盘

Taro.onKeyboardHeightChange 监听键盘高度变化
Taro.offKeyboardHeightChange 取消监听键盘高度变化事件
Taro.hideKeyboard 在input、textarea等focus拉起键盘之后，手动调用此接口收起键盘
Taro.getSelectedTextRange 在input、textarea等focus之后，获取输入框的光标位置

### 电话

Taro.makePhoneCall 拨打电话

### 加速计

Taro.stopAccelerometer 停止监听加速度数据
Taro.startAccelerometer 开始监听加速度数据
Taro.onAccelerometerChange 监听加速度数据事件
Taro.offAccelerometerChange 取消监听加速度数据事件，参数为空，则取消所有的事件监听

### 罗盘

Taro.stopCompass 停止监听罗盘数据
Taro.startCompass 开始监听罗盘数据
Taro.onCompassChange 监听罗盘数据变化事件
Taro.offCompassChange 取消监听罗盘数据变化事件，参数为空，则取消所有的事件监听

### 设备方向

Taro.stopDeviceMotionListening 停止监听设备方向的变化
Taro.startDeviceMotionListening 开始监听设备方向的变化
Taro.onDeviceMotionChange 监听设备方向变化事件
Taro.offDeviceMotionChange 取消监听设备方向变化事件，参数为空，则取消所有的事件监听

### 陀螺仪

Taro.stopGyroscope 停止监听陀螺仪数据
Taro.startGyroscope 开始监听陀螺仪数据
Taro.onGyroscopeChange 监听陀螺仪数据变化事件
Taro.offGyroscopeChange 取消监听陀螺仪数据变化事件

### 内存

Taro.onMemoryWarning 监听内存不足告警事件
Taro.offMemoryWarning 取消监听内存不足告警事件

### 扫码

Taro.scanCode 调起客户端扫码界面进行扫码

### 振动

Taro.vibrateShort 使手机发生较短时间的振动（15 ms）
Taro.vibrateLong 使手机发生较长时间的振动（400 ms)

## AI

### 视觉算法

Taro.isVKSupport 判断支持版本
Taro.createVKSession 创建 vision kit 会话对象

### VKAnchor anchor 对象，只有 v2 版本支持

#### VKCamera

VKCamera.getProjectionMatrix 获取投影矩阵

#### VKFrame

VKFrame.getCameraTexture 获取当前帧纹理，目前只支持 YUV 纹理
VKFrame.getDisplayTransform 获取纹理调整矩阵

#### VKSession

VKSession.cancelAnimationFrame 取消由 requestAnimationFrame 添加到计划中的动画帧请求
VKSession.destroy 销毁会话
VKSession.getVKFrame 获取帧对象，每调用一次都会触发一次帧分析过程
VKSession.hitTest 触摸检测，v1 版本只支持单平面（即 hitTest 生成一次平面后，后续 hitTest 均不会再生成平面，而是以之前生成的平面为基础进行检测）
VKSession.off 取消监听会话事件
VKSession.on 监听会话事件
VKSession.requestAnimationFrame 在下次进行重绘时执行
VKSession.start 开启会话
VKSession.stop 停止会话

### 人脸识别

Taro.stopFaceDetect 停止人脸识别
Taro.initFaceDetect 初始化人脸识别
Taro.faceDetect 人脸识别，使用前需要通过 Taro.initFaceDetect 进行一次初始化，推荐使用相机接口返回的帧数据

## Worker

Taro.createWorker 创建一个 Worker 线程

### Worker

Worker.onMessage 监听主线程/Worker 线程向当前线程发送的消息的事件
Worker.onProcessKilled 监听 worker线程被系统回收事件（当iOS系统资源紧张时，worker线程存在被系统回收的可能，开发者可监听此事件并重新创建一个worker）
Worker.postMessage 向主线程/Worker 线程发送的消息
Worker.terminate 结束当前 Worker 线程

## WXML

Taro.createSelectorQuery 返回一个 SelectorQuery 对象实例
Taro.createIntersectionObserver 创建并返回一个 IntersectionObserver 对象实例

### IntersectionObserver

IntersectionObserver.disconnect 停止监听
IntersectionObserver.observe 指定目标节点并开始监听相交状态变化情况
IntersectionObserver.relativeTo 使用选择器指定一个节点，作为参照区域之一
IntersectionObserver.relativeToViewport 指定页面显示区域作为参照区域之一

### MediaQueryObserver

MediaQueryObserver.disconnect 停止监听
MediaQueryObserver.observe 开始监听页面 media query 变化情况

### NodesRef

NodesRef.boundingClientRect 添加节点的布局位置的查询请求
NodesRef.context 添加节点的 Context 对象查询请求
NodesRef.fields 获取节点的相关信息
NodesRef.node 获取 Node 节点实例
NodesRef.scrollOffset 添加节点的滚动位置查询请求

### SelectorQuery

SelectorQuery.exec 执行所有的请求
SelectorQuery.in 将选择器的选取范围更改为自定义组件 component 内
SelectorQuery.select 在当前页面下选择第一个匹配选择器 selector 的节点
SelectorQuery.selectAll 在当前页面下选择匹配选择器 selector 的所有节点
SelectorQuery.selectViewport 选择显示区域

## 第三方平台

Taro.getExtConfigSync Taro.getExtConfig 的同步版本
Taro.getExtConfig 获取第三方平台自定义的数据字段

## 广告

Taro.createRewardedVideoAd 创建激励视频广告组件
Taro.createInterstitialAd 创建插屏广告组件

### InterstitialAd

InterstitialAd.destroy 销毁插屏广告实例
InterstitialAd.load 加载插屏广告
InterstitialAd.offClose 取消监听插屏广告关闭事件
InterstitialAd.offError 取消监听插屏错误事件
InterstitialAd.offLoad 取消监听插屏广告加载事件
InterstitialAd.onClose 监听插屏广告关闭事件
InterstitialAd.onError 监听插屏错误事件
InterstitialAd.onLoad 监听插屏广告加载事件
InterstitialAd.show 显示插屏广告

### RewardedVideoAd

RewardedVideoAd.destroy 销毁激励视频广告实例
RewardedVideoAd.load 加载激励视频广告
RewardedVideoAd.offClose 取消监听用户点击 关闭广告 按钮的事件
RewardedVideoAd.offError 取消监听激励视频错误事件
RewardedVideoAd.offLoad 取消监听激励视频广告加载事件
RewardedVideoAd.onClose 监听用户点击 关闭广告 按钮的事件
RewardedVideoAd.onError 监听激励视频错误事件
RewardedVideoAd.onLoad 监听激励视频广告加载事件
RewardedVideoAd.show 显示激励视频广告
