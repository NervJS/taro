---
title: Access to Statistical Platforms
---

## Access to Baidu statistics platform
### WeChat mini program access to Baidu statistics

1、Download "WeChat  mini program statistics SDK" in thie [Baidu Statistics Platform](https://mtj.baidu.com/web/sdk/index), and copy the `mtj-wx-sdk.js` and `mtj-wx-sdk.config.js` obtained by unzipping them to the ` src/utils` folder of the  mini program project.

2. Edit `mtj-wx-sdk.config.js` and fill in the appKey field:

``` javascript
   appKey: 'Mini program AppKey',
```

3. Edit src/app.tsx of the mini program project and add at the top of the file.

``` javascript
    import './utils/mtj-wx-sdk';
```
4、Login to [WeChat Public Platform](https://mp.weixin.qq.com/), go to `Settings` -> `Development Settings` -> `Server Domain` of the  mini program, add `https://hmma.baidu.com` to `request legal domain`.

Detailed documentation is available at [https://mtj.baidu.com/static/userguide/book/chapter0/wechat.html#34-taro](https://mtj.baidu.com/static/userguide/book/chapter0/wechat.html#33-mpvue)


## Access to Aladdin Statistics Platform

For details, see the Aladdin Statistics Platform documentation ["How to integrate the SDK into a mini program  built with the Taro framework"](https://doc.aldwx.com/aldwx/frame/taro-jie-ru.html)

