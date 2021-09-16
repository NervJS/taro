---
title: Taro.getLogManager(res)
sidebar_label: getLogManager
---

Obtains the log manager object.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/debug/wx.getLogManager.html)

## Type

```tsx
(res?: Option) => LogManager
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>level</td>
      <td><code>0 | 1</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Values: 0 (Default) or 1. The former indicates the App and Page lifecycle functions and function calls under the wx namespace are written to the log, while the latter means these items are not written.</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
const logger = Taro.getLogManager({level: 1})

logger.log({str: 'hello world'}, 'basic log', 100, [1, 2, 3])
logger.info({str: 'hello world'}, 'info log', 100, [1, 2, 3])
logger.debug({str: 'hello world'}, 'debug log', 100, [1, 2, 3])
logger.warn({str: 'hello world'}, 'warn log', 100, [1, 2, 3])
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getLogManager | ✔️ |  |  |
