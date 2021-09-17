---
title: EventChannel
sidebar_label: EventChannel
---

Inter-page event communication channel

## Methods

### emit

Trigger an event

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/route/EventChannel.emit.html)

```tsx
(eventName: string, ...args: any) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>eventName</td>
      <td><code>string</code></td>
      <td>event name</td>
    </tr>
    <tr>
      <td>args</td>
      <td><code>any</code></td>
      <td>event arguments</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EventChannel.emit | ✔️ |  | ✔️ |

### off

Cancels listening to an event. If the second parameter is passed, only the specified listener is cancelled, otherwise all listener functions are cancelled.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/route/EventChannel.off.html)

```tsx
(eventName: string, fn: EventCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>eventName</td>
      <td><code>string</code></td>
      <td>event name</td>
    </tr>
    <tr>
      <td>fn</td>
      <td><code>EventCallback</code></td>
      <td>event handler</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EventChannel.off | ✔️ |  |  |

### on

Register a listener event

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/route/EventChannel.on.html)

```tsx
(eventName: string, fn: EventCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>eventName</td>
      <td><code>string</code></td>
      <td>event name</td>
    </tr>
    <tr>
      <td>fn</td>
      <td><code>EventCallback</code></td>
      <td>event handler</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EventChannel.on | ✔️ |  |  |

### once

Register a listener event that expires after being triggered once.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/route/EventChannel.once.html)

```tsx
(eventName: string, fn: EventCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>eventName</td>
      <td><code>string</code></td>
      <td>event name</td>
    </tr>
    <tr>
      <td>fn</td>
      <td><code>EventCallback</code></td>
      <td>event handler</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EventChannel.once | ✔️ |  |  |

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EventChannel.emit | ✔️ |  |  |
| EventChannel.off | ✔️ |  |  |
| EventChannel.on | ✔️ |  |  |
| EventChannel.once | ✔️ |  |  |
