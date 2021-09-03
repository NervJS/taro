---
title: Taro.navigateToMiniProgram(option)
sidebar_label: navigateToMiniProgram
---

Opens another Mini Program.

**Use Limits**
##### Redirection needs to be triggered by user
As of the base library 2.3.0, if a user does not tap any location on the Mini Program page, this API cannot be called to automatically redirect to another Mini Program.
##### User confirmation is required before redirection
从 2.3.0 版本开始，在跳转至其他小程序前，将统一增加弹窗，询问是否跳转，用户确认后才可以跳转其他小程序。If the user taps **Cancel**, `fail cancel` is called back.
##### Each Mini Program can be redirected to a maximum of 10 Mini Programs.
As of the base library 2.4.0 and the specific date (to be determined), if the feature of redirection to another Mini Program is used in a new version of Mini Program code, the developer needs to declare a list of to-be-redirected-to Mini Programs in the code configurations. The quantity of to-be-redirected-to Mini Programs must be not more than 10.The list can be updated when a new version is released, and cannot be dynamically modified.For a specific configuration method, see [Global Configuration of Mini Program](https://developers.weixin.qq.com/miniprogram/en/dev/reference/configuration/app.html).Before calling this API, ensure that the appId of the Mini Program to be redirected to is in the configuration list. Otherwise, the following result is returned after callback: `fail appId "${appId}" is not in navigateToMiniProgramAppIdList`.

**About Debugging**
- On WeChat DevTools, the processing of received parameters by the redirected Mini Program can be debugged.[Details](https://developers.weixin.qq.com/miniprogram/dev/devtools/different.html#Debugging-of-Redirected-Mini-Programs)
- 开发者工具上支持被跳转的小程序处理接收参数的调试。[Details](https://developers.weixin.qq.com/miniprogram/dev/devtools/different.html#Debugging-of-Redirected-Mini-Programs)

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateToMiniProgram.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>appId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The appId of the Mini Program to be opened</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>envVersion</td>
      <td><code>&quot;develop&quot; | &quot;trial&quot; | &quot;release&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The version of the Mini Program to be opened.This parameter is valid only when the current Mini Program is in the developer version or the test version.If the current Mini Program is in the official version, the opened Mini Program is definitely in the official version.</td>
    </tr>
    <tr>
      <td>extraData</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The data that needs to be passed to the target Mini Program. The target Mini Program can obtain this data from <code>App.onLaunch</code> and <code>App.onShow</code>.If the user is redirected to a Mini Game, this data can be obtained from <a href="#">wx.onShow</a> and <a href="https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html">wx.getLaunchOptionsSync</a>.</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The path of the page to be opened. If it is empty, the homepage is opened.Content following the question mark (?) in the path becomes a query. The query data can be obtained from the callbacks for App.onLaunch, <code>App.onShow</code>, and <code>Page.onLoad</code> of the Mini Program, the callback for <a href="#">wx.onShow</a> of the Mini Game, and <a href="https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html">wx.getLaunchOptionsSync</a>.For Mini Games, you can pass in only the query part, for example, <strong>?foo=bar</strong>.</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### envVersion

<table>
  <thead>
    <tr>
      <th>Property</th>
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
      <td>Official version</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.navigateToMiniProgram({
  appId: '',
  path: 'page/index/index?id=123',
  extraData: {
    foo: 'bar'
  },
  envVersion: 'develop',
  success: function(res) {
    // Opened successfully
  }
})
```

## API Support

|            API             | WeChat Mini-Program | H5 | React Native |
|:--------------------------:|:-------------------:|:--:|:------------:|
| Taro.navigateToMiniProgram |         ✔️          |    |              |
