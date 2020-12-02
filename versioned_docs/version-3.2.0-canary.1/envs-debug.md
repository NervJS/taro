---
title: 多端同步调试
---

从 1.3.5 版本开始，可以在 dist 目录下创建一个与编译的目标平台名同名的目录，并将结果放在这个目录下，例如编译到微信小程序，最终结果是在 dist/weapp 目录下，这样做的好处是，各个平台使用独立的目录互不影响，从而达到多端同步调试的目的，在 `config/index.js` 配置如下：

```js title="/config/index.js"
outputRoot: `dist/${process.env.TARO_ENV}`
```

多端同步调试需要在终端工具中打开多个 Tab 来同时执行 taro 命令进行同步调试，如下图，编译成微信小程序和支付宝小程序：

![打开多个 Tab 来同时执行 taro 命令进行同步调试](https://img30.360buyimg.com/ling/jfs/t1/62633/10/8451/595888/5d663badE57d35fd2/5a34822774836ede.png)

编译出来的目录如下图，`dist` 目录下有 `weapp` 和 `alipay` 两个目录：

![同步调试编译结果](https://img20.360buyimg.com/ling/jfs/t1/74046/26/8491/148076/5d663baaEf2ed8064/33fbb1d365053d1c.png)
