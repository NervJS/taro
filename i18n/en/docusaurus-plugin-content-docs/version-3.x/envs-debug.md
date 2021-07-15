---
title: Multi-Platform Synchronized Debugging
---

Starting from version 1.3.5, you can create a directory under the dist directory with the same name as the target platform and put the result under this directory, for example, if you compile to WeChat mini program, the final result is under the dist/weapp directory. config/index.js` is configured as follows.

```js title="/config/index.js"
outputRoot: `dist/${process.env.TARO_ENV}`
```

Multi-terminal synchronous debugging requires opening multiple Tabs in the terminal tool to execute taro commands simultaneously for synchronous debugging, as follows, compiled into WeChat applets and Alipay mini program.

![Open multiple Tabs to execute taro commands simultaneously for synchronized debugging](https://img30.360buyimg.com/ling/jfs/t1/62633/10/8451/595888/5d663badE57d35fd2/5a34822774836ede.png)

The compiled directory is as follows, with two directories `weapp` and `alipay` under the `dist` directory.

![Simultaneous debugging of compiled results](https://img20.360buyimg.com/ling/jfs/t1/74046/26/8491/148076/5d663baaEf2ed8064/33fbb1d365053d1c.png)
