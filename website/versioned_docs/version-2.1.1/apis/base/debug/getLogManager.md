---
title: Taro.getLogManager(res)
sidebar_label: getLogManager
id: version-2.1.1-getLogManager
original_id: getLogManager
---

获取日志管理器对象。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.getLogManager.html)

## 类型

```tsx
(res?: Option) => LogManager
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>level</td>
      <td><code>0 | 1</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
    </tr>
  </tbody>
</table>

### level

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>表示会把 App、Page 的生命周期函数和 wx 命名空间下的函数调用写入日志</td>
    </tr>
    <tr>
      <td>1</td>
      <td>表示不会把 App、Page 的生命周期函数和 wx 命名空间下的函数调用写入日志</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
const logger = Taro.getLogManager({level: 1})

logger.log({str: 'hello world'}, 'basic log', 100, [1, 2, 3])
logger.info({str: 'hello world'}, 'info log', 100, [1, 2, 3])
logger.debug({str: 'hello world'}, 'debug log', 100, [1, 2, 3])
logger.warn({str: 'hello world'}, 'warn log', 100, [1, 2, 3])
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getLogManager | ✔️ |  |  |
