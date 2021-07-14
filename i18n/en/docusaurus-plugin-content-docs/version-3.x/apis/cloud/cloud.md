---
title: cloud
sidebar_label: cloud
---

Instance object of a cloud development SDK.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.html)

## Type

```tsx
typeof cloud
```

## Parameters

### CallFunctionResult

Common return for cloud functions

| Property | Type | Description |
| --- | --- | --- |
| result | `string | Record<string, any>` | Results returned by the cloud function |
| errMsg | `string` | Call result |

### IAPIParam

Common parameters for cloud functions

| Property | Type | Required | Description |
| --- | --- | :---: | --- |
| config | `IConfig` | No | Configuration |
| success | `(res: T) => void` | No | The callback function for a successful API call |
| fail | `(err: CallbackResult) => void` | No | The callback function for a failed API call |
| complete | `(val: CallbackResult | T) => void` | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |

### IInitConfig

Initial configuration

| Property | Type | Required | Description |
| --- | --- | :---: | --- |
| env | `string | { database?: string; functions?: string; storage?: string; }` | No | Default environment configuration, pass in an environment ID as a string to specify the default environment for all services, or pass in an object to specify the default environment for each service individually. |
| traceUser | `boolean` | No | Specify whether or not user access is logged to User Management before being visible in the console. |

### IConfig

Configuration

| Property | Type | Required | Description |
| --- | --- | :---: | --- |
| env | `string` | No | The environment ID used, which can be filled in to ignore the environment specified by init. |
| traceUser | `boolean` | No | Specify whether or not user access is logged to User Management before being visible in the console. |

### ICloudAPIParam

Common parameters for the Cloud Functions API.

| Property | Type | Required | Description |
| --- | --- | :---: | --- |
| config | `IConfig` | No | Configuration |

### CallFunctionParam

| Property | Type | Required | Description |
| --- | --- | :---: | --- |
| name | `string` | Yes | Cloud function name |
| data | `Record<string, any>` | No | The parameters passed to the cloud function are available in the cloud function via the event parameter. |
| slow | `boolean` | No |  |
| config | `IConfig` | No | Configuration |
| complete | `(res: CallFunctionResult | CallbackResult) => void` | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |
| fail | `(res: CallbackResult) => void` | No | The callback function for a failed API call |
| success | `(res: CallFunctionResult) => void` | No | The callback function for a successful API call |

### UploadFileResult

Results of uploaded files

| Property | Type | Description |
| --- | --- | --- |
| fileID | `string` | File ID |
| statusCode | `number` | The HTTP status code returned by the server. |
| errMsg | `string` | Call result |

### UploadFileParam

Parameters of uploaded files

| Property | Type | Required | Description |
| --- | --- | :---: | --- |
| cloudPath | `string` | Yes | Cloud Storage Path |
| filePath | `string` | Yes | The path of the file resource to be uploaded. |
| header | `Record<string, any>` | No |  |
| config | `IConfig` | No | Configuration |
| complete | `(res: CallbackResult | UploadFileResult) => void` | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |
| fail | `(res: CallbackResult) => void` | No | The callback function for a failed API call |
| success | `(res: UploadFileResult) => void` | No | The callback function for a successful API call |

### DownloadFileResult

下载文件结果

| Property | Type | Description |
| --- | --- | --- |
| tempFilePath | `string` | Temporary file path |
| statusCode | `number` | The HTTP status code returned by the server. |
| errMsg | `string` | Call result |

### DownloadFileParam

Parameters for downloading files

| Property | Type | Required | Description |
| --- | --- | :---: | --- |
| fileID | `string` | Yes | Cloud File ID |
| cloudPath | `string` | No |  |
| config | `IConfig` | No | Configuration |
| complete | `(res: CallbackResult | DownloadFileResult) => void` | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |
| fail | `(res: CallbackResult) => void` | No | The callback function for a failed API call |
| success | `(res: DownloadFileResult) => void` | No | The callback function for a successful API call |

### GetTempFileURLResult

The result of the acquisition of temporary documents.

| Property | Type | Description |
| --- | --- | --- |
| fileList | `GetTempFileURLResultItem[]` | List of files |
| errMsg | `string` | Call result |

### GetTempFileURLResultItem

List of files

| Property | Type | Description |
| --- | --- | --- |
| fileID | `string` | Cloud file ID |
| tempFileURL | `string` | The path of the temporary file. |
| maxAge | `number` |  |
| status | `number` | Status Code |
| errMsg | `string` | Call result |

### GetTempFileURLParam

Parameters of get temporary file

| Property | Type | Required | Description |
| --- | --- | :---: | --- |
| fileList | `string[]` | Yes |  |
| config | `IConfig` | No | Configuration |
| complete | `(res: CallbackResult | GetTempFileURLResult) => void` | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |
| fail | `(res: CallbackResult) => void` | No | The callback function for a failed API call |
| success | `(res: GetTempFileURLResult) => void` | No | The callback function for a successful API call |

### DeleteFileResult

The result of deleting a file

| Property | Type | Description |
| --- | --- | --- |
| fileList | `DeleteFileResultItem[]` | List of files |
| errMsg | `string` | Call result |

### DeleteFileResultItem

Delete file list

| Property | Type | Description |
| --- | --- | --- |
| fileID | `string` | Cloud file ID |
| status | `number` | Status Code |
| errMsg | `string` | Call result |

### DeleteFileParam

| Property | Type | Required | Description |
| --- | --- | :---: | --- |
| fileList | `string[]` | Yes | List of files |
| config | `IConfig` | No | Configuration |
| complete | `(res: CallbackResult | DeleteFileResult) => void` | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |
| fail | `(res: CallbackResult) => void` | No | The callback function for a failed API call |
| success | `(res: DeleteFileResult) => void` | No | The callback function for a successful API call |

### init

The initialisation method `init` needs to be called once before calling the cloud development APIs (only once globally, only the first time takes effect if called multiple times)

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/init/client.init.html)

```tsx
(config?: IInitConfig) => void
```

| Property | Type |
| --- | --- |
| config | `IInitConfig` |

#### Sample Code

```tsx
Taro.cloud.init({
  env: 'test-x1dzi'
})
```

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| cloud.init | ✔️ |  |  |  |  |  |  |  |

### callFunction

Call Cloud funtion

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/functions/Cloud.callFunction.html)

```tsx
{ (param: OQ<CallFunctionParam>): void; (param: Pick<CallFunctionParam, "name" | "data" | "slow" | "config">): Promise<CallFunctionResult>; }
```

| Property | Type |
| --- | --- |
| param | `OQ<CallFunctionParam>` |

#### Sample Code

Assuming there is already a cloud function `add`, initiate a call to the cloud function `add` on the applet side.

```tsx
Taro.cloud.callFunction({
// Name of the cloud function to be called
name: 'add',
  // The event parameter passed to the cloud function.
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

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| cloud.callFunction | ✔️ |  |  |  |  |  |  |  |

### uploadFile

Upload local resources to cloud storage, or overwrite if uploading to the same path.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/uploadFile/client.uploadFile.html)

```tsx
{ (param: OQ<UploadFileParam>): any; (param: Pick<UploadFileParam, "config" | "cloudPath" | "filePath" | "header">): Promise<UploadFileResult>; }
```

| Property | Type |
| --- | --- |
| param | `OQ<UploadFileParam>` |

#### Sample Code

##### Example 1

```tsx
Taro.cloud.uploadFile({
  cloudPath: 'example.png',
  filePath: '', // file path
  success: res => {
    // get resource ID
    console.log(res.fileID)
  },
  fail: err => {
    // handle error
  }
})
```

##### Example 2

```tsx
Taro.cloud.uploadFile({
  cloudPath: 'example.png',
  filePath: '', // file path
}).then(res => {
  // get resource ID
  console.log(res.fileID)
}).catch(error => {
  // handle error
})
```

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| cloud.uploadFile | ✔️ |  |  |  |  |  |  |  |

### downloadFile

Download files from cloud storage.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/downloadFile/client.downloadFile.html)

```tsx
{ (param: OQ<DownloadFileParam>): any; (param: Pick<DownloadFileParam, "config" | "cloudPath" | "fileID">): Promise<DownloadFileResult>; }
```

| Property | Type |
| --- | --- |
| param | `OQ<DownloadFileParam>` |

#### Sample Code

##### Example 1

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

##### Example 2

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

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| cloud.downloadFile | ✔️ |  |  |  |  |  |  |  |

### getTempFileURL

Exchange your cloud file ID for a real link. Links obtained from public and readable files do not expire, while links obtained from private files are valid for ten minutes. Maximum of 50 at a time.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/Cloud.getTempFileURL.html)

```tsx
{ (param: OQ<GetTempFileURLParam>): void; (param: Pick<GetTempFileURLParam, "config" | "fileList">): Promise<GetTempFileURLResult>; }
```

| Property | Type |
| --- | --- |
| param | `OQ<GetTempFileURLParam>` |

#### Sample Code

##### Example 1

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

##### Example 2

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

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| cloud.getTempFileURL | ✔️ |  |  |  |  |  |  |  |

### deleteFile

Delete files from cloud storage, up to 50 at a time.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/Cloud.deleteFile.html)

```tsx
{ (param: OQ<DeleteFileParam>): void; (param: Pick<DeleteFileParam, "config" | "fileList">): Promise<DeleteFileResult>; }
```

| Property | Type |
| --- | --- |
| param | `OQ<DeleteFileParam>` |

#### Sample Code

##### Example 1

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

##### Example 2

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

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| cloud.deleteFile | ✔️ |  |  |  |  |  |  |  |

### database

Get the database instance.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.database.html)

```tsx
(config?: IConfig) => Database
```

| Property | Type |
| --- | --- |
| config | `IConfig` |

#### Sample Code

##### Example 1

The following call obtains a reference to the database of the default environment:

```tsx
const db = Taro.cloud.database()
```

##### Example 2

Assuming an environment named `test-123` is used as a test environment, the test environment database can be obtained as follows.

```tsx
const testDB = Taro.cloud.database({
  env: 'test-123'
})
```

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| cloud.database | ✔️ |  |  |  |  |  |  |  |
