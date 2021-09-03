---
title: Access to Statistical Platforms
---

## Access to Baidu statistics platform
### WeChat mini program access to Baidu statistics
1、Download "WeChat  mini program statistics SDK" in thie [Baidu Statistics Platform](https://mtj.baidu.com/web/sdk/index), and copy the `mtj-wx-sdk.js` and `mtj-wx-sdk.config.js` obtained by unzipping them to the `src/utils` folder of the  mini program project.

4、Login to [WeChat Public Platform](https://mp.weixin.qq.com/), go to `Settings` -> `Development Settings` -> `Server Domain` of the  mini program, add `https://hmma.baidu.com` to `request legal domain`.

``` javascript
   appKey: 'Mini program AppKey',
```

Detailed documentation is available at [https://mtj.baidu.com/static/userguide/book/chapter0/wechat.html#34-taro](https://mtj.baidu.com/static/userguide/book/chapter0/wechat.html#33-mpvue)

``` javascript
    import './utils/mtj-wx-sdk';
```
For details, see the Aladdin Statistics Platform documentation ["How to integrate the SDK into a mini program  built with the Taro framework"](https://doc.aldwx.com/aldwx/frame/taro-jie-ru.html)

详细文档见[https://mtj.baidu.com/static/userguide/book/chapter0/wechat.html#34-taro](https://mtj.baidu.com/static/userguide/book/chapter0/wechat.html#33-mpvue)


## Access to Aladdin Statistics Platform

详细见阿拉丁统计平台文档[《如何将SDK集成至Taro框架构建的小程序中》](https://doc.aldwx.com/aldwx/frame/taro-jie-ru.html)

