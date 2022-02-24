---
title: Cloud
sidebar_label: Cloud
---

## 方法

### init

在调用云开发各 API 前，需先调用初始化方法 init 一次（全局只需一次，多次调用时只有第一次生效）

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="Harmony" src={require('@site/static/img/platform/harmony.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/init/client.init.html)

```tsx
(config?: IInitConfig) => Promise<void>
```

| 参数 | 类型 |
| --- | --- |
| config | `IInitConfig` |

#### 示例代码

```tsx
Taro.cloud.init({
  env: 'test-x1dzi'
})
```

### CloudID

声明字符串为 CloudID（开放数据 ID），该接口传入一个字符串，返回一个 CloudID 特殊对象，将该对象传至云函数可以获取其对应的开放数据。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/open/Cloud.CloudID.html)

```tsx
(cloudID: string) => void
```

| 参数 | 类型 |
| --- | --- |
| cloudID | `string` |

### callFunction

调用云函数

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="Harmony" src={require('@site/static/img/platform/harmony.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/functions/Cloud.callFunction.html)

```tsx
{ (param: OQ<CallFunctionParam>): void; (param: RQ<CallFunctionParam>): Promise<CallFunctionResult>; }
```

| 参数 | 类型 |
| --- | --- |
| param | `OQ<CallFunctionParam>` |

#### 示例代码

假设已有一个云函数 add，在小程序端发起对云函数 add 的调用：

```tsx
Taro.cloud.callFunction({
// 要调用的云函数名称
name: 'add',
  // 传递给云函数的event参数
  data: {
    x: 1,
    y: 2,
  }
}).then(res => {
  // output: res.result === 3
}).catch(err => {
  // handle error
})
```

### uploadFile

将本地资源上传至云存储空间，如果上传至同一路径则是覆盖写

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="Harmony" src={require('@site/static/img/platform/harmony.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/uploadFile/client.uploadFile.html)

```tsx
{ (param: OQ<UploadFileParam>): UploadTask; (param: RQ<UploadFileParam>): Promise<UploadFileResult>; }
```

| 参数 | 类型 |
| --- | --- |
| param | `OQ<UploadFileParam>` |

#### 示例代码

##### 示例 1

```tsx
Taro.cloud.uploadFile({
  cloudPath: 'example.png',
  filePath: '', // 文件路径
  success: res => {
    // get resource ID
    console.log(res.fileID)
  },
  fail: err => {
    // handle error
  }
})
```

##### 示例 2

```tsx
Taro.cloud.uploadFile({
  cloudPath: 'example.png',
  filePath: '', // 文件路径
}).then(res => {
  // get resource ID
  console.log(res.fileID)
}).catch(error => {
  // handle error
})
```

### downloadFile

从云存储空间下载文件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="Harmony" src={require('@site/static/img/platform/harmony.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/downloadFile/client.downloadFile.html)

```tsx
{ (param: OQ<DownloadFileParam>): DownloadTask; (param: RQ<DownloadFileParam>): Promise<DownloadFileResult>; }
```

| 参数 | 类型 |
| --- | --- |
| param | `OQ<DownloadFileParam>` |

#### 示例代码

##### 示例 1

```tsx
Taro.cloud.downloadFile({
  fileID: 'a7xzcb',
  success: res => {
    // get temp file path
    console.log(res.tempFilePath)
  },
  fail: err => {
    // handle error
  }
})
```

##### 示例 2

```tsx
Taro.cloud.downloadFile({
  fileID: 'a7xzcb'
}).then(res => {
  // get temp file path
  console.log(res.tempFilePath)
}).catch(error => {
  // handle error
})
```

### getTempFileURL

用云文件 ID 换取真实链接，公有读的文件获取的链接不会过期，私有的文件获取的链接十分钟有效期。一次最多取 50 个。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="Harmony" src={require('@site/static/img/platform/harmony.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/Cloud.getTempFileURL.html)

```tsx
{ (param: OQ<GetTempFileURLParam>): void; (param: RQ<GetTempFileURLParam>): Promise<GetTempFileURLResult>; }
```

| 参数 | 类型 |
| --- | --- |
| param | `OQ<GetTempFileURLParam>` |

#### 示例代码

##### 示例 1

```tsx
Taro.cloud.getTempFileURL({
  fileList: [{
    fileID: 'a7xzcb',
    maxAge: 60 * 60, // one hour
  }]
}).then(res => {
  // get temp file URL
  console.log(res.fileList)
}).catch(error => {
  // handle error
})
```

##### 示例 2

```tsx
Taro.cloud.getTempFileURL({
  fileList: ['cloud://xxx', 'cloud://yyy'],
  success: res => {
    // get temp file URL
    console.log(res.fileList)
  },
  fail: err => {
    // handle error
  }
})
```

### deleteFile

从云存储空间删除文件，一次最多 50 个

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="Harmony" src={require('@site/static/img/platform/harmony.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/Cloud.deleteFile.html)

```tsx
{ (param: OQ<DeleteFileParam>): void; (param: RQ<DeleteFileParam>): Promise<DeleteFileResult>; }
```

| 参数 | 类型 |
| --- | --- |
| param | `OQ<DeleteFileParam>` |

#### 示例代码

##### 示例 1

```tsx
.cloud.deleteFile({
  fileList: ['a7xzcb']
}).then(res => {
  // handle success
  console.log(res.fileList)
}).catch(error => {
  // handle error
})
```

##### 示例 2

```tsx
Taro.cloud.deleteFile({
  fileList: ['a7xzcb'],
  success: res => {
    // handle success
    console.log(res.fileList)
  },
  fail: err => {
    // handle error
  },
  complete: res => {
    // ...
  }
})
```

### database

获取数据库实例

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="Harmony" src={require('@site/static/img/platform/harmony.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.database.html)

```tsx
(config?: IConfig) => Database
```

| 参数 | 类型 |
| --- | --- |
| config | `IConfig` |

#### 示例代码

##### 示例 1

以下调用获取默认环境的数据库的引用：

```tsx
const db = Taro.cloud.database()
```

##### 示例 2

假设有一个环境名为 test-123，用做测试环境，那么可以如下获取测试环境数据库：

```tsx
const testDB = Taro.cloud.database({
  env: 'test-123'
})
```

### callContainer

调用云托管服务

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="Harmony" src={require('@site/static/img/platform/harmony.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/container/Cloud.callContainer.html)

```tsx
<R = any, P = any>(params: CallContainerParam<P>) => Promise<CallContainerResult<R>>
```

| 参数 | 类型 |
| --- | --- |
| params | `R` |

#### 示例代码

假设已经初始化了一个叫c1的云开发实例，并发起云托管调用

``` tsx
const r = await c1.callContainer({
  path: '/path/to/container', // 填入容器的访问路径
  method: 'POST',
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native | Harmony |
| :---: | :---: | :---: | :---: | :---: |
| Cloud.init | ✔️ |  |  |  |
| Cloud.callFunction | ✔️ |  |  |  |
| Cloud.uploadFile | ✔️ |  |  |  |
| Cloud.downloadFile | ✔️ |  |  |  |
| Cloud.getTempFileURL | ✔️ |  |  |  |
| Cloud.deleteFile | ✔️ |  |  |  |
| Cloud.database | ✔️ |  |  |  |
| Cloud.callContainer | ✔️ |  |  |  |
