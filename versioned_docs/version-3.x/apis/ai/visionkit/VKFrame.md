---
title: VKFrame
sidebar_label: VKFrame
---

vision kit 会话对象

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKFrame.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| timestamp | `number` | 生成时间 |
| camera | `VKCamera` | 相机对象 |

### getCameraTexture

获取当前帧纹理，目前只支持 YUV 纹理

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKFrame.getCameraTexture.html)

```tsx
(ctx: WebGLRenderingContext) => getCameraTextureResult
```

| 参数 | 类型 |
| --- | --- |
| ctx | `WebGLRenderingContext` |

### getDisplayTransform

获取纹理调整矩阵。默认获取到的纹理是未经裁剪调整的纹理，此矩阵可用于在着色器中根据帧对象尺寸对纹理进行裁剪

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKFrame.getDisplayTransform.html)

```tsx
() => Float32Array
```

## 参数

### getCameraTextureResult

帧纹理对象

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| yTexture | `WebGLTexture` | Y 分量纹理 |
| uvTexture | `WebGLTexture` | UV 分量纹理 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VKFrame | ✔️ |  |  |
| VKFrame.getCameraTexture | ✔️ |  |  |
| VKFrame.getDisplayTransform | ✔️ |  |  |
