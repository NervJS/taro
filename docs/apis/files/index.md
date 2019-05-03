---
title: 文件
sidebar_label: 文件
---

## Taro.saveFile(OBJECT)

使用方式同 [`wx.saveFile`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.saveFile.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.saveFile(params).then(...)
```

## Taro.getFileInfo(OBJECT)

使用方式同 [`wx.getFileInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getFileInfo.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getFileInfo(params).then(...)
```

## Taro.getSavedFileList(OBJECT)

使用方式同 [`wx.getSavedFileList`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getSavedFileList.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getSavedFileList(params).then(...)
```

## Taro.getSavedFileInfo(OBJECT)

使用方式同 [`wx.getSavedFileInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getSavedFileInfo.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getSavedFileInfo(params).then(...)
```

## Taro.removeSavedFile(OBJECT)

使用方式同 [`wx.removeSavedFile`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.removeSavedFile.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.removeSavedFile(params).then(...)
```

## Taro.openDocument(OBJECT)

使用方式同 [`wx.openDocument`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openDocument.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.openDocument(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.saveFile | ✔️ |  |  |
| Taro.getFileInfo | ✔️ |  |  |
| Taro.getSavedFileList | ✔️ |  |  |
| Taro.getSavedFileInfo | ✔️ |  |  |
| Taro.removeSavedFile | ✔️ |  |  |
| Taro.openDocument | ✔️ |  |  |
