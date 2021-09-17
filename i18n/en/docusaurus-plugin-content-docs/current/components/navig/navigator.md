---
title: Navigator
sidebar_label: Navigator
---

A link to a page.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/navigator.html)

## Type

```tsx
ComponentType<NavigatorProps>
```

## NavigatorProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>target</td>
      <td><code>&quot;self&quot; | &quot;miniProgram&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;self&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the target to be redirected from. It is the current Mini Program by default.</td>
    </tr>
    <tr>
      <td>url</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The redirection link in the current Mini Program.</td>
    </tr>
    <tr>
      <td>openType</td>
      <td><code>&quot;navigate&quot; | &quot;redirect&quot; | &quot;switchTab&quot; | &quot;reLaunch&quot; | &quot;navigateBack&quot; | &quot;exit&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;navigate&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The redirection method.</td>
    </tr>
    <tr>
      <td>delta</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The quantity of layers that are rolled back. It is valid when open-type is 'navigateBack'.</td>
    </tr>
    <tr>
      <td>appId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The appId of the Mini Program to be opened. It is valid when<code>target=&quot;miniProgram&quot;</code></td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The path of the page to be opened. It is valid when<code>target=&quot;miniProgram&quot;</code>. If the value is empty, the homepage is opened.</td>
    </tr>
    <tr>
      <td>extraData</td>
      <td><code>object</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The data to be passed to the target Mini Program. It is valid when <code>target=&quot;miniProgram&quot;</code>. The target Mini Program can obtain this data from <code>App.onLaunch()</code> and <code>App.onShow()</code>.</td>
    </tr>
    <tr>
      <td>version</td>
      <td><code>&quot;develop&quot; | &quot;trial&quot; | &quot;release&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The version of the Mini Program to be opened. It is valid when <code>target=&quot;miniProgram&quot;</code>.</td>
    </tr>
    <tr>
      <td>hoverClass</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;navigator-hover&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The style type of the button that is tapped. When<code>hover-class=&quot;none&quot;</code>, the tap state is not displayed.</td>
    </tr>
    <tr>
      <td>hoverStopPropagation</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to block the tapped state from the ancestor node of this node.</td>
    </tr>
    <tr>
      <td>hoverStartTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>50</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the time elapsed after tapping but before the tapped state occurs. It is measured in milliseconds.</td>
    </tr>
    <tr>
      <td>hoverStayTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>600</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the duration when the tapped state retains after stopping tapping. It is measured in milliseconds.</td>
    </tr>
    <tr>
      <td>onSuccess</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Successful redirection to the Mini Program. It is valid when <code>target=&quot;miniProgram&quot;</code>.</td>
    </tr>
    <tr>
      <td>onFail</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Failed to redirect to the Mini Program failed. It is valid when<code>target=&quot;miniProgram&quot;</code>.</td>
    </tr>
    <tr>
      <td>onComplete</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Redirection to the Mini Program completed. It is valid when<code>target=&quot;miniProgram&quot;</code>.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
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

Valid values of target

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>self</td>
      <td>Current Mini Program</td>
    </tr>
    <tr>
      <td>miniProgram</td>
      <td>Other Mini Programs</td>
    </tr>
  </tbody>
</table>

### openType

Valid values of open-type

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>navigate</td>
      <td>The feature corresponding to Taro.navigateTo or Taro.navigateToMiniProgram</td>
    </tr>
    <tr>
      <td>redirect</td>
      <td>The feature corresponding to Taro.redirectTo</td>
    </tr>
    <tr>
      <td>switchTab</td>
      <td>The feature corresponding to Taro.switchTab</td>
    </tr>
    <tr>
      <td>reLaunch</td>
      <td>The feature corresponding to Taro.reLaunch</td>
    </tr>
    <tr>
      <td>navigateBack</td>
      <td>The feature corresponding to Taro.navigateBack</td>
    </tr>
    <tr>
      <td>exit</td>
      <td>Exits the Mini Program. It is valid when <code>target=&quot;miniProgram&quot;</code>.</td>
    </tr>
  </tbody>
</table>

### version

Valid values of version

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>develop</td>
      <td>Developer version</td>
    </tr>
    <tr>
      <td>trial</td>
      <td>Test version</td>
    </tr>
    <tr>
      <td>release</td>
      <td>Official version. This parameter is valid only when the current Mini Program is in the developer version or the test version. If the current Mini Program is in the official version, the opened Mini Program is definitely in the official version.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Navigator | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
