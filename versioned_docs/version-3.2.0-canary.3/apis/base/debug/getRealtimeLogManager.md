---
title: Taro.getRealtimeLogManager()
sidebar_label: getRealtimeLogManager
---

获取实时日志管理器对象。

## 类型

```tsx
() => RealtimeLogManager
```

## 参数

## 示例代码

```tsx
const logger = Taro.getRealtimeLogManager()
logger.info({str: 'hello world'}, 'info log', 100, [1, 2, 3])
logger.error({str: 'hello world'}, 'error log', 100, [1, 2, 3])
logger.warn({str: 'hello world'}, 'warn log', 100, [1, 2, 3])
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getRealtimeLogManager | ✔️ |  |  |
