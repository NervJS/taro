---
title: LogManager
sidebar_label: LogManager
---

The log manager instance, which can be obtained via `Taro.getLogManager`.

## How to Use

You can save up to 5 MB in log content. Old log content will be deleted if this threshold is exceeded.
You can use `open-type="feedback"` of the button component to upload printed logs. Developers can view these logs via "Feedback Management" in the left-side menu on the Mini Program admin console.

By default, the base library writes the App and Page lifecycle functions and function calls under the wx namespace to the log.

## Methods

### debug

Writes the "debug" log.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/debug/LogManager.debug.html)

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
      <td>The log can contain any number of entries, but the total size of the parameters of a single call cannot exceed 100 KB.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LogManager.debug | ✔️ |  |  |

### info

Writes the "info" log.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/debug/LogManager.info.html)

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
      <td>The log can contain any number of entries, but the total size of the parameters of a single call cannot exceed 100 KB.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LogManager.info | ✔️ |  |  |

### log

Writes the "log" log.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/debug/LogManager.log.html)

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
      <td>The log can contain any number of entries, but the total size of the parameters of a single call cannot exceed 100 KB.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LogManager.log | ✔️ |  |  |

### warn

Writes the "warn" log.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/debug/LogManager.warn.html)

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
      <td>The log can contain any number of entries, but the total size of the parameters of a single call cannot exceed 100 KB.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LogManager.warn | ✔️ |  |  |

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LogManager.debug | ✔️ |  |  |
| LogManager.info | ✔️ |  |  |
| LogManager.log | ✔️ |  |  |
| LogManager.warn | ✔️ |  |  |
