---
title: VKCamera
sidebar_label: VKCamera
---

相机对象

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKCamera.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| viewMatrix | `Float32Array` | 视图矩阵 |
| intrinsics | `Float32Array` | 相机内参，只有 v2 版本支持 |

### getProjectionMatrix

获取投影矩阵

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKCamera.getProjectionMatrix.html)

```tsx
(near: number, far: number) => Float32Array
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| near | `number` | 近视点 |
| far | `number` | 远视点 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VKCamera | ✔️ |  |  |
| VKCamera.getProjectionMatrix | ✔️ |  |  |
