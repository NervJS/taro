---
title: UserInfo
sidebar_label: UserInfo
---

用户信息

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/UserInfo.html)

## 方法

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| nickName | `string` | 是 | 用户昵称 |
| avatarUrl | `string` | 是 | 用户头像图片的 URL。URL 最后一个数值代表正方形头像大小（有 0、46、64、96、132 数值可选，0 代表 640x640 的正方形头像，46 表示 46x46 的正方形头像，剩余数值以此类推。默认132），用户没有头像时该项为空。若用户更换头像，原有头像 URL 将失效。 |
| gender | `keyof Gender` | 否 | 用户性别。不再返回，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801) |
| country | `string` | 是 | 用户所在国家。不再返回，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801) |
| province | `string` | 是 | 用户所在省份。不再返回，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801) |
| city | `string` | 是 | 用户所在城市。不再返回，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801) |
| language | `keyof Language` | 是 | 显示 country，province，city 所用的语言。强制返回 “zh_CN”，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801) |

## 参数

### Language

| 参数 | 类型 |
| --- | --- |
| en | `"英文"` |
| zh_CN | `"简体中文"` |
| zh_TW | `"繁体中文"` |

### Gender

| 参数 | 类型 |
| --- | --- |
| 0 | `"未知"` |
| 1 | `"男性"` |
| 2 | `"女性"` |
