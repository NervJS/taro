---
title: Access to Tencent youshu seamless burial point capability
sidebar_label: Tencent Youshu seamless burial point
---

Taro introduces Tencent youshu seamless buried capabilities for WeChat mini program, providing Taro developers with 8 major seamless buried capabilities and custom buried capabilities for true-zero development, including **eight automated buried capabilities** such as applet start, show, hide, page view, page leave, share, drop-down refresh, pull-up bottoming**, and **customized buried capabilities** such as search and product attribution, as well as operational analysis, live analysis, shopping guide analysis, etc.

Translated with www.DeepL.com/Translator (free version)

## Tencent Youshu Introduction

  [Tencent Youshu](https://youshu.tencent.com/) is a data analysis and management platform launched by Tencent Smart Retail (https://lingshou.tencent.com) for brands and retailers, integrating Tencent's data, technology and ecological advantages to provide full-chain operation, data analysis, consumer insight and accurate marketing. It integrates Tencent's data, technology and ecological strengths to provide full-chain operation, data analysis, consumer insight and precise marketing capabilities, allowing enterprises to operate more "with numbers".

For more presentations, please follow [https://mp.zhls.qq.com/youshu-docs/start/youshu_intro.html](https://mp.zhls.qq.com/youshu-docs/start/youshu_intro.html)

## Function Introduction

Tencent Youshu & Taro cooperated to develop the WeChat mini program template, you can quickly have the ability to buried without traces by selecting `default-youshu` template through `taro init myApp`, and you can have eight automatic buried abilities such as mini program start, show, hide, page browse, page leave, share, drop down refresh, drop up bottom, etc. without any development.

## Zero Development Quick Guide

> Need to upgrade Taro to 2.x or 3.x

1. `taro init myApp`
2. Select the `default-youshu` template
3. `npm run dev:weapp`
4. You can see the 8 major behavioral logs reported in the WeChat mini program developer tools console
5. Visit [https://docs.qq.com/form/fill/DUkZHalR0RUJCVkVj#/fill](https://docs.qq.com/form/fill/DUkZHalR0RUJCVkVj#/fill) to request permission to view all data

> Through the above process has given your WeChat mini program the ability to experience 8 major user behavior buried points. After the experience is completed, you only need to replace the Token and WeChat mini program appid that have the number to have the official version of the function. Official account acquisition path: ：https://docs.qq.com/form/fill/DUkZHalR0RUJCVkVj#/fill

## Existing mini programs access Tencent Youshu SDK

### 1. Installation

  * Install SDK via npm `npm i sr-sdk-wxapp`
  * Introduce the SDK via import in app.jsx `import sr from 'sr-sdk-wxapp'`

### 2. Add Trusted Domain

Login to [WeChat Public Platform](https://mp.weixin.qq.com/), go to `<Development> <Development Settings> <Server Domain>`, add `https://zhls.qq.com` as request legal domain.


> There is also SDK version checking in the development environment, so it will prompt `https://sr-home-1257214331.cos.ap-guangzhou.myqcloud.com is not in the list of legal domains for the following request` , which can be handled by setting not to check the domain name.

### 3. Initialize

`init(options: object)`

Configuration interface to adjust the base settings of the SDK. Should be called before the `App()` call.

The first call initializes the SDK, and the second call overwrites the previously passed configuration, which can be called multiple times. 

| Name | Type | Required | Description | 
|:----|:----|:----|:----|
| appid   | string   | Y   | Wechat mini program appId   | 
| token   | string   | Y   | After passing the access request, the credential string provided by Youshu  | 
| usePlugin   | bool   |    | Whether the mini program plugin is used or not, default is false   | 
| debug   | bool   |    | Whether to print the log or not, default is false  | 
| openSdkShareDepth   | bool   |    | Whether to turn on the sharing link recording function, the default value is false, after turning on, it will record user sharing link A->B->C->D   | 
| serverUrl   | string   |    | Pass in a custom backend reporting interface, if passed in then the token will be meaningless, default is 'https://zhls.qq.com/api/report'   | 
| trackApp   | bool   |    | Whether to enable automatic tracking of APP exposure events (APP-related preset events, such as APP - onLuanch), default is true | 
| proxyPage   | bool   |    | Whether to enable automatic proxy Page, the default is: false. sdr.page can be used instead of Page(sr.page(options)) for events such as browse, leave, share, etc. that the SDK is responsible for reporting on the page.    | 
| autoStart   | bool   |    | Whether to enable automatic start reporting, the default is: false, open_id can not be automatically obtained, usually after the login business manually call sr.startReport method to open reporting    | 

### 4. Example

``` javascript
import sr from 'sr-sdk-wxapp'
sr.init({
  token: 'bi72fccc7184ef4xxx',
  /**
   * WeChat mini program appID , starting with wx
   */
  appid: 'wx195745e8e342bxxx',
  /**
   * If the mini program plugin is used, it needs to be set to true
   */
  usePlugin: false,
  /**
   * Enables printing of debugging information, default false
   */
  debug: true,
  /**
   *It is recommended to turn on - auto-proxy Page, default false
   * sdk is responsible for reporting events such as browse, leave, share, etc. of the page
   * You can use sr.page instead of Page(sr.page(options))
   * element event tracking, need to work with autoTrack: true
   */
  proxyPage: true,
  /**
    * Recommended - enable component auto-proxy, default false
    * sdk is responsible for reporting events such as browse, leave, share, etc. of the page
   */
  proxyComponent: true,
  // It is recommended to enable - Whether to enable automatic tracking of page sharing links
  openSdkShareDepth: true,
  // It is recommended to enable - element event tracking, automatic reporting of element events, into tap, change, longpress, confirm
  autoTrack: true,
})
```

 

