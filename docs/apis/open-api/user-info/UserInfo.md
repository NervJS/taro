---
title: UserInfo
sidebar_label: UserInfo
---

用户信息

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/UserInfo.html)

## 方法

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>avatarUrl</td>
      <td><code>string</code></td>
      <td>用户头像图片的 URL。URL 最后一个数值代表正方形头像大小（有 0、46、64、96、132 数值可选，0 代表 640x640 的正方形头像，46 表示 46x46 的正方形头像，剩余数值以此类推。默认132），用户没有头像时该项为空。若用户更换头像，原有头像 URL 将失效。</td>
    </tr>
    <tr>
      <td>city</td>
      <td><code>string</code></td>
      <td>用户所在城市</td>
    </tr>
    <tr>
      <td>country</td>
      <td><code>string</code></td>
      <td>用户所在国家</td>
    </tr>
    <tr>
      <td>gender</td>
      <td><code>0 | 1 | 2</code></td>
      <td>用户性别</td>
    </tr>
    <tr>
      <td>language</td>
      <td><code>&quot;en&quot; | &quot;zh_CN&quot; | &quot;zh_TW&quot;</code></td>
      <td>显示 country，province，city 所用的语言</td>
    </tr>
    <tr>
      <td>nickName</td>
      <td><code>string</code></td>
      <td>用户昵称</td>
    </tr>
    <tr>
      <td>province</td>
      <td><code>string</code></td>
      <td>用户所在省份</td>
    </tr>
  </tbody>
</table>

## 参数

### language

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>en</td>
      <td><code>&quot;英文&quot;</code></td>
    </tr>
    <tr>
      <td>zh_CN</td>
      <td><code>&quot;简体中文&quot;</code></td>
    </tr>
    <tr>
      <td>zh_TW</td>
      <td><code>&quot;繁体中文&quot;</code></td>
    </tr>
  </tbody>
</table>

### gender

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td><code>&quot;未知&quot;</code></td>
    </tr>
    <tr>
      <td>1</td>
      <td><code>&quot;男性&quot;</code></td>
    </tr>
    <tr>
      <td>2</td>
      <td><code>&quot;女性&quot;</code></td>
    </tr>
  </tbody>
</table>
