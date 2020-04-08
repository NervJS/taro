---
title: Taro.setTabBarBadge(option)
sidebar_label: setTabBarBadge
id: version-2.1.1-setTabBarBadge
original_id: setTabBarBadge
---

为 tabBar 某一项的右上角添加文本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarBadge.html)

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
      <td>index</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>tabBar 的哪一项，从左边算起</td>
    </tr>
    <tr>
      <td>text</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>显示的文本，超过 4 个字符则显示成 ...</td>
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
Taro.setTabBarBadge({
  index: 0,
  text: '1'
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setTabBarBadge | ✔️ | ✔️ |  |
