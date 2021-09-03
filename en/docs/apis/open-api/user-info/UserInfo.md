---
title: UserInfo
sidebar_label: UserInfo
---

The user information.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/UserInfo.html)

## Methods

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>avatarUrl</td>
      <td><code>string</code></td>
      <td>The URL to the user's profile photo.URL 最后一个数值代表正方形头像大小（有 0、46、64、96、132 数值可选，0 代表 640x640 的正方形头像，46 表示 46x46 的正方形头像，剩余数值以此类推。The default value is 132.) This parameter is left blank if a user has no profile photo.If the user changes the profile photo, the URL of the original profile photo will expire.</td>
    </tr>
    <tr>
      <td>city</td>
      <td><code>string</code></td>
      <td>The user's city.</td>
    </tr>
    <tr>
      <td>country</td>
      <td><code>string</code></td>
      <td>The user's country.</td>
    </tr>
    <tr>
      <td>gender</td>
      <td><code>0 | 1 | 2</code></td>
      <td>The user's gender.</td>
    </tr>
    <tr>
      <td>language</td>
      <td><code>&quot;en&quot; | &quot;zh_CN&quot; | &quot;zh_TW&quot;</code></td>
      <td>The language used to display the country, province, and city</td>
    </tr>
    <tr>
      <td>nickName</td>
      <td><code>string</code></td>
      <td>The user's alias.</td>
    </tr>
    <tr>
      <td>province</td>
      <td><code>string</code></td>
      <td>The user's province.</td>
    </tr>
  </tbody>
</table>

## Parameters

### language

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>en</td>
      <td><code>&quot;English&quot;</code></td>
    </tr>
    <tr>
      <td>zh_CN</td>
      <td><code>&quot;Simplified Chinese&quot;</code></td>
    </tr>
    <tr>
      <td>zh_TW</td>
      <td><code>&quot;Traditional Chinese&quot;</code></td>
    </tr>
  </tbody>
</table>

### gender

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td><code>&quot;Unknown&quot;</code></td>
    </tr>
    <tr>
      <td>1</td>
      <td><code>&quot;Male&quot;</code></td>
    </tr>
    <tr>
      <td>2</td>
      <td><code>&quot;Female&quot;</code></td>
    </tr>
  </tbody>
</table>
