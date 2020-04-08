---
title: Taro.redirectTo(option)
sidebar_label: redirectTo
id: version-2.1.1-redirectTo
original_id: redirectTo
---

关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.redirectTo.html)

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
      <td>url</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>需要跳转的应用内非 tabBar 的页面的路径, 路径后可以带参数。参数与路径之间使用 <code>?</code> 分隔，参数键与参数值用 <code>=</code> 相连，不同参数用 <code>&amp;</code> 分隔；如 'path?key=value&amp;key2=value2'</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
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
Taro.redirectTo({
  url: 'test?id=1'
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.redirectTo | ✔️ | ✔️ | ✔️ |
