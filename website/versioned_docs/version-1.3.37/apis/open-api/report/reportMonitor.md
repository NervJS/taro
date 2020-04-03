---
title: Taro.reportMonitor(name, value)
sidebar_label: reportMonitor
id: version-1.3.37-reportMonitor
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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | `string` | 监控ID，在「小程序管理后台」新建数据指标后获得 |
| value | `number` | 上报数值，经处理后会在「小程序管理后台」上展示每分钟的上报总量 |

## 示例代码

```tsx
Taro.reportMonitor('1', 1)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.reportMonitor | ✔️ |  |  |
