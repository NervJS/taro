---
title: Taro.createLivePlayerContext(id, component)
sidebar_label: createLivePlayerContext
---

创建 [live-player](https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html) 上下文 [LivePlayerContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.html) 对象。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/wx.createLivePlayerContext.html)

## 类型

```tsx
(id: string, component?: Record<string, any>) => LivePlayerContext
```

## 参数

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
      <td>id</td>
      <td><code>string</code></td>
      <td><a href="https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html">live-player</a> 组件的 id</td>
    </tr>
    <tr>
      <td>component</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>在自定义组件下，当前组件实例的this，以操作组件内 <a href="https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html">live-player</a> 组件</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createLivePlayerContext | ✔️ |  |  |
