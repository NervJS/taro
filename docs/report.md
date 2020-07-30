---
title: 接入统计平台
---
## 接入友盟小程序统计平台
详细见友盟统计平台文档[《如何将友盟SDK集成至Taro框架构建的小程序中》](https://github.com/umeng/mp-demos/tree/master/taro)

## 接入百度统计平台
### 微信小程序接入百度统计
1、在[百度统计平台](https://mtj.baidu.com/web/sdk/index) 的 「小程序SDK」 里下载「微信小程序统计SDK」，把解压缩得到的 `mtj-wx-sdk.js` 和 `mtj-wx-sdk.config.js` 拷贝到小程序项目的 `src/utils` 文件夹中。

2、编辑 `mtj-wx-sdk.config.js`，填写 appKey 字段:

``` javascript
   appKey: '您小程序的AppKey',
```

3、编辑小程序项目的 src/app.tsx，在文件最顶部加入：

``` javascript
    import './utils/mtj-wx-sdk';
```
4、登录[微信公众平台](https://mp.weixin.qq.com/)，进入小程序的 `设置` -> `开发设置` -> `服务器域名`，把`https://hmma.baidu.com`加入 `request合法域名`。

详细文档见[https://mtj.baidu.com/static/userguide/book/chapter0/wechat.html#34-taro](https://mtj.baidu.com/static/userguide/book/chapter0/wechat.html#33-mpvue)


## 接入阿拉丁统计平台

详细见阿拉丁统计平台文档[《如何将SDK集成至Taro框架构建的小程序中》](http://doc.aldwx.com/aldwx/frame/taro-jie-ru.html)

