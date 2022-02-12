---
title: FileSystemManager
sidebar_label: FileSystemManager
---

文件管理器，可通过 [Taro.getFileSystemManager](./getFileSystemManager) 获取。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.html)

## 方法

### access

判断文件/目录是否存在

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.access.html)

```tsx
(option: AccessOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `AccessOption` |

### accessSync

[FileSystemManager.access](#access) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.accessSync.html)

```tsx
(path: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| path | `string` | 要判断是否存在的文件/目录路径 |

### appendFile

在文件结尾追加内容

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.appendFile.html)

```tsx
(option: AppendFileOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `AppendFileOption` |

### appendFileSync

[FileSystemManager.appendFile](#appendfile) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.appendFileSync.html)

```tsx
(filePath: string, data: string | ArrayBuffer, encoding?: keyof encoding) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| filePath | `string` | 要追加内容的文件路径 |
| data | string or ArrayBuffer | 要追加的文本或二进制数据 |
| encoding | `keyof encoding` | 指定写入文件的字符编码 |

### close

关闭文件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.close.html)

```tsx
(option: CloseOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `CloseOption` |

### closeSync

[FileSystemManager.close](#close) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.closeSync.html)

```tsx
(option: CloseSyncOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `CloseSyncOption` |

### copyFile

复制文件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.copyFile.html)

```tsx
(option: CopyFileOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `CopyFileOption` |

### copyFileSync

[FileSystemManager.copyFile](#copyfile) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.copyFileSync.html)

```tsx
(srcPath: string, destPath: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| srcPath | `string` | 源文件路径，只可以是普通文件 |
| destPath | `string` | 目标文件路径 |

### fstat

获取文件的状态信息

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.fstat.html)

```tsx
(option: FstatOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `FstatOption` |

### fstatSync

[FileSystemManager.fstat](#fstat) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.fstatSync.html)

```tsx
(option: FstatSyncOption) => Stats
```

| 参数 | 类型 |
| --- | --- |
| option | `FstatSyncOption` |

### ftruncate

对文件内容进行截断操作

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.ftruncate.html)

```tsx
(option: FtruncateOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `FtruncateOption` |

### ftruncateSync

[FileSystemManager.ftruncate](#ftruncate) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.ftruncateSync.html)

```tsx
(option: FtruncateSyncOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `FtruncateSyncOption` |

### getFileInfo

获取该小程序下的 `本地临时文件` 或 `本地缓存文件` 信息

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.getFileInfo.html)

```tsx
(option: getFileInfoOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `getFileInfoOption` |

### getSavedFileList

获取该小程序下已保存的本地缓存文件列表

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.getSavedFileList.html)

```tsx
(option?: getSavedFileListOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `getSavedFileListOption` |

### mkdir

创建目录

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.mkdir.html)

```tsx
(option: MkdirOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `MkdirOption` |

### mkdirSync

[FileSystemManager.mkdir](#mkdir) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.mkdirSync.html)

```tsx
(dirPath: string, recursive?: boolean) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| dirPath | `string` | 创建的目录路径 |
| recursive | `boolean` | 是否在递归创建该目录的上级目录后再创建该目录。如果对应的上级目录已经存在，则不创建该上级目录。如 dirPath 为 a/b/c/d 且 recursive 为 true，将创建 a 目录，再在 a 目录下创建 b 目录，以此类推直至创建 a/b/c 目录下的 d 目录。 |

### open

打开文件，返回文件描述符

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.open.html)

```tsx
(option: OpenOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `OpenOption` |

### openSync

[FileSystemManager.openSync](#opensync) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.ftruncateSync.html)

```tsx
(option: OpenSyncOption) => string
```

| 参数 | 类型 |
| --- | --- |
| option | `OpenSyncOption` |

### read

读文件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.read.html)

```tsx
(option: ReadOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `ReadOption` |

### readCompressedFile

读取指定压缩类型的本地文件内容

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readCompressedFile.html)

```tsx
(option: Option) => Promise<Promised>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### readCompressedFileSync

同步读取指定压缩类型的本地文件内容

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readCompressedFileSync.html)

```tsx
(option: Option) => ArrayBuffer
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### readdir

读取目录内文件列表

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readdir.html)

```tsx
(option: ReaddirOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `ReaddirOption` |

### readdirSync

[FileSystemManager.readdir](#readdir) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readdirSync.html)

```tsx
(dirPath: string) => string[]
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| dirPath | `string` | 要读取的目录路径 |

### readFile

读取本地文件内容

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readFile.html)

```tsx
(option: ReadFileOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `ReadFileOption` |

### readFileSync

[FileSystemManager.readFile](#readfile) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readFileSync.html)

```tsx
(filePath: string, encoding?: keyof encoding, position?: number, length?: number) => string | ArrayBuffer
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| filePath | `string` | 要读取的文件的路径 |
| encoding | `keyof encoding` | 指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容 |
| position | `number` | 从文件指定位置开始读，如果不指定，则从文件头开始读。读取的范围应该是左闭右开区间 [position, position+length)。有效范围：[0, fileLength - 1]。单位：byte |
| length | `number` | 指定文件的长度，如果不指定，则读到文件末尾。有效范围：[1, fileLength]。单位：byte |

### readSync

[FileSystemManager.read](#read) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readSync.html)

```tsx
(option: ReadSyncOption) => { bytesRead: number; arrayBuffer: ArrayBuffer; }
```

| 参数 | 类型 |
| --- | --- |
| option | `ReadSyncOption` |

### readZipEntry

读取压缩包内的文件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readZipEntry.html)

```tsx
(option: Option) => Promise<Promised>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### removeSavedFile

删除该小程序下已保存的本地缓存文件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.removeSavedFile.html)

```tsx
(option: RemoveSavedFileOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `RemoveSavedFileOption` |

### rename

重命名文件。可以把文件从 oldPath 移动到 newPath

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.rename.html)

```tsx
(option: RenameOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `RenameOption` |

### renameSync

[FileSystemManager.rename](#rename) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.renameSync.html)

```tsx
(oldPath: string, newPath: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| oldPath | `string` | 源文件路径，可以是普通文件或目录 |
| newPath | `string` | 新文件路径 |

### rmdir

删除目录

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.rmdir.html)

```tsx
(option: RmdirOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `RmdirOption` |

### rmdirSync

[FileSystemManager.rmdir](#rmdir) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.rmdirSync.html)

```tsx
(dirPath: string, recursive?: boolean) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| dirPath | `string` | 要删除的目录路径 |
| recursive | `boolean` | 是否递归删除目录。如果为 true，则删除该目录和该目录下的所有子目录以及文件。 |

### saveFile

保存临时文件到本地。此接口会移动临时文件，因此调用成功后，tempFilePath 将不可用。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.saveFile.html)

```tsx
(option: SaveFileOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `SaveFileOption` |

### saveFileSync

[FileSystemManager.saveFile](#savefile) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.saveFileSync.html)

```tsx
(tempFilePath: string, filePath?: string) => string
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tempFilePath | `string` | 临时存储文件路径 |
| filePath | `string` | 要存储的文件路径 |

### stat

获取文件 Stats 对象

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

```tsx
(option: StatOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `StatOption` |

### statSync

[FileSystemManager.stat](#stat) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.statSync.html)

```tsx
(path: string, recursive?: boolean) => any
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| path | `string` | 文件/目录路径 |
| recursive | `boolean` | 是否递归获取目录下的每个文件的 Stats 信息 |

### truncate

对文件内容进行截断操作

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.truncate.html)

```tsx
(option: TruncateOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `TruncateOption` |

### truncateSync

对文件内容进行截断操作 ([truncate](#truncate) 的同步版本)

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.truncateSync.html)

```tsx
(option: TruncateSyncOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `TruncateSyncOption` |

### unlink

删除文件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.unlink.html)

```tsx
(option: UnlinkOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `UnlinkOption` |

### unlinkSync

[FileSystemManager.unlink](#unlink) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.unlinkSync.html)

```tsx
(filePath: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| filePath | `string` | 要删除的文件路径 |

### unzip

解压文件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.unzip.html)

```tsx
(option: UnzipOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `UnzipOption` |

### write

写入文件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.write.html)

```tsx
(option: WriteOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `WriteOption` |

### writeFile

写文件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.writeFile.html)

```tsx
(option: WriteFileOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `WriteFileOption` |

### writeFileSync

[FileSystemManager.writeFile](#writefile) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.writeFileSync.html)

```tsx
(filePath: string, data: string | ArrayBuffer, encoding?: keyof encoding) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| filePath | `string` | 要写入的文件路径 |
| data | string or ArrayBuffer | 要写入的文本或二进制数据 |
| encoding | `keyof encoding` | 指定写入文件的字符编码 |

### writeSync

[write](#write) 的同步版本

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.writeSync.html)

```tsx
(option: WriteSyncOption) => { bytesWritten: number; }
```

| 参数 | 类型 |
| --- | --- |
| option | `WriteSyncOption` |

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

### flag

文件系统标志

### AccessOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| path | `string` | 是 | 要判断是否存在的文件/目录路径 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: AccessFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### AccessFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory ${path}': 文件/目录不存在; |

### AppendFileOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| data | string or ArrayBuffer | 是 | 要追加的文本或二进制数据 |
| filePath | `string` | 是 | 要追加内容的文件路径 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| encoding | `keyof encoding` | 否 | 指定写入文件的字符编码 |
| fail | `(result: AppendFileFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### AppendFileFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory, open ${filePath}': 指定的 filePath 文件不存在;<br />- 'fail illegal operation on a directory, open "${filePath}"': 指定的 filePath 是一个已经存在的目录;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有写权限;<br />- 'fail sdcard not mounted': 指定的 filePath 是一个已经存在的目录; |

### CopyFileOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| destPath | `string` | 是 | 目标文件路径 |
| srcPath | `string` | 是 | 源文件路径，只可以是普通文件 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: CopyFileFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### CopyFileFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail permission denied, copyFile ${srcPath} -> ${destPath}': 指定目标文件路径没有写权限;<br />- 'fail no such file or directory, copyFile ${srcPath} -> ${destPath}': 源文件不存在，或目标文件路径的上层目录不存在;<br />- 'fail the maximum size of the file storage limit is exceeded': 存储空间不足; |

### getFileInfoOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 要读取的文件路径 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
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
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
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
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: MkdirFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| recursive | `boolean` | 否 | 是否在递归创建该目录的上级目录后再创建该目录。如果对应的上级目录已经存在，则不创建该上级目录。如 dirPath 为 a/b/c/d 且 recursive 为 true，将创建 a 目录，再在 a 目录下创建 b 目录，以此类推直至创建 a/b/c 目录下的 d 目录。 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### MkdirFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory ${dirPath}': 上级目录不存在;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有写权限;<br />- 'fail file already exists ${dirPath}': 有同名文件或目录; |

### ReadFileOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 要读取的文件的路径 |
| position | `number` | 否 | 从文件指定位置开始读，如果不指定，则从文件头开始读。读取的范围应该是左闭右开区间 [position, position+length)。有效范围：[0, fileLength - 1]。单位：byte |
| length | `number` | 否 | 指定文件的长度，如果不指定，则读到文件末尾。有效范围：[1, fileLength]。单位：byte |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| encoding | `keyof encoding` | 否 | 指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容 |
| fail | `(result: ReadFileFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: ReadFileSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### ReadFileSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| data | string or ArrayBuffer | 文件内容 |
| errMsg | `string` | 调用结果 |

### ReadFileFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory, open ${filePath}': 指定的 filePath 所在目录不存在;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有读权限; |

### ReaddirOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| dirPath | `string` | 是 | 要读取的目录路径 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
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

### readZipEntry

#### Promised

```tsx
FailCallbackResult | SuccessCallbackResult
```

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 要读取的压缩包的路径 (本地路径) |
| encoding | `string` | 否 | 统一指定读取文件的字符编码，只在 entries 值为"all"时有效。如果 entries 值为"all"且不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容 |
| entries | File[] or "all" | 是 | 要读取的压缩包内的文件列表（当传入"all" 时表示读取压缩包内所有文件） |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: FailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

#### File

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| path | `string` | 是 | 压缩包内文件路径 |
| encoding | `string` | 否 | 指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容 |
| position | `number` | 否 | 从文件指定位置开始读，如果不指定，则从文件头开始读。读取的范围应该是左闭右开区间 [position, position+length)。有效范围：[0, fileLength - 1]。单位：byte |
| length | `number` | 否 | 指定文件的长度，如果不指定，则读到文件末尾。有效范围：[1, fileLength]。单位：byte |

#### Encoding

字符编码合法值

| 参数 | 异常情况 |
| --- | :---: |
| ascii |  |
| base64 |  |
| binary |  |
| hex |  |
| ucs2 | `以小端序读取` |
| ucs-2 | `以小端序读取` |
| utf16le | `以小端序读取` |
| utf-16le | `以小端序读取` |
| utf-8 |  |
| utf8 |  |
| latin1 |  |

#### FailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory, open ${filePath}': 指定的 filePath 所在目录不存在<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有读权限<br />- 'fail sdcard not mounted': Android sdcard 挂载失败 |

#### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| entries | `{ [path: string]: FileItem; }` | 文件读取结果。res.entries 是一个对象，key是文件路径，value是一个对象 FileItem ，表示该文件的读取结果。每个 FileItem 包含 data （文件内容） 和 errMsg （错误信息） 属性。 |

#### FileItem

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| data | string or ArrayBuffer | 文件内容 |
| errMsg | `string` | 错误信息 |

### RemoveSavedFileOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 需要删除的文件路径 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: RemoveSavedFileFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### RemoveSavedFileFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail file not exist': 指定的 tempFilePath 找不到文件; |

### RenameOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| newPath | `string` | 是 | 新文件路径 |
| oldPath | `string` | 是 | 源文件路径，可以是普通文件或目录 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: RenameFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### RenameFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail permission denied, rename ${oldPath} -> ${newPath}': 指定源文件或目标文件没有写权限;<br />- 'fail no such file or directory, rename ${oldPath} -> ${newPath}': 源文件不存在，或目标文件路径的上层目录不存在; |

### RmdirOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| dirPath | `string` | 是 | 要删除的目录路径 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: RmdirFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| recursive | `boolean` | 否 | 是否递归删除目录。如果为 true，则删除该目录和该目录下的所有子目录以及文件。 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### RmdirFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory ${dirPath}': 目录不存在;<br />- 'fail directory not empty': 目录不为空;<br />- 'fail permission denied, open ${dirPath}': 指定的 dirPath 路径没有写权限; |

### SaveFileOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| tempFilePath | `string` | 是 | 临时存储文件路径 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
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
| savedFilePath | `string` | 存储后的文件路径 |
| errMsg | `string` | 调用结果 |

### StatOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| path | `string` | 是 | 文件/目录路径 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
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
| stats | `any` | [Stats](/docs/apis/files/Stats) or Object<br /><br />当 recursive 为 false 时，res.stats 是一个 Stats 对象。当 recursive 为 true 且 path 是一个目录的路径时，res.stats 是一个 Object，key 以 path 为根路径的相对路径，value 是该路径对应的 Stats 对象。 |
| errMsg | `string` | 调用结果 |

### UnlinkOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 要删除的文件路径 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: UnlinkFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### UnlinkFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail permission denied, open ${path}': 指定的 path 路径没有读权限;<br />- 'fail no such file or directory ${path}': 文件不存在;<br />- 'fail operation not permitted, unlink ${filePath}': 传入的 filePath 是一个目录; |

### UnzipOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| targetPath | `string` | 是 | 目标目录路径 |
| zipFilePath | `string` | 是 | 源文件路径，只可以是 zip 压缩文件 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: UnzipFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### UnzipFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail permission denied, unzip ${zipFilePath} -> ${destPath}': 指定目标文件路径没有写权限;<br />- 'fail no such file or directory, unzip ${zipFilePath} -> "${destPath}': 源文件不存在，或目标文件路径的上层目录不存在; |

### WriteFileOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| data | string or ArrayBuffer | 是 | 要写入的文本或二进制数据 |
| filePath | `string` | 是 | 要写入的文件路径 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| encoding | `keyof encoding` | 否 | 指定写入文件的字符编码 |
| fail | `(result: WriteFileFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### WriteFileFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory, open ${filePath}': 指定的 filePath 所在目录不存在;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有写权限;<br />- 'fail the maximum size of the file storage limit is exceeded': 存储空间不足; |

### FstatOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| fd | `string` | 是 | 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: FstatFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: FstatSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### FstatFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'bad file descriptor': 无效的文件描述符;<br />- 'fail permission denied': 指定的 fd 路径没有读权限; |

### FstatSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| stats | `Stats` | Stats 对象，包含了文件的状态信息 |
| errMsg | `string` | 调用结果 |

### FstatSyncOption

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| fd | `string` | 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 |

### CloseOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| fd | `string` | 是 | 需要被关闭的文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: CloseFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### CloseFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'bad file descriptor': 无效的文件描述符 |

### CloseSyncOption

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| fd | `string` | 需要被关闭的文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 |

### FtruncateOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| fd | `string` | 是 | 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 |
| length | `number` | 是 | 截断位置，默认0。如果 length 小于文件长度（单位：字节），则只有前面 length 个字节会保留在文件中，其余内容会被删除；如果 length 大于文件长度，则会对其进行扩展，并且扩展部分将填充空字节（'\0'） |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: FtruncateFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### FtruncateFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'bad file descriptor': 无效的文件描述符<br />- 'fail permission denied': 指定的 fd 没有写权限<br />- 'fail the maximum size of the file storage limit is exceeded': 存储空间不足<br />- 'fail sdcard not mounted android sdcard': 挂载失败 |

### FtruncateSyncOption

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| fd | `string` | 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 |
| length | `number` | 截断位置，默认0。如果 length 小于文件长度（单位：字节），则只有前面 length 个字节会保留在文件中，其余内容会被删除；如果 length 大于文件长度，则会对其进行扩展，并且扩展部分将填充空字节（'\0'） |

### OpenOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 文件路径 (本地路径) |
| flag | `keyof flag` | 否 | 文件系统标志，默认值: 'r' |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: OpenFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: OpenSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### OpenFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory "${filePath}"': 上级目录不存在 |

### OpenSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| fd | `string` | 文件描述符 |
| errMsg | `string` | 调用结果 |

### OpenSyncOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 文件路径 (本地路径) |
| flag | `keyof flag` | 否 | 文件系统标志，默认值: 'r' |

### ReadOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| fd | `string` | 是 | 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 |
| arrayBuffer | `ArrayBuffer` | 是 | 数据写入的缓冲区，必须是 ArrayBuffer 实例 |
| offset | `number` | 否 | 缓冲区中的写入偏移量，默认0 |
| length | `number` | 否 | 要从文件中读取的字节数，默认0 |
| position | `number` | 否 | 文件读取的起始位置，如不传或传 null，则会从当前文件指针的位置读取。如果 position 是正整数，则文件指针位置会保持不变并从 position 读取文件。 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: ReadFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: ReadSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### ReadFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'bad file descriptor': 无效的文件描述符<br />- 'fail permission denied': 指定的 fd 路径没有读权限<br />- 'fail the value of "offset" is out of range': 传入的 offset 不合法<br />- 'fail the value of "length" is out of range': 传入的 length 不合法<br />- 'fail sdcard not mounted': android sdcard 挂载失败<br />- 'bad file descriptor': 无效的文件描述符 |

### ReadSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| bytesRead | `string` | 实际读取的字节数 |
| arrayBuffer | `ArrayBuffer` | 被写入的缓存区的对象，即接口入参的 arrayBuffer |
| errMsg | `string` | 调用结果 |

### readCompressedFile

#### Promised

```tsx
FailCallbackResult | SuccessCallbackResult
```

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 要读取的文件的路径 (本地用户文件或代码包文件) |
| compressionAlgorithm | `string` | 是 | 文件压缩类型，目前仅支持 'br'。 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: FailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

#### CompressionAlgorithm

文件压缩类型合法值

| 参数 | 说明 |
| --- | --- |
| br | brotli压缩文件 |

#### FailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail decompress fail': 指定的 compressionAlgorithm 与文件实际压缩格式不符<br />- 'fail no such file or directory, open ${filePath}': 指定的 filePath 所在目录不存在<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有读权限 |

#### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| data | `ArrayBuffer` | 文件内容 |

### readCompressedFileSync

#### Option

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| filePath | `string` | 要读取的文件的路径 (本地用户文件或代码包文件) |
| compressionAlgorithm | `string` | 文件压缩类型，目前仅支持 'br'。 |

#### CompressionAlgorithm

文件压缩类型合法值

| 参数 | 说明 |
| --- | --- |
| br | brotli压缩文件 |

### ReadSyncOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| fd | `string` | 是 | 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 |
| arrayBuffer | `ArrayBuffer` | 是 | 数据写入的缓冲区，必须是 ArrayBuffer 实例 |
| offset | `number` | 否 | 缓冲区中的写入偏移量，默认0 |
| length | `number` | 否 | 要从文件中读取的字节数，默认0 |
| position | `number` | 否 | 文件读取的起始位置，如不传或传 null，则会从当前文件指针的位置读取。如果 position 是正整数，则文件指针位置会保持不变并从 position 读取文件。 |

### TruncateOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 要截断的文件路径 (本地路径) |
| length | `number` | 否 | 截断位置，默认0。如果 length 小于文件长度（字节），则只有前面 length 个字节会保留在文件中，其余内容会被删除；如果 length 大于文件长度，则会对其进行扩展，并且扩展部分将填充空字节（'\0'） |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: TruncateFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### TruncateFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'fail no such file or directory, open ${filePath}': 指定的 filePath 所在目录不存在<br />- 'fail illegal operation on a directory, open "${filePath}"': 指定的 filePath 是一个已经存在的目录<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有写权限<br />- 'fail the maximum size of the file storage limit is exceeded': 存储空间不足<br />- 'fail sdcard not mounted': android sdcard 挂载失败 |

### TruncateSyncOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| filePath | `string` | 是 | 要截断的文件路径 (本地路径) |
| length | `number` | 否 | 截断位置，默认0。如果 length 小于文件长度（字节），则只有前面 length 个字节会保留在文件中，其余内容会被删除；如果 length 大于文件长度，则会对其进行扩展，并且扩展部分将填充空字节（'\0'） |

### WriteOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| fd | `string` | 是 | 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 |
| data | string or ArrayBuffer | 是 | 写入的内容，类型为 String 或 ArrayBuffer |
| offset | `number` | 否 | 只在 data 类型是 ArrayBuffer 时有效，决定 arrayBuffe 中要被写入的部位，即 arrayBuffer 中的索引，默认0 |
| length | `number` | 否 | 只在 data 类型是 ArrayBuffer 时有效，指定要写入的字节数，默认为 arrayBuffer 从0开始偏移 offset 个字节后剩余的字节数 |
| encoding | `keyof encoding` | 否 | 只在 data 类型是 String 时有效，指定写入文件的字符编码，默认为 utf8 |
| position | `number` | 否 | 指定文件开头的偏移量，即数据要被写入的位置。当 position 不传或者传入非 Number 类型的值时，数据会被写入当前指针所在位置。 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: WriteFailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: WriteSuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### WriteFailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />'bad file descriptor': 无效的文件描述符<br />'fail permission denied': 指定的 fd 路径没有写权限<br />'fail sdcard not mounted': android sdcard 挂载失败 |

### WriteSuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| bytesWritten | `number` | 实际被写入到文件中的字节数（注意，被写入的字节数不一定与被写入的字符串字符数相同） |
| errMsg | `string` | 调用结果 |

### WriteSyncOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| fd | `string` | 是 | 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 |
| data | string or ArrayBuffer | 是 | 写入的内容，类型为 String 或 ArrayBuffer |
| offset | `number` | 否 | 只在 data 类型是 ArrayBuffer 时有效，决定 arrayBuffe 中要被写入的部位，即 arrayBuffer 中的索引，默认0 |
| length | `number` | 否 | 只在 data 类型是 ArrayBuffer 时有效，指定要写入的字节数，默认为 arrayBuffer 从0开始偏移 offset 个字节后剩余的字节数 |
| encoding | `keyof encoding` | 否 | 只在 data 类型是 String 时有效，指定写入文件的字符编码，默认为 utf8 |
| position | `number` | 否 | 指定文件开头的偏移量，即数据要被写入的位置。当 position 不传或者传入非 Number 类型的值时，数据会被写入当前指针所在位置。 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager | ✔️ |  |  |
| FileSystemManager.access | ✔️ |  |  |
| FileSystemManager.accessSync | ✔️ |  |  |
| FileSystemManager.appendFile | ✔️ |  |  |
| FileSystemManager.appendFileSync | ✔️ |  |  |
| FileSystemManager.close | ✔️ |  |  |
| FileSystemManager.closeSync | ✔️ |  |  |
| FileSystemManager.copyFile | ✔️ |  |  |
| FileSystemManager.copyFileSync | ✔️ |  |  |
| FileSystemManager.fstat | ✔️ |  |  |
| FileSystemManager.fstatSync | ✔️ |  |  |
| FileSystemManager.ftruncate | ✔️ |  |  |
| FileSystemManager.ftruncateSync | ✔️ |  |  |
| FileSystemManager.getFileInfo | ✔️ |  |  |
| FileSystemManager.getSavedFileList | ✔️ |  |  |
| FileSystemManager.mkdir | ✔️ |  |  |
| FileSystemManager.mkdirSync | ✔️ |  |  |
| FileSystemManager.open | ✔️ |  |  |
| FileSystemManager.openSync | ✔️ |  |  |
| FileSystemManager.read | ✔️ |  |  |
| FileSystemManager.readCompressedFile | ✔️ |  |  |
| FileSystemManager.readCompressedFileSync | ✔️ |  |  |
| FileSystemManager.readdir | ✔️ |  |  |
| FileSystemManager.readdirSync | ✔️ |  |  |
| FileSystemManager.readFile | ✔️ |  |  |
| FileSystemManager.readFileSync | ✔️ |  |  |
| FileSystemManager.readSync | ✔️ |  |  |
| FileSystemManager.readZipEntry | ✔️ |  |  |
| FileSystemManager.removeSavedFile | ✔️ |  |  |
| FileSystemManager.rename | ✔️ |  |  |
| FileSystemManager.renameSync | ✔️ |  |  |
| FileSystemManager.rmdir | ✔️ |  |  |
| FileSystemManager.rmdirSync | ✔️ |  |  |
| FileSystemManager.saveFile | ✔️ |  |  |
| FileSystemManager.saveFileSync | ✔️ |  |  |
| FileSystemManager.stat |  |  |  |
| FileSystemManager.statSync | ✔️ |  |  |
| FileSystemManager.truncate | ✔️ |  |  |
| FileSystemManager.truncateSync | ✔️ |  |  |
| FileSystemManager.unlink | ✔️ |  |  |
| FileSystemManager.unlinkSync | ✔️ |  |  |
| FileSystemManager.unzip | ✔️ |  |  |
| FileSystemManager.write | ✔️ |  |  |
| FileSystemManager.writeFile | ✔️ |  |  |
| FileSystemManager.writeFileSync | ✔️ |  |  |
| FileSystemManager.writeSync | ✔️ |  |  |
