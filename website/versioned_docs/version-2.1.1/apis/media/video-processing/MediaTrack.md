---
title: MediaTrack
sidebar_label: MediaTrack
id: version-2.1.1-MediaTrack
original_id: MediaTrack
---

可通过 [MediaContainer.extractDataSource](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.extractDataSource.html) 返回。
[MediaTrack](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaTrack.html) 音频或视频轨道，可以对轨道进行一些操作

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaTrack.html)

## 方法

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">只读</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>轨道长度</td>
    </tr>
    <tr>
      <td>kind</td>
      <td><code>&quot;audio&quot; | &quot;video&quot;</code></td>
      <td style="text-align:center">是</td>
      <td>轨道类型</td>
    </tr>
    <tr>
      <td>volume</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>音量，音频轨道下有效，可写</td>
    </tr>
  </tbody>
</table>

## 参数

### kind

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>audio</td>
      <td>音频轨道</td>
    </tr>
    <tr>
      <td>video</td>
      <td>视频轨道</td>
    </tr>
  </tbody>
</table>
