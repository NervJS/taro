---
title: RealtimeLogManager
sidebar_label: RealtimeLogManager
---

The real-time log manager instance, which can be obtained via `Taro.getRealtimeLogManager`.

## How to Use

To help applet developers quickly troubleshoot applet vulnerabilities and locate problems, we have introduced a real-time logging feature. Starting from Foundation 2.7.1, developers can print logs through the interface provided, and the logs will be aggregated and reported to the applet backend in real time.

Developers can access the log query page on the applet side from **"Development->Operation and Maintenance Centre->Real-time Log"** in the applet management backend, or from "Applet Plug-in->Real-time Log" to view the log information printed by developers.

## Methods

### addFilterMsg

Add filter keywords.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.addFilterMsg.html)

```tsx
(msg: string) => void
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
      <td>msg</td>
      <td><code>string</code></td>
      <td>Parameter to <code>setFilterMsg</code>, used to set multiple filter keywords.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.addFilterMsg | ✔️ |  |  |

### error

Writes the "error" log.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.error.html)

```tsx
(...args: any[]) => void
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
      <td>args</td>
      <td><code>any[]</code></td>
      <td>The log can contain any number of entries, but the total size of the parameters of a single call cannot exceed 5 KB.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.error | ✔️ |  |  |

### in

Set the page where the live log page parameter is located

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.in.html)

```tsx
(pageInstance: any) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>pageInstance</td>
      <td>page instance</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.in | ✔️ |  |  |

### info

Writes the "info" log.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.info.html)

```tsx
(...args: any[]) => void
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
      <td>args</td>
      <td><code>any[]</code></td>
      <td>The log can contain any number of entries, but the total size of the parameters of a single call cannot exceed 5 KB.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.info | ✔️ |  |  |

### setFilterMsg

Set filter keywords

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.setFilterMsg.html)

```tsx
(msg: string) => void
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
      <td>msg</td>
      <td><code>string</code></td>
      <td>Filter keywords of no more than 1KB can be searched in the applet administration backend to get the corresponding logs based on the content set.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.setFilterMsg | ✔️ |  |  |

### warn

Writes the "warn" log.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.warn.html)

```tsx
(...args: any[]) => void
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
      <td>args</td>
      <td><code>any[]</code></td>
      <td>The log can contain any number of entries, but the total size of the parameters of a single call cannot exceed 5 KB.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.warn | ✔️ |  |  |

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.addFilterMsg | ✔️ |  |  |
| RealtimeLogManager.error | ✔️ |  |  |
| RealtimeLogManager.in | ✔️ |  |  |
| RealtimeLogManager.info | ✔️ |  |  |
| RealtimeLogManager.setFilterMsg | ✔️ |  |  |
| RealtimeLogManager.warn | ✔️ |  |  |
