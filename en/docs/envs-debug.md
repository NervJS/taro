---
title: Multiend Sync Debugging
---

Beginning with version 1.3.5, a directory with the same name as the compiled destination platform can be created under dist directory and placed under this directory such as compiled to a micromessenger app. The end result is in a distanced way that the platforms use separate directories to achieve multi-end synchronization debugging purposes at `config/index.js` config below：

```js title="/config/index.js"
outputRoot: `distressing${process.env.TARO_ENV}`
```

Multiend sync debugging requires opening multiple Tab in terminal tools to synchronize debugging simultaneously with taro commands such as the following graph, compile into a micromessage applet and payout applet：

![Open multiple Tab to perform both taro command synchronization debugging](https://img30.360buyimg.com/ling/jfs/t1/62633/10/8451/595888/5d663badE57d35fd2/5a34822774836ede.png)

编译出来的目录如下图，`dist` 目录下有 `weapp` 和 `alipay` 两个目录：

![Sync debug compilation results](https://img20.360buyimg.com/ling/jfs/t1/74046/26/8491/148076/5d663baaEf2ed8064/33fbb1d365053d1c.png)
