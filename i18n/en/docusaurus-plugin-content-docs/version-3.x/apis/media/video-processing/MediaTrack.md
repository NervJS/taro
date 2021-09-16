---
title: MediaTrack
sidebar_label: MediaTrack
---

Can be returned via [MediaContainer.extractDataSource](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.extractDataSource.html).

[MediaTrack](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaTrack.html) An audio or video track that can be used to perform some operations on the track.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video-processing/MediaTrack.html)

## Methods

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Read only</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Track duration</td>
    </tr>
    <tr>
      <td>kind</td>
      <td><code>&quot;audio&quot; | &quot;video&quot;</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Track type</td>
    </tr>
    <tr>
      <td>volume</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Volume, valid under audio track</td>
    </tr>
  </tbody>
</table>

## Parameters

### kind

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>audio</td>
      <td>Audio tracks</td>
    </tr>
    <tr>
      <td>video</td>
      <td>Video tracks</td>
    </tr>
  </tbody>
</table>
