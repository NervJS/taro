---
title: Taro.preload(options)
sidebar_label: preload
---

跳转预加载 API

## 类型

```tsx
{ (options: Record<string, any>): any; (key: string, value: any): any; }
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| options | `Record<string, any>` | 预加载的数据<br />param: options 预加载的数据 |

## 示例代码

### 示例 1

```tsx
Taro.preload({ key: 'value' })
```

### 示例 2

```tsx
Taro.preload('key', 'value')
```
