---
title: Taro.navigateToMiniProgram(option)
sidebar_label: navigateToMiniProgram
---

打开另一个小程序

**使用限制**
##### 需要用户触发跳转
从 2.3.0 版本开始，若用户未点击小程序页面任意位置，则开发者将无法调用此接口自动跳转至其他小程序。
##### 需要用户确认跳转
从 2.3.0 版本开始，在跳转至其他小程序前，将统一增加弹窗，询问是否跳转，用户确认后才可以跳转其他小程序。如果用户点击取消，则回调 `fail cancel`。
##### 每个小程序可跳转的其他小程序数量限制为不超过 10 个
从 2.4.0 版本以及指定日期（具体待定）开始，开发者提交新版小程序代码时，如使用了跳转其他小程序功能，则需要在代码配置中声明将要跳转的小程序名单，限定不超过 10 个，否则将无法通过审核。该名单可在发布新版时更新，不支持动态修改。配置方法详见 [小程序全局配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)。调用此接口时，所跳转的 appId 必须在配置列表中，否则回调 `fail appId "${appId}" is not in navigateToMiniProgramAppIdList`。

**关于调试**
- 在开发者工具上调用此 API 并不会真实的跳转到另外的小程序，但是开发者工具会校验本次调用跳转是否成功。[详情](https://developers.weixin.qq.com/miniprogram/dev/devtools/different.html#跳转小程序调试支持)
- 开发者工具上支持被跳转的小程序处理接收参数的调试。[详情](https://developers.weixin.qq.com/miniprogram/dev/devtools/different.html#跳转小程序调试支持)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateToMiniProgram.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
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
      <td>appId</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>要打开的小程序 appId</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>envVersion</td>
      <td><code>&quot;develop&quot; | &quot;trial&quot; | &quot;release&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。</td>
    </tr>
    <tr>
      <td>extraData</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>需要传递给目标小程序的数据，目标小程序可在 <code>App.onLaunch</code>，<code>App.onShow</code> 中获取到这份数据。如果跳转的是小游戏，可以在 <a href="#">wx.onShow</a>、<a href="https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html">wx.getLaunchOptionsSync</a> 中可以获取到这份数据数据。</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>打开的页面路径，如果为空则打开首页。path 中 ? 后面的部分会成为 query，在小程序的 <code>App.onLaunch</code>、<code>App.onShow</code> 和 <code>Page.onLoad</code> 的回调函数或小游戏的 <a href="#">wx.onShow</a> 回调函数、<a href="https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html">wx.getLaunchOptionsSync</a> 中可以获取到 query 数据。对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 &quot;?foo=bar&quot;。</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### envVersion

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
      <td>正式版</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.navigateToMiniProgram({
  appId: '',
  path: 'page/index/index?id=123',
  extraData: {
    foo: 'bar'
  },
  envVersion: 'develop',
  success: function(res) {
    // 打开成功
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.navigateToMiniProgram | ✔️ |  |  |
