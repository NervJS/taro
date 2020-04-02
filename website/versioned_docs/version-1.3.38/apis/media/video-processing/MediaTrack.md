---
title: MediaTrack
sidebar_label: MediaTrack
id: version-1.3.38-MediaTrack
original_id: MediaTrack
---

可通过 [MediaContainer.extractDataSource](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.extractDataSource.html) 返回。
[MediaTrack](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaTrack.html) 音频或视频轨道，可以对轨道进行一些操作

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaTrack.html)

## 方法

| 参数 | 类型 | 只读 | 说明 |
| --- | --- | :---: | --- |
| duration | `number` | 是 | 轨道长度 |
| kind | "audio" or "video" | 是 | 轨道类型 |
| volume | `number` | 否 | 音量，音频轨道下有效，可写 |

## 参数

### kind

| 参数 | 说明 |
| --- | --- |
| audio | 音频轨道 |
| video | 视频轨道 |
