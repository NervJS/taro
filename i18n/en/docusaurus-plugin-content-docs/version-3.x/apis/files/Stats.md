---
title: Stats
sidebar_label: Stats
---

Describes the status of a file.

## Methods

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
      <td>lastAccessedTime</td>
      <td><code>number</code></td>
      <td>The time when the file was last accessed or executed, in the UNIX timestamp format, corresponding to POSIX stat.st_atime.</td>
    </tr>
    <tr>
      <td>lastModifiedTime</td>
      <td><code>number</code></td>
      <td>The time when the file was last modified, in the UNIX timestamp format, corresponding to POSIX stat.st_mtime.</td>
    </tr>
    <tr>
      <td>mode</td>
      <td><code>string</code></td>
      <td>File type and access permission, corresponding to POSIX stat.st_mode.</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>File size in bytes, corresponding to POSIX stat.st_size.</td>
    </tr>
  </tbody>
</table>

### isDirectory

Determines whether the current file is a directory.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/Stats.isDirectory.html)

```tsx
() => boolean
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Stats.isDirectory | ✔️ |  |  |

### isFile

Determines whether the current file is a normal file.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/file/Stats.isFile.html)

```tsx
() => boolean
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Stats.isFile | ✔️ |  |  |

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Stats.isDirectory | ✔️ |  |  |
| Stats.isFile | ✔️ |  |  |
