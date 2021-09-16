---
title: FileSystemManager
sidebar_label: FileSystemManager
---

File Manager

## Methods

### readdirSync

The synchronous version of `FileSystemManager.readdir`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.readdirSync.html)

```tsx
(dirPath: string) => string[]
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dirPath</td>
      <td><code>string</code></td>
      <td>Path to the directory to be read</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.readdirSync | ✔️ |  |  |

### access

Determines whether a file/directory exists.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.access.html)

```tsx
(option: AccessOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>AccessOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.access | ✔️ |  |  |

### accessSync

The synchronous version of `FileSystemManager.access`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.accessSync.html)

```tsx
(path: string) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td>Path to the file/directory of which you want to determine the existence</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.accessSync | ✔️ |  |  |

### appendFile

Appends content at the end of a file.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.appendFile.html)

```tsx
(option: AppendFileOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>AppendFileOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.appendFile | ✔️ |  |  |

### appendFileSync

The synchronous version of `FileSystemManager.appendFile`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.appendFileSync.html)

```tsx
(filePath: string, data: string | ArrayBuffer, encoding?: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "ucs-2" | "utf16le" | "utf-16le" | "utf-8" | "utf8" | "latin1") => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>Path to the file to which you want to append content</td>
    </tr>
    <tr>
      <td>data</td>
      <td><code>string | ArrayBuffer</code></td>
      <td>Text or binary data to be appended</td>
    </tr>
    <tr>
      <td>encoding</td>
      <td><code>&quot;ascii&quot; | &quot;base64&quot; | &quot;binary&quot; | &quot;hex&quot; | &quot;ucs2&quot; | &quot;ucs-2&quot; | &quot;utf16le&quot; | &quot;utf-16le&quot; | &quot;utf-8&quot; | &quot;utf8&quot; | &quot;latin1&quot;</code></td>
      <td>Specifies the character encoding of the written file</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.appendFileSync | ✔️ |  |  |

### copyFile

Copies files.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.copyFile.html)

```tsx
(option: CopyFileOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>CopyFileOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.copyFile | ✔️ |  |  |

### copyFileSync

The synchronous version of `FileSystemManager.copyFile`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.copyFileSync.html)

```tsx
(srcPath: string, destPath: string) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>srcPath</td>
      <td><code>string</code></td>
      <td>The path to the source file, which can only be a normal file</td>
    </tr>
    <tr>
      <td>destPath</td>
      <td><code>string</code></td>
      <td>The path to the target file</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.copyFileSync | ✔️ |  |  |

### getFileInfo

Gets the information of local temporary files or local cache files under the Mini Program.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.getFileInfo.html)

```tsx
(option: getFileInfoOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>getFileInfoOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.getFileInfo | ✔️ |  |  |

### getSavedFileList

Gets the list of local cache files saved under the Mini Program.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.getSavedFileList.html)

```tsx
(option?: getSavedFileListOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>getSavedFileListOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.getSavedFileList | ✔️ |  |  |

### mkdir

Creates a directory.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.mkdir.html)

```tsx
(option: MkdirOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>MkdirOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.mkdir | ✔️ |  |  |

### mkdirSync

The synchronous version of `FileSystemManager.mkdir`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.mkdirSync.html)

```tsx
(dirPath: string, recursive?: boolean) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dirPath</td>
      <td><code>string</code></td>
      <td>Path to the created directory</td>
    </tr>
    <tr>
      <td>recursive</td>
      <td><code>boolean</code></td>
      <td>Indicates whether to create the directory after recursively creating the upper-layer directory. If the upper-layer directory already exists, do not create it. If dirPath is a/b/c/d and "recursive" is true, directory a will be created, and then directory b will be created under directory a, and so on, until directory d under directory a/b/c is created.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.mkdirSync | ✔️ |  |  |

### readFile

Reads local file content.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.readFile.html)

```tsx
(option: ReadFileOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>ReadFileOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.readFile | ✔️ |  |  |

### readdir

Reads the list of files in the directory.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.readdir.html)

```tsx
(option: ReaddirOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>ReaddirOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.readdir | ✔️ |  |  |

### removeSavedFile

Deletes the local cache files saved under the Mini Program.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.removeSavedFile.html)

```tsx
(option: RemoveSavedFileOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>RemoveSavedFileOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.removeSavedFile | ✔️ |  |  |

### rename

Renames a file, and moves it from oldPath to newPath.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.rename.html)

```tsx
(option: RenameOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>RenameOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.rename | ✔️ |  |  |

### renameSync

The synchronous version of `FileSystemManager.rename`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.renameSync.html)

```tsx
(oldPath: string, newPath: string) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>oldPath</td>
      <td><code>string</code></td>
      <td>The path to the source file, which can be a normal file or directory</td>
    </tr>
    <tr>
      <td>newPath</td>
      <td><code>string</code></td>
      <td>New file path</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.renameSync | ✔️ |  |  |

### rmdir

Deletes a directory.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.rmdir.html)

```tsx
(option: RmdirOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>RmdirOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.rmdir | ✔️ |  |  |

### rmdirSync

The synchronous version of `FileSystemManager.rmdir`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.rmdirSync.html)

```tsx
(dirPath: string, recursive?: boolean) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dirPath</td>
      <td><code>string</code></td>
      <td>The path to the directory to be deleted.</td>
    </tr>
    <tr>
      <td>recursive</td>
      <td><code>boolean</code></td>
      <td>Indicates whether to recursively delete the directory. If the value is true, the directory and all subdirectories and files under the directory are deleted.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.rmdirSync | ✔️ |  |  |

### saveFile

Saves temporary files to the local device. This API moves temporary files, so tempFilePath will not be available after the API is successfully called.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.saveFile.html)

```tsx
(option: SaveFileOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>SaveFileOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.saveFile | ✔️ |  |  |

### stat

Gets the Stats object of the file.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.stat.html)

```tsx
(option: StatOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>StatOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.stat |  |  |  |

### unlink

Deletes files

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.unlink.html)

```tsx
(option: UnlinkOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>UnlinkOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.unlink | ✔️ |  |  |

### unlinkSync

The synchronous version of `FileSystemManager.unlink`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.unlinkSync.html)

```tsx
(filePath: string) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>Path to the file to be deleted</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.unlinkSync | ✔️ |  |  |

### unzip

Unzips files

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.unzip.html)

```tsx
(option: UnzipOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>UnzipOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.unzip | ✔️ |  |  |

### writeFile

Writes a file

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.writeFile.html)

```tsx
(option: WriteFileOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>WriteFileOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.writeFile | ✔️ |  |  |

### writeFileSync

The synchronous version of `FileSystemManager.writeFile`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.writeFileSync.html)

```tsx
(filePath: string, data: string | ArrayBuffer, encoding?: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "ucs-2" | "utf16le" | "utf-16le" | "utf-8" | "utf8" | "latin1") => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>Path to the file into which you want to write data</td>
    </tr>
    <tr>
      <td>data</td>
      <td><code>string | ArrayBuffer</code></td>
      <td>Text or binary data to be written</td>
    </tr>
    <tr>
      <td>encoding</td>
      <td><code>&quot;ascii&quot; | &quot;base64&quot; | &quot;binary&quot; | &quot;hex&quot; | &quot;ucs2&quot; | &quot;ucs-2&quot; | &quot;utf16le&quot; | &quot;utf-16le&quot; | &quot;utf-8&quot; | &quot;utf8&quot; | &quot;latin1&quot;</code></td>
      <td>Specifies the character encoding of the written file</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.writeFileSync | ✔️ |  |  |

### statSync

The synchronous version of `FileSystemManager.stat`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.statSync.html)

```tsx
(path: string, recursive?: boolean) => Stats | Record<string, any>
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td>The file/directory path.</td>
    </tr>
    <tr>
      <td>recursive</td>
      <td><code>boolean</code></td>
      <td>Indicates whether to recursively get the Stats information of each file under the directory.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.statSync | ✔️ |  |  |

### saveFileSync

The synchronous version of `FileSystemManager.saveFile`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.saveFileSync.html)

```tsx
(tempFilePath: string, filePath?: string) => number
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td>Path to the temporarily stored files</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>Path to save the files</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.saveFileSync | ✔️ |  |  |

### readFileSync

The synchronous version of `FileSystemManager.readFile`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/FileSystemManager.readFileSync.html)

```tsx
(filePath: string, encoding?: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "ucs-2" | "utf16le" | "utf-16le" | "utf-8" | "utf8" | "latin1") => string | ArrayBuffer
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>The path to the file to be read.</td>
    </tr>
    <tr>
      <td>encoding</td>
      <td><code>&quot;ascii&quot; | &quot;base64&quot; | &quot;binary&quot; | &quot;hex&quot; | &quot;ucs2&quot; | &quot;ucs-2&quot; | &quot;utf16le&quot; | &quot;utf-16le&quot; | &quot;utf-8&quot; | &quot;utf8&quot; | &quot;latin1&quot;</code></td>
      <td>Specifies the character encoding of the read file. If encoding is not specified, the binary content of the file is read in ArrayBuffer format.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FileSystemManager.readFileSync | ✔️ |  |  |

## Parameters

### encoding

Valid values of encoding

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
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
      <td>Read in little endian</td>
    </tr>
    <tr>
      <td>ucs-2</td>
      <td>Read in little endian</td>
    </tr>
    <tr>
      <td>utf16le</td>
      <td>Read in little endian</td>
    </tr>
    <tr>
      <td>utf-16le</td>
      <td>Read in little endian</td>
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
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Path to the file/directory of which you want to determine the existence</td>
    </tr>
   <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### AccessFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message<br /><br />Valid values: <br />- 'fail no such file or directory path': File/directory does not exist;</td>
    </tr>
  </tbody>
</table>

### AppendFileOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td><code>string | ArrayBuffer</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Text or binary data to be appended</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Path to the file to which you want to append content</td>
    </tr>
    <tr>
      <td>encoding</td>
      <td><code>&quot;ascii&quot; | &quot;base64&quot; | &quot;binary&quot; | &quot;hex&quot; | &quot;ucs2&quot; | &quot;ucs-2&quot; | &quot;utf16le&quot; | &quot;utf-16le&quot; | &quot;utf-8&quot; | &quot;utf8&quot; | &quot;latin1&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the character encoding of the written file</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### AppendFileFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message
        <br /><br />
        Valid values:
        <br />
        - 'fail no such file or directory, open filePath': File with the specified filePath does not exist;<br />
        - 'fail illegal operation on a directory, open &quot;filePath&quot;': The specified filePath is an existing directory;<br />
        - 'fail permission denied, open dirPath': No write permission on the specified filePath;<br />
        - 'fail sdcard not mounted': The SD card is not mounted;
      </td>
    </tr>
  </tbody>
</table>

### CopyFileOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>destPath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The path to the target file</td>
    </tr>
    <tr>
      <td>srcPath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The path to the source file, which can only be a normal file</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### CopyFileFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message<br /><br />Valid values: <br />
      - 'fail permission denied, copyFile srcPath -&gt; destPath': No write permission on the specified target file path;<br />
      - 'fail no such file or directory, copyFile srcPath -&gt;destPath': The source file does not exist, or the upper-layer directory of the target file path does not exist;<br />
      - 'fail the maximum size of the file storage limit is exceeded': Insufficient storage space;</td>
    </tr>
  </tbody>
</table>

### getFileInfoOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Path to the files to be read</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### GetFileInfoFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message<br /><br />Valid values:<br />- 'fail file not exist': No file found with the specified filePath;</td>
    </tr>
  </tbody>
</table>

### GetFileInfoSuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>File size in bytes</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### getSavedFileListOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### GetSavedFileListSuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>fileList</td>
      <td><code>GetSavedFileListSuccessCallbackResultFileItem[]</code></td>
      <td>File array</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### GetSavedFileListSuccessCallbackResultFileItem

res.fileList is composed as follows

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>createTime</td>
      <td><code>number</code></td>
      <td>The timestamp when the file was saved, which is defined as the number of seconds that have elapsed since 1970/01/01 08:00:00 to the current time</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>Local path</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>Local file size in bytes</td>
    </tr>
  </tbody>
</table>

### MkdirOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dirPath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The path to the created directory</td>
    </tr>
    <tr>
      <td>recursive</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to create the directory after recursively creating the upper-layer directory. If the upper-layer directory already exists, do not create it. If dirPath is a/b/c/d and "recursive" is true, directory a will be created, and then directory b will be created under directory a, and so on, until directory d under directory a/b/c is created.</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### MkdirFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message<br /><br />Valid value: <br />- 'fail no such file or directory dirPath': The upper-layer directory does not exist;<br />- 'fail permission denied, open dirPath': No write permission on the specified filePath;<br />- 'fail file already exists dirPath': A file or directory with the same name already exists;</td>
    </tr>
  </tbody>
</table>

### ReadFileOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Path to the file to be read</td>
    </tr>
    <tr>
      <td>encoding</td>
      <td><code>&quot;ascii&quot; | &quot;base64&quot; | &quot;binary&quot; | &quot;hex&quot; | &quot;ucs2&quot; | &quot;ucs-2&quot; | &quot;utf16le&quot; | &quot;utf-16le&quot; | &quot;utf-8&quot; | &quot;utf8&quot; | &quot;latin1&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the character encoding of the read file. If encoding is not specified, the binary content of the file is read in ArrayBuffer format.</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### ReadFileFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message.<br /><br />Valid value: <br />- 'fail no such file or directory, open filePath': The directory where the specified filePath is located does not exist;<br />- 'fail permission denied, open dirPath': No read permission on the specified filePath;</td>
    </tr>
  </tbody>
</table>

### ReaddirOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dirPath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Path to the directory to be read</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### ReaddirFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message.<br /><br />Valid values: <br />- 'fail no such file or directory dirPath': Directory does not exist;<br />- 'fail not a directory dirPath': dirPath is not a directory;<br />- 'fail permission denied, open dirPath': No read permission on the specified filePath;</td>
    </tr>
  </tbody>
</table>

### ReaddirSuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>files</td>
      <td><code>string[]</code></td>
      <td>The array of file names in the specified directory.</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### RemoveSavedFileOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Path to the file to be deleted</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### RemoveSavedFileFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message.<br /><br />Valid values: <br />- 'fail file not exist': No file found with the specified tempFilePath;</td>
    </tr>
  </tbody>
</table>

### RenameOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>newPath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The new path to the file</td>
    </tr>
    <tr>
      <td>oldPath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The old path to the file, which can be a normal file or directory</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### RenameFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message.<br /><br />Valid values: <br />- 'fail permission denied, rename oldPath -&gt; newPath': No write permission on the specified source file or target file;<br />- 'fail no such file or directory, rename oldPath -&gt; newPath': The source file does not exist, or the upper-layer directory of the target file path does not exist;</td>
    </tr>
  </tbody>
</table>

### RmdirOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dirPath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The path to the directory to be deleted.</td>
    </tr>
    <tr>
      <td>recursive</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to recursively delete the directory. If the value is true, the directory and all subdirectories and files under the directory are deleted.</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### RmdirFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message.<br /><br />Valid values: <br />- 'fail no such file or directory dirPath': Directory does not exist;<br />- 'fail directory not empty': Directory is not empty;<br />- 'fail permission denied, open dirPath': No write permission on the specified dirPath;</td>
    </tr>
  </tbody>
</table>

### SaveFileOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Path to the temporarily stored files</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Path to save the files</td>
    </tr>
   <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### SaveFileFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message<br /><br />Valid values: <br />- 'fail tempFilePath file not exist': No file found with the specified tempFilePath;<br />- 'fail permission denied, open &quot;filePath&quot;': No write permission on the specified filePath;<br />- 'fail no such file or directory &quot;dirPath&quot;': The upper-layer directory does not exist;<br />- 'fail the maximum size of the file storage limit is exceeded': Insufficient storage space;</td>
    </tr>
  </tbody>
</table>

### SaveFileSuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>savedFilePath</td>
      <td><code>number</code></td>
      <td>Path to the saved file</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### StatOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The file/directory path.</td>
    </tr>
    <tr>
      <td>recursive</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to recursively get the Stats information of each file under the directory.</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### StatFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message.<br /><br />Valid values: <br />- 'fail permission denied, open path': No read permission on the specified path;<br />- 'fail no such file or directory path': File does not exist;</td>
    </tr>
  </tbody>
</table>

### StatSuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
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
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### UnlinkOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Path to the file to be deleted</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### UnlinkFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message.<br /><br />Valid values: <br />- 'fail permission denied, open path': No read permission on the specified path;<br />- 'fail no such file or directory path': File does not exist;<br />- 'fail operation not permitted, unlink filePath': The passed filePath is a directory;</td>
    </tr>
  </tbody>
</table>

### UnzipOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>targetPath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The path to the target directory</td>
    </tr>
    <tr>
      <td>zipFilePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The path to the source file, which can only be a zip file</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### UnzipFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message.<br /><br />Valid values: <br />- 'fail permission denied, unzip zipFilePath -&gt; destPath': No write permission on the specified target file path;<br />- 'fail no such file or directory, unzip zipFilePath -&gt; &quot;destPath': The source file does not exist, or the upper-layer directory of the target file path does not exist;</td>
    </tr>
  </tbody>
</table>

### WriteFileOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td><code>string | ArrayBuffer</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Text or binary data to be written</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Path to the file into which you want to write data</td>
    </tr>
    <tr>
      <td>encoding</td>
      <td><code>&quot;ascii&quot; | &quot;base64&quot; | &quot;binary&quot; | &quot;hex&quot; | &quot;ucs2&quot; | &quot;ucs-2&quot; | &quot;utf16le&quot; | &quot;utf-16le&quot; | &quot;utf-8&quot; | &quot;utf8&quot; | &quot;latin1&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the character encoding of the written file</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### WriteFileFailCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message.<br /><br />Valid valus: <br />- 'fail no such file or directory, open filePath': The directory where the specified filePath is located does not exist;<br />- 'fail permission denied, open dirPath': No write permission on the specified filePath;<br />- 'fail the maximum size of the file storage limit is exceeded': Insufficient storage space;</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
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
