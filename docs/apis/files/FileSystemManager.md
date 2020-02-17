---
title: FileSystemManager
sidebar_label: FileSystemManager
---

文件管理器

## 方法

### readdirSync

FileSystemManager.readdir 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readdirSync.html)

```tsx
(dirPath: string) => string[]
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| dirPath | `string` | 要读取的目录路径 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.readdirSync | ✔️ |  |  |

### access

判断文件/目录是否存在

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.access.html)

```tsx
(option: AccessOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `AccessOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.access | ✔️ |  |  |

### accessSync

FileSystemManager.access 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.accessSync.html)

```tsx
(path: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| path | `string` | 要判断是否存在的文件/目录路径 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.accessSync | ✔️ |  |  |

### appendFile

在文件结尾追加内容

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.appendFile.html)

```tsx
(option: AppendFileOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `AppendFileOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.appendFile | ✔️ |  |  |

### appendFileSync

FileSystemManager.appendFile 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.appendFileSync.html)

```tsx
(filePath: string, data: string | ArrayBuffer, encoding?: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "ucs-2" | "utf16le" | "utf-16le" | "utf-8" | "utf8" | "latin1") => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| filePath | `string` | 要追加内容的文件路径 |
| data | string or ArrayBuffer | 要追加的文本或二进制数据 |
| encoding | "ascii" or "base64" or "binary" or "hex" or "ucs2" or "ucs-2" or "utf16le" or "utf-16le" or "utf-8" or "utf8" or "latin1" | 指定写入文件的字符编码 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.appendFileSync | ✔️ |  |  |

### copyFile

复制文件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.copyFile.html)

```tsx
(option: CopyFileOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `CopyFileOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.copyFile | ✔️ |  |  |

### copyFileSync

FileSystemManager.copyFile 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.copyFileSync.html)

```tsx
(srcPath: string, destPath: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| srcPath | `string` | 源文件路径，只可以是普通文件 |
| destPath | `string` | 目标文件路径 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.copyFileSync | ✔️ |  |  |

### getFileInfo

获取该小程序下的 本地临时文件 或 本地缓存文件 信息

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.getFileInfo.html)

```tsx
(option: getFileInfoOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `getFileInfoOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.getFileInfo | ✔️ |  |  |

### getSavedFileList

获取该小程序下已保存的本地缓存文件列表

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.getSavedFileList.html)

```tsx
(option?: getSavedFileListOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `getSavedFileListOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.getSavedFileList | ✔️ |  |  |

### mkdir

创建目录

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.mkdir.html)

```tsx
(option: MkdirOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `MkdirOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.mkdir | ✔️ |  |  |

### mkdirSync

FileSystemManager.mkdir 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.mkdirSync.html)

```tsx
(dirPath: string, recursive?: boolean) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| dirPath | `string` | 创建的目录路径 |
| recursive | `boolean` | 是否在递归创建该目录的上级目录后再创建该目录。如果对应的上级目录已经存在，则不创建该上级目录。如 dirPath 为 a/b/c/d 且 recursive 为 true，将创建 a 目录，再在 a 目录下创建 b 目录，以此类推直至创建 a/b/c 目录下的 d 目录。 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.mkdirSync | ✔️ |  |  |

### readFile

读取本地文件内容

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readFile.html)

```tsx
(option: ReadFileOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `ReadFileOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.readFile | ✔️ |  |  |

### readdir

读取目录内文件列表

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readdir.html)

```tsx
(option: ReaddirOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `ReaddirOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.readdir | ✔️ |  |  |

### removeSavedFile

删除该小程序下已保存的本地缓存文件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.removeSavedFile.html)

```tsx
(option: RemoveSavedFileOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `RemoveSavedFileOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.removeSavedFile | ✔️ |  |  |

### rename

重命名文件。可以把文件从 oldPath 移动到 newPath

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.rename.html)

```tsx
(option: RenameOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `RenameOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.rename | ✔️ |  |  |

### renameSync

FileSystemManager.rename 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.renameSync.html)

```tsx
(oldPath: string, newPath: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| oldPath | `string` | 源文件路径，可以是普通文件或目录 |
| newPath | `string` | 新文件路径 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.renameSync | ✔️ |  |  |

### rmdir

删除目录

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.rmdir.html)

```tsx
(option: RmdirOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `RmdirOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.rmdir | ✔️ |  |  |

### rmdirSync

FileSystemManager.rmdir 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.rmdirSync.html)

```tsx
(dirPath: string, recursive?: boolean) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| dirPath | `string` | 要删除的目录路径 |
| recursive | `boolean` | 是否递归删除目录。如果为 true，则删除该目录和该目录下的所有子目录以及文件。 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.rmdirSync | ✔️ |  |  |

### saveFile

保存临时文件到本地。此接口会移动临时文件，因此调用成功后，tempFilePath 将不可用。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.saveFile.html)

```tsx
(option: SaveFileOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `SaveFileOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.saveFile | ✔️ |  |  |

### stat

获取文件 Stats 对象

```tsx
(option: StatOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `StatOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.stat |  |  |  |

### unlink

删除文件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.unlink.html)

```tsx
(option: UnlinkOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `UnlinkOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.unlink | ✔️ |  |  |

### unlinkSync

FileSystemManager.unlink 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.unlinkSync.html)

```tsx
(filePath: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| filePath | `string` | 要删除的文件路径 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.unlinkSync | ✔️ |  |  |

### unzip

解压文件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.unzip.html)

```tsx
(option: UnzipOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `UnzipOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.unzip | ✔️ |  |  |

### writeFile

写文件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.writeFile.html)

```tsx
(option: WriteFileOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `WriteFileOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.writeFile | ✔️ |  |  |

### writeFileSync

FileSystemManager.writeFile 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.writeFileSync.html)

```tsx
(filePath: string, data: string | ArrayBuffer, encoding?: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "ucs-2" | "utf16le" | "utf-16le" | "utf-8" | "utf8" | "latin1") => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| filePath | `string` | 要写入的文件路径 |
| data | string or ArrayBuffer | 要写入的文本或二进制数据 |
| encoding | "ascii" or "base64" or "binary" or "hex" or "ucs2" or "ucs-2" or "utf16le" or "utf-16le" or "utf-8" or "utf8" or "latin1" | 指定写入文件的字符编码 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.writeFileSync | ✔️ |  |  |

### statSync

FileSystemManager.stat 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.statSync.html)

```tsx
(path: string, recursive?: boolean) => Stats | Record<string, any>
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| path | `string` | 文件/目录路径 |
| recursive | `boolean` | 是否递归获取目录下的每个文件的 Stats 信息 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.statSync | ✔️ |  |  |

### saveFileSync

FileSystemManager.saveFile 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.saveFileSync.html)

```tsx
(tempFilePath: string, filePath?: string) => number
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tempFilePath | `string` | 临时存储文件路径 |
| filePath | `string` | 要存储的文件路径 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.saveFileSync | ✔️ |  |  |

### readFileSync

FileSystemManager.readFile 的同步版本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readFileSync.html)

```tsx
(filePath: string, encoding?: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "ucs-2" | "utf16le" | "utf-16le" | "utf-8" | "utf8" | "latin1") => string | ArrayBuffer
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| filePath | `string` | 要读取的文件的路径 |
| encoding | "ascii" or "base64" or "binary" or "hex" or "ucs2" or "ucs-2" or "utf16le" or "utf-16le" or "utf-8" or "utf8" or "latin1" | 指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.readFileSync | ✔️ |  |  |

## 参数

### encoding

字符编码

| 参数 | 说明 |
| --- | --- |
| ascii |  |
| base64 |  |
| binary |  |
| hex |  |
| ucs2 | 以小端序读取 |
| ucs-2 | 以小端序读取 |
| utf16le | 以小端序读取 |
| utf-16le | 以小端序读取 |
| utf-8 |  |
| utf8 |  |
| latin1 |  |

### AccessOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| path | `string` | 是 | 要判断是否存在的文件/目录路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: AccessFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### AccessFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory ${path}': 文件/目录不存在; |

### AppendFileOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| data | string or ArrayBuffer | 是 | 要追加的文本或二进制数据 |
| filePath | `string` | 是 | 要追加内容的文件路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| encoding | "ascii" or "base64" or "binary" or "hex" or "ucs2" or "ucs-2" or "utf16le" or "utf-16le" or "utf-8" or "utf8" or "latin1" | 否 | 指定写入文件的字符编码 |
| fail | `(result: AppendFileFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### AppendFileFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory, open ${filePath}': 指定的 filePath 文件不存在;<br />- 'fail illegal operation on a directory, open "${filePath}"': 指定的 filePath 是一个已经存在的目录;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有写权限;<br />- 'fail sdcard not mounted': 指定的 filePath 是一个已经存在的目录; |

### CopyFileOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| destPath | `string` | 是 | 目标文件路径 |
| srcPath | `string` | 是 | 源文件路径，只可以是普通文件 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: CopyFileFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### CopyFileFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail permission denied, copyFile ${srcPath} -> ${destPath}': 指定目标文件路径没有写权限;<br />- 'fail no such file or directory, copyFile ${srcPath} -> ${destPath}': 源文件不存在，或目标文件路径的上层目录不存在;<br />- 'fail the maximum size of the file storage limit is exceeded': 存储空间不足; |

### getFileInfoOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 要读取的文件路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: GetFileInfoFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: GetFileInfoSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### GetFileInfoFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail file not exist': 指定的 filePath 找不到文件; |

### GetFileInfoSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| size | `number` | 文件大小，以字节为单位 |
| errMsg | `string` | 调用结果 |

### getSavedFileListOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: GetSavedFileListSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### GetSavedFileListSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| fileList | `GetSavedFileListSuccessCallbackResultFileItem[]` | 文件数组 |
| errMsg | `string` | 调用结果 |

### GetSavedFileListSuccessCallbackResultFileItem

文件数组

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| createTime | `number` | 文件保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数 |
| filePath | `string` | 本地路径 |
| size | `number` | 本地文件大小，以字节为单位 |

### MkdirOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| dirPath | `string` | 是 | 创建的目录路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: MkdirFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| recursive | `boolean` | 否 | 是否在递归创建该目录的上级目录后再创建该目录。如果对应的上级目录已经存在，则不创建该上级目录。如 dirPath 为 a/b/c/d 且 recursive 为 true，将创建 a 目录，再在 a 目录下创建 b 目录，以此类推直至创建 a/b/c 目录下的 d 目录。 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### MkdirFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory ${dirPath}': 上级目录不存在;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有写权限;<br />- 'fail file already exists ${dirPath}': 有同名文件或目录; |

### ReadFileOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 要读取的文件的路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| encoding | "ascii" or "base64" or "binary" or "hex" or "ucs2" or "ucs-2" or "utf16le" or "utf-16le" or "utf-8" or "utf8" or "latin1" | 否 | 指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容 |
| fail | `(result: ReadFileFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### ReadFileFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory, open ${filePath}': 指定的 filePath 所在目录不存在;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有读权限; |

### ReaddirOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| dirPath | `string` | 是 | 要读取的目录路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: ReaddirFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: ReaddirSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### ReaddirFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory ${dirPath}': 目录不存在;<br />- 'fail not a directory ${dirPath}': dirPath 不是目录;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有读权限; |

### ReaddirSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| files | `string[]` | 指定目录下的文件名数组。 |
| errMsg | `string` | 调用结果 |

### RemoveSavedFileOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 需要删除的文件路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: RemoveSavedFileFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### RemoveSavedFileFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail file not exist': 指定的 tempFilePath 找不到文件; |

### RenameOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| newPath | `string` | 是 | 新文件路径 |
| oldPath | `string` | 是 | 源文件路径，可以是普通文件或目录 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: RenameFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### RenameFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail permission denied, rename ${oldPath} -> ${newPath}': 指定源文件或目标文件没有写权限;<br />- 'fail no such file or directory, rename ${oldPath} -> ${newPath}': 源文件不存在，或目标文件路径的上层目录不存在; |

### RmdirOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| dirPath | `string` | 是 | 要删除的目录路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: RmdirFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| recursive | `boolean` | 否 | 是否递归删除目录。如果为 true，则删除该目录和该目录下的所有子目录以及文件。 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### RmdirFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory ${dirPath}': 目录不存在;<br />- 'fail directory not empty': 目录不为空;<br />- 'fail permission denied, open ${dirPath}': 指定的 dirPath 路径没有写权限; |

### SaveFileOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| tempFilePath | `string` | 是 | 临时存储文件路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: SaveFileFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| filePath | `string` | 否 | 要存储的文件路径 |
| success | `(result: SaveFileSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SaveFileFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail tempFilePath file not exist': 指定的 tempFilePath 找不到文件;<br />- 'fail permission denied, open "${filePath}"': 指定的 filePath 路径没有写权限;<br />- 'fail no such file or directory "${dirPath}"': 上级目录不存在;<br />- 'fail the maximum size of the file storage limit is exceeded': 存储空间不足; |

### SaveFileSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| savedFilePath | `number` | 存储后的文件路径 |
| errMsg | `string` | 调用结果 |

### StatOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| path | `string` | 是 | 文件/目录路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: StatFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| recursive | `boolean` | 否 | 是否递归获取目录下的每个文件的 Stats 信息 |
| success | `(result: StatSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### StatFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail permission denied, open ${path}': 指定的 path 路径没有读权限;<br />- 'fail no such file or directory ${path}': 文件不存在; |

### StatSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| stats | Stats or Record<string, any> | [Stats](https://developers.weixin.qq.com/miniprogram/dev/api/file/Stats.html)orObject<br /><br />当 recursive 为 false 时，res.stats 是一个 Stats 对象。当 recursive 为 true 且 path 是一个目录的路径时，res.stats 是一个 Object，key 以 path 为根路径的相对路径，value 是该路径对应的 Stats 对象。 |
| errMsg | `string` | 调用结果 |

### UnlinkOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 要删除的文件路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: UnlinkFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### UnlinkFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail permission denied, open ${path}': 指定的 path 路径没有读权限;<br />- 'fail no such file or directory ${path}': 文件不存在;<br />- 'fail operation not permitted, unlink ${filePath}': 传入的 filePath 是一个目录; |

### UnzipOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| targetPath | `string` | 是 | 目标目录路径 |
| zipFilePath | `string` | 是 | 源文件路径，只可以是 zip 压缩文件 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: UnzipFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### UnzipFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail permission denied, unzip ${zipFilePath} -> ${destPath}': 指定目标文件路径没有写权限;<br />- 'fail no such file or directory, unzip ${zipFilePath} -> "${destPath}': 源文件不存在，或目标文件路径的上层目录不存在; |

### WriteFileOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| data | string or ArrayBuffer | 是 | 要写入的文本或二进制数据 |
| filePath | `string` | 是 | 要写入的文件路径 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| encoding | "ascii" or "base64" or "binary" or "hex" or "ucs2" or "ucs-2" or "utf16le" or "utf-16le" or "utf-8" or "utf8" or "latin1" | 否 | 指定写入文件的字符编码 |
| fail | `(result: WriteFileFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### WriteFileFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory, open ${filePath}': 指定的 filePath 所在目录不存在;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有写权限;<br />- 'fail the maximum size of the file storage limit is exceeded': 存储空间不足; |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.readdirSync | ✔️ |  |  |
| FileSystemManager.access | ✔️ |  |  |
| FileSystemManager.accessSync | ✔️ |  |  |
| FileSystemManager.appendFile | ✔️ |  |  |
| FileSystemManager.appendFileSync | ✔️ |  |  |
| FileSystemManager.copyFile | ✔️ |  |  |
| FileSystemManager.copyFileSync | ✔️ |  |  |
| FileSystemManager.getFileInfo | ✔️ |  |  |
| FileSystemManager.getSavedFileList | ✔️ |  |  |
| FileSystemManager.mkdir | ✔️ |  |  |
| FileSystemManager.mkdirSync | ✔️ |  |  |
| FileSystemManager.readFile | ✔️ |  |  |
| FileSystemManager.readdir | ✔️ |  |  |
| FileSystemManager.removeSavedFile | ✔️ |  |  |
| FileSystemManager.rename | ✔️ |  |  |
| FileSystemManager.renameSync | ✔️ |  |  |
| FileSystemManager.rmdir | ✔️ |  |  |
| FileSystemManager.rmdirSync | ✔️ |  |  |
| FileSystemManager.saveFile | ✔️ |  |  |
| FileSystemManager.stat |  |  |  |
| FileSystemManager.unlink | ✔️ |  |  |
| FileSystemManager.unlinkSync | ✔️ |  |  |
| FileSystemManager.unzip | ✔️ |  |  |
| FileSystemManager.writeFile | ✔️ |  |  |
| FileSystemManager.writeFileSync | ✔️ |  |  |
| FileSystemManager.statSync | ✔️ |  |  |
| FileSystemManager.saveFileSync | ✔️ |  |  |
| FileSystemManager.readFileSync | ✔️ |  |  |
