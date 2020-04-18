---
title: Taro.setPageInfo(option)
sidebar_label: setPageInfo
id: version-2.1.1-setPageInfo
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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>title</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>页面标题</td>
    </tr>
    <tr>
      <td>keywords</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>页面关键字</td>
    </tr>
    <tr>
      <td>description</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>页面描述信息</td>
    </tr>
    <tr>
      <td>releaseDate</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>原始发布时间(年-月-日 时:分:秒 带有前导零）</td>
    </tr>
    <tr>
      <td>articleTitle</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>文章(内容)标题(适用于当前页面是图文、视频类的展示形式，文章标题需要准确标识当前文章的主要信息点；至少6个字，不可以全英文。)</td>
    </tr>
    <tr>
      <td>image</td>
      <td><code>string | string[]</code></td>
      <td style="text-align:center">否</td>
      <td>图片线上地址，用于信息流投放后的封面显示，最多3张，单图片最大2M；封面图建议尺寸：高&gt;=210px &amp; 宽&gt;=375px；最小尺寸：高&gt;=146px &amp; 宽&gt;=218px。多张图时，用数组表示</td>
    </tr>
    <tr>
      <td>video</td>
      <td><code>Video</code></td>
      <td style="text-align:center">否</td>
      <td>视频信息，多个视频时，用数组表示</td>
    </tr>
    <tr>
      <td>visit</td>
      <td><code>Visit</code></td>
      <td style="text-align:center">否</td>
      <td>浏览信息</td>
    </tr>
    <tr>
      <td>likes</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>点赞量，若页面未统计可为空</td>
    </tr>
    <tr>
      <td>comments</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>评论量，若页面未统计可为空</td>
    </tr>
    <tr>
      <td>collects</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>收藏量，若页面未统计可为空</td>
    </tr>
    <tr>
      <td>shares</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>分享量，若页面未统计可为空</td>
    </tr>
    <tr>
      <td>followers</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>关注量，若页面未统计可为空</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>() =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(err: any) =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>() =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
  </tbody>
</table>

### Video

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
      <td>url</td>
      <td><code>string</code></td>
      <td>视频地址</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>string</code></td>
      <td>视频时长(单位为秒)</td>
    </tr>
    <tr>
      <td>image</td>
      <td><code>string</code></td>
      <td>视频封面图</td>
    </tr>
  </tbody>
</table>

### Visit

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>pv</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>页面的浏览量(不去重用户）</td>
    </tr>
    <tr>
      <td>uv</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>页面的点击量（去重用户）</td>
    </tr>
    <tr>
      <td>sessionDuration</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>页面的用户人均停留时长，以秒为单位。</td>
    </tr>
  </tbody>
</table>

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
