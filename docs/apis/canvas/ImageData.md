---
title: ImageData
sidebar_label: ImageData
---

ImageData 对象

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/ImageData.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| width | `number` | 使用像素描述 ImageData 的实际宽度 |
| height | `number` | 使用像素描述 ImageData 的实际高度 |
| data | `Uint8ClampedArray` | 一维数组，包含以 RGBA 顺序的数据，数据使用 0 至 255（包含）的整数表示 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| ImageData | ✔️ |  |  |
