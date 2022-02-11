---
title: ReadResult
sidebar_label: ReadResult
---

文件读取结果。 通过 [FileSystemManager.readSync](./FileSystemManager#readsync) 接口返回

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/ReadResult.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| bytesRead | `number` | 实际读取的字节数 |
| arrayBuffer | `ArrayBuffer` | 被写入的缓存区的对象，即接口入参的 arrayBuffer |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| ReadResult | ✔️ |  |  |
