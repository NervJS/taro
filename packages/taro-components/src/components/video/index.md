## API

| 是否支持 | 属性           | 类型        | 默认值 | 说明                                                         |
| -------- | -------------- | ----------- | ------ | ------------------------------------------------------------ |
|    | autoPauseIfNavigate | boolean | true |当跳转到其它小程序页面时，是否自动暂停本页面的视频
|    | autoPauseIfOpenNative | boolean | true |当跳转到其它微信原生页面时，是否自动暂停本页面的视频
|    | direction | number |  |设置全屏时视频的方向，不指定则根据宽高比自动判断
|    | title | string |  |视频的标题，全屏时在顶部展示
| √ | autoplay | boolean | false |是否自动播放
| √ | controls | boolean | true |是否显示默认播放控件（播放/暂停按钮、播放进度、时间）
| √ | danmuBtn | boolean | false |是否显示弹幕按钮，只在初始化时有效，不能动态变更
| √ | danmuList | Array.<Danmu> | [] |弹幕列表
| √ | duration | number |  |指定视频时长
| √ | enableDanmu | boolean | false |是否展示弹幕，只在初始化时有效，不能动态变更
| √ | enablePlayGesture | boolean | false |是否开启播放手势，即双击切换播放/暂停
| √ | enableProgressGesture | boolean | true |是否开启控制进度的手势
| √ | initialTime | number | 0 |指定视频初始播放位置
| √ | loop | boolean | false |是否循环播放
| √ | muted | boolean | false |是否静音播放
| √ | objectFit | string | contain |当视频大小与 video 容器大小不一致时，视频的表现形式
| √ | onEnded | Function |  |当播放到末尾时触发 ended 事件
| √ | onError | Function |  |视频播放出错时触发
| √ | onFullscreenChange | Function |  |视频进入和退出全屏时触发，event.detail = {fullScreen, direction}，direction 有效值为 vertical 或 horizontal
| √ | onPause | Function |  |当暂停播放时触发 pause 事件
| √ | onPlay | Function |  |当开始/继续播放时触发play事件
| √ | onProgress | Function |  |加载进度变化时触发，只支持一段加载。event.detail = {buffered}，百分比
| √ | onTimeUpdate | Function |  |播放进度变化时触发，event.detail = {currentTime, duration}。触发频率 250ms 一次
| √ | onWaiting | Function |  |视频出现缓冲时触发
| √ | playBtnPosition | string | bottom |播放按钮的位置
| √ | poster  | string |  |视频封面的图片网络资源地址。若 controls 属性值为 false 则设置 poster 无效
| √ | showCenterPlayBtn | boolean | true |是否显示视频中间的播放按钮
| √ | showFullscreenBtn | boolean | true |是否显示全屏按钮
| √ | showMuteBtn | boolean | false |是否显示静音按钮
| √ | showPlayBtn | boolean | true |是否显示视频底部控制栏的播放按钮
| √ | showProgress | boolean | true |若不设置，宽度大于240时才会显示
| √ | src | string |  |要播放视频的资源地址
| √ | vslideGesture | boolean | false |在非全屏模式下，是否开启亮度与音量调节手势（同 pageGesture）
| √ | vslideGestureInFullscreen | boolean | true |在全屏模式下，是否开启亮度与音量调节手势
