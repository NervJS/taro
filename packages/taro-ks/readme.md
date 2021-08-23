# taro-plugin-platform-ks

Taro 插件,用于适配快手小程序。

主要为了解决[template 命名递归问题](https://github.com/NervJS/taro/issues/9616)

## 使用

#### 1. 配置插件

```js
// config/index.js
module.exports = {
  // ...
  plugins: [
    '@tarojs/plugin-platform-ks'
  ]
}
```

#### 2. 编译为快手小程序

```shell
taro build --type ks
taro build --type ks --watch
```

#### 其它

##### 平台判断

```js
if (process.TARO_ENV === 'ks') {
  // ...
}
```

##### 补充ts提示
``` 
// global.d.ts
// @ts-ignore
declare const process: {
  env: {
    TARO_ENV: TARO_ENV
    [key: string]: any;
  }
}

declare type TARO_ENV = 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd' | 'ks'
```


## 注意

* cover-view 只能嵌套5层,子元素只能是 文本/cover-view/cover-image
* cover-view 样式有些不支持,等待快手修复,line-height border-radius
* cover-image 不支持嵌套子元素
* 部分 api 未 promise 化
* 组件属性还未完全支持,参考[taro-plugin-inject](https://github.com/NervJS/taro-plugin-inject)进行添加,或者issue pr