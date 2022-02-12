---
title: MediaTrack
sidebar_label: MediaTrack
---

可通过 [MediaContainer.extractDataSource](/docs/apis/media/video-processing/MediaContainer#extractdatasource) 返回。
[MediaTrack](/docs/apis/media/video-processing/MediaTrack) 音频或视频轨道，可以对轨道进行一些操作

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaTrack.html)

## 方法

| 参数 | 类型 | 只读 | 说明 |
| --- | --- | :---: | --- |
| kind | `keyof Kind` | 是 | 轨道类型 |
| duration | `number` | 是 | 轨道长度 |
| volume | `number` | 否 | 音量，音频轨道下有效，可写 |

## 参数

### Kind

| 参数 | 说明 |
| --- | --- |
| audio | 音频轨道 |
| video | 视频轨道 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MediaTrack | ✔️ |  |  |
