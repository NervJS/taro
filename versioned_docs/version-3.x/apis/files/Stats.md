---
title: Stats
sidebar_label: Stats
---

描述文件状态的对象

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/Stats.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| mode | `string` | 文件的类型和存取的权限，对应 POSIX stat.st_mode |
| size | `number` | 文件大小，单位：B，对应 POSIX stat.st_size |
| lastAccessedTime | `number` | 文件最近一次被存取或被执行的时间，UNIX 时间戳，对应 POSIX stat.st_atime |
| lastModifiedTime | `number` | 文件最后一次被修改的时间，UNIX 时间戳，对应 POSIX stat.st_mtime |

### isDirectory

判断当前文件是否一个目录

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/Stats.isDirectory.html)

```tsx
() => boolean
```

### isFile

判断当前文件是否一个普通文件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/Stats.isFile.html)

```tsx
() => boolean
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Stats | ✔️ |  |  |
| Stats.isDirectory | ✔️ |  |  |
| Stats.isFile | ✔️ |  |  |
