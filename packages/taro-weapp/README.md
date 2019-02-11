# @tarojs/taro-weapp
多端解决方案小程序端基础框架

## 修复功能
1.修复connect()写法无法使用的问题

## 新增功能
1.改变原有路由跳转代码 支持直接以对象的方式传递参数
```JavaScript
    Taro.navigateTo({
      url: path,
      params: {
        type:id
      }
    });
```