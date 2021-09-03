---
title: LogManager
sidebar_label: LogManager
---

The log manager instance, which can be obtained via `Taro.getLogManager`.

You can save up to 5 MB in log content. Old log content will be deleted if this threshold is exceeded. You can use `open-type="feedback"` of the button component to upload printed logs. 对于小游戏，用户可以通过使用 Taro.createFeedbackButton 来创建上传打印的日志的按钮。 开发者可以通过小程序管理后台左侧菜单“反馈管理”页面查看相关打印日志。

By default, the base library writes the App and Page lifecycle functions and function calls under the wx namespace to the log.

## How to Use

### debug

Writes the "debug" log.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/LogManager.debug.html)

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
      <td>日志内容，可以有任意多个。每次调用的参数的总大小不超过100Kb</td>
    </tr>
  </tbody>
</table>

#### API Support

|       API        | WeChat Mini-Program | H5 | React Native |
|:----------------:|:-------------------:|:--:|:------------:|
| LogManager.debug |         ✔️          |    |              |

### info

Writes the "info" log.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/LogManager.info.html)

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
      <td>日志内容，可以有任意多个。每次调用的参数的总大小不超过100Kb</td>
    </tr>
  </tbody>
</table>

#### API Support

|       API       | WeChat Mini-Program | H5 | React Native |
|:---------------:|:-------------------:|:--:|:------------:|
| LogManager.info |         ✔️          |    |              |

### log

Writes the "log" log.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/LogManager.log.html)

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
      <td>日志内容，可以有任意多个。每次调用的参数的总大小不超过100Kb</td>
    </tr>
  </tbody>
</table>

#### API Support

|      API       | WeChat Mini-Program | H5 | React Native |
|:--------------:|:-------------------:|:--:|:------------:|
| LogManager.log |         ✔️          |    |              |

### warn

Writes the "warn" log.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/LogManager.warn.html)

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
      <td>日志内容，可以有任意多个。每次调用的参数的总大小不超过100Kb</td>
    </tr>
  </tbody>
</table>

#### API Support

|       API       | WeChat Mini-Program | H5 | React Native |
|:---------------:|:-------------------:|:--:|:------------:|
| LogManager.warn |         ✔️          |    |              |

## Methods

|       API        | WeChat Mini-Program | H5 | React Native |
|:----------------:|:-------------------:|:--:|:------------:|
| LogManager.debug |         ✔️          |    |              |
| LogManager.info  |         ✔️          |    |              |
|  LogManager.log  |         ✔️          |    |              |
| LogManager.warn  |         ✔️          |    |              |
