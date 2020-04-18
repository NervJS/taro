---
title: Taro.showLoading(option)
sidebar_label: showLoading
id: version-2.1.1-showLoading
original_id: showLoading
---

显示 loading 提示框。需主动调用 Taro.hideLoading 才能关闭提示框

**注意**
- Taro.showLoading 和 Taro.showToast 同时只能显示一个
- Taro.showLoading 应与 Taro.hideLoading 配对使用

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showLoading.html)

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
      <td>title</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>提示的内容</td>
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
      <td>mask</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否显示透明蒙层，防止触摸穿透</td>
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
Taro.showLoading({
  title: '加载中',
})
setTimeout(function () {
  Taro.hideLoading()
}, 2000)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showLoading | ✔️ | ✔️ | ✔️ |
