---
title: Taro.getRealtimeLogManager()
sidebar_label: getRealtimeLogManager
---

Obtains the real-time log manager object.

## Type

```tsx
() => RealtimeLogManager
```

## Parameters

## Sample Code

```tsx
const logger = Taro.getRealtimeLogManager()
logger.info({str: 'hello world'}, 'info log', 100, [1, 2, 3])
logger.error({str: 'hello world'}, 'error log', 100, [1, 2, 3])
logger.warn({str: 'hello world'}, 'warn log', 100, [1, 2, 3])
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getRealtimeLogManager | ✔️ |  |  |
