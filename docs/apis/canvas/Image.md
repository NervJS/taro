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
| src | `string` | 图片的 URL |
| height | `number` | 图片的真实高度 |
| width | `number` | 图片的真实宽度 |
| referrerPolicy | `string` | origin: 发送完整的referrer; no-referrer: 不发送。<br /><br />格式固定为 https://servicewechat.com/{appid}/{version}/page-frame.html，其中 {appid} 为小程序的 appid，{version} 为小程序的版本号，版本号为 0 表示为开发版、体验版以及审核版本，版本号为 devtools 表示为开发者工具，其余为正式版本 |
| onerror | `(...args: any[]) => any` | 图片加载发生错误后触发的回调函数 |
| onload | `(...args: any[]) => any` | 图片加载完成后触发的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Image | ✔️ |  |  |
