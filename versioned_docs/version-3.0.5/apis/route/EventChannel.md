---
title: EventChannel
sidebar_label: EventChannel
---

## 方法

### emit

触发一个事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/route/EventChannel.emit.html)

```tsx
(eventName: string, ...args: any) => void
```

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
      <td>eventName</td>
      <td><code>string</code></td>
      <td>事件名称</td>
    </tr>
    <tr>
      <td>args</td>
      <td><code>any</code></td>
      <td>事件参数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EventChannel.emit | ✔️ |  |  |

### off

取消监听一个事件。给出第二个参数时，只取消给出的监听函数，否则取消所有监听函数

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/route/EventChannel.off.html)

```tsx
(eventName: string, fn: EventCallback) => void
```

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
      <td>eventName</td>
      <td><code>string</code></td>
      <td>事件名称</td>
    </tr>
    <tr>
      <td>fn</td>
      <td><code>EventCallback</code></td>
      <td>事件监听函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EventChannel.off | ✔️ |  |  |

### on

持续监听一个事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/route/EventChannel.on.html)

```tsx
(eventName: string, fn: EventCallback) => void
```

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
      <td>eventName</td>
      <td><code>string</code></td>
      <td>事件名称</td>
    </tr>
    <tr>
      <td>fn</td>
      <td><code>EventCallback</code></td>
      <td>事件监听函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EventChannel.on | ✔️ |  |  |

### once

监听一个事件一次，触发后失效

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/route/EventChannel.once.html)

```tsx
(eventName: string, fn: EventCallback) => void
```

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
      <td>eventName</td>
      <td><code>string</code></td>
      <td>事件名称</td>
    </tr>
    <tr>
      <td>fn</td>
      <td><code>EventCallback</code></td>
      <td>事件监听函数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EventChannel.once | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EventChannel.emit | ✔️ |  |  |
| EventChannel.off | ✔️ |  |  |
| EventChannel.on | ✔️ |  |  |
| EventChannel.once | ✔️ |  |  |
