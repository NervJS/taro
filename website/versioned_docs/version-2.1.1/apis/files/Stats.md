---
title: Stats
sidebar_label: Stats
id: version-2.1.1-Stats
original_id: Stats
---

描述文件状态的对象

## 方法

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
      <td>lastAccessedTime</td>
      <td><code>number</code></td>
      <td>文件最近一次被存取或被执行的时间，UNIX 时间戳，对应 POSIX stat.st_atime</td>
    </tr>
    <tr>
      <td>lastModifiedTime</td>
      <td><code>number</code></td>
      <td>文件最后一次被修改的时间，UNIX 时间戳，对应 POSIX stat.st_mtime</td>
    </tr>
    <tr>
      <td>mode</td>
      <td><code>string</code></td>
      <td>文件的类型和存取的权限，对应 POSIX stat.st_mode</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>文件大小，单位：B，对应 POSIX stat.st_size</td>
    </tr>
  </tbody>
</table>

### isDirectory

判断当前文件是否一个目录

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/Stats.isDirectory.html)

```tsx
() => boolean
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Stats.isDirectory | ✔️ |  |  |

### isFile

判断当前文件是否一个普通文件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/Stats.isFile.html)

```tsx
() => boolean
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Stats.isFile | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Stats.isDirectory | ✔️ |  |  |
| Stats.isFile | ✔️ |  |  |
