---
title: Taro.faceDetect(option)
sidebar_label: faceDetect
---

人脸识别，使用前需要通过 Taro.initFaceDetect 进行一次初始化，推荐使用相机接口返回的帧数据

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/face/wx.faceDetect.html)

## 类型

```tsx
(option: Option) => Promise<TaroGeneral.CallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| frameBuffer | `ArrayBuffer` |  | 是 | 图像像素点数据，每四项表示一个像素点的 RGBA |
| width | `number` |  | 是 | 图像宽度 |
| height | `number` |  | 是 | 图像高度 |
| enablePoint | `boolean` | `false` | 否 | 是否返回当前图像的人脸（106 个点） |
| enableConf | `boolean` | `false` | 否 | 是否返回当前图像的人脸的置信度（可表示器官遮挡情况） |
| enableAngle | `boolean` | `false` | 否 | 是否返回当前图像的人脸角度信息 |
| enableMultiFace | `boolean` | `false` | 否 | 是否返回多张人脸的信息 |
| complete | `(res: TaroGeneral.CallbackResult) => void` |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` |  | 否 | 接口调用失败的回调函数 |
| success | `(res: SuccessCallbackOption) => void` |  | 否 | 接口调用成功的回调函数 |

### SuccessCallbackOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| faceInfo | `face` | 否 | 多人模式（enableMultiFace）下的人脸信息，每个对象包含上述其它属性 |

### face

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| detectRect | `detectRect` | 脸部正方框数值，对象包含 height, weight, originX, originY 四个属性 |
| x | `number` | 脸部中心点横坐标，检测不到人脸则为 -1 |
| y | `number` | 脸部中心点纵坐标，检测不到人脸则为 -1 |
| pointArray | `point[]` | 人脸 106 个点位置数组，数组每个对象包含 x 和 y |
| confArray | `conf[]` | 人脸置信度，取值范围 [0, 1]，数值越大置信度越高（遮挡越少） |
| angleArray | `angle[]` | 人脸角度信息，取值范围 [-1, 1]，数值越接近 0 表示越正对摄像头 |

### detectRect

脸部正方框数值

| 参数 | 类型 |
| --- | --- |
| height | `number` |
| weight | `number` |
| originX | `number` |
| originY | `number` |

### point

| 参数 | 类型 |
| --- | --- |
| x | `number` |
| y | `number` |

### conf

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| global | `number` | 整体可信度 |
| leftEye | `number` | 左眼可信度 |
| rightEye | `number` | 右眼可信度 |
| mouth | `number` | 嘴巴可信度 |
| nose | `number` | 鼻子可信度 |

### angle

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| pitch | `number` | 仰俯角（点头） |
| yaw | `number` | 偏航角（摇头） |
| roll | `number` | 翻滚角（左右倾） |
