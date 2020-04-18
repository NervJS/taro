---
title: Navigator
sidebar_label: Navigator
---

页面链接

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html)

## 类型

```tsx
ComponentType<NavigatorProps>
```

## NavigatorProps

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
      <td>target</td>
      <td><code>&quot;self&quot; | &quot;miniProgram&quot;</code></td>
      <td style="text-align:center"><code>&quot;self&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>在哪个目标上发生跳转，默认当前小程序</td>
    </tr>
    <tr>
      <td>url</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当前小程序内的跳转链接</td>
    </tr>
    <tr>
      <td>openType</td>
      <td><code>&quot;navigate&quot; | &quot;redirect&quot; | &quot;switchTab&quot; | &quot;reLaunch&quot; | &quot;navigateBack&quot; | &quot;exit&quot;</code></td>
      <td style="text-align:center"><code>&quot;navigate&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>跳转方式</td>
    </tr>
    <tr>
      <td>delta</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当 open-type 为 'navigateBack' 时有效，表示回退的层数</td>
    </tr>
    <tr>
      <td>appId</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当 <code>target=&quot;miniProgram&quot;</code> 时有效，要打开的小程序 appId</td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当 <code>target=&quot;miniProgram&quot;</code> 时有效，打开的页面路径，如果为空则打开首页</td>
    </tr>
    <tr>
      <td>extraData</td>
      <td><code>object</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当 <code>target=&quot;miniProgram&quot;</code> 时有效，需要传递给目标小程序的数据，目标小程序可在 <code>App.onLaunch()</code>，<code>App.onShow()</code> 中获取到这份数据.</td>
    </tr>
    <tr>
      <td>version</td>
      <td><code>&quot;develop&quot; | &quot;trial&quot; | &quot;release&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当 <code>target=&quot;miniProgram&quot;</code> 时有效，要打开的小程序版本</td>
    </tr>
    <tr>
      <td>hoverClass</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;navigator-hover&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>指定按下去的样式类。当 <code>hover-class=&quot;none&quot;</code> 时，没有点击态效果</td>
    </tr>
    <tr>
      <td>hoverStopPropagation</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>指定是否阻止本节点的祖先节点出现点击态</td>
    </tr>
    <tr>
      <td>hoverStartTime</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>50</code></td>
      <td style="text-align:center">否</td>
      <td>按住后多久出现点击态，单位毫秒</td>
    </tr>
    <tr>
      <td>hoverStayTime</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>600</code></td>
      <td style="text-align:center">否</td>
      <td>手指松开后点击态保留时间，单位毫秒</td>
    </tr>
    <tr>
      <td>onSuccess</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当 <code>target=&quot;miniProgram&quot;</code> 时有效，跳转小程序成功</td>
    </tr>
    <tr>
      <td>onFail</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当 <code>target=&quot;miniProgram&quot;</code> 时有效，跳转小程序失败</td>
    </tr>
    <tr>
      <td>onComplete</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当 <code>target=&quot;miniProgram&quot;</code> 时有效，跳转小程序完成</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| NavigatorProps.target | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.url | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| NavigatorProps.openType | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| NavigatorProps.delta | ✔️ | ✔️ |  | ✔️ |  |  |
| NavigatorProps.appId | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.path | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.extraData | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.version | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.hoverClass | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| NavigatorProps.hoverStopPropagation | ✔️ | ✔️ |  | ✔️ |  |  |
| NavigatorProps.hoverStartTime | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| NavigatorProps.hoverStayTime | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| NavigatorProps.onSuccess | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.onFail | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.onComplete | ✔️ | ✔️ |  |  |  |  |

### target

target 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>self</td>
      <td>当前小程序</td>
    </tr>
    <tr>
      <td>miniProgram</td>
      <td>其它小程序</td>
    </tr>
  </tbody>
</table>

### openType

open-type 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>navigate</td>
      <td>对应 Taro.navigateTo 或 Taro.navigateToMiniProgram 的功能</td>
    </tr>
    <tr>
      <td>redirect</td>
      <td>对应 Taro.redirectTo 的功能</td>
    </tr>
    <tr>
      <td>switchTab</td>
      <td>对应 Taro.switchTab 的功能</td>
    </tr>
    <tr>
      <td>reLaunch</td>
      <td>对应 Taro.reLaunch 的功能</td>
    </tr>
    <tr>
      <td>navigateBack</td>
      <td>对应 Taro.navigateBack 的功能</td>
    </tr>
    <tr>
      <td>exit</td>
      <td>退出小程序，<code>target=&quot;miniProgram&quot;</code> 时生效</td>
    </tr>
  </tbody>
</table>

### version

version 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>develop</td>
      <td>开发版</td>
    </tr>
    <tr>
      <td>trial</td>
      <td>体验版</td>
    </tr>
    <tr>
      <td>release</td>
      <td>正式版，仅在当前小程序为开发版或体验版时此参数有效；如果当前小程序是正式版，则打开的小程序必定是正式版。</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Navigator | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
