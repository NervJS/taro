---
title: WriteResult
sidebar_label: WriteResult
---

文件写入结果。 通过 [FileSystemManager.writeSync](./FileSystemManager#writesync) 接口返回

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/WriteResult.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| bytesWritten | `number` | 实际被写入到文件中的字节数（注意，被写入的字节数不一定与被写入的字符串字符数相同） |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| WriteResult | ✔️ |  |  |
