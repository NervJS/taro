---
title: Taro.addFileToFavorites(option)
sidebar_label: addFileToFavorites
---

预约视频号直播

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/favorites/wx.addFileToFavorites.html)

## 类型

```tsx
(option?: Option) => Promise<TaroGeneral.CallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 要收藏的文件地址，必须为本地路径或临时路径 |
| fileName | `string` | 否 | 自定义文件名，若留空则使用filePath中的文件名 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

### 示例 1

```tsx
// callback 写法
Taro.downloadFile({
  url: URL, // 下载url
  success (res) {
    // 下载完成后收藏
    Taro.addFileToFavorites({
      filePath: res.tempFilePath,
      success() {},
      fail: console.error,
    })
  },
  fail: console.error,
})
```

### 示例 2

```tsx
// async await 写法
const { tempFilePath } = await Taro.downloadFile({
  url: URL, // 下载url
})
// 下载完成后收藏
await Taro.addFileToFavorites({
  filePath: res.tempFilePath,
})
```
