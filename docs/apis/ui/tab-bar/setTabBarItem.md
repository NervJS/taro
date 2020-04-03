---
title: Taro.setTabBarItem(option)
sidebar_label: setTabBarItem
---

动态设置 tabBar 某一项的内容，`2.7.0` 起图片支持临时文件和网络文件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarItem.html)

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
      <td>iconPath</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效</td>
    </tr>
    <tr>
      <td>selectedIconPath</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>text</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>tab 上的按钮文字</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.setTabBarItem({
  index: 0,
  text: 'text',
  iconPath: '/path/to/iconPath',
  selectedIconPath: '/path/to/selectedIconPath'
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setTabBarItem | ✔️ | ✔️ | ✔️ |
