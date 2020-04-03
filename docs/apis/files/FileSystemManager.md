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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dirPath</td>
      <td><code>string</code></td>
      <td>要读取的目录路径</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>AccessOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td>要判断是否存在的文件/目录路径</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>AppendFileOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>要追加内容的文件路径</td>
    </tr>
    <tr>
      <td>data</td>
      <td><code>string | ArrayBuffer</code></td>
      <td>要追加的文本或二进制数据</td>
    </tr>
    <tr>
      <td>encoding</td>
      <td><code>&quot;ascii&quot; | &quot;base64&quot; | &quot;binary&quot; | &quot;hex&quot; | &quot;ucs2&quot; | &quot;ucs-2&quot; | &quot;utf16le&quot; | &quot;utf-16le&quot; | &quot;utf-8&quot; | &quot;utf8&quot; | &quot;latin1&quot;</code></td>
      <td>指定写入文件的字符编码</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>CopyFileOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>srcPath</td>
      <td><code>string</code></td>
      <td>源文件路径，只可以是普通文件</td>
    </tr>
    <tr>
      <td>destPath</td>
      <td><code>string</code></td>
      <td>目标文件路径</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>getFileInfoOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>getSavedFileListOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>MkdirOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dirPath</td>
      <td><code>string</code></td>
      <td>创建的目录路径</td>
    </tr>
    <tr>
      <td>recursive</td>
      <td><code>boolean</code></td>
      <td>是否在递归创建该目录的上级目录后再创建该目录。如果对应的上级目录已经存在，则不创建该上级目录。如 dirPath 为 a/b/c/d 且 recursive 为 true，将创建 a 目录，再在 a 目录下创建 b 目录，以此类推直至创建 a/b/c 目录下的 d 目录。</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>ReadFileOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>ReaddirOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>RemoveSavedFileOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>RenameOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>oldPath</td>
      <td><code>string</code></td>
      <td>源文件路径，可以是普通文件或目录</td>
    </tr>
    <tr>
      <td>newPath</td>
      <td><code>string</code></td>
      <td>新文件路径</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>RmdirOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dirPath</td>
      <td><code>string</code></td>
      <td>要删除的目录路径</td>
    </tr>
    <tr>
      <td>recursive</td>
      <td><code>boolean</code></td>
      <td>是否递归删除目录。如果为 true，则删除该目录和该目录下的所有子目录以及文件。</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>SaveFileOption</code></td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.saveFile | ✔️ |  |  |

### stat

获取文件 Stats 对象

```tsx
(option: StatOption) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>StatOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>UnlinkOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>要删除的文件路径</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>UnzipOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>WriteFileOption</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>要写入的文件路径</td>
    </tr>
    <tr>
      <td>data</td>
      <td><code>string | ArrayBuffer</code></td>
      <td>要写入的文本或二进制数据</td>
    </tr>
    <tr>
      <td>encoding</td>
      <td><code>&quot;ascii&quot; | &quot;base64&quot; | &quot;binary&quot; | &quot;hex&quot; | &quot;ucs2&quot; | &quot;ucs-2&quot; | &quot;utf16le&quot; | &quot;utf-16le&quot; | &quot;utf-8&quot; | &quot;utf8&quot; | &quot;latin1&quot;</code></td>
      <td>指定写入文件的字符编码</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td>文件/目录路径</td>
    </tr>
    <tr>
      <td>recursive</td>
      <td><code>boolean</code></td>
      <td>是否递归获取目录下的每个文件的 Stats 信息</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td>临时存储文件路径</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>要存储的文件路径</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>要读取的文件的路径</td>
    </tr>
    <tr>
      <td>encoding</td>
      <td><code>&quot;ascii&quot; | &quot;base64&quot; | &quot;binary&quot; | &quot;hex&quot; | &quot;ucs2&quot; | &quot;ucs-2&quot; | &quot;utf16le&quot; | &quot;utf-16le&quot; | &quot;utf-8&quot; | &quot;utf8&quot; | &quot;latin1&quot;</code></td>
      <td>指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.readFileSync | ✔️ |  |  |

## 参数

### encoding

字符编码

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ascii</td>
      <td></td>
    </tr>
    <tr>
      <td>base64</td>
      <td></td>
    </tr>
    <tr>
      <td>binary</td>
      <td></td>
    </tr>
    <tr>
      <td>hex</td>
      <td></td>
    </tr>
    <tr>
      <td>ucs2</td>
      <td>以小端序读取</td>
    </tr>
    <tr>
      <td>ucs-2</td>
      <td>以小端序读取</td>
    </tr>
    <tr>
      <td>utf16le</td>
      <td>以小端序读取</td>
    </tr>
    <tr>
      <td>utf-16le</td>
      <td>以小端序读取</td>
    </tr>
    <tr>
      <td>utf-8</td>
      <td></td>
    </tr>
    <tr>
      <td>utf8</td>
      <td></td>
    </tr>
    <tr>
      <td>latin1</td>
      <td></td>
    </tr>
  </tbody>
</table>

### AccessOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>要判断是否存在的文件/目录路径</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: AccessFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### AccessFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail no such file or directory ${path}': 文件/目录不存在;</td>
    </tr>
  </tbody>
</table>

### AppendFileOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td><code>string | ArrayBuffer</code></td>
      <td style="text-align:center">是</td>
      <td>要追加的文本或二进制数据</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>要追加内容的文件路径</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>encoding</td>
      <td><code>&quot;ascii&quot; | &quot;base64&quot; | &quot;binary&quot; | &quot;hex&quot; | &quot;ucs2&quot; | &quot;ucs-2&quot; | &quot;utf16le&quot; | &quot;utf-16le&quot; | &quot;utf-8&quot; | &quot;utf8&quot; | &quot;latin1&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>指定写入文件的字符编码</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: AppendFileFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### AppendFileFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail no such file or directory, open ${filePath}': 指定的 filePath 文件不存在;<br />- 'fail illegal operation on a directory, open &quot;${filePath}&quot;': 指定的 filePath 是一个已经存在的目录;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有写权限;<br />- 'fail sdcard not mounted': 指定的 filePath 是一个已经存在的目录;</td>
    </tr>
  </tbody>
</table>

### CopyFileOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>destPath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>目标文件路径</td>
    </tr>
    <tr>
      <td>srcPath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>源文件路径，只可以是普通文件</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: CopyFileFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### CopyFileFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail permission denied, copyFile ${srcPath} -&gt; ${destPath}': 指定目标文件路径没有写权限;<br />- 'fail no such file or directory, copyFile ${srcPath} -&gt; ${destPath}': 源文件不存在，或目标文件路径的上层目录不存在;<br />- 'fail the maximum size of the file storage limit is exceeded': 存储空间不足;</td>
    </tr>
  </tbody>
</table>

### getFileInfoOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>要读取的文件路径</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: GetFileInfoFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: GetFileInfoSuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### GetFileInfoFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail file not exist': 指定的 filePath 找不到文件;</td>
    </tr>
  </tbody>
</table>

### GetFileInfoSuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>文件大小，以字节为单位</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### getSavedFileListOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: GetSavedFileListSuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### GetSavedFileListSuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>fileList</td>
      <td><code>GetSavedFileListSuccessCallbackResultFileItem[]</code></td>
      <td>文件数组</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### GetSavedFileListSuccessCallbackResultFileItem

文件数组

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>createTime</td>
      <td><code>number</code></td>
      <td>文件保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>本地路径</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>本地文件大小，以字节为单位</td>
    </tr>
  </tbody>
</table>

### MkdirOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dirPath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>创建的目录路径</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: MkdirFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>recursive</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否在递归创建该目录的上级目录后再创建该目录。如果对应的上级目录已经存在，则不创建该上级目录。如 dirPath 为 a/b/c/d 且 recursive 为 true，将创建 a 目录，再在 a 目录下创建 b 目录，以此类推直至创建 a/b/c 目录下的 d 目录。</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### MkdirFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail no such file or directory ${dirPath}': 上级目录不存在;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有写权限;<br />- 'fail file already exists ${dirPath}': 有同名文件或目录;</td>
    </tr>
  </tbody>
</table>

### ReadFileOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>要读取的文件的路径</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>encoding</td>
      <td><code>&quot;ascii&quot; | &quot;base64&quot; | &quot;binary&quot; | &quot;hex&quot; | &quot;ucs2&quot; | &quot;ucs-2&quot; | &quot;utf16le&quot; | &quot;utf-16le&quot; | &quot;utf-8&quot; | &quot;utf8&quot; | &quot;latin1&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: ReadFileFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### ReadFileFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail no such file or directory, open ${filePath}': 指定的 filePath 所在目录不存在;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有读权限;</td>
    </tr>
  </tbody>
</table>

### ReaddirOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dirPath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>要读取的目录路径</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: ReaddirFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: ReaddirSuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### ReaddirFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail no such file or directory ${dirPath}': 目录不存在;<br />- 'fail not a directory ${dirPath}': dirPath 不是目录;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有读权限;</td>
    </tr>
  </tbody>
</table>

### ReaddirSuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>files</td>
      <td><code>string[]</code></td>
      <td>指定目录下的文件名数组。</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### RemoveSavedFileOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>需要删除的文件路径</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: RemoveSavedFileFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### RemoveSavedFileFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail file not exist': 指定的 tempFilePath 找不到文件;</td>
    </tr>
  </tbody>
</table>

### RenameOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>newPath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>新文件路径</td>
    </tr>
    <tr>
      <td>oldPath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>源文件路径，可以是普通文件或目录</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: RenameFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### RenameFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail permission denied, rename ${oldPath} -&gt; ${newPath}': 指定源文件或目标文件没有写权限;<br />- 'fail no such file or directory, rename ${oldPath} -&gt; ${newPath}': 源文件不存在，或目标文件路径的上层目录不存在;</td>
    </tr>
  </tbody>
</table>

### RmdirOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dirPath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>要删除的目录路径</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: RmdirFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>recursive</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否递归删除目录。如果为 true，则删除该目录和该目录下的所有子目录以及文件。</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### RmdirFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail no such file or directory ${dirPath}': 目录不存在;<br />- 'fail directory not empty': 目录不为空;<br />- 'fail permission denied, open ${dirPath}': 指定的 dirPath 路径没有写权限;</td>
    </tr>
  </tbody>
</table>

### SaveFileOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>临时存储文件路径</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: SaveFileFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>要存储的文件路径</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SaveFileSuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### SaveFileFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail tempFilePath file not exist': 指定的 tempFilePath 找不到文件;<br />- 'fail permission denied, open &quot;${filePath}&quot;': 指定的 filePath 路径没有写权限;<br />- 'fail no such file or directory &quot;${dirPath}&quot;': 上级目录不存在;<br />- 'fail the maximum size of the file storage limit is exceeded': 存储空间不足;</td>
    </tr>
  </tbody>
</table>

### SaveFileSuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>savedFilePath</td>
      <td><code>number</code></td>
      <td>存储后的文件路径</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### StatOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>文件/目录路径</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: StatFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>recursive</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否递归获取目录下的每个文件的 Stats 信息</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: StatSuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### StatFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail permission denied, open ${path}': 指定的 path 路径没有读权限;<br />- 'fail no such file or directory ${path}': 文件不存在;</td>
    </tr>
  </tbody>
</table>

### StatSuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>stats</td>
      <td><code>Stats | Record&lt;string, any&gt;</code></td>
      <td><a href="https://developers.weixin.qq.com/miniprogram/dev/api/file/Stats.html">Stats</a></td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### UnlinkOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>要删除的文件路径</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: UnlinkFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### UnlinkFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail permission denied, open ${path}': 指定的 path 路径没有读权限;<br />- 'fail no such file or directory ${path}': 文件不存在;<br />- 'fail operation not permitted, unlink ${filePath}': 传入的 filePath 是一个目录;</td>
    </tr>
  </tbody>
</table>

### UnzipOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>targetPath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>目标目录路径</td>
    </tr>
    <tr>
      <td>zipFilePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>源文件路径，只可以是 zip 压缩文件</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: UnzipFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### UnzipFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail permission denied, unzip ${zipFilePath} -&gt; ${destPath}': 指定目标文件路径没有写权限;<br />- 'fail no such file or directory, unzip ${zipFilePath} -&gt; &quot;${destPath}': 源文件不存在，或目标文件路径的上层目录不存在;</td>
    </tr>
  </tbody>
</table>

### WriteFileOption

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td><code>string | ArrayBuffer</code></td>
      <td style="text-align:center">是</td>
      <td>要写入的文本或二进制数据</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>要写入的文件路径</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>encoding</td>
      <td><code>&quot;ascii&quot; | &quot;base64&quot; | &quot;binary&quot; | &quot;hex&quot; | &quot;ucs2&quot; | &quot;ucs-2&quot; | &quot;utf16le&quot; | &quot;utf-16le&quot; | &quot;utf-8&quot; | &quot;utf8&quot; | &quot;latin1&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>指定写入文件的字符编码</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: WriteFileFailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### WriteFileFailCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail no such file or directory, open ${filePath}': 指定的 filePath 所在目录不存在;<br />- 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有写权限;<br />- 'fail the maximum size of the file storage limit is exceeded': 存储空间不足;</td>
    </tr>
  </tbody>
</table>

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
