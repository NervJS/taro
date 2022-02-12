---
title: VKAnchor
sidebar_label: VKAnchor
---

anchor 对象，只有 v2 版本支持

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKAnchor.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | `number` | 唯一标识 |
| type | `0` | 类型 |
| transform | `Float32Array` | 包含位置、旋转、放缩信息的矩阵，以列为主序 |
| size | `size` | 尺寸，只有平面 anchor 支持 |
| alignment | `number` | 方向，只有平面 anchor 支持 |

## 参数

### type

anchor 对象类型合法值

| 参数 | 说明 |
| --- | --- |
| 0 | 平面 |

### size

anchor 对象类型合法值

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| width | `number` | 宽度 |
| height | `number` | 高度 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VKAnchor | ✔️ |  |  |
