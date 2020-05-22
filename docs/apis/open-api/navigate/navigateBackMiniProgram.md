---
title: Taro.navigateBackMiniProgram(option)
sidebar_label: navigateBackMiniProgram
---

返回到上一个小程序。只有在当前小程序是被其他小程序打开时可以调用成功

注意：**微信客户端 iOS 6.5.9，Android 6.5.10 及以上版本支持**

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateBackMiniProgram.html)

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
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>extraData</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>需要返回给上一个小程序的数据，上一个小程序可在 <code>App.onShow</code> 中获取到这份数据。 <a href="https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html">详情</a>。</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.navigateBackMiniProgram({
  extraData: {
    foo: 'bar'
  },
  success: function (res) {
    // 返回成功
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.navigateBackMiniProgram | ✔️ |  |  |
