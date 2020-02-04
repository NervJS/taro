---
title: MapContext
sidebar_label: MapContext
---

`MapContext` 实例，可通过 Taro.createMapContext 获取。
`MapContext` 通过 id 跟一个 map 组件绑定，操作对应的 map 组件。

## 方法

### getCenterLocation

获取当前地图中心的经纬度。返回的是 gcj02 坐标系，可以用于 [wx.openLocation()](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getCenterLocation.html)

```tsx
(option?: GetCenterLocationOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `GetCenterLocationOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.getCenterLocation | ✔️ |  |  |

### getRegion

获取当前地图的视野范围

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getRegion.html)

```tsx
(option?: GetRegionOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `GetRegionOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.getRegion | ✔️ |  |  |

### getRotate

获取当前地图的旋转角

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getRotate.html)

```tsx
(option?: GetRotateOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `GetRotateOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.getRotate | ✔️ |  |  |

### getScale

获取当前地图的缩放级别

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getScale.html)

```tsx
(option?: GetScaleOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `GetScaleOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.getScale | ✔️ |  |  |

### getSkew

获取当前地图的倾斜角

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getSkew.html)

```tsx
(option?: GetSkewOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `GetSkewOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.getSkew | ✔️ |  |  |

### includePoints

缩放视野展示所有经纬度

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.includePoints.html)

```tsx
(option: IncludePointsOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `IncludePointsOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.includePoints | ✔️ |  |  |

### moveToLocation

将地图中心移置当前定位点，此时需设置地图组件 show-location 为true。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.moveToLocation.html)

```tsx
(option: MoveToLocationOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `MoveToLocationOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.moveToLocation | ✔️ |  |  |

### translateMarker

平移marker，带动画

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.translateMarker.html)

```tsx
(option: TranslateMarkerOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `TranslateMarkerOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.translateMarker | ✔️ |  |  |

## 参数

### GetCenterLocationOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `GetCenterLocationSuccessCallback` | 否 | 接口调用成功的回调函数 |

### GetCenterLocationSuccessCallback

接口调用成功的回调函数

```tsx
(result: GetCenterLocationSuccessCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `GetCenterLocationSuccessCallbackResult` |

### GetCenterLocationSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| latitude | `number` | 纬度 |
| longitude | `number` | 经度 |
| errMsg | `string` | 调用结果 |

### GetRegionOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `GetRegionSuccessCallback` | 否 | 接口调用成功的回调函数 |

### GetRegionSuccessCallback

接口调用成功的回调函数

```tsx
(result: GetRegionSuccessCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `GetRegionSuccessCallbackResult` |

### GetRegionSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| northeast | `number` | 东北角经纬度 |
| southwest | `number` | 西南角经纬度 |
| errMsg | `string` | 调用结果 |

### GetRotateOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `GetRotateSuccessCallback` | 否 | 接口调用成功的回调函数 |

### GetRotateSuccessCallback

接口调用成功的回调函数

```tsx
(result: GetRotateSuccessCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `GetRotateSuccessCallbackResult` |

### GetRotateSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| rotate | `number` | 旋转角 |
| errMsg | `string` | 调用结果 |

### GetScaleOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `GetScaleSuccessCallback` | 否 | 接口调用成功的回调函数 |

### GetScaleSuccessCallback

接口调用成功的回调函数

```tsx
(result: GetScaleSuccessCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `GetScaleSuccessCallbackResult` |

### GetScaleSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| scale | `number` | 缩放值 |
| errMsg | `string` | 调用结果 |

### GetSkewOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `GetSkewSuccessCallback` | 否 | 接口调用成功的回调函数 |

### GetSkewSuccessCallback

接口调用成功的回调函数

```tsx
(result: GetSkewSuccessCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `GetSkewSuccessCallbackResult` |

### GetSkewSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| skew | `number` | 倾斜角 |
| errMsg | `string` | 调用结果 |

### IncludePointsOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| points | `MapPostion[]` | 是 | 要显示在可视区域内的坐标点列表 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| padding | `number[]` | 否 | 坐标点形成的矩形边缘到地图边缘的距离，单位像素。格式为[上,右,下,左]，安卓上只能识别数组第一项，上下左右的padding一致。开发者工具暂不支持padding参数。 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### MapPostion

要显示在可视区域内的坐标点列表

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| latitude | `number` | 纬度 |
| longitude | `number` | 经度 |

### MoveToLocationOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| latitude | `number` | 否 | 纬度 |
| longitude | `number` | 否 | 经度 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### TranslateMarkerOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| autoRotate | `boolean` | 是 | 移动过程中是否自动旋转 marker |
| destination | `DestinationOption` | 是 | 指定 marker 移动到的目标点 |
| markerId | `number` | 是 | 指定 marker |
| rotate | `number` | 是 | marker 的旋转角度 |
| animationEnd | `(...args: any[]) => any` | 否 | 动画结束回调函数 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| duration | `number` | 否 | 动画持续时长，平移与旋转分别计算 |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### DestinationOption

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| latitude | `number` | 纬度 |
| longitude | `number` | 经度 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.getCenterLocation | ✔️ |  |  |
| MapContext.getRegion | ✔️ |  |  |
| MapContext.getRotate | ✔️ |  |  |
| MapContext.getScale | ✔️ |  |  |
| MapContext.getSkew | ✔️ |  |  |
| MapContext.includePoints | ✔️ |  |  |
| MapContext.moveToLocation | ✔️ |  |  |
| MapContext.translateMarker | ✔️ |  |  |
