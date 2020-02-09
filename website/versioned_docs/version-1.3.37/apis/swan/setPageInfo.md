---
title: Taro.setPageInfo(option)
sidebar_label: setPageInfo
id: version-1.3.37-setPageInfo
original_id: setPageInfo
---

百度智能小程序可接入百度搜索和百度 App，setPageInfo 负责为小程序设置各类页面基础信息，包括标题、关键字、页面描述以及图片信息、视频信息等。开发者为智能小程序设置完备的页面基础信息，有助于智能小程序在搜索引擎和信息流中得到更加有效的展示和分发。

> [参考文档](https://smartprogram.baidu.com/docs/develop/api/open/swan-setPageInfo/)

## 类型

```tsx
(option: Option) => void
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| title | `string` | 是 | 页面标题 |
| keywords | `string` | 是 | 页面关键字 |
| description | `string` | 是 | 页面描述信息 |
| releaseDate | `string` | 否 | 原始发布时间(年-月-日 时:分:秒 带有前导零） |
| articleTitle | `string` | 否 | 文章(内容)标题(适用于当前页面是图文、视频类的展示形式，文章标题需要准确标识当前文章的主要信息点；至少6个字，不可以全英文。) |
| image | `string | string[]` | 否 | 图片线上地址，用于信息流投放后的封面显示，最多3张，单图片最大2M；封面图建议尺寸：高>=210px & 宽>=375px；最小尺寸：高>=146px & 宽>=218px。多张图时，用数组表示 |
| video | `Video` | 否 | 视频信息，多个视频时，用数组表示 |
| visit | `Visit` | 否 | 浏览信息 |
| likes | `string` | 否 | 点赞量，若页面未统计可为空 |
| comments | `string` | 否 | 评论量，若页面未统计可为空 |
| collects | `string` | 否 | 收藏量，若页面未统计可为空 |
| shares | `string` | 否 | 分享量，若页面未统计可为空 |
| followers | `string` | 否 | 关注量，若页面未统计可为空 |
| success | `() => any` | 否 | 接口调用成功的回调函数 |
| fail | `(err: any) => any` | 否 | 接口调用失败的回调函数 |
| complete | `() => any` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

### Video

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| url | `string` | 视频地址 |
| duration | `string` | 视频时长(单位为秒) |
| image | `string` | 视频封面图 |

### Visit

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| pv | `string` | 否 | 页面的浏览量(不去重用户） |
| uv | `string` | 否 | 页面的点击量（去重用户） |
| sessionDuration | `string` | 否 | 页面的用户人均停留时长，以秒为单位。 |

## 示例代码

```tsx
Taro.setPageInfo({
  title: '晒元宵节活动红包，爱奇艺60张年卡、600张季卡等你拿！-百度贴吧',
  keywords: '百度,百度贴吧,好运中国年,60,晒元,宵节',
  description: '晒元宵节活动红包，爱..昨天的百度APP元宵节活动中，共发出2亿现金红包、含151万个手气现金大奖和240辆红旗轿车，谁是好运锦鲤，快来分享！马上惊喜升级~摇中红包的锦鲤们即刻晒出红包金额截图，我们将会抽取660位好运锦鲤',
  articleTitle: '晒元宵节活动红包，爱奇艺60张年卡、600张季卡等你拿！',
  releaseDate: '2019-01-02 12:01:30',
  image: [
      'http://c.hiphotos.baidu.com/forum/w%3D480/sign=73c62dda83b1cb133e693d1bed5456da/f33725109313b07e8dee163d02d7912396dd8cfe.jpg',
      'https://hiphotos.baidu.com/fex/%70%69%63/item/43a7d933c895d143e7b745607ef082025baf07ab.jpg'
  ],
  video: [{
      url: 'https://www.baidu.com/mx/v12.mp4',
      duration: '100',
      image: 'https://smartprogram.baidu.com/docs/img/image-scaleToFill.png'
  }],
  visit: {
      pv: '1000',
      uv: '100',
      sessionDuration: '130'
  },
  likes: '75',
  comments: '13',
  collects: '23',
  shares: '8',
  followers: '35',
  success: res => {
      console.log('setPageInfo success');
  },
  fail: err => {
      console.log('setPageInfo fail', err);
  }
})
```

## API 支持度

| API | 微信小程序 | 百度小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| Taro.setPageInfo |  | ✔️ |  |  |
