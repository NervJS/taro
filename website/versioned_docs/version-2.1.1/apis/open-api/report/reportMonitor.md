---
title: Taro.reportMonitor(name, value)
sidebar_label: reportMonitor
id: version-2.1.1-reportMonitor
original_id: reportMonitor
---

自定义业务数据监控上报接口。

**使用说明**
使用前，需要在「小程序管理后台-运维中心-性能监控-业务数据监控」中新建监控事件，配置监控描述与告警类型。每一个监控事件对应唯一的监控ID，开发者最多可以创建128个监控事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/report/wx.reportMonitor.html)

## 类型

```tsx
(name: string, value: number) => void
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
      <td>name</td>
      <td><code>string</code></td>
      <td>监控ID，在「小程序管理后台」新建数据指标后获得</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>number</code></td>
      <td>上报数值，经处理后会在「小程序管理后台」上展示每分钟的上报总量</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.reportMonitor('1', 1)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.reportMonitor | ✔️ |  |  |
