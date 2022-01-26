---
title: Image
sidebar_label: Image
---

图片对象

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Image.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| height | `number` | 图片的真实高度 |
| onerror | `(...args: any[]) => any` | 图片加载发生错误后触发的回调函数 |
| onload | `(...args: any[]) => any` | 图片加载完成后触发的回调函数 |
| src | `string` | 图片的 URL |
| width | `number` | 图片的真实宽度 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Image | ✔️ |  |  |
