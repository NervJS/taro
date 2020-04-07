---
title: Taro.getSystemInfo(res)
sidebar_label: getSystemInfo
id: version-2.1.1-getSystemInfo
original_id: getSystemInfo
---

获取系统信息，支持 `Promise` 化使用。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfo.html)

## 类型

```tsx
(res?: Option) => Promise<Result>
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### Result

注意：**H5** 端不支持 version、statusBarHeight、fontSizeSetting、SDKVersion

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SDKVersion</td>
      <td><code>string</code></td>
      <td>客户端基础库版本</td>
    </tr>
    <tr>
      <td>albumAuthorized</td>
      <td><code>boolean</code></td>
      <td>允许微信使用相册的开关（仅 iOS 有效）</td>
    </tr>
    <tr>
      <td>benchmarkLevel</td>
      <td><code>number</code></td>
      <td>设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），&gt;=1（设备性能值，该值越高，设备性能越好，目前最高不到50）</td>
    </tr>
    <tr>
      <td>bluetoothEnabled</td>
      <td><code>boolean</code></td>
      <td>蓝牙的系统开关</td>
    </tr>
    <tr>
      <td>brand</td>
      <td><code>string</code></td>
      <td>设备品牌</td>
    </tr>
    <tr>
      <td>cameraAuthorized</td>
      <td><code>boolean</code></td>
      <td>允许微信使用摄像头的开关</td>
    </tr>
    <tr>
      <td>fontSizeSetting</td>
      <td><code>number</code></td>
      <td>用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准</td>
    </tr>
    <tr>
      <td>language</td>
      <td><code>string</code></td>
      <td>微信设置的语言</td>
    </tr>
    <tr>
      <td>locationAuthorized</td>
      <td><code>boolean</code></td>
      <td>允许微信使用定位的开关</td>
    </tr>
    <tr>
      <td>locationEnabled</td>
      <td><code>boolean</code></td>
      <td>地理位置的系统开关</td>
    </tr>
    <tr>
      <td>microphoneAuthorized</td>
      <td><code>boolean</code></td>
      <td>允许微信使用麦克风的开关</td>
    </tr>
    <tr>
      <td>model</td>
      <td><code>string</code></td>
      <td>设备型号</td>
    </tr>
    <tr>
      <td>notificationAlertAuthorized</td>
      <td><code>boolean</code></td>
      <td>允许微信通知带有提醒的开关（仅 iOS 有效）</td>
    </tr>
    <tr>
      <td>notificationAuthorized</td>
      <td><code>boolean</code></td>
      <td>允许微信通知的开关</td>
    </tr>
    <tr>
      <td>notificationBadgeAuthorized</td>
      <td><code>boolean</code></td>
      <td>允许微信通知带有标记的开关（仅 iOS 有效）</td>
    </tr>
    <tr>
      <td>notificationSoundAuthorized</td>
      <td><code>boolean</code></td>
      <td>允许微信通知带有声音的开关（仅 iOS 有效）</td>
    </tr>
    <tr>
      <td>pixelRatio</td>
      <td><code>number</code></td>
      <td>设备像素比</td>
    </tr>
    <tr>
      <td>platform</td>
      <td><code>string</code></td>
      <td>客户端平台</td>
    </tr>
    <tr>
      <td>safeArea</td>
      <td><code>SafeAreaResult</code></td>
      <td>在竖屏正方向下的安全区域</td>
    </tr>
    <tr>
      <td>screenHeight</td>
      <td><code>number</code></td>
      <td>屏幕高度，单位px</td>
    </tr>
    <tr>
      <td>screenWidth</td>
      <td><code>number</code></td>
      <td>屏幕宽度，单位px</td>
    </tr>
    <tr>
      <td>statusBarHeight</td>
      <td><code>number</code></td>
      <td>状态栏的高度，单位px</td>
    </tr>
    <tr>
      <td>system</td>
      <td><code>string</code></td>
      <td>操作系统及版本</td>
    </tr>
    <tr>
      <td>version</td>
      <td><code>string</code></td>
      <td>微信版本号</td>
    </tr>
    <tr>
      <td>wifiEnabled</td>
      <td><code>boolean</code></td>
      <td>Wi-Fi 的系统开关</td>
    </tr>
    <tr>
      <td>windowHeight</td>
      <td><code>number</code></td>
      <td>可使用窗口高度，单位px</td>
    </tr>
    <tr>
      <td>windowWidth</td>
      <td><code>number</code></td>
      <td>可使用窗口宽度，单位px</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

## 示例代码

### 示例 1

```tsx
Taro.getSystemInfo({
  success: res => console.log(res)
})
.then(res => console.log(res))
```

### 示例 2

```tsx
Taro.getSystemInfo({
  success: function (res) {
    console.log(res.model)
    console.log(res.pixelRatio)
    console.log(res.windowWidth)
    console.log(res.windowHeight)
    console.log(res.language)
    console.log(res.version)
    console.log(res.platform)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getSystemInfo | ✔️ | ✔️ | ✔️ |
