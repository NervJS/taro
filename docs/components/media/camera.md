---
title: Camera
sidebar_label: Camera
---

系统相机

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html)

## 类型

```tsx
ComponentType<CameraProps>
```

## CameraProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>mode</td>
      <td><code>&quot;normal&quot; | &quot;scanCode&quot;</code></td>
      <td style="text-align:center"><code>&quot;normal&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>模式，有效值为normal, scanCode</td>
    </tr>
    <tr>
      <td>resolution</td>
      <td><code>&quot;low&quot; | &quot;medium&quot; | &quot;high&quot;</code></td>
      <td style="text-align:center"><code>&quot;medium&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>分辨率，不支持动态修改</td>
    </tr>
    <tr>
      <td>devicePosition</td>
      <td><code>&quot;front&quot; | &quot;back&quot;</code></td>
      <td style="text-align:center"><code>&quot;back&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>摄像头朝向</td>
    </tr>
    <tr>
      <td>flash</td>
      <td><code>&quot;auto&quot; | &quot;on&quot; | &quot;off&quot; | &quot;torch&quot;</code></td>
      <td style="text-align:center"><code>&quot;auto&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>闪光灯</td>
    </tr>
    <tr>
      <td>frameSize</td>
      <td><code>&quot;medium&quot; | &quot;small&quot; | &quot;large&quot;</code></td>
      <td style="text-align:center"><code>&quot;medium&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>指定期望的相机帧数据尺寸</td>
    </tr>
    <tr>
      <td>scanArea</td>
      <td><code>number[]</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>扫码识别区域，格式为[x, y, w, h]，<br />x,y是相对于camera显示区域的左上角，<br />w,h为区域宽度，单位px，仅在 mode=&quot;scanCode&quot; 时生效</td>
    </tr>
    <tr>
      <td>onStop</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>摄像头在非正常终止时触发，<br />如退出后台等情况</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>用户不允许使用摄像头时触发</td>
    </tr>
    <tr>
      <td>onInitDone</td>
      <td><code>BaseEventOrigFunction&lt;onInitDoneEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>相机初始化完成时触发</td>
    </tr>
    <tr>
      <td>onScanCode</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>在成功识别到一维码时触发，<br />仅在 mode=&quot;scanCode&quot; 时生效</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraProps.mode | ✔️ |  |  |
| CameraProps.resolution | ✔️ |  |  |
| CameraProps.devicePosition | ✔️ |  |  |
| CameraProps.flash | ✔️ |  |  |
| CameraProps.frameSize | ✔️ |  |  |
| CameraProps.scanArea | ✔️ |  |  |
| CameraProps.onStop | ✔️ |  |  |
| CameraProps.onError | ✔️ |  |  |
| CameraProps.onInitDone | ✔️ |  |  |
| CameraProps.onScanCode | ✔️ |  |  |

### mode

mode 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>normal</td>
      <td>相机模式</td>
    </tr>
    <tr>
      <td>scanCode</td>
      <td>扫码模式</td>
    </tr>
  </tbody>
</table>

### resolution

resolution 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>low</td>
      <td>低</td>
    </tr>
    <tr>
      <td>medium</td>
      <td>中</td>
    </tr>
    <tr>
      <td>high</td>
      <td>高</td>
    </tr>
  </tbody>
</table>

### devicePosition

device-position 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>front</td>
      <td>前置</td>
    </tr>
    <tr>
      <td>back</td>
      <td>后置</td>
    </tr>
  </tbody>
</table>

### flash

flash 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>auto</td>
      <td>自动</td>
    </tr>
    <tr>
      <td>on</td>
      <td>打开</td>
    </tr>
    <tr>
      <td>off</td>
      <td>关闭</td>
    </tr>
    <tr>
      <td>torch</td>
      <td>常亮</td>
    </tr>
  </tbody>
</table>

### frameSize

frame-size 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>small</td>
      <td>小尺寸帧数据</td>
    </tr>
    <tr>
      <td>medium</td>
      <td>中尺寸帧数据</td>
    </tr>
    <tr>
      <td>large</td>
      <td>大尺寸帧数据</td>
    </tr>
  </tbody>
</table>

### onInitDoneEventDetail

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
      <td>maxZoom</td>
      <td><code>number</code></td>
      <td>最大变焦</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Camera | ✔️ |  |  |
